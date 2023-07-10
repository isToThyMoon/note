# 

利用mark measure工具 在timing中监控函数开始时间和性能

```
window.performance.mark('node getBoundingClientReat start')
console.log("width", node.getBoundingClientRect().width);
window.performance.measure('node getBoundingClientReat end','node getBoundingClientReat start')

```