---
title: 20.web安全
categories:
  - 01.开发学习笔记 markdown
  - 07.前端
  - 00.网络相关
---

在解释常见content-Type response-Type时，提到如何设置content-Type：

直接设置在request-header参数中可以设置：
无限制
xhr.send(data)中的data数据类型会影响请求头部content-type的默认值
如果使用xhr.setRequestHeader()手动设置了content-type的值，默认值会被覆盖。
```js
var str = 'DOMString等同于js中的普通字符串'；
var xhr = new XMLHttpRequest();
xhr.open('post', '/server', true);
xhr.onload=function(e){};
//xhr.send(data)的参数str是DOMString类型 content-type会默认为text/plain;charset=UTF-8;
xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
xhr.send(str)
```

那么`xhr.send(data)`中data可以是什么类型？
DOMString 
就是js中的String

Document 
可以解析为XML的数据

FormData对象
利用js键值对模拟一系列表单控件 类似jq的serialize() 表单序列化，以query字符串形式获得类表单数据给ajax请求 浏览器原生支持二进制文件 上传数据非常方便

blob 

arrayBuffer

```
XMLHttpRequest.send(DOMString? data);
XMLHttpRequest.send(Document data);
XMLHttpRequest.send(FormData data);
XMLHttpRequest.send(Blob data);
XMLHttpRequest.send(ArrayBuffer data);
XMLHttpRequest.send(ArrayBufferView data);
```

-------

