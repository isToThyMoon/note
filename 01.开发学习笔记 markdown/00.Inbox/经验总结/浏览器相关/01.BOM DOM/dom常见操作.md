
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