//
// 设计模式是一组经过反复验证和广泛应用的最佳实践，用于解决特定类型问题的重复性解决方案。
// 除了工厂模式、观察者模式和发布-订阅模式，还有许多其他常用的设计模式，每个模式都有其独特的用途和优势。以下是一些常见的设计模式：
//
// 单例模式（Singleton Pattern）：确保一个类只有一个实例，并提供全局访问点。常用于需要全局配置或状态管理的情况。
//
// 策略模式（Strategy Pattern）：定义一系列算法，将它们封装起来，并使它们可以互换使用，而不影响客户端代码。常用于需要在运行时选择不同算法的情况。
//
// 装饰器模式（Decorator Pattern）：动态地将责任附加到对象上，以扩展其功能。常用于添加对象的功能而不修改其原始类的情况。
//
// 适配器模式（Adapter Pattern）：将一个类的接口转换成客户端所期望的另一个接口，以解决接口不匹配的问题。
//
// 代理模式（Proxy Pattern）：为其他对象提供一种代理以控制对这个对象的访问。常用于实现延迟加载、访问控制、日志记录等功能。
//
// 工厂方法模式（Factory Method Pattern）：定义一个创建对象的接口，但让子类决定要实例化的类。常用于创建一组相关对象的场景。
//
// 抽象工厂模式（Abstract Factory Pattern）：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类。常用于创建复杂对象结构的场景。
//
// 命令模式（Command Pattern）：将一个请求封装成一个对象，从而使您可以参数化客户端队请求进行排队、记录请求日志，以及支持可撤销的操作。
//
// 模板方法模式（Template Method Pattern）：定义算法的骨架，将某些步骤延迟到子类中实现。常用于定义算法的框架，但允许子类在不改变算法结构的情况下重写特定步骤。
//
// 状态模式（State Pattern）：允许对象在其内部状态发生变化时改变其行为。常用于对象有多个状态，且状态之间需要转换的情况。
//
// 观察者模式（Observer Pattern）：定义了一种一对多的依赖关系，使得一个对象的状态发生变化时，其所有依赖对象都会得到通知并自动更新。
//
// 发布-订阅模式（Publish-Subscribe Pattern）：类似于观察者模式，但引入了一个中介者（消息代理或事件总线）来处理事件的发布和订阅。
//
// 迭代器模式（Iterator Pattern）：提供一种顺序访问集合对象元素的方式，而不暴露集合的底层表示。
//
// 备忘录模式（Memento Pattern）：在不违反封装的情况下捕获对象的内部状态，并在对象之间保存和恢复状态。
//
// 责任链模式（Chain of Responsibility Pattern）：解耦请求发送者和接收者，允许你将请求沿着处理链传递，直到某个处理器能够处理请求或者请求到达链的末尾而被丢弃。
//
// 这只是一小部分常见的设计模式，设计模式有助于提高代码的可维护性、可扩展性和可重用性，使代码更具可读性和可理解性。
// 选择正确的设计模式取决于具体的问题和需求。不同的模式可以在不同的情境下发挥作用。




// ————————————————————————————————————————————————————————————————————————————————
// 在JavaScript中，单例模式是一种设计模式，它确保一个类只有一个实例，并提供一种全局访问这个实例的方式。
// 这在某些情况下非常有用，例如在需要确保只有一个全局配置对象或资源管理器时。
//
// 以下是一个JavaScript单例模式的示例：

// 使用立即执行函数创建单例
const Singleton = (function () {
	let instance;

	// 创建单例的构造函数
	function createInstance() {
		// 在这里可以初始化单例的属性和方法
		return {
			someProperty: 'Some value',
			someMethod: function () {
				console.log('Some method');
			}
		};
	}

	return {
		// 获取单例实例的方法
		getInstance: function () {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		}
	};
})();

// 使用单例
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true，两个实例相同

instance1.someMethod(); // 调用单例的方法

