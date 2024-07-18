# 从 0~1 实现 Zustand 核心

本小节将带领大家从 0 到 1 实现 Zustand 的核心部分。

> 本小节 Github 仓库代码：[zustand](https://github.com/zhenghui-su/state-management-learning/tree/master/packages/zustand)

## 主体搭建

在上一章节中，我们了解了 Zustand 的用法，`create` 可以接收一个函数，并创建一个 Store，最终返回一个 hook 用来获取内部的属性。

好，我们来实现一下这块：

```typescript
const createStore = (createState) => {
	let state; // store内部状态存储于state上
	const getState = () => state;
	const setState = () => {}; // setState就是create接收函数的入参
	const subscribe = () => {}; // 每次订阅时将subscribe加入到listeners，subscribe的作用是触发组件重新渲染
	const api = { getState, setState, subscribe };
	state = createState(setState); // state的初始值就是createState的调用结果
	return api;
};

const useStore = (api, selector, equalityFn) => {};

export const create = (createState) => {
	const api = createStore(createState); // 拿到store，包含了全部操作store的方法
	const useBoundStore = (selector, equalityFn) =>
		useStore(api, selector, equalityFn);
	return useBoundStore;
};
```

可以看到，我们大致实现了 Zustand 的主体部分，其中：

- `createStore`用来创建 Store，内部维护了 Store 的状态以及操作 Store 的函数 API，其中包括了：
  - 获取状态函数 `getState`；
  - 设置状态函数 `setState`；
  - 订阅函数 `subscribe`，组件会订阅这个 Store，当状态发生改变时会重新渲染。
- `useBoundStore` 接收 `selector`（从完整的状态中选取部分状态），`equalityFn`（用来对比选取状态是否发生变化，从而决定是否重新渲染）。
- `useStore` 借助 `useSyncExternalStoreWithSelector` 完成订阅、状态选取、re-render 优化，返回选取的状态。
- `create` 完成上述函数的组合。

## useStore 实现

在实现 `useStore` 之前，我们先来补充一下 Store 的类型，这里由于不知道使用者会传入什么值，我们用一个范型 `T` 来表示，首先是 `getState` 的类型：

```typescript
type GetState<T> = () => T;
```

然后是 `setState` 对应类型，前文提到 `setState` 其实就是传入 `create` 回调函数的参数，用来更新 Store 状态的，在调用时会有三种情况：

1. **完整状态更新**：在 Zustand 中，我们可以传入一个完整的状态对象，用来替换当前的状态，实现整体状态的更新。
2. **部分状态更新**：Zustand 同样支持传入状态的部分内容。在这种情况下，它会自动将传入的部分状态合并到现有状态中，实现部分状态的更新和维护。
3. **函数式更新**：当需要基于当前状态进行计算或逻辑处理时，我们可以向 Zustand 传入一个函数。这个函数接收当前状态作为参数，并返回新的状态或状态的一部分，Zustand 将这个返回结果合并到当前状态中。

据此来实现类型：

```typescript
type SetState<T> = (
	partial: T | Partial<T> | ((state: T) => T | Partial<T>)
) => void;
```

然后是 `subscribe` 对应类型，这里因为 `subscribe` 会作为参数传入到 `useSyncExternalStoreWithSelector` 中，因此我们直接用 `useSyncExternalStoreWithSelector` 定义的类型就好了：

```typescript
type Subscribe = Parameters<typeof useSyncExternalStoreWithSelector>[0];
```

最后，实现一个 Store 的类型包含上述所有 API 的类型：

```typescript
type StoreApi<T> = {
	setState: SetState<T>;
	getState: GetState<T>;
	subscribe: Subscribe;
};
```

通过前文可以得知 `create` 函数会返回一个 hook，即 `useBoundStore`，接收 `selector` 和 `equalityFn`，最终将 `api`、`selector`、`equalityFn` 一起传入 `useStore` 中。 `useStore` 函数实现比较简单，通过前一篇文章我们知道 `useSyncExternalStoreWithSelector` 接收五个参数，分别为：

- 订阅函数：`api.subscribe`。
- 获取客户端状态：`api.getState`。
- 获取服务端状态：`api.getState`。
- 计算最终状态：传入的 `selector`。
- 判断状态变化前后是否一致函数：`equalityFn`。

因此，很容易可以写出 `useStore` 函数源码如下：

```typescript
const useStore = <State, StateSlice>(
	api: StoreApi<State>,
	selector: (state: State) => StateSlice = api.getState as any,
	equalityFn: (a: StateSlice, b: StateSlice) => boolean
) => {
	const slice = useSyncExternalStoreWithSelector(
		api.subscribe,
		api.getState,
		api.getState,
		selector,
		equalityFn
	);
	return slice;
};
```

`selector` 可选传入，不传入默认返回全部状态，传入这里的 `slice` 值为调用 `selector` 的返回结果。

## subscribe 实现

接下来我们实现 `subscribe` 函数，当在组件中获取状态时需要对 Store 进行订阅，这样当 Store 内部状态发生变化时才能够通知组件完成 re-render。订阅函数需要接收一个函数参数（调用这个函数来完成组件的 re-render），并保存这个函数（这里用了 Set 结构来保存），最终需要返回一个函数，当组件卸载时会被调用，用来取消订阅。

```typescript
type StateCreator<T> = (setState: SetState<T>) => T;

const createStore = <T>(createState: StateCreator<T>): StoreApi<T> => {
	const listeners = new Set<() => void>();
	let state: T;
	const setState = () => {};
	const getState = () => state;
	const subscribe: Subscribe = (subscribe) => {
		listeners.add(subscribe);
		return () => listeners.delete(subscribe);
	};
	const api = { setState, getState, subscribe };
	state = createState(setState);
	return api;
};
```

可以看到，相比于第一版的 `createStore` 实现，我们定义了一个 `listeners` 的 Set 结构，并将 `subscribe` 接收的参数保存到 `listeners` 中，这样当 Store 状态发生变化（也就是调用 `setState`）时，依次遍历 `listeners` 保存的所有函数来 re-render 所有订阅该 Store 的组件即可。

## setState 实现

在 `subscribe` 实现一节中我们了解到，触发组件 re-render 的所有函数都会被保存到 `listeners` 中，当状态发生变化时需要依次遍历 `listeners` 的所有参数。因此，我们对于 `setState` 的实现要完成两个内容：

1. 更新 Store 的状态；
2. 遍历 `listeners` 的所有参数。

这里要分为几种情况分别讨论。

- 接收的参数是一个函数，例如：

```typescript
const useDataStore = create((set) => ({
	data: { count: 0, text: "react" },
	inc: () =>
		set((state) => ({
			data: { ...state.data, count: state.data.count + 1 }
		}))
}));
```

这里我们定义了一个 `data` 参数用来保存数据，以及 `inc` 用来对 `count` 自增 1，可以看到我们向 `set` 传入了一个函数，这个函数接收 `state` 代表先前的状态，接下来根据先前的 `count` 来计算最新的 `count`。

因此，在我们实现的版本中，需要判断接收的参数是不是一个函数，如果是一个函数则需要对其进行调用。

- 接收的是一个具体值，例如：

```typescript
const useDataStore = create((set) => ({
	count: 1,
	text: react,
	setCount: () => set({ count: 10 })
}));
```

最终实现版本如下：

```typescript
const setState: SetState<T> = (partial) => {
	const nextState =
		typeof partial === "function"
			? (partial as (state: T) => T)(state)
			: partial;
	if (!Object.is(nextState, state)) {
		state =
			typeof nextState !== "object" || nextState === null
				? (nextState as T)
				: Object.assign({}, state, nextState);
		listeners.forEach((listener) => listener());
	}
};
```

也就是说，当我们在修改状态时，不需要把所有状态都写进去，例如： `() => set((state) => ({ ...state, count: 10 }))`，只需要把要改的部分数据传进去即可，Zustand 会帮助我们做整合，也就是说会以 `Object.assign({}, state, nextState)` 的方式来进行整合。

对于状态的更新是做 patch 而不是直接替换的，因此首先需要判断传入参数的类型，如果是对象，并且不是 `null` 才会进行整合。可以看到这里其实是做了一个优化，当上一次的 `state` 和计算好的 `nextState` 不一致时才会触发 re-render。

## shallow 实现

Zustand 会暴露出 `shallow` 函数来辅助做浅层比较，进一步优化性能，例如当我们在组件中使用时：

如果不向 `useStore` 传入任何参数，则会返回全部的状态，这样当 store 中任何属性发生变化时都会导致组件发生 re-render，例如：

```tsx
const useStore = create(() => {
  text: 'react',
  count: 10,
  name: 'Michael Jordan',
});

const App = () => {
  const { name, count } = useStore();
  return (
    <>
      <div>count: {count}</div>
      <div>name: {name}</div>
    </>
  );
};
```

当 `text` 变化时，即使在 `App` 组件没有用到这个参数，也会导致 `App` 组件 re-render，无疑这会对性能造成影响，我们可以对它做一些优化：

```tsx
const useStore = create(() => {
  text: 'react',
  count: 10,
  name: 'Michael Jordan',
});

const App = () => {
  const { name, count } = useStore(state => ({
    name: state.name,
    count: state.count,
  }, shallow);
  return (
    <>
      <div>count: {count}</div>
      <div>name: {name}</div>
    </>
  );
};
```

可以看到我们传入了一个函数，也就是 `selector`，以及 `shallow`，最终`useStore` 返回的结果就是调用这个函数得到的结果。那 `shallow` 的作用是什么呢？

我们再回忆一下整个流程：

1. 首先组件调用 `useStore` 来拿到 Store 里的数据，这时候组件会订阅 Store。
2. 接下来用户做了一些操作（例如点击事件），触发 Store 状态的更新。
3. 完成 Store 状态更新后，需要依次通知组件重新渲染。

第三步我们是借助 `useSyncExternalStoreWithSelector` 来做的，回忆一下上节课的内容，在触发重新渲染之前 `useSyncExternalStoreWithSelector` 会调用 `selector` 计算一个最新状态，并以 `equalityFn` 规则来对新旧值进行对比。一般来说会以浅层比较的规则，如果你希望深层比较也可以实现一个 `deepEqual` 函数。因此，我们需要实现一版 `shallow` 函数，这样用户就可以直接将我们实现的版本传入即可，就不需要自己实现了。

根据上面描述我们可以得知：`shallow` 接收两个参数，并对这两个参数进行比较，最终返回一个 `boolean` 类型用来代表浅层比较是否校验通过。

我们来实现一个 `shallow` 函数：

```typescript
export function shallow<T>(objA: T, objB: T) {
	if (Object.is(objA, objB)) {
		return true;
	}
	if (
		typeof objA !== "object" ||
		objA === null ||
		typeof objB !== "object" ||
		objB === null
	) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (let i = 0; i < keysA.length; i++) {
		if (
			!Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
			!Object.is(objA[keysA[i] as keyof T], objB[keysA[i] as keyof T])
		) {
			return false;
		}
	}
	return true;
}
```

这里用了 `Object.is` 来比较是否相等，当对比的双方可能为数字时比较推荐用 `Object.is`。`Object.is` 提供了一种更精确的比较方式相比于 `===`：

```typescript
Object.is(+0, -0) + // false
	0 ===
	-0; // true

Object.is(NaN, NaN); // true
NaN === NaN; // false
```

为了证明上面我们实现 Zustand 的准确性，写一个测试：

```tsx
import { act, fireEvent, render } from "@testing-library/react";
import { create } from "../src/index";

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

describe("Zustand 核心功能测试", () => {
	it("组件中正确拿到Store的状态", async () => {
		const App = () => {
			const { filter } = useStore();
			return <div>filter: {filter}</div>;
		};
		const { findByText } = render(<App />);
		await findByText("filter: all");
	});

	it("selector功能正常", async () => {
		let renderCount = 0;

		const Display = () => {
			renderCount++; // 每次re-render就会增加1
			const todos = useStore((state) => state.todos);
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

	it("正确通知组件完成re-render", async () => {
		const App = () => {
			const { filter, setFilter } = useStore();
			return (
				<>
					<div>filter: {filter}</div>
					<button onClick={() => setFilter("completed")}>dispatch</button>
				</>
			);
		};
		const { getByText, findByText } = render(<App />);
		act(() => {
			fireEvent.click(getByText("dispatch"));
		});
		findByText("filter: complete");
	});
});
```

运行单元测试 `pnpm run test`：

![image-20240718230211487](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240718230211487.png)

## 总结

我们从 0 ～ 1 实现了 Zustand 的核心逻辑，我们用一张图来总结一下本章节的核心内容：

![image-20240718225038901](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240718225038901.png)

- `create` 函数创建了 Store。
- 然后有 ComponentA、ComponentB、ComponentC、ComponentD，其中 ComponentA 和 ComponentD 对 Store 订阅，也就是说用到了 Store 的某个或者某些状态。
- 当 Store 状态变化时，会触发所有订阅的组件完成 re-render，在这个图中也就是会触发 ComponentA 和 ComponentD re-render，没有订阅的组件 ComponentB 和 ComponentC 则不会触发 re-render。
