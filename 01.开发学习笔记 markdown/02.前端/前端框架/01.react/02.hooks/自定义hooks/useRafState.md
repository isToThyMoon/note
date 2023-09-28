# useRafState

只在 [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) callback 时更新 state，一般用于性能优化。

```jsx
function useRafState(initialState) {
  const ref = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value) => {
    cancelAnimationFrame(ref.current);

    ref.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useUnmount(() => {
    cancelAnimationFrame(ref.current);
  });

  return [state, setRafState] as const;
}
```

和useState不同在于，useRafState的setState会在下一个animation Frame执行前执行，一般来说是16.7ms（1/60hz）

使用了一层requestAnimationFrame包裹setState的调用。它确保requestAnimationFrame的回调函数会在下一帧前执行。
requestAnimationFrame（callback） callback下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。

当我们监听例如resize或者scroll这样频繁触发的事件，一帧也就是16.7ms内触发的事件过多而超过了DOM可以更新的极限，这就回产生一些性能的问题。
我们并不想16.7ms内还未发生渲染但每次都触发回调，渲染dom。也就是需要防抖。

requestAnimationFrame做到内置的这样的功能，它是做动画效果的，让requestAnimationFrame回调函数在下一个animation Frame执行。

# requestAnimationFrame

先看官方介绍：
window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

根据标准文档中的定义——“window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画”，再加上自己的一个测试，可以了解到在一个浏览器的刷新间隔内，如果多次触发了事件回调，这些回调的执行只是推迟到了下一次刷新前一起调用，可以打个比方比如“公司周一、二、三决定要开的几次会议被推迟到了周四一起处理”，总的来说可以理解为“一周中通过一天的加班换取剩余几天的空闲或者说轻松”这样的一种模式。

具体理解这个api需要理解事件循环机制，

update rendering（视图渲染）发生在本轮事件循环的microtask队列被执行完之后，也就是说执行任务的耗时会影响视图渲染的时机。通常浏览器以每秒60帧（60fps）的速率刷新页面，据说这个帧率最适合人眼交互，大概16.7ms渲染一帧，所以如果要让用户觉得顺畅，单个macrotask及它相关的所有microtask最好能在16.7ms内完成。

但也不是每轮事件循环都会执行视图更新，浏览器有自己的优化策略，例如把几次的视图更新累积到一起重绘，重绘之前会通知requestAnimationFrame执行回调函数，也就是说requestAnimationFrame回调的执行时机是在一次或多次事件循环的UI render阶段。

如下代码：

```
setTimeout(function() {console.log('timer1')}, 0)

requestAnimationFrame(function(){
	console.log('requestAnimationFrame')
})

setTimeout(function() {console.log('timer2')}, 0)

new Promise(function executor(resolve) {
	console.log('promise 1')
	resolve()
	console.log('promise 2')
}).then(function() {
	console.log('promise then')
})

console.log('end')

```

可能结果1是：
promise 1
promise 2
end
promise then
requestAnimationFrame
timer1
timer2

可能结果2是：
promise 1
promise 2
end
promise then
timer1
timer2
requestAnimationFrame

可以看到，结果1中requestAnimationFrame()是在一次事件循环后执行，而在结果2，它的执行则是在三次事件循环结束后。
这里第2个结果就是前两次事件循环浏览器的策略并没有进行视图更新的渲染，而是合并了3次的视图更新一起重绘，然后在重新绘制前通知requestAnimationFrame的回调函数执行。

所以定时器的宏任务一定会跟着一个渲染吗？不是。有时候是会发生渲染合并的。

如果requestAnimationFrame的执行非常耗费时间呢？按第一种的策略，它会阻塞后面的js代码的执行

