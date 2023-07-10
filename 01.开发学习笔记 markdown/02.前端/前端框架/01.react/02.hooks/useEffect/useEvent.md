In this RFC, we propose a useEvent Hook. It lets you define event handlers that can read the latest props/state but have always stable function identity. Event handlers defined with useEvent don't break memoization and don't retrigger effects.
简译下就是这个hook允许你定义一个事件处理器，在被调用时它可以永远读到最新的props和state，并且它的函数引用地址是稳定的，不会rerender一次创建一个新函数。

rfc评论区有个命名很有意思，觉得更加准确描述了功能，叫useLatestClosure。或者叫useLtsClosureHandler。

基于useEvent写法：
```js
function Page({ route, currentUser }){
  const onVisit = useEvent((visitedUrl)=>{
    logaAnalytics('visit_page', visitedUrl, currentUser.name)
  })

  useEffect(()=>{
    onVisit(route.url)
  },[route.url])
}
```

useEvent可以看成增强的useCallback，但是它没有deps。useEvent将一个函数持久化，同时保证函数内部的变量引用永远是最新的。（和ahook的useMemoizedFn几乎一致）

可以用来替换useCallback，以前写useCallback，在useCallback的deps变化时，usecallback返回的函数饮用也会发生变化。（等于说deps变化，useCallback返回了一个新函数）

通过useEvent代替useCallback后，不用写deps函数了，并且返回的函数引用永远是固定的，而在useEvent内部使用的变量保证永远最新。

# useEvent

更新这个新出的hook根本原因是useEffect实在无法满足复杂场景的逻辑。

之前的useEffect官方示例代码都是基础场景，但对稍微复杂点的场景毫无介绍，有实际使用经验的人都知道地狱的deps依赖十分头疼。

官方出useEvent就是发现之前要求的依赖写法实在是有太大问题。

假如我们需要在url变化时，上报当前url和username。
```js
function Page({ route, currentUser }){
  useEffect(()=>{
    logaAnalytics('visit_Page', route.url, currentUser.name);
  },[route.url])
}
```

如上代码，有hook开发经验一定知道会报warning，告诉我们currentUser.name必须放到deps中，修正下代码：
```js
function Page({ route, currentUser }){
  useEffect(()=>{
    logaAnalytics('visit_Page', route.url, currentUser.name);
  },[route.url, currentUser.name])
}
```

但这样肯定无法满足业务需求，因为currentUser.name变化后，也触发了上报请求。你可能会很头疼，因为业务需求有时候是非常诡异的，它不会按照你的代码洁癖来订制。

以前的解决方案有两个：

1.直接忽略警告。eslint-plugin-react-hook这个插件负责代码检查是否符合react hook标准写法，可以通过disable nextline来回避掉警告。但这明显不是正道，突破官方对deps的限制规则一定不是正确的用法。

社区常用方案：
2.通过ref来存储currentUser.name。

```js
function Page({ route, currentUser }){
  const ref = useRef(currentUser.name);
  ref.current = currentUser.name;

  useEffect(()=>{
    logaAnalytics('visit_Page', route.url, ref.current);
  },[route.url, currentUser.name])
}
```
但这种ref方式写法太麻烦，复杂项目要写无数个ref。


## 基于useEvent写法：
```js
function Page({ route, currentUser }){
   // ✅ Stable identity
  const onVisit = useEvent((visitedUrl)=>{
    logaAnalytics('visit_page', visitedUrl, currentUser.name)
  })

  useEffect(()=>{
    onVisit(route.url)
  },[route.url]) // ✅ re-run only on route.url change
}

```

useEvent两个特性：
1.useEvent处理返回的函数引用永远不变。
2.函数内引用的变量永远是最新的。（但无需像useCallback一样写deps）

useEvent可以看成增强的useCallback，但是它没有deps。useEvent将一个函数持久化，同时保证函数内部的变量引用永远是最新的。（和ahook的useMemoizedFn几乎一致）

可以用来替换useCallback，以前写useCallback，在useCallback的deps变化时，usecallback返回的函数饮用也会发生变化。（等于说deps变化，useCallback返回了一个新函数）

通过useEvent代替useCallback后，不用写deps函数了，并且返回的函数引用永远是固定的，而在useEvent内部使用的变量保证永远最新。


## useEvent是怎么实现的

useEvent的实现原理比较简单，但有需要注意的点。
```js
// (!) Approximate behavior
function useEvent(handler) {
  const handlerRef = useRef(null);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}
```

上面的代码是官方提供的一个示例代码，需要重点注意这句注释 In a real implementation, this would run before layout effects，翻译过来就是 “在真实的实现中，这里用的Hooks 执行时机在 useLayoutEffect之前”。这里一定是不能用 useLayoutEffect来更新ref的，因为子组件的useLayoutEffect比父组件的执行更早，如果这样用的话，子组件的 useLayoutEffect中访问到的ref一定是旧的。所以官方为了实现useEvent，一定是要加一个在useLayoutEffect之前执行的Hooks的，并且这个Hooks应该不会开放给普通用户使用的。另外React要求不要在render中直接调用 useEvent返回的函数，原理也是一样的，在render中访问的函数一定是旧的，因为useLayoutEffect还没执行。


## useMemoizedFn和 useEvent的差异
在React18之前，社区上有很多类似useEvent的实现，比如ahooks的useMemoizedFn，类似下面这样
```js
function useMemoizedFn(fn) {

  const fnRef = useRef(fn);
  fnRef.current = useMemo(() => fn, [fn]);

  return useCallback((...args) => {
    return fnRef.current.apply(args);
  }, []);
}
```

为啥不用useLayoutEffect，是不是有问题？现在应该明白了吧？我们需要一个比useLayoutEffect执行更早的 Hooks，很遗憾的是之前更没有，所以只能放到 render 中。为什么之前官方没有提供类似的 Hooks？useMemoizedFn有问题吗？ 之前React Issue #16956 上对类似的封装做了很多讨论，官方的态度一直是 “在 concurrent 下可能会存在问题” ，也就是官方也吃不准未来会不会出问题。随着 React18发布，concurrent 模式稳定之后，官方发现，这种写法不会有问题，索性就自己提供了一个。在React 18 之前，因为没有 concurrent，所以useMemoizedFn不会有任何问题。在React 18之后，目前也没看到有什么问题。不过为了稳妥起见，后面ahook的useMemoizedFn会做一次升级，向官方的useEvent看齐。