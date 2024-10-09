# HTML相关

## HTML DOCTYPE 的含义？什么是 HTML的标准模式和混杂模式？

HTML 中的DOCTYPE 指文档类型声明，说明这个页面是用什么来编写的

- h5 html5 它比较宽松，基本上完全向后兼容

```html
<!DOCTYPE html>
```

- h4.0.1
  - strict 结构中不能有出现格式或表现的内容，如下不能使用
    - `<b></b>`、`<p font='5'></p>`
  - tansitional

4.0.1版本需要标注DTD声明，用以确认，比如下面的：

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dta">
```

## HTML5有哪些语义化标签及其特性？HTML元素有哪些分类与特性？

如`<footer></footer>`，它根据结构化的内容，有以下优点：

- SEO搜索有利
- 代码的可读性更好
- accessibility 无障碍化，方便一些其他的设备解析，如屏幕阅读器

## 如何检测浏览器是否支持HTML5特性

本质上是问有哪些HTML5新特性：

- canvas
- video、audio
- 本地缓存支持 localStorage 等
- Web Worker
- article、footer、header
- form：calendar、date

方法就是几种：

1. 检查特定的属性和方法

```js
!!navigator.geolocation
!!window.localStorage
!!window.Worker
```

2. 创建一个元素，看看特定元素有没有属性和方法

```js
document.createElement('canvas').getContext()
document.createElement('video').canPlayType
```

3. 使用第三方库 Modernizr，地址：[http://modernizr.cn](http://modernizr.cn)

## HTML中meta的作用

在HTML中，`<meta>` 标签用于定义文档的元数据。元数据（metadata）是关于数据的数据，它通常用于描述数据的内容、属性或状态。在HTML中，`<meta>` 标签用于定义文档的元数据，例如文档的标题、关键字、描述、作者等。

`<meta>` 标签通常位于 `<head>` 部分，用于提供关于页面的元数据。这些元数据不会显示在页面上，但它们对搜索引擎优化（SEO）和浏览器行为有重要影响。

以下是一些常见的 `<meta>` 标签及其作用：

1. `<meta charset="UTF-8">`：定义文档的字符编码。这是必需的，因为它告诉浏览器如何解释文档中的字符。
2. `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：设置页面的可见部分，使其适应不同设备。`width=device-width` 表示宽度适应设备宽度，`initial-scale=1.0` 表示初始缩放为1.0。
3. `<meta name="description" content="不超过150个字符">`：定义文档的描述，通常用于搜索引擎结果中的摘要。
4. `<meta name="keywords" content="separated, by, commas">`：定义文档的关键字，通常用于搜索引擎结果中的关键字。
5. `<meta name="author" content="Your Name">`：定义文档的作者。
6. `<meta name="robots" content="index, follow">`：告诉搜索引擎爬虫如何处理页面。`index` 表示允许搜索引擎索引该页面，`follow` 表示允许搜索引擎跟随链接。
7. `<meta name="revisit-after" content="7 days">`：告诉搜索引擎爬虫在多长时间后再次访问该页面。
8. `<meta name="googlebot" content="index, follow">`：针对 Google 爬虫的元数据。
9. `<meta name="msnbot" content="index, follow">`：针对 MSN 爬虫的元数据。
10. `<meta name="yahoo" content="index, follow">`：针对 Yahoo 爬虫的元数据。

## HTML的标签有哪些可以优化SEO

- 保证页面是SSR的

- meta 中的相关属性
  - `<meta name="description" content="xx网页">`
  - 更多参考上面
- 语义化标签以结构化为主如 `header`、`footer`

## DOM和BOM有什么区别？

JS 在浏览器环境下，一般由三部分构成：

- ECMAScript核心：描述了JS的语法和基本对象
- DOM：文档对象模型 document，即网页内容的文档，通过它的API来访问文档
- BOM：浏览器对象模型 browser，通过它的API来控制浏览器的一些行为

## 移动端适配的方案？

- 1px 问题：可以先放大 200%，然后`scale(0.5)`
- rem方案：根据根元素的字体大小适配
- 媒体查询

## 如何禁用页面中的右键、打印、另存为、复制等功能？

- 右键

```js
document.onmousedown = function (event) {
    if(event.button === 2) {
        return false;
    }
}
document.oncontextmenu = function (event) {
    if(event.button === 2) {
        return false;
    }
}
```

- 复制

