# 设备像素（device pixels）：物理像素
物理像素，显示器的最小物理单位。
这里的一个像素是一个显色的元器件，没有标准的宽高，只是用于显示色彩的一个 “点” 。红绿灯中由一个个点组成红绿图标和文字指示，那一个个点就是它的“物理像素”。
关联的物理分辨率，如macbook pro16寸，物理分辨率 3072 x 1920 (226 ppi)，它可以开设备缩放到1536 x 960，让屏幕文字图标等视觉上放大一倍，但物理限制了最大的缩放分辨率就是3072 x 1920。

一般pc端27寸的2k屏幕分辨率也就是2560x1440，iphonexsmax的物理像素分辨率是1242×2688，基本就是一块6.5寸的2k屏了，目前手机的物理像素已经非常高了，可以想象完全按照物理分辨率来显示，字体是小到没法看清了。如何解决这个问题除了设备独立像素就要参考移动端响应式布局的知识了。

提前说下xsmax的逻辑像素也就是设备独立像素默认是414×896，即3x3个物理像素渲染一个设备独立像素，这就是业内所说的3倍屏。

# 设备独立像素（device independent pixels）：独立于设备物理限制的像素 逻辑像素。
当前缩放比率下的逻辑像素，比如缩放200%，1device independent pixels = 4device pixels。

所谓逻辑像素很好理解，16寸的笔记本宽高是物理层面固定的，长x宽y，物理分辨率是由最小显色元器件3072 x 1920组成，相同物理宽高下，能容纳更多的显色元器件，画面就越细腻，颜色边缘过渡就越顺滑。

而对于字体、图标出现一个问题，代码设置字体图标宽高为a pixel，这里的pixel是逻辑分辨率，屏幕物理宽高固定xy情况下，物理分辨率越高，显色元器件越小，数量越多越密集，在逻辑分辨率等于物理分辨率的情况下，字体、图标会小得看不清。

为了高物理分辨率下浏览体验，win和mac系统都提供了缩放功能，如macbook pro16寸，物理分辨率 3072 x 1920 (226 ppi)，它可以开设备缩放到1536 x 960，让屏幕文字图标等视觉上放大一倍，但物理限制了最大的缩放分辨率就是3072 x 1920。此时逻辑分辨率是物理分辨率的1/2，但是device independent pixels是device pixels的2倍，原本的两像素组成一个像素。

浏览器通过 window.screen.width / window.screen.height 查看到的就是设备独立像素组成的逻辑分辨率。如我们所说的 iPhone X 逻辑分辨率 375 × 812 。chrome 检查元素模拟调试手机设备时显示如 375x667 和 320x480 都是设备独立像素下的逻辑分辨率。

以手机屏幕为例，iPhone X 物理分辨率为 1125 × 2436，是指屏幕横向能显示 1125 个物理像素点，纵向能显示 2436 个物理像素点。 逻辑分辨率 375 × 812，其实放大了三倍字体，这也是为了能正常看清字体。

PPI（pic per inch）：每英寸的物理像素数。以尺寸为 5.8 英寸（屏幕对角线长度）、分辨率为 1125 × 2436 的 iPhone X 为例， ppi = Math.sqrt(1125*1125 + 2436*2436) / 5.8，值为 463 ppi。

# CSS 像素：css pixels
浏览器使用的单位，这也是开发者直接控制的尺寸度量，用来精确度量网页上的内容，如：div { width: 100px; }。在一般情况下(页面缩放比为 100%)，1 个 CSS 像素等于 1 个设备独立像素。
devicePixelRatio：设备物理像素和设备独立像素的比例。window.devicePixelRatio = 物理像素 / 设备独立像素。
其实devicePixelRatio与系统缩放导致的设备独立像素和浏览器内部的浏览器缩放都有关系。可以简单理解为缩放比率。
16寸物理分辨率 3072 x 1920 (226 ppi)，它可以开设备缩放到1536 x 960，此时devicePixelRatio为2，代表放大两倍，如果浏览器再开200%缩放，此时devicePixelRatio就是4了。

# 读取逻辑分辨率和页面宽高
window.screen.width / window.screen.height 读取到的始终是屏幕的逻辑分辨率，不管浏览器尺寸如何拖动改变，即使是分屏浏览，在不同屏幕下console出来的window.screen.width都是该屏幕当前的逻辑分辨率。

window.innerWidth; window.innerHeight才是包含滚动条的浏览器内部可视窗口的宽高。但注意也是在逻辑分辨率下随着浏览器拉动改变大小获得的。

Document.documentElement 是一个会返回文档对象（ document ）的根元素的只读属性（如HTML 文档的 <html> 元素）。一般就是html元素。

在设置html的width和height都为100%情况下：
document.documentElement.clientWidth; document.documentElement.clientHeight 不包含滚动条的视窗宽高。也不包含边框（如果有 虽然一般没人会给html元素加border）。
document.documentElement.offsetWidth; document.documentElement.offsetHight 获取html元素尺寸（包含滚动条）的宽高。



# 移动端的尺寸

如react native中设置宽高无需携带单位，默认单位是dp。

先了解几个移动端的设备屏幕概念：
1.screen density(屏幕密度)：屏幕物理区域中的像素量(the quantity of pixels)；通常称为 dpi（每英寸点数）dpi (dots per inch).

2.Resolution(分辨率)：屏幕上物理像素(physical pixels)的总数。

3.Density-independent pixel(密度无关像素) (dp)：

官方网站定义：
A dp is equal to one physical pixel on a screen with a density of 160.To calculate dp:
dp = (width in pixels * 160) /  screen density

在定义UI layout时使用的一种虚拟像素单元(virtual pixel unit)，它可以自由地表示布局维度(layout dimensions)或位置(position)而不用去关心屏幕密度(ensure proper display of your UI on screens with different densities).
dp等于160 dpi屏幕上的一个物理像素(physical pixel)–“medium” density screen. 系统会在运行时根据具体的屏幕密度对dp的大小进行缩放处理，该过程用户不可见。

很明显， dp 与 物理px 有一个关于 (160/screen density) 的正相关的关系：

1dp = 1物理px （screen density = 160dpi）
1dp = 2物理px （screen density = 320dpi）
1dp = 3物理px （screen density = 480dpi）

同理在 H5 页面，以下等式是成立的。
1 (css)px = 1设备独立像素 = 设备实际像素数 * （1设备独立像素 / 设备实际像素数）

1 (css)px = 1物理px （device pixel ratio = 1）
1 (css)px = 2物理px （device pixel ratio = 2）
1 (css)px = 3物理px （device pixel ratio = 3）

总结：

其实就是在160dpi下1dp等于1物理像素
320dpi下，1dp等于2物理像素

加大dpi等于web端加大物理分辨率，画面更细腻，需要更多物理像素来显示单个逻辑像素，这样用户在高dpi屏幕看到的画面尺寸不会特别小。
dp基本等于web里的逻辑像素。

而实际上 (160/screen density) 就是 1/pixelRatio，也就是就是写 H5 页面时，像素比率 window.devicePixelRatio。

也就是说，1dp = 1(css)px。