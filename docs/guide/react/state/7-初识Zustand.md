# 初识 Zustand

什么是一个好用的库？本人看来就是简单实用，没有复杂的概念，符合直觉。Zustand 就是一个非常符合的库，使用简单方便。

在本章节中，我们会介绍 Zustand 的基本用法与思想

本项目基于 Monorepo 架构，详见 Github 地址：[state-management-learning](https://github.com/zhenghui-su/state-management-learning)

## Todos 案例

本章中通过完成一个 todos 需求带领大家快速入门 Zustand

> 项目 Github 地址：[todos](https://github.com/zhenghui-su/state-management-learning/tree/master/examples/zustand/todos)

这是一个初始版本，在后续章节会进一步进行性能优化。

你可以在`examples/zustand`下先通过`npx create-react-app todos --template typescript`创建一个新项目

### 安装 Zustand

你可以根据不同的包管理方案任意选择

```bash
// npm
npm install zustand
// yarn
yarn add zustand
// pnpm
pnpm add zustand
```

为了让页面更好看一些，我们同时也安装一下 `antd` 和 `@react-spring/web`。

```bash
npm i antd @react-spring/web
```

总体目录如下，觉得乱的可以先创建：

![image-20240717160635240](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717160635240.png)

### 创建 store

我们先在 src 下创建一个`shared`目录，创建`index.ts`用于存放类型：

```typescript
export type FilterType = "all" | "completed" | "incompleted";

export type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

export type Store = {
	todos: Array<Todo>;
	filter: FilterType;
	setFilter: (filter: FilterType) => void;
	setTodos: (fn: (todos: Array<Todo>) => Array<Todo>) => void;
};
```

在 src 下新建`store`目录，新建`useStore.ts`，通过 Zustand 的 `create` 可以创建一个 Store：

```js
import { create } from "zustand";
import { Todo, Store, FilterType } from "../shared";

export const useStore =
	create <
	Store >
	((set) => ({
		filter: "all",
		todos: [],
		setFilter(filter: FilterType) {
			set({ filter });
		},
		setTodos(fn: (todos: Array<Todo>) => Array<Todo>) {
			set((prev) => ({ todos: fn(prev.todos) }));
		}
	}));
```

可以看到，我们通过 `create` 创建了一个 Store，包含了：

- `filter` 代表选择项，可以选择 `all` 代表全部工作，`completed` 代表已完成项，`incompleted` 代表待完成项。
- `todos` 代表代办事项，其中每个 todo item 中包含了 `title` 代表事项名称和 `completed` 代表是否完成。
- `setFilter` 用来修改 `filter` 数据。
- `setTodos` 用来修改 `todos` 数据。

如下，可以看到整个页面大致分为三块，下面我们分别来对每一部分进行实现。

![image-20240717160315791](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717160315791.png)

我们从大到小以此来，先 App 组件

### App.tsx

在 `<App />` 组件中返回内容被 `<form></form>` 包裹，并提供一个 `add` 函数，当用户在表单内的一个 `input` 字段中按下回车键（Enter）时会执行 `onSubmit` 回调函数。

当执行 `add` 时，将 `<input />` 内容插入到 Zustand Store 里，并清空内容。

```tsx
import { FormEvent } from "react";
import { useStore } from "./store/useStore";
import { Filter } from "./components/Filter";
import { Filtered } from "./components/Filtered";

let keyCount = 0;

const App = () => {
	const { setTodos } = useStore();
	const add = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const title = e.currentTarget.inputTitle.value;
		e.currentTarget.inputTitle.value = "";
		setTodos((prevTodos) => [
			...prevTodos,
			{ title, completed: false, id: keyCount++ }
		]);
	};

	return (
		<form onSubmit={add}>
			<Filter />
			<input name="inputTitle" placeholder="Type ..." />
			<Filtered />
		</form>
	);
};

export default App;
```

### Filter.tsx

在 src 下新建目录 `components` 目录用于存放我们的组件，新建`Filter.tsx`

这里提供了三个 `radio`，点击每个按钮时更新 `filter` 字段：

```tsx
import { Radio } from "antd";
import { useStore } from "../store/useStore";

export const Filter = () => {
	const { filter, setFilter } = useStore();
	return (
		<Radio.Group onChange={(e) => setFilter(e.target.value)} value={filter}>
			<Radio value="all">All</Radio>
			<Radio value="completed">Completed</Radio>
			<Radio value="incompleted">Incompleted</Radio>
		</Radio.Group>
	);
};
```

### Filtered.tsx

新建`Filtered.tsx`，`<Filtered />` 组件包含了全部的 Todo 列表，我们可以把每个 Todo 项单独拆成一个组件 `<TodoItem />`，让代码更干净一些。

在 `<Filtered />` 组件里读取 Store 的 `todos` 和 `filter` 字段，并根据 `filter` 字段筛选 `todos` 。

```tsx
import { a, useTransition } from "@react-spring/web";
import { useStore } from "../store/useStore";
import { TodoItem } from "./TodoItem";

export const Filtered = () => {
	const { todos, filter } = useStore();
	const filterTodo = todos.filter((todo) => {
		if (filter === "all") return true;
		if (filter === "completed") return todo.completed;
		return !todo.completed;
	});
	const transitions = useTransition(filterTodo, {
		keys: (todo) => todo.id,
		from: { opacity: 0, height: 0 },
		enter: { opacity: 1, height: 40 },
		leave: { opacity: 0, height: 0 }
	});
	return transitions((style, item) => (
		<a.div className="item" style={style}>
			<TodoItem item={item} />
		</a.div>
	));
};
```

> 注意这里的 a 是 @react-spring/web 里面的，用于丝滑动画

### TodoItem.tsx

对于每个 Todo 项，我们可以决定是否完成，以及是否取消，分别对应 `toggleCompleted` 函数以及 `remove` 函数。

```tsx
import { CloseOutlined } from "@ant-design/icons";
import { Todo } from "../shared";
import { useStore } from "../store/useStore";

export const TodoItem = ({ item }: { item: Todo }) => {
	const { setTodos } = useStore();
	const { title, completed, id } = item;

	const toggleCompleted = () =>
		setTodos((prevTodos) =>
			prevTodos.map((prevItem) =>
				prevItem.id === id ? { ...prevItem, completed: !completed } : prevItem
			)
		);

	const remove = () => {
		setTodos((prevTodos) => prevTodos.filter((prevItem) => prevItem.id !== id));
	};

	return (
		<>
			<input type="checkbox" checked={completed} onChange={toggleCompleted} />
			<span style={{ textDecoration: completed ? "line-through" : "" }}>
				{title}
			</span>
			<CloseOutlined onClick={remove} />
		</>
	);
};
```

至此这个小案例就完成了，最终效果如下：

![_todos](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/_todos.gif)

## 加入 Immer

假如现在有一个复杂的状态，这个状态对象嵌套了多层级，我们称之为`nestedObject`。如下：

```js
const nestedObject = {
	deep: {
		nested: {
			obj: {
				count: 0
			}
		}
	}
};
```

如果我们想要更新这个状态，比如更新里面的 count，应该怎么做？照我们之前的样子：

```js
const useStore = create((set) => ({
	nestedObject,
	updateState() {
		set((prevState) => ({
			nestedObject: {
				...prevState.nestedObject,
				deep: {
					...prevState.nestedObject.deep,
					nested: {
						...prevState.nestedObject.deep.nested,
						obj: {
							...prevState.nestedObject.deep.nested.obj,
							count: ++prevState.nestedObject.deep.nested.obj.count
						}
					}
				}
			}
		}));
	}
}));
```

好吧，实在是太复杂了，而且稍有不慎就会出问题。其实，我们可以借助 [Immer](https://github.com/immerjs/immer) 来优化这个问题，最终上面的代码将被优化为：

```js
import { produce } from 'immer'

const useStore = create((set) => ({
  nestedObject,
  updateState() {
    set(produce(state => {
      ++state.nestedObject.deep.nested.obj.count;
    });
  },
}));
```

这样就清爽多了！但是如果你的业务涉及到服务端渲染，则不建议使用 Immer，因为相比于传统的对象解构这会带来更多的 CPU 消耗，这部分我们后续的小节中会讲到。

## 状态选取

前文提到，我们可以基于 `create` 创建的 hooks 来读取 Store 的状态，但是这有一个缺点，就是当状态发生变化时，即使在该组件中没有使用到，也会发生 re-render。

在`packages/zustand`下新建一个测试目录`__tests__`，新建`re-render.test.tsx`

```tsx
import { act, fireEvent, render } from "@testing-library/react";
import { create } from "zustand";

type FilterType = "all" | "completed" | "incompleted";

type Todo = {
	id: number;
	title: string;
	completed: boolean;
};

type State = {
	todos: Array<Todo>;
	filter: FilterType;
};

type Actions = {
	setFilter: (filter: FilterType) => void;
	setTodos: (fn: (todos: Array<Todo>) => Array<Todo>) => void;
	reset: () => void;
};

const INITIAL_STATE: State = {
	filter: "all",
	todos: [{ title: "吃饭", completed: false, id: 0 }]
};

const useStore = create<State & Actions>((set) => ({
	...INITIAL_STATE,
	setFilter(filter) {
		set({ filter });
	},
	setTodos(fn) {
		set((prev) => ({ todos: fn(prev.todos) }));
	},
	reset() {
		set(INITIAL_STATE);
	}
}));

beforeEach(() => {
	jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
	(console.warn as jest.Mock).mockRestore();
	useStore.getState().reset();
});
```

先基本的一些引入一下，然后我们写测试：

```tsx
describe("测试re-render", () => {
	it("不加selector", async () => {
		let renderCount = 0;

		const Display = () => {
			renderCount++; // 每次re-render就会增加1
			const { todos } = useStore();
			return (
				<div>
					{todos.map((todo) => (
						<div key={todo.id}>title: {todo.title}</div>
					))}
				</div>
			);
		};

		const Control = () => {
			const { setFilter } = useStore();
			return <button onClick={() => setFilter("completed")}>dispatch</button>;
		};

		const App = () => (
			<>
				<Display />
				<Control />
			</>
		);
		const { getByText } = render(<App />);
		act(() => {
			fireEvent.click(getByText("dispatch"));
		});
		expect(renderCount).toBe(2);
	});
});
```

创建了一个 `<Control />` 组件用来更新 `filter` 字段，借助 `@testing-library/react` 来模拟点击情况，借助 Jest 的断言来观察 `<Display />` 的 re-render 情况：

```js
expect(renderCount).toBe(2);
```

运行测试，发现成功，证明发生了 re-render：

![image-20240717165419061](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717165419061.png)

我们将原先的：

```js
const { todos } = useStore();
```

改为如下，增加 selector：

```js
const todos = useStore((state) => state.todos);
```

然后将测试断言改一下：

```js
expect(renderCount).toBe(1);
```

重新运行测试，成功，证明增加了 selector 就不会有 re-render 问题了

![image-20240717165541686](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717165541686.png)

但有些开发者经常会忘记向 `useStore` 中传入 selector，从而带来性能问题。Zustand 官方提供了一种方式，即使用 `createSelectors` 来自动生成 selector：

```typescript
import { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S
) => {
	let store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (let k of Object.keys(store.getState())) {
		(store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
	}

	return store;
};
```

这样上面 Todos 代码会变为：

```js
const useStoreBase = create((set) => ({
	filter: "all",
	todos: [],
	setFilter(filter) {
		set({ filter });
	},
	setTodos(fn) {
		set((prev) => ({ todos: fn(prev.todos) }));
	}
}));

const useStore = createSelectors(useStoreBase);

// 获取属性
const todos = useStore.use.todos();

// 获取方法
const setTodos = useStore.use.setTodos();
```

可以看到这样就不容易产生漏传 selector 的问题了，因为 `createSelectors` 内部已经包了一层传好的。

## 浅层比较 shallow

默认情况下，当状态变化时，会先根据传入的 selector 函数计算最新的状态，之后会以 [`Object.is`](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2Fis) 的形式来对比与上一次计算的状态是否一致来决定是否触发 re-render。

```js
const { todos, setFilter } = useStore((state) => ({
	todos: state.todos,
	setFilter: state.setFilter
}));
```

当第一次渲染时会调用这里的 `useStore` 计算一次状态，这时候计算好的状态是一个包含了 `todos` 和 `setFilter` 的对象。接下来我们更新 Store 里的 `filter` 字段，这时候 Zustand 会再次调用回调函数，计算一遍状态，生成一个新的对象。然后以 `Object.is` 的形式来对比前后两次对象是否发生变化，很显然虽然 `todos` 和 `setFilter` 都没有变，但是对象的引用改变了，`Object.is` 仍然会返回 `false`。

这种问题通常的解决方案是**浅层比较**，即对比对象里层的`todos` 和 `setFilter` 是否改变了，Zustand 提供了一个浅层比较的实现 `shallow`，我们基于此来改写上述代码

先写一个不加 shallow 的测试

```tsx
it("不加shallow", async () => {
	let renderCount = 0;

	const Display = () => {
		renderCount++; // 每次re-render就会增加1
		const { todos, setFilter } = useStore((state) => ({
			todos: state.todos,
			setFilter: state.setFilter
		}));
		return (
			<div>
				{todos.map((todo) => (
					<div key={todo.id}>title: {todo.title}</div>
				))}
			</div>
		);
	};

	const Control = () => {
		const { setFilter } = useStore();
		return <button onClick={() => setFilter("completed")}>dispatch</button>;
	};

	const App = () => (
		<>
			<Display />
			<Control />
		</>
	);
	const { getByText } = render(<App />);
	act(() => {
		fireEvent.click(getByText("dispatch"));
	});
	expect(renderCount).toBe(2);
});
```

然后在写一个加 shallow 的测试：

```tsx
it("加shallow", async () => {
	let renderCount = 0;

	const Display = () => {
		renderCount++; // 每次re-render就会增加1
		const { todos, setFilter } = useStore(
			(state) => ({
				todos: state.todos,
				setFilter: state.setFilter
			}),
			shallow
		);
		return (
			<div>
				{todos.map((todo) => (
					<div key={todo.id}>title: {todo.title}</div>
				))}
			</div>
		);
	};

	const Control = () => {
		const { setFilter } = useStore();
		return <button onClick={() => setFilter("completed")}>dispatch</button>;
	};

	const App = () => (
		<>
			<Display />
			<Control />
		</>
	);
	const { getByText } = render(<App />);
	act(() => {
		fireEvent.click(getByText("dispatch"));
	});
	expect(renderCount).toBe(1);
});
```

运行测试，如下，成功，这样就不会带来额外的 re-render 了

![image-20240717170207635](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717170207635.png)

另外，Zustand 也提供了一个 hook `useShallow` 来解决上面的问题

我们新增加一个测试：

```tsx
it("使用useShallow", async () => {
	let renderCount = 0;

	const Display = () => {
		renderCount++; // 每次re-render就会增加1
		const { todos, setFilter } = useStore(
			useShallow((state) => ({
				todos: state.todos,
				setFilter: state.setFilter
			}))
		);
		return (
			<div>
				{todos.map((todo) => (
					<div key={todo.id}>title: {todo.title}</div>
				))}
			</div>
		);
	};

	const Control = () => {
		const { setFilter } = useStore();
		return <button onClick={() => setFilter("completed")}>dispatch</button>;
	};

	const App = () => (
		<>
			<Display />
			<Control />
		</>
	);
	const { getByText } = render(<App />);
	act(() => {
		fireEvent.click(getByText("dispatch"));
	});
	expect(renderCount).toBe(1);
});
```

运行测试，成功，没有 re-render：

![image-20240717170310146](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240717170310146.png)

也就是说，`useShallow` 是另一种解决 re-render 的方案，也是目前 Zustand 的推荐用法。

## 处理异步操作

Zustand 是一个非常灵活的状态管理库，可以轻松地与异步代码结合使用。

```jsx
import { useEffect } from "react";
import { create } from "zustand";

const useStore = create((set) => ({
	todos: null,
	error: null,
	fetchData: async () => {
		try {
			const res = await fetch(`https://jsonplaceholder.typicode.com/todos`);
			const todos = await res.json();
			set({ todos });
		} catch (error) {
			set({ error });
		}
	}
}));

