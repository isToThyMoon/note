# Image
Image 组件在表现上我个人认为非常优秀了，但在一些细节上初步上手的同学可能还是不太习惯：

没有 CSS 那么多的滤镜属性，只支持模糊效果，不过个人基本没遇到过图像滤镜需求
加载网络图片时，必须指定图片宽高，若不设置尺寸默认为 0
Android 上图片尺寸非常大时（貌似是 5000px？），图片会直接加载不出来，不过这种场景很少很少，基本都会瓦片图分步加载，要不然大图会引起 OOM 的
iOS/Android 对 webp 的支持也不是开箱即用的，需要分别配置：
iOS 使用 SDImageWebPCoder 提供支持
Android 使用 fresco 提供支持
具体配置方案可以参考 react-native-webp-format
Android 不支持点九图