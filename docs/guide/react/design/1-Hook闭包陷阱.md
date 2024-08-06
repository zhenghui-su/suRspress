# Hook 闭包陷阱

我们写 Hook 时候会遇到不少的闭包陷阱，这节我们聊一下闭包陷阱和怎么解决它

## 陷阱

用 cra 创建一个项目：

```sh
npx create-react-app --template typescript closure-trap
```

把`index.tsx`改一下：

```tsx
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<App />);
```

然后我们看`App`组件，通过定时器不断累加 count：

```tsx
import { useEffect, useState } from "react";

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setInterval(() => {
			console.log(count);
			setCount(count + 1);
		}, 1000);
	}, []);

	return <div>{count}</div>;
}

export default App;
```

你觉得 count 会每秒加 1 吗？答案是不会，因为`setCount`设置的时候拿到的 count 一直是 0

![image-20240806215634881](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240806215634881.png)

为什么呢？明明每次渲染引用最新的 count 然后加 1，应该没问题，其实这里就形成了闭包陷阱

因为`useEffect`的依赖数组为`[]`，也就是只会执行并保留第一次的 function，那么第一次引用的是当时的 count 即 0，后面的执行就一直用着它的 count 了

![image-20240806215841856](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240806215841856.png)

这就导致了每次执行定时器的时候，都是在 count = 0 的基础上加一。

这就叫做 hook 的闭包陷阱。

## 第一种解法

如何解决它呢？我们都知道`setState`有一个参数为上一次的 state，那么我们就可以改一下：

```tsx
useEffect(() => {
	setInterval(() => {
		console.log(count);
		setCount((count) => count + 1);
	}, 1000);
}, []);
```

这次并没有形成闭包，每次的 count 都是参数传入的上一次的 state，这样功能就正常了。

和用 `setState` 传入函数的方案类似，还可以用 `useReducer` 来解决，因为它是 一个`dispatch` 一个 `action`，不直接引用 state，所以也不会形成闭包：

```tsx
import { Reducer, useEffect, useReducer } from "react";

interface Action {
	type: "add" | "minus";
	num: number;
}

function reducer(state: number, action: Action) {
	switch (action.type) {
		case "add":
			return state + action.num;
		case "minus":
			return state - action.num;
	}
	return state;
}

function App() {
	const [count, dispatch] = useReducer<Reducer<number, Action>>(reducer, 0);

	useEffect(() => {
		console.log(count);

		setInterval(() => {
			dispatch({ type: "add", num: 1 });
		}, 1000);
	}, []);

	return <div>{count}</div>;
}

export default App;
```

## 第二种解法

但有的时候，是必须要用到 state 的，也就是肯定会形成闭包，

比如这里，`console.log` 的 count 就用到了外面的 count，形成了闭包，但又不能把它挪到 `setState` 里去写：

```ts
useEffect(() => {
	console.log(count);
	setInterval(() => {
		setCount((count) => count + 1);
	}, 1000);
}, []);
```

这种情况怎么办呢？通过`useEffect`的依赖数组，当依赖变动的时候，会重新执行 effect。

所以可以这样：

```tsx
import { useEffect, useState } from "react";

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		console.log(count);

		const timer = setInterval(() => {
			setCount(count + 1);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, [count]);

	return <div>{count}</div>;
}

export default App;
```

依赖数组加上了 count，这样 count 变化的时候重新执行 effect，那执行的函数引用的就是最新的 count 值。

这种解法是能解决闭包陷阱的，但在这里并不合适，因为 effect 里跑的是定时器，每次都重新跑定时器，那定时器就不是每 1s 执行一次了。

## 第三种解法

有定时器不能重新跑 effect 函数，那怎么做呢？可以用 `useRef`。

```tsx
import { useEffect, useState, useRef, useLayoutEffect } from "react";

function App() {
	const [count, setCount] = useState(0);

	const updateCount = () => {
		setCount(count + 1);
	};
	const ref = useRef(updateCount);

	ref.current = updateCount;

	useEffect(() => {
		const timer = setInterval(() => ref.current(), 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <div>{count}</div>;
}

export default App;
```

通过 `useRef` 创建 ref 对象保存执行的函数，每次渲染更新`ref.current`的值为最新函数。

这样，定时器执行的函数里就始终引用的是最新的 count。

`useEffect` 只跑一次，保证 `setIntervel` 不会重置，是每秒执行一次。

执行的函数是从 `ref.current` 取的，这个函数每次渲染都会更新，引用着最新的 count。

`ref.current` 的值改了不会触发重新渲染，它就很适合这种保存渲染过程中的一些数据的场景。其实定时器的这种处理是常见场景，我们可以把它封装一下：

```tsx
import { useEffect, useState, useRef } from "react";

function useInterval(fn: Function, delay?: number | null) {
	const callbackFn = useRef(fn);

	useLayoutEffect(() => {
		callbackFn.current = fn;
	});

	useEffect(() => {
		const timer = setInterval(() => callbackFn.current(), delay || 0);

		return () => clearInterval(timer);
	}, []);
}

function App() {
	const [count, setCount] = useState(0);

	const updateCount = () => {
		setCount(count + 1);
	};

	useInterval(updateCount, 1000);

	return <div>{count}</div>;
}

export default App;
```

这里我们封装了个 `useInterval` 的函数，传入 fn 和 delay，里面会用 `useRef` 保存并更新每次的函数。

我们在 `useLayoutEffect` 里更新 `ref.current` 的值，它是在 dom 操作完之后**同步执行**的，比 `useEffect` 更早。

通过 `useEffect` 来跑定时器，依赖数组为 `[delay]`，确保定时器只跑一次，但是 delay 变化的话会重新跑。

在 `useEffect` 里返回 clean 函数在组件销毁的时候自动调用来清理定时器。

这种就叫做自定义 hook，它就是普通的函数封装，没啥区别。

仔细的同学会发现直接在渲染过程中该 `ref.current` 不也一样么，为啥包一层 `useLayoutEffect`？

确实，从结果来看是一样的。但是[文档](https://react.dev/reference/react/useRef#caveats)里不建议：

![image-20240806221336152](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240806221336152.png)

不过这不是什么大问题，ahooks 里面也是直接改了`ref.current`的

上面的 `useInterval` 没有返回 clean 函数，调用者不能停止定时器，所以我们再加一个 ref 来保存 clean 函数，然后返回：

```tsx
function useInterval(fn: Function, time: number) {
	const ref = useRef(fn);

	ref.current = fn;

	let cleanUpFnRef = useRef<Function>();

	const clean = useCallback(() => {
		cleanUpFnRef.current?.();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => ref.current(), time);

		cleanUpFnRef.current = () => {
			clearInterval(timer);
		};

		return clean;
	}, []);

	return clean;
}
```

为什么要用 `useCallback` 包裹返回的函数呢？

因为这个返回的函数可能作为参数传入别的组件，这样用 `useCallback` 包裹就可以避免该参数的变化，配合 `memo` 可以起到减少没必要的渲染的效果。
