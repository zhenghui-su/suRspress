# 初识 Jotai

之前我们介绍到 React Context 有 re-render 的问题，Jotai 就是为了解决它而发明出来的。

Jotai 核心理念是**原子（atom）**，灵感来自 Recoil，那怎么理解 “原子” 的概念呢？

![image-20240721205046310](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240721205046310.png)

一个前端应用通常由多个组件组合而成，而组件之间自然就有了共享状态的需求，状态管理库就应运而生了，而这时候就诞生了两个派别 —— 以 Redux 为首的单一状态树与 Jotai 为首的原子化状态管理派别。

**原子化**就是指整个应用的外部状态被拆分为了一个个分片的状态片段，每个状态片段保存在各自的 atom 中，各自的 atom 组合交错共同组成了整个应用的状态。

而 Jotai 帮助我们维护各个原子状态以及原子之间的依赖交错关系，并通过原子之间的相互依赖关系阻止应用 re-render，提高性能。

本节让我们来一起快速入门 Jotai。

## Store

Jotai Store 用来存储 atom 的状态，通过 `createStore` 可以创建一个 Jotai Store：

```js
import { createStore } from "jotai";

const myStore = createStore();
```

创建的 Store 可以传入到 `Provider` 中：

```jsx
import { Provider } from "jotai";

const Root = () => (
	<Provider store={myStore}>
		<App />
	</Provider>
);
```

这样被 `Provider` 包裹的子孙组件就可以通过 `useStore` hook 来拿这个 `myStore`，Jotai 内部会创建一个默认的 Store，不传 `store` 参数时默认会使用 Jotai 内部默认的 Store。

Jotai Store 会包含 3 个属性：

- `get`：用来获取 atom 的状态，例如 `myStore.get(countAtom)`。
- `set`：用来修改 atom 的状态，例如 `myStore.set(countAtom, 10)`。
- `sub`：用来订阅 atom，例如：

```jsx
const unsub = myStore.sub(countAtom, () => {
	console.log("countAtom value is changed to", myStore.get(countAtom));
});
```

在这个例子中订阅了 `countAtom`，当它的状态发生变化时会执行后面的回调函数，`sub` 会返回一个函数用来取消订阅。

## atom

Jotai 通过 atom 函数创建一个原子：

```js
import { atom } from "jotai";

const priceAtom = atom(10);
const helloAtom = atom("hello");
const productAtom = atom({ id: 12, name: "su" });
```

原子本身不持有状态，它的状态会被保存在 Jotai Store 中。atom 接收两个参数：

- `read`：用来定义该 atom 的状态，可以接收一个值，或者一个函数。当传入一个函数时我们称它为派生原子，派生原子会基于其他原子之上来定义状态。

```js
import { atom } from "jotai";

const priceAtom = atom(10);
const derivedAtom = atom((get) => get(priceAtom) * 2); // 派生原子
```

- `write`：传入一个函数，定义了如何修改 atom 的状态。

```js
const writeAtom = atom(null, (get, set, update) => {
	const price = get(priceAtom);
	set(priceAtom, price + update);
});
```

根据不同的情况可以将原子划分为三类：

- **只读原子（Read-only atom）**：只传入了 `read`，并且其是一个函数，例如：

```js
const readOnlyAtom = atom((get) => get(priceAtom) * 2);
```

这时候派生原子 `readOnlyAtom` 是不能被修改的，如果我们 `set(readOnlyAtom, newState)` 会报错。

- **只写原子（Write-only atom）**：只传入了 `write` 函数，例如：

```js
const writeOnlyAtom = atom(null, (get, set, update) => {
	const price = get(priceAtom);
	set(priceAtom, price + update);
});
```

这时候尝试去读取 `writeAtom` 拿到的是 `null`。

- **读写原子（Read-Write atom）**：

```js
const readWriteAtom = atom(
	(get) => get(priceAtom) * 2,
	(get, set, update) => {
		set(priceAtom, price + update);
	}
);
```

## hooks

Jotai 的核心 hooks 包含 3 个。

### useAtomValue

通过 `useAtomValue` 可以在 React 组件中拿到 atom 的状态：

```js
import { atom, useAtomValue } from "jotai";

const priceAtom = atom(10);

function App() {
	const price = useAtomValue(priceAtom);
}
```

在这个例子中我们通过 `useAtomValue` 函数获取 `priceAtom` 的状态。这时候你可能会问，即然 Jotai Store 上的 get 函数也可以获取到 atom 的状态，那我们能否这么写呢？

```js
function App() {
	const store = useStore();
	const price = store.get(priceAtom);
}
```

