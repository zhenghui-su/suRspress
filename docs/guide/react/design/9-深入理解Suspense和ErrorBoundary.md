# 深入理解 Suspense 和 ErrorBoundary

React 里面有两个组件 Suspense 和 ErrorBoundary，看似没什么关系，但实现原理上非常接近。

如何理解呢？我们新建一个项目：

```sh
npx create-react-app --template=typescript suspense-error-boundary
```

## Suspense

先来看下 Suspense 组件，它一般是和 `React.lazy` 结合用，用来加载一些异步组件。

新建一个组件 `Aaa.tsx`：

```tsx
export default function Aaa() {
	return <div>aaa</div>;
}
```

在 `App.tsx` 里加载用 `React.lazy` + `Suspense` 异步加载它：

```tsx
import React, { Suspense } from "react";

const LazyAaa = React.lazy(() => import("./Aaa"));

export default function App() {
	return (
		<div>
			<Suspense fallback={"loading..."}>
				<LazyAaa></LazyAaa>
			</Suspense>
		</div>
	);
}
```

`fallback` 参数指定在过程中显示的内容，可以传组件，加载完成后，显示懒加载的组件内容

然后我们`npm run start`跑一下，会看到加载时候的内容即`loading...`：

![image-20240813201231028](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813201231028.png)

如果本地加载快，我们可以先用 chrome devtools 改成慢速网络再刷新看看：

![image-20240813201158852](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813201158852.png)

其中`React.lazy`中的`import`是 webpack 提供的用来异步加载模块的 api，它会动态下载模块所在的 chunk，然后从中解析出该模块，拿到 export 的值：

![image-20240813201414195](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813201414195.png)

很多后台管理系统都会使用这个方式，因为不可能一下子把所有路由的组件都下载下来，所以会用 `React.lazy` + `Suspense` 的方式异步加载暂时用不到的路由对应的组件。

大多数情况下，`Suspense`是和 lazy 搭配着使用，不过其实不搭配也可以

比如 Jotai 这个状态管理库，它就支持了 Suspense，我们安装一下：

```sh
npm install jotai
```

然后写一个`App2.tsx`：

```tsx
import { Suspense } from "react";
import { atom, useAtom } from "jotai";

const userAtom = atom(async (get) => {
	const userId = 1;
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`
	);
	return response.json();
});

const UserName = () => {
	const [user] = useAtom(userAtom);
	return <div>User name: {user.name}</div>;
};

export default function App() {
	return (
		<Suspense fallback="Loading...">
			<UserName />
		</Suspense>
	);
}
```

去`index.tsx`把 App 引入改成`import App from './App2'`，访问页面：

![image-20240813201741445](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813201741445.png)

Suspense 依旧生效，但我们不是用 lazy 异步加载，如何触发的呢？现在不急，我们等会就理解了

## ErrorBoundary

现在 React 官网主推 function 组件而不是 class 组件，大部分情况下，function 组件可以解决，但只有一个特性是 class 组件独有的，那就是 `ErrorBoundary`，即**错误边界**

`ErrorBoundary`一般就是这样写的：

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, message: error.message };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <div>出错了： {this.state.message}</div>;
		}
		return this.props.children;
	}
}
```

它一般用于包裹组件，当子组件报错的时候，会把错误传递给它的 `getDerivedStateFromError` 和 `componentDidCatch` 方法。

`getDerivedStateFromError` 接收 error，返回一个新的 state，会触发重新渲染来显示错误对应的 UI。

`componentDidCatch` 接收 error 和堆栈 info，可以用来打印错误日志。

它可以用于发生错误时候的降级渲染以及错误监控，我们写一个`App3.jsx`试一下：

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, message: error.message };
	}

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <div>出错了： {this.state.message}</div>;
		}
		return this.props.children;
	}
}

function Bbb() {
	const b = window.a.b;

	return <div>{b}</div>;
}

export default function App() {
	return (
		<ErrorBoundary>
			<Bbb></Bbb>
		</ErrorBoundary>
	);
}
```

注意这是 jsx，因为不处理 class 组件的类型，用 `ErrorBoundary` 组件包裹 `Bbb` 组件，`Bbb` 组件里会报错，因为 `window.a.b` 不存在。

我们渲染一下，改一下引入，正常情况下报错后会页面白屏，但因为有错误边界，会渲染降级 UI：

![image-20240813202736226](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813202736226.png)

我们尝试去掉`ErrorBoundary`，可以看到页面直接白屏了：

![image-20240813202813522](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813202813522.png)

这就是 `ErrorBoundary` 的作用，捕获子组件抛出的错误，显示对应的 UI，回过头看前面两个方法：

- `getDerivedStateFromError` 修改 state 触发重新渲染，渲染出错误对应的 UI。
- `componentDidCatch` 拿到错误信息，打印日志。

这个，对组件报错的情况做了兜底，所以一般会把它套在最外层的组件。

这个特性目前只有 class 组件有，function 组件还没有对应的东西可以代替。

![image-20240813203030787](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203030787.png)

当然，官网下面还说了可以用`react-error-boundary`这个包，我们就不用自己写了：

```sh
npm install --save react-error-boundary
```

然后使用它：

```tsx
import { ErrorBoundary } from "react-error-boundary";

function Bbb() {
	useEffect(() => {
		throw new Error("xxx");
	}, []);
	return <div>bbb</div>;
}

