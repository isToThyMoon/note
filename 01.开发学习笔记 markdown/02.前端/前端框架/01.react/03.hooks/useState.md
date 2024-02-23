# useState
普通更新 / 函数式更新 state

```js
const Index = () => {
  const [count, setCount] = useState(0);
  const [obj, setObj] = useState({ id: 1 });
  return (
    <>
      {/* 普通更新 */}
      <div>count：{count}</div>
      <button onClick={() => setCount(count + 1)}>add</button>

      {/* 函数式更新 */}
      <div>obj：{JSON.stringify(obj)}</div>
      <button
        onClick={() =>
          setObj((prevObj) => ({ ...prevObj, ...{ id: 2, name: "张三" } }))
        }
      >
        merge
      </button>
    </>
  );
};
```

setState可以依赖上一次渲染的值 setState(prevState => prevState+1)


## setState批量更新
当setState处理程序被多次调用时，当调用代码在基于React的事件处理程序时，React会对这些调用进行批处理并只触发一次重新渲染。
```js
import React, { useState } from "react";

export default function App() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const handleClick = () => {
    setCounter1(counter1 + 1);
    setCounter2(counter2 + 1);
  }

  console.log('Rerendered');

  return (
    <div className='App'>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```
console: Rerendered

如果这些调用来自非基于React的处理程序，如setTimeout，ajax promise，那么每次调用都会触发重新渲染。
```js
import React, { useState } from "react";

export default function App() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
 
  const handleClick = () => {
    Promise.resolve().then(() => {
      setCounter1(counter1 + 1);
      setCounter2(counter2 + 1);
    })
  }

  console.log('Rerendered');
  
  return (
    <div className='App'>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```
console: Rerendered
console: Rerendered

https://blog.saeloun.com/2021/07/22/react-automatic-batching.html
Starting in React 18 with createRoot, all updates will be automatically batched。
react18开始，使用createRoot的方式开发，所有场景下的多次setState都会被自动合成一次批量更新。

但是同样react18 createRoot开始，使用class组件，在setState之后不能同步获取到修改的值了，18之前是直接修改了this.state。

react18开始所有的setState都是“异步”批量执行。

而且这里也不能用异步同步来描述setState的行为，它不是setTimeout和Promise那种异步，是指setState后是否state马上改变，是否马上render。


For some cases where we want to read something from the DOM immediately after a state change, we can opt-out of batching with ReactDOM.flushSync() as seen below.

```js
import React, { useState } from "react";
import { flushSync } from "react-dom";

export default function App() {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  const handleClick = () => {
    flushSync(() => {
      setCounter1(counter1 + 1);
    })
    setCounter2(counter2 + 1);
  }
  
  console.log('Rerendered');
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```
It gives the below output

console: Rerendered
console: Rerendered


理论：class的setState，如果你传入的是对象，那么就会被异步合并，如果传入的是函数，那么就会立马执行替换。
hook的setState是直接替换，而不是合并。

# hook的setState为什么取消了类似class组件中setState的回调函数
这在react官方的discuss和issue有人讨论过，相关开发人员也有解释。
总体来说，hooks中的setState取消回调函数是为了贯彻声明式编程这种范式。
之前初探react提到过react和传统jq的前端开发方式有一个区别就是声明式组件化，组件化大家都理解。
声明式在react中体现就是react通过数据改变来声明操作，具体的实现由react内部完成。
react只管UI=f(state)，体现在多次setState但只要最后UI结果是最后一次state渲染就行。

而如果允许setState的回调函数，
```
setState（{a:1},()=>{
    setState({a:4})
}）
setState（{a:2},()=>{
    setState({a:5})
}）
setState（{a:3},()=>{

}）
```
最后的UI结果是不一定的，class组件中提到，正常react声明周期中采用这种多次setState会合并状态，而在setTimeout和promise中就不一定了，是同步改变，会有多次state状态，最后的UI是不一定的。

这就不是react所追求的声明式开发了，在不存在副作用情况下，多次setState有回调函数也还是不符合唯一输入对应唯一输出的规范。