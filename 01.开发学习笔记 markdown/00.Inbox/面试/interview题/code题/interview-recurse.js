// 几个递归问题
// ————————————————————————————————————————————————————————————————————————————————

// 从每个子数组中选择一个元素组合成新的数组，穷尽组合，
// 可以使用递归函数来实现
// adg adh adi aeg aeh aei afg afh afi 等等
const inputArray = [
	['a', 'b', 'c'],
	['d', 'e', 'f'],
	['g', 'h', 'i']
];

function combineArray(array, current = [], index = 0, result = []) {
	if (index === array.length) {
		result.push(current.join(''));
	} else {
		for (let item of array[index]) {
			combineArray(array, [...current, item], index + 1, result);
		}
	}
	return result;
}
// console.log(combineArray(inputArray)); // ["adg", "adh", "adi", "aeg", "aeh", "aei", ...]

// ————————————————————————————————————————————————————————————————————————————————
// 汉诺塔问题

// 有三根杆子 A，B，C。A 杆上有 N 个 (N>1) 穿孔圆盘，盘的尺寸由下到上依次变小。要求按下列规则将所有圆盘移至 C 杆：

// 每次只能移动一个圆盘；
// 大盘不能叠在小盘上面。
// 提示：可将圆盘临时置于 B 杆，也可将从 A 杆移出的圆盘重新移回 A 杆，但都必须遵循上述两条规则。

// 问：如何移？最少要移动多少次？

// 分解问题，从 1 推算到 n，或者由 n 推。
// n 个盘子，从 A 移动到 C，可以分解为两个子问题：

// 1. 将 n-1 个盘子从 A 移动到 B
// 2. 将第 n 个盘子从 A 移动到 C
// 3. 将 n-1 个盘子从 B 移动到 C

function hanoi(n, from, to, via) {
	if (n === 1) {
		console.log(`Move disk from ${from} to ${to}`);
	} else {
		hanoi(n - 1, from, via, to);
		hanoi(1, from, to, via);
		hanoi(n - 1, via, to, from);
	}
}

// ————————————————————————————————————————————————————————————————————————————————
// 实现斐波那契数列
// 递归
function fibonacciRecursive(index) {
	if (index <= 1) {
		return index;
	}
	return fibonacciRecursive(index - 2) + fibonacciRecursive(index - 1);
}

// 迭代
function fibonacciIterative(index) {
	let fibonacci = [0, 1];
	for (let i = 2; i <= index; i++) {
		fibonacci[i] = fibonacci[i - 2] + fibonacci[i - 1];
	}
	return fibonacci[index];
}

// 递归加闭包

const fibonacciClosure = (function () {
	const memoized = [];

	return function fibonacci(index) {
		if (index <= 1) {
			return index;
		}

		if (memoized[index]) {
			return memoized[index];
		}
		memoized[index] = fibonacci[index - 2] + fibonacci(index - 1);
		return memoized[index];
	};
})();

// ————————————————————————————————————————————————————————————————————————————————
// 如何把真实 dom 转变为虚拟 dom，代码实现一下
// 传入节点 对children进行递归
function VNode(tag, props, children) {
	this.tag = tag;
	this.props = props;
	this.children = children;
}

function realDOMtoVirtualDOM(realDOM) {
	if (realDOM.nodeType === Node.TEXT_NODE) {
		// 如果是文本节点，去除多余的空白字符并返回内容
		return realDOM.nodeValue.trim();
	} else if (realDOM.nodeType === Node.ELEMENT_NODE) {
		const tag = realDOM.tagName.toLowerCase();
		const props = {};
		const children = [];

		for (const attr of realDOM.attributes) {
			props[attr.name] = attr.value;
		}

		for (const childNode of realDOM.childNodes) {
			const childVNode = realDOMtoVirtualDOM(childNode);
			if (childVNode !== null) {
				children.push(childVNode);
			}
		}

		// 特殊处理空元素节点
		if (children.length === 0 && !realDOM.hasChildNodes()) {
			return new VNode(tag, props, null);
		}

		return new VNode(tag, props, children);
	}

	return null; // 其他节点类型返回 null
}

const realElement = document.createElement('div');
realElement.innerHTML = '<h1>Hello, World!</h1><p></p>';

const virtualElement = realDOMtoVirtualDOM(realElement);

console.log(virtualElement);

// ————————————————————————————————————————————————————————————————————————————————
// 请写一个函数，输出出多级嵌套结构的 Object 的所有 key 值
var obj = {
	a: '12',
	b: '23',
	first: {
		c: '34',
		d: '45',
		second: { 3: '56', f: '67', three: { g: '78', h: '89', i: '90' } }
	}
};

function getKeys(obj) {
	const keyList = [];
	function recurse(obj) {
		for (const key of Object.keys(obj)) {
			if (typeof obj[key] === 'object') {
				recurse(obj[key]);
			} else {
				keyList.push(key);
			}
		}
	}

	recurse(obj);

	return keyList;
}

console.log(getKeys(obj));
