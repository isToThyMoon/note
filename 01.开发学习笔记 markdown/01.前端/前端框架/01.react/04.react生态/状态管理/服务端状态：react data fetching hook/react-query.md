# React-Query

React-Query是一个基于hooks的数据请求库。

常见业务场景，把请求服务端传递过来的数组数据缓存到前端本地。

轻量级数据且使用组件不多，可以存在组件state中。

其他复杂情况建议全局状态，共同读取。

这时class时代经典处理方式，把获取数据刷新数据以及数据本身存到全局。

hook时代有更好的优化。



前端一直有资源文件服务器缓存的概念。

把从服务端请求的大量数据看作一种缓存。

react-query 或者SWR 
react-query相对繁杂
swr相对简单 

在react中异步从服务器获取、缓存、更新数据

```js
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
 
 const queryClient = new QueryClient()
 
 export default function App() {
   return (
     <QueryClientProvider client={queryClient}>
       <Example />
     </QueryClientProvider>
   )
 }
 
 function Example() {
   const { isLoading, error, data } = useQuery('repoData', () =>
     fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res =>
       res.json()
     )
   )
 
   if (isLoading) return 'Loading...'
 
   if (error) return 'An error has occurred: ' + error.message
 
   return (
     <div>
       <h1>{data.name}</h1>
       <p>{data.description}</p>
       <strong>👀 {data.subscribers_count}</strong>{' '}
       <strong>✨ {data.stargazers_count}</strong>{' '}
       <strong>🍴 {data.forks_count}</strong>
     </div>
   )
 }

```

有点是请求下来的数据就被缓存了，当然并不是浏览器缓存，而是一个概念。

那么如何获取缓存更新缓存呢？


```js
import {
   useQuery,
   useMutation,
   useQueryClient,
   QueryClient,
   QueryClientProvider,
 } from 'react-query'
 import { getTodos, postTodo } from '../my-api'
 
 // Create a client
 const queryClient = new QueryClient()
 
 function App() {
   return (
     // Provide the client to your App
     <QueryClientProvider client={queryClient}>
       <Todos />
     </QueryClientProvider>
   )
 }
 
 function Todos() {
   // Access the client
   const queryClient = useQueryClient()
 
   // Queries
   const query = useQuery('todos', getTodos)
 
   // Mutations
   const mutation = useMutation(postTodo, {
     onSuccess: () => {
       // Invalidate and refetch
       queryClient.invalidateQueries('todos')
     },
   })
 
   return (
     <div>
       <ul>
         {query.data.map(todo => (
           <li key={todo.id}>{todo.title}</li>
         ))}
       </ul>
 
       <button
         onClick={() => {
           mutation.mutate({
             id: Date.now(),
             title: 'Do Laundry',
           })
         }}
       >
         Add Todo
       </button>
     </div>
   )
 }
 
 render(<App />, document.getElementById('root'))
```
queryClient.invalidateQueries('todos')的方法直接让这个部分的缓存失效重新获取，这queryClient可以很方便在全局各个地方使用，这就达到了全局修改的目的。 不用redux维护一个状态树。

在其他地方想要获取这部分的数据，queryClient.getQueryData('tods')


react-query实现乐观更新。

# 使用实例

```js
 import { useQuery } from 'react-query'
 
 function App() {
   const {data, isLoading, isError} = useQuery('userData', () => axios.get('/api/user'));
   
   if (isLoading) {
     return <div>loading</div>;
   }
   
   return (
     <ul>
       {data.map(user => <li key={user.id}>{user.name}</li>)}
     </ul>
   )
 }
 
```
React-Query中的Query指一个异步请求的数据源。

例子中userData字符串就是这个query独一无二的key。

可以看到，React-Query封装了完整的请求中间状态（isLoading、isError...）。

不仅如此，React-Query还为我们做了如下工作：

多个组件请求同一个query时只发出一个请求
缓存数据失效/更新策略（判断缓存合适失效，失效后自动请求数据）
对失效数据垃圾清理
数据的CRUD由2个hook处理：

useQuery处理数据的查
useMutation处理数据的增/删/改
在下面的例子中，点击「创建用户」按钮会发起创建用户的post请求：

  import { useQuery, queryCache } from 'react-query';

 function App() {
   const {data, isLoading, isError} = useQuery('userData', () => axios.get('/api/user'));
   // 新增用户
   const {mutate} = useMutation(data => axios.post('/api/user', data));
 
   return (
     <ul>
       {data.map(user => <li key={user.id}>{user.name}</li>)}
       <button
         onClick={() => {
           mutate({name: 'kasong', age: 99})
         }}
       >
         创建用户
       </button>
     </ul>
   )
 }
但是点击后userData query对应数据不会更新，因为他还未失效。

所以我们需要告诉React-Query，userData query对应的缓存已经失效，需要更新：

import { useQuery, queryCache } from 'react-query';

function App() {
  // ...
  const {mutate} = useMutation(userData => axios.post('/api/user', userData), {
    onSuccess: () => {
      queryCache.invalidateQueries('userData')
    }  
  })
  
  // ...
}
通过调用mutate方法，会触发请求。

当请求成功后，会触发onSuccess回调，回调中调用queryCache.invalidateQueries，将userData对应的query缓存置为invalidate。

这样，React-Query就会重新请求userData对应query的数据。

