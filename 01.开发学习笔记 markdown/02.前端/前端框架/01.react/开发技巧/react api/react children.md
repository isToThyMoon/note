

React.Children 提供了用于处理 this.props.children 不透明数据结构的实用方法。

## React.Children.map
`React.Children.map(children, function[(thisArg)])`
在 children 里的每个直接子节点上调用一个函数，并将 this 设置为 thisArg。如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。

> 注意
> 如果 children 是一个 Fragment 对象，它将被视为单一子节点的情况处理，而不会被遍历。

## React.Children.forEach
`React.Children.forEach(children, function[(thisArg)])`
与 React.Children.map() 类似，但它不会返回一个数组。

## React.Children.count
`React.Children.count(children)`
返回 children 中的组件总数量，等同于通过 map 或 forEach 调用回调函数的次数。

## React.Children.only
`React.Children.only(children)`
验证 children 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

> 注意：
> React.Children.only() 不接受 React.Children.map() 的返回值，因为它是一个数组而并不是 React 元素。

## React.Children.toArray
`React.Children.toArray(children)`
将 children 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 this.props.children 之前对内容重新排序或获取子集时。

> 注意：
> React.Children.toArray() 在拉平展开子节点列表时，更改 key 值以保留嵌套数组的语义。也就是说，toArray 会为返回数组中的每个 key 添加前缀，以使得每个元素 key 的范围都限定在此函数入参数组的对象内。

