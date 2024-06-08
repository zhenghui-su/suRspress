# CSS 渲染性能优化

## 经典题目

- 总结一下如何提升或者优化 CSS 的渲染性能

## CSS 渲染性能优化

很多人往往不重视性能优化这一块， 觉得功能做出来就行了。

诚然，在软件开发过程中，功能确实是优先要考虑的，但是当功能完善后，接下来就需要考虑性能问题了

我们可以从两个方面来看性能优化的意义：

- 用户角度：网站优化能够让页面加载得更快，响应更加及时，极大提升用户体验。
- 服务商角度：优化会减少页面资源请求数，减小请求资源所占带宽大小，从而节省可观的带宽资源。

网站优化的目标就是减少网站加载时间，提高响应速度。

那么网站加载速度和用户体验又有着怎样的关系呢？Google 和亚马逊的研究表明，Google 页面加载的时间从 0.4 秒提升到 0.9 秒导致丢失了 20% 流量和广告收入，对于亚马逊，页面加载时间每增加 100ms 就意味着 1% 的销售额损失。

我们来看 CSS 能做哪些性能优化

### 使用 id 选择器

使用`id selector`非常的高效。在使用`id selector`的时侯需要注意一点：因为 id 是唯一的， 所以不需要既指定 id 又指定`tagName`：

```css
p#id1 {
	color: red;
} /*错误示范*/
#id1 {
	color: red;
} /*正确示范*/
```

### 避免深层的 node

比如下面的例子，尽量毕竟这种情况：

```css
/* Bad */
div > div > div > p {
	color: red;
}
/* Good */
p-class {
	color: red;
}
```

### 不使用属性选择器

不要使用`attribute selector`，如: `p[att1="val1"]`。 这样的匹配非常慢。更不要这样写: `p[id="id1"]`。 这样将`id selector`退化`成attribute selector`。

```css
/* Bad */
p[id='jar'] {
	color: red;
}
p[class='blog'] {
	color: red;
}
/* Good */
#jar {
	color: red;
}
.blog {
	color: red;
}
```

### 将前缀置于前面

通常将浏览器前缀置于前面，将标准样式属性置于最后，其实就是采用渐进增强的写法：

```css
.a {
	-moz-border-radius: 5px;
	border-radius: 5px;
}
```

### 遵守 CSSLint 规则

如下：

| 规则名称                    | 描述                                     |
| --------------------------- | ---------------------------------------- |
| font-faces                  | 不能使用超过 5 个 web 字体               |
| import                      | 禁止使用@ import                         |
| regex-selector 8            | 禁止使用属性选择器中的正则表达式选择器   |
| universal-selector          | 禁止使用通用选择器\*                     |
| unqualified-attributes      | 禁止使用不规范的属性选择器               |
| zero-units                  | 0 后面不要加单位                         |
| overqualified- elements     | 使用相邻选择器时，不要使用不必要的选择器 |
| shorthand                   | 简写样式属性                             |
| duplicate-background-images | 相同的 ur1 在样式表中不超过一次          |

更多的 CSSLint 规则参阅：[csslint](https://github.com/CSSLint/csslint)

### 不使用 import

这个上面 CSSLint 也提到了，使用`@import`引入 css 会影响浏览器的并行下载。使用`@import`引用的 css 文件只有在引用它的那个 css 文件被下载、解析之后，浏览器才会知道还有另外一个 css 需要下载，这时才去下载，然后下载后开始解析、构建 Render Tree 等一系列操作。

多个`@import`会导致下载顺序紊乱。在 IE 中，`@import`会引发资源文件的下载顺序被打乱，即排列在`@import`后面的 JS 文件先于`@import`下载，并且打乱甚至破坏`@import`自身的并行下载。

### 避免过分重排（Reflow）

所谓重排就是浏览器重新计算布局位置与大小。常见的重排元素：

```css
width				height
padding				margin
display				border-width
border				top
position			font-size
float				text-align
overflow-y			font-weight
overflow			left
font-family			line-height
vertical-align		right
clear 				white-space
bottom				min-height
```

### 依赖继承

如果某些属性可以继承，自然就不需要再写一遍

## 题目解答

- 总结一下如何提升或者优化 CSS 的渲染性能

CSS 渲染性能的优化来自方方面面，这里列举一些常见的方式：

- 使用 id 选择器非常高效，因为 id 是唯一的
- 避免深层次的选择器嵌套
- 尽量避免使用属性选择器，因为匹配速度慢
- 使用渐进增强的方案
- 遵守 CSSLint 规则
- 不要使用`@import`
- 避免过分重排(Reflow)
- 依赖继承
- 值缩写
- 避免耗性能的属性
- 背景图优化合并
- 文件压缩
