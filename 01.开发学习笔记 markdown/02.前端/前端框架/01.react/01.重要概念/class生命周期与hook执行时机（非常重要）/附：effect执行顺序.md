```js
/*
 * @Author: 王荣
 * @Date: 2022-08-23 20:10:25
 * @LastEditors: 王荣
 * @LastEditTime: 2022-09-06 02:08:40
 * @Description: 填写简介
 */
import classNames from "classnames";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface parentProps { }

function Child({ id }) {
  const [data, setData] = useState('请求中。。。');
  console.log('child id', id)
  useEffect(() => {
    console.log('childeffect', id)
  }, [id]);
  useLayoutEffect(() => {
    console.log('childlayouteffect', id)
  }, [id]);


  
  return <p>result: {data}</p>;
}

const Parent: React.FC<parentProps> = (props) => {
  const [id, setId] = useState(0);
  const idmemo = useMemo(() => {
    console.log('执行parent usememo')
    return id + 'memo'
  }, [id])
  const idCallback = useCallback(() => {
    return id + 'memo'
  }, [id])
  
  console.log('idCallback function')
  // console.log('idCallback function', idCallback)

  console.log('parent id', id)
  useEffect(() => {
    console.log('parenteffect', id)
    setId(20);
  }, []);

  useLayoutEffect(() => {
    console.log('parentlayoutffect', id)
    setId(10);
  }, []);

  // 传递 id 属性
  return <div>
    <Child id={id} />;
  </div>
  

};

export default Parent;

// 执行结果：

/* 首次渲染 父组件执行函数主体*/
    // 执行parent usememo
    // idCallback function
    // parent id 0
/* 父组件执行到return UI jsx构建fiber树 解析到子组件jsx自动转化加载创建子组件 执行子组件函数主体*/
    // child id 0
/* 子组件return jsx构建完毕，同步执行子组件useLayoutEffect逻辑 */
    // childlayouteffect 0
/* 子组件useLayoutEffect也完毕，说明子组件fiber树构建结束（本轮不会再修改）， 同步执行父组件useLayoutEffect逻辑  */
/* 父组件useLayoutEffect设置新状态 setId为10 */
    // parentlayoutffect 0
/*  父组件useLayoutEffect执行完毕 父组件fiber树构建结束 下面开始由子往父处理副作用 */
/* 执行子组件的effect 此时父组件layoutEffect里setId为10要在下一帧更新 所以 childeffect读到的仍是0 */
    // childeffect 0
/* 执行父组件的effect 此时父组件layoutEffect里setId为10要在下一帧更新 所以 parenteffect读到的仍是0 */
/* 并且父组件的effect设置新状态 setId(20) */
    // parenteffect 0
/* 父子effect都执行完毕，开始下一帧更新id为10（由父组件layoutEffect的setId为10触发）*/
    // 执行parent usememo
    // idCallback function
/* 此时父子读取到的这一帧id就是10了 */
    // parent id 10
    // child id 10
/* 父组件的两个effect只在首次渲染加载，而子组件的两个effect则是依赖传递来的id值 所以下面还会执行这两个effect */
/* 其实顺序应该还是子组件layoutEffect -> 子组件fiber树done -> 父组件layoutEffect -> 父组件fiber树done -> 子组件effect -> 父组件effect */
/* 取到的值是该帧的id为10 */
    // childlayouteffect 10
    // childeffect 10
/* 上一周期effect set状态结束 */
/* 执行下一周期 之前父组件的effect设置新状态 setId(20)的帧 */
    // 执行parent usememo
    // idCallback function
    /* 取到的值是该帧的id为20 */
    // parent id 20
    // child id 20
    // childlayouteffect 20
    // childeffect 20


/* 层级更深有孙子组件 执行逻辑同上 孙子组件的layouteffect早于子组件layouteffect 孙子组件的effect早于子组件的effect */ 
```