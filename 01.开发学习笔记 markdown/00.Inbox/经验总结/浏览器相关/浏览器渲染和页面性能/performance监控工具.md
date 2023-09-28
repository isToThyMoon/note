# dev tool
dev tool的performance面板查看页面性能，一种是record操作分析性能，一种是重载页面分析整个周期性能。
重点关注main下的调用栈。






# 编程化
Performance 面板的进一步细化与可编程化。拿到数据进行更自主的处理和分析。
performance 是一个全局对象。我们在控制台里输入 window.performance，就可一窥其全貌。

在 performance 的 timing 属性中，我们可以查看到如下的时间戳
```
connectEnd: 1693404444150
connectStart: 1693404443915
domComplete: 1693404446050
domContentLoadedEventEnd: 1693404445372
domContentLoadedEventStart: 1693404445372
domInteractive: 1693404445104
domLoading: 1693404444279
domainLookupEnd: 1693404443872
domainLookupStart: 1693404443872
fetchStart: 1693404443872
loadEventEnd: 1693404446053
loadEventStart: 1693404446050
navigationStart: 1693404443869
redirectEnd: 0
redirectStart: 0
requestStart: 1693404444150
responseEnd: 1693404444300
responseStart: 1693404444270
secureConnectionStart: 1693404443915
unloadEventEnd: 0
unloadEventStart: 0
```
![](https://mmbiz.qpic.cn/mmbiz_png/Jg1QHUkZvoDYcfETlDiblPV2weg4oInfz6UTg2icxUShj5snNaLc6zROskQ9dHvLBPrO7Vl4Nu4qViaCoib7aY0pIQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

通过求两个时间点之间的差值，我们可以得出某个过程花费的时间，举个🌰：
```
const timing = window.performance.timing
// DNS查询耗时
timing.domainLookupEnd - timing.domainLookupStart
  
// TCP连接耗时
timing.connectEnd - timing.connectStart
 
// 内容加载耗时
timing.responseEnd - timing.requestStart

···
```

除了这些常见的耗时情况，我们更应该去关注一些关键性能指标：firstbyte、fpt、tti、ready 和 load 时间。这些指标数据与真实的用户体验息息相关，是我们日常业务性能监测中不可或缺的一部分：
```
// firstbyte：首包时间	
timing.responseStart – timing.domainLookupStart	

// fpt：First Paint Time, 首次渲染时间 / 白屏时间
timing.responseEnd – timing.fetchStart

// tti：Time to Interact，首次可交互时间	
timing.domInteractive – timing.fetchStart

// ready：HTML 加载完成时间，即 DOM 就位的时间
timing.domContentLoaded – timing.fetchStart

// load：页面完全加载时间
timing.loadEventStart – timing.fetchStart
```




利用mark measure工具 在timing中监控函数开始时间和性能

```
window.performance.mark('node getBoundingClientReat start')
console.log("width", node.getBoundingClientRect().width);
window.performance.measure('node getBoundingClientReat end','node getBoundingClientReat start')

```