// 在上面的示例中，`Singleton` 是一个立即执行函数，它包含了一个内部的 `instance` 变量和一个 `createInstance` 函数，用于创建单例的实例。
// `getInstance` 方法用于获取或创建实例。
//
// 通过调用 `Singleton.getInstance()`，你可以获取到单例的实例。
// 如果实例不存在，它会调用 `createInstance()` 来创建实例，并将其存储在 `instance` 变量中。
// 之后，无论多少次调用 `Singleton.getInstance()`，都会返回同一个实例，因此 `instance1` 和 `instance2` 是相同的。
//
// 这是一种简单的JavaScript单例模式示例，你可以根据实际需求来扩展它，以包含更多属性和方法。
// 单例模式有助于确保在应用中只有一个全局实例，避免不必要的资源浪费。

// ————————————————————————————————————————————————————————————————————————————————
// 策略模式
// 策略模式是一种行为设计模式，它允许你定义一系列算法，将每个算法封装起来，并使它们可以互换使用。
// 策略模式通常用于在运行时动态地选择算法，以便根据不同情况选择不同的策略。
// 以下是一个经典且易懂的JavaScript策略模式的示例，假设我们要实现一个计算购物车中商品总价的功能：

// 定义策略对象 - 不同的计算策略
const strategies = {
	regular: (price) => price,
	discount: (price) => price * 0.9,
	premium: (price) => price * 0.8
};

// 定义购物车对象
class ShoppingCart {
	constructor(discountStrategy) {
		this.cart = [];
		this.discountStrategy = discountStrategy;
	}

	// 添加商品到购物车
	addItem(item) {
		this.cart.push(item);
	}

	// 计算购物车中商品的总价
	calculateTotal() {
		let totalPrice = 0;
		for (const item of this.cart) {
			totalPrice += this.discountStrategy(item.price);
		}
		return totalPrice;
	}
}

// 使用策略模式
const cart1 = new ShoppingCart(strategies.regular);
cart1.addItem({ name: 'Product 1', price: 100 });
cart1.addItem({ name: 'Product 2', price: 50 });
console.log('Regular price:', cart1.calculateTotal()); // 150

const cart2 = new ShoppingCart(strategies.discount);
cart2.addItem({ name: 'Product 1', price: 100 });
cart2.addItem({ name: 'Product 2', price: 50 });
console.log('Discounted price:', cart2.calculateTotal()); // 135

const cart3 = new ShoppingCart(strategies.premium);
cart3.addItem({ name: 'Product 1', price: 100 });
cart3.addItem({ name: 'Product 2', price: 50 });
console.log('Premium price:', cart3.calculateTotal()); // 120

// 在上述示例中，我们有三种不同的计算策略：`regular`、`discount` 和 `premium`。
// `ShoppingCart` 类接受一个计算策略作为构造函数的参数，并在计算购物车中商品的总价时使用这个策略。
//
// 通过使用不同的策略，我们可以在运行时改变计算总价的方式，而不必修改`ShoppingCart`类的代码。
// 这是策略模式的核心思想：封装不同的算法，并使其可以互换使用，以达到更灵活、可维护和可扩展的代码设计。
//
// 这个示例展示了策略模式的经典用法，它可用于处理各种需要根据不同条件选择不同算法的情况，如价格计算、排序、数据处理等。
// 这种模式使你可以轻松添加新的策略而不会影响现有的代码。

// 其他前端应用
// 比如我们有一个权限控制功能，权限逻辑判断做不同的事情。
// if else一把梭
function checkAuth(data) {
	if (data.role !== 'juejin') {
		console.log('不是掘金用户');
		return false;
	}
	if (data.grade < 1) {
		console.log('掘金等级小于 1 级');
		return false;
	}
	if (data.job !== 'FE') {
		console.log('不是前端开发');
		return false;
	}
	if (data.type !== 'eat melons') {
		console.log('不是吃瓜群众');
		return false;
	}
	// 。。。
}
// checkAuth 函数会爆炸
// 策略项无法复用
// 违反开放封闭原则

