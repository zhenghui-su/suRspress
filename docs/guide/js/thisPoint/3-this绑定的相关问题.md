# this 绑定的相关问题

了解了三个绑定以及它们的优先级，我们来看下面的几个问题：

## 第一个

分析它的输出结果是什么？

```js
function foo() {
	console.log(this)
}
var obj1 = {
	name: "obj1",
	fn: foo,
}
var obj2 = {
	name: "obj2",
}
console.log((obj2.fn = obj1.fn)())
```

我们一起分析一下它：

- 第一步就是将`obj1.fn`赋值给`obj2.fn`，即给`obj2`添加了一个方法，先看这个结果

```js
console.log((obj2.fn = obj1.fn)) // foo 函数本身
```

- 我们发现上面执行后返回的结果是`foo`本身，然后立即执行它，此时它没有任何函数上下文，即没有明确的调用方，因此它的 this 最终指向全局 window

![image-20240821163430887](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240821163430887.png)

因此我们在上面执行`(obj2.fn = obj1.fn)()`的时候，其实就是直接执行了`foo()`，在执行它的时候，我们既没有隐式绑定也没有显式绑定，所以它没有绑定 this，于是就指向了全局 window

## 第二个

分析它的输出：

```js
var name = "全局字符串"
var person = {
	name: "person",
	sayName: function () {
		console.log(this.name)
	},
}
function sayName() {
	var fun = person.sayName
	fun()
	person.sayName()
	console.log((b = person.sayName)())
}
sayName()
```

我们先定义了一个全局字符串`name`，然后定义了一个`person`对象，有一个属性`name`和一个方法`sayName`输出`this.name`，定义函数`sayName`，调用，然后我们分析输出：

- 第一个将`person.sayName`函数赋值给`fun`，然后调用`fun`，注意`person.sayName`是没有调用即没有`()`的，因此`fun`其实就是如下：

```js
var fun = function () {
	console.log(this.name)
},
```

- `fun`直接调用，没有任何绑定，所以 this 指向了全局 window，然后 window 上挂载了一个全局字符串`name`，所以先输出`"全局字符串"`
- 接下来看`person.sayName()`，注意这里有调用，是对象调用函数，**即有隐式绑定**，这里的 this 指向了调用本身的`person`对象，所以输出了`"person"`
- 然后再看`(b = person.sayName)()`，这个其实和上面一样，将函数赋值给 b，返回本身然后立即执行它，由于没有明确的绑定，因此指向了全局 window，输出`"全局字符串"`

我们打开浏览器，查看控制台，输出完全没问题：

![image-20240821164829007](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240821164829007.png)
