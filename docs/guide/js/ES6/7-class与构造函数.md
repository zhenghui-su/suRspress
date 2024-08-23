# class 与构造函数

## 构造函数

在 ES6 之前，我们如果想要定义一个类，是没有`class`这个关键字的，因此我们都是使用构造函数来模拟类，比如下面的代码：

```js
function Person(name, age) {
	this.name = name
	this.age = age
}
Person.prototype.sayName = function () {
	console.log(`名字是${this.name}`)
}
Person.staticFunction = function () {
	console.log("我是静态方法")
}
let p = new Person("su", 18)
p.sayName() // 名字是su
p.staticFunction() // 报错，因为静态方法在构造函数上
// 正确调用静态函数
Person.staticFunction() // 我是静态方法
```

可以通过`new`构造函数来创建一个实例对象，这是`class`未出现前的样子

## class

在 ES6 之后，我们可以通过`class`关键字来声明一个类：

```js
class Person {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	// 原型方法
	sayName() {
		console.log(`名字是${this.name}`)
	}
	// 静态方法
	static staticFunction() {
		console.log("我是静态方法")
	}
}
let p = new Person("su", 18)
p.sayName() // 名字是su
Person.staticFunction() // 我是静态方法
```

其中构造函数为`constructor`，静态方法用`static`来声明。

注意，这里是构造函数指的是`class`里面的`constructor`，在 ES5 中，构造函数又是另一个概念，任何函数被`new`调用后，都是构造函数。

## 区别

虽然它们用起来很类似，但有部分区别，如下

### 枚举性

第一个区别就是两个原型方法的枚举性不一致。

- ES6 中，`class`上的原型方法不可枚举
- ES5 中，构造函数上的原型方法可以枚举

我们可以来看一下例子，先看 ES5，发现原型方法是可以枚举打印出的：

```js
function PersonES5(name, age) {
	this.name = name
	this.age = age
}
PersonES5.prototype.sayName = function () {
	console.log(`名字是${this.name}`)
}
PersonES5.staticFunction = function () {
	console.log("我是静态方法")
}
let es5 = new PersonES5("es5", 2014)
for (let p in es5) {
	console.log(p) // 打印"name", "age", "sayName"
}
```

然后我们将它改成 ES6 的`class`：

```js
class PersonES6 {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	// 原型方法
	sayName() {
		console.log(`名字是${this.name}`)
	}
	// 静态方法
	static staticFunction() {
		console.log("我是静态方法")
	}
}
let es6 = new PersonES6("es6", 2015)
for (let p in es6) {
	console.log(p) // 只打印了 "name", "age"
}
```

我们会发现`class`中的原型方法`sayName`没有被打印出，证明无法枚举。

### 调用性

第二个区别就是 ES6 中的`class`必须通过`new`关键字来调用。

我们如何理解呢，先看 ES5，我们直接调用函数，而没有用`new`：

```js
function PersonES5(name, age) {
	this.name = name
	this.age = age
}
PersonES5.prototype.sayName = function () {
	console.log(`名字是${this.name}`)
}
PersonES5.staticFunction = function () {
	console.log("我是静态方法")
}
let a = PersonES5()
console.log(a) // undefined
```

它没有报错，虽然`a`最终为`undefined`，但如果换成 ES6 的 `class`：

```js
class PersonES6 {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	// 原型方法
	sayName() {
		console.log(`名字是${this.name}`)
	}
	// 静态方法
	static staticFunction() {
		console.log("我是静态方法")
	}
}
// 报错 TypeError: Class constructor PersonES6 cannot be invoked withou 'new'
let es6 = PersonES6("es6", 2015)
```

我们会发现如果不使用`new`关键字来调用，会直接报错。

#### 调用性例子

我们可以看一个例子来说明为什么需要通过`new`来明确调用：

```js
function Person(name, age) {
	this.name = name
	this.age = age
}
var p = Person("su", 19)
console.log(window.name) // 输出 "su"
console.log(window.age) // 输出 19
```

我们会发现如果使用 ES5 中的写法，我们没有使用`new`来调用，然后打印`window.name`和`window.age`会出现结果，为什么呢？

因为如果没有调用方，这个`Person`就是既没有隐式绑定，也没有显式绑定，更没有`new`绑定，所以函数内部的`this`默认指向了`window`，接下来执行就是给`window`上的属性挂值了。

所以如果出现这个场景，而且没有报错，污染了`window`对象却很难察觉。

## 内部方法[[construct]]

`[[construct]]`是 JavaScript 引擎的一个**内部方法**，主要用于创建和初始化对象。我们是不能直接访问它的，它是 JS 引擎在背后用来处理`new`关键字创建新对象的机制。

通过 ECMA 的官方文档，我们会知道不是所有的函数都可以作为构造函数，只有**具有`[[construct]]`**的函数才能作为构造函数。

那么我们如何判断一个函数是否有这个内部方法呢？或者说我们如何判断一个函数是否可以作为构造函数呢？

