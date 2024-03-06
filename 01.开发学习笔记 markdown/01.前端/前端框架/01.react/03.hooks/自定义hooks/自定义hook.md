

原则是合理封装，当你自定义hooks中使用的useEffect和useState总次数不超过2次，你需要考虑是否真有封装的必要。要么挂靠执行时机，要么处理state，否则就没必要。

loading根据请求状态的显示隐藏：
clickOutSide：利用useRef 在html根节点绑定点击时间，判断点击的点是否在inside元素内部。

自定义hook提供了逻辑复用的便利。

但Mixin 的能力也并非 Hooks 一家独占，我们完全可以使用 Decorator 封装一套 Mixin 机制。也就是说， Hooks 不能依仗 Mixin 能力去力排众议。
```js
const HelloMixin = {
  componentDidMount() {
    console.log('Hello,')
  }
}

function mixin(Mixin) {
  return function (constructor) {
    return class extends constructor {
      componentDidMount() {
        Mixin.componentDidMount()
        super.componentDidMount()
      }
    }
  }
}

@mixin(HelloMixin)
class Test extends React.PureComponent {
  componentDidMount() {
    console.log('I am Test')
  }

  render() {
    return null
  }
}
```
`render(<Test />) // output: Hello, \n I am Test`

不过 Hooks 的组装能力更强一些，也容易嵌套使用。但需要警惕层数较深的 Hooks，很可能在某个你不知道的角落就潜伏着一个有隐患的useEffect。