```
setTimeout(function() {
  for(let i = 0; i < 50000; i++){
    console.log('耗时操作timer1')
    if(i%10000===0){
      let ele = document.createElement('div')
      ele.innerText = 'timer1 %%';
      document.querySelector('body').appendChild(ele)
    }
  }
  let ele = document.createElement('div')
  ele.innerText = 'timer1';
  document.querySelector('body').appendChild(ele)

  console.log('timer1')
}, 0)

requestAnimationFrame(function(){
  for(let i = 0; i < 1000000; i++){
    console.log('耗时操作')
  }

  let ele = document.createElement('div')
  ele.innerText = 'requestAnimationFrame';
  document.querySelector('body').appendChild(ele)

	console.log('requestAnimationFrame')
})

setTimeout(function() {
  for(let i = 0; i < 50000; i++){
    console.log('耗时操作timer2')
    if(i%10000===0){
      let ele = document.createElement('div')
      ele.innerText = 'timer2 %%';
      document.querySelector('body').appendChild(ele)
    }
  }

  let ele = document.createElement('div')
  ele.innerText = 'timer2';
  document.querySelector('body').appendChild(ele)

  console.log('timer2')
}, 0)

new Promise(function executor(resolve) {

  document.querySelector('body').innerText='body'

  let ele = document.createElement('div')
  ele.innerText = 'promise 1';
  document.querySelector('body').appendChild(ele)

   console.log('promise 1')
	resolve()
	console.log('promise 2')
}).then(function() {
	console.log('promise then')
})

console.log('end')

```

requestAnimationFrame里的for循环调的很高，是一个可感知的延迟操作，实际页面渲染如下：

body
promise 1
requestAnimationFrame
timer1 %%
timer1 %%
timer1 %%
timer1 %%
timer1 %%
timer1
timer2 %%
timer2 %%
timer2 %%
timer2 %%
timer2 %%
timer2

注意
body
promise 1
requestAnimationFrame
这三个div不是瞬间渲染的，在这三个div渲染出来之前有一个很长时间的白屏，说明这段白屏时间是没有触发浏览器重绘的。
我们梳理下，

1. js引擎执行script的代码，遇到一个timer1加入浏览器定时器线程，会在计时4ms后加入（宏）任务队列。
（HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），不得低于4毫秒，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。这时使用requestAnimationFrame()的效果要好于setTimeout()。）
2. 遇到requestAnimationFrame，注册回调函数。等待需要重绘前调用。
3. 遇到一个timer2加入浏览器定时器线程，会在计时4ms后加入宏任务队列。
4. 遇到Promise，执行execute函数，body的innertext为“body”，body尾部加入div内容为‘promise 1’，立即resolve()，没有异步操作，注册then回调函数到微任务队列。
5. 同步script代码执行完毕，打印‘end’，本轮事件循环开始检查并清空微任务队列，发现不为空，执行promise的then成功回调。
6. 本轮事件循环进入判定是否需要重新渲染阶段，判断更新渲染会不会带来视觉上的改变，map of animation frame callbacks是否为空，任1满足进入下一阶段，否则跳过渲染。这里requestAnimationFrame不为空，进入下一阶段，确定重新渲染
7. 对于需要渲染的文档，如果窗口的大小发生了变化，执行监听的 resize 方法。对于需要渲染的文档，如果页面发生了滚动，执行 scroll 方法。对于需要渲染的文档，执行帧动画回调，也就是 requestAnimationFrame 的回调。对于需要渲染的文档， 执行 IntersectionObserver 的回调。对于需要渲染的文档，重新渲染绘制用户界面。判断 task队列和microTask队列是否都为空，如果是的话，则进行 Idle 空闲周期的算法，判断是否要执行 requestIdleCallback 的回调函数。
8. 对上一阶段其实只用到执行requestAnimationFrame回调，这个回调有一个for循环高耗时任务，promise执行函数创建的div：‘body’ ‘promise 1’这里虽然已经做了js修改，但并不会渲染，因为还没走到渲染引擎执行的逻辑（渲染引擎和js引擎是互斥的），此时页面白屏，无任何重新渲染发生，等requestAnimationFrame的高耗时for循环结束，执行了一个dom操作，body下增加一个内容为‘requestAnimationFrame’的div，本轮事件循环真正结束，对于这些需要渲染的文档，切换到渲染引擎，构建dom树，css树，合并dom树css树构建render树，重排，重绘，合并图层，放入计算机显存，等待下一帧显卡刷新，渲染到页面。
9. 开始新一轮事件循环，执行timer1的回调宏任务，
10. 。。。

