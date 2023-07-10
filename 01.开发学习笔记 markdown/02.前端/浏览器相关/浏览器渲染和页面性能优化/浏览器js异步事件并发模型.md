---
title: 00.浏览器组件 js异步事件模型
categories:
  - 01.开发学习笔记 markdown
  - 06.JavaScript
  - 00.浏览器相关
---

http://lynnelv.github.io/js-event-loop-browser

macro task 宏任务： script（同步代码），setTimeout等，I/O操作 UI渲染 
包含执行整体的js代码，事件回调，XHR回调，定时器（setTimeout/setInterval/setImmediate），IO操作，UI render

micro task 微任务：promise process.nextTick等
更新应用程序状态的任务，包括promise回调，MutationObserver，process.nextTick，Object.observe

微任务的设置就是为了在同步代码（或宏任务）执行过程中添加并随后执行一些紧急高优先级的任务。

伪代码：

```
while(true){
    queue = getNextQueque();
    task = queue.pop();
    execute(task);
    while(microtaskQueue.hasTasks()){
        doMicroTask();
    }
    if(isRepainTime()){
        animationTasks = animationQueque.copyTasks();
        for(task in animationTasks){
            doAnimationTask(task);
        }
        repaint();
    }
    
}
```

# 一些总结和basic concepts:
* 任务队列：（宏）任务（消息）队列是一个先进先出的队列，它里面存放着各种任务（消息）。注意只有异步任务完成后其回调才会被推入队列。
* when a task is pushed into a queue(micro/macro),we mean preparing work is finished, so the task can be executed now.
* 
* 事件循环（event loop）：事件循环是指主线程重复从任务（消息）队列中取任务（消息）、执行的过程。取一个任务（消息）并执行的过程叫做一次循环。事件循环中有事件两个字的原因：任务（消息）队列中的每条消息实际上都对应着一个事件——dom事件。

* 一个event loop可以从一个或者多个task queue中取任务（task queue is macrotask queue）

* 每个event loop只有一个microtask queue.（也可以说在每个处理单个macrotask的循环周期内只能有一个microtask queue 这样是为了保证微任务的上下文环境一致，比如不会发生鼠标移动 http请求 渲染页面改变）

* task queue = macrotask queue != microtask queue，a task may be pushed into macrotask queue, or microtask queue



**执行顺序**：
1.首先一整个脚本作为宏任务执行，运行同步代码，宏任务微任务分别入各自队列，如果有异步操作（由对应的线程如浏览器触发线程、定时器线程、ajax线程处理），**获得结果后**再将回调放入task queue

2.同步代码结束检查task queue中最早的task（回调）并放入call stack（调用栈 执行上下文栈）运行，运行结束后将task退栈，如果是嵌套函数就依次进退栈

3.一个task结束后处理该event loop中的microtask queue，从先到后选择microtask queue中的task依次运行（如果microtask执行时继续增加了新的microtask也会追加到该queue执行）

4.设置 hasARenderingOpportunity 为 false；（同一轮宏微任务后固定将hasARenderingOpportunity设为false，后面浏览器还会有判断来设置该值，有渲染时机才会执行渲染。）

5.微任务清空后进入**准备渲染**阶段（此时仍未脱离js引擎），判断是否需要渲染重绘。这里有一个 rendering opportunity 的概念，也就是说不一定每一轮 event loop 都会对应一次浏览器渲染，要根据屏幕刷新率、页面性能、页面是否在后台运行来共同决定，通常来说这个渲染间隔是固定的（简单理解，性能正常 无后台 屏幕刷新率为60hz，那么极限情况每1/60秒获得一个rendering opportunity）。（所以多个 task 很可能在一次渲染之间执行，例如把几次视图更新累积到一起重绘，重绘前会通知requestAnimationFrame回调函数执行），一般来说渲染时机最短每16.7ms出现一次。如果当前的环境不支持这个刷新率会自动降低渲染时机出现的频率，其实就是跟着机器性能和显示器刷新率来。
（注：视图渲染发生在微任务队列被执行完毕之后，渲染引擎和js引擎互斥，也就是说执行任务的耗时会影响视图渲染的时机，通常浏览器根据显示器的刷新频率60fps刷新页面，大概16.7ms刷新一帧，所以说如果要页面刷新顺畅，单个事件循环内的macrotask和所以的microtask最好能在16.7ms内执行完毕（一般没问题，js引擎处理速度非常快））

5.**准备渲染**（更新渲染update render）阶段，
1. 遍历当前浏览上下文中所有的 document ，必须按在列表中找到的顺序处理每个 document 。

