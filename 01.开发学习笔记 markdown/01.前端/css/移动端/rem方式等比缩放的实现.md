---
title: rem方式等比缩放的实现
categories:
  - 01.开发学习笔记 markdown
  - 07.前端
  - 05.移动端
---

```html
// 自适应宽度
var width = document.documentElement.clientWidth || document.body.clientWidth;
// 开发时psd是375宽度 根节点font-size为100px，换其他客户端尺寸时这里获取一个比例 然后按实际的客户端宽度等比缩放
// 需要注意的是，这里结合响应式布局的viewport来看，必须要设置viewport的width=device-width；不然会出现layout viewport依赖的根宽高出错。
var ratio = width / 375;
var fontSize = 100 * ratio;
document.getElementsByTagName('html')[0].style['font-size'] = fontSize + 'px';
```

简短点一行代码解决：

```html
document.documentElement.style.fontSize = document.documentElement.clientWidth / 375 * 100 + 'px';
```