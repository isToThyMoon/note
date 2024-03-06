# Proxy defineProperty

## 有这样一个函数 A,要求在不改变原有函数 A 功能以及调用方式的情况下，使得每次调用该函数都能在控制台打印出“HelloWorld”

```js
// function A() {
//   console.log("调用了函数A");
// }
// 利用代理Proxy实现
function A() {
  console.log("调用了函数A");
}

const proxyA = new Proxy(A, {
  apply: function (target, thisArg, argumentList) {
    console.log("HelloWorld");
    return Reflect.apply(target, thisArg, argumentList);
  },
});
```

// ————————————————————————————————————————————————————————————————————————————————

## 要求⽤不同⽅式对 A 进⾏改造实现 A.name 发⽣变化时⽴即执⾏ A.getName

```js
/*
	已知对象A = {name: 'sfd', getName: function(){console.log(this.name)}},
	现要求⽤不同⽅式对A进⾏改造实现A.name发⽣变化时⽴即执⾏A.getName
*/
// 改造原对象，get set方法
var A = {
  _name: "sfd",
  get name() {
    return this._name;
  },
  set name(newName) {
    this._name = newName;
    this.getName();
  },
  getName: function () {
    console.log(this.name);
  },
};

A.name = "New Name"; // 这里会触发 getName 方法并输出 'New Name'

// Object.defineProperty实现
A = {
  _name: "sfd",
  getName: function () {
    console.log(this.name);
  },
};

Object.defineProperty(A, "name", {
  get: function () {
    return this._name;
  },
  set: function (val) {
    this._name = val;
    this.getName();
    // this.name = val;
  },
});

A.name = "sdf";

// proxy实现
var A = {
  name: "sfd",
  getName: function () {
    console.log(this.name);
  },
};

A = new Proxy(A, {
  set: function (target, key, value) {
    target[key] = value;
    target.getName();
  },
});

A.name = "dadad";
```

# 对象

// ————————————————————————————————————————————————————————————————————————————————

## 已知函数 A，要求构造⼀个函数 B 继承 A

```js
function A(name) {
  this.name = name;
}
A.prototype.getName = function () {
  console.log(this.name);
};

function B(name) {
  A.call(this, name);
}

B.prototype = Object.create(A.prototype, {});

B.prototype.constructor = B;
```

// ————————————————————————————————————————————————————————————————————————————————

## 原生实现 Object.create

```js
// Object.create(proto[,propertiesObject])
// 创建一个新对象，使用现有的对象来提供新创建的对象的**proto**。
// 第二参数定义了新创建的对象的属性的属性描述符。
// Object.create(null) 创建一个没有原型的对象，Object.create(Object.prototype) 与 new Object() 类似。
Object.create = function (proto, propertiesObject) {
  function F() {}
  F.prototype = proto;
  const object = new F();
  if (propertiesObject) {
    Object.defineProperties(object, propertiesObject);
  }
  return object;
};
```

# instanceof

// ————————————————————————————————————————————————————————————————————————————————

## 介绍 instanceof 原理，并手动实现

```js
// 实际上是通过检查对象的原型链来确定对象是否由指定的构造函数创建的。
function myInstanceOf(instance, constructorFunc) {
  let proto = Object.getPrototypeOf(instance);

  while (proto !== null) {
    if (proto == constructorFunc.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

# 拷贝

// ————————————————————————————————————————————————————————————————————————————————

## 请手动实现一个浅拷贝

```js
function shallowCopy(obj) {
  const type = typeof obj;
  if (type !== "object" || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.slice();
  }

  const copy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = obj[key];
    }
  }
  return copy;
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 请手动实现一个深拷贝

```js
function deepCopy(source) {
  const type = typeof source;
  if (type !== "object" || source === null) {
    return source;
  }
  if (Array.isArray(source)) {
    return source.map((item) => deepCopy(item));
  }
  const copy = {};
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      copy[key] = deepCopy(source[key]);
    }
  }
  return copy;
}
```

# 函数柯里化

// ————————————————————————————————————————————————————————————————————————————————

## 实现一个函数柯里化

```js
function curryFunction(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...otherArgs) {
        return curried.apply(this, args.concat(otherArgs));
      };
    }
  };
}
```

// ————————————————————————————————————————————————————————————————————————————————

## 按要求实现一个 sum 函数

