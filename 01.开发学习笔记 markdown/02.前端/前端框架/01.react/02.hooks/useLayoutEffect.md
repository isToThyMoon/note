父组件render>子组件render> 子组件useLayoutEffect>父组件useLayoutEffect>子组件useEffect>父组件useEffect

# useLayoutEffect（useLayoutEffect 是不会在服务端ssr执行的）
在所有的 DOM 变更之后同步调用effect。可以使用它来读取 DOM 布局并同步触发重渲染。
在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新，也就是说它会阻塞浏览器绘制。
所以尽可能使用 useEffect 以避免阻塞视觉更新。

useEffect 是异步执行的，而useLayoutEffect是同步执行的。
useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前（dom已经被修改，但是还没到用户界面绘制完成）

如果执行的都是修改dom或dom内文字（hello world到world hello）这样的操作，useEffect 是渲染完之后异步执行的，所以会导致 hello world 先被渲染到了屏幕上，再变成 world hello，就会出现闪烁现象。而 useLayoutEffect 是渲染之前同步执行的，所以会等它执行完再渲染上去，就避免了闪烁现象。也就是说我们最好把操作 dom 的相关操作放到 useLayoutEffect 中去，避免导致闪烁

对于use（Layout）Effect来说，React做的事情就是

render阶段：函数组件开始渲染的时候，创建出对应的hook链表挂载到workInProgress的memoizedState上，并创建effect链表，但是基于上次和本次依赖项的比较结果，
创建的effect是有差异的。这一点暂且可以理解为：依赖项有变化，effect可以被处理，否则不会被处理。

commit阶段：异步调度useEffect，layout阶段同步处理useLayoutEffect的effect。等到commit阶段完成，更新应用到页面上之后，开始处理useEffect产生的effect。

第二点提到了一个重点，就是useEffect和useLayoutEffect的执行时机不一样，前者被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。
后者是在commit阶段新的DOM准备完成，但还未渲染到屏幕之前，同步执行。

# uselayout和useEffect的区别
其实最根本区别就在于，两个effect在react组件渲染周期中执行的时机不一样。
useEffect是真正的异步执行，执行时机是浏览器完成渲染之后。在组件render渲染阶段完毕,layout之后异步执行，是为了不阻塞浏览器的渲染，是屏幕绘制完毕后执行的副作用处理。

而 useLayoutEffect 的执行时机是layout阶段的同步执行，不是paint完成之后。在浏览器把内容真正渲染到界面之前，可以看做执行时机和 componentDidMount 大致等价。

这也是为什么首次加载，useEffect会有屏幕因为数据变化产生的闪烁现象，而useLayoutEffect没有。

# ssr
也正是因为 useLayoutEffect 可能会导致渲染结果不一样的关系，如果你在 ssr 的时候使用这个函数会有一个 warning。
> Warning: useLayoutEffect does nothing on the server, because its effect cannot be encoded into the server renderer's output format. This will lead to a mismatch between the initial, non-hydrated UI and the intended UI. To avoid this, useLayoutEffect should only be used in components that render exclusively on the client. See https://fb.me/react-uselayouteffect-ssr for common fixes.

这是因为 useLayoutEffect 是不会在服务端执行的，所以就有可能导致 ssr 渲染出来的内容和实际的首屏内容并不一致。而解决这个问题也很简单：
1.放弃使用 useLayoutEffect，使用 useEffect 代替
2.如果你明确知道 useLayouteffect 对于首屏渲染并没有影响，但是后续会需要，你可以这样写
```js
import { useEffect, useLayoutEffect } from 'react';
export const useCustomLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```
当你使用 useLayoutEffect 的时候就用 useCustomLayoutEffect 代替。这样在服务端就会用 useEffect ，这样就不会报 warning 了。