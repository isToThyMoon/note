---
title: js字符串
categories:
  - 01.开发学习笔记 markdown
  - 06.JavaScript
  - 数组 字符串
---

# api

## 字符操作


### toUpperCase toLowerCase
toUpperCase() toLowerCase()
把一个字符串全部变为大写 小写
```js
var str = "Hello, World!";
var upper = str.toUpperCase(); // upper 的值为 "HELLO, WORLD!"
var lower = str.toLowerCase(); // lower 的值为 "hello, world!"
```

### trim 
trim() 方法用于去除字符串两端的空格。
```js
var str = "   Hello, World!   ";
var trimmed = str.trim(); // trimmed 的值为 "Hello, World!"
```

## 搜索

### charAt 
charAt() 方法用于获取指定位置的字符。
```js
var str = "Hello, World!";
var char = str.charAt(0); // char 的值为 "H"
```
### charCodeAt
charCodeAt() 方法用于获取指定位置字符的Unicode编码。
```js
var str = "Hello, World!";
var charCode = str.charCodeAt(0); // charCode 的值为 72 (字符 "H" 的Unicode编码)

```

### indexOf lastIndexOf
indexOf() 和 lastIndexOf() 方法用于查找子字符串在原始字符串中的位置。
```javascript
var str = 'hello, world';
str.indexOf('world'); // 返回7
str.indexOf('World'); // 没有找到指定的子串，返回-1
var lastIndex = str.lastIndexOf("l"); // lastIndex 的值为 10
```

### search(regex) 
执行正则表达式和 String 对象之间的一个搜索匹配。
如果匹配成功，则 search() 返回正则表达式在字符串中首次匹配项的索引;否则，返回 -1。

### match() 
检索返回一个字符串匹配正则表达式的结果。

```
const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
const regex = /[A-Z]/g;
const found = paragraph.match(regex);

console.log(found);
// expected output: Array ["T", "I"]
```

### replace() 
replace() 方法用于替换字符串中的子字符串。
```js
var str = "Hello, World!";
var replaced = str.replace("World", "Universe"); // replaced 的值为 "Hello, Universe!"
```

str.replace(regexp|substr, newSubStr|function)
返回一个由替换值（replacement）替换部分或所有的模式（pattern）匹配项后的新字符串。模式可以是一个字符串或者一个正则表达式，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。如果pattern是字符串，则仅替换第一个匹配项。



## 裁切拼接

### split 
split() 方法用于将字符串分割成子字符串数组。
```js
var str = "apple, banana, cherry";
var fruits = str.split(", "); // fruits 的值为 ["apple", "banana", "cherry"]
```

### concat
str.concat(str2, [, ...strN])
将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。

### slice[beginIndex, endIndex)
提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

beginIndex
从该索引（以 0 为基数）处开始提取原字符串中的字符。如果值为负数，会被当做 strLength + beginIndex 看待，这里的strLength 是字符串的长度（例如， 如果 beginIndex 是 -3 则看作是：strLength - 3）

endIndex
可选。在该索引（以 0 为基数）处结束提取字符串。如果省略该参数，slice() 会一直提取到字符串末尾。如果该参数为负数，则被看作是 strLength + endIndex，这里的 strLength 就是字符串的长度(例如，如果 endIndex 是 -3，则是, strLength - 3)。

```js
var str = 'The morning is upon us.';
str.slice(-3);     // 返回 'us.'
str.slice(-3, -1); // 返回 'us'
str.slice(0, -1);  // 返回 'The morning is upon us'
```

### substring[index, index)
substring()返回指定索引区间的子串 新的字符串：
参数负值代表 0

subtring 负参数虽然不会出错 但是不管负几，还是从index 0开始截取

```javascript
var s = 'hello, world'
s.substring(0, 5); // 从索引0开始到5（不包括5），返回'hello'
s.substring(7); // 从索引7开始到结束，返回'world'
```

### substr(start, length)
substr(start, length)	从 start 开始获取长为 length 的字符串 参数允许 start 为负数






# 常见业务
## 字符串反转：(其实也包含了数组反序的方法)
使用数组反序：Array.reverse()
`var a = 'abcdefg'
a.split('').reverse().join('')`

或Array.push pop配合：
```js
var arr = a.split('')
var newArr = new Array()
while(arr.length){
    newArr.push(arr.pop())
}
console.log(newArr.join(''))
```

或 for循环字符串 挨个拼接字符串拆成的数组元素：
```js
var arr = a.split('')
var str = ''
for (let i = a.length-1; i>=0; i--){
    str += arr[i]
}
console.log(str)
```

或es6解包反序列：

```js
var a = 'abcdefg'
var arr = [...a] 
// ['a', 'b', 'c', 'd', 'e' ,'f', 'g' ]
```