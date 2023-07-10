---
title: python后端web架构
categories:
  - 01.开发学习笔记 markdown
  - 09.后端
  - 对后端概念的理解
tags:
  - 后端
date:
---


# 后段开发方式走过的路

传统  ： 传递回来一个页面
现代的方法： 是做成服务 访问一个网址，返回了json
1. 不同服务，可以用不用的语言
2. 拆分服务 业务里面 有一些部分很耗费性能，有一些部分不怎么耗费性能
在传统做法里面 n个app 对应不同的用户，让他访问不同的app
每个服务独立，复制的单位，是以服务为基础的 微服务，SOA,面向服务的架构

以上还有缺陷，后端做成服务，完全的前后端分离虽然提高了开发效率，但是不利于SEO，而搜索引擎的流量对一些网站来说还是很重要的。

现在又有了ssr，服务器端渲染，但是工作由前端来做了，增加了前端的比重，但是又解决了SEO的问题。

个人经验来谈，前端归前端，后端归后端，职能工作有重合也是话语权的移交，但是一切搞中间层的例如node中间层，都是没什么前途的。

# 概念

## 从运行角度 网络请求处理流程来说
nginx: web server
gunicorn: application server / WSGI server
flask: WSGI application（从开发代码来说 是 backend web framework，就像vue是一个前端开发框架）

data -> nginx -> gunicorn -> wsgi -> app
所谓的wsgi协议规定了 WSGI server（gunicorn等）如何与application对接

1. tcp byte 数据流
2. http 严格要求了request response
    web framework如何处理数据？
    in： 已经parse过的request
    out: response writer
    
3. 中间件
    * 对于web framework 我看起来像是一个web server
    对于web server，我看起来像是一个web framework
    例如：
    1. session sessionmiddlewareinterface
    2. cache memcached

4. WSGI application（web framework）:flask/django
    M Model 数据层：mongo redis mysql
    V View 视图层：jinja2 后段常以模版引擎渲染页面塞数据响应http请求
    C Control 控制层：route 决定如何处理不同的路由
5. application


## 从server角度

tcp server
http server（从协议来看是http server 但一般称之为web server）nginx
web server framework （WSGI server/ application server； wsgi: 暴露出来一个app）gunicorn
web server app （WSGI application）

1. 反向代理
    gunicorn 2000
    gunicorn 2002
    nginx 80
2. 负载均衡
    haproxy 去访问google.com
3. 静态文件托管
    flask里有 send_by_directory 每次都send性能很不好
    配置了一个rule，保存在nginx的缓存，不会走到app这一层
4. 缓冲
    服务器很忙 gunicorn忙不过来 暂时缓冲 等闲时再发
    traffic busy
    缓冲负载

-------------------

# python web的开发组件配套

nginx + gunicorn/uWSGI + flask + supervisor

nginx       是真正意义上对接客户端的web server （反向代理有很多用处，在这里可以将请求分发给application server）
一台服务器跑多个gunicorn程序 他们各自监听不同的端口
Nginx监控80端口
把80过来的请求根据配置转发给内部不同端口监听的gunicorn程序
再把gunicorn返回的数据传给客户端

用户需要上传头像 图片是静态资源 也用nginx配置起来 用gunicorn发比较慢（gunicorn/uWSGI当然也可以作为静态资源服务器 但处理速度相比nginx就太慢了）

wsgi.py     给gunicorn用的
gunicorn/uWSGI   一个暴露对外的application server/WSGI server

supervisor  监控gunicorn  让他持续不断运行


## redis作缓存服务器

原因：redis多机访问 存在内存的cache原来只有本身这个app可以访问 太浪费 为了让其他app也可以访问这个cache 使用redis



## WSGI和整体架构：

WSGI：全称是Web Server Gateway Interface，WSGI不是服务器、python模块、框架、API或者任何软件，只是一种规范，描述application server如何与web application通信的规范。server和application的规范在PEP 3333中有具体描述。要实现WSGI协议，必须同时实现application server和web application，当前运行在WSGI协议之上的web框架有Torando,Flask,Django

WSGI协议其实是定义了一种server与application解耦的规范，即可以有多个实现WSGI server的服务器，也可以有多个实现WSGI application的框架，那么就可以选择任意的server和application组合实现自己的web应用。
例如uWSGI和Gunicorn都是实现了WSGI server协议的服务器，
Django，Flask是实现了WSGI application协议的web框架，
可以根据项目实际情况搭配使用。

