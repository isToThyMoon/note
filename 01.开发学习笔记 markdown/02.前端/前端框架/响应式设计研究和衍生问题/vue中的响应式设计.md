# vue响应式
vue：基于代理收集依赖触发更新，数据必须是可变数据（通过随意修改对象属性并进行代理收集依赖并在修改时触发更新）。
vue通过Object.defineProperty(),vue3通过es6点Proxy来劫持对象的属性访问，从而实现对数据的监听和更新。是一种观察者模式的思想。订阅式响应。
当一个对象被传入组件实例的data选项中，vue3将它转化为一个Proxy对象，通过拦截对属性的访问和修改来实现响应式。当属性被访问时，Proxy对象触发get拦截器，收集依赖，当属性被修改时，Proxy对象触发set拦截器，通知依赖组件执行更新操作，重新渲染组件。
## vue2响应式
vue2中的响应式是使用观察者模式自动跟踪数据变化，自动更新组件。订阅式机制决定了它不仅知道哪些数据发生了更新，也知道这个数据更新了之后当前组件以及子组件的视图需不需要重新渲染。这是通过“依赖收集”实现的。
Vue的视图template会编译成render函数，
vue2中data数据对象（data/props/computed），使用 Object.defineProperty() 将每个属性都转换为 getter/setter。getter 用来收集依赖，setter 用来执行 notify，发布更新事件。每次调用各个组件的render函数时，通过getter，就能知道哪些数据被哪些组件的视图所依赖，下一次对这些数据赋值时，也就是调用setter，相应的视图就能触发重渲染，而无关的组件则不需要再次调用render函数，节省了开销。
vue的精准更新是如何做到的呢？
每个 Vue 组件实例都有一个对应的 watcher 实例，它控制着当前组件的视图更新，但是并不会掌管ChildComponent的更新。
在组件初次渲染（render）时，会记录组件用到了（调用 getter）哪些数据。
当数据发生改变时，会触发 setter 方法，并通知所有依赖这个数据的 watcher 实例，然后 watcher 实例调用对应组件的 render 方法，生成一颗新的 vdom 树，Vue 会将新生成的 vdom 树与上一次生成的 vdom 树进行比较（diff），来决定具体要更新哪些 dom。
watcher并不会掌管ChildComponent的更新。当组件更新到子组件的时候，会走patchVnode方法。
如果是普通的节点，就直接diff更新，patchVnode结束，并没有像常规思维中的那样去递归的更新子组件树。如果要是子组件（<child/>）那么在diff的过程只会对子组件的props，listenters等属性更新，！！而不会深入到组件内部进行更新。（重点！）这也就说明了，Vue 的组件更新确实是精确到组件本身的。

props传递给子组件的时候，子组件组件初始化阶段，会对props响应式处理，保存到了子组件的_props上，并且被定义成了响应式属性，而子组件的模板中对于 msg 的访问其实是被代理到 _props.msg 上去的，所以自然也能精确的收集到依赖，只要 ChildComponent 在模板里也读取了这个属性。
子组件对props的访问，props就拥有了子组件的render watcher（副作用函数收集到了自己的dep中）。父组件重新render的时候，重新计算子组件的props，触发了props的setting，所以子组件就重新render了。

有个特殊场景就是slot的更新：
假设我们有父组件parent-comp：

```jsx
<div>
  <slot-comp>
     <span>{{ msg }}</span>
  </slot-comp>
</div>
```
子组件 slot-comp：
```jsx
<div>
   <slot></slot>
</div>
```

这里的 msg 属性在进行依赖收集的时候，收集到的是 parent-comp 的渲染watcher。（至于为什么，你看一下它所在的渲染上下文就懂了。）
这个组件在更新的时候，遇到了一个子组件 slot-comp，按照 Vue 的精确更新策略来说，子组件是不会重新渲染的。
但是在源码内部，它做了一个判断，在执行 slot-comp 的 prepatch 这个hook的时候，会执行 updateChildComponent 逻辑，在这个函数内部会发现它有 slot 元素。
这里调用了 slot-comp 组件vm实例上的 `$forceUpdate`，那么它所触发的渲染watcher就是属于slot-comp的渲染watcher了。（官方文档：`vm.$forceUpdate`：迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。）
总结来说，这次 msg 的更新不光触发了 parent-comp 的重渲染，也进一步的触发了拥有slot的子组件 slot-comp 的重渲染。
它也只是触发了两层渲染，如果 slot-comp 内部又渲染了其他组件 slot-child，那么此时它是不会进行递归更新的。（只要 slot-child 组件不要再有 slot 了）。
似乎比起 React 的递归更新还是要好些的。

## vue3响应式
Vue3.0 使用 Proxy 作为响应式数据实现的核心，用 Proxy 返回一个代理对象，通过代理对象来收集依赖和触发更新。

对比react和vue，可以看出vue在响应式更新粒度上是比react要精确和细粒度的，虽然react优点是数据流清晰，vue可以任意修改对象属性来实现proxy依赖收集和精确更新，但vue遇到数据流问题时定位问题也是比reac要困难的，这是自由的代价。

那么react能用收集依赖的这套体系吗？不能，因为他们遵从Immutable的设计思想，永远不在原对象上修改属性，那么基于 Object.defineProperty 或 Proxy 的响应式依赖收集机制就无从下手了（你永远返回一个新的对象，我哪知道你修改了旧对象的哪部分？）
同时，由于没有响应式的收集依赖，React 只能递归的把所有子组件都重新 render一遍（产出jsx构建虚拟dom），然后再通过diff算法决定要更新哪部分的视图，这个递归的过程叫做 reconciler，听起来很酷，但是性能很灾难。




