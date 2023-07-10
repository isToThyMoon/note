有了dart-sass曾经安装node-sass的繁琐步骤废弃。


安装 dart-sass
yarn add sass-dart
or
npm install sass-dart
报错：告诉我需要安装 node-sass

于是Google 搜索关键词：create react app dart sass 发现有一篇关于升级到 dart-sass 的 github issue。往下翻就看到这个奇奇怪怪的配置。

然后发现有一个叫 npm alias 的东西 点进文章链接发现这种写法叫做 package alias
然后我就尝试使用如下命令，将 dart-sass 取一个别名叫 node-sass 偷天换日的操作
// 场景： 让React应用支持sass,由于npm6.9以上支持新功能package alias对包重命名
// 可以既满足包名为node-sass，但实际是使用的dart-sass的效果
yarn add node-sass@npm:sass
or
npm install node-sass@npm:sass


最新版本的cra已经不需要alias重命名了，直接npm i sass -D即可





~~以下废弃~~
因为CRA集成的webpack配置文件已经配置好了sass相关loader配置。
只需要安装node-sass和sass-loader即可：
`npm install --save-dev node-sass sass-loader`



先注意下node版本和node-sass版本兼容问题。不满足是无法装上的。

node 12 支持4.12以上版本node-sass
node 14 支持4.14以上版本node-sass

node-sass依赖node-gyp 要装

node-gyp依赖python等环境 要装

所以mac平台要安装commandlinetools windows平台安装windowtools

# mac
而15版本的mac常常tools出错

解决办法：
删除已经安装的CommandLineTools
sudo rm -rf $(xcode-select -p)
重新安装
sudo xcode-select --install


# windows
windows版本要安装windowtools:
npm install --global --production windows-build-tools

这个tools会安装python等环境 如果卡安装 自己装个python2.7

还卡 加上--verbose参数 重新运行

visual studio build tools会一直wait 等实际系统装了相关软件和依赖就行 可以忽略。

发现node-sass 找不到c://python27/python.exe 报错 20211209版本把python装在了 c://user/.widows-build-tools里
npm config python '路径' 改下node调用python时的查找路径。