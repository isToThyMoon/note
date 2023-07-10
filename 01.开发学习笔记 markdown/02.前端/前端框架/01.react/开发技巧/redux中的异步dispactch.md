//在mapstateToProps的处理函数中：

dispatchInputValue(searchInputValue:string, callback: Function | undefined){
    //使用redux-thunk后dispatch参数可以是一个函数 在这个函数中处理发送异步逻辑。
    dispatch(actionCreators.handleChangeSearchInputValue(searchInputValue)).then(()=>{
        // console.log('changeInput回调',this)
        callback && callback();
    });
},

handleChangeSearchInputValue中 在dispatch后加一句
return Promise.resolve()