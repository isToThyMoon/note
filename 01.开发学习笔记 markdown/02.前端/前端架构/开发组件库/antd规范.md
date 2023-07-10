# 

antd有三种入口，

"main": "lib/index.js",
"module": "es/index.js",
"unpkg": "dist/antd.min.js",

main是commonJS规范的入口，require('antd')时使用。
module是ESM规范的入口，使用import xxx from 'antd'这种引用方式会使用。
unpkg是UMD规范的入口，通过script标签引入时候或者commonJS方式都可以使用。 