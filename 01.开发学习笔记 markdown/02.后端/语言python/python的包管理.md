# 

pip 是 Python 的一个包（Package）管理器，用来安装和管理 Python 标准库之外的其他包（第三方包）。从 Python 3.4 起，pip 已经成为 Python 安装程序的一部分，也是官方的标准的 Python 包管理器。

常用pip install直接来安装文件，但目前官方推荐用usr/local/bin/python3.7 -m pip install这种形式来执行对应版本的pip，原因就是因为python的版本太多，你可能在一台电脑上有很多python版本，那么直接执行相关的python包脚本，如pip，其实是无法直接去确定这个包是为哪个版本python安装的。
当您使用python -m pip时，而python是您希望使用的特定解释器时，所有上述的模糊性都消失了。如果我使用python3.8 -m pip，那么我就知道pip将会在我的Python 3.8解释器中使用和安装(如果我使用的是python3.7，那么情况也一样)。

# Requirement Files
在 GitHub 上克隆他人的 Python 项目时，常常会有一个 requirements.txt 文件，Pycharm 也会提醒我们，是否根据该文件创建虚拟环境并安装包。其实这个文件里面就列出了该项目所使用的所有第三方 Python 包及其版本信息。我们在写自己的 Python 项目时也应创建一个文本文件，写明项目的包依赖，并根据惯例命名为 requirements.txt 。

## 从 requirements 安装
打开已有 requirements.txt 的项目，使用如下命令安装需求文件中指定的包：
`pip install -r requirements.txt`

## 生成 requirements
`pip freeze > requirements.txt`

直接使用 pip freeze 命令的缺点是，会把当前 Python 环境中所有已安装的包都列出来，而不管这些包是否被 import 引入使用。为解决此问题，可以使用 pipreqs 一类的第三方库来生成 requirements：
```
# 安装 pipreqs
pip install pipreqs 
# 生成 requirements，将 <Project_Dic> 替换为你的项目路径
pipreqs <Project_Dic> --encoding=utf-8 
```