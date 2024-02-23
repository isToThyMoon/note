# 构建流程
Webpack强调模块化开发，而那些文件压缩 合并、预处理等功能，不过是他附带的功能。

webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
1、 初始化参数 ：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
2、 开始编译 ：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3、 确定入口 ：根据配置中的 entry 找出所有的入口文件
4、 编译模块 ：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5、 完成模块编译 ：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
6、 输出资源 ：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
7、 输出完成 ：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统，在以上过程中，webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴 趣的事件后会执行特定的逻辑，并且插件可以调用 webpack 提供的 API 改变 webpack 的运行 结果

# 分别介绍一下 bundle，chunk，module 的作用是什么
1、module：开发中的每一个文件都可以看作是 module，模块不局限于 js，也包含 css，
图片等
2、chunk：表示代码块，一个 chunk 可以由多个模块组成
3、bundle：最终打包完成的文件，一般就是和 chunk 一一对应的关系，bundle 就是对
chunk 进行编译压缩打包等处理后的产出

# 热更新原理
https://juejin.cn/post/6939678015823544350
1、基本定义
webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR 。这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。
2、核心定义
2.1）HMR 的 核心就是客户端从服务端拉去更新后的文件 ，准确的说是 chunk diff (chunk需要更新的部分)，实际上 WDS (Webpack-dev-server) 与浏览器之间维护了一个 websocket，当本地资源发生变化时， WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比
2.2）客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)， 这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR

# 常见的 Loader
1、file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
2、url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内
容注入到代码中去
3、source-map-loader：加载额外的 Source Map 文件，以方便断点调试
4、image-loader：加载并且压缩图片文件
5、babel-loader：把 ES6 转换成 ES5
6、css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
7、style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
8、eslint-loader：通过 ESLint 检查 JavaScript 代码


# Loader 和 Plugin 的不同？
1.不同的作用

Loader 直译为"加载器"。webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力。

Plugin 直译为"插件"，Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。 在 webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的 时机通过 webpack 提供的 API 改变输出结果

2.不同的用法

Loader 在 module.rules 中配置，也就是说他作为模块的解析规则而存在。类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）

Plugin 在 plugins 中单独配置。 类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入

# 如何利用 webpack 来优化前端性能
1、压缩代码。uglifyJsPlugin 压缩 js 代码， mini-css-extract-plugin 压缩 css 代码
2、利用 CDN 加速，将引用的静态资源修改为 CDN 上对应的路径，可以利用 webpack 对于 output 参数和 loader 的 publicpath 参数来修改资源路径
3、删除死代码（tree shaking），css 需要使用 Purify-CSS
4、提取公共代码。webpack4 移除了 CommonsChunkPlugin (提取公共代码)，用optimization.splitChunks 和 optimization.runtimeChunk 来代替

# 是否写过 Loader 和 Plugin？思路？

1、基本定义
Loader 像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个 Loader 通过链式操作，将源文件一步步翻译成想要的样子。
2、编写思路
编写 Loader 时要遵循单一原则，每个 Loader 只做一种"转义"工作， 每个 Loader的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用this.callback()方法，将内容返回给 webpack，还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去，此外 webpack 还为开发者准备了开发 loader 的工具函数集——loader-utils

相对于 Loader 而言，Plugin 的编写就灵活了许多， webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果

3、编写注意事项

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情

Loader 运行在 node.js 中，我们可以调用任意 node.js 自带的 API 或者安装第三方模块进行调用

webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 webpack 该 Loader 是否需要二进制数据

尽可能的异步化 Loader，如果计算量很小，同步也可以

Loader 是无状态的，我们不应该在 Loader 中保留状态

使用 loader-utils 和 schema-utils 为我们提供的实用工具

加载本地 Loader 方法


# 使用 webpack 开发时，你用过哪些可以提高效率的插件？
1、webpack-dashboard：可以更友好的展示相关打包信息。
2、webpack-merge：提取公共配置，减少重复配置代码
3、speed-measure-webpack-plugin：简称 SMP，分析出 webpack 打包过程中 Loader 和
Plugin 的耗时，有助于找到构建过程中的性能瓶颈
4、size-plugin：监控资源体积变化，尽早发现问题

SplitChunksPlugin
在 webapck配置中的optimization 字段中配置。  cacheGroups是关键，将文件提取打包成公共模块，像抽取node_modules里的文件。

html-webpack-plugin
该插件将为你生成一个 HTML 文件， 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。

