# 

react-redux是在context基础上实现的

使用redux-toolkit

为什么使用redux-toolkit？

redux-toolkit只是在原redux上略微封装了一层
之前使用过redux一定知道要安装react-redux redux-thunk等等
配置一个redux store过于复杂。
要装太多的依赖包。
并且完成store、action、reducer要写太多的模版代码。

即使配置过，也很难记住。

redux-toolkit就是为了让复杂的配置和书写redux方式变容易。
默认集成redux-thunk

npm install @reduxjs/toolkit react-redux

新建store文件夹index.ts
..

代码：
```
import React from 'react';
import * as actions from '../actions/actions';
import {useSelector, useDispatch} from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const count = useSelector(store => store.count);

  return (
    <div>
      <h1>The count is {count}</h1>
      <button onClick={() => dispatch(actions.increment(count))}>+</button>
      <button onClick={() => dispatch(actions.decrement(count))}>-</button>
    </div>
  );
}

export default App;
```


## 可以编写可复用的“selector 选择器”函数来封装从 Redux 状态中读取数据的逻辑
选择器是一种函数，它接收 Redux state 作为参数，并返回一些数据
## Redux 使用叫做“中间件”这样的插件模式来开发异步逻辑
官方的处理异步中间件叫 redux-thunk，包含在 Redux Toolkit 中
Thunk 函数接收 dispatch 和getState 作为参数，并且可以在异步逻辑中使用它们
## 您可以 dispatch 其他 action 来帮助跟踪 API 调用的加载状态
典型的模式是在调用之前 dispatch 一个 "pending" 的 action，然后是包含数据的 “sucdess” 或包含错误的 “failure” action
加载状态通常应该使用枚举类型，如 'idle' | 'loading' | 'succeeded' | 'failed'
## Redux Toolkit 有一个 createAsyncThunk API 可以为你 dispatch 这些 action
createAsyncThunk 接受一个 “payload creator” 回调函数，它应该返回一个 Promise，并自动生成 pending/fulfilled/rejected action 类型
像 fetchPosts 这样生成的 action creator 根据你返回的 Promise dispatch 这些 action
可以使用 extraReducers 字段在 createSlice 中监听这些 action，并根据这些 action 更新 reducer 中的状态。
action creator 可用于自动填充 extraReducers 对象的键，以便切片知道要监听的 action。