# 枚举类型 
保存常量

但 enum 和const enum表现不同：

const in an enum means the enum is fully erased during compilation. Const enum members are inlined at use sites. You can can't index it by an arbitrary value. In other words, the following TypeScript code

``` ts
const enum Snack {
  Apple = 0,
  Banana = 1,
  Orange = 2,
  Other = 3
}

let snacks = [
  Snack.Apple,
  Snack.Banana,
  Snack.Orange,
  Snack.Other
];
is compiled to:

let Snacks = [
    0 /* Apple */,
    1 /* Banana */,
    2 /* Orange */,
    3 /* Other */
];
```

Compare it with non-const version:

``` ts
enum Snack {
  Apple = 0,
  Banana = 1,
  Orange = 2,
  Other = 3
}

let Snacks = [
  Snack.Apple,
  Snack.Banana,
  Snack.Orange,
  Snack.Other
];
it is compiled to:

var Snack;
(function (Snack) {
    Snack[Snack["Apple"] = 0] = "Apple";
    Snack[Snack["Banana"] = 1] = "Banana";
    Snack[Snack["Orange"] = 2] = "Orange";
    Snack[Snack["Other"] = 3] = "Other";
})(Snack || (Snack = {}));
let Snacks = [
    Snack.Apple,
    Snack.Banana,
    Snack.Orange,
    Snack.Other
];
```