# Class 类

ES6 提供了更接近传统语言的写法，引入了 Class(类) 的概念，作为对象的模板。

通过`class`关键字，可以定义类。基本上，ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。比如之前的一些`interface`对象，改为类型就是下面这样：

```ts
// 定义类
class Person {
	constructor() {}
	run() {}
}
```

## Class 中的变量定义

直接看例子吧：

```ts
class Person {
	constructor(name, age) {
		this.name = name; // 报错
	}
	run() {}
}
```

在 TypeScript 是不允许直接在 constructor 定义变量的 需要在 constructor 上面先声明

```ts
class Person {
	name: string;
	age: number; // 不用会报错
	constructor(name: string, age: number) {
		this.name = name; // 不报错
	}
	run() {}
}
```

但这样，会引发第二个问题，如果定义变量不用，也会报错，所以通过是给默认值或进行赋值来解决

```ts
class Person {
	name: string;
	age: number = 0; // 不报错
	constructor(name: string, age: number) {
		this.name = name; // 不报错
	}
	run() {}
}
```

```ts
class Person {
	name: string;
	age: number;
	constructor(name: string, age: number) {
		this.name = name; // 不报错
		this.age = age;
	}
	run() {}
}
```

这就是 TS 中 Class 如何定义变量的内容了

## 类的修饰符

在 Class 中，有三个修饰符`public`、`private`、`protected`，这个和 Java 类似：

```typescript
class Person {
	public name: string;
	private age: number;
	protected some: any;
	constructor(name: string, age: number, some: any) {
		this.name = name;
		this.age = age;
		this.some = some;
	}
	run() {}
}
```

使用`public`修饰符 可以让你定义的变量内部访问，也可以外部访问，如果不写默认就是`public`

```ts
let man = new Person("chen", 20, "hello");
man.name; // 可以访问
```

使用`private`修饰符，代表定义的变量是私有的，只能在内部访问，不能在外部访问

```ts
let man = new Person("chen", 20, "hello");
man.age; // 不可以访问,报错
```

使用`protected`修饰符，代表定义的变量是私有的，只能在内部和继承的子类中访问，不能在外部访问

```ts
class Man extends Person {
	// 继承了Person
	constructor() {
		super("张三", 19, 1);
		console.log(this.some); // 可以访问
	}
	create() {
		console.log(this.some); // 可以访问
	}
}
let man = new Man();
man.some; // 不可以访问,报错
```

当然这三个修饰符也可以用在函数上，比如`public create()`

## static 静态属性和静态方法

在 Class 中，有一个修饰符`static`，它可以用在属性和方法上：

```ts
class Person {
	public name: string;
	private age: number;
	protected some: any;
	static nb: string = "牛逼";
	constructor(name: string, age: number, some: any) {
		this.name = name;
		this.age = age;
		this.some = some;
		this.nb; // 报错
	}
	static run() {
		return console.log(this.name);
	}
}
```

我们用`static`定义的属性 不可以通过 this 去访问，只能通过类名去调用

```ts
Person.nb;
```

`static` 静态函数，同样也是不能通过 this 去调用 也是通过类名去调用

```ts
Person.run(); // 打印
```

值得注意的是，如果两个函数都是`static`静态的，是可以通过 this 互相调用

```ts
class Person {
	public name: string;
	private age: number;
	protected some: any;
	static nb: string = "牛逼";
	constructor(name: string, age: number, some: any) {
		this.name = name;
		this.age = age;
		this.some = some;
	}
	static run() {
		return this.aaa();
	}
	static a() {
		return "a";
	}
}
```

## interface 定义类

我们知道`interface`可以定义类型，那么类就可以通过`interface`来定义类型，它们之间通过`implements`关键字联系，如果有多个可以使用逗号分隔

```ts
interface PersonClass {
	get(type: boolean): boolean;
}

interface PersonClass2 {
	set(): void;
	asd: string;
}

class A {
	name: string;
	constructor() {
		this.name = "123";
	}
}

class Person extends A implements PersonClass, PersonClass2 {
	asd: string;
	constructor() {
		super();
		this.asd = "123";
	}
	get(type: boolean) {
		return type;
	}
	set() {}
}
```

我们发现 Person 中可以访问 PersonClass2 中的 asd 属性，类型就约束了。

