
---
title: date
categories:
  - 01.开发学习笔记 markdown
  - 06.javascript
---

# 常用
`+new Date() === Date.now() === (new Date()).getTime()` 获取当前时间 毫秒数 13位 时间戳


# Date
## 入参

```js
// 不传，得到当前时间的标准Date
new Date();
// 传递一个 Unix 时间戳（Unix Time Stamp），它是一个整数值，表示自 1970 年 1 月 1 日 00:00:00 UTC（the Unix epoch）以来的毫秒数，忽略了闰秒。请注意大多数 Unix 时间戳功能仅精确到最接近的秒。
new Date(value);
// date的时间戳字符串
// 表示日期的字符串值，能够被Date.parse()解析就行
// 一般就是'Wed Jun 24 2015 19:49:22 GMT+0800 (CST)'这样的字符串
// 其他类似简略表达也可以，但由于浏览器之间的差异和不一致性，不推荐使用
new Date(dateString);
// 完成传入年月日时分秒毫秒 注意 日之后的参数可选
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
```

## 格式化使用
```js
// 调用new Date()就可以获得标准Date
new Date(1435146562875); // Wed Jun 24 2015 19:49:22 GMT+0800 (CST)
var dt = new Date() // Mon Mar 01 2021 15:37:51 GMT+0800 (中国标准时间)
dt.getTime() // 获取当前时间 获取毫秒数 13位
dt.getFullYear() // 年
dt.getMonth() // 月 0-11 脑抽的设计 语言问题 这里得到的是month的index 哪怕api名改成getMonthIndex也更合理
dt.getDate() // 日 1-31
dt.getHours() // 小时 0-23
dt.getMinutes() // 分钟 0-59
dt.getSeconds() // 秒 0-59
```

Date对象表示的时间总是按浏览器所在时区显示的，不过我们既可以显示本地时间，也可以显示调整后的UTC时间：

```js
var dt = new Date(1435146562875);
// 本地时间（北京时区+8:00），显示的字符串与操作系统设定的格式有关
dt.toLocaleString(); // '2015/6/24 下午7:49:22'
// UTC时间，与本地时间相差8小时
dt.toUTCString(); // 'Wed, 24 Jun 2015 11:49:22 GMT'

dt.toLocaleDateString()   // "2018/12/6"
dt.toLocaleTimeString()    // "下午9:30:29" 默认12小时制
dt.toLocaleTimeString("zh-cn", {hour12: false}) // "16:13:05" 24小时制
```

时间戳表示从1970年1月1日零时整的GMT时区开始的那一刻，到现在的毫秒数。

简单格式化时间：
```js
var now = function() {
    var d = new Date()
    var year = d.getFullYear()
    var monthIndex = d.getMonth()
    var month = monthIndex + 1
    var day = d.getDate()
    var hour = d.getHours()
    var minute = d.getMinutes()
    var second = d.getSeconds()

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}
```


# moment
http://momentjs.cn/docs/#/parsing/now/
比较重的time库，一般来说非必须选择day.js或者直接原生处理
`moment().format();`
Moment.js 会为 Date 对象创建封装器，而不是修改本地的 Date.prototype。

## 入参
要获取当前的日期和时间，只需调用不带参数的 moment() 即可。
`var now = moment();`
这基本上与调用` moment(new Date()) `相同。

moment(String);
当从字符串创建 moment 时，需要首先检查字符串是否与已知的 ISO 8601 格式匹配，如果未找到已知的格式，则在降维到 new Date(string) 之前检查字符串是否与 RFC 2822 日期时间格式匹配。这基本上与new Date()的时间戳字符串参数表现一致，他们都要满足这两个标准格式就行，但各个浏览器支持情况不统一。具体格式见http://momentjs.cn/docs/#/parsing/string/。

moment(Number);
与 new Date(Number) 类似，可以通过传入一个整数值来创建 moment，该整数值表示自 Unix 纪元（1970 年 1 月 1 日 12AM UTC）以来的毫秒数。
`var day = moment(1318781876406);`

moment(Date);
可以使用预先存在的原生 Javascript Date 对象来创建 Moment。
```
var day = new Date(2011, 9, 16);
var dayWrapper = moment(day);
```
这会克隆 Date 对象，Date 的后续更改不会影响 Moment，反之亦然。

## 显示
moment().format(); 按格式 格式化输出
moment().valueOf(); 输出时间戳 13位毫秒数
moment().unix(); 输出unix时间戳 10位秒数
moment().toString();以与 JS Date 的 .toString() 类似的格式返回英文字符串。 "Sat Apr 30 2016 16:59:46 GMT-0500"