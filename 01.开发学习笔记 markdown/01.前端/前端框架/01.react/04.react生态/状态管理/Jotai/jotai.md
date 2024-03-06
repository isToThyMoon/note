
[jotai](https://jotai.org/)的目标是让组件间的状态管理不依赖组件层级关系，不同于redux，不用状态提升和中心化数据仓库，而是通过一个中间的weakMap统一协调处理。实现数据的原子化和组件数据自治。

三个特性：
1. primitive：最重要的概念就是primitive，原子化（元数据编程 ）。类似useState方式分割状态，达到一种组件自治的目的。
2. flexible：可以组合多个Atom（原子状态）派生新的Atom。
3. subscription-based reactivity（订阅式响应）或者说 fine-grained reactivity（细粒度响应）：更新对应的 Atom 只会重新渲染订阅了这个 Atom 的组件，并不会像 Context 那样导致整个父组件重新渲染，所以可以做到精确渲染。（在Provider-Less mode推出之前，Jotai的atom存放在React Context中，利用use-context-selector阻断Provider触发组件更新来避免重复渲染问题。）jotai作者也贡献了react-tracked和use-context-selector库，他专门研究react的rerender问题，use-context-selector就是解决context重渲染的。

# 实现原理
atom 里，每次调用会针对一个值，生成一个配置对象。结合 weakMap 建立一个引用关系，useAtom 内部还是依赖 useState 实现的，不同的是在定义值的时候，先使用 weakMap 拿到引用的 atom 的值，然后把相应的 setState 捆绑到对应的 weakMap 上。在修改值的时候，会先修改 weakMap 上的引用值，然后把捆绑上的所有 setState 循环执行一遍。

# 官网介绍（introduction）：
Jotai：Primitive and flexible state management for React. It takes a bottom-up approach with an atomic model inspired by Recoil.

No extra re-renders, state resides within React, and you get the full benefits from suspense and concurrent features.
It’s scalable from a simple React.useState replacement to a large-scale application with complex requirements.
没有多余的重新渲染，状态存在react组件树中（强依赖react），有效利用react的suspense和concurrent特性。
可以作为简单react项目useState的替代，也可以构建复杂要求的大型react应用。

Jotai takes a bottom-up approach to React state management with an atomic model inspired by Recoil. One can build state by combining atoms and renders are optimized based on atom dependency. This solves the extra re-render issue of React context and eliminates the need for the memoization technique.
受 Recoil 的原子模型启发，采用自下而上的构建方法进行 React 状态管理。可以通过组合atoms来构建状态，并且渲染会被atom依赖所优化（订阅式响应），解决React context中的多余渲染问题，并且不用再使用memoization技术（来优化渲染）。

官方认为的优点（features）：
Minimal API
TypeScript oriented
Tiny bundle size (3kb)
Many extra utils and official integrations
Supports Next.js and React Native


# basics

## 思想（concepts）

## 原子化（primitives）

### 原子化解决什么问题：

React Hooks的提出使得state的拆分和逻辑共享变得更容易，但useState + useContext对于多个store仍需要维护多个Context Provider。因为当context值改变，所有消费该context的组件都会重新渲染，即使是组件仅用到了context的一部分，容易导致不必要的无用渲染，造成性能损失。（比如react-redux v6完全基于Context API而导致性能大幅下降，v7又回退到之前的内部订阅方案）context更适合放类似主题这种变化不大的全局数据，而并不适合存放频繁更新的复杂状态集合。

以往Context API和Redux这类中心化状态管理方案中，所有状态都是一个对象自顶向下构建而成的。但在Recoil，复杂状态集合拆分成一个个最小粒度的atom，每个atom可以理解为Redux Store中的一部分，不过是渐进式（可以按需创建）和分布式（可以在任何地方创建）的。
atom通过hooks和selector纯函数来组合、创建、更新。只有使用到该atom的组件才会在atom更新时触发re-render。因此在原子式中，无需定义模版代码和大幅改动组件设计，直接沿用类似于useState的API就能实现高性能的状态共享和代码分割。

虽然Recoil宣称的高性能原子式状态管理非常诱人，但不能忽视的是Reocil本身设计相当复杂，为了适用于更复杂的大型场景，Recoil拥有高达数十个APIs，上手成本不低。而且为了规避Context API的问题，Reocil使用了useRef API来存放状态并在内部管理状态订阅和更新，严格意义上状态也并不算在React Tree中，同样面临着外部状态的Concurrent Mode兼容性问题。
但Context API这种能在React Tree中很方便地共享状态并且天然兼容未来Concurrent Mode的方案还是很香的，在意识到性能问题后React社区也提出[useContextSelector](https://github.com/reactjs/rfcs/pull/119)提案和社区实现方案[use-context-selector](https://github.com/dai-shi/use-context-selector) (作者同样也是Daishi Kato)，通过一个额外的selector来局部订阅Context的数据。

*use-context-selector 早期是在creatContext中回传 changedBits=0 这个没有出现在API文档的特性来阻断Provider触发组件更新。*

那么有没有一种方案是兼顾原子式和Concurrent Mode呢，下面我们来介绍下更轻量，更灵活，为解决Context API而生的Jotai：

既然主打的是轻量级原子式状态管理，Jotai打包体积远小于Recoil（Gziped后2.8KB vs 20.4KB）。并且核心API仅有3个：atom，Provider和useAtom（扩展能力由jotai/utils和jotai/devtools提供）

Jotai中的atom不需要Recoil中的string key，而是用的Object Reference。使用上更直观方便，但也损失了debug上直接利用string key的便利。

在Provider-Less mode推出之前，Jotai的atom存放在React Context中，利用use-context-selector来避免重复渲染问题。


# 基础使用
创建原子并在组件中使用：
```js
import { atom } from 'jotai'
// 定义Atom，atom: 原子的意思。一个Atom代表一个状态
// 定义后并没有与原子关联的值。只有通过 useAtom 使用后的原子，初始值才会存储在状态中
const countAtom = atom(0)
// Ts的使用和 React.useState 的方式相同，基础类型可以不定义类型
const countryAtom = atom<string>('Japan')
const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])
const mangaAtom = atom({ 'Dragon Ball': 1984, 'One Piece': 1997, Naruto: 1999 })


import { useAtom } from 'jotai'

function Counter() {
// 使用Atom，返回值是一个数组
// 数组第一个值是 Atom 存储的值，第二个值是更新 Atom 值的函数
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      {count}
      <button onClick={() => setCount(c => c + 1)}>one up</button>
    </div>
    )
}
```

通过 atom 方法的调用结果，可以通过 useAtom 来拿到相应的状态和修改状态的方法。并且状态都是同步更新的。

除了这两个 hook，官方还提供了 useAtomValue 和 useSetAtom 的便于取值和改值的 hook 来辅助处理。

## 创建派生的原子状态
主要有三种派生atom，只读 只写 可读写。其实可以看成一种。
第一个参数是读函数，第二个参数是写函数，控制这两个参数实现三种派生atom读写权限。
注意派生出的状态也会随着原状态的变动而变动。
```js
const doubledCountAtom = atom((get) => get(countAtom) * 2)

function DoubleCounter() {
  const [doubledCount] = useAtom(doubledCountAtom)
  return <h2>{doubledCount}</h2>
}
```
第一个参数为读取函数，派生出一个只读原子状态。get允许在atom内部任意互相取值。

从多个atom中派生：
```js
const count1 = atom(1)
const count2 = atom(2)
const count3 = atom(3)

const sum = atom((get) => get(count1) + get(count2) + get(count3))
```

Or if you like fp patterns ...
```js
const atoms = [count1, count2, count3, ...otherAtoms]
const sum = atom((get) => atoms.map(get).reduce((acc, count) => acc + count))
```

如果只是在第一次 get 时需要依赖其他状态派生的话，后面还是自己去 set，可以使用更便捷的工具方法：
```
import { atomWithDefault } from "jotai/utils";

const msg = atom("");
const UpperMsg = atomWithDefault((get) => get(msg).toUpperCase());

```

如果需要可写。需要在get之后定义writable。

```js
const msg = atom("");

const UpperMsg = atom(
  (get) => get(msg).toUpperCase(),
  (get, set, newValue) => {
    set(msg, newValue);
  }
);
```
write函数入参get 和set，get返回atom中的一个当前原子状态，set会更新一个原子状态。第三个参数是调用更新函数时的入参。
你也可以atom的读取函数置为null来定义一个只写状态。
派生状态无法直接set自身，会提示：`atom not writable`
在派生状态中write函数set其他派生状态，会调用其他派生状态的write函数。

## Provider
Provider 是为一个组件子树提供状态。多个 Provider 可以用于多个子树，甚至可以嵌套。这就像 React Context 一样工作。
在不提供Provider的情况下，会使用默认状态，我们可以不提供他来包裹使用Atom的组件。
```js
<Provider
   initialValues={[
     [textAtom, 'initval'], // 给 textAtom 原子提供初始值
   ]}
>
   <Input />
   <CharCount />
   <Uppercase />
</Provider>
```

使用 Provider 带来的效果
1. 为每个组件树提供不同的状态
2. 包含了一些调试信息
3. 接受原子的初始值initialValues

# 异步
`const userInfo = () => fetch("/api/userInfo");`

atom 传入的是一个 Promise 函数时，它会等这个函数执行完，然后变更状态。等价写法还可以这么做：
```js
const userInfoAtom = atom(async () => {
  const data = await fetch("/api/userInfo");
  return data;
});
```
如果有多个异步的 atom，可以支持所有的异步 atom 取值完成

```
import { waitForAll } from "jotai/utils";

const dogsAtom = atom(async (get) => {
  const response = await fetch("/dogs");
  return await response.json();
});

const catsAtom = atom(async (get) => {
  const response = await fetch("/cats");
  return await response.json();
});

const App = () => {
  const [dogs, cats] = useAtomValue(waitForAll([dogsAtom, catsAtom]));
};
```

## Async actions
Just make the write function an async function and call set when you're ready.

const fetchCountAtom = atom(
  (get) => get(countAtom),
  async (_get, set, url) => {
    const response = await fetch(url)
    set(countAtom, (await response.json()).count)
  }
)

function Controls() {
  const [count, compute] = useAtom(fetchCountAtom)
  return <button onClick={() => compute("http://count.host.com")}>compute</button>
  
## 和suspense结合
jotai 在支持异步的 atom 时，会在异步处理期间，自动触发 React 的 Suspense 加载机制，如下：
```js
import { atom, useAtomValue } from "jotai";

const userInfoAtom = atom(async () => {
  const data = await fetch("/api/userInfo");
  return data;
});

const App = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>展示用户数据</div>
    </Suspense>
  );
};
```

上例中， userInfoAtom 是一个异步行为，在 userInfo 拿到请求后的值之前，就会一直展示 fallback 里的元素，更加智能化。
如果希望手动的去管理这种状态，可以使用 jotai/utils 提供的 loadable 来处理
```js
import { loadable } from "jotai/utils"

const asyncAtom = atom(async (get) => ...)
const loadableAtom = loadable(asyncAtom)

// 不需要再用 <Suspense> 来包裹了
const Component = () => {
  const value = useAtom(loadableAtom)

  if (value.state === 'hasError') return <Text>{value.error}</Text>

  if (value.state === 'loading') {
    return <Text>Loading...</Text>
  }

  console.log(value.data) // 最终数据
  return <Text>Value: {value.data}</Text>
}
```

# extra utilities
The Jotai package also includes a jotai/utils bundle. 

These functions add support for persisting an atom’s state in localStorage (or URL hash), hydrating an atom’s state during server-side rendering, creating an atom with a set function including Redux-like reducers and action types, and much more!

## 持久化
在官方提供的 jotai/utils 里，提供了相应持久化的处理方案，例如存到 localStorage 里的 hook
```js
import { atomWithStorage } from "jotai/utils";
const msg = atomWithStorage("msg", "");
```

# Third-party integrations
There are also additional bundles for each official third-party integration. Immer, Optics, Query, XState, Valtio, Zustand, Redux, and URQL.

Some integrations provide new atom types with alternate set functions such as atomWithImmer while others provide new atom types with two-way data binding with other state management libraries such as atomWithStore which is bound with a Redux store.

## reducer
```js
import { atom } from "jotai";
import { useReducerAtom } from "jotai/utils";

const countReducer = (prev, action) => {
  if (action.type === "inc") return prev + 1;
  if (action.type === "dec") return prev - 1;
  throw new Error("unknown action type");
};

const countAtom = atom(0);

const Counter = () => {
  const [count, dispatch] = useReducerAtom(countAtom, countReducer);
  return (
    <div>
      {count}
      <button onClick={() => dispatch({ type: "inc" })}>+1</button>
      <button onClick={() => dispatch({ type: "dec" })}>-1</button>
    </div>
  );
};
```
