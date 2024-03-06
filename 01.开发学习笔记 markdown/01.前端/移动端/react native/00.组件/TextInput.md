# TextInput
输入框组件也是很常用的属性，个人用下来有几个不爽的地方：

iOS/Android 的默认样式差距比较大，不做封装的话会写非常多的平台相关代码
placeholder 的文字比较长时，若出现换行现象，没有 API 去控制它的行高
若一个页面出现多个 TextInput 组件时，需要用 ScrollView 组件包裹，才能实现不同 TextInput 组件焦点切换的功能