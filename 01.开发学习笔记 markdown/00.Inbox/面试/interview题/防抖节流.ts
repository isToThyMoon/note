/*
 * @Author: 王荣
 * @Date: 2022-09-01 10:41:13
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2024-02-21 20:25:00
 * @Description: 填写简介
 */

// 在throttle（事件节流）的逻辑里，“第一个人说了算”，
// 它只为第一个操作计时，时间到了就立即执行回调，计时中的其他调用都不执行，
// 等待第一个操作执行后，重新等待事件并重新计时。

// 而 debounce（事件防抖） 认为，“最后一个人说了算”，
// debounce 会为每一个新操作设定新的定时器，并取消之前操作触发的定时器。

// ————————————————————————————————————————————————————————————————————————————————

// 事件节流
// 第一次触发说了算 在持续触发的事件中，用户在触发一次事件后的固定秒内，不管触发多少次都不执行。

// 时间戳版
// func是需要包装的事件回调用 interval是时间间隔的阈值
function throttle(func, timeout) {
	// 上一次触发回调的时间
	let lastTime = 0;
	// throttle函数其实起到一个包装作用，实际监听不断调用的是这个返回的函数
	return function (...args) {
		const nowTime = +new Date(); // 或者new Date().getTime()
		if (nowTime - lastTime > timeout) {
			func.apply(this, args);
			lastTime = nowTime;
		}
	};
}

// 使用
// 用throttle来包装scroll的回调
// 注意一点 这里传入箭头函数，如果内部使用this 这里的this是什么？外层作用域的this
// 箭头函数的this向定义时的外部词法作用域寻找，这里箭头函数定义时其实是在throttle函数调用时，作为参数传入throttle。
// 所以外层其实是全局上下文，这里如果使用this 会找到Window
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000);
document.addEventListener('scroll', better_scroll);

// 定时器版本：

// 在触发事件的过程中，不会立即执行，并且每wait秒执行一次，在停止触发事件后还会再执行一次。

function throttle2(fn, wait) {
	let timer: number | null = null;
	return function (...args) {
		if (!timer) {
			timer = setTimeout(() => {
				fn.apply(this, args);
				timer = null;
			}, wait);
		}
	};
}

// 时间戳版的函数触发是在时间段内开始的时候，而定时器版的函数触发是在时间段内结束的时候。注意区分

///////////////////////////////////////////////////////////////////////////////////////

// ————————————————————————————————————————————————————————————————————————————————
// 事件防抖
// 事件回调并不会立即执行，而是等用户操作结束后等待wait秒后才执行，如果在wait时间之内用户又触发了监听事件，则会重新计算。
// 非立即执行版本
// func是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(func, delay) {
	// 定时器
	let timer: number | null = null;

	// 将debounce处理结果当作函数返回
	return function (...args) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const _this = this;
		// 每次事件被触发时，都去清除之前的旧定时器
		timer && clearTimeout(timer);
		// 设立新定时器
		timer = setTimeout(function () {
			func.apply(_this, args);
		}, delay);
	};
}
// 使用
// 用debounce来包装scroll的回调
const better_debounce_scroll = debounce(
	() => console.log('触发了滚动事件'),
	1000
);
document.addEventListener('scroll', better_debounce_scroll);

// 立即执行版本
function debounceImmediate(func, delay) {
	// 定时器
	let timer: number | null = -1;

	// 将debounce处理结果当作函数返回
	return function (...args) {
		// 触发事件立即执行一次
		if (timer === -1) {
			func.apply(this, args);
			timer = null;
		} else {
			// 每次事件被触发时，都去清除之前的旧定时器
			timer && clearTimeout(timer);
			// 设立新定时器
			timer = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		}
	};
}
