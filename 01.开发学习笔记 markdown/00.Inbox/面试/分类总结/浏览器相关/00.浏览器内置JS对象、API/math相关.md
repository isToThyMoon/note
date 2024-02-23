## Math

```js
Math.random() // 获取随机数 可以用来清除缓存
```

获取随机数 要求长度一致(10位)的字符串格式
```js
var random = Math.random() + '';
// 获得的是16位小数
// 0.564720640930239

var randomNumString = random.slice(2, 12)
console.log(randomNumString)
```