clean-webpack-plugin
用于在打包前清理上一次项目生成的 bundle 文件。默认情况下，此插件将删除webpack的 Output.Path 目录中的所有文件，以及在每次成功重建后所有未使用的webpack资源 （assets）。如果使用的webpack版本是 4 以上的，默认 清理 `<PROJECT_DIR>/dist/` 下的文件。

mini-css-extract-plugin
将 css 成生文件，而非内联 。该插件的主要是为了抽离 css 样式,防止将样式打包在 js 中引起页面 样式加载错乱的现象。支持按需加载 css 和 sourceMap

PurifyCSSPlugin 包名purifycss-webpack
从CSS中删除未使用的选择器（删除多余的 css 代码）。 和extract-text-webpack-plugin使用

optimize-css-assets-webpack-plugin
压缩css文件

CssMinimizerPlugin
压缩css文件 用于 webpack 5 

HotModuleReplacementPlugin 模块热替换
由webpack 自带。在对CSS / JS文件进行修改时，可以立即更新浏览器（部分刷新）。依赖于webpack-dev-server

imagemin-webpack-plugin
批量压缩图片

UglifyJsPlugin 
包名：uglifyjs-webpack-plugin
压缩js文件

ProvidePlugin 包名：ProvidePlugin
由 webpack 自带。自动加载模块，而不必在任何地方import或require它们。例如：`new webpack.ProvidePlugin({$: 'jquery',React: 'react'})  `

CompressionPlugin 包名：compression-webpack-plugin
启用 gzip 压缩 需要后端配合也开启gzip

CopyWebpackPlugin 包名： copy-webpack-plugin
将已存在的单个文件或整个目录复制到构建目录中。多用于 将静态文件 因在打包时 webpack 并不 会帮我们拷贝到 dist 目录 拷贝到 dist 目录

DefinePlugin 包名：DefinePlugin
由 webpack 自带 。设置全局变量。如：new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})

## 提高打包速率：
DllPlugin 包名：DllPlugin
由 webpack 自带。 dllplugin和 dllreferenceplugin 提供了拆分捆绑包的方法，可以大大提高构建时间性能。

DLLReferencePlugin 包名：DLLReferencePlugin
由 webpack 自带。它引用了仅需要预先构建的依赖项的DLL-only-Bundle。

ParallelUglifyPlugin 包名：webpack-parallel-uglify-plugin
开启多个子进程，把对多个文件压缩的工作分别给多个子进程去完成。减少构建时间。

HappyPack 包名：happypack
让 webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。提升构建速度。

# 在生产环境下如何提升 webpack 构建速度
1、优化 babel-loader（加缓存，加 hash）
2、noParse（不去解析属性值代表的库的依赖）
3、IgnorePlugin（忽略本地化内容，如引入了一个插件，只用到了中文语言包，打包的时候 把非中文语言包排除掉）
4、happyPack（多进程进行打包）
5、parallelUglifyPlugin（多进程打包 js，压缩，优化 js）

# 请详细说明一下 Babel 编译的原理是什么？
大多数 JavaScript Parser 遵循 estree 规范，Babel 最初基于 acorn 项目(轻量级现代 JavaScript解析器) Babel 大概分为三大部分：
1、解析：将代码转换成 AST
2、词法分析：将代码(字符串)分割为 token 流，即语法单元成的数组
3、语法分析：分析 token 流(上面生成的数组)并生成 AST，转换：访问 AST 的节点进行变
换操作生产新的 AST，taro 就是利用 babel 完成的小程序语法转换,生成：以新的 AST 为基础 生成代码




在多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
1、通过 externals 配置来提取常用库
2、利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
3、使用 Happypack 实现多线程加速编译
4、使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
5、使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码

# 打包能做的优化 （开放式题目）
打包优化的目的
1、优化项目启动速度，和性能
2、减少项目在首次加载的时长（首屏加载优化） （首屏加载最好的解决方案就是ssr（服务端渲染），还利于seo 但是一般情况下没太多人选择ssr，因为只要不需要seo，ssr更多的是增加了项目开销和技术难度的。）

1. cdn加载不必多说，就是改为引入外部js路径 config.externals
2. 路由懒加载 在 Webpack 中，我们可以使用动态 import语法来定义代码分块点 (split point)： `import(’./Fee.vue’) // 返回 Promise` 如果您使用的是 Babel，你将需要添加 syntax-dynamic-import 插件，才能使 Babel 可以正确地解析语法。
3. 服务器和webpack打包同时配置Gzip。Gzip是GNU zip的缩写，顾名思义是一种压缩技术。它将浏览器请求的文件先在服务器端进行压缩， 然后传递给浏览器，浏览器解压之后再进行页面的解析工作。在服务端开启Gzip支持后，我们前端 需要提供资源压缩包，通过Compression-Webpack-Plugin插件build提供压缩

