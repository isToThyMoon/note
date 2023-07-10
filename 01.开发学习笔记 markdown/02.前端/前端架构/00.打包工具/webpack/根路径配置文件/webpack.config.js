const HtmlWebpackPlugin = require('html-webpack-plugin'); // 需要另外npm安装 webpack不自带
const CleanWebpackPlugin = require('clean-webpack-plugin') // 同上
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // css压缩插件

const path = require('path'); // node.js操作文件的模块 这里的引入是commonJS的语法

const webpack = require('webpack'); // 引入自带webpack模块 如热模块更新功能 webpack.HotModuleReplacementPlugin(),


module.exports = {
    mode: 'production',     //打包模式 影响打包出的文件的组织形式 是否压缩  
    // devtool: cheap-module-eval-source-map,     // 打开sourceMap 将打包文件和源代码建立关系映射(development模式最佳实践 代码错误提示精确只到行 监控其他第三方模块 快速执行)
    // devtool: cheap-module-source-map  // production模式下最佳实践
    //entry: './src/index.js',     // 入口文件 以哪个文件为入口主体打包
    //entry: {
    //    main: './src/index.js'
    //},
    entry: {
       main: './src/index.js',      //打包成两个文件 一个叫main.js 一个叫sub.js 那么output输出名也要作占位符处理
       sub: './src/index.js',
    },

    // output: {                       // 输出设置
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, 'dist') // 输出文件的路径（一定是绝对路径） 这里__dirname指webpack.config.js这个文件所在的文件夹 resovle方法返回的是两者结合的路径
    // },

    output: {                       // 输出设置
        publicPath: 'http://cdn.cn',  // 我们打包完成的js可能不会放在服务器同html一起的位置 而是放在cdn中负载均衡加速用户使用。那么加上publicPath 会在注入到html的js地址加上此前缀 更多output值见documentation-configuration中更多配置。
        filename: '[name].js', // 对应entry的入口文件 打包出来该是什么名字
        chunkFileName: '[name]chunk.js', // 入口文件中引入的lodash这个异步引入的库，它走chunkFileName这个配置。'vendors~lodash.chunk.js'。
        path: path.resolve(__dirname, 'dist') // 输出文件的路径（一定是绝对路径） 这里__dirname指webpack.config.js这个文件所在的文件夹 resovle方法返回的是两者结合的路径
    },

    devServer: {                   // 通过webpack-dev-server起一个服务器
        contentBase: './dist',     //在config文件同文件夹下的dist目录起一个server server。启动后会发现并没有和打包命令一样创建一个dist目录，其实webpack-dev-server是把打包内容放在了内存中提高打包和运行速度。
        open: true,                // 帮助我们自动打开浏览器 打开页面
        proxy: {
            '/api': 'http://localhost:3000' // 接口模拟代理
        },
        hot: true,  // 配合webpack.HotModuleReplacementPlugin()打开热模块更新 当代码发生样式更改时仅直接替换样式而不是重刷整个页面 
        // HML的功能是当你修改了css的内容，server只更新css样式内容，如果之前通过js调用的方式创建了多个关联此样式修改的元素 并不会丢失这些js调用的结果
        hotOnly: true, // 如果HML出了错，server也会帮我们自动刷新一下页面，这里设我true即使hml没有生效(发生错误之类)也不让浏览器自动重新刷新 失效就失效 不做额外处理
    },
    optimization: {
        splitChunks: { // 即使splitChunks为空对象，也会加载一段默认配置，具体见 splitChunksPlugin官网介绍。
            chunks: 'all', // 如果值为async，做代码分割时只对异步代码生效 （initail 同步代码）如果异步引入loadash第三方库 此时打包时会自动分离lodash。如果按正常方式同步引入lodash， async的配置就不会分离第三方库代码，全部到main.js。如果想打包分离同步引入到库代码，chunks配置成‘all’,并且需要同时配置cacheGroups,
            minSize: 20000, // 小于该值的模块就不会额外打包进vendor了
            minRemainingSize: 0,
            minChunks: 1, // 打包完成后，每生成一个js文件就叫一个chunk，打包生成的chunk有几个用到了该模块 低于minChunk的模块不单独分割。
            maxAsyncRequests: 30, //同时加载的js数 分割出的文件最大数量
            maxInitialRequests: 30, // 首次 入口文件 加载js数
            automaticNameDelimiter: '~', // 组合入口生成打包文件时连接符号
            enforceSizeThreshold: 50000,
            cacheGroups: { // 同步代码走chacheGroups寻找配置，下面配置了test框定模块范围，那么即使直接写的模块导出引入，小于minSize 它也不会被打包进vendor 因为不再node_module中，那么这种自己写的模块代码会走cacheGroups的default配置
                // 为什么叫cacheGroups？如果没有该项配置，我们同时有jquery和lodash两个安装的第三方库，同时都在入口后续引入，打包时在splitChunks中走配置，发现两个库大小大于minSize值，都会分隔，那么打包出来一个jquery文件，一个lodash文件。如果我们想不要每个库都单独打包成一个文件，那么开启cacheGroups选项，在打包jquery时进入cacheGroups，匹配规则，打包lodash时，也匹配规则，当所有代码分析完毕，将所有符合一个规则的模块打包到一起。这也是为什么叫cache，先不打包，缓存等待所有webpack分析完成。
                vendors: {
                test: /[\\/]node_modules[\\/]/, // 配合chunks值为all打包同步引入的第三方库代码， 现在test值表示是否该库代码是在node_modules里 符合该要求，第三方库代码如lodash会被打包进vendors~main.js。 vendors表示符合vendors规则的这个组，属于第三方vendors，main表示该代码归属于哪个入口。
                priority: -10, // 优先级，一个第三方库可能满足多个cacheGroups规则，那么到底放在哪里，根据优先级来定，值越大优先级越高。比如lodash这个库其实满足vendors规则，但是default规则根本没有配置test，所以lodash也满足default，那么看优先级，vendors规则优先级高，走vendors规则打包。
                filename: 'vendors.js', // 不愿意加上～main 直接指定打包后的文件名。可以不设置 不设置就采用默认行为
                reuseExistingChunk: true, // 如果该模块之前已经被打包过了，不重复打包进该组，直接复用。
                },

                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },

                default: {
                minChunks: 2,
                priority: -20,
                filename: 'common.js', // 同样不需要分入口的话可以指定默认的打包文件名。
                reuseExistingChunk: true,
                },

                fooStyles: { //基于入口提取 CSS 当你使用路由动态加载但是想要通过入口加载对应的 CSS 文件时这将会非常有用。 这样也避免了 ExtractTextPlugin 造成的 CSS 重复复制问题。
                    name: 'foo',
                    test: (m,c,entry = 'foo') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                    chunks: 'all',
                    enforce: true
                },
                barStyles: {
                    name: 'bar',
                    test: (m,c,entry = 'bar') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
                    chunks: 'all',
                    enforce: true
                },



            },
        },

        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
        
    },

    module: {
        rules: [{
            test: /\.(jpg|png|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    // placeholder语法 具体更多占位符写法见WP官方file-loader或url-loader介绍的placeholder部分
                    name: '[name]_[hash].[ext]',   // 表示打包后的图片名和原文件一致 加hash值
                    outputPath: 'images/',   // 输出路径：dist下的images文件夹
                    limit:10240,             // 小于10KB转成base64打包进js 大于10KB按路径打包成单独文件
                }
            }
        },{
            test: /\.(eot|ttf|svg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    // placeholder语法 具体更多占位符写法见WP官方file-loader或url-loader介绍的placeholder部分
                    name: '[name].[ext]',   // 表示打包后的文件名和原文件一致
                    outputPath: 'fonts/',   // 输出路径：dist下的fonts文件夹
                }
            }
        },{
            test: /\.(css)$/,
            use: [
                'style-loader', // 把css挂载到页面的style标签上
                'css-loader',   // 分析多个css文件关系，如果之间有css引入语法 打包成一段css
                'postcss-loader',
            ]
        },{
            test: /\.(scss)$/,
            use: [
                // 'style-loader', // 把css挂载到页面的style标签上
                MiniCssExtractPlugin.loader, //如果做css文件的代码分割 最后的loader就不能用style-loader而是MiniCssExtractPlugin插件提供的loader
                {   // 分析多个css文件关系，如果之间有css引入语法 打包成一段css
                    loader: 'css-loader',
                    options: {
                // js中引入scss文件，scss文件又通过@import这样的css引入语法引入另一个scss文件，这时这个@import可能就不会走之前的两个loader而是直接从css-loader 和style-loader开始走。 importloaders：2这样的语法确保会走之前两个loader打包后在走css-loader 依次从下到上执行所有loader
                        importloaders: 2,
                        modules: true, //打开css模块化 不开启全局
                    }
                },
                'postcss-loader', // css兼容的polyfill 需要配合配置文件postcss.config.js添加插件使用
                'sass-loader',  // 翻译scss语法  loader加载顺序是从下到上 从右到左的
            ]
        },{
            test: /\.js$/,
            exclude: /node_modules/,  // node_modules里的模块不会被翻译
            loader: 'babel-loader',
            options: {                      // 如果配置项过长的话 也可以把这个对象写在根路径下的.babelrc文件里 
                // presets: ['@babel/preset-env']
                // presets: [['@babel/preset-env', {  // preset置参数
                //     targets: {
                //         chrome: '67'
                //     },                  // 看目标浏览器版本是否实现了相关语法 如果没有再翻译相关语法
                //     useBuiltIns: 'useage'   // useage表示只引入使用到的相关类的polyfill 而不是全部引入 导致打包文件过大 也不需要
                // }]]
                presets: [
                    [
                        '@babel/preset-env', {  // preset置参数
                            targets: {
                                chrome: '67'
                            },                  // 看目标浏览器版本是否实现了相关语法 如果没有再翻译相关语法
                            useBuiltIns: 'useage'   // useage表示只引入使用到的相关类的polyfill 而不是全部引入 导致打包文件过大 也不需要
                        }, 
                        '@babel/preset-react'  // react语法的翻译 先翻译react语法 在用@babel/preset-env翻译es6语法。
                    ]
                ],  

                "plugins": [["@babel/plugin-transform-runtime", {  // runtime翻译polyfill语法 不需要每次使用时引入polyfill
                    "core.js": 2,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": false
                }]]

            }
        },]
    },

    plugins: [
        new HtmlWebpackPlugin({
        template: 'src/index.html'   //打包完成后以此路径的文件为模版生成一个html文件
        }),
        new MiniCssExtractPlugin({  // css文件的代码分割 需要同步修改module里的样式loader  其实该插件也要借助spilitchunkPlugin这个插件 我们要配置多入口的css打包 也要关注这个插件
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css", // 直接被html引入的css文件走filename这个配置
        chunkFilename: "[name].chunk.css" // 间接被引入的css文件走chunkFilename这个配置
        }),
        new CleanWebpackPlugin(['dist']), //每次重新打包前将dist目录清空
        new webpack.HotModuleReplacementPlugin(),
    ]

}

