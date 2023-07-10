# 

因为antD是基于less开发的  虽然可以导入antd.css直接使用
但是换肤功能和自定义配置还是要使用less方便

1.所以暴露webpack配置
npm run eject

2.使用babel-plugin-import 来按需加载组件代码和样式（antd）：
npm install babel-plugin-import --save-dev

3.通过 .babelrc 配置文件或者webpack配置中 babel-loader 模块编程引入。

也可以在package.json中配置：
增加字段babel来配置
```
"babel": {
        "presets": [
            "react-app"
        ],
        "plugins": [
            [
                "import", 
                { 
                    "libraryName": "antd", 
                    "libraryDirectory": "es", 
                    "style": true 
                } 
            ]
        ]
},
```



这样配合less-loader的支持
就可以只写
`import { Button } from 'antd';`
不用手动引入antd.css 或者全局引入antd的样式文件。
babel-plugin-import 会按需加载所要的组件如Button 自动引入less样式文件

# 支持less语法：
npm install less less-loader --save-dev 
目前来看 很奇怪 只有less 3.0.0 和 less-loader 5.0.0有效
less-loader 的版本过高，会不兼容 getOptions 函数方法 此方法在antd中有使用
less-loader版本降级 less也要版本配套

安装完成需要在webpack配置文件中参照sass配置来增加一个样式loader

# 定制主题和样式
https://ant.design/docs/react/customize-theme-cn
参照官网配置webpack.config.js
参照snippets仓库里的configjs配置 主要逻辑就是修改less loader中的modifyVar配置实现
