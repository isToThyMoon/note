# 函数式编程中的重要概念：递归

递归：函数直接或间接地调用自身。
尾递归：所有递归形式的调用，一定发生在函数的末尾。之所以有尾递归优化，就是因为尾递归调用发生在递归函数的末尾，此事函数结束，后面没有执行代码，直接退栈，无需为这个函数保留内存空间，所以性能会明显好于非尾递归的函数，解释器也会对尾递归进行专门的优化。

递归算法的实质是把问题分解成大量规模缩小的同类问题，然后重复调用方法来表示问题的解。

使用递归时，必须要一个明确的递归结束条件，称为递归出口。

## 尾递归优化

对于递归函数的使用，人们所关心的一个问题是栈空间的增长。确实，随着被调用次数的增加，某些种类的递归函数会线性地增加栈空间的使用 —— 不过，有一类函数，即尾部递归函数，不管递归有多深，栈的大小都保持不变。尾递归属于线性递归，更准确的说是线性递归的子集。

函数所做的最后一件事情是一个函数调用（递归的或者非递归的），这被称为 尾部调用（tail-call）。使用尾部调用的递归称为 尾部递归。当编译器检测到一个函数调用是尾递归的时候，它就覆盖当前的活动记录而不是在栈中去创建一个新的。编译器可以做到这点，因为递归调用是当前活跃期内最后一条待执行的语句，于是当这个调用返回时栈帧中并没有其他事情可做，因此也就没有保存栈帧的必要了。通过覆盖当前的栈帧而不是在其之上重新添加一个，这样所使用的栈空间就大大缩减了，这使得实际的运行效率会变得更高。

对于尾调用，return 时必须是单纯的函数调用，return a + callFunction() 这样的计算也不是尾调用，它还是要在函数调用完和变量进行计算，栈空间并没有被释放。可见，要使调用成为真正的尾部调用，在尾部调用函数返回之前，对其结果 不能执行任何其他操作。

## 递归简单例子：阶乘

从经典的阶乘问题来分析如何化为递归来求解：
求 5 的阶乘：

```
factorial(5) = 5 * factorial(4)
factorial(4) = 4 * factorial(3) ...
```

抽取出一个公共的小问题，也就是公共的逻辑，`factorial(n) = n * factorial(n-1)`

可以轻易写出以下代码：

```js
function factorial(n) {
  return n * factorial(n - 1);
}
```

不过这样的代码有一个问题，它不会终止，永远算下去，cpu 和内存性能空间耗尽，风扇狂转程序卡死。
需要给出一个递归出口，当到达递归终止条件时，停止递归调用函数计算。

我们只需要计算到 1 为止，给出递归终止出口为 1：

```js
function factorial(n) {
  if (n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
```

只要初始值大于零，这个函数就能终止，停止的位置被称为 base case：基线条件。基线条件是递归程序的最底层位置，在此位置无需再进行操作，可以直接返回一个结果，所有递归程序都必须至少拥有一个基线条件，而且必须确保它会到达这个终止条件，否则程序会一直进行直到耗尽内存。

# 求解递归问题

归纳定义
将循环转化为递归

## 归纳定义

有时候，编写递归程序时难以获得更简单的子问题。不过，使用归纳定义的（inductively-defined）数据集，可以令子问题的获得更为简单。归纳定义的数据集是根据自身定义的数据结构 —— 这叫做归纳定义（inductive definition）。
例如，链表就是根据其本身定义出来的。链表所包含的节点结构体由两部分构成：它所持有的数据，以及指向另一个节点结构体（或者是 NULL，结束链表）的指针。 由于节点结构体内部包含有一个指向节点结构体的指针，所以称之为是归纳定义的。
使用归纳数据编写递归过程非常简单。注意，与我们的递归程序非常类似，链表的定义也包括一个基线条件 —— 在这里是 NULL 指针。 由于 NULL 指针会结束一个链表，所以我们也可以使用 NULL 指针条件作为基于链表的很多递归程序的基线条件。
如链表求和与汉诺塔问题。

### 链表求和：

```c
int sum_list(struct list_node *l){
  if(l == NULL){
    return 0;
  }
  return l.data + sum_list(l.next);

}
```

