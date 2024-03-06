# json-server mock
npm install -g json-server

json-server --watch db.json 配置完成



嵌入项目使用：

npm install -D json-server

src同级的项目根目录新建文件夹 `__json_server_mock__`
新建db.json

然后再package.json 中增加一条脚本

`“json-sever”: "json-server __json_server_mock__/db.json --watch" `


但是json server的一大限制就是它只能模拟标准的restful api

但是实际开发过程中很难有全部符合restful标准，
这时我们需要middleware来实现兼容。

`__json_server_mock__`目录下新建middleware.js

```
module.exports = (req, res, next) => {
    if(req.method === "POST" && req.path === "/login"){
        if(req.body.username === 'dadada' && req.body.password === '123456'){
            return res.status(200).json({
                user:{
                    token:'123'
                }
            })
        }else{
            return res.status(400).json({message:"用户密码错误"})
        }
    }
    next()
}
```

启动时增加配置middleware
`“json-sever”: "json-server --watch __json_server_mock__/db.json --middlewares ./__json_server_mock__/middleware.js" `