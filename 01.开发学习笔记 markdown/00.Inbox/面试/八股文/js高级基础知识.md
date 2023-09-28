---
title: js高级基础知识
categories:
  - 01.开发学习笔记 markdown
  - 00.otherthings
  - 面经
---

# 第 1 题
填空

```js
var object = {}
object.__proto__ ===  ????填空1????  // 为 true

var fn = function(){}
fn.__proto__ === ????填空2????  // 为 true
fn.__proto__.__proto__ === ????填空3???? // 为 true

var array = []
array.__proto__ === ????填空4???? // 为 true
array.__proto__.__proto__ === ????填空5???? // 为 true

Function.__proto__ === ????填空6???? // 为 true
Array.__proto__ === ????填空7???? // 为 true
Object.__proto__ === ????填空8???? // 为 true

true.__proto__ === ????填空9???? // 为 true

Function.prototype.__proto__ === ????填空10???? // 为 true
```

```
1、Object.prototype
2、Function.prototype
3、Object.prototype
4、Array.prototype
5、Object.prototype
6、Function.prototype
7、Function.prototype
8、Function.prototype
9、Boolean.prototype
10 Object.prototype
```

# 第 2 题

```js
function fn(){
    console.log(this)
}
new fn()
```

new fn() 会执行 fn，并打印出 this，请问这个 this 有哪些属性？这个 this 的原型有哪些属性？

1、this只有隐型属性 __proto__
2、this的原型的属性有constructor：function fn()和__proto__

# 第 3 题
JSON 和 JavaScript 是什么关系？
JSON 和 JavaScript 的区别有哪些？


1、JSON是一种数据格式，JS的对象中，符合JSON数据格式规范的认为该JS对象是JSON对象
JSON对象是JS对象的一个子集
2、JSON是一种数据格式
Javascript是一门脚本语言，比较的应该是JavaScript对象的区别
JSON
键名必须为双引号，属性值：只能是10进制数值，字符串（加双引号），数组，布尔型，Null，符合JSON 的对象，不能是函数,NaN,Infinity,-Infinity和undefined
逗号问题  最后一个值后面不能有逗号
数值问题  前导不能为0，小数点后会有值

# 第 4 题
前端 MVC 是什么？（10分）
请用代码大概说明 MVC 三个对象分别有哪些重要属性和方法。（10分）
1、V是视图，C是控制器，M是模型
Model主要是操作数据，View是对象客户端的，Controller是M和V的纽带，监听View，操作，返回数据给View，请求Mode数据，Model再向服务器请求数据返回给Controller，Controller得到数据后操作View

2、
```js
window.view = function(selector) {
return document.querySelector(selector)
}

window.controller = {
view:null,
model:null,
init:function() {
this.view = view
this.model = model
this.operatingData()
},

operatingData:function{}
}
window.model = {
init:function() {},
saveData:function() {},
getData:function() {}
}
```

# 第 5 题
在 ES5 中如何用函数模拟一个类？（10分）

要求：函数构造一个造航母的类，公共属性是移动，停止和武器，不同点是ID，传入不同ID造出同功能的航母
```
function Hangmu(id) {
this.id = id 
}
Hangmu.prototype.move = function() {console.log('移动')} /*移动*/
Hangmu.prototype.stop = function() {console.log('停止')} /*停止*/
Hangmu.prototype.weapon = function() {}/*武器*/

var hangmu1 = new Hangmu('liaoninghao')
```

# 第 6 题
用过 Promise 吗？举例说明。
如果要你创建一个返回 Promise 对象的函数，你会怎么写？举例说明。
1、用过，在链接leancloud时用过。当获取数据库内容成功或者后，可以通过Promise对象的属性then，成功执行then中的第一个函数，并且传入resolve函数中的参，失败执行then中的第二个函数，并且传入reject函数中的参。
```
var promise = new Promise(function(resolve,reject) {
console.log('已创建promise')
if(result === 1) {
resolve('成功')
}else{
reject('失败')
}
}.then(function(data){
console.log(data)
},function(data){
console.log(data)
})
```
2、
```
function promise() {
var p = new Promise(function(resolve,reject) {
console.log('成功创建promise')
if(result === 1) {
resolve('成功')
}else{
reject('失败')
}
})
return p
}
/*调用函数*/
promise().then(function(data){
console.log(data)
return '真的牛逼'
}).then(function(data2) {
console.log(data2)
})