步骤： 1.初始化算法，这个算法的种子值是要处理的第一个节点，将它作为参数传入。 2.检查基线条件，程序检查确认当前节点是否为 NULL 链表，如果是，返回 0，因为空链表所有成员和为 0。 3.使用更简单的子问题重新定义答案。我们可以将答案定义为当前节点的内容加上链表其余所有内容的和，为了确定其余部分的和，我们针对下一个节点调用这个函数。 4.合并结果。递归调用之后，将当前节点的值与递归调用结果相加。

### 汉诺塔问题

有三根杆子 A，B，C。
A 杆上有 N 个 (N>1) 穿孔圆盘，盘的尺寸由下到上依次变小。要求按下列规则将所有圆盘移至 C 杆：

每次只能移动一个圆盘；
大盘不能叠在小盘上面。
提示：可将圆盘临时置于 B 杆，也可将从 A 杆移出的圆盘重新移回 A 杆，但都必须遵循上述两条规则。

问：如何移？最少要移动多少次？

分解问题，从 1 推算到 n，或者由 n 推。
n 个盘子，从 A 移动到 C，可以分解为两个子问题：

1. 将 n-1 个盘子从 A 移动到 B
2. 将第 n 个盘子从 A 移动到 C
3. 将 n-1 个盘子从 B 移动到 C

```js
function hanoi(n, from, to, via) {
  if (n === 1) {
    console.log(`Move disk from ${from} to ${to}`);
  } else {
    hanoi(n - 1, from, via, to);
    hanoi(1, from, to, via);
    hanoi(n - 1, via, to, from);
  }
}
```

## 将循环转化为递归

先了解循环和递归的特性对比。
循环的重复是为了获得结果，反复执行同一代码块，以结束完成代码块或者执行 continue 命令为信号而重复执行；递归为了获得结果，反复执行同一代码块，以反复调用自身为信号而实现重复执行。

循环的终止条件，为了确保能够终止，循环必须要有一个或多个能够使其终止的条件，而且必须确保在某种情况下满足其中之一；递归为了确保能够终止，递归函数需要有一个基线条件令函数停止递归。

循环的状态，循环进行时更新当前状态。递归将当前状态作为参数传递。

由于极高的相似性，可以认为循环和递归函数是可以相互转化的。区别在于，使用递归函数极少被迫修改任何一个变量 -- 只需将新值作为参数传递给下一次函数调用即可。这使得可以避免使用可更新变量带来的很多状态管理问题，同时能够进行重复的、有状态的行为。

例如阶乘的循环写法。

# 几个递归问题

// ————————————————————————————————————————————————————————————————————————————————

## 从每个子数组中选择一个元素组合成新的数组，穷尽组合，

```js
// 可以使用递归函数来实现
// adg adh adi aeg aeh aei afg afh afi 等等
const inputArray = [
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"],
];

function combineArray(array, current = [], index = 0, result = []) {
  if (index === array.length) {
    result.push(current.join(""));
  } else {
    for (let item of array[index]) {
      combineArray(array, [...current, item], index + 1, result);
    }
  }
  return result;
}
// console.log(combineArray(inputArray)); // ["adg", "adh", "adi", "aeg", "aeh", "aei", ...]
```

// ————————————————————————————————————————————————————————————————————————————————

## 实现斐波那契数列

```js
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
```

// ————————————————————————————————————————————————————————————————————————————————

## 如何把真实 dom 转变为虚拟 dom，代码实现一下

```js
// 传入节点 对 children 进行递归
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

const realElement = document.createElement("div");
realElement.innerHTML = "<h1>Hello, World!</h1><p></p>";

const virtualElement = realDOMtoVirtualDOM(realElement);

console.log(virtualElement);
```

// ————————————————————————————————————————————————————————————————————————————————

## 请写一个函数，输出出多级嵌套结构的 Object 的所有 key 值

```js
var obj = {
  a: "12",
  b: "23",
  first: {
    c: "34",
    d: "45",
    second: { 3: "56", f: "67", three: { g: "78", h: "89", i: "90" } },
  },
};

function getKeys(obj) {
  const keyList = [];
  function recurse(obj) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
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
```
