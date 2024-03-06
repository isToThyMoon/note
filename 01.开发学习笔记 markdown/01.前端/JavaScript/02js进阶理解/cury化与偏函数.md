
（将参数）柯里化: 把接受多个参数的函数变换成接受一个单一参数（或部分）的函数，并且返回接受余下的参数和返回结果的新函数的技术

函数式编程起源于lambda运算，JavaScript 闭包的概念也来源于 lambda 运算中变量的被绑定关系。
因为在 lambda 演算的设定中，参数只能是一个，所以通过柯里化的天才想法来实现接收多个参数：
```
lambda x. ( lambda y. plus x y )
```
说这个想法是“天才”一点不为过，把函数自身作为输入参数或输出返回值，至今受用，也就是【高阶函数】的定义。
将上述 lambda 演算柯里化写法转变到 JavaScript 中，就变成了：
```
function add(a) {
    return function (b) {
        return a + b
    }
}

add(1)(2)
```
所以，剖析闭包从柯里化开始，柯里化是闭包的“孪生子”。


简单来说：柯里化是把接受 n 个参数的 1 个函数改造为只接受 1个参数的 n 个互相嵌套的函数的过程。也就是 fn (a, b, c)会变成 fn(a)(b)(c)。

```js
function generateName(prefix, type, itemName) {
    return prefix + type + itemName
}
```
到：

```js
function generateName(prefix) {  
    return function(type) {
        return function (itemName) {
            return prefix + type + itemName
        }    
    }
}

// 生成大卖网商品名专属函数
var salesName = generateName('大卖网')

// “记住”prefix，生成大卖网母婴商品名专属函数
var salesBabyName = salesName('母婴')

// "记住“prefix和type，生成洗菜网生鲜商品名专属函数
var vegFreshName = generateName('洗菜网')('生鲜')

// 输出 '大卖网母婴奶瓶'
salesBabyName('奶瓶')
// 输出 '洗菜网生鲜菠菜'
vegFreshName('菠菜')

// 啥也不记，直接生成一个商品名
var itemFullName = generateName('洗菜网')('生鲜')('菠菜')
```

偏函数应用相比之下就 “随意” 一些了。偏函数是说，固定你函数的某一个或几个参数，然后返回一个新的函数（这个函数用于接收剩下的参数）。你有 10 个入参，你可以只固定 2 个入参，然后返回一个需要 8 个入参的函数 —— 偏函数应用是不强调 “单参数” 这个概念的。它的目标仅仅是把函数的入参拆解为两部分。

# 应用
高阶函数都是柯里化的应用
```
_.debounce 防抖、_.throttle 节流，_.curry 柯里参数、_.partial 缓存传参、_.memoize “缓存计算”
```

## curry化参数
先实现一个 `addCurry(1)(2)(3)`

```
function addCurry() {
    let arr = [...arguments]
    // 利用闭包的特性收集所有参数值
    var fn = function() {
        arr.push(...arguments);
        return fn;
    };
    // 利用 toString 隐式转换
    fn.toString = function () {
        return arr.reduce(function (a, b) {
            return a + b;
        });
    }
    return fn;
}

```

## 缓存（固定）部分参数
柯里化固定参数的好处在：复用了原本的 ajax 函数，并在原有基础上做了修改
减少传参的函数同样适用
```
function ajax(url, data, callback) {
  // ...
}

function partial(fn, ...presetArgs) { // presetArgs 是需要先被绑定下来的参数
  return function partiallyApplied(...laterArgs) { //  ...laterArgs 是后续参数
        let allArgs =presetArgs.concat(laterArgs) // 收集到一起
        return fn.apply(this, allArgs) // 传给回调函数 fn
  }
}

let ajaxTest2 = partial(ajax,'http://www.test.com/test2')

ajaxTest2(data,callback)

```

## 缓存判断

多次调用 handleOption('A')，却只走一次 if...else..
也就是缓存判断结果，不用每次都if else判断。
```
const handleOption = (param) => {
     console.log('从始至终只用执行一次 if...else...')
     if(param === 'A'){
         return ()=>console.log('A')
     }else{
         return ()=>console.log('others')
     }
}

const tmp = handleOption('A')

tmp()
tmp()
tmp()

```