```js
// <body oncopy="nocopy()"></body>
function nocopy(event) {
    event.returnValue = false
} 
```

- f12禁用

```js
document.onkeydown = function (e) {
    if (window.event && window.event.keyCode === 123) {
        window.event.returnValue = false
    }
}
```

## href="javascript:void(0)"和href="#"区别？

`href="#"`：这个代表锚点默认是 `#top`，它会让网页回到顶点

`href="javascript:void(0)"`：代表死链接，不会有任何行为

## target="_blank"的理解？有什么问题吗？如何防范？

`target="_blank"`，在以前，它类似于`window.opener`，子页面可以拿到当前的句柄

```js
if(window.opener) {
    window.opener.location.href = "bad.html"
}
```

现代浏览器已经隐式防范了，也可以通过`rel`来手动防范

```html
<a href="x.html" target="_blank" rel="noopener">跳转</a>
<a href="x.html" target="_blank" rel="noreferer">跳转</a>
```

或者改写：

```js
var otherWindow = window.open('xxx')
otherWindow.opener = null
```

## 什么是本地存储？什么是离线存储？

- cookie：每个cookie不超过4kb，每个域不超20+左右
- Web Storge：分两个
  - localStorage：永久缓存，关闭了依旧存在
  - sessionStorage：会话缓存，关闭浏览器标签页后就没了
  - 它们允许保存键值对，`key`和`value`必须为字符串，存储大小5MB+
- IndexedDB：浏览器内建数据库
  - 支持多种类型的键，支持事务的可靠性，支持键值范围查询、索引
  - 支持更大的数据量，一般可用于离线应用

- application cache：应用缓存
  - pwa：渐进式网页应用
  - service worker：独立的js主线程，实现离线的web App

## 什么是canvas？什么时候使用canvas？

canvas中文意思画布，其实就是在web页面上通过它来画一些东西。

它可以分如下：

- 2d：就是画一些平面的图形，较为方便的绘制几何图形
- webGL：它基于OpenGL的ES规范，利用GPU渲染一些3d/2d图形，典型库three.js

## 什么是pwa？

它必须有一个service worker，且有一个web应用程序清单，该清单就是`manifest.json`文件，通过pwa我们可以将网页变为一个web应用。

核心技术：

- app manifest
- service worker
- web push

## 什么是Shadow DOM？

web component，做到真正的组件化

- 原生的规范，无需框架
- 原生使用，无需编译
- 真正意义上的 css scope

```html
  <script>
    customElements.define('shadow-test', class extends HTMLElement {
      connectedCallback() {
        const shadow = this.attachShadow({
          mode: "open"
        })
        shadow.innerHTML = "this is a shadow dom"
      }
    })
  </script>
  <shadow-test></shadow-test>
```

## iframe有哪些应用

- 最常见的一种微前端手段
- ajax上传图片
- 广告
- 跨域

## 如何处理iframe通信

同域可以如下

```js
document.domain = "baidu.com"
frame.contentWindow.xxx;
```

还可以用postMessage进行跨不同页面通信

## 浏览器渲染和布局的逻辑？

- DOM 树构建
- CSSOM 树构建
- 渲染树构建
- 页面布局
- 页面绘制

## 页面的回流和重绘？

在改变了页面的DOM结构，比如某个元素的位置改变了影响了页面的结构，就会导致回流

重绘则是不改变页面结构，只改变元素本身，比如背景颜色这种。回流必定会导致重绘

## 如何计算首屏和白屏时间？常统计的页面性能数据指标？

- 通过`window.performance.timing`来拿到一些信息

- 通过`PerformanceObserver`，FP 首屏时间，FCP 首次由内容绘制的时间

```js
    new PerformanceObserver((entryList, observer) => {
      let entries = entryList.getEntries();
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].name === "first-paint") {
          console.log('FP', entries[i].startTime)
        }
        if (entries[i].name === "first-contentful-paint") {
          console.log('FCP', entries[i].startTime)
        }
      }
      observer.disconnect();
    }).observe({
      entryTypes: ["paint"]
    })
```

## 页面的一些领域哪里可以做性能优化

- `visibility:hidden` 替换 `display:none`，后者会导致回流
- 避免使用 table，一个元素变动也会导致回流
- 避免层级过多
- 操作dom时候尽量使用frament一起，不多次操作
- requestIdleCallback 来解决耗时任务

几个大指标 FCP首屏渲染 CLS 不要大量回流重绘 FID 输入延时