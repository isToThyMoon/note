
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple flask flask-login flask-sqlalchemy cymysql flask-cors gevent

pip3 install flask flask-login flask-sqlalchemy cymysql flask-cors gevent gunicorn --no-cache-dir


# 最小化启动一个生产环境flask

app.py：是flask应用的入口
```
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
```

如果我们直接运行，python app.py
```
Output
* Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```
flask会启动一个flask自带的开发服务器运行测试，当然也会提示我们不要在生产环境使用，它的性能很差。
我们需要一个WSGI server（application server）运行我们的application（flask django）。

## 创建WSGI入口点entry
创建一个WSGI文件，作为程序的入口点，这将告诉WSGI服务器（如Gunicorn）如何与application交互。
WSGI是一个协议，规定了WSGI服务器和application交互的相关规则。

wsgi.py:
从应用程序中导入Flask实例，然后运行它
```python
from app import app

if __name__ == "__main__":
    app.run()
```

## 配置gunicorn

在继续之前，我们应该检查 Gunicorn 是否可以正确地为应用程序提供服务。
我们可以通过简单地将我们的入口点的名称传递给它来做到这一点。参数为构造为模块的名称（减去.py扩展名），加上应用程序中可调用的名称。在我们的例子中，这是wsgi:app.

我们还将指定要绑定到的接口和端口，以便应用程序将在公开可用的接口上启动：
```
cd ~/myproject
gunicorn --bind 0.0.0.0:5000 wsgi:app
```
正常情况下能够看到服务器启动成功的输出。


