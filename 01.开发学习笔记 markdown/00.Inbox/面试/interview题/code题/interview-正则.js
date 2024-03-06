/*
 * @Author: tothymoon-mac istothymoon@gmail.com
 * @Date: 2023-11-03 16:58:23
 * @LastEditors: tothymoon-mac istothymoon@gmail.com
 * @LastEditTime: 2024-02-27 22:39:52
 * @FilePath: /note/01.开发学习笔记 markdown/00.Inbox/面试/interview题/code题/interview-正则.js
 * @Description:
 */

// 如何识别出字符串中的回车并进行换行？
var inputString =
  "这是一行文本\n这是第二行文本\r这是第三行文本\r\n这是第四行文本";

// 使用正则表达式 \r?\n 匹配回车符和换行符
var outputString = inputString.replace(/\r?\n/g, "<br>");

console.log(outputString);

// ————————————————————————————————————————————————————————————————————————————————
// 金融数字格式化
const number = 123456789;
const list = number.toString().split("");

// 123456;
for (let i = list.length - 3; i > 0; i -= 3) {
  console.log("index", i);
  list.splice(i, 0, ",");
}
console.log(list.join(""));
console.log(number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

// ————————————————————————————————————————————————————————————————————————————————
// 给 JavaScript 的 String 原生对象添加一个名为 trim 的原型方法，用于截取字符串前后的空白字符
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};

// 使用 trim 方法
const exampleString = "   Hello, World!   ";
console.log(exampleString.trim()); // 输出： "Hello, World!"
// ————————————————————————————————————————————————————————————————————————————————
// 完成一个表达式，验证用户输入是否是电子邮箱
function isEmail(str) {
  return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
}
