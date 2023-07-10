# 技术栈
react redux rxjs redux-observered ts

# 常规经验
每个请求返回的接口的每个字段都要做空值校验 不要相信你一定会得到格式正确的数据
解决报错问题的最好方法就是你预判尽可能多的非常规情况
经常遇到一个问题，返回值是0的情况，0是一个falsy值。不要简单对这个字段做true false判定。

# 浏览器问题
事件优先级 onmousedown > onblur > onclick 
所以onblur中设置隐藏元素，隐藏元素的click事件无法执行。 考虑setTimeout或者用onmousedown替代onclick事件。

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
没有遵循开发原则，觉得不要修改传递进来的props（函数只能使用而不要修改入参）


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
