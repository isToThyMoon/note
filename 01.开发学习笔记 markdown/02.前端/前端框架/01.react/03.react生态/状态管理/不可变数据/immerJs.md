# 
immerJs 用mutable的方式处理state，最终的数据更新是immutable式的，而且没有多余的方言（自定义api）。原理是采用proxy的方式搜集用户的mutable操作，在对原state更新时进行结构复用，返回的状态是一个新引用地址，但内部数据不断复用原有数据的结构，所以性能毫无问题。

`npm i immer use-immer`
要注意的是如果想要得到额外的支持，还需要调用一些引入API，同时打包结果也会变大

支持	调用
支持ES5	enableES5()
支持Map和Set数据结构	enableMapSet()
支持JSON Patch	enablePatches()
以上所有都想支持	enableAllPlugins()

```js
// 在应用的入口处
 import {enableMapSet} from "immer"
 ​
 enableMapSet()
 ​
 // ...稍后
 import produce from "immer"
```


# 基本使用规则
produce 用来生成 nextState 或 producer 的函数。

currentState 被操作对象的最初状态。

draftState 根据currentState生成的草稿(副本)，对draftState所做的任何修改都将被记录并用于生成nextState。在此过程中，currentState 将不受影响。

nextState 根据 draftState 生成的最终状态。

recipe 生产机器 用来操作 draftState 的函数。
recipe 没有返回值时：nextState 是根据 recipe 函数内的 draftState 生成的；
recipe 有返回值时：nextState 是根据 recipe 函数的返回值生成的；
recipe 函数内部的this指向 draftState ，也就是修改this与修改 recipe 的参数 draftState ，效果是一样的。（注意：此处的 recipe 函数不能是箭头函数，如果是箭头函数，this就无法指向 draftState 了。）


producer 通过 produce柯里化方式生成的生产函数，用来生产nextState，每次执行相同的操作。

## 第一种使用方式 直接produce生成nextState
`produce(currentState, recipe: (draftState) => void | draftState, ?PatchListener): nextState`

Immer 还在内部做了一件很巧妙的事情，那就是通过 produce 生成的 nextState 是被冻结（freeze）的，（Immer 内部使用Object.freeze方法，只冻结 nextState 跟 currentState 相比修改的部分），这样，当直接修改 nextState 时，将会报错。这使得 nextState 成为了真正的不可变数据。

## 第二种 苛里化 高阶函数 先生成producer函数 再producer(currentState)生成nextState
`produce(recipe: (draftState) => void | draftState, ?PatchListener)(currentState): nextState`

```js
let producer = produce((draft) => {
  draft.x = 2
});
let nextState = producer(currentState);
```


## patch功能
实现时空旅行功能。
使用patch可以方便的进行代码的调整和跟踪,追踪recipe 内的做的每次修改。
patchListener内部对数据操作做了记录，并分别存储为正向操作记录和反向操作记录，供我们使用。

```
import produce, { applyPatches } from "immer"

interface Patch {
  op: "replace" | "remove" | "add" // 一次更改的动作类型
  path: (string | number)[] // 此属性指从树根到被更改树杈的路径
  value?: any // op为 replace、add 时，才有此属性，表示新的赋值
}

produce(
  currentState, 
  recipe,
  // 通过 patchListener 函数，暴露正向和反向的补丁数组
  patchListener: (patches: Patch[], inversePatches: Patch[]) => void
)

applyPatches(currentState, changes: (patches | inversePatches)[]): nextState
```


demo：

```ts
import produce, { applyPatches } from "immer"

let state = {
  x: 1
}

let replaces = [];
let inverseReplaces = [];

state = produce(
  state,
  draft => {
    draft.x = 2;
    draft.y = 2;
  },
  (patches, inversePatches) => { // 只运行一次 每次都记录的话每次的produce修改都要监听
    replaces = patches.filter(patch => patch.op === 'replace');
    inverseReplaces = inversePatches.filter(patch => patch.op === 'replace');
  }
)

state = produce(state, draft => {
  draft.x = 3;
})
console.log('state1', state); // { x: 3, y: 2 }

state = applyPatches(state, replaces);
console.log('state2', state); // { x: 2, y: 2 }

state = produce(state, draft => {
  draft.x = 4;
})
console.log('state3', state); // { x: 4, y: 2 }

state = applyPatches(state, inverseReplaces);
console.log('state4', state); // { x: 1, y: 2 }

```

patches数据如下：

```ts
[
  {
    op: "replace",
    path: ["x"],
    value: 2
  },
  {
    op: "add",
    path: ["y"],
    value: 2
  },
]
```
inversePatches数据如下：

```ts
[
  {
    op: "replace",
    path: ["x"],
    value: 1
  },
  {
    op: "remove",
    path: ["y"],
  },
]
```

patchListener内部对数据操作做了记录，并分别存储为正向操作记录和反向操作记录，供我们使用。


# react中使用immer

在Hooks中，我们还可以使用 use-immer来替代你的useState。

```ts
import React from "react";
import { useImmer } from "use-immer";


export default function () {
  const [person, setPerson] = useImmer({
    name: "Sally",
    salary: '3000'
  });

  function setName(name) {
    setPerson(draft => {
      draft.name = name;
    });
  }

  function becomeRicher() {
    setPerson(draft => {
      draft.salary += '$￥';
    });
  }

  return (
    <div className="App">
      <h1>
        {person.name} ({person.salary})
      </h1>
      <input
        onChange={e => {
          setName(e.target.value);
        }}
        value={person.name}
      />
      <br />
      <button onClick={becomeRicher}>变富</button>
    </div>
  );
}
```

useImmer的用法和useState十分相似，在保持住了简洁性的同时还具备了immutable的数据结构，十分便捷。

use-immer对useReducer进行了加强封装，同样也几乎没什么学习成本:

```
import React from "react";
import { useImmerReducer } from "use-immer";

const initialState = { salary: 0 };

function reducer(draft, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "increment":
      return void draft.salary++;
    case "decrement":
      return void draft.salary--;
  }
}

export default function () {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return (
    <>
      期待工资: {state.salary}K
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
    </>
  );
}
```