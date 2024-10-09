# CSS相关

### display有哪些属性？*

- none：不展示
- block：块类型
- inline：行内
- inline-block：默认行内块状
- list-item | table
- inherit：继承

### inline 和 inline-block区别？*

- inline：共享一行，行内概念
- block：独占一行
- inline-block：共享一行，内容作为block对象呈现

### 行内元素和块级元素有什么区别？*

行内元素：

- 无法设置宽高
- 水平方向可设置margin + padding，垂直方向则无法设置
- 不会自动换行

块级元素：

- 可以设置宽高
- 水平垂直方法可设置margin + padding
- 可以自动换行，多个块状是默认从上往下换行排列

### 有哪些行内和块级元素？

块级元素：div、form、h1、pre、table、ul...

行内元素：a、br、code、em、img、i、input、strong、textarea...

### 块级元素和内联元素有哪些转换方式？**

1. display
2. float：left/right 设置后自动变为块级元素，它可以去除行内元素的空白问题
3. position：absolute/fixed 设置后变为块级元素

### 选择器和优先级？

#### 选择器的优先级是什么样的？选择器如何做样式判断？这段样式能不能生效？*

所有选择器和它的权重：

- 内联样式  			        1000
- id选择器          #id                       100
- 类选择器          .class                   10
- 属性选择器       a[ref="link"]        10
- 标签选择器       div                       1
- 伪类                 li:last-child          10
- 伪元素              li:before               1
- 兄弟选择器        div+p                   0
- 子选择器            ul>li                    0
- 后代选择器         div p                   0
- 通配符                *                          0

#### 特殊场景的优先级如何判断？*

`!important`优先级最高，如果优先级相同，则后者高于前者，继承得到的样式优先级最低

#### 可继承的样式有哪些？**

- 字体：`font-family`、`font-size`、`font-weight`、`font-style`
- 文本：`text-indent`、`text-align`、`line-height`、`word-spacing`、`letter-spacing`、`color`
- 元素：`visibility`
- 列表布局：`list-style`
- 光标：`cursor`

### 隐藏和显示相关

#### 有哪些可以隐藏一个元素的方法？有什么区别？**

- `display: none` 不占位
- `visibility: hidden` 占位
- `opacity: 0` 占位
- `position: absolute` 不占位
- `z-index: -999` 不占位
- `clip` 占位
- `transform: scale(0,0)` 占位

#### display 和 visibility 有什么区别？**

它们都是让元素隐藏或者展示，在浏览器渲染时候，display不占据空间，渲染树中不存在，而 visibility会占据一个节点

继承属性来说，display不会被继承，而 visibility 会被继承

性能影响上，display 会造成文档的重排，visibility 只会导致文档的重绘

### 盒模型及其特性

#### 简单说说标准盒模型、IE盒模型分别是什么？怎么转换？*

盒模型特点：content + padding + border + margin

区别：

- 标准盒模型：width 和 height 只包含了 content 部分
- IE盒模型：width 和 height 包含了 content + padding + border

转换：通过`box-sizing: content-box / border-box`

#### 伪元素和伪类是什么？如何使用？区别是什么？*

伪元素：只出现在CSS样式表中，不存在于doc中

伪类：已有的元素上加上特殊的类别，不产生新的元素

### 图片格式以及CSS-sprites

#### 图片格式有哪些？怎么应用？如何选择？*

- BMP：无损、没有压缩，通常体积较大
- GIF：无损、采用了LZW压缩算法，只支持 8bit 索引色，支持动图
- JPEG：有损、直接色存储，适合还原度要求较高的照片
- PNG-8：无损、使用索引色，体积更小，并且支持透明度调节
- PNG-24：无损、使用直接色，压缩
- SVG：无损、矢量图，放大时不会失真，适合做logo，icon
- webP：支持有损和无损，直接色，支持透明度，可压缩，但只有chrome和opera支持

#### CSS-sprites 精灵图、雪碧图怎么处理？*

所有涉及到的图片，放到一张大图中，利用`background-image`、`background-repeat`、`background-position`来处理

### 像素密度与图片应用

#### 像素密度有了解吗？*

经典设备宽高 414px * 896px

物理像素 1242px * 2688px => 1242 / 414 = 3

=> 逻辑像素：物理像素 = 1 : 3 => 像素密度 3 => 3 倍屏

#### 如何在图片的加载上应用动态密度？*

设计师提供 @2x，@3x，@4x 不同比例的图，那么 200 * 300 在 3 倍屏上需要变为 600 * 900，这样才能不失真。在实际写的时候，使用媒体查询来设置，如下：

```css
image {
    background: ('1x.png')
}
@media only screen and (min-deivce-pixel-radio: 3) {
    image {
        background: ('3x.png')
    }
}
```

### CSS工程化与预处理器

#### CSS类库与工程化的理解？*

预处理器：scss、less、stylus，利用编译库提供能力，如层级、mixin、变量、循环、函数

后处理器：postcss，利用后处理编译，给属性增加前缀，实现跨浏览器兼容

### 单行多行文本超出

#### 手写一个单行 & 多行的文本超出省略*

单行：

