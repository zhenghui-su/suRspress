# 显式隐式和 new 绑定的优先级

学习了三种绑定，那么它们之间的优先级顺序是什么呢？

## 显式绑定和隐式绑定

首先我们来比较一下显式绑定和隐式绑定：

```js
function fn() {
	console.log(this)
}
let obj1 = {
	name: "obj1",
	fn: fn,
}
let obj2 = {
	name: "obj2",
	fn: fn,
}
// 隐式绑定 obj1.fn 显式绑定fn.call 两者同时存在
obj1.fn.call(obj2) // obj2
```

上面例子中隐式绑定`obj1.fn`和显式绑定`fn.call()`同时存在，然后输出了 obj2，这证明了**显式绑定比隐式绑定优先级更高**

## new 绑定和隐式绑定

接下来我们比较`new`绑定和隐式绑定谁优先级更高：

```js
function fn() {
	console.log(this)
}
let obj = {
	name: "obj",
	fn: fn,
}
// new绑定 obj.fn 隐式绑定 两者同时存在
new obj.fn() // {} 空对象
```

上面例子中，通过`obj.fn()`隐式绑定对象`obj`，前面用`new`绑定了创建的新对象，查看结果，输出了`{}`空对象，这证明**new 绑定的比隐式绑定优先级更高**

## new 绑定和显式绑定

最后我们比较`new`绑定和显式绑定谁优先级更高：

```js
function fn() {
	console.log(this)
}
let obj = {
	name: "obj",
	fn: fn,
}
// fn.bind 显式绑定返回 aa函数
let aa = fn.bind(obj)
// new aa函数 绑定创建的空对象 而构造函数`aa`里面指向 obj，两者同时存在
let newObj = new aa()
```

我们通过`bind`函数，绑定调用者`obj`然后返回新函数`aa`，随后用`new aa()`的方式`new`绑定创建的空对象，查看结果会发现输出空对象`{}`。

这就证明了在执行`new`的时候，它将原本`aa`函数指向的 this 即 `obj`改变成了指向刚刚创建的空对象`{}`，就证明了**new 的优先级比显式绑定更高**

## 总结顺序

根据上面的三个比较，我们可以总结它们的优先级顺序：**new 绑定 > 显式绑定 > 隐式绑定**
