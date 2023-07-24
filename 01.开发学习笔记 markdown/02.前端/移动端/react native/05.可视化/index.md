
Web 平台除了最基础的 `<p/> <img/>` 标签，还支持 SVG、canvas 这些自由度较高的绘制 API。它们支持最多的就是可视化场景，例如各种自定义图像和图表。下面就简单介绍一下 RN 中对标 Web 的的一些第三方库。

1.SVG
RN 的 SVG 支持是基于 react-native-svg 这个仓库，就个人的使用体验来说，基本和 Web 的 SVG 功能没啥两样。除了自绘一些自定义 SVG，它更多的功能是作为底层库支持上层图表的使用。

2.类 canvas
RN 中是没有 canvas 这个概念的，市面上也没有很好用的 canvas 替代品。有开发者搞出了 react-native-skia，也有一些 demo 展示。但它目前其实还是一个实验性项目，上生产环境风险还是太大了。不过就我个人经验来说，很多绘制功能都能基于 SVG 实现，必须用 canvas 的情况应该并不多见。

基于 skia 你再把 flutter 集成进去，可以玩套娃游戏了 :)

3.OpenGL 支持
在移动端平台上，WebGL 就是浏览器平台对 OpenGL ES 的封装，RN 本身已经很贴近 Native 平台了，就没必要舍近求远支持 WebGL 了，直接支持 OpenGL ES 就好。

目前 RN 对 OpenGL 的支持是基于 gl-react 的，底层的适配层是基于 expo-gl。网上有个 gl-react 的 demo 教程，有需要的读者可以学习一下。

因为个人没做过 RN 3D 相关的需求，所以也无法对该库得出一个准确的评价，需要读者自行判断

4.图表功能
图表是个很现实的需求，在一些 B 端场景上经常会有报表需求。因为 RN 只有 SVG 支持比较完善，所以 RN 的图表基本都是基于 SVG 绘制的。

Web 上基于 SVG 的图表库有很多，但是 RN 能用到的可能没有几个。主要原因是 RN 和 Web 的宿主环境不一样，一些图表库可能会用到 Web 特供 API（例如 getElmentById），像 ECharts 这样的库 RN 肯定是用不了的。

可迁移使用的库一般要满足两个条件：

纯逻辑：D3.js 一些纯逻辑的库，只用到 JS 的语言能力，例如 d3-scale
平台无关：直接基于 React 构建，没有用到平台特有 API，例如 victory-native
这里有一个基于 D3.js 实现的股票箱型图的[视频教程](https://link.zhihu.com/?target=https%253A//www.youtube.com/watch%253Fv%253DgLsi1IO4BpA)，感兴趣的读者可以了解一下。

5.海报功能
海报分享是现如今非常常见的一个前端功能，网页基本是基于 canvas 生成分享海报的，RN 虽没有较好的 canvas API，但是有个不错的库——react-native-view-shot，可以把 RN 写的 View 生成一张图片。借用这个库就能在 APP 本地生成图片，转而实现海报功能。

