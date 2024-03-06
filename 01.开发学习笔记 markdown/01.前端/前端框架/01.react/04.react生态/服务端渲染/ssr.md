
https://juejin.cn/post/7075536329777512455
配套有个仓库例子react-ssr-master 可以看下整体的流程和代码写法


在react中，实现SSR
主要有两种形式：
● ⼿动搭建⼀个 SSR 框架
● 使⽤成熟的SSR 框架，如 NextJs

![同构模型](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd9940e0f4b34a7990c72e49868f1b0c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

# 服务端渲染（SSR）

用户请求服务器，服务器上直接生成HTML内容并返回给浏览器。页面的内容是由Server端生成的。一般来说，服务器渲染的页面交互能力有限，如果要实现复杂交互，还是要通过引入JavaScript文件来辅助实现。服务端渲染这个概念，适用于任何后端语言。其实这是一项很古老的技术，很早之前服务端就是通过 JSP、PHP 等模版引擎，渲染填充数据的模版，产生 html 返回的。只不过这时候没有组件的概念。

有了组件之后再做服务端渲染就不一样了，你需要基于这些组件来填充数据，渲染出 html 返回。并且在浏览器渲染出 html 后，还要把它关联到对应的组件上，添加交互逻辑和管理之后的渲染。这时候的 SSR 服务只能是 Node.js 了，因为要服务端也要执行 JS 逻辑，也就是渲染组件。

可以看到，同样的组件在服务端渲染了一次，在客户端渲染了一次，这种可以在双端渲染的方式，叫做同构渲染。

## 同构
同构这个概念存在于Vue，React这些新型的前端框架中，同构实际上是客户端渲染和服务端渲染的一个整合。我们把页面的展示内容和交互写在一起，让代码执行两次（其实就一次，通过一些算法标识如果 key 一致就不在渲染）。在服务器端执行一次，用于实现服务端渲染，在客户端再执行一次，用于接管页面交互。

同一个组件在服务器端`renderToString(<App/>)`产出html字符串返回给浏览器，浏览器接收到它后，客户端有react相关的js要再次运行并渲染：
```js
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App';

hydrateRoot(document.getElementById('root'), <App/>);
```

注意，这里执行的不是 renderRoot 的 api，而是 hydrateRoot 的 api。
因为浏览器接收到 html 就会把它渲染出来，这时候已经有标签了，只需要把它和组件关联之后，就可以更新和绑定事件了。

hydrate 会在渲染的过程中，不创建 html 标签，而是直接关联已有的。这样就避免了没必要的渲染。

# 流程
整体react SSR原理并不复杂：
node server接收客户端请求，得到当前请求url路径，然后在已有路由表内查找到对应组件，拿到需要请求的数据，将数据作为props context 或者store形式传入组件。
然后基于react内置到服务端渲染方法renderToString()把react组件渲染为html字符串，
因为已经在服务端渲染过，所有浏览器（客户端）加载页面的时候只是渲染字符串而已，速度很快。
浏览器端只是hydrate，重用了服务器端输出的html节点，把渲染和已有的 html 标签关联，开始进行渲染和节点对比，然后执行组件内事件绑定和一些交互，流程结束。


hydrate 是 React 中提供在初次渲染的时候，去复用原本已经存在的 DOM 节点，减少重新生成节点以及删除原本 DOM 节点的开销，来加速初次渲染的功能。


csr中，我们在组件里写的 jsx 会被编译成 render function，执行产生 vdom（React Element），经过 reconcile 的过程转为 fiber 树。

reconcile 的过程分为 beginWork 和 completeWork 两个阶段，beginWork 从上往下执行不同类型的 React Element 的渲染，而 completeWork 正好反过来，依次创建元素、更新属性，并组装起来。

这里创建的元素是挂载在 fiber.stateNode 上的，并且 dom 元素上也记录着它关联的 fiber 节点。

而hydrate 会在 beginWork 的时候对比当前 dom 是不是可以复用，可以复用的话就直接放到 fiber.stateNode 上了。

这样在 beginWork 的过程中依次 hydrate，就把 dom 和对应的 fiber 关联了起来。

然后在 completeWork 的时候，就不用再走创建标签的逻辑，因为 dom 已经有了，就可以跳过这部分。

这就是 hydrate 的原理。

fiber 树创建成功之后，之后的再次渲染就和客户端渲染没有区别了。

这样我们就把 SSR 从 renderToString 到 hydrate 的流程给串联了起来。

这就是ssr节省的时间和渲染成本。