JS 提供了`Reflect.construct`方法来判断：

```js
function isConstructor(func) {
	try {
		Reflect.construct(Object, [], func)
	} catch (e) {
		return false
	}
}
function Test1() {}
const Test2 = () => {}
console.log(isConstructor(Test1)) // true
console.log(isConstructor(Test2)) // false
```

我们写了一个方法，如果这个函数具有内部方法`[[construct]]`，就会返回`true`，如果不具有内部方法，就会报错，然后被`catch`，返回`false`。

然后我们测试普通函数和箭头函数，发现结果正确，因为普通函数可以作为构造函数来调用，而箭头函数不可以。

### 原型方法 new 调用

了解内部方法后，我们来看，在 ES5 中，我们可以通过`new`方法调用原型方法

```js
function PersonES5(name, age) {
	this.name = name
	this.age = age
}
PersonES5.prototype.sayName = function () {
	console.log(`名字是${this.name}`)
}
PersonES5.staticFunction = function () {
	console.log("我是静态方法")
}
let obj = new PersonES5()
let a = new obj.sayName() // 不会报错
```

我们发现，使用`new`去调用实例对象上的原型方法不会报错，但换成 ES6：

```js
class PersonES6 {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	// 原型方法
	sayName() {
		console.log(`名字是${this.name}`)
	}
	// 静态方法
	static staticFunction() {
		console.log("我是静态方法")
	}
}
let obj = new PersonES6()
let a = new obj.sayName() // 报错
```

这里就会报错，说`sayName`不是一个构造函数，原因是什么，就是内部方法：

- 如果函数有`[[construct]]`内部方法，则可以通过`new`调用
- 如果函数没有`[[construct]]`内部方法，则不可以通过`new`调用

因此`class`中的`sayName`没有`[[construct]]`，就无法被`new`调用了。

我们还可以通过刚刚写的判断方法来验证一下两个的不同：

```js
function isConstructor(func) {
	try {
		Reflect.construct(Object, [], func)
	} catch (e) {
		return false
	}
}
function PersonES5(name, age) {
	this.name = name
	this.age = age
}
PersonES5.prototype.sayName = function () {
	console.log(`名字是${this.name}`)
}
class PersonES6 {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	// 原型方法
	sayName() {
		console.log(`名字是${this.name}`)
	}
}
console.log(isConstructor(PersonES5.prototype.sayName)) // true
console.log(isConstructor(PersonES6.prototype.sayName)) // false
```

会发现 ES5 中的`sayName`具有`[[construct]]`，而 ES6 没有。

因此 ES5 中这类通过`new`调用原型方法，虽然没意义，但不报错是不符合程序逻辑的，而 ES6 中通过`class`就改进了这一点，会直接报错。

## constructor内部属性和外部属性的区别

那么在`class`的`constructor`中内部定义的属性方法和在外部定义的有什么区别？

```js
class Person {
    constructor(name) {
        this.name = name;
        this.say1 = () => {
            console.log("内部属性", this.name)
        }
    }
    say2() {
        console.log("外部属性", this.name)
    }
}
const A = new Person("A")
A.say1()
A.say2()
```

我们打印，会发现结果一致：

![image-20240823210036741](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240823210036741.png)

### 第一个区别

虽然它们看起来一致，但是还是有区别的，第一个区别如下：

- 在`constructor`内部定义的方法实际上是在**每个对象实例**上创建了一个新函数
- 在`constructor`外部定义的方法实际上是在`Person`的原型对象上创建的

我们可以这样验证，打印`A`的原型上的`say1`方法和`say2`方法：

```js
console.log(A.__proto__.say1); // undefined
console.log(A.__proto__.say2); // f say2 { ... }
```

我们发现`say1`是找不到的，因为它不是创建在原型对象上的，而`say2`则相反。

### 第二个区别

它们之间的第二个区别如下：

- 在`constructor`内部定义的方法，是各个实例对象独有的
- 在`constructor`外部定义的方法，所有`Person`实例共享的

我们还是可以通过这个例子来说明：

```js
const A = new Person("A")
const B = new Person("B")
console.log(A.say1 === B.say1) // false
console.log(A.say2 === B.say2) // true
```

`say1`方法是内部定义的，所以它们是独有的，而`say2`是所有`Person`实例共享的。

### 第三个区别

第三个区别如下：

- 在`constructor`内部定义的方法可以被`Object.keys()`遍历
- 在`constructor`外部定义的方法不可以被`Object.keys()`遍历

我们还是可以拿刚刚的例子来说明：

```js
const A = new Person("A")
console.log(Object.keys(A)) // ['name', 'say1']
```

我们会发现`say2`没有打印，证明只有在内部定义的才能被遍历到

### 总结

它们最大的区别就是第一个，即内部是实例本身上定义，外部是原型对象上定义，其他两个区别都是在这个基础上衍生出来的。
