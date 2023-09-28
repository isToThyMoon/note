
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
 
 
 # dom节点输出为字符串
 `document.querySelector(selector).outerHTML;`

或者取父节点的innerHTML属性：
```js
let tmpNode = document.createElement('div');
tmpNode.appendChild(node) ;
let str = tmpNode.innerHTML;
```

 # 封装一些常见dom操作
 
```javascript

var e = function(selector) {
    return document.querySelector(selector)
}

// element.insertAdjacentHTML(position, text);
// element：要插入内容的目标元素。
// position：表示插入位置的字符串，可以是以下四个值之一：
// "beforebegin"：在元素前插入。
// "afterbegin"：在元素内部的开始位置插入。
// "beforeend"：在元素内部的结束位置插入。
// "afterend"：在元素后插入。 
// text：要插入的 HTML 字符串。'<p>Before Begin</p>'
var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    return element.querySelector(selector)
}

```