// 用策略模式改造：

// 维护权限列表
const jobList = ['FE', 'BE'];
// 策略
var strategies = {
	checkRole: function (value) {
		return value === 'juejin';
	},
	checkGrade: function (value) {
		return value >= 1;
	},
	checkJob: function (value) {
		return jobList.indexOf(value) > 1;
	},
	checkEatType: function (value) {
		return value === 'eat melons';
	}
};

// 已经写完了策略，接下来要做的就是验证
// 校验规则
var Validator = function () {
	this.cache = [];

	// 添加策略事件
	this.add = function (value, method) {
		this.cache.push(function () {
			return strategies[method](value);
		});
	};

	// 检查
	this.check = function () {
		for (let i = 0; i < this.cache.length; i++) {
			let valiFn = this.cache[i];
			var data = valiFn(); // 开始检查
			if (!data) {
				return false;
			}
		}
		return true;
	};
};

// 使用策略模式进行实际操作
var compose1 = function () {
	var validator = new Validator();
	const data1 = {
		role: 'juejin',
		grade: 3
	};
	validator.add(data1.role, 'checkRole');
	validator.add(data1.grade, 'checkGrade');
	const result = validator.check();
	return result;
};

// 可以看出策略模式非常擅长解决if else问题
// 而且这些逻辑判断相对复杂 后续也需要灵活组合和拓展

// ————————————————————————————————————————————————————————————————————————————————
// 装饰器模式
// 拓展功能而不修改原始类
// 典型例子React中的HOC，高阶组件，现在理解了吧。

// ————————————————————————————————————————————————————————————————————————————————
// 适配器模式
// 解决接口适配的问题

// 前端场景：
// 我们有一个上传到空间文件的需求，上传文件列表里有三个不同的来源
// 侧边的“资源概况”是调接口有部分文件默认提供以供选择，返回的一个 MaterialsList ，可以从右边点击 “+” 添加进来
// 也可以通过选择本地文件上传
// 如果是编辑场景下，还有后台接口返回的数据

// 由于历史原因和之前后台接口返回的数据结构问题，这三个数据格式是不同的。

// 三个数据来源，三种时候数据结构，
// 我们的资源列表组件是只能接收一种数据格式的列表，我不想破坏纯展示型组件的内部逻辑，想保持该组件的职责：展示！
// 那该怎么处理？采用适配器模式，将不同的数据结构适配成展示组件所能接受的数据结构

// 本地资源文件上传之后的数据结构
export interface ResourceLocalFileType {
	uuid: string;
	name: string;
	size: number;
	created: number;
	lastModified: number;
	resourceType: number;
	cancel: () => void;
	status: string;
}
// 资源概况接口返回的数据结构
export interface ResourcePackageFileType {
	uuid: string;
	materialName: string;
	materialLink: string;
	materialType: number;
	uid?: string;
	ext?: string;
}
// 原先数据后台返回的数据接口
export interface ResourceBackendFileType {
	uuid: string;
	resourceName: string;
	resourceLink: string;
	resourceType: number;
	version: string;
	ext: string;
}

// 首先，定义一个统一的数据格式：AdapterResourceFileType
export interface AdapterResourceType {
	uuid: string;
	created: number;
	fileNo: number;
	fileName: string;
	fileOrigin: string;
	fileStatus: string;
	fileInfo: {
		type: number;
		size?: number;
		[key: string]: any;
	};
	// 本地图片额外操作
	action?: {
		cancel?: () => void;
		[key: string]: any;
	};
}

const ResourceAdapter = {
	// 本地文件
	local(list: ResourceLocalFileType[]){
		const adapterList: AdapterResourceType[] = list.map((resource,index)=>{
			return {
				//...
			}
		})
		return adapterList;
	},
	// 资源概况
	// ...
	// 后台返回结构
	// ...
}

// 使用时，使用ResourceAdapter适配所有不同的数据结构，返回统一的接口以供上传文件列表模块展示
// 这就是适配器模式？是的

