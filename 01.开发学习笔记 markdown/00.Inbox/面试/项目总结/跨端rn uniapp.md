# 

jsbridge




# 下拉刷新的bounce弹动效果
https://juejin.cn/post/7058159181290799135

通过 react-native-gesture-handler + react-native-reanimated 实现完全自定义的下拉刷新功能。下面是可以直接复制使用的demo代码。下拉刷新行为与安卓原生下拉刷新行为一致，若需要实现iOS端下拉刷新需要禁用 bounces 、通过正值的Y轴偏移动画来添加上 overdrag 效果。

