/\*

- @Author: tothymoon-mac istothymoon@gmail.com
- @Date: 2023-11-03 00:14:12
- @LastEditors: tothymoon-mac istothymoon@gmail.com
- @LastEditTime: 2024-02-21 22:53:16
- @FilePath: /snippets/00.interview/code 题/interview-数组.js
- @Description:
  \*/

// ————————————————————————————————————————————————————————————————————————————————

## 两个数组的差集

```js
// filter 时间复杂度为 O(n)
// set has 方法时间复杂度为 O(1)，用它替换 Array 的 includes 方法，降低时间复杂度
function arrayExclude(arr1, arr2) {
	const newSet = new Set(arr2);
	return arr1.filter((item) => !newSet.has(item));
}

const arr1 = [1, 3, 5, 6, 8];
const arr2 = [1, 5, 4, 3];
console.log(arrayExclude(arr1, arr2));
```

// ————————————————————————————————————————————————————————————————————————————————

## 写一个函数打乱一个数组，传入一个数组，返回一个打乱的新数组

```js
// 洗牌算法
function shuffleArray(arr) {
const newArray = [...arr];
for (let i = 0; i <= newArray.length - 1; i++) {
const indexJ = Math.floor(Math.random() \* newArray.length);
[newArray[i], newArray[indexJ]] = [newArray[indexJ], newArray[i]];
}
return newArray;
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 分别对以下数组进行去重，

```js
// [1,'1',2,'2',3]，
// [1,[1,2,3['1','2','3'],4],5,6]
// set 去重
function uniqueArray(arr) {
	return [...new Set(arr)];
}
// filter 去重
function uniqueArrayFilter(arr) {
	return arr.filter((item, index, self) => {
		return self.indexOf(item) === index;
	});
}
// reduce 去重
function uniqueArrayReduce(arr) {
	return arr.reduce((accumulator, cur) => {
		if (!accumulator.includes(cur)) {
			accumulator.push(cur);
		}
		return accumulator;
	}, []);
}

// 对象属性去重 （数字和字符串数组）
function uniqueArrayObject(arr) {
	const obj = {};
	arr.forEach((item) => {
		obj[item] = item;
	});
	return Object.values(obj); // Object.keys(obj)
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 版本大小比对

```js
var versions = ['1.45.0', '1.5', '6', '3.3.3.3.3.3'];

function compareFunc(a, b) {
	const versionA = a.split('.').map(Number);
	const versionB = b.split('.').map(Number);

	for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
		const numA = versionA[i] || 0;
		const numB = versionB[i] || 0;
		if (numA < numB) {
			return -1;
		}
		if (numA > numB) {
			return 1;
		}
	}
	return 0;
}
const sortedVersions = versions.sort(compareFunc);

console.log(sortedVersions);
```

// ————————————————————————————————————————————————————————————————————————————————

## 数组题

```js
// const a = { a: 1, b: 2, c: {d: 3, h: {e: 4} } }
// output:
// {a: 1, b: 2, d: 3, e: 4}
// return 是 result 在值为 object 需要进行合并就好
const a = { a: 1, b: 2, c: { d: 3, h: { e: 4 } } };

function flattenObject(object) {
	const result = {};
	for (const key in object) {
		if (typeof object[key] === 'object') {
			Object.assign(result, flattenObject(object[key]));
		} else {
			Object.assign(result, {
				[key]: object[key]
			});
		}
	}
	return result;
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 扁平化数组

```js
var arr = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function flattenDeep(arr) {
	return arr.reduce(
		(acc, val) =>
			Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
		[]
	);
}
flattenDeep(arr); // [1, 2, 3, 1, 2, 3, 4, 2, 3, 4]
```
