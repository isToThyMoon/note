# 弹窗：

Modal组件在iOS平台，弹框是全屏的。iOS是基于 Window 实现的，所以是覆盖在视图上面的。
RN 官方之前提供的 Modal 组件有个很明显的问题，Modal 无法覆盖到状态栏。
比如说我们做了一个弹窗，背景是黑色半透明的，但状态栏是白色的，这样在感官上就非常的割裂。
所幸 0.62 版本上了一个 statusBarTranslucent 属性，设为 true 就可以覆盖到状态栏之上。如果是 0.62 以下的版本，就需要改一些配置了，可以参考 stackoverflow 的这个回答：[How to hide the statusBar when react-native modal shown?](How%20to%20hide%20the%20statusBar%20when%20react-native%20modal%20shown?)

但是在Android平台却不是，会有状态栏，因为Android 端基于的Dialog，内容无法从状态栏处开始布局。


