# 3-2 为什么react列表要加key

## 为什么列表要加 key 属性，以及为什么用 index 是不好的

遍历对象的每一个属性深度对比是非常浪费性能的

React 使用列表的`key`来进行对比，如果不指定，就默认为 index 下标

那么，为什么 不指定 key/用 index 下标 是不好的呢？

假设现在有这样一段代码：

```
const users = [{ username: "bob" }, { username: "sue" }];

users.map((u, i) => <div key={i}>{u.username}</div>);

```

它会渲染出这个 DOM 树：

```
<div key="1">bob</div>
<div key="2">sue</div>

```

然后用户做了某个操作，`users` 被 `unshift` 另一个对象，变成：

```
const users = [
  { username: "new-guy" },
  { username: "bob" },
  { username: "sue" },
];

```

DOM 树就会变成这样，注意`key`的变化：

```
<div key="1">new-guy</div>
<div key="2">bob</div>
<div key="3">sue</div>

```

DOM 树的前后对比是这样的：

```
<div key="1">bob</div>   |  <div key="1">new-guy</div>
<div key="2">sue</div>   |  <div key="2">bob</div>
                         |  <div key="3">sue</div>

```

我们人类看得出来前后的变化只是在开头加了一个`new-guy`而已

但是由于 React 使用 key 值来识别变化，所以 React 认为的变化是：

1. bob -> new-guy
2. sue -> bob
3. 添加 sue

非常消耗性能 😭

但是如果我们一开始就给它指定一个合适的 key，比如用 name：

```
users.map((u, i) => <div key={u.username}>{u.username}</div>);

```

React 认为的变化就变成：

```
	                         |  <div key="1">new-guy</div>
<div key="bob">bob</div>   |  <div key="bob">bob</div>
<div key="sue">sue</div>   |  <div key="sue">sue</div>

```

这样只需要做一个`unshift`操作，性能节省 😃