

webpack让现代开发可以在js文件中直接写import './index.scss'这样的引入scss语法。
但我们知道js中其实是无法处理scss文件的，必定是经过了编译转化成浏览器能处理的方式。

# style标签动态插入的方式：

css-loader：解释(interpret) @import和url()语法。使用import和require的方式处理css中的依赖，例如@import和url()等引用外部文件的声明。为什么要这么处理呢？因为这种处理方式使得css文件中引用资源模块化，而且Webpack只处理 JavaScript，这种模块化处理有利于编译抽离。
例如：
```js
url(/image.png)=>require('./image.png')
@import 'style.css' => require('./style.css')
@import url(style.css) => require('./style.css')
```
style-loader：运行时动态插入style标签到head标签中让CSS代码生效。

```js
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }]
  }
}
```
loder处理顺序自下往上。（或者从末尾到开始，从右到左）
这里先使用css-loader后使用style-loader处理css文件，先加载css文件然后再样式插入到DOM中。
如果css文件中通过@import引入其他css文件，打包运行后html按引入顺序动态生成多个style标签。

原理是样式文件base.css和入口文件app.js将会一起被打包到main.bundle.js文件里面，当浏览器加载index.html文件时会动态执行脚本，把样式使用style标签插入到DOM中。

# link标签引入样式
style-loader高版本已经不支持link标签插入文件样式了，因为如果在一个js文件引入多个css文件会生成多个link标签，而html中每一个link标签都会发送一次网络请求，所以这种方式慢慢就被弃用。

这里我们仅仅拿来探索一下，知道有这种方式的存在就可以了。

首先，我们先把style-loader版本降到0.20.0，然后更改配置
```js
module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader/url'
      }, {
        loader: 'file-loader'
      }]
    }]
  },
}
```
打包完成后，html文件有link标签href是该css文件。

# 分离css文件

如果需要单独把 CSS 文件分离出来，我们需要使用mini-css-extract-plugin插件。

之前是使用extract-text-webpack-plugin插件，此插件与 webpack4 不太匹配，现在使用mini-css-extract-plugin

安装mini-css-extract-plugin，最好将mini-css-extract-plugin用于生产模式，因为该插件使用目前会导致HMR功能缺失。因此在平常的开发模式中，我们还是使用style-loader。

`npm i mini-css-extract-plugin --save-dev`

引入 optimize-css-assets-webpack-plugin 插件来实现 css 压缩

`npm install optimize-css-assets-webpack-plugin --save-dev`

处理scss，安装 sass 依赖，其中sass-loader依赖node-sass，sass-loader会调用node-sass来处理sass文件：

`npm i node-sass sass-loader --save-dev`

为 CSS 加上浏览器前缀，安装postcss-loader和autoprefixer依赖：

`npm install postcss-loader autoprefixer --save-dev`


配置文件：

```js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将css单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: {
    main: './css-handle/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    publicPath: './', // 引用的路径或者 CDN 地址
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
      use: [
      // {
      //  loader: 'style-loader' // 用style标签将样式插入到head中
      //}, 
      {
        /** webpack loader used always at the end of loaders list */
        loader: MiniCssExtractPlugin.loader // 将css样式文件用link标签引入，使用此loader就不需要用style-loader，即使用了也不会有效果
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2 // 一个css中引入了另一个css，也会执行之前两个loader，即postcss-loader和sass-loader
        }
      },
      {
        // 使用 postcss 为 css 加上浏览器前缀
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [require('autoprefixer')]
          }
        }
      },
      {
        loader: 'sass-loader' // 使用 sass-loader 将 scss 转为 css
      }]
    }]
  },
  // 拆分代码配置项
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        common: {
          name: 'common',
          minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb，如果没设置为0，common模块就不会抽离为公共模块，因为原始大小小于30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(), // 会删除上次构建的文件，然后重新构建
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: path.resolve(__dirname, 'index.html'), // 根据此模版生成HTML文件
      chunks: ['main'] // entry中的main入口才会被打包
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), // 用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, // 传递给 cssProcesso
      canPrint: true // 布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```