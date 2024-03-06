---
title: immutableJs
categories:
  - 01.开发学习笔记 markdown
  - 08.前端框架
  - 04.react生态
tags:
  - react项目
date:
---

每次修改一个 immutable 对象时都会创建一个新的不可变的对象，在新的对象上操作并不会影响到原对象的数据

# 为什么比deepCopy快
immutable 实现的原理是持久化数据结构，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，immutable 使用了结构共享，即如果对象树中一个节点发生改变，只修改这个节点和受它影响的父节点，其它节点进行共享

# 常用结构

##Map 用于包装对象

set修改单项的值。

```
import { Map } from 'immutable'

const map1 = Map({a: 1, b:2})

const map2 = map1.set('b', 20)
map1.get('b') // 2
map2.get('b') // 20
```

## List 用于包装数组

```
import { List } from 'immutable'

cosnt list1 = List([1, 2])
cosnt list2 = list1.push(3) // List [1, 2, 3]
```

## merge 对象合并 、concat 数组连接

```
import { Map, List } from 'immutable'

const map1 = Map({a: 1, b: 2})
const map2 = map1.merge({b: 3, c: 4}) // Map {a: 1, b: 3, c: 4}

const list1 = List([1, 2, 3])
cosnt list2 = list1.concat([4, 5]) // List [1, 2, 3, 4, 5]
```

## fromJS 将普通数据格式转成 immutable 数据格式（数组、对象都可以转）

修改数组中的某个值，可以使用 updataIn() 方法往内层修改
修改对象中的每个值，可以使用 setIn() 方法往内层修改

```
import { fromJS } from 'immutable'

const immutabelObj1 = fromJS({a: {b: [1, 2]}}) // Map {a: Map {b: List [1, 2]}}
// 修改对象中的值
const immutabelObj2 = immutabelObj1.setIn(['a', 'b', 0], 11) 
// Map {a: Map {b: List [11, 2]}}

const immutabelList1 = fromJS([{name: 'abc', data: [1, 2]}])
// List [Map {name: 'abc', data: List [1, 2]}]
// 修改数组中的值
const immutabelList12 = immutabelList1.updataIn([0, 'data'], data => {
    data.push(3)
})
// List [Map {name: 'abc', data: List [1, 2, 3]}]
```

## toJS 将 immutable 数据格式转成普通数据格式

```
import { fromJS } from 'immutable'

const immutableData1 = fromJS({a: 1, b: 2})
const immutableData2 = immutableData1.get('a', 11) // Map {a: 11, b: 2}

// 转成 普通对象
const data = immutableData2.toJS() // {a: 11, b: 2}
```