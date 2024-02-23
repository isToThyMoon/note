# use

最后是`React v18.3`之后会发布的新原生`hook` —— `use`

`using data = **use**(ctx);`

这个`hook`可以接收两种类型数据：

- `React Context`

此时`use`的作用与`useContext`一样。

- `promise`

此时如果这个`promise`处于`pending`状态，则最近一个祖先`<Suspense/>`组件可以渲染`fallback`。

比如，在如下代码中，如果`<Cpn />`组件或其子孙组件使用了`use`，且`promise`处于`pending`状态（比如请求后端资源）：

```

js复制代码
function App() {
  return (
    <div>      
			<Suspense fallback={<div>loading...</div>}>
        <Cpn />    
			</Suspense>    
			</div>
	 );
}

```

那么，页面会渲染如下结果：

```

html复制代码
<div>  <div>loading...</div></div>
```

当请求成功后，会渲染`<Cpn />`。