// ————————————————————————————————————————————————————————————————————————————————
// 代理模式

// proxy拦截对象属性访问就是典型的代理模式。常用于实现延迟加载、访问控制、日志记录等功能。

// ————————————————————————————————————————————————————————————————————————————————

// 责任链模式
// 责任链模式（Chain of Responsibility Pattern）是一种行为设计模式，
// 它允许你将请求沿着处理链传递，直到某个处理器能够处理请求或者请求到达链的末尾而被丢弃。
// 这种模式适用于需要按顺序处理请求，而且每个处理步骤可能由不同的对象来处理的情况。
// 解决了将请求（任务）沿着一条处理链传递，按照一定顺序由多个处理器处理的问题，从而提供了一种更灵活、解耦、可扩展的方式来处理请求（任务）。

// 下面是一个实用的JavaScript责任链模式的例子：
// 假设我们要实现一个简单的购物车应用，需要依次验证商品是否可用、库存是否足够、用户余额是否充足等。

// 定义一个基础处理器
class Handler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request) {
    if (this.nextHandler) {
      return this.nextHandler.handleRequest(request);
    }
    return null;
  }
}

// 具体处理器 - 检查商品是否可用
class ProductAvailabilityHandler extends Handler {
  handleRequest(request) {
    if (request.availableProducts.includes(request.product)) {
      console.log(`${request.product} is available.`);
      return super.handleRequest(request);
    } else {
      console.log(`${request.product} is not available.`);
      return 'Product not available';
    }
  }
}

// 具体处理器 - 检查库存是否足够
class InventoryHandler extends Handler {
  handleRequest(request) {
    if (request.inventory >= request.quantity) {
      console.log(`Inventory is sufficient.`);
      return super.handleRequest(request);
    } else {
      console.log(`Inventory is not sufficient.`);
      return 'Insufficient inventory';
    }
  }
}

// 具体处理器 - 检查用户余额
class BalanceHandler extends Handler {
  handleRequest(request) {
    if (request.balance >= request.totalPrice) {
      console.log(`User has enough balance.`);
      return 'Purchase successful';
    } else {
      console.log(`User does not have enough balance.`);
      return 'Insufficient balance';
    }
  }
}

// 客户端代码
const productAvailabilityHandler = new ProductAvailabilityHandler();
const inventoryHandler = new InventoryHandler();
const balanceHandler = new BalanceHandler();

productAvailabilityHandler.setNext(inventoryHandler).setNext(balanceHandler);

const request = {
  product: 'Product A',
  availableProducts: ['Product A', 'Product B', 'Product C'],
  inventory: 10,
  quantity: 5,
  balance: 100,
  totalPrice: 50,
};

const result = productAvailabilityHandler.handleRequest(request);
console.log(result);

// 在这个示例中：
//
// - 我们创建了一个责任链，包含三个具体处理器：`ProductAvailabilityHandler`、`InventoryHandler` 和 `BalanceHandler`。
// - 每个具体处理器都可以处理请求或者将请求传递给下一个处理器。
// - 客户端代码创建一个请求对象，并将其传递给责任链的第一个处理器`productAvailabilityHandler`。
// - 请求会依次经过处理器链，每个处理器都可以选择处理请求或将其传递给下一个处理器。
// - 如果一个处理器处理请求，它将返回一个结果；否则，它将返回`null`。
// - 最终，客户端代码可以根据处理结果来判断请求是否成功。
//
// 责任链模式允许你动态组织和配置处理链，根据需要添加或移除处理器，以实现复杂的请求处理逻辑。
// 这种模式使代码更具可扩展性和可维护性，并且提供了一种有序处理请求的方式。























// ————————————————————————————————————————————————————————————————————————————————

