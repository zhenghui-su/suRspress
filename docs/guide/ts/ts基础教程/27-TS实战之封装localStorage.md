# TS 实战之封装 localStorage

在我们使用 cookie 的时候是可以设置有效期的，但是 localStorage 本身是没有该机制的，只能人为的手动删除，否则会一直存放在浏览器当中，可不可以跟 cookie 一样设置一个有效期。如果一直存放在浏览器又感觉有点浪费，那我们可以把 localStorage 进行二次封装实现该方案。

## 实现思路

在存储的时候设置一个过期时间，并且存储的数据进行格式化方便统一校验，在读取的时候获取当前时间进行判断是否过期，如果过期进行删除即可。

## 目录结构

本节 Github 仓库地址：[su-storage](https://github.com/zhenghui-su/su-storage)，欢迎 Star

我们通过`pnpm init`初始化一个`package.json`，然后`tsc --init`初始化一个 ts 配置文件

新建`src`目录，新建`enum`存放枚举和`types`存放类型，新建`index.ts`编写主代码

![image-20240805220054004](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805220054004.png)

然后我们改一点配置，`tsconfig.json`将如下配置修改：

```ts
"module": "ESNext"
"moduleResolution": "node"
"strict": false
```

`package.json`修改`type`为`module`：

```ts
"type": "module",
```

然后我们定义一下枚举，即存入 localStorage 的时间字典是什么：

```ts
//字典 Dictionaries    expire过期时间key    permanent永久不过期
export enum Dictionaries {
	expire = "__expire__",
	permanent = "permanent"
}
```

有两个，一个是默认的永不过期，一个是用户传入的过期时间

然后我们写一下类型定义相关，先定义我们封装的类要实现哪些方法：

```ts
export interface StorageClass {
	get: () => void;
	set: () => void;
	remove: () => void;
	clear: () => void;
}
```

先这样，等会参数和返回还需要修改

然后写主要逻辑，在`index.ts`中新建类 Storage 封装 localStorage：

```ts
import { StorageClass } from "./types";

export class Storage implements StorageClass {
	get() {}
	set() {}
	remove() {}
	clear() {}
}
```

一步步来，先看`set`，毕竟设置了才能获取删除清空，那参数就是三个`key`、`value`和`expire`，那么根据`localStorage`来，那么`key`类型是字符串，而`value`就不一定了，根据用户传的，所以可以传一个泛型`T`，`expire`就是过期时间，如果用户传了就按用户，没有传就按照我们默认的永不过期即可，那我们根据之前的枚举，把类型定义完善一下：

```ts
import { Dictionaries } from "../enum";

export type Key = string;
export type Expire = Dictionaries.permanent | number; // 永久或者 时间戳
export interface StorageClass {
	get: () => void;
	set: <T>(key: Key, value: T, expire: Expire) => void;
	remove: () => void;
	clear: () => void;
}
```

然后实现`set`方法，注意存入的时候需要按照我们的格式存入时间戳，方便后续

```ts
	set<T>(key: Key, value: T, expire: Expire = Dictionaries.permanent) {
		// 格式化
		const data = {
			value,
			[Dictionaries.expire]: expire
		};

		localStorage.setItem(key, JSON.stringify(data));
	}
```

就是将用户要传的值和过期时间封装成一个对象，然后序列化存入即可

然后存值已经可以了，我们来写取值`get`相关，先类型定义，这个很简单，根据`key`取值

```ts
get: <T>(key: Key) => void;
```

然后写一下主要逻辑，这里需要判断，因为取不存在的会返回`null`

```ts
	get<T>(key: Key) {
    const value = localStorage.getItem(key);
    if (value) {
      // 如果没存的话去取会返回null, 所以需要判断
      const data = JSON.parse(value);
    } else {

    }
  }
```

但我们取到`data`后，会发现它类型定义不准确为`any`，这样我们写后续的会没提示：

![image-20240805222314657](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805222314657.png)

那我们给`data`定义一下类型，很简单：

```ts
export interface Data<T> {
	value: T;
	[Dictionaries.expire]: Expire;
}
```

然后在`get`里面给`data`一下类型定义：

```ts
const data: Data<T> = JSON.parse(value);
```

然后我们再定义一下返回的类型：

```ts
export interface Result<T> {
	message: string;
	value: T | null;
}
```

然后我们写这个`get`：

```ts
	get<T>(key: Key): Result<T> {
		const value = localStorage.getItem(key);
		if (value) {
			// 如果没存的话去取会返回null, 所以需要判断
			const data: Data<T> = JSON.parse(value);
			const nowTime = new Date().getTime();
			// 判断有没有过期 类型为number一定是时间戳 判断时间戳是否小于当前时间
			if (
				typeof data[Dictionaries.expire] === "number" &&
				data[Dictionaries.expire] < nowTime
			) {
				this.remove(key);
				return {
					message: `您的${key}已过期`,
					value: null
				};
			}
			return {
				message: "获取成功",
				value: data.value
			};
		} else {
			return {
				message: "值无效",
				value: null
			};
		}
	}
```

就是根据不同的情况返回即可，然后我们写`remove`和`clear`，这两个非常简单，类型：

```ts
export interface StorageClass {
	get: (key: Key) => void;
	set: <T>(key: Key, value: T, expire: Expire) => void;
	remove: (key: Key) => void;
	clear: () => void;
}
```

然后主要逻辑：

```ts
	remove(key: Key) {
		localStorage.removeItem(key);
	}
	clear() {
		localStorage.clear();
	}
```

这个封装就写完了，我们需要测试一下好不好使，需要打包一下，在根目录新建`rollup.config.js`和`index.html`，rollup 用来快速打包，`index.html`用来测试

然后我们需要下载一些依赖库，如下：

```bash
pnpm i rollup typescript rollup-plugin-typescript2
```

然后我们编写一下`rollup`打包配置相关：

```js
import ts from "rollup-plugin-typescript2";
import path from "path";
import { fileURLToPath } from "url";
const metaUrl = fileURLToPath(import.meta.url);
const dirName = path.dirname(metaUrl);
export default {
	// 入口文件地址
	input: "./src/index.ts",
	//  输出文件地址
	output: {
		file: path.resolve(dirName, "./dist/index.js")
	},
	//  ts 插件
	plugins: [ts()]
};
```

然后我们配置一下`package.json`的脚本命令：

```ts
	"scripts": {
		"build": "rollup -c"
	},
```

运行`pnpm build`打包，即可出现`dist`目录和下面的`index.js`文件：

![image-20240805224252809](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805224252809.png)

然后我们在`index.html`测试一下：

```html
<script type="module">
	import { Storage } from "./dist/index.js";
	const sl = new Storage();
	//五秒后过期
	sl.set("a", 123, new Date().getTime() + 5000);

	setInterval(() => {
		const a = sl.get("a");
		console.log(a);
	}, 500);
</script>
```

然后用插件`Live Server`打开，或者用库`http-server`：

![image-20240805224443413](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805224443413.png)

五秒后就会提示过期了，然后再次获取就是无效了，这证明没问题了，不过打包只打包一个规范，以后在项目用的时候有可能不同，增强一下打包配置：

```js
import ts from "rollup-plugin-typescript2";
import path from "path";
import { fileURLToPath } from "url";
const metaUrl = fileURLToPath(import.meta.url);
const dirName = path.dirname(metaUrl);
export default {
	// 入口文件地址
	input: "src/index.ts", // 源文件入口
	output: [
		{
			file: "dist/index.esm.js", // package.json 中 "module": "dist/index.esm.js"
			format: "esm", // es module 形式的包， 用来import 导入， 可以tree shaking
			sourcemap: true
		},
		{
			file: "dist/index.cjs.js", // package.json 中 "main": "dist/index.cjs.js",
			format: "cjs", // commonjs 形式的包， require 导入
			sourcemap: true
		},
		{
			file: "dist/index.umd.js",
			name: "su-storage",
			format: "umd", // umd 兼容形式的包， 可以直接应用于网页 script
			sourcemap: true
		}
	],
	//  ts 插件
	plugins: [ts()]
};
```

OK 了，不过还需要把`ts`配置改一下，生成一下类型声明文件：

```ts
{
  "compilerOptions": {
    "declaration": true // 生成*.d.ts
    ...
  }
  ...
}
```

改一下`package.json`来发个包，方便以后下载

```json
{
	"name": "su-storage",
	"version": "1.0.0",
	"description": "可支持过期时间的localStorage",
	"main": "dist/index.js",
	"type": "module",
	"scripts": {
		"build": "rollup -c"
	},
	"keywords": [],
	"author": "suzhenghui",
	"license": "MIT",
	"files": ["dist"],
	"types": "dist/index.d.ts",
	"dependencies": {
		"rollup": "^4.20.0",
		"rollup-plugin-typescript2": "^0.36.0",
		"typescript": "^5.5.4"
	}
}
```

`npm login`登录一下，注意需要`npm`官方源，淘宝源不可以，然后发包`npm publish`：

![image-20240805232712281](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805232712281.png)

我们可以尝试一下，你可以用`npm i -g szh-cli`下载我的脚手架，然后通过`szh create`快速创建一个：

![image-20240805232843493](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805232843493.png)

然后我们下载一波我们刚刚发的包`pnpm i su-storage`，使用一下，提示完全：

![image-20240805233328400](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805233328400.png)

还是用刚刚的，只不过用`Vite + React`项目打开：

![image-20240805233429156](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240805233429156.png)

在框架内使用也毫无问题，至此 TS 基础教程就完结了，如果你想了解更多，可以参考如下几个我的开源项目：

- [szh-cli](https://github.com/zhenghui-su/szh-cli)：简易快捷的命令行工具，TS 编写
- [su-zustand](https://github.com/zhenghui-su/state-management-learning/tree/master/packages/zustand)：简易的 Zustand 实现，TS 编写
- [su-island](https://github.com/zhenghui-su/su-island)：简易的 SSG 生成框架，TS 编写
- [su-discord](https://github.com/zhenghui-su/su-discord)：仿照 Discord 实现的在线服务聊天室，TS + React + Next 编写

上面的完整代码：

- `src/enum`目录下的`index.ts`：

```ts
//字典 Dictionaries    expire过期时间key    permanent永久不过期
export enum Dictionaries {
	expire = "__expire__",
	permanent = "permanent"
}
```

- `src/types`目录下的`index.ts`：

```ts
import { Dictionaries } from "../enum";

export type Key = string;
export type Expire = Dictionaries.permanent | number; // 永久或者 时间戳
export interface Result<T> {
	message: string;
	value: T | null;
}
export interface Data<T> {
	value: T;
	[Dictionaries.expire]: Expire;
}
export interface StorageClass {
	get: (key: Key) => void;
	set: <T>(key: Key, value: T, expire: Expire) => void;
	remove: (key: Key) => void;
	clear: () => void;
}
```

- `src`目录下的`index.ts`

```ts
import { Dictionaries } from "./enum";
import { Data, Expire, Key, Result, StorageClass } from "./types";

export class Storage implements StorageClass {
	get<T>(key: Key): Result<T> {
		const value = localStorage.getItem(key);
		if (value) {
			// 如果没存的话去取会返回null, 所以需要判断
			const data: Data<T> = JSON.parse(value);
			const nowTime = new Date().getTime();
			// 判断有没有过期 类型为number一定是时间戳 判断时间戳是否小于当前时间
			if (
				typeof data[Dictionaries.expire] === "number" &&
				data[Dictionaries.expire] < nowTime
			) {
				this.remove(key);
				return {
					message: `您的${key}已过期`,
					value: null
				};
			}
			return {
				message: "获取成功",
				value: data.value
			};
		} else {
			return {
				message: "值无效",
				value: null
			};
		}
	}
	set<T>(key: Key, value: T, expire: Expire = Dictionaries.permanent) {
		// 格式化
		const data = {
			value,
			[Dictionaries.expire]: expire
		};

		localStorage.setItem(key, JSON.stringify(data));
	}
	remove(key: Key) {
		localStorage.removeItem(key);
	}
	clear() {
		localStorage.clear();
	}
}
```

- `rollup.config.js`打包配置

```js
import ts from "rollup-plugin-typescript2";
import path from "path";

export default {
	// 入口文件地址
	input: "src/index.ts", // 源文件入口
	output: [
		{
			file: "dist/index.esm.js", // package.json 中 "module": "dist/index.esm.js"
			format: "esm", // es module 形式的包， 用来import 导入， 可以tree shaking
			sourcemap: true
		},
		{
			file: "dist/index.cjs.js", // package.json 中 "main": "dist/index.cjs.js",
			format: "cjs", // commonjs 形式的包， require 导入
			sourcemap: true
		},
		{
			file: "dist/index.umd.js",
			name: "su-storage",
			format: "umd", // umd 兼容形式的包， 可以直接应用于网页 script
			sourcemap: true
		}
	],
	//  ts 插件
	plugins: [ts()]
};
```

更多完整可参考 Github 仓库：[https://github.com/zhenghui-su/su-storage](https://github.com/zhenghui-su/su-storage)
