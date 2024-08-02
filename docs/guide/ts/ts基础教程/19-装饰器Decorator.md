# 装饰器 Decorator

TS 中有着装饰器语法，它们不仅增加了代码的可读性，清晰地表达了意图，而且提供一种方便的手段，增加或修改类的功能

若要启用实验性的装饰器特性，你必须在命令行或`tsconfig.json`里启用编译器选项，你可以通过`tsc --init`生成，然后找到`"experimentalDecorators": true`和`"emitDecoratorMetadata: true"`，将其打开

装饰器语法在 Node 后端方面大量使用，代表性的有 Nest，它是一个集成的 Node 后端框架

## 类装饰器

装饰器是一种特殊类型的声明，它能够被附加到[类声明](https://www.tslang.cn/docs/handbook/decorators.html#class-decorators)，[方法](https://www.tslang.cn/docs/handbook/decorators.html#method-decorators)，[访问符](https://www.tslang.cn/docs/handbook/decorators.html#accessor-decorators)，[属性](https://www.tslang.cn/docs/handbook/decorators.html#property-decorators)或[参数](https://www.tslang.cn/docs/handbook/decorators.html#parameter-decorators)上。

首先定义一个类

```ts
class A {
	constructor() {}
}
```

然后我们可以定义一个类装饰器函数，它会把你用来装饰类的**构造函数**传入你的`watcher`函数当做第一个参数，需要注意，类装饰器的类型需要为`ClassDecorator`，这是内置的

```ts
const watcher: ClassDecorator = (target: Function) => {
	target.prototype.getParams = <T>(params: T): T => {
		return params;
	};
};
```

然后在 A 类上使用，它就会把 A 类的构造函数传入其中

```ts
@watcher
class A {
	constructor() {}
}
```

我们可以验证一下：

```ts
const a = new A();
console.log((a as any).getParams("123"));
```

![image-20240802230848730](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802230848730.png)

这种场景是为了如果类有很多代码，你就可以在它构造函数的原型上去加相关的操作，不会破坏它自身，但又增强了原来的类

在低版本不允许使用`@`，也可以 polyfill，变为如下，它的底层其实就是这样做的

```ts
class A {...}
watcher(A)
const a = new A();
console.log((a as any).getParams("123"));
```

## 装饰器工厂

一个高阶函数，**外层**的函数接受**值**，**里层**的函数最终接受**类的构造函数**，它也是函数柯里化

```ts
const watcher = (name: string): ClassDecorator => {
	return (target: Function) => {
		target.prototype.getParams = <T>(params: T): T => {
			return params;
		};
		target.prototype.getOptions = (): string => {
			return name;
		};
	};
};

@watcher("A类")
class A {
	constructor() {}
}

const a = new A();
console.log((a as any).getParams("123"));
console.log((a as any).getOptions());
```

![image-20240802231205387](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802231205387.png)

## 装饰器组合

就是可以使用多个装饰器，比如下面我有两个装饰器，同时在 A 类上使用也是可以的：

```ts
const watcher = (name: string): ClassDecorator => {
	return (target: Function) => {
		target.prototype.getParams = <T>(params: T): T => {
			return params;
		};
		target.prototype.getOptions = (): string => {
			return name;
		};
	};
};
const watcher2 = (name: string): ClassDecorator => {
	return (target: Function) => {
		target.prototype.getNames = (): string => {
			return name;
		};
	};
};

@watcher2("name2")
@watcher("name")
class A {
	constructor() {}
}

const a = new A();
console.log((a as any).getOptions());
console.log((a as any).getNames());
```

那我们前面讲到类装饰器`ClassDecorator`，自然也会有别的装饰器

## 方法装饰器

方法装饰器使用`MethodDecorator`，它返回三个参数：

- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 成员的名字。
- 成员的属性描述符。

具体如下，属性描述符包括 值，是否可写，是否可枚举，是否可被配置

```ts
[
  {},
  'getList',
  {
    value: [Function: setParasm],
    writable: true,
    enumerable: false,
    configurable: true
  }
]
```

我们来尝试一下方法装饰器，注意这里`@Get`是放在类中的方法上面的

```ts
import axios from "axios";

const Get = (url: string) => {
	const fn: MethodDecorator = (target, key, descriptor) => {
		console.log(target, key, descriptor);
		axios.get(url).then((res) => {
			descriptor.value(res.data);
		});
	};
	return fn;
};

class Http {
	@Get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10")
	getList(data: any) {
		console.log(data);
	}
}
```

这里接口可以用的，我们使用 axios 发个请求，然后把数据会返回到`getList`中，通过`data`接收，然后我们打印一下

![image-20240802233421052](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802233421052.png)

其实这个就是 Nest 中的类似操作，它也非常类似 Java 的注解

## 参数装饰器

那我们方法有装饰器，参数自然也有装饰器，使用`ParameterDecorator`修饰，返回三个参数

- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 成员的名字。
- 参数在函数参数列表中的索引。

比如我们给`data`加一个装饰器`@Result()`，你看我们返回的数据`list`还需要`data.result`，我们就可以使用装饰器解决，不过我们需要存储一个元数据

先下载安装一个库`npm i reflect-metadata`，可以通过`defineMetadata`快速存储元数据，然后通过`getMetadata`在用到的地方取出来

```ts
const Result = () => {
	const fn: ParameterDecorator = (target, key, index) => {
		console.log(target, key, index);
		// 存入
		Reflect.defineMetadata("key", "result", target);
	};
	return fn;
};
```

这个意思是什么呢？`"key"`就是用来存入的信息，你取的时候也要通过`"key"`取出，我们可以换个命名，比如换成`"listData"`

```ts
Reflect.defineMetadata("listData", "result", target);
```

`"result"`的意思是代表你要去那一层，你可以理解为我们上面要`data.result`才能读到`result`的信息，这里就帮我们去做这个`.result`的操作了

`target`自然就是传入的参数了，我们传入的是`data`

然后在`Get`中，我们就可以在 axios 请求后去做取值的操作：

```ts
const Get = (url: string) => {
	const fn: MethodDecorator = (target, _, descriptor: any) => {
		console.log(target, _, descriptor);
		const listData = Reflect.getMetadata("listData", target);
		axios.get(url).then((res) => {
			descriptor.value(listData ? res.data[listData] : res.data);
		});
	};
	return fn;
};
```

可以看到，如果有`result`这一层，那么我们就直接读取这一层的数据，如果没有就用原来的

我们可以打印看一下对比，就很容易明白差异了：

![image-20240802235033601](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802235033601.png)

这是我们直接读`data.result`层的，下面是我们读`data`层的：

![image-20240802233421052](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802233421052.png)

这下明白差异了吧，就是直接读取了`result`层了

## 属性装饰器

顾名思义，用于在属性上，使用`PropertyDecorator`，返回两个参数：

- 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
- 属性的名字。

我们简单使用一下，这个用的不多，了解一下：

```ts
const Name: PropertyDecorator = (target, key) => {
	console.log(target, key);
};
class Http {
	@Name
	su: string;
	constructor() {
		this.su = "su";
	}
	@Get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10")
	getList(@Result() data: any) {
		console.log(data);
	}
}
```

然后运行一下：

![image-20240802235631078](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802235631078.png)
