---
title: 01.路由跳转
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 01.react
  - 03.router
tags:
  - react项目
date:
---



当我们要使用路由功能
早期可用版本4.0（18年）
react-router-dom4.0/5.0

## react-router：
react-route是跨平台的，内置通用组件和通用Hooks。实现了路由的核心功能。
实际上官方的git仓库只有remix-run的react-router这一个repo，它们版本是同一的，但包含了三个package：
react-router 核心功能
react-router-dom web端
react-router-native 移动端
由此可见它们的关系。

## react-router-dom：
基于react-router，加入了在浏览器运行环境下的一些功能，例如：
Link组件，会渲染一个a标签，Link组件源码a标签行;      
BrowserRouter和HashRouter组件，前者使用HTML5的新BOM api:history为基础（每个现代项目都应该支持它，能用就用），pushState和popState事件构建路由，后者使用window.location.hash和hashchange事件构建路由。（详细区别见浏览器 BOM）

react-router-dom依赖react-router，所以我们使用npm安装依赖的时候，只需要安装相应环境（web or mobile）下的库即可，不用再显式安装react-router。基于浏览器环境的开发，只需要安装react-router-dom

react-router-dom的HashRouter, BrowserRouter, Route, Switch, Link负责路由管理，它的withRouter方法和react-loadeable配合使用

（react-loadable    能够异步加载组件）


-------


# class组件中使用路由

```js
import { HashRouter as Router, NavLink, Route, Switch, RouteComponentProps, withRouter  } from "react-router-dom";
```

组件的props类型需要组合RouteComponentProps
需要withRouter高阶函数封装使用到history api的组件

`export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tabs));`


使用 withRouter(SomeComponent) 将一个非路由组件连接到路由系统，返回一个 “连接组件”， 以便于在这个非路由组件中访问离自己最近的父路由的 match, location, history 等 props 对象的成员。

注意：不像 React Redux 的 connect 订阅状态会监听到变化，withRouter() 不会监听到 location 对象的变化。相反，在位置更改从 <Router> 组件传播出去之后重新渲染。这意味着 withRouter 不会在路由转换时重新渲染，除非它的父组件重新渲染。

## path
this.props.location.pathname 获取#后所有的路径名


-------


# 路由跳转
1.Link和NavLink跳转

2.withRouter装饰器高阶组件后 通过this.props.history.push()跳转

```js
// 跳转路由：
<NavLink to="/" exact >企业概况</NavLink>

this.props.history.push(url);
```

# 路由传递参数v4 v5

## params
params在HashRouter和BrowserRouter路由中刷新页面参数都不会丢失

```
<Route path='/path/:name' component={Path}/>

<link to="/path/2">xxx</Link>
this.props.history.push({pathname:"/path/" + name});
```

接收参数：this.props.match.params.name

## search （又叫query查询）
```
<Route path='/web/search ' component={Search}/>
<link to="web/search?id=12121212&name=dada">xxx</Link>
this.props.history.push({pathname:`/web/search?id=${row.id}`});
this.props.history.push({pathname:'/detail',search:'?id=2'})
```

接收参数：this.props.location.search
备注：获取到的search是urlencoded编码字符串(例如: ?id=10&name=zhangsan)，需要借助qs或者query-string解析参数成对象

## state
优点：可以传对象
缺点： `<HashRouter>`刷新页面，参数丢失

```
<Route path='/sort ' component={Sort}/>
//路由链接(携带参数)：
<Link to={{pathname:'/sort',state:{name:'tom',age:18}}}>详情</Link>
this.props.history.push({pathname:"/sort",state:{ name:'sunny'}});
```

读取参数用: this.props.location.query.state 



-------




