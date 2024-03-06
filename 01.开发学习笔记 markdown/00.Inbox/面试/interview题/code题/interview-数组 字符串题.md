# 数组

// ————————————————————————————————————————————————————————————————————————————————

## 分别对以下数组进行去重

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

## 写一个函数打乱一个数组，传入一个数组，返回一个打乱的新数组

```js
// 洗牌算法
function shuffleArray(arr) {
  const newArray = [...arr];
  for (let i = 0; i <= newArray.length - 1; i++) {
    const indexJ = Math.floor(Math.random() * newArray.length);
    [newArray[i], newArray[indexJ]] = [newArray[indexJ], newArray[i]];
  }
  return newArray;
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 两个数组的差集

从 arr1 中除去 arr2 中有多元素

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

## 版本大小比对

```js
var versions = ["1.45.0", "1.5", "6", "3.3.3.3.3.3"];

function compareFunc(a, b) {
  const versionA = a.split(".").map(Number);
  const versionB = b.split(".").map(Number);

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

## 34. 在排序数组中查找元素的第一个和最后一个位置

给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
进阶：你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
示例 1：
输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]

示例 2：
输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]

示例 3：
输入：nums = [], target = 0
输出：[-1,-1]

其实就是二分查找

```js
// 个人方法 先二分查找到元素位置，然后向左右遍历直到找不到重复元素为止，得到左右两个边界
var searchRange = function (nums, target) {
  let leftIndex = 0;
  let rightIndex = nums.length - 1;
  let middleIndex;

  let findIndex = undefined;
  while (leftIndex <= rightIndex) {
    middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    if (target < nums[middleIndex]) {
      rightIndex = middleIndex - 1;
    } else if (target === nums[middleIndex]) {
      findIndex = middleIndex;
      break;
    } else {
      leftIndex = middleIndex + 1;
    }
  }

  if (findIndex !== undefined) {
    let findLeft = findIndex,
      findRight = findIndex;
    for (let i = findLeft - 1; i >= 0 && nums[i] === target; i--) {
      findLeft = i;
    }
    for (let j = findRight + 1; j < nums.length && nums[j] === target; j++) {
      findRight = j;
    }
    return [findLeft, findRight];
  } else {
    return [-1, -1];
  }
};
```

```js
// 和上一个方法一样，只是在找到元素时 直接用while循环找到左右边界
function searchNumList(nums, target) {
  let left = 0,
    right = nums.length - 1,
    mid;
  while (left <= right) {
    mid = left + ((right - left) >> 1);
    if (target < nums[mid]) {
      right = mid - 1;
    } else if (target > nums[mid]) {
      left = mid + 1;
    } else if (target === nums[mid]) {
      // return mid;
      // result.push(mid);
      let resultLeft = mid - 1,
        resultRight = mid + 1;
      while (resultLeft >= 0 && nums[resultLeft] === target) {
        resultLeft--;
      }
      while (resultRight < nums.length && nums[resultRight] === target) {
        console.log(resultRight);
        resultRight++;
      }
      return [resultLeft + 1, resultRight - 1];
    }
  }
  return [-1, -1];
}

console.log("searchNum", searchNumList([2, 2], 2));

// 这种方法还不算效率最高
// 更好的办法是查找到小于target的边界和大雨target的边界：
var searchRange2 = function (nums, target) {
  const getLeftBorder = (nums, target) => {
    let left = 0,
      right = nums.length - 1;
    let leftBorder = -2; // 记录一下leftBorder没有被赋值的情况
    while (left <= right) {
      let middle = left + ((right - left) >> 1);
      if (nums[middle] >= target) {
        // 寻找左边界，nums[middle] == target的时候更新right
        right = middle - 1;
        leftBorder = right;
      } else {
        left = middle + 1;
      }
    }
    return leftBorder;
  };

  const getRightBorder = (nums, target) => {
    let left = 0,
      right = nums.length - 1;
    let rightBorder = -2; // 记录一下rightBorder没有被赋值的情况
    while (left <= right) {
      let middle = left + ((right - left) >> 1);
      if (nums[middle] > target) {
        right = middle - 1;
      } else {
        // 寻找右边界，nums[middle] == target的时候更新left
        left = middle + 1;
        rightBorder = left;
      }
    }
    return rightBorder;
  };

  let leftBorder = getLeftBorder(nums, target);
  let rightBorder = getRightBorder(nums, target);
  // 情况一
  if (leftBorder === -2 || rightBorder === -2) return [-1, -1];
  // 情况三
  if (rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1];
  // 情况二
  return [-1, -1];
};
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

## 扁平化对象

```js
// const a = { a: 1, b: 2, c: {d: 3, h: {e: 4} } }
// output:
// {a: 1, b: 2, d: 3, e: 4}
// return 是 result 在值为 object 需要进行合并就好
const a = { a: 1, b: 2, c: { d: 3, h: { e: 4 } } };

