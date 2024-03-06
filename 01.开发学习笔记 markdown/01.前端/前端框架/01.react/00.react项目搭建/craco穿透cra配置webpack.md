
`npx create-react-app dadada --template typescript`
2023年，create-react-app基本上也被官方放弃，react官方开始推next.js
并且使用vite创建新项目也成为主流（2023 vite的HMR还是有点问题，需要手动刷新修改才生效）。


https://juejin.cn/post/6871148364919111688

使用 CRA 脚手架创建的项目，如果想要修改编译配置，通常可能会选择 npm run eject 弹出配置后魔改。但是，eject 是不可逆操作，弹出配置后，你将无法跟随官方的脚步去升级项目的 react-script 版本。
如果想要无 eject 重写 CRA 配置，一般可以有以下几种方式

1.通过 CRA 官方支持的 --scripts-version 参数，创建项目时使用自己重写过的 react-scripts 包
2.使用 react-app-rewired + customize-cra 组合覆盖配置
3.使用 craco 覆盖配置

第一种方式很棒，但这里暂时不做讨论。

第二种方式相对第三种略复杂一些，而且有很多方言配置，很不喜欢，暂不讨论。

第三种方式craco完全是对webpack配置文件做修改，和直接写webpack配置文件心智负担差别不大，并且我注意到 AntDesign 官方也开始推荐 craco 了，这里详细讨论一下第三种 craco 的使用，经过项目的实测，用起来还算顺手。


# 安装：
1.`npm install @craco/craco --save-dev`

2.项目根目录创建 craco.config.js 文件
```
/* craco.config.js */

module.exports = {
  ...
}
```

3.修改 package.json 的 scripts 命令
```
/* package.json */

"scripts": {
-   "start": "react-scripts start",
+   "start": "craco start",
-   "build": "react-scripts build",
+   "build": "craco build"
-   "test": "react-scripts test",
+   "test": "craco test"
}
```

基础的配置到此完成了，接下来是处理各种配置的覆盖，完整的 craco.config.js 配置文件结构，可以在 craco 官方的readme中详细查询：Configuration Overview

# 版本兼容控制
6.4.3之前版本craco 支持react-script4.x
最新的craco7 支持react-script5.x

craco-less2.0.0 依赖craco^6.1.2 react-script^5.0.0 也就是craco6和react-script5


# 区分环境
@craco/craco 提供了 whenDev、whenProd、whenTest、when 函数，用于在书写 craco.config.js 配置文件时根据不同的编译环境确定配置;

whenDev、whenProd、whenTest 分别对应的是 process.env.NODE_ENV 的 3 种值（development、production、test），接收两个参数：

第一个参数是 function，对应该编译环境下，执行函数，函数一般应当将需要的配置作为返回值。
第二个参数是默认值，非指定编译环境时，返回该默认值。



when 是区分环境的万金油函数，接收 3 个参数：

第一个参数是判断的变量。
第二个参数是 function，参数一的变量为 true 时，执行该函数，函数一般应当将需要的配置作为返回值。
第三个参数是默认值，参数一的变量为 false 时，返回该默认值。

引用方式：
const { whenDev, whenProd, when } = require('@craco/craco')
复制代码
下方的示例中有多处使用，可以参照了解其用途。

# 常用配置
craco 有提供一些 plugins，集成了诸多功能，让覆盖配置变得更加容易。

除此之外，则需要我们对 webpack 的配置有一定的了解，根据 craco.config.js 的文件结构去增加配置。

通过 configure 函数扩展 webpack 配置
几乎所有的 webpack 配置均可以在 configure 函数中读取、覆盖，webpack 详细的配置参数结构可以查阅 webpack 官方的文档。

需要注意一点，configure 既可以定义为对象，也可以定义为函数，使用过程中，我发现二者是互斥的关系。这里推荐使用函数形式，因为当我想要覆盖 mini-css-extract-plugin 的配置时，发现对象形式的 configure 定义，不能达到目的。

> configure 可以扩展所有的 webpack 配置，你可以将所有的配置都在 configure 中写完，但是，craco 提供了若干快捷的方式去定义指定的配置，例如：babel、alias、webpack 的 plugins 等。因此，推荐有快捷的方式尽量用快捷方式，搞不定的才放到 configure 中去定义。

```js
/* craco.config.js */
const { whenDev, whenProd, when } = require('@craco/craco')

module.exports = {
  babel: {},
  webpack: {
    /**
     * 重写 webpack 任意配置
     *  - 与直接定义 configure 对象方式互斥
     *  - 几乎所有的 webpack 配置均可以在 configure 函数中读取，然后覆盖
     */
    configure: (webpackConfig, { env, paths }) => {
      // 修改 output
      webpackConfig.output = {
        ...webpackConfig.output,
        ...{
          filename: whenDev(() => 'static/js/bundle.js', 'static/js/[name].js'),
          chunkFilename: 'static/js/[name].js',
        },
      }

      // 关闭 devtool
      webpackConfig.devtool = false

      // 配置扩展扩展名
      webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        ...['.scss', '.less'],
      ]

      // 配置 splitChunks
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        ...{
          chunks: 'all',
          name: true,
        },
      }

      // 覆盖已经内置的 plugin 配置
      webpackConfig.plugins.map((plugin) => {
        whenProd(() => {
          if (plugin instanceof MiniCssExtractPlugin) {
            Object.assign(plugin.options, {
              filename: 'static/css/[name].css',
              chunkFilename: 'static/css/[name].css',
            })
          }
        })
        return plugin
      })

      return webpackConfig
    },
  }
}

```



# antd按需加载和全局变量
`npm install @craco/craco babel-plugin-import craco-less --save-dev`

```
/* craco.config.js */
const CracoLessPlugin = require('craco-less')

module.exports = {
  babel: {
    plugins: [
      // 配置 babel-plugin-import
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
        'antd',
      ],
    ],
  },
  webpack: {
  
  },
  // craco 提供的插件
  plugins: [
    // 配置 less
  	{
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // 自定义主题（如果有需要，单独文件定义更好一些）
              '@primary-color': '#1DA57A',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
}

```