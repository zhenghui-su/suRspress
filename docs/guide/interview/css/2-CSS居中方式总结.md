# CSS 居中方式总结

## 经典题目

怎么让一个 div 水平垂直居中

## 盒子居中

居中分两个方向：水平方向和垂直方向

### 水平方向居中

水平方向居中很简单，有两种常用的方式：

- 设置盒子`margin: 0 auto`：这种方式原理在于设置`margin-left`为 auto 时，`margin-left`就会被设置为能有多大就多大，所以盒子会在最右边，而在设置`margin-right`为 auto 时，同理盒子就会到最左边。因此我们设置上面的时候，左右的 margin 都为 auto，盒子就居中了
- 通过`display: flex`设置外层盒子为一个弹性盒子，通过`justify-content: center`使内部盒子居中

### 垂直方向居中

关于盒子的垂直方向居中，方法有很多，这里介绍几种：

- 通过`vertical-align: middle`实现垂直居中

通过`vertical-align: middle`实现垂直居中是常用方法，但需要注意的是，vertical 生效的前提是元素是`display: inline-block`，且在使用该属性时需要一个兄弟元素作为参照物，让它垂直于兄弟元素的中心点。`vertical-align`对齐的方法是寻找兄弟元素中最高的元素作为参考

来个例子：

```html
<div class="container">
    <div class="item"></div>
    <div class="brotherBox"></div>
</div>
<style>
    .container {
        width: 500px;
        height: 300px;
        background-color: pink;
        text-align: center;
    }
    .item {
		width: 100px;
        height: 100px;
        background-color: skyblue;
        vertical-align: middle;
        margin: 0 auto;
        display: inline-block;
    }
    .brotherBox {
        height: 100%;
        /* width: 2px; */
        background: red;
        display: inline-block;
        vertical-align: middle;
    }
</style>
```

- 通过伪元素`:before`实现垂直居中

平白无故加一个参考元素，会影响页面的观感和语义

我们可以通过给父元素添加一个伪元素实现垂直居中，如下：

```html
<div class="container">
    <div class="item"></div>
</div>
<style>
    .container {
        width: 500px;
        height: 300px;
        background-color: pink;
        text-align: center;
    }
    .container::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%
    }
    .item {
        width: 100px;
        height: 100px;
        background-color: skyblue;
        vertical-align: middle;
        margin: 0 auto;
        display: inline-block;
    }
</style>
```

- 通过绝对定位实现垂直居中

假设子元素盒子高度 100px

设置父元素为相对定位，子元素为绝对定位，然后`left: 50%`和`top: 50%`，然后设置`margin`的 left 和 top 为负的盒子一半高度即`margin-left: 50px`实现垂直居中

- 通过 transform 实现垂直居中

和上面一样使用定位，只是把用 margin 改成用`transform: translateX(-50px) translateY(-50px)`，值也是负的盒子的一半高度；

- 使用 calc 实现垂直居中

一样使用定位，然后不需要 margin 和 transform 了，把 left 改成`left: calc(50% -50px)`即可，top 同理

- 使用弹性盒子居中

通过设置父元素为弹性盒子，然后使用`justify-content: center`和`align-items: center`来设置内部盒子水平垂直居中

以上就是常见的居中解决方案，最常用的就是弹性盒子，比较推荐它。

## 题目解答

怎么让一个 div 水平垂直居中

- 通过`verticle aligo:middle`实现垂直居中
- 通过父元素设置伪元素`:before`，然后设置子元素`verticie align:middle`实现垂直居中
- 通过定位配合 margin 实现垂直居中
- 通过定位和`transform`实现垂直居中
- 通过定位和`calc`实现垂直居中
- 使用弹性盒子居中