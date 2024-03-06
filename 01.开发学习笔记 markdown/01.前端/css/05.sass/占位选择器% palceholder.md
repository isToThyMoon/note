%定义
@extend引用

```scss
%toolbelt{}
...
@extend %toolbelt
...
```
Sass有一种特殊的选择符，称为“占位符”。它的外观和行为很像一个类选择器，但是它以%开头，并且它不包含在CSS输出中。事实上，任何包含占位符的复杂选择器(逗号之间的)都不会包含在CSS中，任何选择器都包含占位符的样式规则也不会包含在CSS中。

它可以被继承（extend），普通的 class 选择器不管有没有被继承都会被编译到 css 中，但占位符选择器没有被继承时，不会生成任何多余的 css。

与Mixins不同，%placeholder也可以多次使用，而且不会生成重复的代码。这使得输入的CSS更友好，更干净。

```sass
%toolbelt {
  box-sizing: border-box;
  border-top: 1px rgba(#000, 0.12) solid;
  padding: 16px 0;
  width: 100%;

  &:hover { border: 2px rgba(#000, 0.5) solid; }
}

.action-buttons {
  @extend %toolbelt;

  color: #4285f4;
}

.reset-buttons {
  @extend %toolbelt;

  color: #cddc39;
}
```

编译后的 css ：

```sass
.action-buttons,
.reset-buttons {
  box-sizing: border-box;
  border-top: 1px rgba(0, 0, 0, 0.12) solid;
  padding: 16px 0;
  width: 100%;
}

.action-buttons {
  color: #4285f4;
}

.reset-buttons {
  color: #cddc39;
}

.action-buttons:hover,
.reset-buttons:hover {
  border: 2px rgba(0, 0, 0, 0.5) solid;
}
```

根据经验，在编写 Sass 库时，占位符选择符会很有用，每个样式规则都可以使用，也可以不使用。

如果您只是为自己的应用程序编写样式表，扩展 class 选择器就行了。

占位选择器是复用代码的很好的手段。

不要滥用mixin，如果有重复代码需要这个在不同地方使用，考虑placeholder。

多个选择器运用了相同的%placeholder也只会输出一次代码。没有引用的%placeholder是不会输出任何CSS代码。

和第三点的Mixins配合在一起使用，既可保持Mixins灵活性，而且还可以保持代码的简洁与干净。
```css
/* PLACEHOLDER 
============================================= */

%btn {
    padding: 10px;
    color:#fff;
    curser: pointer;
    border: none;
    shadow: none;
    font-size: 14px;
    width: 150px;
    margin: 5px 0;
    text-align: center;
    display: block;
}

/* BUTTON MIXIN 
============================================= */

@mixin  btn-background($btn-background) {
    @extend %btn;
    background-color: $btn-background;
    &:hover {
        background-color: lighten($btn-background,10%);
    }
}

/* BUTTONS
============================================= */

.cta-btn {
    @include btn-background(green);
}

.main-btn {
    @include btn-background(orange);
}

.info-btn {
    @include btn-background(blue);
}
```