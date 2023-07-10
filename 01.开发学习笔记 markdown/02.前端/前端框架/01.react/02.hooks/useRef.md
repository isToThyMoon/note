
react组件中，只有状态变化会引发组件rerender，并且每一帧render都对应一组状态，而当你需要存储一个值，它是跨越整个组件render rerender周期的，你需要ref。
它有点类似class组件中的this.xxx。实例属性，在实例整个周期内保持不变，除非主动操作修改。

# useRef

再回顾下React如何处理声明式ref的:
React will assign the current property with the DOM element when the component mounts, and assign it back to null when it unmounts.

通过之前的知识我们可以达成几点共识：
给ref.current赋值是个副作用，所以一般在Did函数或者事件处理函数里给ref.current赋值；
组件在卸载时要清理ref.current的值。

## 解决的问题
useState的state值在每一帧都是独立的。

为了在多次渲染的多帧之间产生联系，官方创造了useRef。
useRef和直接在函数组件中创造的值区别在于，useRef对重复渲染过程中保持着对ref值的唯一引用。对象在函数的生命周期内一直存在。
但对ref的current值修改不会像setState一样触发重新的渲染。

我们可以借用它来保存组件是否是第一次渲染的状态。但是最常用（最初的设计理由）的还是保存对页面节点的引用，实现数据驱动UI这种开发模式的一个例外，一个逃生舱，直接操作dom元素。

我们用它来访问DOM，从而操作DOM，最典型的例子如点击按钮聚焦文本框：

```js
const Index = () => {
  const inputEl = useRef(null);
  const handleFocus = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
};
```

注意：返回的 ref 对象在组件的整个生命周期内保持不变。
它类似于一个 class 的实例属性，我们利用了它这一点。看useEffect应用场景文件夹下第一个需要首次加载不执行副作用的例子。

刚刚举例的是访问DOM，那如果我们要访问的是一个组件，操作组件里的具体DOM呢？我们就需要用到 React.forwardRef 这个高阶组件，来转发ref，如：

```js
const Index = () => {
  const inputEl = useRef(null);
  const handleFocus = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <Child ref={inputEl} />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
};

const Child = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

## ref访问子组件属性和方法
hook时代的函数组件，ref访问子组件的属性和方法，你需要useImperativeHandle，将子组件的属性和方法暴露出去。

## 滥用
useRef其实就是class时代React.createRef()的等价替代。
最初用作对页面dom的持续引用。
但因为实现特殊，常作他用，而且是非常高频的“滥用”。
useRef仅在mount时期初始化对象，而update时期返回mount时期的结果（memoizedState），可以通过.current修改，着意味着一次完整的生命周期中，useRef保留的引用使用不变。
跨完整周期保存这一特性让它成为了hooks中的闭包救星。但也无可避免产生滥用。

每一个function的执行都有相应的scope，对于面向对象来说，this引用即是连接了所有scope的context（当然前提是同一个class生产的实例下）。
在react hook函数组件中，每一次的render由彼时的state决定，也就是帧的概念，每一帧的state对应一个UI渲染结果，render完成context即刷新，优雅的UI渲染，干净利落。
但useRef多少违背这一设计初衷，useRef可以横跨多次render生成的scope（也就是跨多次帧），它能保留下已执行的渲染逻辑，却也能使已渲染的context得不到释放，威力无穷也作恶多端。

useRef类似this，this是面向对象中最主要的副作用，
在 React 的 class 组件中，render 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。
这就是为什么在 React class 中，我们把副作用操作放到 componentDidMount 和 componentDidUpdate 函数中。
我们在声明周期中大量使用this，this得以修改组件的属性，这些给render结果增加不确定性的操作，自然就是副作用。

useRef也不例外，所以一般useRef的操作写在useEffect或者event handler中。从这一点来说，拥有useRef写法的Function Component注定难以达成“函数式”。

