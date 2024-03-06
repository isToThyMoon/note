---
title: node
categories:
  - 01.开发学习笔记 markdown
  - 07.前端
  - 04.node.js
---

用 node.js 开发脱离浏览器的 js 程序 (主要用于工具或者服务端, 比如文件处理)

用 express (它是一个流行的基于 nodejs 的服务器开发框架) 简述后端开发的流程 (前端和后端配合工作, 了解一下后端是很有好处的)

使用 electron 开发桌面程序


先学会阅读node的接口文档：

`fs.readdirSync(path[, options])`

这里的方括号表示可选参数，而方括号前面的参数是要使用可选参数前必填的参数。

也就是说如果填写了path参数，那么可以可选地传入options参数，但如果path都没传入，options也不能传。

这是根据js入参按顺序传递使用的特性决定的。

# 版本问题
https://nodejs.org/zh-cn/download/releases/ 查询node版本对应npm版本
通过nvm管理win和mac平台不同版本node 具体见笔记环境配置安装中node的安装配置。
node版本最好官方推荐的npm版本配合一致。
例如曾经和同事合作项目出现过问题，对方使用node14版本（官方推荐npm6）但使用npm8，两种npm版本对packeage-lock.json中的lockfileVersion不一致，npm6为lockfileVersion：1，npm8为2，导致安装时所有包版本无法和packeage-lock.json完全一致。

# package.json Dependencies依赖问题
Dependencies：
这里的依赖是会被最终构建到部署环境
DevDependencies：
开发过程中的依赖，比如eslint，一些@types，一些预处理包，协助构建prod代码，只存在开发阶段。不会构建到部署环境。

其实如果是node.js开发，这一点就更明显，因为项目发布的时候并不会编译代码，构建的过程就是安装依赖的过程，而安装依赖会指明--production参数 `npm install --production`
使用这个参数意味着只安装dependencies，因为显然生产环境（dependencies）不需要开发环境（devDependencies）的依赖。
所以如果一不小心把某个生产环境的依赖写到devDependencies中，那么显然发布之后会引用不到这个依赖。

PeerDependencies：
假设我们的项目使用了vuex作为状态管理器。vuex并没有dependencies。虽然我们都知道vuex一定会依赖vue。之所以vuex这样做，因为vuex知道你如果要使用他，就一定也会使用vue，所以他也就不会在dependencies中写入。事实上，这种情况是非常多的，尤其是对于插件而言，比如webpack，babel，eslint等等他们的插件都知道使用者一定会提供宿主自身（host）。

当然，插件仍旧是需要指明他所依赖宿主的版本号，而且他们往往对宿主环境依赖的版本号有更准确的要求。因为他们一般更可能会使用底层的api，而这些api可能在某一次minor或者patch的版本的升级中改变了。

为此，peerDependencies指明了自己希望的宿主版本号。