// 观察者模式和发布-订阅模式都是用于实现对象之间的通信，但它们的主要区别在于通知机制和中介者的存在。
// 观察者模式中主体和观察者是互相感知的，发布-订阅模式是借助第三方来实现 调度的，发布者和订阅者之间互不感知
// 观察者模式主要是一对多的通知机制，
// 而发布-订阅模式引入了一个中介者来管理消息传递，并支持多对多的关系。
// 根据具体的应用场景和需求，可以选择使用其中之一或两者结合使用。

// 观察者模式（Observer Pattern）：定义了一种一对多的依赖关系，
// 其中一个对象（称为主题或被观察者）维护一组依赖于它的对象（称为观察者），
// 当主题的状态发生变化时，它会通知所有的观察者，以便它们可以自动更新。

// 发布-订阅模式（Publish-Subscribe Pattern）：发布-订阅模式也用于对象之间的通信，支持多对多的关系。
// 但它引入了一个中介者（称为消息代理或事件总线），发布者（发布消息的对象）不直接与订阅者（订阅消息的对象）通信，
// 而是通过中介者进行消息传递。

// ————————————————————————————————————————————————————————————————————————————————
// 手写一个EventEmitter
// 这是一个实现发布-订阅模式（Publish-Subscribe Pattern）的类，
// 具体来说是一个事件管理器或事件总线类，用于处理事件的发布、订阅和取消订阅。
// 这个类的设计和实现符合发布-订阅模式的特点，
// 因为它引入了一个中介者（this.events 对象）来管理事件的订阅和发布。
// 发布者通过 emit 方法发布事件，订阅者通过 on 方法订阅事件，中介者负责协调事件的传递。
// 因此，这个类属于发布-订阅模式，用于实现对象之间的松散耦合通信。
// 观察者模式通常更侧重于对象之间的状态变化通知，而这个类更通用，可以用于处理各种类型的事件通知。

class EventEmitter {
	constructor() {
		this.events = {};
	}

	on(eventName, listener) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(listener);
	}

	emit(eventName, ...args) {
		if (this.events[eventName]) {
			this.events[eventName].forEach((listener) => {
				listener(...args);
			});
		}
	}

	off(eventName, listener) {
		if (this.events[eventName]) {
			const index = this.events[eventName].indexOf(listener);
			if (index !== -1) {
				this.events[eventName].splice(index, 1);
			}
		}
	}
}

// 前端应用：
// 想象我们有个常见的业务，在操作成功后需要调用消息中心，触发订单、调用审核模块等等
// 常规做法：
function applySuccess() {
	// 通知消息中心获取最新内容
	MessageCenter.fetch();
	// 更新订单信息
	Order.update();
	// 通知相关方审核
	Checker.alert();
}

// 不然还能怎么写呢？是没什么毛病，但考虑几个问题，比如这些事不同的模块，很合理这些不同的模块是由不同的人写的。
// 如果哪一次的迭代把这些模块的方法名改了。你必须同步在你的代码里修改。别无他法。
// 再比如这些模块是同步开发的，再其他人没写完前，你必须先注释掉代码，等开发完了再回来添加这段逻辑。
// 更可怕的是，如果这是个非常的核心的逻辑，后续不止设计这三个模块，可能是30个模块，包括上报操作成功日志等等，
// 你得继续在applySuccess函数内不断新增。无穷无尽。（违反开放封闭原则）

// 这就是发布订阅模式的用处了。
// 维护一个EventEmitter
// 操作成功就在操作模块发布此成功事件。
// 其他不同模块如果订单、审核、消息中心、只需要订阅这个事件。
// 这样对象间通信通过一个中介者实现。
// 修改下代码：
let event = new EventEmit();
event.trigger('success');

MessageCenter.fetch() {
	event.on('success', () => {
		console.log('更新消息中心');
	});
}
Order.update() {
	event.on('success', () => {
		console.log('更新订单信息');
	});
}
Checker.alert() {
	event.on('success', () => {
		console.log('通知管理员');
	});
}
// 各模块相互独立
// 存在一对多的依赖关系
// 依赖模块不稳定、依赖关系不稳定
// 各模块由不同的人员、团队开发
// 当然发布订阅模式其实还是有弊端的，比如说，过多的使用发布订阅，就会导致难以维护调用关系。需要开发者控制设计。

