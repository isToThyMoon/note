# 

context的value值变更逻辑和消费组件渲染逻辑放在一处，造成非消费组件在context的value变化时跟着渲染。

多context provider情况下
```jsx
import React, { useState, createContext, useContext } from "react";

const Context1 = createContext();
const Context2 = createContext();

export default function APP() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  return (
    <Context1.Provider value={value1}>
      <Context2.Provider value={value2}>
        <button onClick={() => setValue1((value1) => value1 + 1)}>
          add value1
        </button>
        <button onClick={() => setValue2((value2) => value2 + 1)}>
          add value2
        </button>
        <A />
        <B />
        <C />
      </Context2.Provider>
    </Context1.Provider>
  );
}
function A() {
  const value1 = useContext(Context1);
  console.log("a render");

  return <div>a: {value1}</div>;
}

function B() {
  const value2 = useContext(Context2);
  console.log("b render");

  return <div>b{value2}</div>;
}

function C() {
  console.log("c render");

  return <div>c</div>;
}
```


将context的Provider和value的变更逻辑抽离出来作为一个单组件。
在根组件作为children传入context内。

只要根组件不重绘，provider内作为children的子组件就不会rerender，这样子组件只有在消费的value变化时才会rerender。

```
import React, { useState, createContext, useContext } from "react";

const Context1 = createContext();
const Context2 = createContext();
export default function App() {
  return (
    <Provider>
      <A />
      <B />
      <C />
    </Provider>
  );
}

function Provider({ children }) {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  return (
    <Context1.Provider value={value1}>
      <Context2.Provider value={value2}>
        <button onClick={() => setValue1((value1) => value1 + 1)}>
          add value1
        </button>
        <button onClick={() => setValue2((value2) => value2 + 1)}>
          add value2
        </button>
        {children}
      </Context2.Provider>
    </Context1.Provider>
  );
}
function A() {
  const value1 = useContext(Context1);
  console.log("a render");

  return <div>a: {value1}</div>;
}

function B() {
  const value2 = useContext(Context2);
  console.log("b render");

  return <div>b{value2}</div>;
}

function C() {
  console.log("c render");

  return <div>c</div>;
}
```


-------

# context精确更新渲染：

即使抽离出来也要注意还是会引起不不必要rerender：

```
import React, { useState } from "react";
const StateContext = React.createContext(null);

const StateProvider = ({ children }) => {
 console.log("StateProvider render");
 
 const [count1, setCount1] = useState(1);
 const [count2, setCount2] = useState(1);
 return (
  <StateContext.Provider 
   value={{ count1, setCount1, count2, setCount2 }}>
   {children}
  </StateContext.Provider>
 );
};

const Counter1 = () => {
 console.log("count1 render");
 
 const { count1, setCount1 } = React.useContext(StateContext);
 return (
  <>
   <div>Count1: {count1}</div>
   <button 
    onClick={() => setCount1((n) => n + 1)}>setCount1</button>
 </>
);
};

const Counter2 = () => {
 console.log("count2 render");
 
 const { count2, setCount2 } = React.useContext(StateContext);
 
 return (
  <>
   <div>Count2: {count2}</div>
   <button onClick={() => setCount2((n) => n + 1)}>setCount2</button>
  </>
 );
};

const App = () => {
 return (
  <StateProvider>
   <Counter1 />
   <Counter2 />
  </StateProvider>
 );
};

export default App;
```

count1 的更新会引起 StateProvider 的 re-render，从而会导致 StateProvider 的 value 生成全新的对象，触发 ContextProvider 的 re-render，找到当前 Context 的所有消费者进行 re-render。

如何做到只有使用到 Context 的 value 改变才触发组件的 re-render 呢？社区有一个对应的解决方案 dai-shi/use-context-selector: React useContextSelector hook in userland。

如下：
```
import React, { useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

const context = createContext(null);

const Counter1 = () => {
  const count1 = useContextSelector(context, v => v[0].count1);
  const setState = useContextSelector(context, v => v[1]);
  const increment = () => setState(s => ({
    ...s,
    count1: s.count1 + 1,
  }));
  return (
    <div>
      <span>Count1: {count1}</span>
      <button type="button" onClick={increment}>+1</button>
      {Math.random()}
    </div>
  );
};

const Counter2 = () => {
  const count2 = useContextSelector(context, v => v[0].count2);
  const setState = useContextSelector(context, v => v[1]);
  const increment = () => setState(s => ({
    ...s,
    count2: s.count2 + 1,
  }));
  return (
    <div>
      <span>Count2: {count2}</span>
      <button type="button" onClick={increment}>+1</button>
      {Math.random()}
    </div>
  );
};

const StateProvider = ({ children }) => (
  <context.Provider value={useState({ count1: 0, count2: 0 })}>
    {children}
  </context.Provider>
);

const App = () => (
  <StateProvider>
    <Counter1 />
    <Counter2 />
  </StateProvider>
);

export default App
```
但是必须在react17以上。