所以注意，requestAnimationFrame回调其实也是卡渲染的。rAF在浏览器决定渲染之前给你最后一个机会去改变 DOM 属性，然后很快在接下来的绘制中帮你呈现出来，所以这是做流畅动画的不二选择。如果所有等待渲染的js操作都结束，浏览器以16.7ms的频率通知rAF回调执行，也就是说，每次显示器刷新有16.7ms的间隔，浏览器确保通知rAF在16.7ms的开头执行操作，对dom的修改会在16.7ms结束时这一帧渲染出结果动画。

//实际打印时这边打印 50000耗时操作timer1 会严重滞后于页面的渲染，页面早渲染完了，它还在打印‘50000耗时操作timer1’ ，认真思考了下其实不用管，这是chrome浏览器console的问题，实际上js执行是非常快的，50000次for循环瞬间就完成了，所以页面实际渲染非常快，但是console接口可能要调用chrome的接口，显得非常bug，不合逻辑，其实不用管，代码执行顺序还是按照事件循环规则执行的。

再一个例子：

```
console.log('同步开始',performance.now())
setTimeout(() => {
  console.log("sto1", performance.now())
  let ele = document.createElement('div')
  ele.innerText = 'timer1 %%';
  document.querySelector('body').appendChild(ele)
  queueMicrotask(() => console.log("mic3", performance.now()))
  requestAnimationFrame(() => {
    console.log("rAF1", performance.now())
    requestAnimationFrame(() => {
      console.log("rAF11", performance.now())
      requestAnimationFrame(() => {
        console.log("rAF111", performance.now())
      })
    })
  })
},0)
requestAnimationFrame(() => {
  console.log("rAF0", performance.now())
  requestAnimationFrame(() => {
    console.log("rAF00", performance.now())
  })
})
setTimeout(() => {
  console.log("sto2", performance.now())
  let ele = document.createElement('div')
  ele.innerText = 'timer2 %%';
  document.querySelector('body').appendChild(ele)
  queueMicrotask(() => console.log("mic4", performance.now()))
  requestAnimationFrame(() => {
    console.log("rAF2", performance.now())
    requestAnimationFrame(() => {
      console.log("rAF22", performance.now())
      requestAnimationFrame(() => {
        console.log("rAF222", performance.now())
      })
    })
  })

},0)

setTimeout(() => {
  console.log("sto3", performance.now())
  let ele = document.createElement('div')
  ele.innerText = 'timer3 %%';
  document.querySelector('body').appendChild(ele)
  queueMicrotask(() => console.log("mic5", performance.now()))
  requestAnimationFrame(() => {
    console.log("rAF3", performance.now())
    requestAnimationFrame(() => {
      console.log("rAF33", performance.now())
      requestAnimationFrame(() => {
        console.log("rAF333", performance.now())
      })
    })
  })

},0)

queueMicrotask(() => console.log("mic1",performance.now()))
queueMicrotask(() => console.log("mic2",performance.now()))
console.log('同步结束',performance.now())

```

打印出：
同步开始 5536.399999976158
同步结束 5536.600000023842
mic1 5536.699999928474
mic2 5536.699999928474
undefined
rAF0 5536.899999976158
sto1 5539.799999952316
mic3 5540
sto2 5540.100000023842
mic4 5540.299999952316
sto3 5540.299999952316
mic5 5540.399999976158
rAF00 5554
rAF1 5554.100000023842
rAF2 5554.199999928474
rAF3 5554.399999976158
rAF11 5570.799999952316
rAF22 5571
rAF33 5571
rAF111 5586.699999928474
rAF222 5586.799999952316
rAF333 5586.899999976158

每轮事件循环宏任务（setTimeout）里都有微任务和rAF，那么应该在各轮都执行本次宏任务添加的rAF回调才对。
也就是如下console：
mic1
mic2
rAF0

sto1
mic3
rAF1

sto2
mic4
rAF2
...

但实际结果并不是。

```
同步开始 1514.5
同步结束 1514.6000000238419
mic1 1514.7000000476837
mic2 1514.8000000715256

```

