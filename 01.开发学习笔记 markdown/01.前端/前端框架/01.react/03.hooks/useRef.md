
react组件中，只有状态变化会引发组件rerender，并且每一帧render都对应一组状态，而当你需要存储一个值，它是跨越整个组件render rerender周期的，你需要ref。
它有点类似class组件中的this.xxx。实例属性，在实例整个周期内保持不变，除非主动操作修改。

# useRef

再回顾下React如何处理声明式ref的:
React will assign the current property with the DOM element when the component mounts, and assign it back to null when it unmounts.

通过之前的知识我们可以达成几点共识：
给ref.current赋值是个副作用，所以一般在Did函数或者事件处理函数里给ref.current赋值；
组件在卸载时要清理ref.current的值。

## 解决的问题
useState的state值在每一帧都是独立的。

为了在多次渲染的多帧之间产生联系，官方创造了useRef。
useRef和直接在函数组件中创造的值区别在于，useRef对重复渲染过程中保持着对ref值的唯一引用。对象在函数的生命周期内一直存在。
但对ref的current值修改不会像setState一样触发重新的渲染。

我们可以借用它来保存组件是否是第一次渲染的状态。但是最常用（最初的设计理由）的还是保存对页面节点的引用，实现数据驱动UI这种开发模式的一个例外，一个逃生舱，直接操作dom元素。

我们用它来访问DOM，从而操作DOM，最典型的例子如点击按钮聚焦文本框：

```js
const Index = () => {
  const inputEl = useRef(null);
  const handleFocus = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
};
```

注意：返回的 ref 对象在组件的整个生命周期内保持不变。
它类似于一个 class 的实例属性，我们利用了它这一点。看useEffect应用场景文件夹下第一个需要首次加载不执行副作用的例子。

刚刚举例的是访问DOM，那如果我们要访问的是一个组件，操作组件里的具体DOM呢？我们就需要用到 React.forwardRef 这个高阶组件，来转发ref，如：

```js
const Index = () => {
  const inputEl = useRef(null);
  const handleFocus = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <Child ref={inputEl} />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
};

const Child = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```


# Ref转发
以下以更业务的角度解释官网的Ref转发：

考虑这个渲染原生 DOM 元素 button 的 FancyButton 组件：

```js
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```
出于业务的目的或者组件化搭建自己的组件库，我们通过FancyButton封装了原生的DOM元素button。
React 组件隐藏其实现细节，包括其渲染结果。
对于大部分应用组件这种封装是最常见也是理想的，但其对 FancyButton 或 MyTextInput 这样的高可复用“叶”组件来说可能是不方便的。
什么是高复用的叶组件。
这些组件倾向于在整个应用中以一种类似常规 DOM button 和 input 的方式被使用，并且访问其 DOM 节点对管理焦点，选中或动画来说是不可避免的。
我们封装了原生的button input，但是我们还是要以最直接的方式去操作这些原生DOM的焦点，选中或动画等等。
在Ref章节我们知道对于dom节点的直接控制可以通过Ref来操作。

对于这种封装后的react组件，自然而然我们需要将最内层的dom节点Ref抛出到最适合处理的层级，或者说，把ref层层向下转发到目标的原生dom，直接通过ref操作它。

这就是Ref转发。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));
```

> 第二个参数 ref 只在使用 React.forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref。
> Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

```js
// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样。

以下是对上述示例发生情况的逐步解释：

我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
我们向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。
当 ref 挂载完成，ref.current 将指向 <button> DOM 节点。

## React.ForwardRefRenderFunction
在上面的React.forwardRef()中传入一个函数，该函数有props和ref两个参数。
传入的函数类型就是React.ForwardRefRenderFunction，我们可以用它来定义。

```js
// 定义
const forwardRender: React.ForwardRefRenderFunction<HTMLDivElement,AppProps> = ({ value }, ref) => {
  return <div ref={ref} />;
};

const App = React.forwardRef(forwardRender);
```

```js
// 使用
const ref = useRef<HTMLDivElement>(null);
return <App value="hello" ref={ref} />;
```
如果你要在外部访问子组件的方法和属性，必须要用到Ref转发结合useImperativeHandle抛出子组件的属性和方法。

# Ref访问子组件属性和方法
hook时代的函数组件，ref访问子组件的属性和方法，你需要useImperativeHandle，将子组件的属性和方法暴露出去。
具体看useImperativeHandle的使用。

