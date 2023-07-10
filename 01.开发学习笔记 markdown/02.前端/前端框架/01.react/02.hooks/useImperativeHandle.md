# useImperativeHandle 可以让我们在父组件调用到子组件暴露出来的属性/方法。

useImperativeHandle(ref, createHandle, [deps])
    ref需要被赋值的ref对象。
    createHandle：createHandle函数的返回值作为ref.current的值。
    [deps]依赖数组，依赖发生变化会重新执行createHandle函数。
    
什么时候执行createHandle函数？
测试发现和useLayoutEffect执行时机一致。


## 应用场景
目前项目已经有多处使用场景了，主要是解决父组件获取子组件的数据或者调用子组件的里声明的函数。

```js
const Example = () => {
  const inputEl = useRef();
  useEffect(() => {
    console.log(inputEl.current.someValue);
    // test
  }, []);

  return (
    <>
      <Child ref={inputEl} />
      <button onClick={() => inputEl.current.setValues((val) => val + 1)}>
        累加子组件的value
      </button>
    </>
  );
};
```

```js
const Child = forwardRef((props, ref) => {
  const inputRef = useRef();
  const [value, setValue] = useState(0);
  useImperativeHandle(ref, () => ({
    setValue,
    someValue: "test"
  }));
  return (
    <>
      <div>child-value:{value}</div>
      <input ref={inputRef} />
    </>
  );
});
```
总结：类似于vue在组件上用 ref 标志，然后 this.$refs.xxx 来操作dom或者调用子组件值/方法，只是react把它“用两个钩子来表示”。



有个其他的用法：
子组件某个状态依赖父组件某个状态的修改，无论用useEffect和useMemo都导致子组件渲染两次。
通过直接在父组件中修改子组件状态的方式可以避免这种重复渲染。
虽然大部分情况下这种多次渲染其实是无需关注的。
```
const B = React.forwardRef((props: any, ref) => {
  const [state, setstate] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      update: (n: any) => {
        setstate(n);
      },
    }),
    []
  );
  console.log("child", state, props.count);

  return <div>{state}</div>;
});

const App = function () {
  const [state, setstate] = useState(0);
  const ref = useRef(null);

  return (
    <div className="App">
      <button
        onClick={() => {
          setstate(state + 1);
          (ref.current as any).update(state + 1);
        }}
      >
        click
      </button>
      <B count={state} ref={ref} />
    </div>
  );
};

export default App;
```