2. 渲染时机（Rendering opportunities）：如果当前浏览上下文中没有到渲染时机则将所有 docs 删除，取消渲染（此处是否存在渲染时机由浏览器自行判断，根据硬件刷新率限制、页面性能或页面是否在后台等因素）。（这里有个疑问，同步代码timer1 rAF1 timer2 promise，执行时间都非常短，小于1ms，promise微任务完成后，离16.7ms结束还有很长时间，该轮事件循环进入准备渲染阶段，判断该帧有渲染时机，rAF回调不为空，执行rAF1回调，此时离帧尾结束还很早，还未重绘，js引擎肯定不会等待，于是js引擎进入下一事件循环，timer1 timer2定时为0且都有增加rAF分别为rAF2 rAF3，timer1内代码执行完毕，清空本轮微任务队列，遇到rAF2将rAF2回调加入rAF回调队列， 进入timer1宏任务的更新渲染阶段，此时上一次rAF1回调所对应的第一帧渲染还未执行，也就是说timer1点更新渲染阶段并不会获得渲染时机，浏览器判断没有渲染时机，将所有docs删除，取消渲染，进入下一个宏任务timer）

3. 如果当前文档不为空（即有渲染时机 可以渲染），设置 hasARenderingOpportunity 为 true 。

4. 不必要的渲染（Unnecessary rendering）：如果浏览器认为更新文档的浏览上下文的呈现不会产生可见效果且文档的 animation frame callbacks 是空的，则取消渲染。
5. 从 docs 中删除浏览器认为出于其他原因最好跳过更新渲染的文档。
6. 以下是需要渲染时进行的处理。
7. 如果文档的浏览上下文是顶级浏览上下文，则刷新该文档的自动对焦候选对象。
8. 处理 resize 事件，传入一个 performance.now() 时间戳。
9. 处理 scroll 事件，传入一个 performance.now() 时间戳。
10. 处理媒体查询，传入一个 performance.now() 时间戳。
11. 运行 CSS 动画，传入一个 performance.now() 时间戳。
12. 处理全屏事件，传入一个 performance.now() 时间戳。
13. 执行 requestAnimationFrame 回调，传入一个 performance.now() 时间戳。
14. 执行 intersectionObserver 回调，传入一个 performance.now() 时间戳。
15. 对每个 document 进行绘制。（此时layout完成 下面由渲染线程完成paint）
16. js引擎进入休眠状态 此时render引擎（完整的dom cssdom render树 显存）可工作进行**页面渲染**（执行render） 更新 ui 并呈现。

17. 判断 task队列和microTask队列是否都为空，如果是的话且渲染时机变量hasARenderingOpportunity为false，则进行 Idle 空闲周期的算法，判断是否要执行 requestIdleCallback 的回调函数。
18. 结束

6.重复 event loop继续监听task queue如果有task，进入步骤2



**注意**：
1.when a task (in macrotask queue) is running, new events may be registered. So new tasks may be created. Below are two new created tasks:
1. promiseA.then()'s callback is a task：
    * promiseA is resolved/rejected:  the task will be pushed into microtask queue in current round of event loop.
    * promiseA is pending:  the task will be pushed into microtask queue in the future round of event loop(may be next round)
2. setTimeout(callback,n)'s callback is a task, and will be pushed into macrotask queue, even n is 0;

2.task in microtask queue will be run in the current round,while task in macrotask queue has to wait for next round of event loop.如果你在本轮event loop循环注册的很多microtask 那么引擎就一直在处理microtask了

3.we all know callback of "click","scroll","ajax","setTimeout"... are tasks,however we should also remember js codes as a whole in script tag is a task(a macrotask) too.


# 详细解释：事件循环、微任务和宏任务

js是单程处理任务的，如果js全部代码都是同步执行的，这会引发很严重的问题，比方说我们要从远端获取一些数据，难道要一直循环代码去判断是否拿到了返回结果么？就像去饭店点餐，肯定不能说点完了以后就去后厨催着人炒菜的，会被揍的。
于是就有了异步事件的概念，注册一个回调函数，比如说发一个网络请求，我们告诉主程序等到接收到数据后通知我，然后我们就可以去做其他的事情了。
然后在异步完成后，会通知到我们，但是此时可能程序正在做其他的事情，所以即使异步完成了也需要在一旁等待，等到程序空闲下来才有时间去看哪些异步已经完成了，可以去执行。

浏览器中 JavaScript 的执行流程和 Node.js 中的流程都是基于 事件循环的。

浏览器的js引擎相关主要组件包括调用栈，事件循环，任务队列（又叫消息队列、task queue macrotask queue）和Web API。 像setTimeout，setInterval和Promise这样的全局函数不是JavaScript的一部分，而是 Web API 的一部分。 JavaScript 环境的可视化形式如下所示：(仅仅是宏任务部分)

注意这里的stack是call stack调用栈 不是变量存储栈