# use-context-selector
接下来我们主要分析下 createContext 和 useContextSelector 都做了什么（官方还有其他的 API ，感兴趣的朋友可以自行查看，核心还是这两个 API）。
简化一下，只看核心逻辑：

createContext：
```jsx
import { createElement, useLayoutEffect, useRef, createContext as createContextOrig } from 'react'
const CONTEXT_VALUE = Symbol();
const ORIGINAL_PROVIDER = Symbol();

const createProvider = (
  ProviderOrig
) => {
  const ContextProvider = ({ value, children }) => {
    const valueRef = useRef(value);
    const contextValue = useRef();
    
    if (!contextValue.current) {
      const listeners = new Set();
      contextValue.current = {
        [CONTEXT_VALUE]: {
          /* "v"alue     */ v: valueRef,
          /* "l"isteners */ l: listeners,
        },
      };
    }
    useLayoutEffect(() => {
      valueRef.current = value;
  contextValue.current[CONTEXT_VALUE].l.forEach((listener) => {
          listener({ v: value });
        });
    }, [value]);
    
    return createElement(ProviderOrig, { value: contextValue.current }, children);
  };
  return ContextProvider;
};

export function createContext(defaultValue) {
  const context = createContextOrig({
    [CONTEXT_VALUE]: {
      /* "v"alue     */ v: { current: defaultValue },
      /* "l"isteners */ l: new Set(),
    },
  });
  context[ORIGINAL_PROVIDER] = context.Provider;
  context.Provider = createProvider(context.Provider);
  delete context.Consumer; // no support for Consumer
  return context;
}
```
对原始的 createContext 包一层，同时为了避免 value 的意外更新造成消费者的不必要 re-render ，将传递给原始的 createContext 的 value 通过 uesRef 进行存储，这样在 React 内部对比新旧 value 值时就不会再操作 re-render（后续 value 改变后派发更新时就需要通过 listener 进行 re-render 了），最后返回包裹后的 createContext 给用户使用。

useContextSelector：
```jsx
export function useContextSelector(context, selector) {
 const contextValue = useContextOrig(context)[CONTEXT_VALUE];
 const {
 /* "v"alue */ v: { current: value },
 /* "l"isteners */ l: listeners
 } = contextValue;
 
 const selected = selector(value);
 const [state, dispatch] = useReducer(
  (prev, action) => {
   if ("v" in action) {
    if (Object.is(prev[0], action.v)) {
     return prev; // do not update
    }
    const nextSelected = selector(action.v);
    if (Object.is(prev[1], nextSelected)) {
     return prev; // do not update
    }
    return [action.v, nextSelected];
   }
  },
  [value, selected]
 );
 
 useLayoutEffect(() => {
  listeners.add(dispatch);
  return () => {
   listeners.delete(dispatch);
  };
 
 }, [listeners]);
 
 return state[1];
}
```

核心逻辑：
每次渲染时，通过 selector 和 value 获取最新的 selected
同时将 useReducer 对应的 dispatch 添加到 listeners
当 value 改变时，就会执行 listeners 中收集到 dispatch 函数，从而在触发 reducer 内部逻辑，通过对比 value 和 selected 是否有变化，来决定是否触发当前组件的 re-render

# 在 react v18 下的 bug
回到上面的 case 在 react v18 的表现和在原始 Context 的表现几乎一样，每次都会触发所有消费者的 re-render。再看 use-context-selector 内部是通过 useReducer 返回的 dispatch 函数派发组件更新的。

接下来再看下 useReducer 在 react v18 和 v17 版本到底有什么不一样呢？看个简单的 case：
```jsx
import React, { useReducer } from "react";

const initialState = 0;
const reducer = (state, action) => {
 switch (action) {
  case "increment":
   return state;
  default:
   return state;
 }

};

export const App = () => {
 console.log("UseReducer Render");
 const [count, dispatch] = useReducer(reducer, initialState);
 
 return (
  <div>
   <div>Count = {count}</div>
   <button onClick={() => dispatch("increment")}>Inacrement</button>
  </div>
 );
};
```

