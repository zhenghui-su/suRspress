# bind、apply、call 的区别

本小节我们来看看`bind`、`apply`、`call`的区别

## 区别

首先我们来看它们的相同点，都可以改变 this 的指向，来看代码

```js
var name = "su"
let obj = {
	name: "张三",
	say: function () {
		console.log(this.name)
	},
}
obj.say() // 张三
setTimeout(obj.say, 10) // su
```

为什么这里打印的名字不同，它涉及到 this 的绑定规则，当我们调用`obj.say()`时，有执行上下文`obj`因此隐式绑定了`obj`对象，所以打印张三，而下面我们在`setTimeout`的回调里面，没有明确的执行上下文，所以指向了全局的执行上下文，在全局的执行上下文中，this 指向了`window`，因此打印了挂载在`window`上的`name`即 su

### apply

如果我们想修改这个 this 指向，第一种就是通过`apply`方法：

```js
setTimeout(function () {
	obj.say.apply(obj)
}, 10) // 张三
```

我们使用`apply`传入要指向的 this，这时候调用`say`方法 this 就指向了`obj`。

那么如果`say`方法需要传入参数，`apply`也有第二个参数，接受参数数组：

```js
var name = "su"
let obj = {
	name: "张三",
	say: function (param1, param2) {
		console.log(param1 + "," + param2 + "," + this.name)
	},
}
obj.say("Hello", "World") // Hello,World,张三
setTimeout(function () {
	obj.say.apply(obj, ["Hello", "World"])
}, 10) // Hello,World,张三
```

### call

`call`方法使用和`apply`基本一致，唯一的区别在于，使用`call`传参不是传一个数组，而是一个个传

```js
setTimeout(function () {
	obj.say.call(obj, "Hello", "World")
}, 10) // Hello,World,张三
```

需要注意，它是一一对应，上面`say`接收几个参数，下面`call`就要传入几个参数

### bind

最后一种是通过`bind`来改变 this，它与上面不同的点在于，它并不是直接执行这个函数，而是返回一个新函数，这个新函数的 this 指向就是传入的第一个参数

```js
let newFn = obj.say.bind(obj, "Hello", "World")
newFn()
```

而且它不需要一次性的将参数传入进去，比如这里我不想传参，只是要绑定 this，也是可以的：

```js
let newFn = obj.say.bind(obj)
newFn("Hello", "World")
```

当然如果绑定的时候不传，在调用新函数的时候也是需要传参的。
