/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-11-03 16:56:18
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2023-11-05 11:39:52
 * @FilePath: /snippets/00.interview/code题/interview-循环.js
 * @Description:
 */

// ————————————————————————————————————————————————————————————————————————————————
// 根据给定的n值打印出一系列行，每行包含一定数量的星号（*），数量从1递增到2n-1 再递减到1
// 例如：n=4
//   *
//  ***
// *****
//*******
// *****
//  ***
//   *
function formatLog(n) {
	for (let i = 1; i <= 2 * n - 1; i += 2) {
		const placeholderNum = (2 * n - 1 - i) / 2;
		const stars = '*'.repeat(i);
		console.log(' '.repeat(placeholderNum) + stars);
	}

	for (let i = 2 * n - 3; i >= 1; i -= 2) {
		const placeholderNum = (2 * n - 1 - i) / 2;
		const stars = '*'.repeat(i);
		console.log(' '.repeat(placeholderNum) + stars);
	}
}
formatLog(10);

// 或者
const consoleLabel = (n) => {
	for (let i = 1; i <= n; i++) {
		const spaceLength = (2 * n - 1 - (2 * i - 1)) / 2;
		const charLength = 2 * i - 1;

		const str1 = ' '.repeat(spaceLength);
		const str2 = '*'.repeat(charLength);
		console.log(str1 + str2);
	}
};
consoleLabel(4);

// ————————————————————————————————————————————————————————————————————————————————
// 修改以下代码，使得最后⼀⾏代码能够输出数字 0-9（最好能给多种答案）
var arrays = [];
for (var i = 0; i < 10; i++) {
	arrays.push(function () {
		return i;
	});
}
arrays.forEach(function (fn) {
	console.log(fn());
}); //本⾏不能修改

// 解答：

// 最简单 var改let
// 其次，循环内部改立即执行函数 闭包完成
var arrays = [];
for (var i = 0; i < 10; i++) {
	(function (index) {
		arrays.push(function () {
			return index;
		});
	})(i);
}
arrays.forEach(function (fn) {
	console.log(fn());
}); //本⾏不能修改

// 除了使用 IIFE 和 let 关键字之外，还有一些其他方法可以解决这个问题。以下是另一种方法，使用 Array.from 创建一个包含 10 个不同值的数组：
var arrays = Array.from({ length: 10 }, function (_, i) {
	return function () {
		return i;
	};
});

arrys.forEach(function (fn) {
	console.log(fn());
});