function flattenObject(object) {
  const result = {};
  for (const key in object) {
    if (typeof object[key] === "object") {
      Object.assign(result, flattenObject(object[key]));
    } else {
      Object.assign(result, {
        [key]: object[key],
      });
    }
  }
  return result;
}
```

# 字符串

// ————————————————————————————————————————————————————————————————————————————————

## 3. 无重复字符的最长子串

求一个字符串中，无重复元素的子串最长有多长
注意，是子串中，不能出现重复元素就行

### 滑动窗口法

```js
var lengthOfLongestSubstring = function (str) {
  // 最大无重复子串长度
  // 设置开始索引 和最大长度 和哈希表记录已遍历元素最大index
  let startIndex = 0;
  let charIndexMap = {};
  let maxLength = 0;

  // let result = '';

  for (let endIndex = 0; endIndex < str.length; endIndex++) {
    // 滑动前result
    // result = str.slice(startIndex, startIndex + maxLength);

    // 当前元素
    const currentChar = str[endIndex];
    // 如果当前元素出现在了哈希中，说明当前startIndex到endIndex中
    // 有索引为charIndexMap[currentChar]的元素与endIndex上当前元素重复了
    // startIndex设置为charIndexMap[currentChar]往前一位，避免这两个元素重
    // charIndexMap[currentChar] >= startIndex保证这个元素是在滑动窗口内部 与当前endIndex元素重了，
    // 之前的元素不在滑动窗口内，就不用考虑了
    if (
      charIndexMap[currentChar] !== undefined &&
      charIndexMap[currentChar] >= startIndex
    ) {
      startIndex = charIndexMap[currentChar] + 1;
    }

    // 每次循环设置该元素出现索引
    charIndexMap[currentChar] = endIndex;
    // 最大长度
    maxLength = Math.max(maxLength, endIndex - startIndex + 1);

    // 尝试写了下能不能获取最长子串是什么，发现没有意义，
    // 因为会出现同长度的子串 可能有非常多，取它没有意义，或者取最后一个最长子串
    // if (endIndex - startIndex + 1 > maxLength) {
    // 	result = str.slice(startIndex, endIndex + 1);
    // 	maxLength = endIndex - startIndex + 1;
    // }
  }

  return maxLength;
};

console.log(lengthOfLongestSubstring("abcabcbb"));
```

### 动态规划法

1. 状态定义： 定义一个动态规划数组 dp，其中 dp[i] 表示以第 i 个字符结尾的最长无重复字符的子串的长度。

2. 状态转移： 对于第 i 个字符，判断它是否在当前子串中：

如果不在，说明可以将其加入当前子串，更新 dp[i] = dp[i-1] + 1。
如果在，找到该字符在当前子串中的位置 j，判断与上一个相同字符的位置 k：
如果 j - k <= dp[i-1]，说明上一个相同字符在当前子串中，需要更新 dp[i] = j - k。
如果 j - k > dp[i-1]，说明上一个相同字符在之前的子串中，仍然可以将当前字符加入子串，更新 dp[i] = dp[i-1] + 1。

3. 结果： 最终的结果是 dp 数组中的最大值。

```js
function lengthOfLongestSubstring(s) {
  if (s.length === 0) {
    return 0;
  }

  // 初始化动态规划数组，dp[i] 表示以第 i 个字符结尾的最长无重复字符的子串的长度
  const dp = new Array(s.length).fill(0);

  // 初始化第一个字符的最长无重复字符子串长度
  dp[0] = 1;

  // 使用哈希表记录每个字符最后出现的位置
  const charIndexMap = { [s[0]]: 0 };

  for (let i = 1; i < s.length; i++) {
    const currentChar = s[i];

    if (charIndexMap.hasOwnProperty(currentChar)) {
      const j = charIndexMap[currentChar];
      const k = i - dp[i - 1];

      // 判断是否在当前子串中
      if (j - k <= dp[i - 1]) {
        dp[i] = j - k;
      } else {
        dp[i] = dp[i - 1] + 1;
      }
    } else {
      dp[i] = dp[i - 1] + 1;
    }

    // 更新字符最后出现的位置
    charIndexMap[currentChar] = i;
  }

  // 返回最大值
  return Math.max(...dp);
}

// 测试
const inputString = "abcabcbb";
const result = lengthOfLongestSubstring(inputString);
console.log(result); // 输出 3，对应的子串为 "abc"
```

## 查询是否存在单一字节

如字符串：abcabcd
output:d

```js
function findrepeat(string) {
  const checkObject = {};
  const result = [];
  for (let index = 0; index < string.length; index++) {
    // 遍历字符串，记录每个字符出现次数 存入hash表
    if (checkObject[string[index]] === undefined) {
      checkObject[string[index]] = 1;
    } else {
      checkObject[string[index]]++;
    }
  }
  // 最后遍历hash 取出只出现一次的字符
  for (const key in checkObject) {
    if (checkObject[key] === 1) {
      result.push(key);
    }
  }
  return result;
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 请实现一个函数，判断字符串是否符合含有成对花括号：

```js
function hasPairBraces(str) {
  const isMatchList = [];

  for (let char of str) {
    if (char === "{") {
      //出现一个左括号
      isMatchList.push("{");
    } else if (char === "}") {
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

console.log(hasPairBraces("sfsdfsfdfdsfs{{}}"));
```

// ————————————————————————————————————————————————————————————————————————————————

## 请编写一个 JavaScript 函数 parseQueryString,

它的用途是把 URL 参数解析为一个对象，url="http://iauto360.cn/index.php?key0=0&key1=1&key2=2"

```js
function parseQueryString(url) {
  const queryString = url.split("?")[1];
  const queryList = queryString.split("&");
  const queryObj = {};
  queryList.forEach((query) => {
    const [key, value] = query.split("=");
    queryObj[key] = value;
  });
  return queryObj;
}

const query = parseQueryString(
  "https://iauto360.cn/index.php?key0=0&key1=1&key2=2"
);
console.log(query);
```

// ————————————————————————————————————————————————————————————————————————————————

## 填充代码实现 template 方法

```js
var str = "您好，<%=name%>。欢迎来到<%=location%>。";
var data = { name: "张三", location: "北京" };
function template(str, data) {
  return str.replace(/<%=(\w+)%>/g, (match, index) => data[index]);
}
console.log(template(str, data)); // 您好，张三。欢迎来到北京。
```
