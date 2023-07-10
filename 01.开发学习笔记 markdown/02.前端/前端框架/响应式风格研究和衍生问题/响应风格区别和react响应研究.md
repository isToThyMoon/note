
# 响应风格
react和vue响应风格区别就是：
一个是react基于发布订阅，数据是不可变数据（immutable思想坚决不修改对象属性），
一个是vue基于代理收集依赖触发更新，数据必须是可变数据（通过随意修改对象属性并进行代理收集依赖并在修改时触发更新）。
实际上这两种触发更新的风格也代表两种管理数据的风格，本章应该放在全局状态管理选择全局状态管理库的一章。
但是因为响应式风格更加底层，react原生是采用发布订阅加不可变数据的方式，而第三方也有mobx提供了可变数据代理的拓展，所以放在这儿来讲。

## 响应式reactive
什么是响应式reactive？
类似VM的架构，将状态从视图层分离出来，遵循数据模型驱动页面视图更新，开发者无需关注DOM操作而是关注业务逻辑和状态变更，开发者更新状态时，VM框架自动渲染页面完成视图的更新。这就是响应式reactive。

### react响应式
react的响应式和vue的响应式非常不同。
react的响应式是显式调用setState更新状态，核心是基于发布订阅模式。
react16中执行一次状态更新（相比15多了scheduler调度器调度任务）：
scheduler接收到更新，先判断有没有其他高优先级更新需要执行，没有其他更新，则将状态变化1到2交给reconciler。
reconciler（协调器）接收到更新，调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM，如果是update而不是mount，比对虚拟DOM，将需要更新的虚拟DOM打上update delete等标记，虚拟DOM完全是在内存中操作的一个对象，标记完成后将打了标记的虚拟DOM交给renderer。
renderer接收到通知，根据标记后到虚拟DOM执行DOM操作，js交出线权，交给渲染引擎绘制页面。

其中非常要注意rerender时，**调用函数组件、或class组件的render方法，将返回的JSX转化为虚拟DOM**这一步，react组件有更新时，深度遍历这棵树，进行递归更新，jsx构建是是自顶向下的进行递归更新的，也就是说，React 中假如 ChildComponent 里还有十层嵌套子元素，React 只能递归的把所有子组件都重新 render一遍（产出jsx构建虚拟dom），然后再通过diff算法决定要更新哪部分的视图，这个递归的过程叫做 reconciler。虽然说jsx的比对非常迅速，react刚出现时宣称的也是虚拟dom的比对非常迅速，减少真实dom的操作，但如果在大数据表格这种场景，多层级组件的无意义rerender。也是性能上的灾难。（因此，React 创造了Fiber，创造了异步渲染，其实本质上是弥补被自己搞砸了的性能）。

即使使用了RTK这样的全局状态管理，本质还是发布订阅模式通知对应组件rerender，其子组件即使没使用到父组件的属性，还是会rerender，这是react坚持不修改对象属性和比较式更新所决定的，如果要优化，需要对自组件进行shouldComponentUpdate或者PureComponent、React.memo等处理。

### vue2响应式
vue2中的响应式是使用观察者模式自动跟踪数据变化，自动更新组件。订阅式机制决定了它不仅知道哪些数据发生了更新，也知道这个数据更新了之后当前组件以及子组件的视图需不需要重新渲染。这是通过“依赖收集”实现的。
Vue的视图template会编译成render函数，
vue2中data数据对象（data/props/computed），使用 Object.defineProperty() 将每个属性都转换为 getter/setter。getter 用来收集依赖，setter 用来执行 notify，发布更新事件。每次调用各个组件的render函数时，通过getter，就能知道哪些数据被哪些组件的视图所依赖，下一次对这些数据赋值时，也就是调用setter，相应的视图就能触发重渲染，而无关的组件则不需要再次调用render函数，节省了开销。
vue的精准更新是如何做到的呢？
每个 Vue 组件实例都有一个对应的 watcher 实例，它控制着当前组件的视图更新，但是并不会掌管ChildComponent的更新。
在组件初次渲染（render）时，会记录组件用到了（调用 getter）哪些数据。
当数据发生改变时，会触发 setter 方法，并通知所有依赖这个数据的 watcher 实例，然后 watcher 实例调用对应组件的 render 方法，生成一颗新的 vdom 树，Vue 会将新生成的 vdom 树与上一次生成的 vdom 树进行比较（diff），来决定具体要更新哪些 dom。
watcher并不会掌管ChildComponent的更新。当组件更新到子组件的时候，会走patchVnode方法。
如果是普通的节点，就直接diff更新，patchVnode结束，并没有像常规思维中的那样去递归的更新子组件树。如果要是子组件（<child/>）那么在diff的过程只会对子组件的props，listenters等属性更新，！！而不会深入到组件内部进行更新。（重点！）这也就说明了，Vue 的组件更新确实是精确到组件本身的。

