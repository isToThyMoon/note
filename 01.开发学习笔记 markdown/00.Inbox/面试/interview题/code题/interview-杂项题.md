/\*

- @Author: tothymoon-mac istothymoon@gmail.com
- @Date: 2023-08-26 23:42:55
- @LastEditors: tothymoon-mac istothymoon@gmail.com
- @LastEditTime: 2023-11-04 22:43:43
- @FilePath: /snippets/00.interview/code 题/interview 题.js
- @Description:
  \*/

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
    },
  };
}
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
    九: 9,
  };
  // 中文权位转换成10的位数及节权标志
  var chineseWeightMap = {
    十: { value: 10, secUnit: false },
    百: { value: 100, secUnit: false },
    千: { value: 1000, secUnit: false },
    万: { value: 10000, secUnit: true },
    亿: { value: 100000000, secUnit: true },
  };

  var result = 0; // 存放最终的结果，将中文数字转化为阿拉伯数字
  var section = 0; // 存放当前小节的结果，每个小节由权位分隔
  var number = 0; // 存放当前小节内的阿拉伯数字
  var secUnit = false; // 标志当前权位是否为"节"单位 万 亿
  var strList = chineseNumber.split(""); // 标志当前权位是否为"节"单位

  for (var i = 0; i < strList.length; i++) {
    // 针对每个字符取对应阿拉伯数字
    let num = chineseNumberMap[strList[i]];
    if (typeof num !== "undefined") {
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
const chineseNum = "二百五十六万四千三百二十一";
const numberTransed = chineseToNumber(chineseNum);
console.log(numberTransed); // 输出 2564321
```

# 日期题

// ————————————————————————————————————————————————————————————————————————————————

## 给定起止日期，返回中间的所有月份

```js
function getMonthsBetweenDates(start, end) {
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  const result = [];
  const operateDate = startDate;

  while (operateDate < endDate) {
    const year = operateDate.getFullYear();
    const month = operateDate.getMonth() + 1;

    result.push(`${year}-${month.toString().padStart(2, "0")}`);
    operateDate.setMonth(startDate.getMonth() + 1);
  }

  return result.slice(1);
}
const startDateStr = "2018-08";
const endDateStr = "2018-12";
const result = getMonthsBetweenDates(startDateStr, endDateStr);
console.log(result);
```

// ————————————————————————————————————————————————————————————————————————————————

## 输入一个日期 返回几秒前、几小时前、几天前、几月前

```js
const date = new Date();
const timeStamps = date.getTime();
console.log("dada", timeStamps);

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
    diffMonth: diffSecond / 60 / 60 / 24 / 30,
  };
}

console.log(transform("2021-09-06 01:28:18"));
```
