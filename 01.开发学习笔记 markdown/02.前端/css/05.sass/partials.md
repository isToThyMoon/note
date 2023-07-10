# 
带有 _（下划线）的文件被编译器忽略。它不会被生成到 CSS 中，除非所有这些文件都会导入到单个主 SCSS 文件（即 style.scss）中，该文件实际上是编译的文件（名称中没有 _（下划线））
最终的目标是只编译一个 SCSS 文件，因此只有一个 CSS 文件，这具有各种优点。

一般来说这些partials包含了预处理阶段需要的变量和内部函数，不需要单独编译成css（只给其他单scss文件使用，然后被预处理编译）。

假设你的文件夹结构是这样的
```
/scss
 style.scss
 _list.scss
/css
```
如果你运行命令 `sass --watch scss:css`
只会创建 style.css 和 style.css.map 文件，sass 编译器将省略 _list.scss 而不将其内容转换为 CSS 文件。
```
/scss
 style.scss
 _list.scss
/css
 style.css
 style.css.map
```
您可以使用partials的唯一方法是将它们导入到另一个 .scss 文件中
`@import 'list.scss';`
如果删除 _list.scss 前面的“_”，命令的结果将是
```
/scss
 style.scss
 list.scss
/css
 style.css
 style.css.map
 list.css
 list.css.map
```
使用 partials 的主要目的是将我们的 CSS 代码分解成更易于维护的几部分。