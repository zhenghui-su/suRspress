# 浏览器的 5 种 Observer

上一节我们学到了 MutationObserver，这节我们深入讲讲浏览器的五种 Observer。

网页开发中我们经常要处理用户交互，比如点击事件，这些都是通过用户来直接触发的。那有些不是由用户直接触发的时间呢？比如元素从不可见到可见，元素的大小变化，这类事件我们如何监听呢？

浏览器提供了 5 种 Observer 来监听这些变动：IntersectionObserver、MutationObserver、ResizeObserver、PerformanceObserver、ReportingObserver。

## IntersectionObserver

一个元素从不可见到可见，从可见到不可见，这种变化如何监听呢？通过`IntersectionObserver`来监听，它可以监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调。

我们试一下，准备两个元素：

```html
<div id="box1">BOX111</div>
<div id="box2">BOX222</div>
```

然后加上样式：

```css
#box1,
#box2 {
	width: 100px;
	height: 100px;
	background: blue;
	color: #fff;

	position: relative;
}
#box1 {
	top: 500px;
}
#box2 {
	top: 800px;
}
```

这两个元素分别在 500 和 800 px 的高度，我们监听它们的可见性的改变。

```js
const intersectionObserver = new IntersectionObserver(
	function (entries) {
		console.log("info:");
		entries.forEach((item) => {
			console.log(item.target, item.intersectionRatio);
		});
	},
	{
		threshold: [0.5, 1]
	}
);

intersectionObserver.observe(document.querySelector("#box1"));
intersectionObserver.observe(document.querySelector("#box2"));
```

创建 IntersectionObserver 对象，监听 box1 和 box2 两个元素，当可见比例达到 0.5 和 1 的时候触发回调。

浏览器跑一下，需要你拉动来把可见区域减小，打印如下：

![image-20240817200959033](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817200959033.png)

可以看到元素 box1 和 box2 在可视范围达到一半（0.5）和全部（1）的时候分别触发了回调。

这个作用何在呢？我们在做一些数据采集的时候，希望知道某个元素是否是可见的，什么时候可见的，就可以用这个 api 来监听，还有做图片的懒加载的时候，可以当可视比例达到某个比例再触发加载。

## MutationObserver

上节我们已经用过这个了，监听一个普通 JS 对象的变化，我们会用 Object.defineProperty 或者 Proxy。

而监听元素的属性和子节点的变化，我们可以用 `MutationObserver`，它可以监听对元素的属性修改、对它的子节点的增删改。

我们尝试一下，准备一个盒子：

```html
<div id="box"><button>React</button></div>
```

给上样式：

```css
#box {
	width: 100px;
	height: 100px;
	background: blue;

	position: relative;
}
```

渲染如下，很简单：

![image-20240817201319934](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817201319934.png)

我们定时对它做下修改：

```js
setTimeout(() => {
	box.style.background = "red";
}, 2000);

setTimeout(() => {
	const dom = document.createElement("button");
	dom.textContent = "你好React";
	box.appendChild(dom);
}, 3000);

setTimeout(() => {
	document.querySelectorAll("button")[0].remove();
}, 5000);
```

2s 的时候修改背景颜色为红色，3s 的时候添加一个 button 的子元素，5s 的时候删除第一个 button

然后用`MutationObserver`监听它的变化：

```js
const mutationObserver = new MutationObserver((mutationsList) => {
	console.log(mutationsList);
});

mutationObserver.observe(box, {
	attributes: true,
	childList: true
});
```

结果如下，三次变化都成功监听到了：

![image-20240817201556435](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817201556435.png)

其中，我们还可以监听到是什么变化了，比如第一次改变的是 attributes，属性是 style：

![image-20240817201741595](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817201741595.png)

第二次是改变的是 childList，添加了一个节点：

![image-20240817201829380](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817201829380.png)

第三次也改变 childList，删除了一个节点：

![image-20240817201906709](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817201906709.png)

通过它我们能做什么呢？比如文章水印如果被人通过 devtools 去掉了，那么就可以通过 MutationObserver 监听这个变化，然后重新加上，让水印去不掉，antd 中的水印组件也是这样做的

当然不止这些用途，这里只是简单介绍一下。

