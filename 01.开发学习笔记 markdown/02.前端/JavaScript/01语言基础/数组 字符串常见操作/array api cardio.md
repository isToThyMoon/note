---
title: array api 精简
categories:
  - 01.开发学习笔记 markdown
  - 06.JavaScript
  - 数组 字符串常见操作
---




Array 的用法全览：`https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array`

# 基本用法
```js
window.Array 全局对象（也是函数）
Array(3) // {length:3}  声明一个长度为3的array
Array(3,3) // [3,3] 
new Array(3) 跟不加 new 一样的效果
new Array(3,3,) 跟不加 new 一样的效果
```

JS 中数组的本质
人类理解：数组就是数据的有序集合
JS理解：数组就是原型链中能链接到 Array.prototype 的对象

![图片 1](https://raw.githubusercontent.com/ayrikiya/pic-store/main/note/%E5%9B%BE%E7%89%87%201.png)

## indexOf
与String类似，Array也可以通过indexOf()来搜索一个指定的元素的位置：
`var arr = [10, 20, '30', 'xyz'];
arr.indexOf(10); // 元素10的索引为0
arr.indexOf(20); // 元素20的索引为1
arr.indexOf(30); // 元素30没有找到，返回-1
arr.indexOf('30'); // 元素'30'的索引为2`



## join
join()方法是一个非常实用的方法，它把当前Array的每个元素都用指定的字符串连接起来，然后返回连接后的字符串：
`var arr = ['A', 'B', 'C', 1, 2, 3];
arr.join('-'); // 'A-B-C-1-2-3'`

## reverse
reverse()把整个Array的元素给掉个，也就是反转

# 重要api

## push和pop
push返回新arr长度 pop返回删除掉元素

python 一样, 只是 append 变成了 push
`var arr = [1, 2, 3]
arr.push(4)
log(’array push‘, arr)`

取长度用 arr.length
`log(’length‘, arr.length)`

push()向Array的末尾添加若干元素，pop()则把Array的最后一个元素删除掉：
`var arr = [1, 2];
arr.push('A', 'B'); // 返回Array新的长度: 4
arr; // [1, 2, 'A', 'B']
arr.pop(); // pop()返回'B'
arr; // [1, 2, 'A']
arr.pop(); arr.pop(); arr.pop(); // 连续pop 3次
arr; // []
arr.pop(); // 空数组继续pop不会报错，而是返回undefined
arr; // []`

## unshift和shift
unshift返回新的长度 shift返回删掉元素

如果要往Array的头部添加若干元素，使用unshift()方法，shift()方法则把Array的第一个元素删掉：
```js
var arr = [1, 2];
arr.unshift('A', 'B'); // 返回Array新的长度: 4
arr; // ['A', 'B', 1, 2]
arr.shift(); // 返回'A'
arr; // ['B', 1, 2]
arr.shift(); arr.shift(); arr.shift(); // 连续shift 3次
arr; // []
arr.shift(); // 空数组继续shift不会报错，而是返回undefined
arr; // []
```
## Array.map(func) 
对每一项运行func 把数组中的每个元素进行处理后，返回一个新的数组。
```js
let result = arr.map(function(item, index, array) {
  // 返回新值
})
```

## Array.forEach(func) 
然而，对于数组，更好的方式是直接使用iterable内置的forEach方法，它接收一个函数，每次迭代就自动回调该函数。父 
a.forEach(function (element, index, array) {
    // element: 指向当前元素的值
    // index: 指向当前索引
    // array: 指向Array对象本身
    console.log(element + ', index = ' + index);
});
forEach没有返回值，或者说永远返回undefined 不可以链式调用

## Array.concat(array)
concat()方法把当前的Array和另一个Array连接起来，并返回一个新的Array：
`var arr = ['A', 'B', 'C'];
var added = arr.concat([1, 2, 3]);
added; // ['A', 'B', 'C', 1, 2, 3]
arr; // ['A', 'B', 'C']`
请注意，concat()方法并没有修改当前Array，而是返回了一个新的Array。
实际上，concat()方法可以接收任意个元素和Array，并且自动把Array拆开，然后全部添加到新的Array里：
`var arr = ['A', 'B', 'C'];
arr.concat(1, 2, [3, 4]); // ['A', 'B', 'C', 1, 2, 3, 4]`

## array.filter(func) 
过滤符合条件的元素
返回符合条件元素组成的新数组

对每一项运行func 筛出使函数运行返回 true 的项组成新数组返回。
```js
let results = arr.filter(function(item, index, array) {
  // 如果 返回true 当前item 被推到新数组返回给results，迭代继续
  // 如果什么都没找到，则返回空数组
});
```

## array.sort((a, b) => (a > b) ? 1 : -1) 
数组以字符串的形式进行升序排列。原地排序。
按照调用该函数的返回值排序。
如果 compareFunction(a, b) 返回值小于 0 ，那么 a 会被排列到 b 之前；
如果 compareFunction(a, b) 返回值等于 0 ， a 和 b 的相对位置不变；
如果 compareFunction(a, b) 返回值大于 0 ， b 会被排列到 a 之前；

sort()可以对当前Array进行排序，它会直接修改当前Array的元素位置
arr.sort 方法对数组进行 原位（in-place） 排序，更改元素的顺序。(译注：原位是指在此数组内，而非生成一个新数组。)
它还返回排序后的数组，但是返回值通常会被忽略，因为修改了 arr 本身。
```
let arr = [ 1, 2, 15 ];
// 该方法重新排列 arr 的内容
arr.sort();
alert( arr );  // 1, 15, 2
```

## array.reduce
归并数组，接受一个函数作为参数（这个函数可以理解成累加器），它会遍历数组的所有项，然后构建一个最终的返回值，
这个值就作为累加器的第一个参数。
```js
array.reduce(function(previousValue, currentValue, index, array){
  return previousValue + currentValue;
}, []) // 第一个参数处理函数，第二个参数为initial作为第一次previousValue的值
```
previousValue 是上一个函数调用的结果，第一次等于 initial（如果提供了 initial 的话)。
index —— 当前索引。
arr —— 数组本身。

