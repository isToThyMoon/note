# FlatList
FlatList 主要是注意 3 个点：

FlatList 提供自定义的头部/底部/空白/分割线组件，比一般的 Web 组件封装更彻底一些
React 渲染列表的时候会要求加 key 以提高 diff 性能，但是 FlatList 封装的比较多，需要用 keyExtractor 这个 API 来指定列表 Cell 的 key
FlatList 性能优化的内容官网写的不是很好，我之前写了个更易懂的，有需求的同学可以了解一下
