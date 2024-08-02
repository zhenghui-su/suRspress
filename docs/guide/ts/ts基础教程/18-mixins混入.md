# mixins 混入

TS 中有混入 Mixins，其实 Vue 也有 mixins 这个东西，你可以把他看作为合并

## 对象混入

可以使用 ES6 的`Object.assign`合并多个对象，此时 people 会被推断成一个交差类型` Name & Age & sex`，注意它是浅拷贝

```ts
interface Name {
	name: string;
}
interface Age {
	age: number;
}
interface Sex {
	sex: number;
}

let people1: Name = { name: "su" };
let people2: Age = { age: 20 };
let people3: Sex = { sex: 1 };

const people = Object.assign(people1, people2, people3);
```

![image-20240802223605918](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802223605918.png)

还有一种简单的方法，通过扩展运算符，不过它也是浅拷贝

```ts
interface A {
	age: number;
}
interface B {
	name: string;
}
let a: A = {
	age: 18
};
let b: B = {
	name: "zhangsan"
};
let c = { ...a, ...b };
console.log(c);
```

![image-20240802224140428](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802224140428.png)

如果想要深拷贝，可以使用`structuredClone()`方法，但需要 Node 18 以上版本以及谷歌 90 版本以上：

```ts
let c = {};
structuredClone(c); // 传入对象即可
```

## 类的混入

需要类混入需要先关闭严格模式，否则无法编译通过，我们想做一个插件类型的混入，比如做一个 Logger 日志相关，在做一个 Html 渲染相关，我们先声明这两个类：

```ts
class Logger {
	log(msg: string) {
		console.log(msg);
	}
}
class Html {
	render() {
		console.log("render");
	}
}
```

然后创建一个类`App`，我们需要将这两个插件类的操作加入到其中，在运行 App 的时候就有日志 Logger 和 Html 渲染相关的操作

```ts
class App {
	run() {
		console.log("run");
	}
}
```

那我们创建一个插件混入函数，帮我们做插件操作，接收一个类，然后我们返回一个新的类去继承这个基类，在其中做去运行 Logger 和 Html 相关操作

```ts
type Custructor<T> = new (...args: any[]) => T;
function pluginMinxins<T extends Custructor<App>>(Base: T) {
	return class extends Base {
		private Logger = new Logger();
		private Html = new Html();
		constructor(...args: any[]) {
			super(...args);
			this.Logger = new Logger();
			this.Html = new Html();
		}
		run() {
			this.Logger.log("run");
		}
		render() {
			this.Logger.log("render");
			this.Html.render();
		}
	};
}
```

最后我们就可以使用它了，如下：

```ts
const mixins = pluginMinxins(App);
const app = new mixins();
app.run();
app.render();
```

![image-20240802225851792](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802225851792.png)

这就在运行 app 的时候出现了打印的日志
