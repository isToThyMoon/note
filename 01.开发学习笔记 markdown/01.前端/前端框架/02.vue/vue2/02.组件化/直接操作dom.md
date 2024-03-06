---
title: 直接操作dom
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 04.vue
---

# vue如何直接操作dom

```jsx
<div id="root">
	<div ref='hello' @click="handleClick">hello world </div>
</div>

var vm = new Vue({
    el: '#root',
	methods: {
        handleClick: function(){
       		alert(this.$refs.hello.innerHTML)
        }
    }
})
```

`$refs`指页面所有的引用，这是一个对象（？）

这里我们是通过在一个html标签上加了ref 可以获取到它的dom，那么要是一个组件加上ref呢？

获取到的是组件的引用。指向组件实例。


来看个发布-订阅模式做出的点击dom来计算并求和例子：

```jsx
<body>

    <div id="app">
        <counter ref="counterOne" @changed="handleChange"></counter>
        <counter ref="counterTwo" @changed="handleChange"></counter>
        <div>{{totalTime}}</div>
    </div>

    <script src="vue.js"></script>
    
    <script>
		Vue.component("counter", {
            data: function(){
                return {
                    time: 0
                }
            },

		    template: "<div @click='handleClick' style='cursor: pointer; user-select: none;'>{{time}}</div>",
            methods: {
                handleClick: function(){
                    this.time ++;
                    this.$emit('changed')
                }
            }
		});

		var app = new Vue({
			el: '#app',
			data: {
                totalTime: 0
			},

			methods: {
				handleChange: function(){
                    this.totalTime = this.$refs.counterOne.time + this.$refs.counterTwo.time;
                }
			}
		})
    </script>
</body>
```