其实 `useAtomValue` 有另外一个作用就是 “订阅”，当使用 `useAtomValue` 时除了拿到 atom 状态以外会完成对它的订阅，当 atom 状态发生变化时会通知该组件重新渲染。

因此，通过 `store.get` 的方式虽然可以正确拿到 price 的值，却不会完成订阅的过程。

比如下面的例子：

```jsx
import { atom, Provider, useAtomValue, useStore } from "jotai";

const priceAtom = atom(0);

function Display() {
	const price = useAtomValue(priceAtom);
	return <div>Display: {price}</div>;
}

function Control() {
	const store = useStore();
	const price = store.get(priceAtom);

	return (
		<div>
			<div>Control: {price}</div>
			<button onClick={() => store.set(priceAtom, 1)}>set price</button>
		</div>
	);
}

export default function App() {
	return (
		<Provider>
			<Display />
			<Control />
		</Provider>
	);
}
```

在这个例子中有两个组件 `<Display />` 和 `<Control />`

其中 `<Display />` 组件使用 `useAtomValue` 来读取状态， `<Control />` 组件使用 `store.get` 读取状态，点击按钮更新 `priceAtom` 的状态。

可以看到，当点击时 `<Control />` 组件的状态并没有发生变化，也就是并没有重新渲染。

### useSetAtom

在 React 组件中调用 `useSetAtom` 会返回一个修改 atom 状态的函数：

```jsx
import { atom, useSetAtom } from "jotai";

const priceAtom = atom(10);

function App() {
	const setPrice = useSetAtom(priceAtom);
	return <button onClick={() => setPrice(10)}>dispatch</button>;
}
```

### useAtom

`useAtom` hook 你可以看作是 `useAtomValue` 和 `useSetAtom` 的集合，调用 `useAtom` 会返回 `[状态, 修改状态函数]` 的二元组，类似 `useState`：

```jsx
import { useAtom } from "jotai";

function App() {
	const [price, setPrice] = useAtom(priceAtom);
}
```

当然调用 `useAtom` 也是会完成订阅的。它的实现也非常简单，就是前面两个 hooks 的集合

```js
function useAtom(atom) {
	const value = useAtomValue(atom);
	const setAtom = useSetAtom(atom);
	return [value, setAtom];
}
```

借助 `useAtomValue` 和 `useAtom` 可以在组件中获取状态以及完成订阅，当组件卸载时会自动取消订阅。借助 `useSetAtom` 和 `useAtom` 可以在组件中拿到修改 atom 状态的方法。

## 原子化与 re-render

### 例子

我们前面说 Jotai 的理念是原子化，各个分片的原子组成了整个应用系统的状态，那么对于派生原子来说，我们来看一个例子：

![image-20240721210708364](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240721210708364.png)

现在有三个 atom —— `derivedAtom2` 依赖 `derivedAtom`，`derivedAtom` 依赖 `countAtom`；有两个组件 —— `<Control />` 依赖 `countAtom`，`<Display />` 依赖 `derivedAtom2`。

```jsx
import { atom, useAtomValue, useSetAtom } from "jotai";

const countAtom = atom(1);

const derivedAtom = atom((get) => get(countAtom) * 2);

const derivedAtom2 = atom((get) => get(derivedAtom) * 3);

function Display() {
	const count = useAtomValue(derivedAtom2);
	return <div>{count}</div>;
}

function Control() {
	const setCount = useSetAtom(countAtom);
	return <button onClick={() => setCount((c) => c + 1)}>Increment</button>;
}

export default function App() {
	return (
		<>
			<Display />
			<Control />
		</>
	);
}
```

一开始的时候展示的状态为 6，如果我们点击按钮会发生什么？直觉告诉我们每次当点击按钮的时候 `countAtom` 会自增 1，展示的 `derivedAtom2` 会自增 6。

