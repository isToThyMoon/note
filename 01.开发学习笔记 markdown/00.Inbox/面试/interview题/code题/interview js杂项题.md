/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-08-26 23:42:55
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2023-11-04 22:43:43
 * @FilePath: /snippets/00.interview/code题/interview 题.js
 * @Description:
 */

// ————————————————————————————————————————————————————————————————————————————————
## 有这样一个函数 A,要求在不改变原有函数 A 功能以及调用方式的情况下，使得每次调用该函数都能在控制台打印出“HelloWorld”
```js
// function A() {
//   console.log("调用了函数A");
// }
// 利用代理Proxy实现
function A() {
	console.log('调用了函数A');
}

const proxyA = new Proxy(A, {
	apply: function (target, thisArg, argumentList) {
		console.log('HelloWorld');
		return Reflect.apply(target, thisArg, argumentList);
	}
});
```

// ————————————————————————————————————————————————————————————————————————————————
## 请用 JavaScript 代码实现事件代理
```js
const parent = document.getElementById('parent');
parent.addEventListener('click', (e) => {
	if (e.target.tagName === 'LI') {
		console.log('li clicked');
	}
});
```

// ————————————————————————————————————————————————————————————————————————————————
## 原生实现Object.create
// Object.create(proto[,propertiesObject])
// 创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
// 第二参数定义了新创建的对象的属性的属性描述符。
// Object.create(null) 创建一个没有原型的对象，Object.create(Object.prototype) 与 new Object() 类似。
Object.create = function (proto, propertiesObject) {
	function F() {}
	F.prototype = proto;
	const object = new F();
	if (propertiesObject) {
		Object.defineProperties(object, propertiesObject);
	}
	return object;
};

// ————————————————————————————————————————————————————————————————————————————————
## 实现一个打点计时器

