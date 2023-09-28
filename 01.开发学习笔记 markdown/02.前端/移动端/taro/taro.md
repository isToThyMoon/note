# # taro

npx @tarojs/cli init myApp 选择react-native的模版

```bash
# 更新相关依赖。在初始化完成后或 Taro 版本更新后执行，用于同步 peerDependencies。

$ yarn upgradePeerdeps

# 打包 js bundle 及静态资源。在初始化完成后执行，用于打包默认使用的 bundle。platform 可选 ios, android

$ yarn build:rn --platform ios

# 启动 bundle server

$ yarn start

# 启动 iOS

$ yarn ios

# 启动安卓

$ yarn android
```

1. 使用 Flex 布局
2. 基于 BEM 写样式
3. 采用 style 属性覆盖组件样式