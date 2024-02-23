
useState是主要的状态生产器，这个useReducer就是另一个没那么常用的状态生产器。它适合状态逻辑很复杂的时候，或者下一个state值依赖于上一个state值，比如
```
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```
这种情况用useState当然也可以，但是用useReducer就显得代码干净漂亮

# useReducer
在某些场景下，useReducer 会比 useState 更适用，当state逻辑较复杂。我们就可以用这个钩子来代替useState，它的工作方式犹如 Redux，看一个例子：

```js
const initialState = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" }
];

const reducer = (state: any, { type, payload }: any) => {
  switch (type) {
    case "add":
      return [...state, payload];
    case "remove":
      return state.filter((item: any) => item.id !== payload.id);
    case "update":
      return state.map((item: any) =>
        item.id === payload.id ? { ...item, ...payload } : item
      );
    case "clear":
      return [];
    default:
      throw new Error();
  }
};

const List = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      List: {JSON.stringify(state)}
      <button
        onClick={() =>
          dispatch({ type: "add", payload: { id: 3, name: "周五" } })
        }
      >
        add
      </button>

      <button onClick={() => dispatch({ type: "remove", payload: { id: 1 } })}>
        remove
      </button>

      <button
        onClick={() =>
          dispatch({ type: "update", payload: { id: 2, name: "李四-update" } })
        }
      >
        update
      </button>
      
      <button onClick={() => dispatch({ type: "clear" })}>clear</button>
    </>
  );
};
```


# 如何避免向下传递回调？（通过useContext 将useReducer的dispatch向下传递）
我们已经发现大部分人并不喜欢在组件树的每一层手动传递回调。尽管这种写法更明确，但这给人感觉像错综复杂的管道工程一样麻烦。

在大型的组件树中，我们推荐的替代方案是通过 context 用 useReducer 往下传一个 dispatch 函数：

```js
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

TodosApp 内部组件树里的任何子节点都可以使用 dispatch 函数来向上传递 actions 到 TodosApp：

```js
function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

总而言之，从维护的角度来这样看更加方便（不用不断转发回调），同时也避免了回调的问题。像这样向下传递 dispatch 是处理深度更新的推荐模式。

注意，你依然可以选择将应用的 state 作为 props（更显明确）向下传递或者使用 context（对很深的更新而言更加方便）向下传递。如果你选择使用 context 来向下传递 state，请使用两种不同的 context 类型传递 state 和 dispatch —— 由于 dispatch context 永远不会变，因此读取它的组件不需要重新渲染，除非这些组件也需要用到应用程序的 state。

