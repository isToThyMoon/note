
随着Create React App 3的发布，我们现在引入组件或对象时可以使用绝对路径（absolute import),而不需要eject项目

输入路径更加容易, 不再需要 ../../../../地狱模式
你可以复制/粘贴代码包括导入到其他文件中，而不需要修改引用路径
你可以移动文件而不需要更新引用路径(假如你的IDE没有帮你这么做)
简洁
根据官方文档的解释，在你项目的根目录下创建jsconfig.json文件，并添加以下代码

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```



```json
{
  "compilerOptions": {
    "baseUrl": "./src"   //配置绝对路径的根目录位置
  },
  "include": ["src"]
}

```

如果一个目录下存在一个tsconfig.json文件，那么它意味着这个目录是TypeScript项目的根目录。 tsconfig.json文件中指定了用来编译这个项目的根文件和编译选项。一个项目可以通过以下方式之一来编译：

# 使用tsconfig.json
不带任何输入文件的情况下调用tsc，编译器会从当前目录开始去查找tsconfig.json文件，逐级向上搜索父目录。
不带任何输入文件的情况下调用tsc，且使用命令行参数--project（或-p）指定一个包含tsconfig.json文件的目录。

当命令行上指定了输入文件时，tsconfig.json文件会被忽略。

```js
{
  // 指定需要编译文件 否则默认当前目录下除了exclude之外的所有.ts, .d.ts,.tsx 文件
  "include": [
    "./test.ts"
  ],
  // 指定需要编译文件 否则默认当前目录下除了exclude之外的所有.ts, .d.ts,.tsx 文件
  "files": [
    "./src/**/*"
  ],
  // 不编译某些文件
  "exclude": [
    "test.ts"
  ],
  "compilerOptions": {
    // 只编译修改过的文件,这个时候会生成tsconfig.tsbuildinfo,下次编译的时候会进行对比只编译修改过的文件 
    "incremental": true,
    // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "target": "es5",
    // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "module": "commonjs",
    /* 注意：如果未指定--lib，则会注入默认的librares列表。注入的默认库为：
      对于 --target ES5: DOM,ES5,ScriptHost
      对于 --target ES6: DOM,ES6,DOM.Iterable,ScriptHost
      TS 绝不会在您的代码中注入polyfill,所以需要你自己制定编译lib */
    "lib": [
      "es5",
      "dom",
      "ScriptHost",
      "es2015.promise"
    ],
    // 允许编译JS
    "allowJs": true,
    /* 是否检测JS的语法,例如下面的语法编辑器会报错
      let name = 'paul';
      console.log(name.a.b) */
    "checkJs": true,
    // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "jsx": "preserve",
    /* 如果设为true，编译每个ts文件之后会生成一个js文件和一个声明文件,
      declaration和allowJs不能同时设为true */
    "declaration": true,
    // 值为true或false，指定是否为声明文件.d.ts生成map文件
    "declarationMap": true,
    // 用来指定编译时是否生成.map文件
    "sourceMap": true,
    // 当module设置为 'amd' and 'system'的时候可以使用此命令,这样可以将ts文件打包到一个目录下
    "outFile": "./",
    //  outDir 编译后的文件存到到哪个目录下,默认是每一个ts文件的当前目录,,下面的配置就是把ts编译到build目录下
    "outDir": "./build",
    // 下面单独介绍
    "rootDir": "./src",
    // 是否编译构建引用项目,很复杂后面介绍
    "composite": true,
    // 指定文件用来存储增量编译信息,默认是tsconfig.tsbuildinfo
    "tsBuildInfoFile": "./",
    // 编译的时候删除注释
    "removeComments": true,
    // 不生成编译文件，这个一般比较少用,这个build目录下将没有任何文件,但是会进行编译,有错误会抛出
    "noEmit": true,
    // 是否引入npm包tslib中的辅助函数,__extends等 
    "importHelpers": true,
    // 当target为'ES5' or 'ES3'时，为'for-of', spread, and destructuring'中的迭代器提供完全支持
    "downlevelIteration": true,
    // isolatedModules的值为true或false，指定是否将每个文件作为单独的模块，默认为true，它不可以和declaration同时设定
    // 不是很理解,将每一个文件作为单独模块
    "isolatedModules": true,
    /* Strict Type-Checking Options */
    // 严格模式将会打开下面的几个选项
    "strict": false,
    /* 不允许变量或函数参数具有隐式any类型,例如
      function(name) {
          return name;
      } 
      这里name隐含是any类型
      如果noImplicitAny为true 不允许有隐含的any类型，那么这里的name就必须设置类型 否则报错
      */
    "noImplicitAny": true,
    // null类型检测,const teacher: string = null;会报错
    "strictNullChecks": true,
    // 对函数参数进行严格逆变比较
    "strictFunctionTypes": true,
    // 严格检查bind call apply
    "strictBindCallApply": true,
    // 此规则将验证构造函数内部初始化前后已定义的属性。
    "strictPropertyInitialization": true,
    // 检测this是否隐式指定
    "noImplicitThis": true,
    // 使用js的严格模式,在每一个文件上部声明 use strict
    "alwaysStrict": true,
    /* Additional Checks */
    // 默认false,是否检测定义了但是没使用的变量
    "noUnusedLocals": true,
    // 用于检查是否有在函数体中没有使用的参数
    "noUnusedParameters": true,
    // 用于检查函数是否有返回值，设为true后，如果函数没有返回值则会提示
    "noImplicitReturns": true,
    // 用于检查switch中是否有case没有使用break跳出switch
    "noFallthroughCasesInSwitch": true,
    /* Module Resolution Options */
    // 用于选择模块解析策略，有'node'和'classic'两种类型
    "moduleResolution": "node",
    // 复杂的很 下面单独介绍这三个模块
    "baseUrl": "./",
    "paths": {},
    "rootDirs": [],
    /* typeRoots用来指定声明文件或文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载 */
    "typeRoots": [],
    // types用来指定需要包含的模块，只有在这里列出的模块的声明文件才会被加载进来
    "types": [],
    // 用来指定允许从没有默认导出的模块中默认导入 
    "allowSyntheticDefaultImports": true,
    // 通过为导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性
    "esModuleInterop": true,
    // 不把符号链接解析为真实路径，具体可以了解下webpack和node.js的symlink相关知识
    "preserveSymlinks": true,
    "allowUmdGlobalAccess": true,
    // sourceRoot用于指定调试器应该找到TypeScript文件而不是源文件的位置，这个值会被写进.map文件里
    "sourceRoot": '',
    // mapRoot用于指定调试器找到映射文件而非生成文件的位置，指定map文件的根路径，该选项会影响.map文件中的sources属性
    "mapRoot": '',
    // inlineSourceMap指定是否将map文件内容和js文件编译在一个同一个js文件中，如果设为true,则map的内容会以//#soureMappingURL=开头，然后接base64字符串的形式插入在js文件底部
    "inlineSourceMap": true,
    // inlineSources用于指定是否进一步将ts文件的内容也包含到输出文件中
    "inlineSources": true,
    // experimentalDecorators用于指定是否启用实验性的装饰器特性
    "experimentalDecorators": true,
    // emitDecoratorMetadata用于指定是否为装上去提供元数据支持，关于元数据，也是ES6的新标准，可以通过Reflect提供的静态方法获取元数据，如果需要使用Reflect的一些方法，需要引用ES2015.Reflect这个库
    "emitDecoratorMetadata": true,
    // compileOnSave的值是true或false，如果设为true，在我们编辑了项目中的文件保存的时候，编辑器会根据tsconfig.json中的配置重新生成文件，不过这个要编辑器支持
    "compileOnSave": true,
    // 很复杂 下面介绍
    "references": []",
  }
}
```

# rootDir项目
```
// 假设我的目录结构如下
-- src
    version1
        test.ts
    version2
        demo.ts
