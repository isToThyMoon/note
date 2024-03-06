React Native 的 style 样式属性只提供了基础的布局属性，例如 flexbox layout、fontSize 等等。但是很多 CSS3 的特效属性，React Native 基本上都得引入第三方库。我梳理了一下常用的几个 UI 特效要用到的属性和插件，方便开发者使用。

# 圆角效果
这个直接使用 View styles 属性的 borderRadius 即可，RN 同时也支持设置 View 四个角的单独弧度。

# 模糊效果
blur 效果要用到 @react-native-community/blur 这个 RN 官方社区库。这个 RN 模糊库比 CSS 的 blur() 属性更强大一些，CSS 只支持高斯模糊，这个库支持起码三种模糊效果，不过具体效果还是要和 UED 商议。

# 阴影效果
阴影可以用 RN 提供的 Shadow Props，但是它是分平台的：

iOS 提供了 shadowColor、shadowOffset、shadowOpacity 和 shadowRadius 四个属性，和 CSS 的 box-shadow 属性完全对标，可以满足绝大多数的场景
Android 只提供了 shadowColor 和 elevation 两个属性，而且从严格意义上来说，elevation 其实是「仰角」的意思，是 Android 官方提供的属性，模拟现实中的从上向下的光照引起的阴影变化。虽然理论一套一套的，但是在现实开发中就会发现，elevation 搞出来的阴影非常丑，和 iOS 比起来完全是天壤之别。个人一般建议使用渐变替代阴影。

# 渐变效果
渐变要使用一个第三方库：react-native-linear-gradient，正如库名，这个仓库只提供「线性渐变」的解决方案，以个人经验，线性渐变在绝大部分情况下都足够了。如果要使用「径向渐变」，可以使用 react-native-svg 的 RadialGradient 组件。