![file](https://github.com/ayrikiya/pic-store/blob/main/note/IMG_1148.jpeg?raw=true)

# Blob （binary large object）二进制大数据对象 
计算机界通用术语之一，非js独有，mysql等数据库中就有一种blob类型专门存放二进制数据。
在实际应用中blob更多是图片以二进制形式上传与下载，但其实blob可以实现几乎任何文件等二进制传输。
如下载一个服务器图片
```js
var xhr =new XMLHttpRequest();
xhr.open('get', 'xx.jpg', true);
xhr.responseType = 'blob';
xhr.onload = function(){
    if(this.status==200){
    var blob = this.response; //请求的返回就是blob对象
    }
}
```
blob对象有两个只读属性：
size 该对象的大小 字节为单位
type 一个字符串 表明该blob对象包含数据的MIME类型 如'image/jpeg'

## Blob 创建
可以使用 Blob() 构造函数来创建一个 Blob：

new Blob(array, options);
其有两个参数：

array：由 ArrayBuffer、ArrayBufferView、Blob、DOMString 等对象构成的，将会被放进 Blob；
options：可选的 BlobPropertyBag 字典，它可能会指定如下两个属性
    type：默认值为 ""，表示将会被放入到 blob 中的数组内容的 MIME 类型。
    endings：默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入，不常用。
    
常见的 MIME 类型如下：
text/plain 纯文本文档
text/html HTML文档
text/javascript js文件
text/css css文件
application/json 
application/pdf
application/xml
image/jpeg
image/png
image/gif
image/svg+xml
audio/mpeg mp3文件
video/mpeg mp4文件

例如：
```js
const blob = new Blob(["Hello World"], {type: "text/plain"});
console.log(blob.size); // 11
console.log(blob.type); // "text/plain"
// 注意，字符串"Hello World"是 UTF-8 编码的，因此它的每个字符占用 1 个字节。
```

# Blob 分片
除了使用Blob()构造函数来创建blob 对象之外，还可以从 blob 对象中创建blob，也就是将 blob 对象切片。Blob 对象内置了 slice() 方法用来将 blob 对象分片，其语法如下：
`const blob = instanceOfBlob.slice([start [, end [, contentType]]]};`

其有三个参数：
start：设置切片的起点，即切片开始位置。默认值为 0，这意味着切片应该从第一个字节开始；
end：设置切片的结束点，会对该位置之前的数据进行切片。默认值为blob.size；
contentType：设置新 blob 的 MIME 类型。如果省略 type，则默认为 blob 的原始值。

下面来看例子：

```js
const iframe = document.getElementsByTagName("iframe")[0];
const blob = new Blob(["Hello World"], {type: "text/plain"});
const subBlob = blob.slice(0, 5);
iframe.src = URL.createObjectURL(subBlob);
```

此时页面会显示"Hello"。


# File 
文件对象 继承blob拓展出来。文件（File）接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容。实际上，File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中。Blob 的属性和方法都可以用于 File 对象。

在 JavaScript 中，主要有两种方法来获取 File 对象：
1. file控件（input type='file'）选择文件后返回的 FileList 对象；`<input type="file" id="fileInput" multiple="multiple">` ：指定 input 可以同时上传多个文件。当点击上传文件时，控制台就会输出一个 FileList 数组，这个数组的每个元素都是一个 File 对象，一个上传的文件就对应一个 File 对象
2. 文件拖放操作生成的 DataTransfer 对象；

每个 File 对象都包含文件的一些属性，这些属性都继承自 Blob 对象：
lastModified：引用文件最后修改日期，为自1970年1月1日0:00以来的毫秒数；
lastModifiedDate：引用文件的最后修改日期；
name：引用文件的文件名；
size：引用文件的文件大小；
type：文件的媒体类型（MIME）；
webkitRelativePath：文件的路径或 URL。

属性方法继承blob，但有些自己的属性方法。通常推荐使用blob属性方法。
File.name
Blob.size
Blob.type

通常，我们在上传文件时，可以通过对比 size 属性来限制文件大小，通过对比 type 来限制上传文件的格式等。

另一种获取 File 对象的方式就是拖放 API，这个 API 很简单，就是将浏览器之外的文件拖到浏览器窗口中，并将它放在一个成为拖放区域的特殊区域中。拖放区域用于响应放置操作并从放置的项目中提取信息。这些是通过 ondrop 和 ondragover 两个 API 实现的。

下面来看一个简单的例子，

```js
// 首先定义一个拖放区域：
<div id="drop-zone"></div>

// 然后给这个元素添加 ondragover 和 ondrop 事件处理程序：

const dropZone = document.getElementById("drop-zone");

dropZone.ondragover = (e) => {
    e.preventDefault();
}

dropZone.ondrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log(files)
}
```
注意：这里给两个 API 都添加了 e.preventDefault()，用来阻止默认事件。它是非常重要的，可以用来阻止浏览器的一些默认行为，比如放置文件将显示在浏览器窗口中。

当拖放文件到拖放区域时，控制台就会输出一个 FileList 数组，该数组的每一个元素都是一个 File 对象。这个 FileList 数组是从事件参数的 dataTransfer 属性的 files 获取的。

可以看到，这里得到的 File 对象和通过 input 标签获得的 File 对象是完全一样的。

# fileReader对象 

FileReader 是一个异步 API，用于读取文件并提取其内容以供进一步使用。FileReader 可以将 Blob 读取为不同的格式。

注意：FileReader 仅用于以安全的方式从用户（远程）系统读取文件内容，不能用于从文件系统中按路径名简单地读取文件。

## 使用fileReader
可以使用 FileReader 构造函数来创建一个 FileReader 对象：
`const reader = new FileReader();`
这个对象常用属性如下：
error：表示在读取文件时发生的错误；
result：文件内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。
readyState：表示FileReader状态的数字。取值如下：
常量名 值 描述
EMPTY 0 未加载任何数据
LOADING 1 数据正在被加载
DONE 2 已经完成全部读取请求

FileReader 对象提供了以下方法来加载文件：

readAsArrayBuffer()：读取指定 Blob 中的内容，完成之后，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象；
FileReader.readAsBinaryString()：读取指定 Blob 中的内容，完成之后，result 属性中将包含所读取文件的原始二进制数据；
FileReader.readAsDataURL()：读取指定 Blob 中的内容，完成之后，result 属性中将包含一个data: URL 格式的 Base64 字符串以表示所读取文件的内容。 （图片转成base64）
FileReader.readAsText()：读取指定 Blob 中的内容，完成之后，result 属性中将包含一个字符串以表示所读取的文件内容。
可以看到，上面这些方法都接受一个要读取的 blob 对象作为参数，读取完之后会将读取的结果放入对象的 result 属性中。

## 事件处理
FileReader 对象常用的事件如下：

abort：该事件在读取操作被中断时触发；
error：该事件在读取操作发生错误时触发；
load：该事件在读取操作完成时触发；
progress：该事件在读取 Blob 时触发。
当然，这些方法可以加上前置 on 后在HTML元素上使用，比如onload、onerror、onabort、onprogress。除此之外，由于FileReader对象继承自EventTarget，因此还可以使用 addEventListener() 监听上述事件。

下面来看一个简单的例子，
```
// 首先定义一个 input 输入框用于上传文件：
<input type="file" id="fileInput">
// 接下来定义 input 标签的 onchange 事件处理函数和FileReader对象的onload事件处理函数：

const fileInput = document.getElementById("fileInput");

const reader = new FileReader();

fileInput.onchange = (e) => {
    reader.readAsText(e.target.files[0]);
}

reader.onload = (e) => {
    console.log(e.target.result);
}
```
这里，首先创建了一个 FileReader 对象，当文件上传成功时，使用 readAsText() 方法读取 File 对象，当读取操作完成时打印读取结果。

使用上述例子读取文本文件时，就是比较正常的。如果读取二进制文件，比如png格式的图片，往往会产生乱码。

那该如何处理这种二进制数据呢？readAsDataURL() 是一个不错的选择，它可以将读取的文件的内容转换为 base64 数据的 URL 表示。这样，就可以直接将 URL 用在需要源链接的地方，比如 img 标签的 src 属性。

对于上述例子，将 readAsText 方法改为 readAsDataURL()：
```js
const fileInput = document.getElementById("fileInput");

const reader = new FileReader();

fileInput.onchange = (e) => {
    reader.readAsDataURL(e.target.files[0]);
}

reader.onload = (e) => {
    console.log(e.target.result);
}
```
这时，再次上传二进制图片时，就会在控制台打印一个 base64 编码的 URL。

下面来修改一下这个例子，将上传的图片通过以上方式显示在页面上：

```js
<input type="file" id="fileInput" />

<img id="preview" />

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const reader = new FileReader();

fileInput.onchange = (e) => {
  reader.readAsDataURL(e.target.files[0]);
};

reader.onload = (e) => {
  preview.src = e.target.result;
  console.log(e.target.result);
};

```
当上传大文件时，可以通过 progress 事件来监控文件的读取进度：

```js
const reader = new FileReader();

reader.onprogress = (e) => {
  if (e.loaded && e.total) {
    const percent = (event.loaded / event.total) * 100;
    console.log(`上传进度: ${Math.round(percent)} %`);
  }
});
```
progress 事件提供了两个属性：loaded（已读取量）和total（需读取总量）。




# ArrayBuffer
可以直接理解为 ArrayBuffer就是装着二进制数据的对象。
ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。ArrayBuffer 的内容不能直接操作，只能通过 DataView 对象或 TypedArrray 对象来访问。这些对象用于读取和写入缓冲区内容。

ArrayBuffer 本身就是一个黑盒，不能直接读写所存储的数据，需要借助类型化数组或DataView对象来解释缓冲区。（解释二进制数据）：
    TypedArray：用来生成内存的视图，通过9个构造函数，可以生成9种数据格式的视图。
    DataViews：用来生成内存的视图，可以自定义格式和字节序。
    
TypedArray 类型化数组
Typed Arrays是js中后出现的一个概念，专为访问原始的二进制数据而生。
本质上类型化数组和Arraybuffer一样，不过可读写。

TypedArray视图和 DataView视图的区别主要是字节序，前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。

那 ArrayBuffer 与 Blob 有啥区别呢？根据 ArrayBuffer 和 Blob 的特性，Blob 作为一个整体文件，适合用于传输；当需要对二进制数据进行操作时（比如要修改某一段数据时），就可以使用 ArrayBuffer。

blob可以append ArrayBuffer。更高一级。也就是ArrayBuffer可以生成blob对象。

ArrayBuffer存在的意义是作为数据源提前写入在内存中固定不变。当我们要处理这个ArrayBuffer中的二进制数据，例如分别8位 16位 32位转换，这个数据不会变化，三种转换共享数据。

# Object URL
Object URL（MDN定义名称）又称Blob URL（W3C定义名称），是HTML5中的新标准。它是一个用来表示File Object 或Blob Object 的URL。在网页中，我们可能会看到过这种形式的 Blob URL：
```
<video src="blob:https://www.youtobe.com/fsdfadsfasdfasfsd"></video>
```
其实 Blob URL/Object URL 是一种伪协议，允许将 Blob 和 File 对象用作图像、二进制数据下载链接等的 URL 源。

对于 Blob/File 对象，可以使用 URL构造函数的 createObjectURL() 方法创建将给出的对象的 URL。这个 URL 对象表示指定的 File 对象或 Blob 对象。我们可以在<img>、<script> 标签中或者 <a> 和 <link> 标签的 href 属性中使用这个 URL。

来看一个简单的例子，首先定义一个文件上传的 input 和一个 图片预览的 img：
```js
<input type="file" id="fileInput" />
<img id="preview" />
```
再来使用 URL.createObjectURL() 将File 对象转化为一个 URL：
```js
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

fileInput.onchange = (e) => {
  preview.src = URL.createObjectURL(e.target.files[0]);
  console.log(preview.src);
};
```
可以看到，上传的图片转化成了一个 URL，并显示在了屏幕上。

那这个 API 有什么意义呢？可以将Blob/File对象转化为URL，通过这个URL 就可以实现文件下载或者图片显示等。

当我们使用createObjectURL()方法创建一个data URL 时，就需要使用revokeObjectURL()方法从内存中清除它来释放内存。虽然浏览器会在文档卸载时自动释放 Data URL，但为了提高性能，我们应该使用createObjectURL()来手动释放它。revokeObjectURL()方法接受一个Data URL 作为其参数，返回undefined。下面来看一个例子：
```js
const objUrl = URL.createObjectURL(new File([""], "filename"));
console.log(objUrl);
URL.revokeObjectURL(objUrl);
```

# Base64

Base64 是一种基于64个可打印字符来表示二进制数据的表示方法。Base64 编码普遍应用于需要通过被设计为处理文本数据的媒介上储存和传输二进制数据而需要编码该二进制数据的场景。这样是为了保证数据的完整并且不用在传输过程中修改这些数据。

在 JavaScript 中，有两个函数被分别用来处理解码和编码 base64 字符串：

atob()：解码，解码一个 Base64 字符串；
btoa()：编码，从一个字符串或者二进制数据编码一个 Base64 字符串。
btoa("JavaScript")       // 'SmF2YVNjcmlwdA=='
atob('SmF2YVNjcmlwdA==') // 'JavaScript'
那 base64 的实际应用场景有哪些呢？其实多数场景就是基于Data URL的。比如，使用toDataURL()方法把 canvas 画布内容生成 base64 编码格式的图片：
```js
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext("2d");
const dataUrl = canvas.toDataURL();
```
除此之外，还可以使用readAsDataURL()方法把上传的文件转为base64格式的data URI，比如上传头像展示或者编辑：
```js
<input type="file" id="fileInput" />

<img id="preview" />

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const reader = new FileReader();

fileInput.onchange = (e) => {
  reader.readAsDataURL(e.target.files[0]);
};

reader.onload = (e) => {
  preview.src = e.target.result;
  console.log(e.target.result);
};
```
将图片（二进制数据）转化为可打印的字符，也便于数据的传输。
另外，一些小的图片都可以使用 base64 格式进行展示，img标签和background的 url 属性都支持使用base64 格式的图片，这样做也可以减少 HTTP 请求。

# 格式转化
看完这些基本的概念，下面就来看看常用格式之间是如何转换的。

ArrayBuffer --> blob
`const blob = new Blob([new Uint8Array(buffer, byteOffset, length)]);`

ArrayBuffer --> base64
`const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));`

base64 --> blob
```js
const base64toBlob = (base64Data, contentType, sliceSize) => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
```

blob --> ArrayBuffer
```
function blobToArrayBuffer(blob) { 
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject;
      reader.readAsArrayBuffer(blob);
  });
}
```

blob --> base64
```
function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
```

blob --> Object URL
`const objectUrl = URL.createObjectURL(blob);`





-------


# 下载
下载文件可以通过window.open 或a标签的方式来直接请求链接，区别是a标签的方式可以重新定义文件名。但这两种方式都无法监听服务器返回的错误信息。

下载大文件 ajax请求返回blob对象或ArrayBuffer对象 监听下载进度，错误信息。

responseType="Blob" or responseType="ArrayBuffer"
```
axios({
    method: 'get',
    url,
    responseType: 'Blob or arraybuffer'
}).then((data)=>{data.data})
```
### ArrayBuffer 类型化数组
表示通用的 固定长度的原始二进制数据缓冲区。arraybuffer不能直接操作，而是要通过类型数组对象或DataView对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

### Blob （Binary Large Object） 二进制大数据对象
表示一个不可变 原始数据的类文件对象。blob表示的不一定是JS原生格式的数据。File接口基于Blob，继承了Blob的功能并将其拓展使其支持用户系统上的文件。

如果下载文件类型是文本类型如js txt md等等，那么用responsetype: 'text'也可以，但如果是图片 视频等其他文件，就要用arrayBuffer或Blob。

### 如何保存
下载其实是浏览器内置事件，response内容按content-type交给浏览器处理
ajax请求不一样，response交给js处理，只能接受字符串，所以按标准ajax请求无法触发浏览器下载功能。
寻找解决办法：
发送请求 获得response 通过response判断是否是流文件，如果是则在页面中插入frame/a标签，利用标签触发浏览器的get下载。

```js
axios({
    method: 'get',
    url,
    responseType: 'blob or arraybuffer'
}).then((res)=>{
    //res是文件流
    const blob = new Blob([res], {type: 'application/octet-stream'}) // type指定为文件的mmie类型 application/force-download 可能是通用的 后端也无需设置header （尝试发送jpg pdf xls都可行）
    const fileName = 'xxx.xls'
    // 或者文件名为
    // const fileName = response.headers['content-disposition'].match()[1]
    
    if(typeof window.navigator.msSaveblob == 'undefined'){
        const link = document.createElement('a');
        //link.download = fileName;
        link.setAttribute('download', decodeURI(fileName))
        //兼容 某些浏览器不支持h5download属性
        if（typeof link.download == 'undefined'）{
            link.setAttribute('target','_self')
        }
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob) // 将blob实例转变为a标签可访问的href链接地址
        ducument.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        //释放blob URL地址
        window.URL.revokeObjectURL(link.href);
        
    }else{
    //兼容ie 以本地方式保存
        window.navigator.msSaveBlob(blob, fileName)
    }
},(err)=>{
    console.log(err)
})
```

## 上传

原生ajax利用formdata上传文件：

### FormData
先看看 MDN 对FormData的介绍:
XMLHttpRequest Level2添加了一个新的接口FormData. 利用FormData对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,我们还可以使用XMLHttpRequest的send()方法来异步的提交这个"表单".比起普通的ajax,使用FormData的最大优点就是我们可以异步上传一个二进制文件.

特点就是，增加了ajax对二进制文件上传的支持。比如：

```javascript
var formData = new FormData();
formData.append("username", "sam");
// HTML file input, chosen by user
formData.append("userfile", fileInputElement.files[0]);
// JavaScript file-like object
var content = 'hey!'; // the body of the new file...
var blob = new Blob([content], { type: "text/xml"});
formData.append("webmasterfile", blob);
var request = new XMLHttpRequest();
request.open("POST", url);
request.send(formData);
```
这个例子既有File，还有Blob 类型文件，利用FormData 能轻松的进行异步上传。

此时的请求头部：
Content-Type 为:
`multipart/form-data; boundary=----WebKitFormBoundary2KZkAN7R3gSDjBJz`

分析一下请求信息，发现这种提交方式与form表单提交是一样的。

我们知道，在ajax请求中，send函数会自动生成请求头和请求主体。所以，send(formData)浏览器会自动生成上图中的请求。在浏览器不支持FormData的情况下，我们可以通过拼接multipart/form-data请求，来达到目的。


------- 

axios上传文件

上传高清图片，必须原图上传。由于在移动端应用，上传网络问题有很大的坑。当初的方案是直接采用将文件转化为base64，再进行上传，由于文件转化为base64后，文件大小会增加30%。又导致上传压力，影响用户体验。最终采取了以formData形式进行上传，也就是 File 上传文件。以这种形式可以提高上传速度提高30%以上。

#### 实现方法
1、读取文件
通过input标签，我们可以得到一个file文件将这个file进行处理。

`<input class="upload" type="file" ref="upload" accept="image/jpeg,image/jpg,image/png" @change="uploadImg($event)">`

```javascript
// 选择本地图片
uploadImg (e) {
  let file = e.target.files[0] // e.target表示事件的目标dom元素 这里就是input标签这个元素
}

//或可以下面这么写
var fileInput = document.querySelector('input');

fileInput.addEventListenter('change',function(){
    let file = fileInput.files[0]
})
```

2、实例化FormData对象
因为我们是以表单的形式上传文件，所以必须进行实例化，再添加属性以及值。注意，这里必须进行实例化，否则无法上传。我们可以把formdata作为参数上传给后端。
```JavaScript
uploadImg (e) {
    // 获取file
    let file = e.target.files[0]
    // 实例化FormData对象
    let formdata = new FormData()
    formdata.append('file', file)
    upload(formdata).then(res => {
    // ...   
    })
}
```

3、配置axios
在axios配置中，我们需要用POST方法，再配置headers,需要这个浏览器才知道是表单。
`headers: {
  'Content-Type': 'multipart/form-data;charset=UTF-8'
}`

完整的axios代码：
 以下为请求头的配置
```JavaScript
let config = {
    //添加请求头
    headers: { "Content-Type": "multipart/form-data" },
    //添加上传进度监听事件
    onUploadProgress: e => {
      var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
      this.progress = completeProgress;
    }
};
```
axios发送请求：
```JavaScript
axios.post('http://127.0.0.1:8778/upload', param, config).then(function(response) { 
    console.log(response); 
    }).catch(function (error) {
            console.log(error);
 });
```

