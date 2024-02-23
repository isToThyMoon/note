/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-11-03 16:58:23
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2023-11-04 01:56:24
 * @FilePath: /snippets/00.interview/code题/interview-string&正则.js
 * @Description:
 */

// ————————————————————————————————————————————————————————————————————————————————
// 手写Stringify
function jsonStringify(obj) {
	let type = typeof obj;
	if (
		type === 'string' ||
		type === 'number' ||
		type === 'boolean' ||
		type === 'null'
	) {
		return obj.toString();
	} else if (type === 'undefined' || type === 'function' || type === 'symbol') {
		return undefined;
	} else if (Array.isArray(obj)) {
		return `[${obj.map((item) => jsonStringify(item)).join(',')}]`;
	} else if (type === 'object') {
		const objPairs = Object.keys(obj).map((key, index) => {
			return `"${key}": ${jsonStringify(obj[key])}`;
		});

		return `{${objPairs.join(',')}}`;
	} else {
		return undefined;
	}
}

console.log(
	jsonStringify({
		a: 1,
		b: 2,
		c: 3
	})
);
// 手写json parse
function jsonParse(str) {
	return eval(`(${str})`);
}
// ————————————————————————————————————————————————————————————————————————————————
// 填充代码实现template方法
var str = '您好，<%=name%>。欢迎来到<%=location%>。';
var data = { name: '张三', location: '北京' };
function template(str, data) {
	return str.replace(/<%=(\w+)%>/g, (match, index) => data[index]);
}
console.log(template(str, data)); // 您好，张三。欢迎来到北京。
// ————————————————————————————————————————————————————————————————————————————————
// 请实现一个函数，判断字符串是否符合含有成对花括号：
function hasPairBraces(str) {
	const isMatchList = ['1', '1'];

	for (let char of str) {
		if (char === '{') {
			//出现一个左括号
			isMatchList.push('label');
		} else if (char === '}') {
			//单独首次出现的右括号
			if (isMatchList.length === 0) {
				return false;
			}
			//出现一个右括号
			isMatchList.pop();
		}
	}

	return isMatchList.length === 0;
}

console.log(hasPairBraces('sfsdfsfdfdsfs{{}}'));

// ————————————————————————————————————————————————————————————————————————————————
// 请编写一个 JavaScript 函数 parseQueryString,
// 它的用途是把 URL 参数解析为一个对象，url="http://iauto360.cn/index.php?key0=0&key1=1&key2=2"
function parseQueryString(url) {
	const queryString = url.split('?')[1];
	const queryList = queryString.split('&');
	const queryObj = {};
	queryList.forEach((query) => {
		const [key, value] = query.split('=');
		queryObj[key] = value;
	});
	return queryObj;
}

const query = parseQueryString(
	'https://iauto360.cn/index.php?key0=0&key1=1&key2=2'
);
console.log(query);

// ————————————————————————————————————————————————————————————————————————————————
// 如何识别出字符串中的回车并进行换行？
var inputString =
	'这是一行文本\n这是第二行文本\r这是第三行文本\r\n这是第四行文本';

// 使用正则表达式 \r?\n 匹配回车符和换行符
var outputString = inputString.replace(/\r?\n/g, '<br>');

console.log(outputString);

// ————————————————————————————————————————————————————————————————————————————————
// 查询是否存在单一字节
// abcabcd
// output:d

function findrepeat(string) {
	const checkObject = {};
	const result = [];
	for (let index = 0; index < string.length; index++) {
		if (checkObject[string[index]] === undefined) {
			checkObject[string[index]] = 1;
		} else {
			checkObject[string[index]]++;
		}
	}

	for (const key in checkObject) {
		if (checkObject[key] === 1) {
			result.push(key);
		}
	}
	return result;
}
// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// ————————————————————————————————————————————————————————————————————————————————
// 金融数字格式化
const number = 123456789;
const list = number.toString().split('');

// 123456;
for (let i = list.length - 3; i > 0; i -= 3) {
	console.log('index', i);
	list.splice(i, 0, ',');
}
console.log(list.join(''));
console.log(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

// ————————————————————————————————————————————————————————————————————————————————
// 给 JavaScript 的 String 原生对象添加一个名为 trim 的原型方法，用于截取字符串前后的空白字符
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
};

// 使用 trim 方法
const exampleString = '   Hello, World!   ';
console.log(exampleString.trim()); // 输出： "Hello, World!"
// ————————————————————————————————————————————————————————————————————————————————
// 完成一个表达式，验证用户输入是否是电子邮箱
function isEmail(str) {
	return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
}
