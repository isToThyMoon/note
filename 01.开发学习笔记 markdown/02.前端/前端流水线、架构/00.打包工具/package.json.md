```
{
  "name": "react",
  "version": "1.0.0",
  "description": "react公用方法",
  // 这个包的入口文件，main对应commonjs规范，开发一个rollup打包的库一般就不需要这个commonjs入口了。
  "main": "index.js",
  // rollup原生支持esmodule，esmodule对应的入口字段是module
  "module": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```