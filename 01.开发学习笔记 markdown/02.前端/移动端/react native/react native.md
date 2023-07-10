# react native

# 头部状态栏：

在 iOS 中，页面默认**全屏**（状态栏不占空间），状态栏内容默认是深色。

因为页面全屏，所以如果我们不进行处理，内容会跑到状态栏下面去。同时，由于 iPhone X 等刘海屏手机的出现，导致状态栏的高度发生了变化，由之前的 `20` 变成了 `34`。为了解决此问题，我们可以手动给顶部组件设置 `paddingTop`（值根据机型判断），或者使用 `SafeAreaView` 组件。

> react默认就是状态栏透明、内容区域穿透全屏的样子，添加SafeAreaView
> 
> 
> `SafeAreaView`的目的是在一个“安全”的可视区域内渲染内容。具体来说就是因为目前有 iPhone X 这样的带有“刘海”的全面屏设备，所以需要避免内容渲染到不可见的“刘海”范围内。本组件目前仅支持 iOS 设备以及 iOS 11 或更高版本。
> 
> `SafeAreaView`会自动根据系统的各种导航栏、工具栏等预留出空间来渲染内部内容。更重要的是，它还会考虑到设备屏幕的局限，比如屏幕四周的圆角或是顶部中间不可显示的“刘海”区域。
> 

在 Android 中，页面默认**非全屏**（状态栏占空间），状态栏内容默认是**浅色**。

Android 中对状态栏的支持经历了几个版本：

- **Android4.4（API 19） ~ Android 5.0（API 21）**:通过 `FLAG_TRANSLUCENT_STATUS` 设置页面为全屏且状态栏半透明（浅灰色）。
- **Android 5.0（API 21）**：提供了 `android:statusBarColor` 属性和 `setStatusBarColor`方法用来设置状态栏的颜色。
- **Android 6.0（API 23）**：通过 `SYSTEM_UI_FLAG_LIGHT_STATUS_BAR` 支持设置状态栏内容为深色。

其中，如果想要设置状态栏颜色，则不能设置 `FLAG_TRANSLUCENT_STATUS`。

在 Android 应用中，每个 Activity 都对应一个状态栏。这意味着，为一个页面设置状态栏不会对其他页面的状态栏造成影响。

### React Native 中的状态栏

React Native 官方提供了 `StatusBar` 组件用于控制状态栏，支持设置内容深浅色，状态栏背景（Android）等。

`StatusBar` 可以同时添加多个，而属性则会按照加载顺序合并（后者覆盖前者）。

不同于 Android 中的状态栏，在 React Native 中状态栏是公用的，任何一个地方修改状态栏都会导致状态栏发生变化，即使切换到了其他未设置的页面。因此，我们需要在每个页面渲染时都设置一下相应的状态栏，或是在离开设置了状态栏的页面时重置状态栏。

react-native-navigation-hybrid

# 弹窗：

Modal组件在iOS平台，弹框是全屏的。iOS是基于 Window 实现的，所以是覆盖在视图上面的。

但是在Android平台却不是，会有状态栏，因为Android 端基于的Dialog，内容无法从状态栏处开始布局。