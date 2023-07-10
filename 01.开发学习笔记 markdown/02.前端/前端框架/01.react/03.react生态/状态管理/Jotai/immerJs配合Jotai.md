
先需要安装immer： `npm install immer`

# atomWithImmer
atomWithImmer creates a new atom similar to the regular atom [atom] with a different writeFunction. In this bundle, we don't have read-only atoms, because the point of these functions is the immer produce(mutability) function. The signature of writeFunction is (get, set, update: (draft: Draft<Value>) => void) => void.
atomWithImmer创建一个新的原子状态，和常规的atom函数创建的状态差不多，但是atomWithImmer使用的是由immer提供的不同的写函数。
所以atomWithImmer并没有只读的atom，内部使用了immer提供的produce函数（mutability）
`(get, set, update: (draft: Draft<Value>) => void) => void`

```js
import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai/immer'

const countAtom = atomWithImmer(0)

const Counter = () => {
  const [count] = useAtom(countAtom)
  return <div>count: {count}</div>
}

const Controls = () => {
  const [, setCount] = useAtom(countAtom)
  // setCount === update : (draft: Draft<Value>) => void
  const inc = () => setCount((c) => (c = c + 1))
  return <button onClick={inc}>+1</button>
}
```
更新函数setCount入参就是immer的更新函数 ` (draft) => void`

# withImmer
withImmer takes an atom and returns a derived atom, same as atomWithImmer it has a different writeFunction.
使用immer创建派生atom。

```js
import { useAtom, atom } from 'jotai'
import { withImmer } from 'jotai/immer'

const primitiveAtom = atom(0)
const countAtom = withImmer(primitiveAtom)

const Counter = () => {
  const [count] = useAtom(countAtom)
  return <div>count: {count}</div>
}

const Controls = () => {
  const [, setCount] = useAtom(countAtom)
  // setCount === update : (draft: Draft<Value>) => void
  const inc = () => setCount((c) => (c = c + 1))
  return <button onClick={inc}>+1</button>
}
```

# useImmerAtom
This hook takes an atom and replaces the atom's writeFunction with the new immer-like writeFunction like the previous helpers.

```js
import { useAtom } from 'jotai'
import { useImmerAtom } from 'jotai/immer'

const primitiveAtom = atom(0)

const Counter = () => {
  const [count] = useImmerAtom(primitiveAtom)
  return <div>count: {count}</div>
}

const Controls = () => {
  const [, setCount] = useImmerAtom(primitiveAtom)
  // setCount === update : (draft: Draft<Value>) => void
  const inc = () => setCount((c) => (c = c + 1))
  return <button onClick={inc}>+1</button>
}
```
It would be better if you don't use withImmer and atomWithImmer with useImmerAtom because they provide the immer-like writeFunction and we don't need to create a new one.

这个hook将常规atom转换为使用immer式写函数的atom，官方更推荐这种写法，因为无需创建新atom。

```js
import React from "react";
import { Provider, atom, useAtom } from "jotai";
import { useImmerAtom, withImmer, atomWithImmer } from "jotai/immer";

const numAtom = atom(0); // regular atom
const derivedNumAtomImmer = withImmer(numAtom); // derived immer atom from regular atom
const numImmerAtom = atomWithImmer(0); // original immer atom

const Add = () => {
  const [derivedNum, setDerivedNum] = useAtom(derivedNumAtomImmer);
  const [num, setNum] = useAtom(numImmerAtom);
  const [toImmerNum, setToImmerNum] = useImmerAtom(numAtom); // replace the regular write function with new write function(similar to produce in immer)
  /*
  3 ways to have immer:

    atomWithImmer => useAtom or useImmerAtom
          Performance -> useAtom > useImmerAtom
    withImmer => useAtom or useImmerAtom
          Performace -> useAtom > useImmerAtom
    atom => useImmerAtom
          Performance -> useAtom == useImmerAtom

  */
  return (
    <div>
      derived immer atom - number: {derivedNum}
      <button onClick={() => setDerivedNum((draft) => (draft = draft + 1))}>
        +
      </button>
      <br />
      original immer atom - number: {num}
      <button onClick={() => setNum((draft) => (draft = draft + 1))}>+</button>
      <br />
      derived immer atom(useImmerAtom): {toImmerNum}
      <button onClick={() => setToImmerNum((draft) => (draft = draft + 1))}>
        +
      </button>
    </div>
  );
};
const App = () => (
  <Provider>
    <Add />
  </Provider>
);

export default App;

```

derived immer atom值和useImmerAtom接管的值是同步更新的，因为它们都依赖那个最初始的`const numAtom = atom(0); // regular atom`；

日常开发不要有这样的同一来源不同实现，保持一种使用方式就行，否则不容易debug。