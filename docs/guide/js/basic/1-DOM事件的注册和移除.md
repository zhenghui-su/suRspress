# DOM 事件的注册和移除

## 注册

DOM 的注册方式其实有很多，最先开始的时候只有一个，后面觉得存在问题出现新的，然后就这么解决，继续出新的，因此会发现有很多个，我们一一过一遍

### 内联事件处理器

第一种就是嵌在标签的内联事件处理器，它是最先被推出的：

```html
<button onclick="onClick('su')">按钮</button>
<script>
	function onClick(param) {
		console.log(`你点击了按钮${param}`)
	}
</script>
```

虽然很简单，但它存在几个问题：

- 第一个就是他将 html 代码和 js 代码混杂在一起了，与分离的理念不合
- 第二个就是如果我们想给`button`添加多个点击事件，后面的事件就无法实现，因为`onclick`只能绑定一个事件处理器

### 通过 HTML DOM 设置

第二种就是通过获取 dom，然后给 dom 上绑定事件：

```js
let btn = document.getElementById("button")
btn.onclick = function () {
	console.log("点击事件1")
}
btn.onclick = function () {
	console.log("点击事件2")
}
```

通过这个方式，我们就将 JS 代码和 HTML 元素分离了，但它仍有一个缺点：

- 我们仍然只能给 button 添加一个事件处理器

上面我添加了两个，然后运行点击，查看打印结果，发现只有一个：

![image-20240824143113822](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240824143113822.png)

第二个事件处理器会将第一个覆盖了，因此仍存在问题

### 添加事件监听器

第三种就是通过`addEventListener`添加事件监听器：

```js
let btn = document.getElementById("button")
btn.addEventListener("click", function () {
	console.log("点击事件1")
})
btn.addEventListener("click", function () {
	console.log("点击事件2")
})
```

还是获取 DOM，不过点击事件通过`addEventListener`来添加，通过这种方式，既分离了 js 和 html，又可以解决多个点击事件添加的问题：

![image-20240824143612314](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240824143612314.png)

`addEventListener`还有第三个参数为布尔值，默认值为`false`代表在冒泡阶段触发这个函数，`true`代表在捕获阶段触发这个函数。

但`addEventListener`也有一个缺点，它不兼容老版本浏览器，因此可以写兼容代码：

```js
let btn = document.getElementById("button")
if (btn.addEventListener) {
	// 支持的
	btn.addEventListener("click", myFunction, false)
} else if (btn.attachEvent) {
	// 老版本 IE 浏览器
	btn.attachEvent("onclick", myFunction)
}
function myFunction() {
	console.log("按钮被点击")
}
```

## 移除

由于添加的方式有很多种，因此对于每一种，我们也有对应的移除办法

### 移除 onclick

首先我们看怎么移除通过 HTML DOM 设置的，只需要将`onclick`指向`null`即可：

```js
let btn = document.getElementById("button")
btn.onclick = function () {
	console.log("点击事件1")
}
btn.onclick = null
```

### 移除 addEventListener

然后我们如何移除`addEventListener`呢，通过`removeEventListener`即可：

```js
let btn = document.getElementById("button")
function handleClick() {
	console.log("点击事件")
}
btn.addEventListener("click", handleClick)
btn.removeEventListener("clicl", handleClick)
```

需要注意，这里的回调函数需要提取取函数名，因为移除的时候需要有函数名才能移除。