这样的场景是有实战意义的，当我们做前端兼容时，经常要先判断是来源于哪个环境，再执行某个方法。比如说在 firefox 和 chrome 环境下，添加事件监听是 addEventListener 方法，而在 IE 下，添加事件是 attachEvent 方法；如果每次绑定这个监听，都要判断是来自于哪个环境，那肯定是很费劲。我们通过上述封装的方法，可以做到 一处判断，多次使用。

这也是柯里化？
是的，把 'A' 条件先固定下来，也可叫“缓存下来”，后续的函数执行将不再传 'A' 这个参数，实打实的：把多参数转化为单参数，逐个传递。

## 缓存计算
我们再设想这样一个场景，现在有一个函数是来做大数计算的：
```
javascript复制代码const calculateFn = (num)=>{
    const startTime = new Date()
    for(let i=0;i<num;i++){} // 大数计算
    const endTime = new Date()
    console.log(endTime - startTime)
    return "Calculate big numbers"
}

calculateFn(10_000_000_000)
```
这是一个非常耗时的函数，复制代码在控制台看看，需要 8s+。
如果业务代码中需要多次用到这个大数计算结果，多次调用 calculateFn(10_000_000_000) 肯定是不明智的，太费时。
要声明全局变量缓存计算结果吗？可以是可以，问题太多了，内存空间，变量命名。。。

苛里化解决：
先传递处理计算函数，后处理数值参数，在间隔过程中将计算结果缓存了下来。

```
const calculateFn = (num)=>{
    console.log("计算即缓存")
    const startTime = new Date()
    for(let i=0;i<num;i++){} // 大数计算
    const endTime = new Date()
    console.log(endTime - startTime) // 耗时
    return "Calculate big numbers"
}

function cached(fn){
  const cacheObj = Object.create(null); // 创建一个对象
  return function cachedFn (str) { // 返回回调函数
    if ( !cacheObj [str] ) { // 在对象里面查询，函数结果是否被计算过
        let result = fn(str);
        cacheObj [str] = result; // 没有则要执行原函数，并把计算结果缓存起来
    }
    return cacheObj [str] // 被缓存过，直接返回
  }
}

let cashedCalculate = cached(calculateFn) 

console.log(cashedCalculate(10_000_000_000)) // 计算即缓存 // 9944 // Calculate big numbers
console.log(cashedCalculate(10_000_000_000)) // Calculate big numbers

console.log(cashedCalculate(20_000_000_000)) // 计算即缓存 // 22126 // Calculate big numbers
console.log(cashedCalculate(20_000_000_000)) // Calculate big numbers

```

这样只用通过一个 cached 缓存函数的处理，所有的大数计算都能保证：输入参数相同的情况下，全局只用计算一次，后续可直接使用更加语义话的函数调用来得到之前计算的结果。
此处也是柯里化的应用，在 cached 函数中先传需要处理的函数参数，后续再传入具体需要操作得值，将多参转化为单个参数逐一传入。

## 缓存函数
设想，我们有一个数字 7 要经过两个函数的计算，先乘以 10 ，再加 100，写法如下：
```
const multi10 = function(x) { return x * 10; }
const add100 = function(x) { return x + 100; }
add100(multi10(7))
```

用柯里化处理后，即变成：
```

const multi10 = function(x) { return x * 10; }
const add100 = function(x) { return x + 100; }
const compose = function(f,g) { 
    return function(x) { 
        return f(g(x))
    }
}

// compose(add100, multi10)(7)

let compute = compose(add100, multi10)
compute(7)

```

所以，这里的柯里化直接把函数处理给缓存了，当声明 compute 变量时，并没有执行操作，只是为了拿到 ()=> f(g(x))，最后执行 compute(7)，才会执行整个运算




综合以上，可见由函数式启发的“闭包”、“柯里化”思想对 JavaScript 有多重要。几乎所有的高阶函数都离不开闭包、参数由多转逐一的柯里化传参思想。所在在很多面试中，都会问闭包，不管是一两年、还是三五年经验的前端程序员。定义一个前端的 JavaScript 技能是初级，还是中高级，这是其中很重要的一个判断点。

对闭包概念模糊不清的、或者只会背概念的 => 初级
会写防抖、节流、或柯里化等高阶函数的 => 中级
深刻理解高阶函数封装思想、能自主用闭包封装高阶函数 => 高级