## array.some(func)
直到某个数组元素使此函数为 true，就立即返回 true。所以可以用来判断一个数组中，是否存在某个符合条件的值。

## array.every(func)
除非所有值都使此函数为 true，才会返回 true 值，否则为 false。主要用处，即判断是否所有元素都符合条件。

## find(func) 和 findIndex(func)
ES6 的新特性 类似于 some() ，但对于符合条件的元素，返回值不是布尔类型。
不一样的地方在于，find() 返回的是这个元素的值（或 undefined），而 findIndex() 返回的是这个元素的索引（或 -1）。

## slice 和 splice
slice不修改原数组，返回新数组；splice修改原数组，返回被删除的元素构成的数组

这两者比较相似的地方，大概只有：参数的第一个都是指的起始位置，且都接受负数，若是负数，代表倒数第几位。

而其他地方是需要区分清楚的：
slice()：不修改原数组，按照参数复制一个新数组，参数表述复制的起点和终点索引（省略则代表到末尾）
splice()：原数组会被修改。第二个参数代表要删掉的元素个数，之后可选的参数，表示要替补被删除位置的元素。返回被删除的元素。

所以想要删除一个元素，有两种实现思路，一是把出它之外的元素给复制下来再合在一起，二是直接把它删除。

```js
// 删除方法一，splice()
// comments.splice(index, 1);

// 删除方法二，slice 后拼接
const newComments = [
    ...comments.slice(0, index),
    ...comments.slice(index + 1)
];
```

### slice [ , )
slice()就是对应String的substring()版本，它截取Array的部分元素，然后返回一个新的Array：

`var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
arr.slice(0, 3); // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
arr.slice(3); // 从索引3开始到结束: ['D', 'E', 'F', 'G']`
如果不给slice()传递任何参数，它就会从头到尾截取所有元素。利用这一点，我们可以很容易地复制一个Array
参数还是不能设置反向截取
-x 负参数也只能做到截取末尾x个元素 生成新数组

### splice [ , 数x个删除包括开头索引]
splice()方法是修改Array的“万能方法”，它可以从指定的索引开始向末尾删除若干元素，然后再从该位置添加若干元素：

包括该指定索引的项 

```js
var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle'];
// 从索引2开始删除3个元素,然后再添加两个元素:
arr.splice(2, 3, 'Google', 'Facebook'); // 返回删除的元素 ['Yahoo', 'AOL', 'Excite']
arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
// 只删除,不添加:
arr.splice(2, 2); // ['Google', 'Facebook']
arr; // ['Microsoft', 'Apple', 'Oracle']
// 只添加,不删除:
arr.splice(2, 0, 'Google', 'Facebook'); // 返回[],因为没有删除任何元素
arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
```

# 其他

## 循环
### 伪数组
1.	有 0,1,2,3,4,5...n,length 这些 key 的对象
2.	原型链中没有 Array.prototype

这样的对象就是伪数组 目前知道的伪数组有
1. arguments 对象 它的__proto__指向的是Object.prototype(chrome控制台里打印出来的是Object 瞎打的)
2. document.querySelectAll('div') 返回的对象

伪数组可以用for in forEach进行循环

### for in / for of
for in是遍历对象属性, for of是遍历对象元素。

for...of语句在可迭代对象(包括 Array, Map, Set, String, TypedArray，arguments 对象等等)上创建一个迭代循环，对每个不同属性的属性值,调用一个自定义的有执行语句的迭代挂钩.
也就是说，for of只可以循环可迭代对象的可迭代属性，不可迭代属性在循环中被忽略了。

#### for ... in
for循环的一个变体是for ... in循环，它可以把一个对象的所有属性依次循环出来：

```js
var o = {
    name: 'Jack',
    age: 20,
    city: 'Beijing'
};
for (var key in o) {
    console.log(key); // 'name', 'age', 'city'
}
```
由于Array也是对象，而它的每个元素的索引被视为对象的属性，因此，for ... in循环可以直接循环出Array的索引
请注意，for ... in对Array的循环得到的是String而不是Number。


####  for of
遍历Array可以采用下标循环，遍历Map和Set就无法使用下标。为了统一集合类型，ES6标准引入了新的iterable类型，Array、Map和Set都属于iterable类型。

具有iterable类型的集合可以通过新的for ... of循环来遍历。

for ... in循环由于历史遗留问题，它遍历的实际上是对象的属性名称。一个Array数组实际上也是一个对象，它的每个元素的索引被视为一个属性。

当我们手动给Array对象添加了额外的属性后，for ... in循环将带来意想不到的意外效果：

var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    console.log(x); // '0', '1', '2', 'name'
}
for ... in循环将把name包括在内，但Array的length属性却不包括在内。

for ... of循环则完全修复了这些问题，它只循环集合本身的元素：

var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x of a) {
    console.log(x); // 'A', 'B', 'C'
}
这就是为什么要引入新的for ... of循环。

然而，更好的方式是直接使用iterable内置的forEach方法，它接收一个函数，每次迭代就自动回调该函数。

以array为例：

```js
var a = ['A', 'B', 'C'];
a.forEach(function (element, index, array) {
    // element: 指向当前元素的值
    // index: 指向当前索引
    // array: 指向Array对象本身
    console.log(element + ', index = ' + index);
});
```