props传递给子组件的时候，子组件组件初始化阶段，会对props响应式处理，保存到了子组件的_props上，并且被定义成了响应式属性，而子组件的模板中对于 msg 的访问其实是被代理到 _props.msg 上去的，所以自然也能精确的收集到依赖，只要 ChildComponent 在模板里也读取了这个属性。
子组件对props的访问，props就拥有了子组件的render watcher（副作用函数收集到了自己的dep中）。父组件重新render的时候，重新计算子组件的props，触发了props的setting，所以子组件就重新render了。

有个特殊场景就是slot的更新：
假设我们有父组件parent-comp：

```jsx
<div>
  <slot-comp>
     <span>{{ msg }}</span>
  </slot-comp>
</div>
```
子组件 slot-comp：
```jsx
<div>
   <slot></slot>
</div>
```

这里的 msg 属性在进行依赖收集的时候，收集到的是 parent-comp 的渲染watcher。（至于为什么，你看一下它所在的渲染上下文就懂了。）
这个组件在更新的时候，遇到了一个子组件 slot-comp，按照 Vue 的精确更新策略来说，子组件是不会重新渲染的。
但是在源码内部，它做了一个判断，在执行 slot-comp 的 prepatch 这个hook的时候，会执行 updateChildComponent 逻辑，在这个函数内部会发现它有 slot 元素。
这里调用了 slot-comp 组件vm实例上的 `$forceUpdate`，那么它所触发的渲染watcher就是属于slot-comp的渲染watcher了。（官方文档：`vm.$forceUpdate`：迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。）
总结来说，这次 msg 的更新不光触发了 parent-comp 的重渲染，也进一步的触发了拥有slot的子组件 slot-comp 的重渲染。
它也只是触发了两层渲染，如果 slot-comp 内部又渲染了其他组件 slot-child，那么此时它是不会进行递归更新的。（只要 slot-child 组件不要再有 slot 了）。
似乎比起 React 的递归更新还是要好些的。

### vue3响应式
Vue3.0 使用 Proxy 作为响应式数据实现的核心，用 Proxy 返回一个代理对象，通过代理对象来收集依赖和触发更新。

对比react和vue，可以看出vue在响应式更新粒度上是比react要精确和细粒度的，虽然react优点是数据流清晰，vue可以任意修改对象属性来实现proxy依赖收集和精确更新，但vue遇到数据流问题时定位问题也是比reac要困难的，这是自由的代价。

那么react能用收集依赖的这套体系吗？不能，因为他们遵从Immutable的设计思想，永远不在原对象上修改属性，那么基于 Object.defineProperty 或 Proxy 的响应式依赖收集机制就无从下手了（你永远返回一个新的对象，我哪知道你修改了旧对象的哪部分？）
同时，由于没有响应式的收集依赖，React 只能递归的把所有子组件都重新 render一遍（产出jsx构建虚拟dom），然后再通过diff算法决定要更新哪部分的视图，这个递归的过程叫做 reconciler，听起来很酷，但是性能很灾难。

# 视图方案和响应原理无关
hooks是视图方案层面的东西，是改进class组件的，它们背后用的都是react原生的响应方案，也就是监测变量引用（reference）的变化，然后整个子树去协调更新。