![QQ20240316-184152-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/c5fb582ebf454506bafa10898d7a7894~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

结果也确实是如此，Jotai 帮助我们管理原子之间的依赖关系，并根据依赖关系正确触发组件重新渲染。 也正是这种特性能够避免不必要的 re-render。

但是也正是 Jotai 原子化的特性，我们也需要关心如何合理地拆分原子，否则就会带来额外的 re-render 的问题，比如下面的例子：

```jsx
const anAtom = atom({
	count: 10,
	text: "jotai"
});

function Display() {
	const { text } = useAtomValue(anAtom);
	console.log("re-render");
	return <div>text: {text}</div>;
}

function Increment() {
	const setCount = useSetAtom(anAtom);
	return <button onClick={() => setCount((c) => c + 1)}>increment</button>;
}

export default function App() {
	return (
		<>
			<Display />
			<Increment />
		</>
	);
}
```

![QQ20240219-174834-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/1027ee703f0b4315b483a3f26c9ae8cc~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

可以看到，在 `<Display />` 组件中使用了 `anAtom` 中的 `text` 字段，但是当我们修改 `count` 值会发现，即使 `<Display />` 组件中没有用到但随着 `count` 值的变化也会触发 re-render。

那解决办法是什么呢？我们可以将 `anAtom` 状态拆分成两部分：

```jsx
const countAtom = atom(10);
const textAtom = atom("jotai");

function Display() {
	const text = useAtomValue(textAtom);
	console.log("re-render");
	return <div>text: {text}</div>;
}

function Increment() {
	const setCount = useSetAtom(countAtom);
	return <button onClick={() => setCount((c) => c + 1)}>increment</button>;
}

export default function App() {
	return (
		<>
			<Display />
			<Increment />
		</>
	);
}
```

这样 count 值的变化就不会触发额外的 re-render，通过这个例子展示了合理拆分原子的重要性，而不是把整个一坨大的状态塞到一个 atom 中维护。

### atoms in atom

接下来我们介绍一种非常有意思的实践 —— atoms in atom，顾名思义就是将一些 atom 放到一个 atom 中来管理和维护，来看下面这个例子。

首先创建 atoms in atom

```js
const countsAtom = atom([atom(1), atom(2), atom(3)]);
```

接下来在组件使用：

```jsx
const Counter = ({ countAtom }) => {
	const [count, setCount] = useAtom(countAtom);
	return (
		<div>
			{count} <button onClick={() => setCount((c) => c + 1)}>+1</button>
		</div>
	);
};

const Parent = () => {
	const [counts, setCounts] = useAtom(countsAtom);
	const addNewCount = () => {
		const newAtom = atom(0);
		setCounts((prev) => [...prev, newAtom]);
	};
	return (
		<div>
			{counts.map((countAtom) => (
				<Counter countAtom={countAtom} key={countAtom} />
			))}
			<button onClick={addNewCount}>Add</button>
		</div>
	);
};
```

在这个例子中，父组件 `Parent` 读取了 `countsAtom` 的状态，并将一个个子 atom 传入 `Counter` 组件中，例如在应用启动时，`countsAtom` 包含了 3 个 atom，对应创建了 3 个 `Counter` 组件。这样做的好处是当增加 count 时只有对应的 `Counter` 组件 re-render 而不会影响到其余的 `Counter` 组件。

### focusAtom

借助 `focusAtom` 可以选择一部分数据创建新的 atom，来看下面这个例子：

```jsx
const textAtom = focusAtom(anAtom, (optic) => optic.prop("text"));

function Display() {
	const text = useAtomValue(textAtom);
	console.log("re-render");
	return <div>text: {text}</div>;
}
```

在这个例子中，我们将 `text` 状态单独抽离成了一个新的 atom，并将 `<Display />` 组件改为直接从 `textAtom` 获取状态，这样当 `count` 值再发生变化时不会导致 `<Display />` 组件 re-render。

## async

借助 async atom 和 Suspense，可以更加轻松地处理异步逻辑，这里分为 async read atom 和 async write atom。

### async read atom

我们需要向 atom 中传入 async function，例如我们模拟一个异步逻辑，2s 后返回 10，来看下面这个例子：

```js
const anAtom = atom(async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(10);
		}, 2000);
	});
});
```

然后当加载异步逻辑时我们希望展示 loading：

```jsx
const Display = () => {
	const value = useAtomValue(anAtom);
	return <div>value: {value}</div>;
};

export default function App() {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Display />
		</Suspense>
	);
}
```

当 `useAtomValue` 读取状态时 Jotai 会挂起应用，展示 `Suspense` 的 fallback。

![QQ20240219-184857-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/aa2983bec24d41b883c31dae3a722e35~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

### async write atom

来看下面的例子：

```jsx
const countAtom = atom(1);

const request = async () => new Promise((r) => setTimeout(r, 2000, 10));

const Display = () => {
	const [value, increment] = useAtom(countAtom);
	return <div onClick={() => increment(request)}>value: {value}</div>;
};

export default function App() {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<Display />
		</Suspense>
	);
}
```

我们可以在更新状态时通过传入 promise 来触发挂起，Jotai 会等待 promise 被 resolve，并用值更新 atom 的状态。

![QQ20240219-185745-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/8df2c37df81f40b09ef777681c93029a~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

## 总结

本节介绍了 Jotai 的基本概念，还有快速上手，下节我们来探讨 Jotai 内部的核心。
