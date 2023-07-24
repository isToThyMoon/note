# View

最基础的组件


比较冷门但挺有用的属性。

hitSlop 属性：object: {top: number, left: number, bottom: number, right: number}
这个属性可以扩大 View 的触控范围，在一些小按钮上用收益还是很大的。
定义触摸事件在距离视图多远以内时可以触发的。典型的接口规范建议触摸目标至少要 30-40 点/密度-独立像素。
例如，一个可触摸的视图有 20 单位高，那么设置hitSlop={{top: 10, bottom: 10, left: 0, right: 0}}则可触摸高度会扩展到 40 单位。
触摸范围不会扩展到父视图之外，另外如果触摸到两个重叠的视图，Z-index 高的元素会优先。


pointerEvents 属性：用于控制当前视图是否可以作为触控事件的目标。
用于控制当前视图是否可以作为触控事件的目标。
这个属性类似 CSS 的 pointer-events 属性，可以控制 View 对 touch 事件的响应
auto：视图可以作为触控事件的目标。
none：视图不能作为触控事件的目标。
box-none：视图自身不能作为触控事件的目标，但其子视图可以。类似于你在 CSS 中这样设置:
```
.box-none {
     pointer-events: none;
}
.box-none * {
     pointer-events: all;
}
```

'box-only':视图自身可以作为触控事件的目标，但其子视图不能。类似于你在 CSS 中这样设置:
.box-only {
     pointer-events: all;
}
.box-only * {
     pointer-events: none;
}