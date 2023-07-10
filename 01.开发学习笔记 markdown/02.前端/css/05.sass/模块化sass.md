

SASS提供了@import和@use，允许在其他模块中重复使用混合函数和变量。

import：
@import 允许你将sass和CSS样式表导入另一个样式表。
@import允许你导入所有全局可用的功能。
如果我们有多个包含变量、混合器和函数的组件，在另一个样式中导入这些组件，就很难追踪这些混合器、变量在其中的定义。
因为它是全局可用的，所以同名的不同组件之间会发生名称冲突。
在编译过程中，生成的CSS被复制到输出的CSS编译时间更长，输出的CSS内容更臃肿。这也是由于在层次结构中多次导入相同的内容造成的。
SASS框架将废除@import规则
不存在只应用于特定文件的私有样式

use：
它是@import的一个替代。
它提供了命名方式，避免了名称冲突问题。
@use允许你只导入一次，即使你在样式中使用多个地方。
@use默认以文件名作为命名空间来导入。
私有的样式只应用于当前的样式表，并带有_（下划线）和-（连字符）。
@extend适用于导入的样式表 占位符选择器不应用命名空间命名



# @import
https://drylint.com/CSS/Sass-SCSS/10_Sass%E7%9A%84%E6%A8%A1%E5%9D%97%E5%8C%96.html#import
@import就相当于一个代码的传送门，在引入的位置进行代码的拼接，所有引入链构成一个上下文，sass处理器对它进行翻译打包成css。所以存在重复引入的问题。

css 中本身就有 @import，sass 在其基础上进行扩展，可以用来导入模块中的变量，mixin，函数等，以及模块的样式。

和 css 中的 @import 不同之处在于，css 中的 @import 可以是一个线上 url 地址，浏览器会在运行时下载这个文件，而 sass 中的 @import 只能在编译打包阶段运行，所以在 sass 中只能导入一个本地存在的 sass/scss/css 文件。

```
@import "a.scss", "b.scss", "c.scss";
```

@import 在 sass 中的用法和在 css 中一样，只不过在 sass 中允许写一个 @import 导入多个文件，文件以逗号，分隔开即可，css 中必须每个文件写一个 @import。

Sass 团队不推荐继续使用 @import。Sass 将在未来几年内逐步淘汰它，并最终将其完全从语言中移除。建议使用 @use 来代替。

## 嵌套的 @import
@import 通常是写在样式表的顶层，但其实它们也可以嵌套在样式块中或纯 CSS at-rules中。

导入的 CSS 代码块将嵌套在该上下文中，这使得嵌套的 @import 对于将 CSS 块定位到特定元素或媒体查询非常有用。

注意，在嵌套 @import 引入的文件中定义的顶级 mixins，函数，变量依然会被导入为全局的变量。

```
// a.scss
.a {
  color: $red;
}
// ---------------

// index.scss
$red: #a55;
.index {
  @import "a";
}
// ---------------
```

编译后的 css ：

```
.index .a {
  color: #a55;
}
```

嵌套 @import 对于确定第三方样式表的作用域非常有用，但是如果您是要导入自己写的样式表，那么最好在 @mixin 中编写您的样式，然后使用 @include 来将 @mixin 包含在嵌套的上下文中。@mixin 可以以更灵活的方式使用，当查看导入的样式表时，它的用途会更清晰。

## 使用 @import 存在的问题：

* @import 使所有变量、 mixins 和函数都可以全局访问。导致很难判断是在哪里定义的。

* 因为所有东西都变成全局的，所以 sass 库必须在所有成员前加上前缀，以避免命名冲突。

* @extend 也是全局的，这使得很难预测哪些样式将被继承。

* 每个样式表都会被执行编译，每一个 @import 都会生成它的 CSS，这会增加编译时间并产生臃肿的代码输出。

* 没有办法定义不想暴露出去的私有成员和占位符选择器。


当 @import 一个文件时，该文件的编译过程就像它的所有代码直接出现在 @import 的位置一样。导入的文件中的所有 mixin、函数和变量都是可用的，并且在写入 @import 的确切位置包含了导入的文件中的所有样式代码。并且，在 @import 之前定义的 mixin、函数或变量(包括来自其他 @import 的)甚至都可以在被导入的那个文件中去使用。

```sass
// a.scss
@import "c";
$red: #f00;
//------------------------

// b.scss
@import "c";
.b {
  color: $red;
  border-color: $black;
}
//------------------------

// c.scss
.c {
  font-size: 16px;
}
//------------------------

// index.scss
@import 'a';
$black: #000;
@import 'b'; // 问题：在 b.scss 中能够访问到 a.scss 的变量和 index.scss中引入b.scss之前声明的变量
//------------------------

```
编译后的css：

```css
.c {
  font-size: 16px;
}
/* stylelint-disable-next-line no-duplicate-selectors */
.c {
  font-size: 16px;
}

.b {
  color: #f00;
  border-color: #000;
}
```
上例编译结果可以看到，同一文件多次被 @import 时，就会被重复编译多次。而且按引入顺序所有定义的变量都是全局的。