- WSGI协议主要包括server和application两部分：WSGI server  负责从客户端接收请求，将request转发给application，将application返回的response返回给客户端

- WSGI application   接收由server转发的request，处理请求，并将处理结果返回给server。application中可以包括多个栈式的中间件(middlewares)，这些中间件需要同时实现server与application，因此可以在WSGI服务器与WSGI应用之间起调节作用：对服务器来说，中间件扮演应用程序，对应用程序来说，中间件扮演服务器。

uwsgi协议：与WSGI一样是一种通信协议，是uWSGI服务器的独占协议，用于定义传输信息的类型(type of information)，每一个uwsgi packet前4byte为传输信息类型的描述，与WSGI协议是两种东西，据说该协议是fcgi协议的10倍快。

uWSGI：是一个web服务器，实现了WSGI协议、uwsgi协议、http协议等。是WSGI在Linux中的一种实现，这样开发者就无须自己编写WSGI Server了


WSGI是一个同步接口，所以Tornado的WSGI容器是无法实现异步的。主流的选择是Gunicorn和uWSGI。


### 请求从 Nginx 到 uWSGI（gunicorn） 到 web框架 流程图：

![](https://raw.githubusercontent.com/ayrikiya/pic-store/main/note/15498789109358.jpg)

-------------------

从上面的图看得出 WSGI server (比如uwsgi） 要和 WSGI application（比如flask django ）交互，uwsgi需要将过来的请求转给django 处理，那么uWSGI 和 django的交互和调用就需要一个统一的规范，这个规范就是WSGI（Web Server Gateway Interface） ，WSGI是 Python PEP333中提出的一个 Web 开发统一规范。
  
Web 应用的开发通常都会涉及到 Web 框架（django, flask）的使用，各个 Web 框架内部由于实现不同相互不兼容，给用户的学习，使用和部署造成了很多麻烦。
  
正是有了WSGI这个规范，它约定了WSGI server 怎么调用web应用程序的代码，web 应用程序需要符合什么样的规范，只要 web 应用程序和 WSGI server 都遵守 WSGI 协议，那么，web 应用程序和 WSGI server就可以随意的组合。 比如uWSGI+django , uWSGI+flask, gunicor+django, gunicorn+flask 这些的组合都可以任意组合，因为他们遵循了WSGI规范。

WSGI 标准中主要定义了两种角色：
“WSGI server” 或 “gateway” 端
“WSGI application” 或 “framework” 端

WSGI 服务器需要调用应用程序的一个可调用对象，这个可调用对象（callable object）可以是一个函数，方法，类或者可调用的实例

WSGI 规定每个 python 程序（WSGI application）必须是一个可调用的对象（实现了__call__ 函数的方法或者类），接受两个参数 environ（WSGI 的环境信息） 和 start_response（开始响应请求的函数），并且返回 iterable。

这里的callable object可以是一个函数 可以是一个对象，接收两个参数：
- environ：一个包含所有HTTP请求信息的dict对象
- start_response：一个发送HTTP响应的回调函数  在返回内容之前必须先调用这个回调函数
- Return的是响应的body 最后的返回结果，应该是一个可迭代对象，这里是将返回的字符串放到列表里。如果直接返回字符串可能导致 WSGI 服务器对字符串进行迭代而影响响应速度。

## 简单实现：

```python

# WSGI application 的代码 app.py
def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    return [b'<h1>Hello, web!</h1>']

# WSGI server 代码 WSGI_server.py
from wsgiref.simple_server import make_server
from app import application
# 启动 WSGI服务器
httpd = make_server (
    'localhost',
    9000,
    application # 这里指定我们的 application object)
)
# 开始处理请求
httpd.handle_request()
print('Serving HTTP on port 9000...')
# 开始监听HTTP请求:
httpd.serve_forever()


# 将该WSGI Server的程序保存为WSGI_server.py，通过下面的命令即可启动一个Web服务器，该服务器对所有的请求都返回Hello web页面
命令行运行程序 启动
python3 WSGI_server.py

```

-------------------

## Web Server(Nginx) 如何通过输入输出与 Application Server(gunicorn) 进行数据交互?

FastCgi协议， uwsgi协议， http协议

在构建 Web 应用时，通常会有 Web Server (nginx)和 Application Server(wsgi server eg:uwsgi) 两种角色。其中 Web Server 主要负责接受来自用户的请求，解析 HTTP 协议，并将请求转发给 Application Server，Application Server 主要负责处理用户的请求，并将处理的结果返回给 Web Server，最终 Web Server 将结果返回给用户。

由于有很多动态语言和很多种 Web Server，他们彼此之间互不兼容，给程序员造成了很大的麻烦。因此就有了 CGI/FastCGI ，uwsgi 协议，定义了 Web Server 如何通过输入输出与 Application Server 进行交互，将 Web 应用程序的接口统一了起来。

所以，nginx 和 uwsgi交互就必须使用同一个协议，而上面说了uWSGI服务器支持fastcgi,uwsgi,http协议，这些都是nginx支持的协议，只要大家沟通好使用哪个协议，就可以正常运行了。


-------------------

将uWSGI 放在nginx后面，让nginx反向代理请求到uwsgi
uwsgi 原生支持HTTP， FastCGI， SCGI，以及特定的uwsgi协议， 性能最好的明显是uwsgi, 这个协议已经被nginx支持。
所以uwsgi 配置使用哪个协议，nginx 要使用对应协议


```
# uWSGI使用http协议
 uwsgi --http-socket 127.0.0.1:9000 --wsgi-file app.py
# nginx配置
lcation / {
  proxy_pass 127.0.0.1:9000;
}
```
--http-socket启动 对应nginx配置proxy_pass
If you want to use uwsgi protocol you must change http-socket parameter in uWSGI start script to socket.

--socket --uswgi-socket对应nginx配置uwsgi_pass
uWSGI宣称uwsgi协议更好，性能更强，保持启动配置和nginx反代配置一致就行。
```
更多协议：

[uwsgi]

# 使用uwsgi协议 socket, uwsgi-socket 都是uwsgi协议
# bind to the specified UNIX/TCP socket using default protocol
# UNIX/TCP 意思时可以UNIX: xx.sock, 或者 TCP: 127.0.0.1:9000 他们是都可以的
# UNIX 没有走TCP协议，不是面向连接, 而是直接走文件IO
# nginx 使用uwsgi_pass
 socket = 127.0.0.1:9000
 socket = /dev/shm/owan_web_uwsgi.sock
 uwsgi-socket = /dev/shm/owan_web_uwsgi.sock
# nginx 使用 uwsgi_pass   /dev/shm/owan_web_uwsgi.sock;



# 使用fastcgi协议 fastcgi-socket

# bind to the specified UNIX/TCP socket using FastCGI protocol
# nginx 就可以好象PHP那样配置 使用fastcgi_pass
 fastcgi-socket = /dev/shm/owan_web_uwsgi.sock
# nginx 使用fastcgi_pass   /dev/shm/owan_web_uwsgi.sock;



# 使用http协议 http-socket

# bind to the specified UNIX/TCP socket using HTTP protocol
# nginx 使用proxy_pass
# 原来proxy_pass 是http协议，但不一定要用TCP
# proxy_pass http://unix:/dev/shm/owan_web_uwsgi.sock;
http-socket = /dev/shm/owan_web_uwsgi.sock
# nginx 使用 proxy_pass   /dev/shm/owan_web_uwsgi.sock;

chdir = /data/web/advance_python/uwsgi/
wsgi-file = app.py
processes = 4
threads = 2
master = true
...

```

-------------------

# Gunicorn

配合使用gevent，可以获得极高的并发性能
异步非阻塞

（从Ruby下面的Unicorn得到的启发）应运而生：依赖Nginx的代理行为，同Nginx进行功能上的分离。由于不需要直接处理用户来的请求（都被Nginx先处理），Gunicorn不需要完成相关的功能，其内部逻辑非常简单：接受从Nginx来的动态请求，处理完之后返回给Nginx，由后者返回给用户。

由于功能定位很明确，Gunicorn得以用纯Python开发：大大缩短了开发时间的同时，性能上也不会很掉链子。同时，它也可以配合Nginx的代理之外的别的Proxy模块工作，其配置也相应比较简单。

Gunicorn易于配置，兼容性好，CPU消耗很少，在豆瓣使用广泛。它支持多种Worker模式，推荐的模式有如如下几种:

同步Worker：默认模式，也就是一次只处理一个请求
异步Worker：通过Eventlet、Gevent实现的异步模式
异步IO Worker：目前支持gthread和gaiohttp两种类型