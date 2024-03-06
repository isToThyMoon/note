---
title: 16.promise 和async await
categories:
  - 01.开发学习笔记 markdown
  - 06.JavaScript
  - 00.浏览器相关
---

# promise
Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。

首先promise出现背景？

javascript中，所有的代码都是单线程执行的。由于这个缺陷或者说特性， javascript中所有的网络操作，浏览器事件，都必须是异步执行。
**在没有promise之前** 异步执行需要用回调函数：

```javascript

function callback() {
    console.log('Done');
}
console.log('before setTimeout()');
setTimeout(callback, 1000); // 1秒钟后调用callback函数
console.log('after setTimeout()');

```

执行结果：

```
before setTimeout()
after setTimeout()
(等待1秒后)
Done
```
可见，异步操作会在将来的某个时间点触发一个函数调用。

可如果在回调中继续执行异步操作，就会继续嵌套回调，如此循环形成回调地狱，代码非常难读。

AJAX就是典型的异步操作：

```javascript

request.onreadystatechange = function () {
    if (request.readyState === 4) {
        if (request.status === 200) {
            return success(request.responseText);
        } else {
            return fail(request.status);
        }
    }
}

```

把回调函数success(request.responseText)和fail(request.status)写到一个AJAX操作里很正常，但是不好看，而且不利于代码复用。

有没有更好的写法？比如写成这样：

```javascript

var ajax = ajaxGet('http://...');
ajax.ifSuccess(success)
    .ifFail(fail);

```

这种链式写法的好处在于，先统一执行AJAX逻辑，不关心如何处理结果，然后，根据结果是成功还是失败，在将来的某个时候调用success函数或fail函数。

古人云：“君子一诺千金”，这种“承诺将来会执行”的对象在JavaScript中称为Promise对象。

Promise有各种开源实现，在ES6中被统一规范，由浏览器直接支持。



## 构造promise

Promise 是一个对象，它代表了一个异步操作的最终完成或者失败。本质上Promise是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。

Promise的构造函数接收一个参数，是函数，并且传入两个参数：resolve，reject，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数。其实这里用“成功”和“失败”来描述并不准确，按照标准来讲，resolve是将Promise的状态置为fullfiled，reject是将Promise的状态置为rejected。不过在我们开始阶段可以先这么理解，后面再细究概念。

```javascript

var p = new Promise(function(resolve, reject){
    // executor (生产者代码，"singer")
})

```

注意！只是new了一个对象，并没有调用它，我们传进去的函数就已经执行了，这是需要注意的一个细节。所以我们用Promise的时候一般是包在一个函数中，在需要的时候去运行这个函数


```javascript

function runAsync(){
    return new Promise((resolve, reject){
        // 执行一些异步操作
        setTimeout(function(){
            console.log('执行完成');
            resolve('随便什么数据');
        }, 2000);
    });
    });
}

```

包装好的函数最后，会return出Promise对象，也就是说，执行这个函数我们得到了一个Promise对象。Promise对象上有then、catch方法。

```javascript

runAsync().then(function(data){
    console.log(data);
    //后面可以用传过来的数据做些其他操作
});

```

在runAsync()的返回上直接调用then方法，then接收一个参数，是函数，并且会拿到我们在runAsync中调用resolve时传的的参数。运行这段代码，会在2秒后输出“执行完成”，紧接着输出“随便什么数据”。

then里面的函数就跟我们平时的回调函数一个意思，能够在runAsync这个异步任务执行完成之后被执行。这就是Promise的作用了，简单来讲，就是能把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方式执行回调函数。

虽然封装回调函数后 效果一样：

```javascript

function runAsync(callback){
    setTimeout(function(){
        console.log('执行完成');
        callback('随便什么数据');
    }, 2000);
}

runAsync(function(data){
    console.log(data);
});
```

好处在于， 当callback也是一个异步操作，执行完成后也需要有相应的回调函数时，在定义新回调函数callback2就显得非常臃肿愚蠢，而Promise的优势在于，可以在then方法中继续写Promise对象并返回，然后继续调用then来进行回调操作。

## 链式操作的用法
所以，从表面上看，Promise只是能够简化层层回调的写法，而实质上，Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback函数要简单、灵活的多。所以使用Promise的正确场景是这样的：

```javascript

runAsync1()
.then(function(data){
    console.log(data);
    return runAsync2();
})
.then(function(data){
    console.log(data);
    return runAsync3();
})
.then(function(data){
    console.log(data);
});

# 定义
function runAsync1(){
    return new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务1执行完成');
            resolve('随便什么数据1');
        }, 1000);
    });
}

function runAsync2(){
    return new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务2执行完成');
            resolve('随便什么数据2');
        }, 2000);
    });        
}

function runAsync3(){
    return new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('异步任务3执行完成');
            resolve('随便什么数据3');
        }, 2000);
    });          
}

```

