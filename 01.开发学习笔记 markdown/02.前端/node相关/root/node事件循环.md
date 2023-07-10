# 

```js

// console.log('start')
// setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(function() {
//     console.log('promise1')
//   })
// }, 0)
// setTimeout(() => {
//   console.log('timer2')
//   Promise.resolve().then(function() {
//     console.log('promise2')
//   })
// }, 0)
// Promise.resolve().then(function() {
//   console.log('promise3')
// })
// console.log('end')

// start   
// end     
// promise3
// timer1  
// promise1
// timer2
// promise2

// 所谓node事件循环的6个阶段，就是把浏览器事件循环的一个宏任务队列模型拆成多个，然后按一定顺序和规则去清空。全部清空一次叫一次node事件循环。

// 外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…
// timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
// I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
// idle, prepare 阶段：仅 node 内部使用
// poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
// check 阶段：执行 setImmediate() 的回调
// close callbacks 阶段：执行 socket 的 close 事件回调

// 注意：上面六个阶段都不包括 process.nextTick()
// 每一个阶段的宏任务处理完毕，在node11之后的版本会去清空当前的微任务队列。如promise。这是为了和浏览器端的事件机制统一。
// 有点不同的是，nextTick优先级会高于所有其他的微任务。也就是每个阶段的宏任务处理完毕，会去检查并执行nextTick回调，再清空其他微任务。


// 最重要的Poll 阶段，取出新完成的 I/O 事件；执行与 I/O 相关的回调（除了关闭回调，计时器调度的回调和 setImmediate 之外，几乎所有其他的这些回调） 适当时，node 将在此处阻塞。 完成后如果timer有到期会跳转到timer执行，没有的话检查immediate 有的进入check阶段，没有的话适当阻塞。

// 轮询阶段具有两个主要功能：

// 计算应该阻塞并 I/O 轮询的时间
// 处理轮询队列 (poll queue) 中的事件
// 当事件循环进入轮询 (poll) 阶段并且没有任何计时器调度 (timers scheduled) 时，将发生以下两种情况之一：

// 如果轮询队列 (poll queue) 不为空，则事件循环将遍历其回调队列，使其同步执行，直到队列用尽或达到与系统相关的硬限制为止 (到底是哪些硬限制？)。
// 如果轮询队列为空，则会发生以下两种情况之一：
// 如果已通过 setImmediate 调度了脚本，则事件循环将结束轮询 poll 阶段，并继续执行 check 阶段以执行那些调度的脚本。
// 如果脚本并没有 setImmediate 设置回调，则事件循环将等待 poll 队列中的回调，然后立即执行它们。
// 一旦轮询队列 (poll queue) 为空，事件循环将检查哪些计时器 timer 已经到时间。 如果一个或多个计时器 timer 准备就绪，则事件循环将返回到计时器阶段，以执行这些计时器的回调。



// 理解下是轮询poll阶段的处理例子
// 从技术上讲，轮询 (poll) 阶段控制计时器的执行时间。
// 例如，假设你计划在 100 毫秒后执行回调，然后脚本开始异步读取耗时 95 毫秒的文件：

const fs = require('fs');

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});

// 当事件循环进入 poll 阶段时，它有一个空队列（fs.readFile 尚未完成），因此它将等待直到达到最快的计时器 timer 阈值为止。 等待 95 ms 过去时，fs.readFile 完成读取文件，并将需要 10ms 完成的其回调添加到轮询 (poll) 队列并执行。 回调完成后，队列中不再有回调，此时事件循环已达到最早计时器 (timer) 的阈值 (100ms)，然后返回到计时器 (timer) 阶段以执行计时器的回调。 在此示例中，您将看到计划的计时器与执行的回调之间的总延迟为 105ms。
// 注意：为防止轮询 poll 阶段使事件循环陷入饥饿状态 (一直等待 poll 事件)，libuv 还具有一个硬最大值限制来停止轮询。



// var i = 0;
// var start = new Date();
// function foo () {
//     i++;
//     if (i < 1000) {
//         setImmediate(foo);
//     } else {
//         var end = new Date();
//         console.log("Execution time: ", (end - start));
//     }
// }
// foo();


// var i = 0;
// var start = new Date();
// function foo () {
//     i++;
//     if (i < 1000) {
//         setTimeout(foo, 0);
//     } else {
//         var end = new Date();
//         console.log("Execution time: ", (end - start));
//     }
// }
// foo();


// // 同步代码。。
// setTimeout(() => {
//     console.log('执行setTimeout回调')
// }, 0);
// setImmediate(()=>{console.log('执行setImmediate回调')})
// // 同步代码。。

// setTimeout(() => {}, 0);其实是1毫秒后执行，而setImmediate 会减少额外的检查。因此 setImmediate 会执行更快一些。它也放置在轮询阶段之后，因此来自于任何一个到来的请求 setImmediate 回调将会立即被执行。

// 这段代码执行结果，谁先谁后其实不确定，主要看机器性能：机器性能强，则在执行完同步代码时，还没有耗时 1ms，则 setTimeout 的 timer 还没到，就会执行下面的 Check Phase，从而先打印“执行setImmediate回调”。机器性能弱，则在执行完同步代码时，已耗时 1ms，则先执行 Timers Phase，先打印“执行setTimeout回调”。



// nextTick的处理
// var i = 0;
// function foo(){
//   i++;
//   if(i>20){
//     return;
//   }
//   console.log("foo");
//   setTimeout(()=>{
//     console.log("setTimeout");
//   },0);
//   process.nextTick(foo);
// }   
// setTimeout(foo, 2);

// 结果会连续打印20个foo后 打印20个setTimeout。为什么？ 2毫秒后执行foo函数，timer阶段执行该回调foo()
// 打印出foo后 遇到0秒的setTimeout 先注册事件，0秒后推入timer阶段的事件队列，但是注意 随后有process.nextTick(foo)
// 按node11后的统一规范规则，一阶段宏任务执行完毕后会依次清空nextTick队列和微任务队列。于是先执行nextTick回调foo，同样的逻辑发生，依次打印20个foo，注册了20个setTimeout的回调其实都到期在排队等待推入调用栈执行，但是必须在nextTick和本阶段的微任务之后排队。所以在20个foo后，开始清空timer阶段的宏任务回调，依次执行这20个回调函数打印出‘setTimeout’。
// 当心，如果这里的递归调用很多很耗时，其实nextTick就阻塞你的进程了。这个和微任务不断发prmise阻塞是一个道理。

// setImmediate 和 process.nextTick() 都命名错了。所以功能上，setImmediate 在下一个 tick 执行，nextTick 是马上执行的。

```