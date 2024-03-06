
生命周期不同时期初始化了哪些数据的问题，容易在该生命周期内调用还没有初始化的数据。

# 引用类型在react的坑
开发过程中遇到的引用类型问题，父组件state中有属性foo，作为props传递给子组件。
子组件在componentDidUpdate时做校验，props foo发生改变时依赖foo值对子组件的属性做些处理。
bug在于，
直接
```
const bar = this.props.foo;
bar.push(...);
```
这里因为引用类型传值的问题，bar.push改变bar变量对应的对象，导致this.props.foo也被改变了，也就是在子组件内部改变了父组件的state foo;
整个值传递和修改陷入混乱。
没有遵循开发原则，不要修改传递进来的props（函数只能使用而不要修改入参）


# 重新渲染一个组件
通过改变key的方式我们可以手动通过react的机制让组件重新渲染，比如antd table的样式在数据变化后，产生了两条横向滚动条的bug，注意key改变来rerender只有在react组件上有效，绑定在常规dom上是无效的。

# react性能
在财务递延的需求中，发现将所有table数据，表头数据全放在state中，在加载大量数据时，table的表头数据变成一个几百个对象的list。
即使是在后续setState时只修改state中一个属性，页面渲染也会极其卡顿。
重构代码，增加组件层级分散state，另外采用pureComponent来控制多余渲染，react中父组件重绘，子组件会全部更新，通过shouldComponentUpdate来控制子组件是否重新渲染，或者采用PureComponents的方式来控制。

# input
input绑定state值，此时input的value被react接管，在setState来修改input的value时，不能设置undefined，会报受控组件的错误，可以设置成空字符串，此时input就被清空为placeholder状态。

# react获取真实dom的时机
react的componentdidupdate是在render函数之后的commit阶段执行，这时候能获取到dom但是获取不到真实的修改后到dom属性，dom还在渲染之中。



# 在卸载的组件中更新状态或者调用方法
常见于ajax请求
当进行一个耗时的请求，该请求在完成后修改组件信息
但是在完成请求前切换组件导致该组件被卸载，请求完成后修改被卸载掉的组件就会触发该报错。

class组件写法是在willUnMount时将setState置空。

hook写法，
写一个useMountedRef 检查组件挂载状态。

在promise的then方法中 只有useMountedRef为true时再进行setState操作

设置类字段Mounted = true

在didMount周期内setState时做检查 this.Mounted && this.setState()

在componentWillUnmount周期内 this.Mounted = false;