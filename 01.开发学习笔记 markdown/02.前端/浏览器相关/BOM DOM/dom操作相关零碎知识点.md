
DOM 是一棵树（tree）
树上有 Node，Node 分为Element（元素或者标签）和 Text（文本）和特殊的element: Document（html），以及其他不重要的。
js中对象都继承自Object.prototype
而页面里的对象都继承自Node（也是一个构造函数罢了）


# Node.nodeType
Node.nodeType 表示的是该节点的类型。
用来区分不同类型的节点，比如 元素, 文本 和 注释。
常用：Node.ELEMENT_NODE === 1 表示一个元素节点
Node.DOCUMENT_NODE ===9 表示一个 Document 节点。

# Node.childNodes
子节点的类数组，可以通过Array.from()转化为基本数组操作。


# Window.getComputedStyle(Element)
方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有 CSS 属性的值。 私有的 CSS 属性值可以通过对象提供的 API 或通过简单地使用 CSS 属性名称进行索引来访问。
返回的style是一个实时的 CSSStyleDeclaration 对象，当元素的样式更改时，它会自动更新本身。

# 原型链
HTMLElement的prototype继承Element，Element的prototype继承 Node，Node的prototype继承EventTarget，EventTarget的prototype继承Object
 EventTartget的prototype里只有addEventListener dispatchEvent removeEventListener