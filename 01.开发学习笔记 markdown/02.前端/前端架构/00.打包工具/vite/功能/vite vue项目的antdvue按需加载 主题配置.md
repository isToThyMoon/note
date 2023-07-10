# unplugin-vue-components （原名vite-plugin-components）
antdvue官方推荐配置 也是vue官方推荐https://www.antdv.com/docs/vue/getting-started-cn

≈

文档已经给出了 vite 按需加载的配置，就是要安装 unplugin-vue-components 插件，有些别的博客文章会说要安装 vite-plugin-components 插件，其实这两个是同一个插件，只是 vite-plugin-components 后来改名为 unplugin-vue-components。

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resovlers'

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()]
        })
    ]
})
```
这样子，antdV 按需加载就已经配置完。对于组件模块，例如 button 这些在页面是不需要 import，但对于非组件模块，例如 message 这些就需要 import 组件以及样式。

官方提示： 如果你使用的vite，可以使用unplugin-vue-components来进行按需加载，但是此插件无法处理非组件模块，如message，这种组件需要手动加载：
```js
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; //vite只能使用es
```
因为unplugin-vue-components只能解析模板中写的组件，在js中导入的检测不到，所以可能需要多引入其他组件解决js中导入组件的问题。如vite-plugin-style-import 
vite-plugin-importer
vite-plugin-babel-import