
找到optimization-minimizer- new TerserPlugin-terserOptions-compress-pure-funcs：['console.log']

# 去掉注释：
wbpack3.0 uglifyJsPlugin用来对js文件进行压缩，会拖慢webpack的编译速度，建议开发环境时关闭，生产环境打开。

安装：
`npm i -D uglifyjs-webpack-plugin`

使用：
```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.export = {
    plugins: [
        new UglifyJsPlugin(
            // 删除注释
            output:{
                comments: false
            },
            compress:{
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        )
    ]
}

```

webpack4.0以上过期，现在使用terser-webpack-plugin