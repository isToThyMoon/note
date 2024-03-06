# 

多行图片，img是以inline-block形式展示。
```html
<div style="border: 2px solid blue; padding: 3px">
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<img src="/Users/tothymoon/Downloads/IMG_0029.jpeg" />
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black; display: inline-block"
		>dadadadadadadadadadadadadadada</span
	>
	<span style="color: white; background-color: black">didi</span>
</div>
```
# 左右空白
图片左右的空隙是由于书写html代码时换行导致的，这在span标签中加上背景色也能看出来。
由于inline元素不换行特性，浏览器会将换行渲染成空格。导致图片中间空白。

# 上下空白
inline-block元素，对内表现block可以设置margin border padding盒模型
对外表现inline特性与其他inline元素同排列。
inline元素主要针对文字有font-size line-height vertical-align属性
图片在排列时默认vertical-align为baseline，如果图片和文字一行，且将文字设置背景色就可以看出，图片的底边和文字的baseline对其。这导致图片地步到该inline行的底部还有一段文字baseline到文字行底部的距离。
这是图片上下有空白的原因。

# 解决办法
0.最不推荐的，img标签不换行取消左右空白，图片vertical-align设置为bottom和文字行底部对齐取消上下空白。
1.父容器设置font-size为0，直接没有文字和文字行高、对齐这些概念了，图片上下左右紧密贴合。
2.设置图片float，脱离文档流，紧密贴合，也没有文字行造成的空白了。
3.修改图片为block元素，或者父容器为flex盒子，按需求布局。