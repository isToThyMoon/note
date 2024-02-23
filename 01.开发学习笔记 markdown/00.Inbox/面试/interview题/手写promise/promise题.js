/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-11-03 11:28:37
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2023-11-04 01:43:43
 * @FilePath: /snippets/00.interview/手写promise/promise题.js
 * @Description:
 */

function promiseAll(promises) {
	return new Promise((resolve, reject) => {
		let completedPromiseCount = 0;
		const result = [];

		if (promises.length === 0) {
			resolve(result);
		}
		promises.forEach((promise, index) => {
			promise.then(
				(value) => {
					result[index] = value;
					completedPromiseCount++;
					if (completedPromiseCount === promises.length) {
						resolve(result);
					}
				},
				(err) => {
					reject(err);
				}
			);
		});
	});
}

function myPromiseRace(promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((promise) => {
			promise.then(resolve).catch(reject);
		});
	});
}
// ————————————————————————————————————————————————————————————————————————————————
// 顺序执行的promise
// 按要求完成代码 实现顺序执行的promise
const timeout = (ms) =>
	new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
const ajax1 = () =>
	timeout(2000).then(() => {
		console.log('1');
		return 1;
	});
const ajax2 = () =>
	timeout(1000).then(() => {
		console.log('2');
		return 2;
	});
const ajax3 = () =>
	timeout(2000).then(() => {
		console.log('3');
		return 3;
	});
const mergePromise = (ajaxArray) => {
	// 1,2,3 done [1,2,3]
	// 此处写代码 请写出ES6、ES3 2中解法 使得输出如上

	// ES3 回调函数方法
	let result = [];
	let promise = Promise.resolve();
	ajaxArray.forEach((ajax) => {
		promise = promise.then(ajax).then((data) => {
			result.push(data);
			return result;
		});
	});
	return promise;
};

// ES6 async await解法
async function mergePromise(ajaxArray) {
	let result = [];
	for (let ajax of ajaxArray) {
		result.push(await ajax());
	}
	return result;
}

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
	console.log('done');
	console.log(data); // data 为[1,2,3]
});
// 执行结果为：1 2 3 done [1,2,3]

// ————————————————————————————————————————————————————————————————————————————————
// 实现一个功能，发送请求 5s 时间后，如果没有数据返回，中断请求,提示错误
// 主要通过Promise.race来实现
function sendRequest() {
	// 创建一个 Promise 对象，用于模拟异步请求
	return new Promise((resolve, reject) => {
		// 模拟请求，这里使用 setTimeout 来模拟一个 5 秒的延迟
		setTimeout(() => {
			// 模拟请求成功并返回数据
			const data = '这是请求的数据';
			resolve(data);
		}, 5000); // 5 秒后模拟请求完成
	});
}

function fetchData() {
	const requestPromise = sendRequest();

	// 使用 Promise.race 来设置一个超时
	const timeoutPromise = new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(new Error('请求超时'));
		}, 5000); // 5 秒后触发超时
	});

	// 等待请求成功或者超时
	return Promise.race([requestPromise, timeoutPromise]);
}

// 调用 fetchData 函数
fetchData()
	.then((data) => {
		console.log('请求成功:', data);
	})
	.catch((error) => {
		console.error('请求失败:', error.message);
	});

// ————————————————————————————————————————————————————————————————————————————————
// 手写实现 sleep 函数
function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}

// 使用示例
console.log('开始执行');
sleep(2000) // 休眠 2 秒
	.then(() => {
		console.log('2 秒后执行的代码');
	})
	.then(() => {
		return sleep(3000); // 继续休眠 3 秒
	})
	.then(() => {
		console.log('总共休眠了 5 秒后执行的代码');
	});
// sleep 函数返回一个 Promise，该 Promise 在指定的时间间隔后解决（即等待完成）。
// 您可以使用 then 方法来安排在解决后执行的代码。这样，您可以实现在异步环境中模拟休眠的效果。
// 这种方式允许您在 JavaScript 中实现类似于休眠的效果，而不会阻塞整个应用程序的执行。

//如果要同步阻塞的sleep，可以使用while循环，虽然并不鼓励在js环境中使用这种阻塞，会导致页面卡顿冻结
function sleepSync(ms) {
	const start = new Date().getTime();
	while (new Date().getTime() < start + ms) {}
}
console.log('开始执行');
sleepSync(2000); // 同步阻塞 2 秒
console.log('2 秒后执行的代码');

// ————————————————————————————————————————————————————————————————————————————————
// 用 Promise 封装一个 ajax
function ajax(url, method, data) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);

		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(xhr.response);
			} else {
				reject(new Error(xhr.statusText));
			}
		};
		xhr.onerror = function () {
			reject(new Error(xhr.statusText));
		};

		if (method === 'GET') {
			xhr.send();
		}
		if (method === 'POST' || method === 'PUT') {
			xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
			xhr.send(JSON.stringify(data));
		}
	});
}

// ————————————————————————————————————————————————————————————————————————————————
// 请实现一个 cacheRequest 方法，保证发出多次同一个 ajax 请求时都能拿到数据，而实际上只发出一次请求
function cacheRequest(url) {
	const cache = {};
	return Promise.resolve().then(() => {
		if (cache[url]) {
			return cache[url];
		} else {
			const promise = fetch(url).then((res) => res.json());
			cache[url] = promise;
			return promise;
		}
	});
}

// ————————————————————————————————————————————————————————————————————————————————
// 简单封装一个异步 fecth，使用 async await 的方式来使用
async function fetchData(url) {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

// 使用示例
async function getData() {
	try {
		const url = 'https://api.example.com/data';
		const result = await fetchData(url);
		console.log(result);
	} catch (error) {
		console.error('Error:', error);
	}
}

getData();
