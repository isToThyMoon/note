```js
const useCbState = (initState) => {
    const [state, setState] = useState(initState);
    const didUpdate = useRef();
    const setCbState = (state, cb) => {
        setState(prev => {
            didUpdate.current = cb;
            return typeof state === 'function' ? state(prev) : state;
        });
    };
    useEffect(() => {
        if (didUpdate.current) {
            didUpdate.current(state);
        }
    });
    return [state, setCbState];
};

export default useCbState;
```