export default function App() {
	return (
		<ErrorBoundary
			fallbackRender={({ error }) => {
				return (
					<div>
						<p>出错了：</p>
						<div>{error.message}</div>
					</div>
				);
			}}
		>
			<Bbb></Bbb>
		</ErrorBoundary>
	);
}
```

渲染结果如下，可以看到，`ErrorBoundary` 生效了：

![image-20240813203156412](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203156412.png)

需要注意，不只是子层级，任意层级的子组件都可以，这就是为什么我上面说一般套在最外层。

我们试一下多套一层：

```tsx
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

function Bbb() {
	useEffect(() => {
		throw new Error("xxx");
	}, []);
	return <div>bbb</div>;
}

function Aaa() {
	return <Bbb></Bbb>;
}

export default function App() {
	return (
		<ErrorBoundary
			fallbackRender={({ error }) => {
				return (
					<div>
						<p>出错了：</p>
						<div>{error.message}</div>
					</div>
				);
			}}
		>
			<Aaa></Aaa>
		</ErrorBoundary>
	);
}
```

结果依旧成功显示降级 UI：

![image-20240813203349290](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203349290.png)

组件抛错的时候，会向上寻找最近的 `ErrorBoundary` 组件，这也是 boundary 的含义。

## 两者关系

这两个组件介绍完，为什么说它们实现原理类似呢？

其实 Suspense 也是用类似 throw error 的方式实现的，只不过它是用 throw promise 实现的

我们尝试一下：

```tsx
import { Suspense } from "react";

let data, promise;
function fetchData() {
	if (data) return data;
	promise = new Promise((resolve) => {
		setTimeout(() => {
			data = "取到的数据";
			resolve();
		}, 2000);
	});
	throw promise;
}

function Content() {
	const data = fetchData();
	return <p>{data}</p>;
}

export default function App() {
	return (
		<Suspense fallback={"loading data"}>
			<Content />
		</Suspense>
	);
}
```

可以看到，触发了 Suspense：

![image-20240813203603041](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203603041.png)

也就是说，只要 throw 一个 promise，就会被最近的 Suspense 捕获。promise 初始状态展示 fallback，promise 改变状态后展示子组件。

那么`React.lazy`是不是也是基于这个实现的呢，查下源码，确实如此：

![image-20240813203723783](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203723783.png)

`React.lazy`包裹之后，也会 throw 一个 promise 来触发 Suspense，当 promise 改变状态后，再返回拿到的值。

这也是为什么上面的 Jotai 可以支持 Suspense，它的原理也是抛出一个 promise：

![image-20240813203829021](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813203829021.png)

那 Suspense 和 ErrorBoundary 会冲突吗，其实它们互不干涉，一个捕获 error，一个捕获 promise。

在 React 底层中，他会把 throw 的全部捕获 catch 一下：

![image-20240813204102155](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813204102155.png)

然后在里面具体做区分：

- 如果 throw 的是 error，就是 error boundary 的处理逻辑，找最近的一个 ErrorBoundary 组件来处理

- 如果 throw 的是 promise，则是 suspense boundary 的处理逻辑，找最近的 Suspense 组件来处理。

![image-20240813204155439](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813204155439.png)

## 业务

在业务代码中，我们不会用 Suspense 来写这种 loading，大家基本都这样写：

```tsx
import { useEffect, useState } from "react";

function fetchData(): Promise<{ name: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				name: "guang"
			});
		}, 2000);
	});
}

export default function App() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<{ name?: string }>({});

	async function load() {
		setLoading(true);
		const data = await fetchData();
		setData(data);
		setLoading(false);
	}

	useEffect(() => {
		load();
	}, []);

	return <div>{loading ? "loding..." : data.name}</div>;
}
```

查看一下效果，照样渲染：

![image-20240813204307982](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813204307982.png)

它就是用一个 state 来记录 loading 状态即可，如果用 Suspense，还需要 throw 一个 promise 才行，不容易维护，所以一般只在后台管理系统利用`React.lazy` + `Suspense` 配合使用。

当然，如果用了一些支持 Suspense 的库，比如 Jotai、Next.js 这种，它自动做了 throw 的配置，那还不错

比如我们前面的 Jotai 就做了这方面支持：

```tsx
import { Suspense } from "react";
import { atom, useAtom } from "jotai";

const userAtom = atom(async (get) => {
	const userId = 1;
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`
	);
	return response.json();
});

const UserName = () => {
	const [user] = useAtom(userAtom);
	return <div>User name: {user.name}</div>;
};

export default function App() {
	return (
		<Suspense fallback="Loading...">
			<UserName />
		</Suspense>
	);
}
```

这样就不需要我们操心这个了，本来 Suspense 就是用来做这个的，结果现在只有 lazy 加载异步组件的时候才能用。react 团队也在想办法解决这个问题，所以出了一个 use 的 hook，这是 19 版本准备加入的：

![image-20240813204749826](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813204749826.png)

`use`这个 hook 的参数是 promise，它会根据 promise 的状态产生三个结果：

- 当 promise 在 pending 的时候，展示 Suspense 的 fallback。

- 当 promise 是 resolve 的时候，展示 Suspense 的子组件。

- 当 promise 是 reject 的时候，展示 ErrorBoundary 的 fallback。

这样就无需我们自己 throw promise，业务代码也可以使用，但这是 React 19 版本，目前还是实验阶段。

> use 的文档地址：[https://react.dev/reference/react/use](https://react.dev/reference/react/use)

除了官方的，就是剩余的库，框架的自己实现，比如 Jotai：

![image-20240813205021724](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813205021724.png)

待到 React 19 版本发布后，我们就可以实现文档中触发 Suspense 的三个方式了：

![image-20240813205128725](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813205128725.png)

意思如下：

- 用支持 Suspense 的框架，比如 Relay 或者 Next.js
- 使用 lazy 异步加载组件
- 使用 use 读取 Promise 中的值
