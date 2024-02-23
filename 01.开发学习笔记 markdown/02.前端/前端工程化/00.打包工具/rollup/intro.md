# 

比较不同打包工具的区别 参考资料：[Overview | Tooling.Report](https://bundlers.tooling.report/)

我们要开发的项目的特点：

是库，而不是业务项目
希望工具尽可能简洁、打包产物可读性高
原生支持ESM
所以选择rollup，安装：
```
pnpm i -D -w rollup
```