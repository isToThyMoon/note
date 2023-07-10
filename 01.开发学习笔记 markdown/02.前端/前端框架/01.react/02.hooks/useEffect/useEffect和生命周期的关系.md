

# useEffect和生命周期什么关系？

这是条比较误导的[提示](https://zh-hans.reactjs.org/docs/hooks-effect.html)

> 提示
> 如果你熟悉 React class 的生命周期函数，你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

它官方推荐把 useEffect 想象成 componentDidMount， componentDidUpdate，componentWillUnmount 三个生命周期的结合体，但理解hooks的逻辑最好从生命周期中剥离开，以全新的角度去理解hook的理念。

```js
useEffect(() => {
    // 这里的代码块 等价于 componentDidMount
    // do something...

    // return的写法 等价于 componentWillUnmount 
    return () => {
       // do something...
    };
  }
  // 依赖列表，当依赖的值有变更时候，执行副作用函数，等价于 componentDidUpdate
  [ xxx，obj.xxx ]
);
```

## useEffect不等于生命周期
首先实际上useEffect由第二参数模拟的执行时机，并不能完全和componentDidMount等同（实际是useLayoutEffect，具体见它的单章解释）。
其次开篇已经解释副作用是纯函数中一些“不纯”的命令式代码，useEffect本质就是每次渲染后需要执行处理的副作用，用生命周期的概念类比useEffect并不适合，将useEffect当作生命周期并不是最佳实例。

从语义和useEffect的执行时机来说，useEffect并不是为了业务逻辑设计的。effect 将在每轮渲染结束后执行，effect第二参数只是更精确控制了此轮渲染结束后effect是否执行。在react18的Strict Mode下，开发模式甚至会故意执行两次以验证是否每次执行有同一结果。
理论上，在useEffect中应当避免业务逻辑代码。而useEffect使用范围以上文档也有说明：在每轮渲染结束后是否**改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作**

# 需要抛弃的生命周期概念
实际上，想要在hooks函数组件中完全模拟class组件的生命周期是很难的。

## 构造时

Class Component 和 Function Component 之间还有一个很大的「Bug」，Class Component 仅实例化一次后续仅执行render() ，而 Function Component 却是在不断执行自身。这导致 Function Component 相较 Class Component 实际缺失了对应的constructor构造时。当然如果你有办法只让 Function 里的某段逻辑只执行一遍，倒是也可以模拟出constructor。
```
// useref来构造
function useConstructor(callback){
    const init = useref(true)
    if(init.current){
        callback()
        init.current = false
    }

}
```

## didmount
useLayoutEffect

## didupdate
useEffect第二参数依赖数组列表填入state，每次重新渲染时如果state有变动，则会执行useEffect执行函数。但还是那句，react并不保证useEffect的执行次数，所以把它当作生命周期的实现是有问题的。