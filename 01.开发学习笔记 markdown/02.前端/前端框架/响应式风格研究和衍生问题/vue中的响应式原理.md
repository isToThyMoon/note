

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