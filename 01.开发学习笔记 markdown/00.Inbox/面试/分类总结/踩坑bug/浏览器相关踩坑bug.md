# 浏览器问题
事件优先级 onmousedown > onblur > onclick 
所以onblur中设置隐藏元素，隐藏元素的click事件无法执行。 考虑setTimeout或者用onmousedown替代onclick事件。