```js
/* 
  1.从start至end,每隔100毫秒console.log一个数字，每次数字增幅为1
  2.返回的对象中需要包含一个cancel方法，用于停止定时操作
  3.第一个数字需要立即输出
*/
function count(start, end) {
	console.log(start++);
	const timer = setInterval(() => {
		if (start <= end) {
			console.log(start++);
		} else {
			clearInterval(timer);
		}
	}, 100);
	return {
		cancel: () => {
			clearInterval(timer);
		}
	};
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 介绍 instanceof 原理，并手动实现

```js
// 实际上是通过检查对象的原型链来确定对象是否由指定的构造函数创建的。
function myInstanceOf(instance, constructorFunc) {
	let proto = Object.getPrototypeOf(instance);

	while (proto !== null) {
		if (proto == constructorFunc.prototype) {
			return true;
		}
		proto = Object.getPrototypeOf(proto);
	}
	return false;
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 请手动实现一个浅拷贝

```js
function shallowCopy(obj) {
	const type = typeof obj;
	if (type !== 'object' || obj === null) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.slice();
	}

	const copy = {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = obj[key];
		}
	}
	return copy;
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 请手动实现一个深拷贝

```js
function deepCopy(source) {
	const type = typeof source;
	if (type !== 'object' || source === null) {
		return source;
	}
	if (Array.isArray(source)) {
		return source.map((item) => deepCopy(item));
	}
	const copy = {};
	for (let key in source) {
		if (source.hasOwnProperty(key)) {
			copy[key] = deepCopy(source[key]);
		}
	}
	return copy;
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 输入一个日期 返回几秒前、几小时前、几天前、几月前

```js
const date = new Date();
const timeStamps = date.getTime();
console.log('dada', timeStamps);

function transform(time) {
	const nowDate = new Date();
	const nowTimeStamps = date.getTime();

	const timeStamps = new Date(time).getTime();

	const diffSecond = (nowTimeStamps - timeStamps) / 1000;
	return {
		diffSecond,
		diffMinute: diffSecond / 60,
		diffHour: diffSecond / 60 / 60,
		diffDay: diffSecond / 60 / 60 / 24,
		diffMonth: diffSecond / 60 / 60 / 24 / 30
	};
}

console.log(transform('2021-09-06 01:28:18'));
```

// ————————————————————————————————————————————————————————————————————————————————
## 用原生 js 实现自定义事件
```
// 创建一个新的自定义事件
var customEvent = new CustomEvent('myCustomEvent', {
	detail: {
		message: '这是一个自定义事件的消息'
	}
});

// 监听自定义事件
document.addEventListener('myCustomEvent', function (event) {
	console.log('收到自定义事件：', event.detail.message);
});

// 触发自定义事件
document.dispatchEvent(customEvent);
```

// ————————————————————————————————————————————————————————————————————————————————
## 实现一个函数柯里化
```js
function curryFunction(fn) {
	return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.apply(this, args);
		} else {
			return function (...otherArgs) {
				return curried.apply(this, args.concat(otherArgs));
			};
		}
	};
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 要求⽤不同⽅式对 A 进⾏改造实现 A.name 发⽣变化时⽴即执⾏ A.getName
```js
/*
	已知对象A = {name: 'sfd', getName: function(){console.log(this.name)}},
	现要求⽤不同⽅式对A进⾏改造实现A.name发⽣变化时⽴即执⾏A.getName
*/
// 改造原对象，get set方法
var A = {
	_name: 'sfd',
	get name() {
		return this._name;
	},
	set name(newName) {
		this._name = newName;
		this.getName();
	},
	getName: function () {
		console.log(this.name);
	}
};

A.name = 'New Name'; // 这里会触发 getName 方法并输出 'New Name'

// Object.defineProperty实现
A = {
	_name: 'sfd',
	getName: function () {
		console.log(this.name);
	}
};

Object.defineProperty(A, 'name', {
	get: function () {
		return this._name;
	},
	set: function (val) {
		this._name = val;
		this.getName();
		// this.name = val;
	}
});

A.name = 'sdf';

// proxy实现
var A = {
	name: 'sfd',
	getName: function () {
		console.log(this.name);
	}
};

A = new Proxy(A, {
	set: function (target, key, value) {
		target[key] = value;
		target.getName();
	}
});

A.name = 'dadad';
```

// ————————————————————————————————————————————————————————————————————————————————
## 已知函数 A，要求构造⼀个函数 B 继承 A

```js
function A(name) {
	this.name = name;
}
A.prototype.getName = function () {
	console.log(this.name);
};

function B(name) {
	A.call(this, name);
}

B.prototype = Object.create(A.prototype, {});

B.prototype.constructor = B;
```

// ————————————————————————————————————————————————————————————————————————————————
## 实现一个函数将中文数字转成数字

```js
// 设计思想：
// 将中文数学转换成阿拉伯数字。
// 将中文权位转换成10的位数。
// 对每个权位依次转换成位数并求和。
// 零直接忽略即可。

function chineseToNumber(chineseNumber) {
	// 中文数字转换成阿拉伯数字
	const chineseNumberMap = {
		零: 0,
		一: 1,
		二: 2,
		三: 3,
		四: 4,
		五: 5,
		六: 6,
		七: 7,
		八: 8,
		九: 9
	};
	// 中文权位转换成10的位数及节权标志
	var chineseWeightMap = {
		十: { value: 10, secUnit: false },
		百: { value: 100, secUnit: false },
		千: { value: 1000, secUnit: false },
		万: { value: 10000, secUnit: true },
		亿: { value: 100000000, secUnit: true }
	};

	var result = 0; // 存放最终的结果，将中文数字转化为阿拉伯数字
	var section = 0; // 存放当前小节的结果，每个小节由权位分隔
	var number = 0; // 存放当前小节内的阿拉伯数字
	var secUnit = false; // 标志当前权位是否为"节"单位 万 亿
	var strList = chineseNumber.split(''); // 标志当前权位是否为"节"单位

	for (var i = 0; i < strList.length; i++) {
		// 针对每个字符取对应阿拉伯数字
		let num = chineseNumberMap[strList[i]];
		if (typeof num !== 'undefined') {
			// num不是undefined说明是0-9的数 不是权位
			number = num;
			// 如果循环这个数字是最后一个字符了，说明直接加即可
			if (i === strList.length - 1) {
				section += number;
			}
		} else {
			// 如果是权位
			// 取权位值
			var unit = chineseWeightMap[strList[i]].value;
			// 看是不是节点 万或者亿
			secUnit = chineseWeightMap[strList[i]].secUnit;
			if (secUnit) {
				// 如果是节点
				section = (section + number) * unit; // 计算小节的值并乘以权位值
				result += section; // 累加小节值到最终结果
				section = 0; // 重置小节值
			} else {
				// 如果不是节点是十 百 千，与之前存的number相乘 并加上之前的值，得到小节的值
				section += number * unit;
			}
			number = 0; // 重置当前小节内的阿拉伯数字
		}
	}
	return result + section; // 返回最终结果，包括所有小节的值
}

// 示例用法
const chineseNum = '二百五十六万四千三百二十一';
const numberTransed = chineseToNumber(chineseNum);
console.log(numberTransed); // 输出 2564321
```

// ————————————————————————————————————————————————————————————————————————————————
## 按要求实现一个 sum 函数

```js
// const a = sum(0); // => a === 0
// const b = sum(1)(2); // => b === 3
// const c = sum(4)(5); // c === 9
// const k = sum(n1)...(nk) // k === n1 + n2 + ... + nk

function sum(param) {
	let sum = 0;

	function add(y) {
		sum = sum + y;
		return add;
	}

	add.valueOf = function () {
		return sum;
	};

	return add();
}

const a = sum(0); // a === 0
const b = sum(1)(2); // b === 3
const c = sum(4)(5); // c === 9

console.log(a); // 输出 0
console.log(b); // 输出 3
console.log(c); // 输出 9

// 其实是cury化的实现：
function addCurry() {
	let arr = [...arguments];
	let fn = function () {
		arr.push(...arguments);
		return fn;
	};
	fn.toString = function () {
		return arr.reduce((a, b) => {
			return a + b;
		});
	};

	return fn;
}
```

// ————————————————————————————————————————————————————————————————————————————————
## 动手实现一个 repeat 方法
```js
function repeat(func, times, wait) {
	return function () {
		let count = 0;
		let timer = null;

		let args = arguments;
		timer = setInterval(() => {
			count++;
			if (count <= times) {
				func(...args);
			} else {
				clearInterval(timer);
			}
		}, wait);
	};
}

const repeatFunc = repeat(console.log, 4, 3000);
// 调用这个 repeatFunc ("hellworld")，会alert4次 helloworld, 每次间隔3秒
repeatFunc('dada');

```
// ————————————————————————————————————————————————————————————————————————————————
## 给定起止日期，返回中间的所有月份
```js
function getMonthsBetweenDates(start, end) {
	const startDate = new Date(start + '-01');
	const endDate = new Date(end + '-01');
	const result = [];
	const operateDate = startDate;

	while (operateDate < endDate) {
		const year = operateDate.getFullYear();
		const month = operateDate.getMonth() + 1;

		result.push(`${year}-${month.toString().padStart(2, '0')}`);
		operateDate.setMonth(startDate.getMonth() + 1);
	}

	return result.slice(1);
}
const startDateStr = '2018-08';
const endDateStr = '2018-12';
const result = getMonthsBetweenDates(startDateStr, endDateStr);
console.log(result);
```

// ————————————————————————————————————————————————————————————————————————————————
## 设计一个函数，奇数次执行的时候打印 1，偶数次执行的时候打印 2
```js
function print() {
	let count = 0;

	return function () {
		count++;
		if (count % 2 === 0) {
			console.log(2);
		} else {
			console.log(1);
		}
	};
}

const printFunc = print();
printFunc();
printFunc();
printFunc();
printFunc();
```

// ————————————————————————————————————————————————————————————————————————————————
## 请实现如下的函数

```js
/*
	可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有请求结束之后，需要执行 callback 回调函数。发请求的函数可以直接使用 fetch 即可
*/
function batchRequest(urls, max, callback) {
	const results = [];
	let index = 0;

	function fetchData(url) {
		return fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				results.push(data);
				next();
			})
			.catch((error) => {
				console.error('Error:', error);
				next();
			});
	}

	function next() {
		if (index < url.length) {
			const url = urls[index];
			index++;
			fetchData(url);
		} else if (results.length === urls.length) {
			callback(results);
		}
	}

	for (let i = 0; i < max; i++) {
		next();
	}
}
```