> `super()` 是必须的且要放到最上面，这样你就使用父类的方法了
>
> 原理是父类的`prototype.constructor.call`，可以理解为父类实例化了，你也可以直接`super.`然后调用父类的方法等

## get、set

我们看一个例子：

```ts
class Ref {
	_value: any;
	constructor(value: any) {
		this._value = value;
	}
	get value() {
		return this._value + "标识get";
	}
	set value(newVal) {
		this._value = newVal + "标识set";
	}
}
const ref = new Ref("哈哈哈");
console.log(ref.value);
ref.value = "呵呵呵";
console.log(ref.value);
```

通过 ts-node，运行结果为如下：

![image-20240729232215872](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240729232215872.png)

这个例子就说明了 get 和 set 的作用，它会拦截到我们的操作

get 会拦截读取值的操作，set 会拦截设置值的操作

## 抽象类(基类)

我们可以定义一个类为抽象类，也就叫基类(ikun 类)，通过继承一个派生类去实现基类的一些方法

比如一个场景，有很多车，奔驰，小米 su7，保驰捷，那么我们可以定义一个基类叫汽车 Car，它有共同的 run 方法，然后这些车型去继承 Car，实现自己的 run 方法，比如有智能驾驶啊等

我们看例子，下面这段代码会报错抽象类无法被实例化

```ts
abstract class A {
	public name: string;
}

new A();
```

在看一个例子，就用上面的汽车场景，但还有一个抽象的方法，没错，方法也可以抽象

```ts
abstract class Car {
	public name: string;
	constructor(name: string) {
		this.name = name;
	}
	abstract run(): string;
}

class XiaoMiSu7 extends Car {
	constructor() {
		super("小米su7");
	}
	run() {
		return "小米su7启动";
	}
}
let xiaomi = new XiaoMiSu7();
console.log(xiaomi.run());
```

我们定义的抽象方法必须在派生类实现，也就是说 Car 定义了 run 抽象方法，那么继承它的类就需要实现它，不然会报错

## 小案例

我们可以试着用 Class 写一个简易的虚拟 DOM，参考 Vue2 写法

先定义一下类型等

```ts
interface Options {
	el: string | HTMLElement;
}

interface VueCls {
	init(): void;
	options: Options;
}

interface Vnode {
	tag: string;
	text?: string;
	props?: {
		id?: number | string;
		key?: number | string | object;
	};
	children?: Vnode[];
}
```

非常简单，没有考虑很多，然后实现一下简易的虚拟 DOM：

```ts
class Dom {
	constructor() {}

	private createElement(el: string): HTMLElement {
		return document.createElement(el);
	}

	protected setText(el: Element, text: string | null) {
		el.textContent = text;
	}

	protected render(createElement: Vnode): HTMLElement {
		const el = this.createElement(createElement.tag);
		if (createElement.children && Array.isArray(createElement.children)) {
			createElement.children.forEach((item) => {
				const child = this.render(item);
				this.setText(child, item.text ?? null);
				el.appendChild(child);
			});
		} else {
			this.setText(el, createElement.text ?? null);
		}
		return el;
	}
}
```

然后实现一个简易的 Vue 类，这里就不动态了，就直接写死加几个 div 进去

```ts
class Vue extends Dom implements VueCls {
	options: Options;
	constructor(options: Options) {
		super();
		this.options = options;
		this.init();
	}

	static version() {
		return "1.0.0";
	}

	public init() {
		let app =
			typeof this.options.el == "string"
				? document.querySelector(this.options.el)
				: this.options.el;
		let data: Vnode = {
			tag: "div",
			props: {
				id: 1,
				key: 1
			},
			children: [
				{
					tag: "div",
					text: "我是子节点1"
				},
				{
					tag: "div",
					text: "我是子节点2"
				}
			]
		};
		app?.appendChild(this.render(data));
		console.log(app);

		this.mount(app as Element);
	}

	public mount(app: Element) {
		document.body.append(app);
	}
}
```

然后最后使用一下：

```ts
const v = new Vue({
	el: "#app"
});
```

我们可以使用一下，tsc 编译生成 js 文件，建一个`index.html`，然后弄一个 div，引入一下 js

```html
<div id="#app"></div>
<script src="./index.js"></script>
```

打开`index.html`，查看，发现没问题，插入成功：

![image-20240729233835755](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240729233835755.png)

这只是一个简单的实现，不用考虑太多哈，主要巩固一下 Class 知识。