export default function App() {
	const { todos, fetchData, error } = useStore();

	useEffect(() => {
		fetchData();
	}, []);

	if (!todos) return <div>Loading...</div>;

	if (error) return <div>{error.message}</div>;

	return (
		<div>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>{todo.title}</li>
				))}
			</ul>
		</div>
	);
}
```

在这个例子中，`fetchData` 是一个异步函数，用来拉取 todos 数据并填充到 Zustand Store 中， `App` 组件中则根据不同的状态来判断是渲染 loading、error、还是 todos。

![QQ20240313-090220-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/6246aa3f8a13437e8075c7f8ea48302c~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

## 支持 Flux

在[前置知识](https://www.xiaosu2003.cn/guide/react/state/2-%E5%89%8D%E7%BD%AE%E7%9F%A5%E8%AF%86.html)这一章节中我们介绍了 Flux 的基本概念，Zustand 推荐了一种最佳实践，灵感就来自于 Flux。

1. 单一 Store：对于一个应用的全局数据应该放到一个单一的 Zustand Store 中。
2. 使用`set/setState`来更新状态：Zustand 提供了`create` API 接收一个回调函数，这个回调函数会接收 set 用来更新状态，我们在更新 Store 数据的时候需要用这个 set，这样在更新状态时才能够正确地通知 View 完成更新。
3. 对于 Zustand 可以不需要像其他利用 Flux 理念的库一样通过派发 action 来完成状态的更新，而是在`create`回调函数中集成各种 dispatchers 即可，因此 Zustand 的理念和传统的 Flux 有一些区别。

但 Zustand 也提供了一种方案来支持 Flux：

```js
const types = { increase: "INCREASE", decrease: "DECREASE" };

const reducer = (state, { type, by = 1 }) => {
	switch (type) {
		case types.increase:
			return { grumpiness: state.grumpiness + by };
		case types.decrease:
			return { grumpiness: state.grumpiness - by };
	}
};

const useGrumpyStore = create((set) => ({
	grumpiness: 0,
	dispatch: (args) => set((state) => reducer(state, args))
}));

const dispatch = useGrumpyStore((state) => state.dispatch);
dispatch({ type: types.increase, by: 2 });
```

在上面中我们通过类似于 react-redux 一样定义了一个`reducer`，然后在 create 回调函数中定义了一个`dispatch`函数，并将先前的状态与参数传入到`reducer`中来计算最新的状态。