之后，本轮事件循环进入渲染阶段，判断渲染时机，有时机hasARenderingOpportunity为true，有rAF回调栈不为空就执行清空回调栈，执行了
`rAF0 1515`
此时才过去1ms不到，显示器远没到刷新时间。

但新的事件循环开始了。

```
sto1 6119.799999952316
mic3 6120

```

宏微任务都执行完毕，注册一个rAF函数回调入rAF回调栈，hasARenderingOpportunity为false，按理下面又到渲染阶段，但其实上面rAF0回调执行了但是还没有本帧结束，显卡未刷新，所以此时浏览器判断未到渲染时机不会修改hasARenderingOpportunity，跳过渲染，不会询问rAF回调栈去执行清空它，所以现在rAF1不会执行。
于是继续执行下面代码。开启新的事件循环。

```
sto2 6120.099999904633
mic4 6120.199999928474

```

同理上面第一个timer执行完距离代码初始才1.5ms，远不到显卡重绘屏幕的帧节点。同上面逻辑，宏微任务都执行完毕，注册一个rAF函数回调入rAF回调栈，按理下面又到渲染阶段，但其实上面rAF0回调执行了但是还没有本帧结束，显卡未刷新，所以此时未到渲染时机，不会询问rAF回调栈去执行清空它，所以现在rAF2不会执行。

现在rAF回调栈有两个回调函数了。

两个timer代码都运行结束，等待4ms后本帧结束，渲染。
下一帧开始，还有16.7ms就新一帧渲染了。询问是否到渲染时机，rAF回调栈是否为空。
不为空，执行这两个rAF回调。

```
rAF1 6124.599999904633
rAF2 6124.699999928474

```

用rAF解释下：

```
function animation(){
  console.log('log',performance.now())
  requestAnimationFrame(animation)
}
requestAnimationFrame(animation)

```

log 1443.3999999761581
log 1448.7999999523163
log 1466.5999999046326
log 1482.8999999761581
log 1500.6999999284744
log 1516.8999999761581
log 1533
可以看出，log1和log2间隔只有5.4ms
从log2开始间隔就稳定在大约16.7ms

因为同步代码执行到requestAnimationFrame(animation)时，此时处在刷新帧16.7ms哪个部分是完全不确定的，上面的代码就走在了大约11.3ms的位置，距离本帧结束还有约5.4ms，那么同步任务结束，没有微任务，判定是否重渲染，rAF回调栈内有rAF回调，要重渲染，因为rAF是在渲染前改版dom最后的机会，所以第一次rAF回调就在本帧执行（其实也是尽量贴近本帧16.7ms的开头0ms），此时log0时间是1443.39ms，本轮rAF栈空，并且注册了一个新的rAF回调入栈，5.4ms后本帧结束，下一帧还有16.7ms就要渲染了，判定需要重新渲染，那么通知rAF回调执行，推出栈，本轮rAF栈空，也就是在第二帧的完全开头位置执行，log1时间是1448.7ms，注册一个新rAF回调入栈，16.7ms（其实中间有代码执行时间不一定是16.7ms一定小于16.7ms）后，到达帧渲染点，显卡刷新屏幕，本帧结束，下一帧到来，又开始判定rAF栈，非空，在本帧执行rAF回调...

# 应用

大数据渲染
在大数据渲染过程中，比如表格的渲染，如果不进行一些性能策略处理，就会出现 UI 冻结现象，用户体验极差。有个场景，将后台返回的十万条记录插入到表格中，如果一次性在循环中生成 DOM 元素，会导致页面卡顿5s左右。这时候我们就可以用 requestAnimationFrame 进行分步渲染，确定最好的时间间隔，使得页面加载过程中很流畅。

```js
var total = 100000;
var size = 100;
var count = total / size;
var done = 0;
var ul = document.getElementById('list');

function addItems() {
    var li = null;
    var fg = document.createDocumentFragment();

    for (var i = 0; i < size; i++) {
        li = document.createElement('li');
        li.innerText = 'item ' + (done * size + i);
        fg.appendChild(li);
    }

    ul.appendChild(fg);
    done++;

    if (done < count) {
        requestAnimationFrame(addItems);
    }
};
requestAnimationFrame(addItems);
```