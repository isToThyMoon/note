# 表示继承类型


# 书写泛型时 表示类型参数限制约束 (泛型约束)

比如希望传入的参数都有name属性的数组
```ts
    function getCnames<T extends {name:string}>(entities: T[]):string[]{
        return entitles.map(entity => entity.name)
    }

```

这里extends 对传入的参数作了一个限制，entities的每一项可以是一个对象，但是必须含有类型为string的cname属性。
extends约束了泛型T必须符合接口{name:string}（是的 这里其实是接口)的形状，如果在调用时，传入的参数entitles不满足T[]，那么在编译阶段就会报错了。


# 表示分配

判断一个类型是否可以分配给另一个类型
type Human = {
    name: string
}

type Duck = {
    name: string
}

type Bool = Duck extends Human ? 'yes' : 'no'