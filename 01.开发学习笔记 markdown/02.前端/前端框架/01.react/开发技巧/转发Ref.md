

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

#  React.ForwardRefRenderFunction
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