需要后端配置，这里提供nginx方式：

```
http:{
    gzip on; #开启或关闭gzip on off 
    gzip_disable "msie6"; #不使用gzip IE6 
    gzip_min_length 100k; #gzip压缩最小文件大小，超出进行压缩（自行调节） 
    gzip_buffers 4 16k; #buffer 不用修改 
    gzip_comp_level 8; #压缩级别:1-10，数字越大压缩的越好，时间也越长 
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png; # 压缩文件 类型 
}
```
然后在config文件中配置compression-webpack-plugin在生产环境引入该插件

4. 优化打包chunk-vendor.js文件体积过大 开启splitchunck 按入口或者按文件类型、是否来自node module划分chunk

# 什么是长缓存？在 webpack 中如何做到长缓存优化
浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存
储，但是每一次代码升级或者更新，都需要浏览器去下载新的代码，最方便和最简单的更新方式
就是引入新的文件名称

具体实现
在 webpack 中，可以在 output 给出输出的文件制定 chunkhash，并且分离经常更新的代
码和框架代码，通过 NameModulesPlugin 或者 HashedModulesPlugin 使再次打包文件名不变





# 怎么配置单页应用？怎么配置多页应用？
1、基本定义

单页应用可以理解为 webpack 的标准模式，直接在 entry 中指定单页应用的入口即可

多页应用的话，可以使用 webpack 的 AutoWebPlugin 来完成简单自动化的构建，
但是前提是项目的目录结构必须遵守他预设的规范

2、 配置方式
多页应用中要注意的是：每个页面都有公共的代码，可以将这些代码抽离出来，避免重复的加载，比如，每个页面都引用了同一套 css 样式表，随着业务的不断扩展，页面可能会不断的追加，所以一定要让入口的配置足够灵活，避免每次添加新页面还需要修改构建配置


# 文件指纹是什么？怎么用？
文件指纹是打包后输出的文件名的后缀
1、Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
2、Chunkhash：和 webpack 打包的 chunk 有关，不同的 entry 会生出不同 chunkhash
3、Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变


# webpack代码分割 Code Splitting
https://webpack.docschina.org/guides/code-splitting/
在最开始使用Webpack的时候, 都是将所有的js文件全部打包到一个build.js文件中(文件名取决与在webpack.config.js文件中output.filename), 但是在大型项目中, build.js可能过大, 导致页面加载时间过长. 这个时候就需要code splitting, code splitting就是将文件分割成块(chunk), 我们可以定义一些分割点(split point), 根据这些分割点对文件进行分块, 并实现按需加载。

SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

mini-css-extract-plugin：用于将 CSS 从主应用程序中分离。

动态导入 按需加载：
调用 import() 会在内部使用 promise。

## 怎么实现 webpack 的按需加载？什么是神奇注释?
1、按需加载
在 webpack 中，import 不仅仅是 ES6 module 的模块导入方式，还是一个类似 require 的
函数，我们可以通过 import('module')的方式引入一个模块，import()返回的是一个 Promise 对象； 使用 import（）方式就可以实现 webpack 的按需加载
2、神奇注释
在 import（）里可以添加一些注释，如定义该 chunk 的名称，要过滤的文件，指定引入
的文件等等，这类带有特殊功能的注释被称为神器注释
```
import _ from 'lodash';

function component(){
  const element = document.createElement('div');
  // 直接使用lodash
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());


// 修改成动态引入
function getComponent(){
  return import('lodash').then(({default: _})=>{
    const element = document.createElement('div');
    element.innerHTML =  _.join(['Hello', 'webpack'], ' ');
    return element
  })
}

getComponent().then((component)=>{
  document.body.appendChild(component)
})

```
需要 default 的原因是自 webpack 4 之后，在导入 CommonJS 模块时，将不再解析为 module.exports 的值，而是创建一个人工命名空间对象来表示此 CommonJS 模块。更多有关背后原因的信息，请阅读 [webpack 4: import() and CommonJs](https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655)。

此时webpack打包，lodash 会分离到一个单独的 bundle。

import()返回的是一个promise，所以自然可以用async和await来简化。
```js
async function getComponent(){
  const element = document.createElement('div');
  const { default: _ }= await import('lodash');
  element.innerHTML = _.join(['Hello','webpack'], ' ');

  return element;
}
```

