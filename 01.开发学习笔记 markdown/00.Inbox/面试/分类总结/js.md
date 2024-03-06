#

最短路径算法 洪水漫灌算法 canvas画图 展示车辆移动路径 旋转



# ts

ts是一种基于静态类型检查的强类型语言


# 不使用第三个变量的情况下交换两个变量的值

使用数组解构赋值：
```js
let a = 5;
let b = 10;

[a, b] = [b, a];

console.log("a:", a); // 输出 10
console.log("b:", b); // 输出 5
```

使用数学运算：

```js
// 使用加法和减法：
let a = 5;
let b = 10;

a = a + b;
b = a - b;
a = a - b;


console.log("a:", a); // 输出 10
console.log("b:", b); // 输出 5
```

```js
// 乘除法
let a = 5;
let b = 10;

a = a * b;
b = a / b;
a = a / b;

console.log("a:", a); // 输出 10
console.log("b:", b); // 输出 5
```

使用异或运算：
```js
let a = 5;
let b = 10;

a = a ^ b;
b = a ^ b;
a = a ^ b;

console.log("a:", a); // 输出 10
console.log("b:", b); // 输出 5
```



