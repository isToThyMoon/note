
# keyof

```ts

interface Point {
    x: number;
    y: number;
}

type keys = keyof Point;
//相当于
type keys = "x" | "y"

```

利用keyof实现一些属性的拓展

# partical 和 pick

```
type Partical<T> = {
    [P in keyof T]?: T[P];
}


type Required<T> = {
    [P in keyof T]-?: T[P];
}

type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}


interface User {
    id: number;
    age: number;
    name: string;
}


type PartialUser = Partial<User>;
// 相当于 type PartialUser = { id?: number; age?: number; name?: string; }

type PickUser = Pick<User, 'id'|'age'>
// 相当于 type PickUser = { id: number; age: number }

```

# exclude extract omit

exclude extract
```ts

type Exclude<T, U> = T extends U ? never : T;

// 与 Exclude 实现刚好相反，Exclude 取差集，而 Extract 取交集
type Extract<T, U> = T extends U ? T : never;


// 相当于: type A = 'a'
type A = Exclude<'x' | 'a', 'x'>
type A = Exclude<'x' | 'a', 'x' | 'y' | 'z'>

// 相当于: type A = 'x'
type A = Extract<'x' | 'a', 'x'>

```

omit

```
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
  id: number;
  age: number;
  name: string;
};

// 相当于: type PickUser = { age: number; name: string; }
type OmitUser = Omit<User, "id">
```

#  Record & Dictionary & Many

这几个语法糖是从 lodash 的类型源码中学到的，平时工作中的使用频率还挺高。

record 将一个类型的所有属性都映射到另一个类型上并创造一个新的类型

``` ts
// 将K中每个属性（[P in K]）都转为T类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

interface Dictionary<T> {
  [index: string]: T;
};

interface NumericDictionary<T> {
  [index: number]: T;
};

const data:Dictionary<number> = {
  a: 3,
  b: 4
}

// 将K中所有属性值转为T类型，并将返回的新类型返回给ProxyKType K可以是联合类型 对象 枚举。。。
type ProxyKType = Record<K, T>
```

实际上可用 Record 代替 Dictionary 与 NumericDictionary

```
// 以下二者等价:
type A = Record<string, any>
type B = Dictionary<any>
```
Record 已内置在 Typescript 中原生实现，在平时中仅使用 Record 即可