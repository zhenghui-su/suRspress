# CSS3 的媒体(media)查询

## 经典题目

如何使用媒体查询实现视口宽度大于 320px 小于 640px 时 div 元素宽度变为 30%

## 媒体查询

媒体查询英文全称 Media Query，顾名思义就是会查询用户所便用的媒体或者媒介。

在现在，网页的浏览终端是越来越多了。用户可以通过不同的终端来浏览网页，例如：PC，平板电脑，手机，电视等。尽管我们无法保证一个网站在不同屏幕尺寸和不同设备上看起来一模一样，但是至少要让我们的 Web 页面能适配用户的终端。

在 CSS3 中的 Media Query (媒体查询) 模块就是用来让一个页面适应不同的终端的。

### Media Type 设备类型

首先我们来认识一下 CSS 中所支持的媒体类型。

在 CSS2 中常碰到的就是 all(全部)、screen(屏幕)、print(页面打印或打印预览模式)，当然媒体类型远不止这 3 种。

| 值         | 设备类型                                         |
| ---------- | ------------------------------------------------ |
| All        | 所有设备                                         |
| Braille    | 盲人用点字法触觉回馈设备                         |
| Embossed   | 盲文打印机                                       |
| Handheld   | 便携设备                                         |
| Print      | 打印用纸或打印预览试图                           |
| Projection | 各种投影设备                                     |
| Screen     | 电脑显示器                                       |
| Speech     | 语音或音频合成器                                 |
| Tv         | 电视机类型设备                                   |
| Tty        | 使用固定密度字母栅格的媒介，比如电传打字机和终端 |

当然常用的也就是 all、screen 和 print 这三种了

### 媒体类型引用方法

引用媒体类型的方法有很多，常见有：link 标签、xml 方式、`@import`和 CSS3 新增的`@media`

- link 标签

Iink 方法引入媒体类型其实就是在 link 标签引用样式的时候，通过 link 标签中的 media 属性来指定不同的媒体类型，如下：

```html
<link rel="stylesheet" href="index.css" media="screen" />
<link rel="stylesheet" href="print.css" media="print" />
```

- xml 方式

xml 方式 和 link 标签类似，也通过 media 属性来指定：

```html
<? xml-stylesheet rel="stylesheet" media="screen" href="style.css" ?>
```

- `@import`方式

`@import`引入媒体类型主要有两种方式，一种是在 CSS 样式表中通过`@import`调用另一个样式文件，另一种是在 style 标签中引入

> 注意：IE6 和 IE7 中不支持该方式

在样式文件中引入媒体类型：

```css
@import url("./index.css") screen;
```

在 style 标签中引入媒体类型：

```html
<style>
  @import url("./index.css") screen;
</style>
```

- `@media`方式

`@media`是 CSS3 中新引进的一个特性，称为媒体查询。`@media`引入媒体类型也有两种方式。如下：

在样式文件中引入媒体类型：

```css
@media screen {
  /* 具体样式 */
}
```

在 style 标签中引入媒体类型：

```html
<style>
  @media screen {
    /* 具体样式 */
  }
</style>
```

虽然介绍了 4 种方式，但常用的就是第一种和第四种

### 媒体查询具体语法

我们可以把 Media Query 看为一个公式：

```css
Media Type (判断条件) + CSS (符合条件的样式规则)
```

举个例子，我们先用 link 方式

```html
<link rel="stylesheet" media="screen and (max-width: 600px)" href="index.css" />
```

然后我们再用`@media`的方式

```css
@media screen and (max-width: 600px) {
  /* 具体样式 */
}
```

上面两个例子都是用 width 来进行样式判断，但其实还有很多特性都可以用来当作样式表判断的条件，比如设备宽度 device-width 等

有了 Media Query，我们能在不同等条件下使用不同的样式，使页面在不同的终端设备下达到不同的渲染效果。

```css
@media 媒体类型 and (媒体特性) {
  /* 具体样式 */
}
```

来看几个具体的例子：

- 最大宽度 `max-width`

该特性是指媒体类型小于或者等于指定宽度时样式生效：

```css
@media screen and (max-width: 480px) {
  /* 具体样式 */
}
```

当屏幕宽度小于或者等于 480px 时，样式生效。

- 最小宽度 `min-width`

该特性和上面相反，媒体类型大于或等于指定宽度时样式生效：

```css
@media screen and(min-width: 480px) {
  /* 具体样式 */
}
```

当屏幕宽度大于或者等于 480px 时，样式生效。

- 多个媒体特性混合使用

当需要多个媒体特性时，使用 and 关键字将媒体特性结合在一起，例如：

```css
@media screen and (min-width: 480px) and (max-width: 900px) {
  /* 具体样式 */
}
```

当屏幕大于等于 480px 并且小于等于 900px 时，样式生效

- 设备屏幕的输出宽度 Device Width

在智能设备上，例如 iPhone，可以通过 `min-device-width` 和 `max-device-width`来设置媒体特性：

```css
@media screen and (max-device-width: 480px) {
  /* 具体样式 */
}
```

在智能设备上，当屏幕小于等于 480px 时样式生效

- not 关键字

not 关键字可以用来排除某种制定的媒体特性：

```css
@media not print and (max-width: 480px) {
  /* 具体样式 */
}
```

除了打印设备和屏幕宽度小于等于 480px 的设备，其他都生效

- 未指明 Media Type

如果在媒体查询中没有明确的指明媒体类型，那么默认为 all：

```css
@media (max-width: 900px) {
  /* 具体样式 */
}
```

该样式将在屏幕小于或等于 900px 的所有设备生效。

更多关于媒体查询的可参阅 MDN：[媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_media_queries)

## 题目解答

如何使用媒体查询实现视口宽度大于 320px 小于 640px 时 div 元素宽度变为 30%

如下代码：

```css
@media screen and (min-width: 320px) and (max-width: 640px) {
  div {
    width: 30%;
  }
}
```
