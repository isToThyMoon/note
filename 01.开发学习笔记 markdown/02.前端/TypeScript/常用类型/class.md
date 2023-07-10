# 先看ES6 中类的用法
## 属性和方法
使用 class 定义类，使用 constructor 定义构造函数。
通过 new 生成新实例的时候，会自动调用构造函数。

```ts
class Animal {
    public name;
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

## 类的继承
使用 extends 关键字实现继承，子类中使用 super 关键字来调用父类的构造函数和方法。
```ts
class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi() {
    return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom

```

##  存取器
使用 getter 和 setter 可以改变属性的赋值和读取行为：
```ts
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return 'Jack';
  }
  set name(value) {
    console.log('setter: ' + value);
  }
}

let a = new Animal('Kitty'); // setter: Kitty
a.name = 'Tom'; // setter: Tom
console.log(a.name); // Jack
```

## 静态方法
使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用：
```ts
class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}

let a = new Animal('Jack');
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function
```

# ES7 中类的用法

ES7 中有一些关于类的提案，TypeScript 也实现了它们，这里做一个简单的介绍。

## 实例属性（类字段）
ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义：
```ts
class Animal {
  name = 'Jack';

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
```

## 静态属性
ES7 提案中，可以使用 static 定义一个静态属性：
```ts
class Animal {
  static num = 42;

  constructor() {
    // ...
  }
}

console.log(Animal.num); // 42
```

# ts中的一些类型用法

public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
private 修饰的属性或方法是私有的，不能在声明它的类的外部访问。例如想在类的一个实例或者子类中调用这个private属性是不行的，无法被直接存取，可以通过其他public的方法或属性间接读写
需要注意的是，TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性。 编译后还是一个普通的实例属性
protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的。

有个很少用的限制，当构造函数被修饰为 private 时，该类不允许被继承或者实例化，当构造函数修饰为 protected 时，该类只允许被继承。

readonly 只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

## 抽象类
abstract 用于定义抽象类和其中的抽象方法。什么是抽象类？首先，抽象类是不允许被实例化的。
```js
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

其次，抽象类中的抽象方法必须被子类实现。子类如果没有实现该抽象方法就会报错：

```ts
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`);
  }
}

let cat = new Cat('Tom');

// index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
```

实现了抽象方法 sayHi，编译通过了。

需要注意的是，即使是抽象方法，TypeScript 的编译结果中，仍然会存在这个类，上面的代码的编译结果是：
```js
var __extends =
  (this && this.__extends) ||
  function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var Cat = (function (_super) {
  __extends(Cat, _super);
  function Cat() {
    _super.apply(this, arguments);
  }
  Cat.prototype.sayHi = function () {
    console.log('Meow, My name is ' + this.name);
  };
  return Cat;
})(Animal);
var cat = new Cat('Tom');
```

所以其实ts这些限制只是在编译成js前提供约束和检查，它并没有超出js的es标准。