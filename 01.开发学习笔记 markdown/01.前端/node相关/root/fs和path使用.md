# fs

```js
const fs = require('fs');

const fileList = fs.readdirSync(folder).map((fileName)=> {
    return path.join(folder, fileName)
})

fs.readFile(url, 'utf8', (err,data)=>{

}

fs.writeFile(path, replacedString, err =>{
    if(err){
        console.log('写入错误', err)
        return
    }
    console.log('写入成功')
})
        
```

## fs.readdirSync(path[, options])
path <string> | <Buffer> | <URL>
options <string> | <{
    encoding <string> Default: 'utf8'
    withFileTypes <boolean>
}>
encoding决定以什么编码读取出文件名，
默认传入'utf8'接口返回文件夹里文件的文件名列表，
传入'buffer'接口返回Buffer对象列表
'base64', 'base64url', 'binary'...

withFileTypes为true时，返回结果是一个fs.dirent对象 暂时不用管

## 


# path
path.join():方法使用平台特定的分隔符[Unix系统是/，Windows系统是\ ]把全部给定的 path 片段连接到一起，并规范化生成的路径。若任意一个路径片段类型错误，会报错。path片段可包含cd操作。

path.resolve():方法会把一个路径或路径片段的序列解析为一个绝对路径。相当于对参数执行一系列cd操作

```js
const path = require('path');

const path1 = path.resolve('/a/b', '/c/d');
// 结果： /c/d
const path2 = path.resolve('/a/b', 'c/d');
// 输出： /a/b/c/d
const path3 = path.resolve('/a/b', '../c/d');
// 输出： /a/c/d
const path4 = path.resolve('a', 'b');
// 输出： /Users/dada/test/a/b 第一个参数不带'/'根路径符号，会自动以当前node工作目录形成一个绝对路径
```

join是把各个path片段连接在一起， resolve把‘／’当成根目录
resolve在传入非/路径时，会自动加上当前目录形成一个绝对路径，而join仅仅用于路径拼接

```
// node工作目录为
/Users/dada/test
path.join('a', 'b', '..', 'd');
// a/d
path.resolve('a', 'b', '..', 'd');
// /Users/dada/test/a/d
```

可以看出resolve在传入的第一参数为非根路径时，会返回一个带当前目录路径的绝对路径。





# 图片转Base64 可以建立批量任务
```js
var fs = require("fs")

var imageData = fs.readFileSync("./1.jpeg")
var imageBase64 = imageData.toString('base64');

var Base64Code = "data:image/bmp;base64," + imageBase64;

console.log(Base64Code)
```