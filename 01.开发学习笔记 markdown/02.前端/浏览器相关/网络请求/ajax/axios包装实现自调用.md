

```
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

// 把b的属性复制挂到a 如果有第三参数第三参数作为绑定的this指向
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}



function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    //fn:Axios.prototype.request; thisArg:Axios类实例
    return fn.apply(thisArg, args);
  };
};



function createInstance(defaultConfig) {
  //  对象 Axios类实例 defaults和interceptors属性，往上proto链 Axios的 prototype上有一堆request get post方法
  var context = new Axios(defaultConfig);
  // 让instance可以被直接调用
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  // 
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}
```