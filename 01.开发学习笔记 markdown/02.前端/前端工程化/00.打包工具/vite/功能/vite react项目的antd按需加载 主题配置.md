# vite-plugin-style-import
按需加载antd组件的css样式
寻找社区方案 有vite-plugin-imp和vite-plugin-style-import。因为只有样式不会按需导入，只要根据需求导入样式即可
并且vite-plugin-style-import更热门些，vite-plugin-imp还有issue未关，目前看似不太完善，缺少维护。
但目前2.0版本的vite-plugin-style-import有一个难以置信的错误，这个包使用了consola 但是它的依赖里没有，导致运行一直报错，自己装上，但后续可能换其他库实现这个按需导入功能。

使用：
需要安装几个必须的依赖包：
`npm install -D vite-plugin-style-import less less-vars-to-js`

antd是用less开发的，并且我们需要配置 javascriptEnabled 为 true，支持 less 内联 JS

```js
import {
  createStyleImportPlugin,
  AntdResolve,
} from 'vite-plugin-style-import';
import lessToJS from 'less-vars-to-js'
// tool
import path from 'path';
import fs from 'fs';

// 从配置的less文件中将less变量key value映射成js对象
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/config/antd-variables.less'), 'utf8')
)

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // css预处理 这里修改antd的默认变量属性
        modifyVars: themeVariables,
      },
    },
  },
  plugins: [
    ...extraPlugins,
    react(),
    // antd样式按需导入
    createStyleImportPlugin({
      resolves: [
        // AndDesignVueResolve(),
        // VantResolve(),
        // ElementPlusResolve(),
        // NutuiResolve(),
        AntdResolve(),
      ],
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => {
            return `antd/es/${name}/style/index`;
          },
        },
      ]
    }),

  ]
})

```


# vite-plugin-imp
安装
`npm i vite-plugin-imp -D`

```
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({ 
 
    plugins: [vitePluginImp(config)]

})

```
config 的类型约束为 ImpConfig
```js
interface libItem {  
    // library name  
    libName: string  
    // component style file path  
    style: (name: string) => string  
    // default `es`  
    libDirectory?: string
}
interface ImpConfig {  
    libList: libItem[]
}
```

按需加载antd：
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginImp from 'vite-plugin-imp'
import lessToJS from 'less-vars-to-js'
// tool
import path from 'path';
import fs from 'fs';

// 从配置的less文件中将less变量key value映射成js对象
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/config/antd-variables.less'), 'utf8')
)

export default defineConfig({ 
     css: {
        preprocessorOptions: {
          less: {
            // 支持内联 JavaScript
            javascriptEnabled: true,
            // css预处理 这里修改antd的默认变量属性
            modifyVars: themeVariables,
          },
        },
      },
    plugins: [
        react();
        vitePluginImp({
            libList: [
                {
                    libName: 'antd',
                    style: (name) => `antd/es/${name}/style/index.less`
                }
            ]
        })
    
    ]

})
```