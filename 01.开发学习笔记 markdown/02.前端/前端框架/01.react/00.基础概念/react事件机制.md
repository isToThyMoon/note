---
title: react事件机制
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 01.react
  - 00.root
---

当我们在组件上设置事件处理器时，React并不会在该DOM元素上直接绑定事件处理器，而是在React内部自定义一套事件系统，在这个系统上进行统一的事件订阅和分发。
React利用事件委托机制在document上统一监听DOM事件，再根据触发的target将事件分发到具体的组件实例，所以实际上我们在事件里面拿到的event其实并不是原始的DOM事件对象，而是一个合成事件对象。

# 合成事件 syntheticEvent
SyntheticEvent 实例将被传递给你的事件处理函数，它是浏览器的原生事件的跨浏览器包装器。除兼容所有浏览器外，它还拥有和浏览器原生事件相同的接口，包括 stopPropagation() 和 preventDefault()。

如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 nativeEvent 属性来获取即可。合成事件与浏览器的原生事件不同，也不会直接映射到原生事件。例如，在 onMouseLeave 事件中 event.nativeEvent 将指向 mouseout 事件。每个 SyntheticEvent 对象都包含以下属性：

```js
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

React定义一套事件体系的原因： 
* 抹平不同浏览器之间的兼容性差异。这最主要的动机。 
* 事件"合成"，即事件自定义。事件合成既可以处理兼容性问题，也可以用来自定义事件（例如 React 的 onChange 事件）。 
* 可以做更多优化。例如利用事件委托机制，几乎所有事件的触发都代理到了 document，而不是 DOM 节点本身，简化了 DOM 事件处理逻辑，减少了内存开销。（React 自身模拟了一套事件冒泡的机制）
* 提供一个抽象跨平台事件机制。类似 VirtualDOM 抽象了跨平台的渲染方式，合成事件（SyntheticEvent）提供一个抽象的跨平台事件机制。
* 可以干预事件的分发。V16引入 Fiber 架构，React 可以通过干预事件的分发以优化用户的交互体验。

# react事件体系中处理取消事件冒泡
因为采用事件委托机制由一个最顶层的dom统一处理所有事件，当不同版本的 React 组件嵌套使用时，e.stopPropagation()无法正常工作（两个不同版本的事件系统是独立的，都到document已经太晚了

不过在新版 ReactV17 及以后，不再将事件委托到 document 上，而是委托在渲染 React 应用的根 DOM 容器中，使用 rootNode.addEventListener() 监听事件动作去执行相关事件回调。

例如一次button click事件默认冒泡触发顺序是：
rootNode绑定监听器触发；
react事件体系处理合成事件，派发事件，具体dom button的绑定click事件回调触发；
react事件体系结束处理，往上冒泡，根DOM之上的绑定事件触发，如document绑定click事件；

 e.stopPropagation()在没有涉及到原生事件注册只有react事件时使用。用来阻止 React 模拟的事件冒泡，具体dom button绑定事件之后的父级监听事件、document监听事件都不会执行。
 
 react组件代码中绑定的DOM 事件冒泡到document（react17之后改为根组件）上才会触发React的合成事件，所以React 合成事件对象的e.stopPropagation，只能阻止 React 模拟的事件冒泡，并不能阻止真实的 DOM 事件冒泡。
 
e.nativeEvent.stopImmediatePropagation(); 原生事件对象的用于阻止 DOM 事件的进一步捕获或者冒泡，且该元素的后续绑定的相同事件类型的事件也被一并阻止。
e.nativeEvent.stopPropagation();  原生事件对象的用于阻止 DOM 事件的进一步捕获或者冒泡，但react根DOM上绑定的事件体系还是会执行。

从 v0.14 开始，事件处理器返回 false 时，不再阻止事件传递。你可以酌情手动调用 e.stopPropagation() 或 e.preventDefault() 作为替代方案。

# 事件池
17版本之前：
react使用事件池管理事件，
Web 端的 React 17 不使用事件池。

SyntheticEvent 对象会被放入池中统一管理。这意味着 SyntheticEvent 对象可以被复用，当所有事件处理函数被调用之后，其所有属性都会被置空。例如，以下代码是无效的：
```js
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```
如果你需要在事件处理函数运行之后获取事件对象的属性，你需要调用 e.persist()：

```js
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```

## 去除事件池
React 17 中移除了 “event pooling（事件池）“。它并不会提高现代浏览器的性能，甚至还会使经验丰富的开发者一头雾水：

function handleChange(e) {
  setData(data => ({
    ...data,
    // This crashes in React 16 and earlier:
    text: e.target.value
  }));
}
这是因为 React 在旧浏览器中重用了不同事件的事件对象，以提高性能，并将所有事件字段在它们之前设置为 null。在 React 16 及更早版本中，使用者必须调用 e.persist() 才能正确的使用该事件，或者正确读取需要的属性。

在 React 17 中，此代码可以按照预期效果执行。旧的事件池优化操作已被完成删除，因此，使用者可以在需要时读取事件字段。

这改变了行为，因此我们将其标记为重大更改，但在实践中我们没有看到它在 Facebook 上造成影响。（甚至还修复了一些错误！）请注意，e.persist() 在 React 事件对象中仍然可用，只是无效果罢了。

