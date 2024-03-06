
# reflect直接对对象添加属性
静态方法 Reflect.defineProperty() 基本等同于 Object.defineProperty() 方法，唯一不同是返回 Boolean 值。指示reflect值是否被成功定义。
```js
Reflect.defineProperty(HTMLElement.prototype, 'ondomresize', {
  set(handler) {
    this._onresize = handler
    if (typeof handler !== 'function') {
      return
    }
    registObserver(this, 'domresize')
  },
  get() {
    return this._onresize || null
  },
})
```

# proxy
```js
const obj = {
    count: 1
};
// var p = new Proxy(target, {
//   get: function (target, property, receiver) {},
// });
const proxy = new Proxy(obj, {
// 以下是传递给 get 方法的参数，this 上下文绑定在handler 对象上
// target 目标对象 
// property 被获取的属性名
// receiver：Proxy 或者继承 Proxy 的对象
    get(target, property, receiver) {
        console.log("这里是get");
        return Reflect.get(target, property, receiver);
    },
// value 新属性值
// receiver 最初被调用的对象。通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 proxy 本身）
// 备注： 假设有一段代码执行 obj.name = "jen"， obj 不是一个 proxy，且自身不含 name 属性，但是它的原型链上有一个 proxy，那么，那个 proxy 的 set() 处理器会被调用，而此时，obj 会作为 receiver 参数传进来
    set(target, property, value, receiver) {
        console.log("这里是set");
        return Reflect.set(target, property, value, receiver);
    }
});
    
console.log(proxy)
console.log(proxy.count)
```
以上代码就是Proxy的具体使用方式，通过和Reflect 的配合，就能实现对于对象的拦截

如果对象中的元素还是对象，可能就无法拦截了，所以要再包裹一层递归调用：
```js
const obj = {
    a: {
        count: 1
    }
};

function reactive(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            console.log("这里是get");
            // 判断如果是个对象在包装一次，实现深层嵌套的响应式
            if (typeof target[key] === "object") {
                return reactive(target[key]);
            };
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            console.log("这里是set");
            return Reflect.set(target, key, value, receiver);
        }
    });
};
const proxy = reactive(obj);
```


apply方法：
 apply方法能拦截函数的调用、call和apply操作。apply(target, thisArg, argumentsList) 三个参数，分别是目标对象、被调用时的上下文对象、被调用的参数数组。如下：
```
function add(a, b) {
  console.log(a + b);
}
//给add函数设置一个代理
let p = new Proxy(add, {
apply(target, thisArg, argumentsList) {
  console.log("拦截");
  //正常应该如下设置：
  target.apply(thisArg, argumentsList);
},
});
p(1, 2);
p.call(null, 13, 22);
p.apply(null, [5, 3]);

```



# vue从defineproperty到proxy的原因
vue2用defineproperty vue3用proxy实现响应式 细粒度组件的状态更新
实现功能类似，但是本质有区别。

监听数据的角度
defineproperty只能监听某个属性而不能监听整个对象。
proxy不用设置具体属性，直接监听整个对象。
defineproperty监听需要知道是哪个对象的哪个属性，而proxy只需要知道哪个对象就可以了。也就是会省去for in循环提高了效率。

监听对原对象的影响
因为defineproperty是通过在原对象身上新增或修改属性增加描述符的方式实现的监听效果，一定会修改原数据。
而proxy只是原对象的代理，proxy会返回一个代理对象不会在原对象上进行改动，对原数据无污染。

实现对数组的监听
因为数组 length 的特殊性 (length 的描述符configurable 和 enumerable 为 false，并且妄图修改 configurable 为 True 的话 js 会直接报错：VM305:1 Uncaught TypeError: Cannot redefine property: length)
defineproperty无法监听数组长度变化, Vue只能通过重写数组方法的方式变相达成监听的效果，光重写数组方法还是不能解决修改数组下标时监听的问题，只能再使用自定义的$set的方式
而proxy因为自身特性，是创建新的代理对象而不是在原数据身上监听属性，对代理对象进行操作时，所有的操作都会被捕捉，包括数组的方法和length操作，再不需要重写数组方法和自定义set函数了。(代码示例在下方)

监听的范围
defineproperty只能监听到value的 get set 变化。
proxy可以监听除 [[getOwnPropertyNames]] 以外所有JS的对象操作。（[js最基础14种操作对象方法](https://segmentfault.com/a/1190000041067619)）监听的范围更大更全面。