主线程运行的时候，js runtime engine产生堆（heap）*memory*和栈（stack）*functions*，栈中的代码调用各种外部API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。
![v2-6789cfb046f1e64ef8fd2cea053ad6b0_hd](https://raw.githubusercontent.com/ayrikiya/pic-store/main/note/v2-6789cfb046f1e64ef8fd2cea053ad6b0_hd.jpg)

JS调用栈call stack是后进先出(LIFO)的。引擎每次从堆中取出一个函数，然后从上到下依次运行代码。每当它遇到一些异步代码，如setTimeout，它就把它交给Web API(箭头1)。因此，每当事件被**触发**时，callback 才会被发送到任务队列（箭头2）。

怎么理解呢，如setTimeout这个函数，是经过指定时间后，把要执行的任务（回调函数）加入到task queue中，而任务队列中的都是已经完成的异步操作，而不是说注册一个异步任务就会被放在这个任务队列中，所以setTimeout是在计时完成后把完成的异步结果回调函数放进task queue。
又因为是单线程任务要一个一个执行，如果主线程前面的任务需要的时间太久，那么只能等着，等call stack为空，所有函数都退栈后，这个回调函数才被压入call stack执行。

事件循环(Event loop)不断地监视任务队列(Task Queue)，并按它们排队的顺序一次处理一个回调。每当调用堆栈(call stack)为空时，Event loop获取回调并将其放入堆栈(stack )(箭头3)中进行处理。请记住，如果调用栈不是空的，则事件循环不会将任何回调推入栈。
一个task处理为一个循环，结束task后立马处理microtask queue的所有回调。然后结束循环，进入下一轮event loop

例子：
```js
function foo() {
  setTimeout(foo, 0); // 是否存在堆栈溢出错误?
};   

foo();
```

1.调用 foo()会将foo函数放入调用栈(call stack)。
2.在处理内部代码时，JS引擎遇到setTimeout。
3.然后将foo回调函数传递给WebAPIs(箭头1)线程处理，并从函数返回，调用堆栈再次为空
4.计时器被设置为0，因此foo将被发送到任务队列<Task Queue>(箭头2)。
5.由于调用堆栈是空的，事件循环将选择foo回调并将其推入调用堆栈进行处理。
6.进程再次重复，堆栈不会溢出。

js引擎存在monitoring process进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去Event Queue那里检查是否有等待被调用的函数。

异步操作又分宏任务和微任务。而一个宏任务在执行的过程中，是可以添加一些微任务的。
每完成一个宏任务，检查还有没有微任务需要处理。在当前的微任务没有执行完成时，是不会执行下一个宏任务的。
下面具体说明。

# promise 和setTimeOut 异步操作

大多数时候，开发人员假设在事件循环<event loop>图中只有一个任务队列。但事实并非如此，我们可以有多个任务队列。由浏览器选择其中的一个队列并在该队列中处理回调<callbacks>。

在底层来看，JavaScript中有宏任务和微任务。setTimeout回调是宏任务，而Promise回调是微任务。

主要的区别在于他们的执行方式。宏任务在单个循环周期中一次一个地推入堆栈，但是微任务队列总是在执行后返回到事件循环之前清空。因此，如果你以处理条目的速度向这个队列添加条目，那么你就永远在处理微任务。只有当微任务队列为空时，事件循环才会重新渲染页面。

现在，当你在控制台中运行以下代码段
```
function foo() {
  return Promise.resolve().then(foo);
};
```
每次调用'foo'都会继续在微任务队列上添加另一个'foo'回调，因此事件循环无法继续处理其他事件（滚动，单击等），直到该队列完全清空为止。 因此，它会阻止渲染。



# 题例：
```js
setTimeout(()=>{
  console.log('setTimeout1')
},0)

let p = new Promise((resolve,reject)=>{
  console.log('Promise1')
  resolve()
})
p.then(()=>{
  console.log('Promise2')    
})
```
输出结果是Promise1，Promise2，setTimeout1

因为Promise是microtasks，会在同步任务执行完后会去清空microtasks queues， 最后清空完微任务再去宏任务队列取值。

一个终极混合的例子：
```js
let promise = new Promise(function(resolve, reject) {
    console.log('promise中setTimeout开始前')
    setTimeout(() => {
        console.log("宏任务内部1")
        resolve("done!")
        console.log("宏任务内部2")
    }, 1000);
    console.log('promise中setTimeout后')
  });
  
  console.log("常规script1")
  // resolve 运行 .then 中的第一个函数
  promise.then(
    result => console.log(result), // 1 秒后显示 "done!"
    error => console.log(error) // 不运行
  );

  console.log("常规script2")
```
结果是：
promise中setTimeout开始前
promise中setTimeout后
常规script1
常规script2
（此处常规脚本完毕，按流程应该执行microtask 但是此时promise的状态未被settled then中的函数没有被注册进microtask 所以本轮event loop结束）
（执行下一轮event loop 1秒后发现有一个setTimeOut到期，回调函数放入macrotask，那么开始执行回调函数，依次执行完毕三条语句）
宏任务内部1
（执行resolve 修改promise的state 此时then内函数会立刻收到state改变，将回调函数放入microtask）
宏任务内部2
（macrotask执行完毕，开始清空microtask）
done!


