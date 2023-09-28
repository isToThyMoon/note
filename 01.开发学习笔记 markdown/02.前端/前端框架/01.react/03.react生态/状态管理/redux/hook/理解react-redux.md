# react-redux
https://github.com/hacker0limbo/my-blog/issues/28

关于 React Redux 和 Context 网上存在一些误解:
* React-Redux 只是"对 React Context" 的包装
* 你可以通过解构 context 里的属性来避免组件的重复渲染
上面说法说法均错误。

其实这是一个 context 老生常谈的问题, 如果给 context 传入的是一个非原始类型, 比如数组或者对象, 那么当你的组件只订阅了部分对象属性, 即使该属性没有发生变化, 但如果其他属性发生变化，导致context消费的value传入新的对象引用，你的组件仍旧会被迫重新渲染. 可以简单理解为没办法进行局部订阅, 除非你自己去做好性能优化。
如：
```
function ProviderComponent() {
  const [contextValue, setContextValue] = useState({ a: 1, b: 2 });

  return (
    <MyContext.Provider value={contextValue}>
      <SomeLargeComponentTree />
    </MyContext.Provider>
  );
}

function ChildComponent() {
  const { a } = useContext(MyContext);
  return <div>{a}</div>;
}
```

ChildComponent 仍旧会被重新渲染, 即使他解构了对象并且只用到了 a 属性。
因为一旦调用了setContextValue，一个新的对象引用被传递给了 provider，所有的 consumer 都需要重新渲染。

而对于 React-Redux, 虽然内部确实用到 context, 但他传递给 provider 的是 store 实例本身, 而非 store 内部的状态. 其基本实现可以看做如下:

```js
function useSelector(selector) {
  const [, forceRender] = useReducer((counter) => counter + 1, 0);
  const { store } = useContext(ReactReduxContext);

  const selectedValueRef = useRef(selector(store.getState()));

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const storeState = store.getState();
      const latestSelectedValue = selector(storeState);

      if (latestSelectedValue !== selectedValueRef.current) {
        selectedValueRef.current = latestSelectedValue;
        forceRender();
      }
    });

    return unsubscribe;
  }, [store]);

  return selectedValueRef.current;
}
```

基本原理相当清晰，通过订阅 Redux 的 store, 来获知是否有 action 被 dispatch 了, 然后通过 ref 和 useLayoutEffect 来获取 store 里新旧值并进行比对来判断组件是否需要重新渲染。

注意这里还是进行的严格比较。 这也是 useSelector 和 mapStateToProps 的区别. 虽然 react-redux 帮忙做了部分性能优化. 但是更加具体的还是需要自己来。这里不展开。

注意由于通过 context 传递的是 store 的实例, 所以本质上 useLayoutEffect 不会触发多次渲染, 监听也只会监听一次。

useContext 也并不提供局部订阅 context 的方法，需要优化，你需要React.memo。

什么时候需要使用Context已有定论，比较少会触发更新的, 比如 locale 或者 theme. context 更被常用的方式应该为注入一个服务, 而不是注入一个状态。

而对于 React-Redux v6, 作者曾尝试把 store state 作为 value 传递给 context. 但是最后证明这种方式存在很大问题. 具体细节可以参考: [which is why we had to rewrite the internal implementation to use direct subscriptions again in React-Redux v7](https://github.com/reduxjs/react-redux/issues/1177). 以及如果想要了解更多关于 React-Redux 工作原理的, 可以看另一篇博客: [The History and Implementation of React-Redux.](https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/)





