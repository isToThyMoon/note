# 

示例：
```
import { useRef } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'

export const useScroll = () => {

  const startOffsetY = useRef<number>()
  const endOffsetY = useRef<number>()

  // 开始拖动时调用
  const onScrollBeginDrag = (event:NativeSyntheticEvent<NativeScrollEvent>)=>{
    const offsetY = event.nativeEvent.contentOffset.y;

    startOffsetY.current = offsetY
    console.log('滑动开始值', offsetY)
  }
  // 拖动时不断调用，调用频率最多每帧一次，通过scrollEventThrottle设置调用间隔，单位ms
  // 设置0-16基本没什么区别
  const onScroll =(event:NativeSyntheticEvent<NativeScrollEvent>)=>{
    const offsetY = event.nativeEvent.contentOffset.y;

    // startOffsetY.current = offsetY
    console.log('滑动中间不断触发offsetY值', offsetY)
  }
  // 结束拖动时调用
  const onScrollEndDrag = (event:NativeSyntheticEvent<NativeScrollEvent>)=>{
    const offsetY = event.nativeEvent.contentOffset.y;

    endOffsetY.current = offsetY
    console.log('滑动结束值', offsetY)
  }


  return {

    onScrollBeginDrag,
    onScroll,
    onScrollEndDrag,

  }
}

...

<ScrollView
    // contentInsetAdjustmentBehavior="automatic"
    style={backgroundStyle}
    // 如果当前界面有软键盘，那么点击 scrollview 后是否收起键盘
    // handled：当点击事件被子组件捕获时，键盘不会自动收起。这样切换 TextInput 时键盘可以保持状态。
    // 多数带有 TextInput 的情况下你应该选择此项
    keyboardShouldPersistTaps="handled”
    // 在滚动的过程中，每帧最多调用一次此onScroll回调函数。调用的频率可以用scrollEventThrottle属性来控制。
    scrollEventThrottle={16}
    // This property specifies how the safe area insets are used to modify the content area of the scroll view.
    // Available on iOS 11 and later.
    contentInsetAdjustmentBehavior='never'
    // 内边距，显示内容范围相对滚动视图边缘的坐标。设置显示区域的上、左、下、右相对于UIScrollView的偏移
    // 比如设置top为-100，原本能正常显示的滚动内容区域顶部就有100长度的部分超出了显示区域，隐藏到顶部
    contentInset={{top: 0, left: 30, bottom: 100, right: 30}}
    onScroll={onScroll}
    // 滚动拖动视图开始和结束（手指拉动开始滚动和离开屏幕）
    onScrollBeginDrag={onScrollBeginDrag}
    onScrollEndDrag={onScrollEndDrag}
    // 滚动视图动画开始和结束
    // onMomentumScrollBegin={onMomentumScrollBegin}
    // onMomentumScrollEnd={onMomentumScrollEnd}
    // 将scrollview子元素列入数组，设置哪些元素在滚动时固定在ScrollView容器顶端
    stickyHeaderIndices={[0]}
    // stickyHeaderHiddenOnScroll为true时，向上滚动时设置了吸顶的元素依然隐藏，只有在向下滚动时才显示固定顶端的吸顶
    stickyHeaderHiddenOnScroll
    // 当值为 true 时，如果内容范围比滚动视图本身大，在到达内容末尾的时候，可以弹性地拉动一截。
    // 如果为 false，尾部的所有弹性都会被禁用，即使alwaysBounce属性为 true。默认值为 true。
    bounces
    
    
>
</ScrollView>
```

# onScroll

onScroll:(event)=>void
event类型:
```
{
  nativeEvent: {
    contentInset: {bottom, left, right, top}, //内容的内边距。这通常是在滚动视图的边缘留出空白的一种方式 可以通过scrollview的contentInset属性设置
    contentOffset: {x, y}, //包含当前内容偏移量的x和y值
    contentSize: {height, width},//包含滚动内容的总宽度和总高度，这是内容区域到宽高
    layoutMeasurement: {height, width},//包含滚动视图的宽度和高度，这是可视区域的宽高
    zoomScale
  }
}
```

# 滚动视图 固定头部
StickyHeaderComponent 文档暂无 就不要使用

A React Component that will be used to render sticky headers, should be used together with stickyHeaderIndices. You may need to set this component if your sticky header uses custom transforms, for example, when you want your list to have an animated and hidable header. If component have not been provided, the default ScrollViewStickyHeader component will be used.

# 其他属性
automaticallyAdjustContentInsets 属性：
有时候 iOS 滚动列表上会出现莫名其妙的空白区域，这个是 iOS Native 层实现的，RN 具体的触发时机我没有做详细的测试，但基本上把这个属性关掉就可以规避了。


# ios 安卓的一些不同

alwaysBounceVertical: true（default）
当值为true时，垂直方向即使内容比滚动视图本身还要小，也可以弹性地拉动一截，默认为true，除非 `horizontal={true}` 时该值为 false

bounces: true（default）
当值为 true 时，如果内容范围比滚动视图本身大，在到达内容末尾的时候，可以弹性地拉动一截。如果为 false，尾部的所有弹性都会被禁用，即使alwaysBounce属性为 true。默认值为 true



运满满司机端货主端app开发，微前端h5业务开发，快速迭代引流和营销需求，react native重构部分发货页，优化交互体验和性能。

维护开发专线帮uniapp小程序

零担专线运营后台、报价平台后台管理系统等B端SPA系统开发与业务流程重构，redux toolkit重构部分数据流，优化业务逻辑，重构部分图表table组件，提高加载性能。


前端为主体的需求，作为业务PM评审和管理任务进程 分割任务，及时跟进进度，代码质量review。