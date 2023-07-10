# useCallback

之前说过，组件重复渲染的每一帧，变量都是独立的。
useCallback就是为了在多次渲染中记住某个函数。

useCallback 可以理解为将函数进行了缓存，它接收一个回调函数和一个依赖数组，只有当依赖数组中的值发生改变时，该回调函数才会更新。

```js
// 除非 `a` 或 `b` 改变，否则不会变
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
useEffect应用场景里，说到了 useCallback ，算是一个场景，我们都知道它可以用来缓存一个函数。

接下来另一个场景。

class组件我们知道，react中只要父组件 render 了，那么默认情况下就会触发子组件的 render，react提供了来避免这种重渲染的性能开销的一些方法：
React.PureComponent、React.memo ，shouldComponentUpdate()

一个例子：

```js
const Index = () => {
  const [count, setCount] = useState(0);

  const getList = (n) => {
    return Array.apply(Array, Array(n)).map((item, i) => ({
      id: i,
      name: "张三" + i
    }));
  };

  return (
    <>
      <Child getList={getList} />
      <button onClick={() => setCount(count + 1)}>count+1</button>
    </>
  );
};

const Child = ({ getList }) => {
  console.log("child-render");
  return (
    <>
      {getList(10).map((item) => (
        <div key={item.id}>
          id：{item.id}，name：{item.name}
        </div>
      ))}
    </>
  );
};
```
我们来尝试解读一下，当点击“count+1”按钮，发生了这样子的事：
**父组件render > 子组件render > 子组件输出 "child-render"

我们为了避免子组件做没必要的渲染，这里用了React.memo，如：

```js
// ...
const Child = React.memo(({ getList }) => {
  console.log("child-render");
  return (
    <>
      {getList(10).map((item) => (
        <div key={item.id}>
          id：{item.id}，name：{item.name}
        </div>
      ))}
    </>
  );
});
// ...
```

我们不假思索的认为，当我们点击“count+1”时，子组件不会再重渲染了。但现实是，还是依然会渲染，这是为什么呢？
因为React.memo只会对props做浅比较，也就是父组件重新render之后会传入不同引用的方法 getList，浅比较之后不相等，导致子组件还是依然会渲染。

这时候，useCallback 就可以上场了，它可以缓存一个函数，当依赖没有改变的时候，会一直返回同一个引用。如：

```
// ...
const getList = useCallback((n) => {
  return Array.apply(Array, Array(n)).map((item, i) => ({
    id: i,
    name: "张三" + i
  }));
}, []);
// ...
```

总结：如果子组件接受了一个方法作为属性，我们在使用 React.memo 这种避免子组件做没必要的渲染时候，就需要用 useCallback 进行配合，否则 React.memo 将无意义。

在子组件不需要父组件的值和函数的情况下，只需要使用memo函数包裹子组件即可
如果有函数传递给子组件，使用useCallback
缓存一个组件内的复杂计算逻辑需要返回值时，使用useMemo
如果有值传递给子组件，使用useMemo


# 特殊用法 useCallback当ref使用
```js
const measuredRef = useCallback(
    (node) => {
      if (node !== null) {
        console.log(count);
        window.performance.mark("node getBoundingClientReat start");
        console.log("width", node.getBoundingClientRect().width);
        window.performance.measure(
          "node getBoundingClientReat end",
          "node getBoundingClientReat start"
        );
      }
    },
    [count]
  );
  
  ......
  
  <span ref={measuredRef}>{String(count)}</span>
  
```

##  useCallback能解决deps问题吗？
建议在项目中尽量不要用 useCallback，大部分场景下，不仅没有提升性能，反而让代码可读性变的很差。

useCallback 可以记住函数，避免函数重复生成（只有当依赖项发生改变时才会重新生成并指向一个新的函数），这样函数在传递给子组件时，可以避免子组件重复渲染，提高性能。
```js
const someFunc = useCallback(()=> {
   doSomething();
}, []);