# Ref的滥用
useRef其实就是class时代React.createRef()的等价替代。
最初用作对页面dom的持续引用。
但因为实现特殊，常作他用，而且是非常高频的“滥用”。
useRef仅在mount时期初始化对象，而update时期返回mount时期的结果（memoizedState），可以通过.current修改，着意味着一次完整的生命周期中，useRef保留的引用使用不变。
跨完整周期保存这一特性让它成为了hooks中的闭包救星。但也无可避免产生滥用。

每一个function的执行都有相应的scope，对于面向对象来说，this引用即是连接了所有scope的context（当然前提是同一个class生产的实例下）。
在react hook函数组件中，每一次的render由彼时的state决定，也就是帧的概念，每一帧的state对应一个UI渲染结果，render完成context即刷新，优雅的UI渲染，干净利落。
但useRef多少违背这一设计初衷，useRef可以横跨多次render生成的scope（也就是跨多次帧），它能保留下已执行的渲染逻辑，却也能使已渲染的context得不到释放，威力无穷也作恶多端。

useRef类似this，this是面向对象中最主要的副作用，
在 React 的 class 组件中，render 函数是不应该有任何副作用的。一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。
这就是为什么在 React class 中，我们把副作用操作放到 componentDidMount 和 componentDidUpdate 函数中。
我们在声明周期中大量使用this，this得以修改组件的属性，这些给render结果增加不确定性的操作，自然就是副作用。

useRef也不例外，所以一般useRef的操作写在useEffect或者event handler中。从这一点来说，拥有useRef写法的Function Component注定难以达成“函数式”。



# 补充：class时代使用Ref
尽管通过状态和jsx，我们实现了UI=f(state)并且react不推荐开发者直接命令式操作dom，而是采用数据驱动UI变化。
但某些特殊情况下我们还是需要直接操作dom的一些行为，如input框的聚焦。
ref是一个逃生舱，允许我们直接操作dom。
而且react在此基础上允许ref绑定react组件，访问子组件方法和属性，或通过ref转发的形式，访问子组件的dom。


另外一个逃生舱是hooks组件的useEffect，在此不作展开。

ref绑定dom：
```ts
import React, { createRef, RefObject } from 'react';

// redux
import { AnyAction } from 'redux';
// import { actionCreators } from './store';
import { connect } from 'react-redux';

// ts redux
import { ThunkDispatch } from 'redux-thunk';


export interface AppProps {
}

export interface AppState {
    
}

class UserbehaviorView extends React.Component<AppProps, AppState>{
    
    myRef: RefObject<HTMLDivElement>;

    // static contextType = idContext;

    constructor(props: AppProps) {
        super(props);
        // 创建ref
        this.myRef = createRef();

        this.state={
        }
    }
    
    componentDidMount(): void {
        //使用ref
        const chartPlaceholder = this.myRef.current;
    
    
    }

    render(): React.ReactNode{
        return (
            <React.Fragment>
                <!--绑定ref-->
                <div className="chart-placeholder" style={{marginTop: '15px'}} ref={this.myRef}/>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state:any)=>{
    return {
        comId: state.getIn(['APP', 'comId']),
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any,any,AnyAction>)=>{
    return {
        dispatchSwitchDetailDataModal(){
            dispatch({
                type: 'DISPATCHGETDETAILUSERBEV',
                value: {userBevModalVisiable: false, userBevModalData: []}
            })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserbehaviorView);

// export default UserbehaviorView;

```

ref访问子组件方法：
```js
// ParentComponent.js
import React, { Component } from 'react';
import ChildComponent from './ChildComponent';

class ParentComponent extends Component {
  constructor(props) {
    super(props);
    this.childRef = React.createRef();
  }

  handleClick = () => {
    // 通过ref引用调用子组件方法
    this.childRef.current.childMethod('参数值');
  }

  render() {
    return (
      <div>
        <ChildComponent ref={this.childRef} />
        <button onClick={this.handleClick}>调用子组件方法</button>
      </div>
    );
  }
}

export default ParentComponent;


// ChildComponent.js
import React, { Component } from 'react';

class ChildComponent extends Component {
  childMethod = (parameter) => {
    console.log('子组件的方法被调用，参数:', parameter);
    // 执行子组件的逻辑
  }

  render() {
    return <div>子组件内容</div>;
  }
}

export default ChildComponent;
```