```js
// const a = sum(0); // => a === 0
// const b = sum(1)(2); // => b === 3
// const c = sum(4)(5); // c === 9
// const k = sum(n1)...(nk) // k === n1 + n2 + ... + nk

function sum(param) {
  let sum = 0;

  function add(y) {
    sum = sum + y;
    return add;
  }

  add.valueOf = function () {
    return sum;
  };

  return add();
}

const a = sum(0); // a === 0
const b = sum(1)(2); // b === 3
const c = sum(4)(5); // c === 9

console.log(a); // 输出 0
console.log(b); // 输出 3
console.log(c); // 输出 9

// 其实是cury化的实现：
function addCurry() {
  let arr = [...arguments];
  let fn = function () {
    arr.push(...arguments);
    return fn;
  };
  fn.toString = function () {
    return arr.reduce((a, b) => {
      return a + b;
    });
  };

  return fn;
}
```

# Promise 和异步

// ————————————————————————————————————————————————————————————————————————————————

## 用 reduce 链式调用 promise

```js
function composeAsync(...funcs) {
  return (params) => {
    return funcs.reduce((prev, cur) => {
      return prev.then(cur);
    }, Promise.resolve(params));
  };
}

const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```

## 批量并发请求数据

```js
/*
	可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数控制请求的并发度，当所有请求结束之后，需要执行 callback 回调函数。发请求的函数可以直接使用 fetch 即可
*/
function batchRequest(urls, max, callback) {
  const results = [];
  let index = 0;

  function fetchData(url) {
    return fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        results.push(data);
        next();
      })
      .catch((error) => {
        console.error("Error:", error);
        next();
      });
  }

  function next() {
    if (index < url.length) {
      const url = urls[index];
      index++;
      fetchData(url);
    } else if (results.length === urls.length) {
      callback(results);
    }
  }

  for (let i = 0; i < max; i++) {
    next();
  }
}
```

# 各种操作方法

// ————————————————————————————————————————————————————————————————————————————————

## 手写 call apply bind

```js
Function.prototype.myCall = function (context, ...args) {
  context = context || window;

  context.fn = this;

  const result = context.fn(...args);
  delete context.fn;
  return result;
};

Function.prototype.myApply = function (context, args) {
  context = context || window;
  context.fn = this;
  const result = context.fn(args);
  delete context.fn;
  return result;
};

// 差不多意思
Function.prototype.myBind = function (context) {
  const fn = this;

  return function F() {
    return fn.apply(context, arguments);
  };
};
```

## 动手实现一个 repeat 方法

```js
function repeat(func, times, wait) {
  return function () {
    let count = 0;
    let timer = null;

    let args = arguments;
    timer = setInterval(() => {
      count++;
      if (count <= times) {
        func(...args);
      } else {
        clearInterval(timer);
      }
    }, wait);
  };
}

const repeatFunc = repeat(console.log, 4, 3000);
// 调用这个 repeatFunc ("hellworld")，会alert4次 helloworld, 每次间隔3秒
repeatFunc("dada");
```

// ————————————————————————————————————————————————————————————————————————————————

## 手写 Stringify

```js
function jsonStringify(obj) {
  let type = typeof obj;
  if (
    type === "string" ||
    type === "number" ||
    type === "boolean" ||
    type === "null"
  ) {
    return obj.toString();
  } else if (type === "undefined" || type === "function" || type === "symbol") {
    return undefined;
  } else if (Array.isArray(obj)) {
    return `[${obj.map((item) => jsonStringify(item)).join(",")}]`;
  } else if (type === "object") {
    const objPairs = Object.keys(obj).map((key, index) => {
      return `"${key}": ${jsonStringify(obj[key])}`;
    });

    return `{${objPairs.join(",")}}`;
  } else {
    return undefined;
  }
}

console.log(
  jsonStringify({
    a: 1,
    b: 2,
    c: 3,
  })
);
```

## 手写 json parse

```js
function jsonParse(str) {
  return eval(`(${str})`);
}
```

# 浏览器事件

// ————————————————————————————————————————————————————————————————————————————————

## 请用 JavaScript 代码实现事件代理

```js
const parent = document.getElementById("parent");
parent.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("li clicked");
  }
});
```

// ————————————————————————————————————————————————————————————————————————————————

## 用原生 js 实现自定义事件

```js
// 创建一个新的自定义事件
var customEvent = new CustomEvent("myCustomEvent", {
  detail: {
    message: "这是一个自定义事件的消息",
  },
});

// 监听自定义事件
document.addEventListener("myCustomEvent", function (event) {
  console.log("收到自定义事件：", event.detail.message);
});

// 触发自定义事件
document.dispatchEvent(customEvent);
```