```js
overflow: hidden;
text-overflow: ellipsis; // 超出省略号
white-space: nowrap; // 不换行
```

多行，不兼容方案

```js
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box; // 弹性伸缩盒子模型
-webkit-box-orient: vertical; // 从上往下垂直排列
-webkit-line-clamp: 3 // 显示的行数
```

多行，兼容性方案：

```css
p {
    position: relative;
    line-height: 18px;
    height: 40px;
    overflow: hidden;
}
p::after {
    content: '...';
    position: absolute;
    bottom: 0;
    right: 0
}
```

上面方案的不足之处就是一定要固定行高，可以通过js处理，或者后处理器

### px em rem

#### 多种单位的差别*

- 百分比：子元素的百分比相对于直接父元素的对应属性

- em：相对于父元素的字体大小倍数
- rem：相对与根元素字体大小的倍数
- vw：视窗宽度，满视窗宽度为 100vw
- vh：视窗高度，满视窗高度为 100vh
- vmin：vw和vh中较小值
- vmax：vw和vh中较大值

#### 如何利用rem实现响应式？项目如何实现响应式？*

根据当前设备的视察宽度与设计稿的宽度得到一个比例，根据比例设置根节点的`font-size`，后续所有的长度单位都用rem

### 布局

#### 定位浮动 简单聊聊浮动的影响还有原理？*

浮动工作原理：浮动元素脱离文档流，不占据空间，它不受原有文档流的影响，同时无法影响原有父类，导致高度塌陷

#### 浮动停留的条件？浮动元素移动遵循的空间？*

浮动元素碰到包含他的边框或者浮动元素的时候会停留，浮动元素可以左右移动，浮动元素的高度独立计算，不会再影响撑开原有父类的高度

#### 高度塌陷的原因，如何解决？*

- 给父级定义height
- 浮动元素后，给一个 div，然后通过`clear: both`
- 父级标签增加`overflow:hidden`（即BFC）
- 用伪元素模拟div

#### 简单说说如何创建BFC，以及如何解决一些问题？**

创建BFC的条件：

- 根元素body
- 元素设置浮动 float 除了 none
- position 设置 absolute 或 fixed 脱离文本流
- display的 inline-block、flow-root、table-cell、table-captain、flex
- overflow的hidden、auto、scroll

BFC的特点：

- 垂直方向上，自上而下排列，和文档流的排列方式一致
- BFC中上下相邻的两个容器的margin会重叠
- 计算BFC高度时会计算浮动元素
- BFC不会影响外部元素

#### BFC的正作用有哪些？**

解决margin重叠问题、解决高度塌陷问题、创建自适应布局

#### 有几种方法能实现两列布局？实现一个左边宽度固定，右侧宽度自适应的两列布局？*

浮动 + 生成BFC 不重叠 

```css
.left {
    width: 100px;
    height: 200px;
    float: left
}
.right {
    height: 200px;
    overflow: hidden
}
```

浮动 + width audo

```css
.container {
    height: 200px
}
.left {
    width: 100px;
    height: 200px;
    float: left
}
.right {
    margin-left: 200px;
    width: auto
}
```

flex大法

```js
.container {
    height: 200px;
    display: flex
}
.left {
    width: 100px;
}
.right {
    flex: 1
}
```

#### 三列布局呢？左右两栏宽度固定，中间自适应？

绝对布局

```css
.container {
    position: relative;
    height: 200px
}
.left {
    position: absolute;
    width: 100px;
    height: 200px
}
.right {
	position: absolute;
    width: 200px;
    height: 200px;
    top: 0;
    right: 0;
}
.center {
    margin-left: 100px;
    margin-right: 200px;
    height: 200px;
}
```

flex 大法

```css
.container {
	display: flex;
    height: 200px
}
.left {
    width: 100px
}
.right {
    width: 200px
}
.center {
    flex: 1
}
```

圣杯布局 利用padding

```css
.container {
    height: 200px;
    padding-left: 100px;
    padding-right: 200px
}
.center {
    float: left;
    width: 100%;
    height: 200px
}
.left {
    position: relative;
   	left: -100px;
    float: left;
    margin-left: -100%;
    width: 100px;
    height: 200px
}
.right {
    position: relative;
   	left: 200px;
    float: right;
    margin-left: -200px;
    width: 200px;
    height: 200px
}
```

双飞翼 利用 margin

```css
.container {
    height: 200px
}
.left {
    width: 100px;
    height: 200px;
    float: left;
    margin-left: -100%
}
.right {
   	float: left;
    margin-left: -200px;
    width: 200px;
    height: 200px;
}
.wrapper {
    float: left;
    width: 100%;
    height: 200px
}
.center {
    margin-left: 100px;
    margin-right: 200px;
    height: 200px
}
```

#### 水平垂直居中问题？**

绝对定位法

```css
div {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -heigth/2;
    margin-left: -width/2;
}
```

自我拉扯margin

```css
div {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
```

flex大法

```css
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### 一些奇技淫巧

#### 三角形

border 的三边透明即可

梯形、扇形、就是三角形变化，梯形就是两个三角加正方，扇形就是三角的边变为圆

#### 1px

可以`transform: sacle`缩小