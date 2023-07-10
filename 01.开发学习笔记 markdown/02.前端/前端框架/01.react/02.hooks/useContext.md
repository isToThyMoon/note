
React 的组件化让我们可以将不同的业务代码分割开，但是也带来了一个问题，那就是组件间共享状态是非常不方便的。比如，你有个很多组件都会用到的状态，app 主题状态，如何让一个组件随时可以获取到这个状态呢？大家可能听过状态提升，它缓解但是并没有解决这个问题。而context就是为了解决这个问题，大家可以把它理解成是React自带的Redux，实际上Redux就是用context实现的

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法；
主要应用场景在于很多不同层级的组件需要访问同样一些的数据。请谨慎使用，因为这会使得组件的复用性变差。


# API

## React.createContext
```js
const MyContext = React.createContext(defaultValue);
```

需要注意点是：**组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。** 此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。


## Context.Provider 提供数据源

```js
<MyContext.Provider value={/* 某个值 */}>
```

Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。（穿透，无视shouldComponentUpdate规则）

## 消费context数据源 class写法
Class.contextType

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

简单来说用静态属性初始化contextType， 拿到context，获取context的值。

## Context.Consumer 消费context数据
纯函数没有class静态方法contextType时可以用这种写法：
```
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```
查找到上方离这个context最近的Provider提供的 value 值

## useContext 消费context数据源hook写法

不多解释，show the code：

```js
import React,{useContext}  from 'react';

const Context1 = React.createContext({});
const Context2 = React.createContext({});

function YourDad(){
  
  return (
    <Context1.Provider value={mes: '1'}>
        <Context2.Provider value={mes: '2'}>
            <MyChild/>
        </Context2.Provider>
    </Context1.Provider>
  )
}

function MyChild(){
  const value1 = useContext(Context1);
  const value2 = useContext(Context2);
  return(
    <div>
      {value1}
      {value2}
    </div>
  )
}
export default YourDad;

```

useState + useContext对于多个store仍需要维护多个Context Provider。因为当context值改变，所有消费该context的组件都会重新渲染，即使是组件仅用到了context的一部分，容易导致不必要的无用渲染，造成性能损失。（比如react-redux v6完全基于Context API而导致性能大幅下降，v7又回退到之前的内部订阅方案）context更适合放类似主题这种变化不大的全局数据，而并不适合存放频繁更新的复杂状态集合。

一个简单例子：
定义两个Counter子组件A和B，分别消费同一个Context中的a值和b值
Counter组件包含了显示渲染时的时间（Date.now()），如果组件重新渲染，显示的时间就会改变。
```js
import React, { useState, useContext, createContext } from "react";

const context = createContext(null);

const CounterA = () => {
  const [value, setValue] = useContext(context);
  return (
    <div>
      <div>
        A: {value.a};<span> Time: {Date.now()}</span>
      </div>
      <button onClick={() => setValue((prev) => ({ ...prev, a: prev.a + 1 }))}>
        A+1
      </button>
    </div>
  );
};

const CounterB = () => {
  const [value, setValue] = useContext(context);
  return (
    <div>
      <div>
        B: {value.b};<span> Time: {Date.now()}</span>
      </div>
      <button onClick={() => setValue((prev) => ({ ...prev, b: prev.b + 1 }))}>
        B+1
      </button>
    </div>
  );
};

const TimeC = () => {
  return <div>TimeC: {Date.now()}</div>;
};

const initValue = {
  a: 0,
  b: 1
};

const Provider = ({ children }) => {
  const [value, setValue] = useState(initValue);
  return (
    <context.Provider value={[value, setValue]}>{children}</context.Provider>
  );
};

export default function App() {
  return (
    <Provider>
      <div className="App">
        <CounterA />
        <CounterB />
        <TimeC />
      </div>
    </Provider>
  );
}

```
可以看到，只要一个Counter改变了Context，另一个消费该Context的Counter也同样进行了重新渲染，作为对照的TimeC组件则没有重新渲染。