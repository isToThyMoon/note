

```sass
.error {}
...
 @extend .error;
 ...
```
除了extend %placeholder，extend也可以直接继承另一个选择器样式

# @extend
@extend <selector>，它告诉 Sass 一个选择器应该继承另一个选择器的样式。

```sass
.error {
  border: 1px #f00;
  background-color: #fdd;

  &--serious {
    @extend .error;

    border-width: 3px;
  }
}
```

编译后的 css ：

```sass
.error,
.error--serious {
  border: 1px #f00;
  background-color: #fdd;
}
.error--serious {
  border-width: 3px;
}
```

可以看到，Sass 中继承并不是将继承的样式代码复制一份过来，而是将当前使用了继承的选择器添加到目标样式块上去。

这样，在元素上就可以写 class="error--serious" 而不需要写成 class="error error--serious" 了。

Sass 在继承时，不仅是继承一个选择器本身的样式，它会继承这个选择器使用的所有样式，比如伪类。