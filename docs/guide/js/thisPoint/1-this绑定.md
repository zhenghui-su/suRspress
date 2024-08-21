# this 绑定

## this 何时被确定

我们首先需要知道，this 它是在定义的时候被确定，还是在调用的时候被确定，来看一个例子：

```js
// 定义一个函数
function fn() {
	console.log(this)
}
// 调用方式一: 直接调用
fn() // window
// 调用方式二: 将fn放到一个对象里再调用
let obj = {
	name: "obj1",
	fn: fn,
}
obj.fn() // obj对象
// 调用方式三: 通过 call 或者 apply 调用
fn.call("hel") // String {"hel"} 对象
```

通过这个例子，我们看到 this 的值根据调用方式不同，就会有差异，总结如下：

- this 和函数定义的位置没有关系，只和调用者有关系
- this 是在运行时被绑定的

## 隐式绑定

### 通过对象调用函数绑定 this

我们还是根据刚刚的例子，`obj`调用了`fn`方法，因此 `this`会隐式的被绑定到`obj`对象上：

```js
function fn() {
	console.log(this)
}
let obj = {
	name: "obj1",
	fn: fn,
}
obj.fn() // obj 对象
```

我们再来看一个例子，其实就是上面的变种题，看一下这个会输出什么：

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
	obj1: obj1,
}
obj2.obj1.fn()
```

答案是`obj1`，只需记住一句话，谁**直接调用**`fn`方法，即谁离`fn`更近，`fn`中的 this 就指向谁

## 显式绑定

通过刚刚的学习我们知道隐式绑定都是通过对象调用函数的方式实现的，因此它有一个前提就是，这个对象`obj`上有这个方法`fn`，才可以像上面那样绑定。

那如果`obj`上没有`fn`方法，`obj`能否调用`fn`函数呢，答案是可以，通过显式绑定来做。

### call 函数

第一种显式绑定，就是通过`call`函数，它可以直接绑定你传入的东西，然后调用：

```js
function fn() {
	console.log(this)
}
fn.call(window) // window
fn.call({ name: "obj" }) // { name:"obj" }
fn.call(123) // Number 对象
```

### bind 函数

第二种显式绑定，通过`bind`函数，它会返回一个新函数，且将新函数绑定了调用者，如下：

```js
function fn() {
	console.log(this)
}
let obj = {
	name: "obj",
}
let aaa = fn.bind(obj)
aaa() // obj对象
```

我们使用`bind`，给`fn`绑定了调用者`obj`即绑定了 this 为`obj`对象，然后将它作为新函数返回，因此下面的`aaa`执行的时候 this 就指向了绑定的`obj`对象。

## new 关键字绑定

在学习了显式绑定和隐式绑定这两个方式之后，我们再来看使用 `new` 关键字进行绑定。

先看例子，如下：

```js
function Student(name) {
	console.log(this) // Student {}
	this.name = name // Student { name: "sususu" }
}
let su = new Student("sususu")
console.log(su)
```

通过这个例子我们就发现，通过`new`一个构造函数，构造函数内部的 this 就指向我们创建的空对象本身，即**实例化后的那个对象**。

### new 创建的步骤

那么通过`new`关键字创建一个新对象的步骤是什么或者说构造函数是如何创建新对象的？

- 先创建一个空对象
- 空对象的`__proto__`属性指向构造函数的`prototype`属性
- 执行构造函数，如果构造函数中有`this`，那么这个`this`指向刚刚**创建的空对象**
- 返回刚刚创建的对象（构造函数执行后可能添加了属性方法，比如上面添加了 `name`属性）

### return 的知识点

这里还有一个易错点，比如下面的例子会输出什么呢？

```js
function Student(name) {
	this.name = name
	return {
		name: "我是新对象",
	}
}
let s = new Student("susu")
console.log(s)
```

答案是`{ name: "我是新对象" }`，不急，再看下面会输出什么呢？

```js
function Student(name) {
	this.name = name
	return 123
}
let s = new Student("susu")
console.log(s)
```

答案是`{ name: "susu" }`，所以这里有个`return`的知识点：

- 如果 return 返回的是**对象**，则直接返回该对象
- 如果 return 返回的是**基本类型**，则 return 语句无效，仍然返回我们创建的新对象

这里为什么说是对象，因为如果你返回一个数组，它其实也是对象，也会被返回：

![image-20240821160832731](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240821160832731.png)