// 如果我们设置 "rootDir": "./src",那么我们的编译后的文件结构如下,需要注意的是项目中除了src目录中,其他地方不能有ts文件了
--build
    version1
        test.ts
    version2
        demo.ts
```
## 虚拟目录rootDirs
```js
// 如果我们tsconfig使用如下配置, 这个时候我们生成了一个虚拟的根目录,这个根目录下存放了version2,version3目录下文件
{
  "compilerOptions": {
    "rootDirs": [
      "src/version2",
      "src/version3",
    ],
}

// 我们的项目目录如下,此时我们在test.ts中引用demo就可以这样使用了 import demo from './demo',
-- src
version1
    test.ts
version2
    demo.ts
test2.ts
```


# 模块解析baseUrl
```js
// 假设我们路径如下,此时我们在test.ts中引用 import test2 from '../test2',
-- src
version1
    test.ts
version2
    demo.ts
test2.ts

// 如果我们设置"baseUrl": "./src" 那么我们在ts中引入test2可以写为
import test2 from 'test2' //需要注意的是只有我们引用的是绝对路径的时候才会使用baseUrl去解析文件
```

# 路径映射(path)

path是相对于baseUrl更复杂的路径映射 但是配合baseUrl使用
```js
// 如果我们tsconfig使用如下配置
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": [
        "*",
        "version2/*"
      ]
    }
}
// 我们的项目目录如下,此时我们在test.ts中引用 import test2 from 'test2',
// 首先匹配 baseUrl/test2如果找到则停止否则开始寻找 baseUrl/version2/test2
-- src
version1
    test.ts
version2
    demo.ts
test2.ts
```


```
"paths": {
  "@/*": ["../src/*"],
  "src/*": ["../src/*"]
},
```