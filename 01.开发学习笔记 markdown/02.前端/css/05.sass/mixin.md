

@mixin定义
@include引用

有变量根据变量生成不同的样式使用，当只是为了复用代码，考虑单纯的extend或placeholder。

Mixins是实现代码块的一种伟大方式，可以在一个站点内多次使用。然而，@include定义好的Mixins和在CSS代码中复制、粘贴没什么不一样。它将会让你的CSS代码生成很多重复的代码，让你的文件变得越来越臃肿。

到目前为止，Mixins只适合那种需要通过传递参数来快速创建样式的情形。

```css
// @mixin定义
@mixin rounded-corner($arc) {
    -moz-border-radius: $arc;
    -webkit-border-radius: $arc;
    border-radius: $arc;  
}
```

rounded-corner这个Mixins可以在任何情况下使用，仅仅通过改变其参数$arc的值，将得到不同的代码：

```css
// @include引用
.tab-button {
     @include rounded-corner(5px); 
}

.cta-button {
     @include rounded-corner(8px); 
}
```

像这样使用Mixins是不明智的：

```css
@mixin cta-button {
    padding: 10px;
    color: #fff;
    background-color: red;
    font-size: 14px;
    width: 150px;
    margin: 5px 0;
    text-align: center;
    display: block;
}
```
这个Mixins没有传递任何参数，更建议使用%placeholder来创建。




# mixin 解决主题
```
$oss-theme-colors: (
    // "light": $oss-theme-light,
    // "dark": $oss-theme-dark,
    "skyblue": $oss-theme-skyblue,
    "red": $oss-theme-red,
    "pink": $oss-theme-pink,
    "brown": $oss-theme-brown,
)
```

```css
@mixin in-theme($type: "light") {
    $selector: &;

    @at-root .is-theme-#{$type} & {
        @content;
    }
}

@mixin in-theme-color(){
    @each $name, $color in $oss-theme-colors {
        @include in-theme($name) {
            @content($color);
             // content可以传递参数 此处相当于函数调用 
             // 定义部分在@include in-theme-color using($color) { } 这里的using($color)就是定义传递给content的参数
        }
    }
}
```

使用：
```css
.button {
    @include in-theme("dark") {
        box-shadow: unset;
        background-color: rgba($oss-dark-background-primary, .8);
    
        color: $--color-white;
    }
}
```

```css
@include in-theme-color using($color) {
    // background-color: $color;

    @if $color == #FFFFFF {

    } @else if $color == #1B1A23 {

    } @else {

        .tabList-body{
            height: 100%;
            .tabList-item{
                .tabList-itemtext{
                    &-active{

                    }
                }
                
            }
            .tabList-item-inkbar{
                background: $color;
            }
        }

    }
}
```
