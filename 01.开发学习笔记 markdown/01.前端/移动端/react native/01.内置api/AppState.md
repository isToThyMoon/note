# AppState
AppState 这个 API 在实际开发中主要是监听 APP 前后台切换的，这个 API 在 iOS 上表现符合语义，但是 Android 上就有问题了，因为 AppState 在 Android 端的实现其实是基于 Activity 的生命周期 的。

就比如说 AppState 提供的 background 这个状态，其实是基于 Activity 的 onPause() 的，但是根据 Android 的文档，onPause() 执行时有这么几种场景：

APP 切换到系统后台（符合预期）
当前 RN 容器 Activity 上层覆盖了新的 Activity（不符合预期）
当前 RN 容器 Activity 上层覆盖了 Dialog，例如权限申请弹窗（Dialog 本质上就是个半透明 Dialog）（不符合预期）
综上所述，使用 AppState 监听 APP 状态时要充分考虑 Android 的这些“异常”表现是否会引起程序 BUG。


