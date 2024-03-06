
# react官方提供的全局数据流通方式

redux提供了props drilling的功能，以将所有state提高到最高层级为代价（是否有必要需要按项目复杂度自行判断），相当于在所有组件中打通数据高速公路，简化组件间的通信。

react官方后来提供方案就是：Context，可以在任意层级上构建数据公路。

 react-redux 通过 Provider 将 store 中的全局状态在顶层组件向下传递，大家都不陌生，它就是基于 React 所提供的 context 特性实现。
 

## 使用
context提供了一个无需为每层组件手动添加props，就能在组件树间进行数据传递的方法。

在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但此种用法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。

Context 主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。


使用context 将state里的数组传递下去 中间组件不必如props一般显式再往下传递
使用时 设置子组件的static属性contextType为ResourceContext 指定contextType读取该provider并使用它的值，查找顺序是层层往外的最近context。
子组件的this.context即可调用该父级设置的context传入的value。
<MyContext.Provider value={appBaseData}>

## api
### React.createContext

`const MyContext = React.createContext(defaultValue);`

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

### Context.Provider
<MyContext.Provider value={/* 某个值 */}>

每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。从 Provider 到其内部 consumer 组件（包括 .contextType 和 useContext）的传播不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件跳过更新的情况下也能更新。

通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。



### 订阅消费：

### Class.contextType
订阅单个context

```
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
}
MyClass.contextType = MyContext;

// 如果你正在使用实验性的 public class fields 语法，你可以使用 static 这个类属性来初始化你的 contextType。

class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}

```

挂载在 class 上的 contextType 属性可以赋值为由 React.createContext() 创建的 Context 对象。此属性可以让你使用 this.context 来获取最近 Context 上的值。你可以在任何生命周期中访问到它，包括 render 函数中。


### Context.Consumer
消费组件
```
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

一个 React 组件可以订阅 context 的变更，此组件可以让你在函数式组件中可以订阅 context。

这种方法需要一个函数作为子元素（function as a child）。这个函数接收当前的 context 值，并返回一个 React 节点。传递给函数的 value 值等价于组件树上方离这个 context 最近的 Provider 提供的 value 值。如果没有对应的 Provider，value 参数等同于传递给 createContext() 的 defaultValue。


#### 消费多个 Context

为了确保 context 快速进行重渲染，React 需要使每一个 consumers 组件的 context 在组件树中成为一个单独的节点。

```js
// Theme context，默认的 theme 是 “light” 值
const ThemeContext = React.createContext('light');

// 用户登录 context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// 一个组件可能会消费多个 context
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```
如果两个或者更多的 context 值经常被一起使用，那你可能要考虑一下另外创建你自己的渲染组件，以提供这些值。

### useContext 函数组件消费context
```
const Context = React.createContext(null);

const Child = () => {
  const value = React.useContext(Context);
  return (
    <div>theme: {value.theme}</div>
  )
}

const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <Context.Provider value={{ theme: 'light' }}>
      <div onClick={() => setCount(count + 1)}>触发更新</div>
      <Child />
    </Context.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
```


-------

# 示例：

## class组件使用context
通过createContext api创建context，使用Provider和Consumer配合传递并消费数据。

这里也展示了下HOC的写法。
```ts
import React, { ReactElement } from 'react';

const AppContext = React.createContext<object>({});

const App = ()=>{
  const contextData = {nameList: ['dada']}
  return (
    <AppContext.Provider value={contextData}>
      <Child>

      </Child>
    </AppContext.Provider>
  )
}

const contextConsumerHOC: React.FC<{resName: string}> = (props)=>{

  return (
    <AppContext.Consumer>
      {
        (value)=>{
          const { nameList } = value;
          return nameList.includes(props.resName) ? props.children as ReactElement : null
        }
      }
    </AppContext.Consumer>
  )
}

const Child = ()=>{

  return (
    <contextConsumerHOC resName={'didi'}>
      <div>child</div>
    </contextConsumerHOC> 
  )
}
```

### class组件可以通过static的属性contextType获取

Class.contextType
```js
import React, { ReactElement } from 'react';

const AppContext = React.createContext<object>({});

const App = ()=>{
  const contextData = {nameList: ['dada']}
  return (
    <AppContext.Provider value={contextData}>
      <Child>

      </Child>
    </AppContext.Provider>
  )
}

class Child extends React.Component {
  static contextType = AppContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

简单来说用静态属性初始化contextType， 拿到context，获取context的值。

## 纯函数可以采用第一种Provider Consumer写法，也可以采用hook的useContext引入context值

利弊可见hooks用法useContext一章，

不多解释，show the code：

```js
import React, { useContext }  from 'react';

const Context1 = React.createContext({});
const Context2 = React.createContext({});

function Parent(){
  
  return (
    <Context1.Provider value={mes: '1'}>
        <Context2.Provider value={mes: '2'}>
            <Child/>
        </Context2.Provider>
    </Context1.Provider>
  )
}

function Child(){
  const value1 = useContext(Context1);
  const value2 = useContext(Context2);
  return(
    <div>
      {value1}
      {value2}
    </div>
  )
}

```