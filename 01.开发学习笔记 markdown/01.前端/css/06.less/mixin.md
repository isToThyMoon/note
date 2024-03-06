# 

混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。假设我们定义了一个类（class）如下：
```
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

如果我们希望在其它规则集中使用这些属性呢？没问题，我们只需像下面这样输入所需属性的类（class）名称即可，如下所示：

```
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

所以说less不像sass需要@mixin关键词来声明一个mixin，你可以直接使用定义好的class selector和id selector，然后加上()调用：

You can mix-in class selectors and id selectors, e.g.
```
.a, #b {
  color: red;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}

// which results in:

.a, #b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
```
文档介绍中，括号调用是可选的，你可以不加括号直接调用mixin，但在后续版本升级中这种不加括号调用的方式会被废弃。

而且，直接把class选择器和id选择器当作mixin来插入调用当然没问题，但是这段class选择器和id选择器定义也会被当成常规的css规则代码输出，如果你只把它当作mixin来使用，并且不想有输出的冗余代码，可以采用less中正规的mixin调用定义方式：

If you want to create a mixin but you do not want that mixin to be in your CSS output, put parentheses after the mixin definition.

```
.my-mixin {
  color: black;
}
.my-other-mixin() {
  background: white;
}
.class {
  .my-mixin();
  .my-other-mixin();
}

// outputs

.my-mixin {
  color: black;
}
.class {
  color: black;
  background: white;
}
```
最好这样做，.mixin(){}定义，然后.mixin()调用，没有歧义。而且可以使用参数。


# Selectors in Mixins
minxin中正常使用选择器，如父级选择器：
Mixins can contain more than just properties, they can contain selectors too.

For example:
```
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}

button {
  .my-hover-mixin();
}

// Outputs：

button:hover {
  border: 1px solid red;
}
```

# Parametric Mixins
mixin传递参数
How to pass arguments to mixins
Mixins can also take arguments, which are variables passed to the block of selectors when it is mixed in.
```
.border-radius(@radius) {
  -webkit-border-radius: @radius;
     -moz-border-radius: @radius;
          border-radius: @radius;
}

// And here's how we can mix it into various rulesets:

#header {
  .border-radius(4px);
}
.button {
  .border-radius(6px);
}

// Parametric mixins can also have default values for their parameters:
// 默认参数，这里的默认参数也可以是另一个定义好的变量
.border-radius(@radius: 5px) {
  -webkit-border-radius: @radius;
     -moz-border-radius: @radius;
          border-radius: @radius;
}

We can invoke it like this now:

#header {
  .border-radius();
}
```