## ResizeObserver

如果要监听一个元素的大小变化，我们可以用`ResizeObserver`，它可以监听大小的变化，当 width、height 被修改的时候会触发回调。

尝试一下，还是弄个盒子：

```html
<div id="box"></div>
```

然后我们添加样式：

```css
#box {
	width: 100px;
	height: 100px;
	background: blue;
}
```

用一个定时器，在 3s 时候修改的它的宽度，变成 200px：

```js
const box = document.querySelector("#box");

setTimeout(() => {
	box.style.width = "200px";
}, 3000);
```

然后我们利用`ResizeObserver`来监听它的变化：

```js
const resizeObserver = new ResizeObserver((entries) => {
	console.log("当前大小:", entries);
});
resizeObserver.observe(btn);
```

浏览器跑一下，可以监听变化，打印如下：

![image-20240817202751644](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817202751644.png)

我们可以拿到元素和它的尺寸大小信息，实现了对元素大小修改的监听。

## PerformanceObserver

除了上面对元素的相关监听，浏览器还支持对 performance 录制行为的监听，通过`PerformanceObserver`可以记录一些时间点、某个时间段、资源加载的耗时等。

`PerformanceObserver` 用于监听记录 performance 数据的行为，一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报。

performance 可以用 mark 方法记录某个时间点：

```js
performance.mark("registered-observer");
```

可以用 measure 方法记录某个时间段，从两个参数是时间点，不传默认为从开始到现在

```js
performance.measure("button clicked", "from", "to");
```

我们可以简单试下：

```html
<button onclick="measureClick()">Measure</button>
<img
	src="https://chen-1320883525.cos.ap-chengdu.myqcloud.com/KatouMegumi%2Ftimg.jpg"
/>
<script>
	const performanceObserver = new PerformanceObserver((list) => {
		list.getEntries().forEach((entry) => {
			console.log(entry); // 上报
		});
	});
	performanceObserver.observe({ entryTypes: ["resource", "mark", "measure"] });

	performance.mark("registered-observer");

	function measureClick() {
		performance.measure("button clicked");
	}
</script>
```

创建了`PerformanceObserver`对象，监听 mark（时间点）、measure（时间段）、resource（资源加载耗时） 这三种记录时间的行为。

然后我们用 mark 记录了某个时间点，点击 button 的时候用 measure 记录了某个时间段的数据，还加载了一个图片，当这些记录行为发生的时候，希望能触发回调，在里面可以上报。

![image-20240817203858933](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817203858933.png)

这样我们就可以上报做性能分析了。

## ReportingObserver

有些时候，浏览器运行到过时的 api 会报一个过时的报告

![image-20240817204040309](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817204040309.png)

Chrome 还可以在一些情况下做一些干预行为，比如把占用 CPU 的 iframe 广告删除：

![image-20240817204133977](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817204133977.png)

干预后浏览器会打印一个报告：

![image-20240817204207614](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817204207614.png)

不过这些不都是对的，比如我这个网页就是为了展示广告的，浏览器将它删除了我却不知道，如果我知道可以优化一下将 CPU 占用减少。

这些如何监听呢？浏览器提供了`ReportingObserver`来监听这些报告的打印，我们就可以拿到然后上报。

```js
const reportingObserver = new ReportingObserver(
	(reports, observer) => {
		for (const report of reports) {
			console.log(report.body); //上报
		}
	},
	{ types: ["intervention", "deprecation"] }
);

reportingObserver.observe();
```

`ReportingObserver`可以监听过时的 api、浏览器干预产生的打印报告等，可以在回调里上报，这些是错误监听无法监听到但对了解网页运行情况很有用的数据。

## 总结

本节五个 Observer，和元素相关的三个如下：

- IntersectionObserver：监听元素可见性变化，常用来做元素显示的数据采集、图片的懒加载
- MutationObserver：监听元素属性和子节点变化，比如可以用来做去不掉的水印
- ResizeObserver：监听元素大小变化

和元素无关的：

- PerformanceObserver：监听 performance 记录的行为，来上报数据
- ReportingObserver：监听过时的 api、浏览器的一些干预行为的报告，可以让我们更全面的了解网页 app 的运行情况
