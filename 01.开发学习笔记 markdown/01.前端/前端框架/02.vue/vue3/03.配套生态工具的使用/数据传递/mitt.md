

# 数据总线模式
vue2x使用eventBus进行跨组件的通信，而vue3开始推荐使用mitt
足够小，不依赖vue实例，跨框架使用。

# 使用方式

1.全局总线
```js
import { createApp } from 'vue'
import App from "./App.vue"
import mitt from "mitt"

const app = createApp(App)
app.config.globalProperties.#myBus = mitt();

```

2.封装一个单独的事务总线bus文件，在需要的地方导入使用。
```js
import mitt from 'mitt'

export const emitter = mitt()
```

3.直接组件内导入使用。（不推荐 没看懂什么意思）



# mitt使用
其实 mitt 的用法和 EventEmitter 类似，通过 on 方法添加事件，off 方法移除，clear 清空所有。

```import mitt from 'mitt'

const emitter = mitt()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )

// listen to all events
emitter.on('*', (type, e) => console.log(type, e) )

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.all.clear()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```
需要注意的是，导入的 mitt 我们是通过函数调用的形式，不是 new 的方式。在移除事件的需要传入定义事件的名字和引用的函数。


# 核心原理
原理很简单，就是通过 map 的方法保存函数。

```js
export default function mitt(all) {
	all = all || new Map();

	return {
		all,

		on(type, handler) {
			const handlers = all.get(type);
			const added = handlers && handlers.push(handler);
			if (!added) {
				all.set(type, [handler]);
			}
		},

		off(type, handler) {
			const handlers = all.get(type);
			if (handlers) {
				handlers.splice(handlers.indexOf(handler) >>> 0, 1);
			}
		},

		emit(type, evt) {
			((all.get(type) || [])).slice().map((handler) => { handler(evt); });
			((all.get('*') || [])).slice().map((handler) => { handler(type, evt); });
		}
	};
}

```