而mobx，大家喜欢把它和redux、vuex做对比，看作是一个集中管理状态的工具。但其实这个看法不准确，矮化了mobx。mobx也可以用于管理组件的局部状态，它本质是一个替代性的响应方案，类似vue基于proxy的响应系统，并且提供了一些更丰富的微调选项。

视图方案采用class还是hook，和响应风格是发布订阅还是代理，是两个相互独立的维度。mobx作为一个响应方案，既可以和class组件一起用，也可以和hooks函数组件一起用，甚至还可以跟ng或vue一起用。事实上mobx本身就提供了一个用来代替useState的[hook](https://link.zhihu.com/?target=https%253A//mobx.js.org/api.html%2523uselocalobservable)。

react、vue、ng这些框架的功能其实可以分为两个部分，一个是UI视图的部分，负责对接dom，另一个是响应系统的部分，负责实现数据联动。这两部分理论上不是耦合的，是可以相互组合的。这也是社区有如此多方案的原因。

vue、mobx这种基于proxy的用起来简单，比起react原生方案来，具有本质性的优势。为什么这么说呢？当然一方面是因为react原生的方案乍看简单直接，稍微用起来就会发现各种无效协调、无效更新爆表，要控制好性能的话，无论class组件还是hooks方案都需要注意很多事情，心智负担比较重。但更重要的原因是，vue、mobx的响应方案，对接主流model风格比较方便。

# 响应原理和模型风格的关系
之前提到两种响应原理分别采用两种数据模式，不可变数据和可变数据，这个之前提了很多，函数式编程讲究唯一输入对应唯一数据，它是天生不可变数据的，而class式的面向对象编程，一个引用地址不变的对象，内部有很多可变的状态，还有一些改变这些状态的动作，它是天生可变数据的。

所以响应原理的不同，造成两大模型风格OOP和FP的不同，又或者说它们之间的关系是双向选择的。

vue和mobx这类基于proxy的响应方案，核心依赖的就是“容器对象引用不变，内部属性状态发生改变”，而面向对象的class实例的本质，就是一个引用不变的对象，里面有一些可变的状态，还有一些用来改变这些状态的动作。完美配合！

但如果配合react原生响应系统，用class来写model就比较麻烦。react原生响应方案最怕的就是“容器引用不变、内部变”这种东西，它反而要求“内部不要变，容器整体引用要变”，也就是你每一个动作都必须生成一个新的实例，这样它才能检测到状态的变化。刚好和对象的特性是反的。这就天然切合声明式编程、FP的特质。

class 
数据可变，甲风格典型OOP，适合对接vue、mobx；通过immer对接react不成熟
数据不可变，丙风格非典型FP，class外表下所有方法都是纯函数，适合对接react，包括class和hooks

函数
数据可变，丁风格非典型OOP，相当于把class的方法外置了，适合对接vue、mobx也可以通过immer对接react
数据不可变，乙风格典型FP，适合对接react，包括class和hooks

通过对比，react class组件是“面向对象”的吗？根本不是！一个不允许你修改 this.state属性、只能通过this.setState() 间接修改属性的class，本质上，类似上述的“丙风格”，是一种非典型的FP！这也是随后react推出hooks并建议开发者转向hooks的原因，react骨子里就是FP的。

react原生的响应式方案是非常依赖数据不可变性的。自从react最开始采用这种响应式方案的那一天起，它根子上就是对FP模型友好的，哪怕把组件包装成class，也不能使它更接近OOP。而题主之所以误认为react class组件是OOP，很可能是因为他用了mobx代替react原生响应系统。这时候react就只剩下一个UI dom对接的功能了，FP的核就被抽掉了，变成了表格中的甲方案，这就是典型的OOP。可实际上这个OOP不是因为用了class组件，而是因为用了mobx。如果题主不用mobx，而是redux，那么哪怕你完全不用hooks，都用class组件，你的redux里面也全是FP纯函数。

在我看来，四种风格其实只有class加可变数据或者hooks加不可变数据比较有意义，即然选择了一个框架，除了将业务逻辑和UI逻辑分离，其他都跟着官方走比较好，否则一旦有新的更新会非常痛苦。