# vue中的属性拦截
Vue2 里的数据响应式其实是一个半完全体，它对于对象上新增属性无能为力，对于数组则需要拦截它的原型方法来实现响应式。

```js
const vm = new Vue({
  data() {
    return {
        a: 1,
        items: ['a', 'b', 'c']
    }
  }
})

vm.b = 2              // ❌  oops，没反应！
vm.items[1] = 'x'     // ❌  oops，没反应！
vm.items.length = 2   // ❌  oops，没反应！
```

于是 Vue2 又引入 $set 解决以上问题：

```jsx
// 对象上新增属性
vm.$set(vm.someObject,'b',2)    // vm.$set 实例方法是全局 Vue.set 方法的别名
Vue.set(vm.someObject, 'b', 2)  // 所以也可以这样写 
// 数组*
vm.$set(vm.items, indexOfItem, newValue) // 利用索引直接设置一个数组项时
vm.items.splice(newLength)               // 修改数组的长度
```

那么 Vue3 又是如何创建响应式数据的？

Vue3 中引入了 ref，reactive 来创建响应式数据：

```js
<template><h1>{{ title }}</h1>                 // 直接使用 title
  <h2>{{ data.author }}</h2>
  <h2>{{ age }}</h2>
</template>

<script>import { ref, reactive, toRefs } from "vue";

  export default {
    setup() {
      const title = ref("Hello, Vue 3!");
      const data = reactive({
        author: "sheben",
        age: "20"
      });
      const dataAsRefs = toRefs(data)
      const { age } = dataAsRefs

      setTimeout(() => {
        title.value = "New Title";   *// 使用 title.value 来修改其值*
      }, 5000);

      return { title, data };
    }
  };
</script>
```

- ref 的作用就是将一个原始数据类型转换成一个响应式数据，原始数据类型共有 7 个，分别是：String、Number、BigInt、Boolean、Symbol、Undefined、Null
    - 当 ref 作为渲染上下文 (从 setup() 中返回的对象) 上的 property 返回并可以在模板中被访问时，它将自动展开为内部值。不需要在模板中追加（如以上代码中在 template 中可以直接使用 title，在 setup 函数中使用 title.value 来修改其值）
- reactive 的作用就是将一个对象转换成一个响应式对象
- toRefs 的作用是将一个响应式对象转化为一个普通对象，把其中每一个属性转化为响应式数据

为什么需要 toRefs ？

reactive 转化的响应式对象在销毁或展开（如解构赋值）的时候，响应式特征就会消失。为了在展开的同时保持其属性的响应式特征，我们可以使用 toRefs 。

Vue3 数据响应式的原理：

Vue3 会对需要转化为响应式的普通 JavaScript 对象转换为 Proxy。proxy 对象对于用户来说是不可见的，但是在内部，它们使 Vue3 能够在 property 的值被访问或修改的情况下进行依赖跟踪和变更通知。并且在 Vue 3 中，响应性数据可以在『独立的包』中使用。

Vue3 中同样每个组件实例都有一个相应的侦听器实例，该实例将在组件渲染期间把“触碰”的所有 property 记录为依赖项。之后，当触发依赖项的 setter 时，它会通知侦听器，从而使得组件重新渲染。

### Proxy 和 Object.defineProperty 比较

Proxy 和 Object.defineProperty 的使用方法看起来相似，其实 Proxy 是在 「更高维度」 上去拦截属性的修改的，怎么理解呢？例如对于给定的 data ：

```js
{
  count**:** 1
}
```

**Vue2 中进行如下操作：**

```js
Object.defineProperty(data, 'count', {
  get() {},
  set() {},
})
```

这就要求我们必须要知道 count 的存在，这也就解释了为什么 Vue2 无法侦听对象新增的属性。Object.defineProperty 有两大缺陷：

- 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应；
- 只能劫持对象的属性，从而需要对每个对象的每个属性进行遍历，如果属性值是对象，还需要深度遍历。

**Vue3 中进行如下操作：**

```js
new Proxy(data, {
  get(key) { },
  set(key, value) { },
})
```

Proxy 可以劫持整个对象，并返回一个新的对象。

### Vue2 与 Vue3 对比

Vue2 常见的缺陷：

- 从开发维护的角度考虑：Vue2 使用 Flow.js 做类型校验，但是现在 Flow.js 已经停止维护；并且 Option API 在组织代码较多组件时不易维护。
- 从社区的二次开发难度：Vue2 内部运行时直接执行浏览器 API，这会给 Vue2 的跨端带来问题。只能在 Vue 源码中进行相应的处理（例如 Vue2 中存在 Weex 的文件夹）
- 从日常使用的角度：Vue2 的响应式并不是真正意义上的代理，而是基于 Object.defineProperty() 实现的。这个 API 是对某个属性进行拦截，因此有很多缺陷（例如无法监听删除数据）

Vue3 的新特性

- Vue3 中使用 Proxy API 对数据进行代理（这个 API 是真正的代理，不过存在一些兼容性问题）
- Vue3 使用最近流行的 monorepo 管理方式，把响应式、编译和运行时全部独立了（Vue2 内部所有模块都糅合在一起）
- Vue3 全部模块使用 TypeScript 重构
- Vue3 使用 Composition API（组合式 API）
- Vue3 内置了 Fragment、Teleport、Suspense 三个新组件