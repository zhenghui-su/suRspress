# BFC

## 经典题目

- 介绍下 BFC 及其应用
- 介绍下 BFC、IFC、GFC、FFC

## 搞懂各种 FC

### 什么是 BFC

我们先看 BFC，他其实就是 _Block formatting contexts_，即块级格式化上下文

简单来说，就是页面中的一块渲染区域，并且有一套属于自己的渲染规则，它决定了元素如何对齐内容进行布局，以及与其他元素的关系和相互作用。 当涉及到可视化布局的时候，BFC 提供了一个环境， HTML 元素在这个环境中按照一定规则进行布局。

再简短一点，那就是：**BFC 是一个独立的布局环境，BFC 内部的元素布局与外部互不影响**

当然，虽然说 BFC 是一个独立的布局环境，里外不影响，但也不是意味着布局没有章法，基本的布局规则还是有的，如下：

- 内部的 Box 会在垂直方向一个接着一个地进行放置。
- Box 垂直方向上的距离由 margin 决定。属于同一个 BFC 的两个相邻的 Box 的 margin 会发生重叠
- 每个盒子的左外边框紧挨着包含块的左边框，即使浮动元素也是如此。
- BFC 的区域不会与浮动 Box 重叠。
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。
- 计算 BFC 的高度时，浮动子元素也参与计算。

我们发现这个和我们的 body 元素里面一样啊，其实在标准流中 body 元素天然就是一个 BFC

那么如果其他区域，我想单独设置成一个 BFC，该怎么办呢？这里记录了一些常见的方式：

| 元素或属性 | 属性值                              |
| ---------- | ----------------------------------- |
| 根元素     |                                     |
| float      | left、right                         |
| position   | absolute、fixed                     |
| overflow   | auto、scroll、hidden                |
| display    | flow-root、inline-block、table-cell |

> 上面只是一些基本的，更多参考 MDN 文档：[区块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)

### 应用场景

那么 BFC 有什么作用呢？我们来看几个场景

- 解决浮动元素令父元素高度坍塌的问题

```html
<div class="father">
	<div class="son"></div>
</div>
```

```css
.father {
	border: 5px solid;
}
.son {
	width: 100px;
	height: 100px;
	background-color: blue;
	float: left;
}
```

在上面的代码中，父元素的高度是靠子元素撑起来的，但是一旦我们给子元素设置了浮动，那么父元素的高度就塌陷了。如下：

![image-20240605154901072](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605154901072.png)

此时我们将这个父元素设置为一个 BFC，如下：

```css
.father {
	border: 5px solid;
	overflow: hidden; /* 设置为BFC */
}
.son {
	width: 100px;
	height: 100px;
	background-color: blue;
	float: left;
}
```

此时由于父元素变成 BFC，高度就不会塌陷了，因为在计算 BFC 的高度时，浮动子元素也会参与

![image-20240605155244429](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605155244429.png)

- 非浮动元素被浮动元素覆盖

```html
<div class="box1"></div>
<div class="box2"></div>
```

```css
.box1 {
	width: 100px;
	height: 50px;
	background-color: red;
	float: left;
}
.box2 {
	width: 50px;
	height: 50px;
	background-color: blue;
}
```

在上面的代码中，由于 box1 设置了浮动效果，所以会脱离标准流，自然而然 box2 会往上面跑，结果就被高度和自己一样的 box1 给挡住了。

![image-20240605155624651](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605155624651.png)

此时我们设置 box2 为 BFC

```css
.box1 {
	width: 100px;
	height: 50px;
	background-color: red;
	float: left;
}
.box2 {
	width: 50px;
	height: 50px;
	background-color: blue;
	display: flow-root; /* 设置为 BFC */
}
```

因为 BFC 的区域不会与浮动的 Box 重叠，就不会出现遮挡问题了

![image-20240605155718714](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605155718714.png)

- 外边距垂直方向重合的问题

BFC 还能解决 margin 重合的问题

```html
<div class="box1"></div>
<div class="box2"></div>
```

```css
.box1 {
	width: 100px;
	height: 50px;
	background-color: red;
	margin-bottom: 10px;
}
.box2 {
	width: 100px;
	height: 50px;
	background-color: blue;
	margin-top: 10px;
}
```

最终效果如下，两个盒子之间的间隔就是 10px，因为有 margin 塌陷的问题

![image-20240605162707344](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605162707344.png)

我们可以在第二个盒子外面包裹一个盒子，然后把父盒子设置为 BFC

```html
<div class="box1"></div>
<div class="container">
	<div class="box2"></div>
</div>
```

```css
.box1 {
	width: 100px;
	height: 50px;
	background-color: red;
	margin-bottom: 10px;
}
.container {
	display: flow-root;
}
.box2 {
	width: 100px;
	height: 50px;
	background-color: blue;
	margin-top: 10px;
}
```

最终如下，会发现它们的间隔就是 20px 了：

![image-20240605163034005](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240605163034005.png)

OK,到这里你应该明白什么是 BFC 以及 BFC 的触发规则和其使用场景了。

明白了 BFC，那么其他的 IFC、GFC 和 FFC 也就大同小异了。

- IFC (_Inline formatting context_)：翻译成中文就是 行内格式化上下文，将一块区域以行内元素的形式来格式化
- GFC (*GrideLayout formatting context*s)：翻译成中文就是 网格布局格式化上下文，将一块区域以 Grid 网格的形式来格式化

- FFC (_Flex formatting contexts_)：翻译成中文就是弹性格式化上下文，将一块区域以弹性盒的形式来格式化

## 题目解答

### 介绍下 BFC 及其应用

所谓 BFC，指的是一个独立的布局环境，BFC 内部的元素布局与外部互不影响。

触发 BFC 的方式有很多，常见的有：

- 设置浮动
- overflow 设置 auto、scroll、hidden
- position 设置为 absolute、fixed
- display 设置 flow-root

常见 BFC 应用有：

- 解决浮动元素令父元素高度坍堤的问题
- 解决非浮动元素被浮动元素覆盖问题
- 解决外边距垂直方向重合的问题

### 介绍下 BFC、IFC、GFC、FFC

- BFC：块级格式上下文，指的是一个独立的布局环境，BFC 内部的元素布局与外部互不影响。

- IFC：行内格式化上下文，将一块区域以行内元素的形式来格式化。
- GFC：网格布局格式化上下文，将一块区域以 grid 网格的形式来格式化
- FFC：弹性格式化上下文，将一块区域以弹性盒的形式来格式化
