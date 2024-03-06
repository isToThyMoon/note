---
title: vue-router
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 04.vue
  - 05.配套生态工具的使用
---

component是一个箭头函数返回一个import的内容，
这是异步懒加载的组件
只要要它显示的时候才会加载js文件，节省资源。
   
```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home')
  },{
    path: '/cartList',
    name: 'CartList',
    component: () => import(/* webpackChunkName: "cartList" */ '../views/cartList/CartList')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from ,next) => {
  const { isLogin } = localStorage;
  const { name } = to;
  const isLoginOrRegister = (name === "Login" || name === "Register");
  (isLogin || isLoginOrRegister) ? next() : next({ name: 'Login'});
})

export default router

```

使用router
由于3.0中的没有this的存在，所以不能再使用`this.$router` or `this.$route`这种语法调用router相关的API, 移步详情。
在3.0中vue-router为开发者提供了两个非常常用的方法useRouter和useRoute,光看名字就知道跟2.0中的`this.$router`和`this.$route`的相对应的，下面是比较常用的用法：

## compositon api中使用时 useRouter
返回 router 实例。相当于在模板中使用 $router。必须在 setup() 中调用。

```js
/
/ html 部分
//<button @click="changeView"> 跳转路由</button>

import {useRouter} from 'vue-router'
export default {
	setup() {
    	const router = useRouter()
        const changeView = () => {
        	router.push({
            	path:'/targetPage',
                query:{name:'阿强呀'}
            })
        }
        return {
        	changeView
        }
    }
}
```

复制代码
当我们点击按钮即可跳转到响应路由。

useRoute

```js
// targetPage

import {useRoute} from 'vue-router'
import {onBeforeMount} from 'vue'

export default {
	setup() {
    	const route = useRoute()
    	onBeforeMount(() => {
        	console.log(route.query) // {name: "阿强呀"}
        })
    }
}
```

复制代码
其实使用方法挺简单的

# 路由模式
vue-router 有 3 种路由模式：hash、history、abstract，对应的源码如下所示：

```js
switch (mode) {
  case 'history':
	this.history = new HTML5History(this, options.base)
	break
  case 'hash':
	this.history = new HashHistory(this, options.base, this.fallback)
	break
  case 'abstract':
	this.history = new AbstractHistory(this, options.base)
	break
  default:
	if (process.env.NODE_ENV !== 'production') {
	  assert(false, `invalid mode: ${mode}`)
	}
}
```

* hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；

* history : 依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；

* abstract : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。

# hash和history实现原理
## hash 模式的实现原理
早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：
`https://www.word.com#search`

hash 路由模式的实现主要是基于下面几个特性：

* URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；
* hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
* 可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；
* 或者使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；
* 我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转（渲染）。

## history 模式的实现原理
HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

history 路由模式的实现主要基于存在下面几个特性：
* pushState 和 repalceState 两个 API 来操作实现 URL 的变化；
* 我们可以使用 popstate 事件来监听 url 的变化（只对浏览器行为生效，如点击前进后退。），从而对页面进行跳转（渲染）；
* history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。