简单描述下：多次点击按钮「Inacrement」，在 react 的 v17 和 v18 版本分别会有什么表现？

先说结论：

v17：只有首次渲染会触发 App 组件的 render，后续点击将不再触发 re-render
v18：每次都会触发 App 组件的 re-render（即使状态没有实质性的变化也会触发 re-render）
这就要说到【eager state 策略】了，在 React 内部针对多次触发更新，而最后状态并不会发生实质性变化的情况，组件是没有必要渲染的，提前就可以中断更新了。

也就是说 useReducer 内部是有做一定的性能优化的，而这优化会存在一些 bug，最后 React 团队也在 v18 后移除了该优化策略（注：useState 还是保留该优化），详细可看该相关 PR Remove usereducer eager bailout。当然该 PR 在社区也存在一些讨论（Bug: useReducer and same state in React 18），毕竟无实质性的状态变更也会触发 re-render，对性能还是有一定影响的。

回归到 useContextSelector ，无优化版本的 useReducer 又是如何每次都触发组件 re-render 呢？

具体原因：在上面 useReducer 中，是通过 Object.is 判断 value 是否发生了实质性变化，若没有，就返回旧的状态，在 v17 有优化策略下，就不会再去调度更新任务了，而在 v18 没有优化策略的情况下，每次都会调度新的更新任务，从而引发组件的 re-render。

通过分析知道造成 re-render 的原因是使用了 useReducer，那就不再依赖该 hook，使用 react v18 新的 hook useSyncExternalStore 来实现 useContextSelector：
```jsx
export function useContextSelector(context, selector) {
 const contextValue = useContextOrig(context)[CONTEXT_VALUE];
 const {
 /* "v"alue */ v: { current: value },
 /* "l"isteners */ l: listeners
 } = contextValue;
 
 const lastSnapshot = useRef(selector(value));
 const subscribe = useCallback(
  (callback) => {
   listeners.add(callback);
   return () => {
    listeners.delete(callback);
   };
  },
  [listeners]
 );
 
 const getSnapshot = () => {
  const {
  /* "v"alue */ v: { current: value }
  } = contextValue;
  
  const nextSnapshot = selector(value);
  lastSnapshot.current = nextSnapshot;
  return nextSnapshot;
 };
 
 return useSyncExternalStore(subscribe, getSnapshot);
}
```

实现思路：

收集订阅函数 subscribe 的 callback（即 useSyncExternalStore 内部的 handleStoreChange ）
当 value 发生变化时，触发 listeners 收集到的 callback ，也就是执行 handleStoreChange 函数，通过 getSnapshot 获取新旧值，并通过 Object.is 进行对比，判断当前组件是否需要更新，从而实现了 useContextSelector 的精确更新
当然除了 useReducer 对应的性能问题，use-context-selector 还存在其他的性能，感兴趣的朋友可以查看这篇文章从 0 实现 use-context-selector。同时，use-context-selector 也是存在一些限制，比如说不支持 Class 组件、不支持 Consumer …

针对上述文章中，作者提到的问题二和问题三，个人认为这并不是 use-context-selector 的问题，而是 React 底层自身带来的问题。比如说：问题二，React 组件是否 re-render 跟是否使用了状态是没有关系的，而是和是否触发了更新状态的 dispatch 有关，如果一定要和状态绑定一起，那不就是 Vue 了吗。对于问题三，同样是 React 底层的优化策略处理并没有做到极致这样。


# 总结
回到 React Context 工作原理来看，只要有消费者订阅了该 Context，在该 Context 发生变化时就会触达所有的消费者。也就是说整个工作流程都是以 Context 为中心的，那只要把 Context 拆分的粒度足够小就不会带来额外的渲染负担。但是这样又会带来其他问题：ContextProvider 会嵌套多层，同时对于粒度的把握对开发者来说又会带来一定的心智负担。

从另一条路出发：Selector 机制，通过选择需要的状态从而规避掉无关的状态改变时带来的渲染开销。除了社区提到的 use-context-selector ，React 团队也有一个相应的 RFC 方案 RFC: Context selectors，不过这个 RFC 从 19 年开始目前还处于持续更新阶段。

最后，对于 React Context 的使用，个人推荐：「不频繁更改的全局状态（比如说：自定义主题、账户信息、权限信息等）可以合理使用 Context，而对于其他频繁修改的全局状态可以通过其他数据流方式维护，可以更好的避免不必要的 re-render 开销」。