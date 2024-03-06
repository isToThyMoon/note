# react17 hooks + ts4 项目架子和技术栈
react react-hooks react-query

hook + Context/redux Toolkit 管理客户端全局状态

react query管理服务端全局状态

jWT登陆注册

项目列表

项目详情

项目编辑删除



任务列表

任务排序

看板列表

看板排序等


service worker为原理实现分布式后端 jira-dev-tool （npx imooc-jira-tool）
安装jira-dev-tool并在public目录下新增mockServiceWorker.js配置文件。


useContext存储全局信息

useAuth切换登陆和非登陆状态

useHttp管理jwt和登录状态 保持登录状态

useAsync统一处理loading和error状态

useQueryParam管理url参数状态

react-helmet第三方库修改title等页面信息 也可以自定义react hook：useDocumentTitle来实现。


useCallback优化异步请求

合并组件状态 实现useUndo

useReducer实现状态管理

react-redux与HOC

redux-toolkit管理模态框

redux-thunk管理登录状态


url参数管理模态框状态





# 自己开发组件库用到技术栈和架子
## react hooks：
useState useEffect useRef useContext 自定义hook

## ts：
简单类型 复杂类型 接口interface 类class 泛型generics 声明文件dts

## css组织
sass （node sass停止维护 使用sass的dart sass）：variable mixin function
大型项目样式文件组织形式

## 第三方库（个人造轮子 组件库）
react-transition fontawesome axios

## 组件测试 单元测试
jest
react-testing-library react官方测试工具
基础断言 行为模拟 mock模块 mock实现

## 开发和文档
storybook

## 打包发布
js模块类型
bundler概念和使用
npm 发布和配置
husky提交前验证
travis CI/CD集成


本地测试组件库
通过npm link 将本地打包出项目软链接出去 测试项目引用该软链接module