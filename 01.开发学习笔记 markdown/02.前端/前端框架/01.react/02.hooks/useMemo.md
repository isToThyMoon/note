# useMemo

缓存数值

与 vue 的 computed 类似，主要是用来避免在每次渲染时都进行一些高开销的计算，举个简单的例子。

不管页面 render 几次，时间戳都不会被改变，因为已经被被缓存了，除非依赖改变。
```js
// ...
const getNumUseMemo = useMemo(() => {
  return `${+new Date()}`;
}, []);
// ...
```

执行时机：不同于useEffect在渲染完毕后执行，useMemo和useCallback在函数内部定义的位置，按函数主体执行顺序执行即可。


我们知道useEffect可以执行副作用，但实际上useMemo也可以。
忘掉它的名字，只看它的执行时机和施行逻辑，在函数主体中，每次重新渲染，只要deps变化，即执行useMemo第一参数的函数体。
```js
// ...
useMemo(() => {
  props.setRecord('child state')
}, []);
// ...
```
虽然说不能在渲染阶段调用setter，但貌似除了警告并无太大问题。

