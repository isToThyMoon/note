---
title: vuex
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 04.vue
  - 05.配套生态工具的使用
---

vuex作为一个数据管理框架
vuex 创建了一个全局唯一的仓库，用来存放全局的数据
通过app.use() 来使用。


```js
import { createStore } from 'vuex'

export default createStore({
    state: {
        name: 'dadada'
    },
    mutations: {
        change(state, value){
            state.name = value
        }
    },
    actions: {
        change(store, value){
            this.commit('change')
            //或store.commit('change')
        }
    },
    modules: {
    }
})
```

使用时只要在组件中通过`$store`调用
`this.$store.state.name`

要在组件中修改全局store的数据，必须按流程，
第一步 在组件的逻辑中，先dispatch一个修改的action
可携带数据参数
`this.$store.dispatch('change', value)`

第二步，在store中actions里定义的change方法感知到后触发运行。

第三步，随后在acitons中this.commit触发一个mutation.

第四步，mutaiton中对应的方法执行，数据只能在这里修改`this.state.name = 'dididi'`

如果不涉及异步的修改，也可以直接在组件第一步`this.$store.commit('change', )` 然后在mutation中感知到并触发同名函数来修改，跳过第二三步

mutation里有一个约束 是不写异步代码。

如果要写 放在action中。


# composition API来使用vuex
setup无法使用this

```js
<template>
  <h1>{{name}}</h1>
</template>

<script>
import { useStore } from 'vuex';


export default {
  name: 'App',
  setup(){
      const store = useStore();
      const name = store.state.name;
      return {
          name
      }
  }
}
</script>
```
toRefs解构一下：

```js
<template>
  <h1 @click="handleClick">{{name}}</h1>
</template>

<script>
import { toRefs } from 'vue';
import { useStore } from 'vuex';


export default {
  name: 'App',
  setup(){
      const store = useStore();
      const { name } = toRefs(store.state);
      const handleClick = () =>{
          store.commit('changeName')
      }
      return {
          name
      }
  }
}
</script>
```


# vue 2

# Vuex 
适用于 父子、隔代、兄弟组件通信
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。
Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

## 略解
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。
（1）Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
（2）改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：
State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。