在then方法中，你也可以直接return数据而不是Promise对象，在后面的then中就可以接收到数据了

## 顺序执行多个异步
```js
[func1, func2, func3]
  .reduce((p, f) => p.then(f), Promise.resolve())
  .then((result3) => {
    /* 使用 result3 */
  });
  
// 上面的代码等同于：

Promise.resolve()
  .then(func1)
  .then(func2)
  .then(func3)
  .then((result3) => {
    /* 使用 result3 */
  });
  
```
在这个例子中，我们使用 reduce 把一个异步函数数组变为一个 Promise 链。

我们也可以写成可复用的函数形式，这在函数式编程中极为普遍：

```js
const applyAsync = (acc, val) => acc.then(val);
const composeAsync =
  (...funcs) =>
  (x) =>
    funcs.reduce(applyAsync, Promise.resolve(x));
```
composeAsync() 函数将会接受任意数量的函数作为其参数，并返回一个新的函数，而该函数又接受一个初始值，该组合的参数传递管线如下所示：
```js
const transformData = composeAsync(func1, func2, func3);
const result3 = transformData(data);
```

顺序组合还可以使用 async/await 更简洁地完成：
```js
let result;
for (const f of [func1, func2, func3]) {
  result = await f(result);
}
/* 使用最后的结果（即 result3）*/
```
然而，在你顺序组合 Promise 前，请考虑是否真的有必要——因为它们会阻塞彼此，除非一个 Promise 的执行依赖于另一个 Promise 的结果，否则最好并发运行 Promise。


## 并行执行Promise.all([]) Promise.allSettled([])
```js
Promise.all([func1(), func2(), func3()]).then(([result1, result2, result3]) => {
  /* 使用 result1、result2 和 result3 */
});
```
如果数组中的某个 Promise 被拒绝，Promise.all() 就会立即拒绝返回的 Promise，并终止其他操作。
这可能会导致一些意外的状态或行为。
Promise.allSettled() 是另一个组合工具，它会等待所有操作完成后再处理返回的 Promise。

## 竞态
多个异步并行，最快的获得settled，其他就不执行了。

Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。这个返回的 promise 会随着第一个 promise 的敲定而敲定。

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// Expected output: "two"
```

返回值，一个 Promise，会以 iterable 中第一个敲定的 promise 的状态异步敲定。换句话说，如果第一个敲定的 promise 被兑现，那么返回的 promise 也会被兑现；如果第一个敲定的 promise 被拒绝，那么返回的 promise 也会被拒绝。如果传入的 iterable 为空，返回的 promise 就会一直保持待定状态。如果传入的 iterable 非空但其中没有任何一个 promise 是待定状态，返回的 promise 仍会异步敲定（而不是同步敲定）。


# generator
和python的生成器一样的原理，只是js里调用next方法和python里的send方法一样效果。
待更新。（不更也行，看专栏。）

# async await
async保证了函数肯定会返回一个Promise对象，即这个函数总是返回一个 promise，其非promise对象的返回值将自动被包装在一个 resolved 的 promise 中。
例如，下面这个函数返回一个结果为 1 的 resolved promise，让我们测试一下：
```js
async function f() {
  return 1;
}

f().then(alert); // 1
```
我们也可以显式地返回一个 promise，结果是一样的：
```js
async function f() {
  return Promise.resolve(1);
}

f().then(alert); // 1
```
所以说，async 确保了函数返回一个 promise，也会将非 promise 的值包装进去。很简单，对吧？但不仅仅这些。还有另外一个叫 await 的关键词，它只在 async 函数内工作，也非常酷。

await只能用在async定义的函数内部 它保证在Promise函数决议后 js引擎再继续运行下面代码
经过await: `let promise = await new Promise()`   Promise对象自动运行返回resolved的结果 promise变量接收这个结果，关键字 await 让 JavaScript 引擎等待直到 promise 完成（settle）并返回结果。

如果不加await 你会发现let promise = new Promise()接受到的只是一个Promise对象

其实是Promise中then catch的简明易懂的写法

```javascript
function log(){
    console.log.apply(console, arguments)
};

function runAsync(x){
    return new Promise(function(resolve, reject){
       setTimeout(function(){
        if(x==1){
            resolve('这是1');
        }
        else reject('这不是1');
       }, 2000);

    });
};

runAsync(2).then(function(data){
    log(data);
}).catch(function(data){
    log(data);
})

//用async改写：

async function runAsync(x){
    let promise = await new Promise(function(resolve, reject){
        setTimeout(function(){
            if(x==1){
                resolve('这是1');
            }
            else reject('这不是1');
           }, 2000);
    });

    log(promise);

}

runAsync(1);
```