return <ExpensiveComponent func={someFunc} />
```

基于以上认知，很多同学（包括我自己）在写代码时，只要是个函数，都加个 useCallback，是么？

但我们要注意，提高性能还必须有另外一个条件，子组件必须使用了 shouldComponentUpdate 或者 React.memo 来忽略同样的参数重复渲染。

假如 ExpensiveComponent 组件只是一个普通组件，是没有任何用的。比如下面这样：
```js
const ExpensiveComponent = ({ func }) => {
  return (
    <div onClick={func}>
        hello
    </div>
  )
}
```

必须通过 React.memo 包裹 ExpensiveComponent，才会避免参数不变的情况下的重复渲染，提高性能。
```js
const ExpensiveComponent = React.memo(({ func }) => {
  return (
    <div onClick={func}>
        hello
    </div>
  )
})
```

所以，useCallback 是要和 shouldComponentUpdate/React.memo 配套使用的，你用对了吗？当然，我建议一般项目中不用考虑性能优化的问题，也就是不要使用 useCallback 了，除非有个别非常复杂的组件，单独使用即可。

但是假如是如下场景：一个购物车basket，一个字组件button，button点击调用basket的函数，即使这个函数用了useCallback，当购物车内物品数量变化时触发useCallback，函数的引用还是在不断变化，props变化，button还是每次都会重新渲染，没有解决大量渲染的问题。

### useCallback 让代码可读性变差
我看到过一些代码，使用 useCallback 后，大概长这样：
```js
const someFuncA = useCallback((d, g, x, y)=> {
   doSomething(a, b, c, d, g, x, y);
}, [a, b, c]);

const someFuncB = useCallback(()=> {
   someFuncA(d, g, x, y);
}, [someFuncA, d, g, x, y]);

useEffect(()=>{
  someFuncB();
}, [someFuncB]);
```
在上面的代码中，变量依赖一层一层传递，最终要判断具体哪些变量变化会触发 useEffect 执行，是一件很头疼的事情。
我期望不要用 useCallback，直接裸写函数就好：
```js
const someFuncA = (d, g, x, y)=> {
   doSomething(a, b, c, d, g, x, y);
};

const someFuncB = ()=> {
   someFuncA(d, g, x, y);
};

useEffect(()=>{
  someFuncB();
}, [...]);
```

在 useEffect 存在延迟调用的场景下，可能造成闭包问题，那通过咱们万能的方法就能解决：
```js
const someFuncA = (d, g, x, y)=> {
   doSomething(a, b, c, d, g, x, y);
};

const someFuncB = ()=> {
   someFuncA(d, g, x, y);
};

+ const someFuncBRef = useRef(someFuncB);
+ someFuncBRef.current = someFuncB;

useEffect(()=>{
+  setTimeout(()=>{
+    someFuncBRef.current();
+  }, 1000)
}, [...]);
```
对 useCallback 的建议就一句话：没事别用 useCallback。
相比未使用useCallback带来性能问题，真正麻烦的事useCallback带来的引用依赖问题。
（2022年5月最新rfc useEvent这个hook用来取代useCallback 无需deps 调用处理后的函数时内部所有变量为最新）

## useMemo 建议适当使用
useMemo相比较useCallback的实现，只多了一步invoke，`const nextValue = nextCreate();`
实际上useCallback可以看成是特殊版本的useMemo，专门用来处理函数。

相较于 useCallback 而言，useMemo 的收益是显而易见的。
```js
// 没有使用 useMemo
const memoizedValue = computeExpensiveValue(a, b);

// 使用 useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
如果没有使用 useMemo，computeExpensiveValue 会在每一次渲染的时候执行。如果使用了 useMemo，只有在 a 和 b 变化时，才会执行一次 computeExpensiveValue。

这笔账大家应该都会算，所以我建议 useMemo 可以适当使用。（计算的开销比较大时）
