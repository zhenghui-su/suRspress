# Proxy 和 Reflect

这两个是 ES6 之后出现的新东西，Vue3 的数据响应也是通过 Proxy 做的

## Proxy

**Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）

它的调用如下，参数等会具体介绍

```ts
new Proxy(target, handler);
```

我们来简单使用一下：

```ts
let person = { name: "su", age: 20 };
person.name; // 取值
person.name = "xxx"; // 赋值
// Proxy 支持引用类型 对象 数组 函数 set map
let personProxy = new Proxy(person, {
	// 拦截取值操作
	get() {},
	// 拦截赋值操作
	set(target, key, value, receiver) {
		return true;
	},
	// 拦截函数调用
	apply() {},
	// 拦截 in 操作符
	has() {},
	// 拦截 for in 操作
	ownKeys() {},
	// 拦截 new 操作符
	construct() {},
	// 拦截删除的操作 delete 操作符
	deleteProperty() {}
});
```

Proxy 传入两个参数，一个是`target`，即要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

另一个就是`handler`，它通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。

上面我列举了如`get`和`set`，用来拦截取值和赋值的操作，Proxy 更多的拦截操作可以参考 MDN 文档：[handler 对象的方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#handler_对象的方法)

下面我们再使用一下 Proxy，主要运用 `get`

```ts
let person = { name: "su", age: 18 };
let personProxy = new Proxy(person, {
	get(target, key, receiver) {
		if (target.age <= 18) {
			return Reflect.get(target, key, receiver);
		} else {
			return "su已经成年了";
		}
	}
});
console.log(personProxy.age); // su已经成年了
```

> 注意：`Reflect`和`Proxy`的操作方法是一毛一样的，等会我们再讲

`get`中三个参数，`target`即你代理的对象，`key`即你要取的属性比如`age`，`receiver`即对象本身，我们在这里使用`Reflect`取值就是为了上下文正确

`set`一样，就是多了一个参数`value`，表示你要赋的值

## Reflect

上面我们讲到了`Reflect`，操作方法和`Proxy`一样，这里我们简单使用一下：

```ts
let person = { name: "su", age: 18 };
console.log(Reflect.get(person, "name", person)); // su
console.log(Reflect.set(person, "name", "Su", person)); // true
console.log(person); // { name: 'Su', age: 18 }
```

运行查看一下：

![image-20240804154424537](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804154424537.png)

熟悉一下就好，下面我们根据这个写一个 Mobx 中使用的观察者模式 observable

## 简易观察者模式

我们写一个观察者模式，先创建一个 observable 提供一个可观测的数据：

```ts
const observable = <T extends object>(param: T) => {
	return new Proxy(param, {});
};
```

然后新建一个事件存储，用`Set`：

```ts
const list: Set<Function> = new Set();
```

再加一个订阅函数，没有就存入`Set`中：

```ts
const autorun = (callback: Function) => {
	if (!list.has(callback)) {
		list.add(callback);
	}
};
```

然后我们给上面的`Proxy`加上`set`，使用`Reflect`的`set`，因为它会返回布尔，正好`Proxy`的`set`也需要布尔返回值，就可以搭配了

```ts
const observable = <T extends object>(param: T) => {
	return new Proxy(param, {
		set(target, key, value, receiver) {
			const result = Reflect.set(target, key, value, receiver);
			list.forEach((fn) => fn());
			return result;
		}
	});
};
```

在`set`的时候也需要通知事件`list`，所以`forEach`循环执行

然后我们简单使用一下：

```ts
const personProxy = observable({
	name: "su",
	attr: "man"
});

autorun(() => {
	console.log("有变化啦");
});

personProxy.name = "su2";
```

我们用观察者包裹了这个对象，然后用订阅者`autorun`订阅，在我们的对象发生变化的时候，就会打印出`有变化啦`，我们运行查看一下：

![image-20240804155611490](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804155611490.png)

比如我们再多变化几次，变几次它就会输出几次：

```ts
personProxy.name = "su2";
personProxy.name = "su3";
personProxy.attr = "kunkun";
```

这里变化了三次，它就会输出三次：

![image-20240804155726554](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804155726554.png)

这就实现了一个简单的观察者模式，在变化的时候能够监听到
