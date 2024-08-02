# namespace 命名空间

我们在工作中无法避免全局变量造成的污染，TypeScript 提供了 namespace 避免这个问题出现

- 内部模块，主要用于组织代码，避免命名冲突。
- 命名空间内的类默认私有
- 通过 `export` 暴露
- 通过 `namespace` 关键字定义

TypeScript 与 ECMAScript 2015 一样，任何包含顶级`import`或者`export`的文件都被当成一个模块。

相反地，如果一个文件不带有顶级的`import`或者`export`声明，那么它的内容被视为全局可见的（因此对模块也是可见的）

## 例子

让我们看一个小例子

命名空间中通过`export`将想要暴露的部分导出，如果不用 export 导出是无法读取其值的

```ts
namespace a {
	export const Time: number = 1000;
	export const fn = <T>(arg: T): T => {
		return arg;
	};
	fn(Time);
}

namespace b {
	export const Time: number = 1000;
	export const fn = <T>(arg: T): T => {
		return arg;
	};
	fn(Time);
}

a.Time;
b.Time;
```

## 嵌套命名空间

```ts
namespace a {
	export namespace b {
		export class Vue {
			parameters: string;
			constructor(parameters: string) {
				this.parameters = parameters;
			}
		}
	}
}

let v = a.b.Vue;

new v("1");
```

## 抽离命名空间

先一个 ts 文件，`a.ts`

```ts
export namespace V {
	export const a = 1;
}
```

然后再一个 ts 文件，`b.ts`

```ts
import { V } from "../observer/index";

console.log(V); // {a:1}
```

## 简化命名空间

```ts
namespace A {
	export namespace B {
		export const C = 1;
	}
}

import X = A.B.C;

console.log(X);
```

## 合并命名空间

**重名**的命名空间会合并

```ts
namespace a {
	export const b = 123;
}
namespace a {
	export const c = 456;
}
```

在使用`a.`的时候，两个都会有代码提示：

![image-20240802154548118](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240802154548118.png)

## 场景

这个命名空间的应用场景是什么呢，比如下面的场景：

我们做一些跨端的项目，比如 H5、Android、Ios、小程序等，然后不同的嵌入不同，可能通过网页 Webview 嵌入，然后每个平台需要调用不同的能力，这时候我们通过命名空间将它们拆分

```ts
namespace ios {
    export const pushNotification = (msg: string, type: number) => {}
}
namespace android {
    export const pushNotification = (msg: string) => {}
    export const callPhone = (phone: string) = > {}
}
namespace miniprogram {
    export const pushNotification = (msg: string) = {}
}
```

当然我们可以只写一个方法，但如果只写一个方法还需要判断等，不如通过命名空间抽离出来，在维护更改的时候也方便快速，ios 就提供 ios 的方法，android 就提供 android 的方法，哪个端的需要增加，就在对应的地方增加，清晰明了
