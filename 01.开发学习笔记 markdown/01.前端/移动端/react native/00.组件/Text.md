# 

Text 组件是很常用的属性，有几个小点需要开发者注意一下：

Android 上存在吞字现象，现象是部分机型上最后一个字符不显示，原因不明。目前的折衷方案是文字的最后一行多加一个空格 or 零宽字符
Android 有个属性叫 includeFontPadding，设置为 false 后可以减少文字上下的 padding（这个 padding 是为角标字符预留的，例如 H₂O、2ⁿᵈ），这样可以更好的实现上下垂直居中对齐
实现文字的居中对齐时，最好用一个 View 嵌套一个 Text 标签，然后给 View 设置一些 flex 属性控制 Text 居中对齐。
Web 开发中经常使用 lineheight 属性实现单行文字的垂直居中对齐，这种实现方式本来就是权宜之计，在 RN 上行不太通。最佳实践还是利用 flex 属性实现居中对齐。
字体的配置相对来说比较麻烦，有个不错的教程 [Ultimate guide to use custom fonts in react native](https://link.zhihu.com/?target=https%253A//mehrankhandev.medium.com/ultimate-guide-to-use-custom-fonts-in-react-native-77fcdf859cf4) 可以参考一下