// ————————————————————————————————————————————————————————————————————————————————
// 观察者模式通常用于处理对象之间的状态变化通知，其中一个对象（被观察者或主题）维护一组依赖于它的对象（观察者），
// 当主题的状态发生变化时，它会通知所有的观察者。以下是一个简单的观察者模式示例，假设有一个新闻发布系统:

// Observer 类表示观察者，它可以订阅新闻并在接收到通知时执行操作。
// Subject 类表示主题，它维护了一组观察者，并能够发布新闻通知给所有订阅者。
// 当主题发布新闻通知时，所有订阅了该主题的观察者都会收到通知并执行自己的操作。观察者模式允许主题和观察者之间的松散耦合，
// 使得主题能够通知多个观察者，而不需要了解它们的具体实现。这种模式在实际应用中常见，例如在用户界面组件中通知视图更新等。

// 观察者（观察新闻的订阅者）
//
class Observer {
	constructor(name) {
		this.name = name;
	}

	// 当接收到新闻通知时，执行的操作
	update(news) {
		console.log(`${this.name} 收到新闻: ${news}`);
	}
}

// 主题（新闻发布者）（被观察者）
class Subject {
	constructor() {
		this.observers = [];
	}

	// 添加观察者订阅
	addObserver(observer) {      
		this.observers.push(observer);
	}

	// 移除观察者订阅
	removeObserver(observer) {
		const index = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
		}
	}

	// 发布新闻通知给所有观察者
	notify(news) {
		this.observers.forEach((observer) => {
			observer.update(news);
		});
	}
}

// 创建观察者对象
const observer1 = new Observer('订阅者1');
const observer2 = new Observer('订阅者2');
const observer3 = new Observer('订阅者3');

// 创建主题对象
const newsSubject = new Subject();

// 订阅者订阅新闻
newsSubject.addObserver(observer1);
newsSubject.addObserver(observer2);

// 发布新闻通知
newsSubject.notify('今天发生重要新闻！');

// 移除一个订阅者
newsSubject.removeObserver(observer1);

// 再次发布新闻通知
newsSubject.notify('另一则新闻发布了！');

// ————————————————————————————————————————————————————————————————————————————————
// 工厂模式
// 工厂模式（Factory Pattern）是一种创建型设计模式，它提供了一种创建对象的方式，
// 而无需暴露对象的创建逻辑。工厂模式通常用于管理对象的实例化过程，可以根据需要创建不同类型的对象。

class Circle {
	constructor(radius) {
		this.radius = radius;
	}
	calculateArea() {
		return Math.PI * this.radius * this.radius;
	}
}
class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	calculateArea() {
		return this.width * this.height;
	}
}
// 创建图形工厂
class ShapeFactory {
	// 工厂方法：创建圆形对象
	createCircle(radius) {
		return new Circle(radius);
	}
	// 工厂方法：创建矩形对象
	createRectangle(width, height) {
		return new Rectangle(width, height);
	}
}

// 使用工厂创建对象
const factory = new ShapeFactory();
const circle = factory.createCircle(5);
const rectangle = factory.createRectangle(4, 6);

console.log(`圆形面积：${circle.calculateArea()}`);
console.log(`矩形面积：${rectangle.calculateArea()}`);

// 在上述示例中，我们定义了一个 ShapeFactory 工厂类，它包含了两个工厂方法 createCircle 和 createRectangle，
// 分别用于创建圆形和矩形对象。这些工厂方法将创建对象的细节封装起来，客户端代码只需要调用工厂方法即可获得所需的对象，
// 而无需知道对象的创建细节。
// 工厂模式有助于降低代码的耦合度，提供了一种灵活的方式来创建对象，
// 使得在将来可以轻松地扩展和修改对象的创建逻辑。

// 最简单的工厂模式:
function productObject(name, price) {
	return {
		name,
		price
	};
}