# 深入浅出 Immer

前面的初始 Zustand 章节，我们尝试了用 Immer 处理深层次的对象的状态

Immer 是一个革命性的库，它**极大简化了不可变（Immutable）状态处理的复杂性**。让我们在使用诸如 Zustand、Jotai 等基于不可变（Immutable）方案的状态管理库时，可以以一种可变（Mutable）的风格编写状态更新逻辑，从而提高了代码的可读性和维护性，同时保留了 Immutable 的所有优势。

> 本节代码 Github 仓库地址：[immerjs](https://github.com/zhenghui-su/state-management-learning/tree/master/examples/zustand/immerjs)

## Mutable 与 Immutable

在讨论状态管理库时，我们可以从多个角度对其进行分类。其中的一种分类方法就是根据状态的可变性分为 `Mutable（可变）`与`Immutable（不可变）`。

- **Mutable（可变）**：指的是创建对象之后任何状态更新都是基于对原先对象的基础之上进行的，典型的比如 MobX、Valtio 都是属于此类，例如：

```jsx
// Valtio
import { proxy, useSnapshot } from "valtio";

const state = proxy({
	count: 0
});

export default function App() {
	const snapshot = useSnapshot(state);

	return (
		<div>
			<div>{snapshot.count}</div>
			<button onClick={() => (state.count += 1)}>+1</button>
		</div>
	);
}
```

在这个例子中我们可以看到，在点击按钮后会直接在原始状态上进行修改来完成状态的更新，即 `state.count += 1`。

- **Immutable（不可变）**：指的是对象一旦创建就不能被修改，需要基于这个对象生成新的对象而保证原始对象不变。

```jsx
// Zustand
import { create } from "zustand";

const useStore = create((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 }))
}));

export default function App() {
	const { count, increment } = useStore();

	return (
		<div>
			<div>{count}</div>
			<button onClick={increment}>+1</button>
		</div>
	);
}
```

在这个例子中我们可以看到，对于 Immutable 模型的状态管理库而言，不能直接在原先的对象上修改，而是需要生成一个新的对象，包含了修改后的 `count` 值。

当然，上面演示的例子中数据结构非常简单，我们可以举一个更加复杂的、多层嵌套的对象：

```js
const state = {
	deep: {
		nested: {
			obj: {
				count: 1
			}
		}
	}
};
```

那对于这样的数据结构来说，以 Mutable 和 Immutable 方式分别应该如何来更新状态？

```jsx
// Valtio
<button onClick={() => (state.deep.nested.obj.count += 1)}>+1</button>
// Zustand
increment: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1,
        },
      },
    },
  })),
```

可以看到，对于复杂的多层嵌套的数据结构来说，Immutable 方式处理起来非常麻烦，并且容易出错，而 Mutable 方式则更加的自然、清晰和符合直觉。

除此之外，基于 Mutable 方案下的状态管理库内部基于 Proxy 来实现，会监听组件对于状态的使用情况，从而在更新状态时正确触发对应的组件完成 re-render，因此这种方案下我们可以认为性能默认就是最优的，不需要手动来优化。

介绍了这么多 Mutable 方案的优点，它可以自动帮助我们优化性能以及以一种更为自然和符合直觉的方式来更新状态，那么它有什么缺点呢？

Immutable 可以保证可预测性，而 Mutable 则难以保证这一点。举一个例子，比如说我们现在有一个购物车，包含了用户需要购买的商品，相对应的我们需要有一个函数来更新购物车：

```js
// Immutable
function addToCart(cartItems, newItem) {
	return [...cartItems, newItem]; // 返回一个新的数组，不修改原始数组
}

// Mutable
function addToCart(cartItems, newItem) {
	cartItems.push(newItem); // 直接修改原始数组
}
```

可预测性指的是当状态发生变化时，这些变化是可以被追踪以及最终状态的更新结果是明确的。

在上面的例子中，由于 Immutable 每次在更新购物车的时候都会返回一个新的数组，因此每次的更新操作不会影响到原先的状态。

而 Mutable 方式则会直接修改原始的数组，当应用中不同的地方以不可预期的方式修改了这个状态，尤其是在复杂的应用中，最终这个状态可能会难以追踪，在遇到 Bug 时也难以排查。

通过这些例子我们看到了 Mutable 和 Immutable 对立的一面。那对于 Immutable 方式，更新状态时尤其是复杂的多层嵌套对象时有没有更简单的方式呢？

答案正是我们前面介绍的 [Immer](https://github.com/immerjs/immer)，MobX 作者写了一个叫 Immer 的库，可以让我们处理 Immutable 状态更加轻松，允许以 Mutable 的风格编写状态更新逻辑。

结合 Immer，上面的例子可以优化为：

```js
increment: () =>
	set((state) =>
		produce(state, (draft) => {
			++state.deep.nested.obj.count;
		})
	);
```

![image-20240720230440184](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240720230440184.png)

整个过程可以大致分为三个阶段。

1. **生成代理（Draft）**：在这个过程中 Immer 会根据当前状态使用 Proxy 来为我们生成代理，这个代理允许我们以 Mutable 的方式修改对象，而不必担心直接改变原始状态。
2. **修改代理（Draft）**：在这个过程中可以自由地对代理对象进行修改。
3. **返回更新后的状态**：在完成修改后，Immer 会将这些变更应用到一个新的对象上，而不会改动到原始状态。

Immer 可以让我们以 Mutable 的风格来更新状态，在背后 Immer 会基于当前状态为我们生成一个副本（Draft），所有的操作在这个副本上进行，而不会改动到原先的状态，当完成了状态的更改后，Immer 会根据副本的修改为我们计算生成最终的状态。

接下来我们就来对 Immer 的原理进行解析，实现一个简化版本的 Immer。

## 简化版 Immer 实现

理解 Immer 最重要的就是理解在进行状态更新时，只有直接受影响的部分会生成新的状态，而未被修改的部分则会被保留（复用）。这种做法优化了性能和内存使用，同时也避免了无关状态的变化造成组件 re-render 的问题。

```js
const { produce } = require("immer");

const baseState = {
	deep: {
		nested: {
			obj: {
				count: 1
			}
		},
		innerItems: ["item1", "item2"]
	},
	items: [
		{ id: 1, name: "Item 1" },
		{ id: 2, name: "Item 2" }
	]
};
const modifiedState = produce(baseState, (draftState) => {
	draftState.deep.nested.obj.count = 2;
});
console.log(
	"不会改动到原始的状态",
	baseState !== modifiedState,
	baseState.deep.nested.obj.count === 1
); // true true
console.log(
	"modifiedState上count状态更新为2",
	modifiedState.deep.nested.obj.count === 2
); // true
console.log(
	"没改动到的状态则会复用",
	baseState.items === modifiedState.items,
	baseState.deep.innerItems === modifiedState.deep.innerItems
); // true true
```

用一个图来表示上面代码中 `baseState` 与 `modifiedState` 之间的关系：

![image-20240720230658528](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240720230658528.png)

可以看到，对于没有修改的对象，Immer 则会直接复用。好，根据这个原则我们来实现一下源码，这个过程中为了更好地让大家理解，会尽可能地进行简化，只考虑对普通对象的操作，不考虑数组、Map、Set 的情况。

首先 `produce` 会接受两个参数：第一个参数代表初始的状态，第二个参数为一个函数，在这个函数中可以对传入的 Draft 进行自由的修改。根据 `produce` 的定义，我们可以实现主体部分如下：

```js
function produce(base, recipe) {
	// 生成代理（Draft）
	const proxy = createProxy(base);
	// 修改代理（Draft）
	recipe(proxy);
	// 返回更新后的状态
	return processResult(proxy);
}
```

接下来我们需要分别实现 `createProxy` 以及 `processResult`，可以很容易地想到，后续的操作需要基于 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 来实现。为了帮助大家更好地理解后面的代码，这里先来举一个例子

```js
const handler = {
	get(target, prop) {
		console.log("get", target, prop);
		const value = target[prop];
		if (typeof value === "object" && value !== null) {
			return new Proxy(value, handler);
		}
		return value;
	},
	set(target, prop, value) {
		console.log("set", target, prop, value);
		return Reflect.set(target, prop, value);
	}
};

const state = {
	deep: {
		nested: {
			obj: {
				count: 1
			}
		}
	}
};

const proxy = new Proxy(state, handler);
proxy.deep.nested.obj.count = 2;

console.log(state.deep.nested.obj.count);
```

![image-20240720232324428](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240720232324428.png)

在这个例子中，我们创建了一个 `handler` 对象，定义了对代理对象进行操作时如何拦截的 `get` 和 `set` 方法。

- `get`：通过 `get` 我们可以拦截读取对象属性的操作，为了确保连续属性访问（例如深层对象属性的读取）时也能够进行追踪，因此对于返回的子对象也需要进行代理。
- `set`：通过 `set` 我们可以拦截对象的写操作，通过追踪写操作，我们就可以知道哪些对象被修改了，这样 Immer 在生成更新后的状态时，就可以知道去更新哪些部分，而不必重新构建整个对象，从而优化性能。

可以看到，最终在修改 `proxy.deep.nested.obj.count` 状态时，一共触发了三次 `get` 和一次 `set` 操作。

我们继续对 `createProxy` 进行实现：

```js
const DRAFT_STATE = Symbol.for("DRAFT_STATE"); // 定义了一个标识符，方便在代理对象中访问state的内部状态

function latest(state) {
	return state.copy_ || state.base_; // 判断是否有缓存的状态
}

function markChanged(state) {
	// 标记已经修改了
	state.modified_ = true;
	if (state.parent_) {
		// 递归给他的父级依次全部标记
		markChanged(state.parent_);
	}
}

const handler = {
	get(state, prop) {
		if (prop === DRAFT_STATE) return state;
		const source = latest(state);
		const value = source[prop];
		// 如果属性值是对象，并且未被代理，则创建一个新的代理
		if (
			typeof value === "object" &&
			value !== null &&
			value === state.base_[prop]
		) {
			state.copy_ = { ...state.base_ };
			return (state.copy_[prop] = createProxy(value, state));
		}
		return value;
	},
	set(state, prop, value) {
		if (!state.modified_) {
			state.copy_ = { ...state.base_ };
			markChanged(state); // 标记修改
		}
		state.copy_[prop] = value; // 更新状态
		return true;
	}
};

function createProxy(base, parent) {
	const state = {
		modified_: false, // 是否修改过
		parent_: parent, // 父proxy，方便在更新状态时找到父级对其标记modified_
		copy_: null, // 修改后的状态
		base_: base // 原状态
	};
	const proxy = new Proxy(state, handler);
	return proxy;
}
```

Immer 实现中在用 `get` 拦截对象读取操作时会调用 `createProxy` 为每个对象创建对应的 `state` 来管理每个代理对象的状态。包含了是否被修改（`modified_`）、父 proxy（`parent_`）、修改后的状态（`copy_`）以及原状态（`base_`）等信息。

在拦截到访问对象属性操作时，需要更新 `copy_`，即解构 `{ ...state.base_ }`，因为例如当我们在修改 `proxy.deep.nested.obj.count` 时， `deep`、`nested`、`obj` 的引用都需要更新。

除此之外，可以发现我们增加了对 `DRAFT_STATE` 的判断，用于方便在代理对象中访问代理的内部状态，比如我们想要拿到 `modified_` 属性，这样通过 `proxy[DRAFT_STATE].modified_` 就可以直接取到。最后如同上面举的例子一样，调用 `createProxy` 返回了一个新的 proxy 用来追踪后续的操作。

在拦截更新状态的操作时需要进行标记，即调用 `markChanged` 函数，会递归标记 `modified_` 代表子孙对象中包含了修改的状态，方便后续 `processResult` 中高效地完成对 `copy_` 的组装。

最后，我们来实现 `processResult` 函数：

```js
function processResult(proxy) {
	const state = proxy[DRAFT_STATE];
	if (!state.modified_) {
		// 判断是否修改过状态，如果没有则直接复用
		return state.base_;
	}

	Object.entries(state.copy_).forEach(([key, childValue]) => {
		if (childValue[DRAFT_STATE]) {
			const res = processResult(childValue); // 递归
			state.copy_[key] = res;
		}
	});

	return state.copy_;
}
```

可以看到， `processResult` 的实现其实就是递归组装 `copy_` 的过程，当判断当前 state 上不包含 `modified_` 标记，即 `modified_ = false` 时，就代表没有更新过它及其子孙对象的状态，因此直接返回即可，即未被修改的部分则会被保留（复用）。

至此，我们已经实现了一个简化版的 Immer。

用前面的例子来验证一下我们实现的 `produce`：

```jsx
import { produce } from "./produce";

const baseState = {
	deep: {
		nested: {
			obj: {
				count: 1
			}
		},
		innerItems: ["item1", "item2"]
	},
	items: [
		{ id: 1, name: "Item 1" },
		{ id: 2, name: "Item 2" }
	]
};
const modifiedState = produce(baseState, (draftState) => {
	draftState.deep.nested.obj.count = 2;
});
console.log(
	"不会改动到原始的状态",
	baseState !== modifiedState,
	baseState.deep.nested.obj.count === 1
); // true true
console.log(
	"modifiedState上count状态更新为2",
	modifiedState.deep.nested.obj.count === 2
); // true
console.log(
	"没改动到的状态则会复用",
	baseState.items === modifiedState.items,
	baseState.deep.innerItems === modifiedState.deep.innerItems
); // true true
```

运行查看控制台，发现没问题，当然这只是最简单的实现

![image-20240720233148012](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240720233148012.png)

而且在 App 中简单使用也是没有问题的：

```jsx
import { create } from "zustand";
// import { produce } from 'immer'
import { produce } from "./produce";

const useStore = create((set) => ({
	deep: {
		nested: {
			obj: {
				count: 1
			}
		}
	},
	increment: () =>
		set((state) =>
			produce(state, (draft) => {
				draft.deep.nested.obj.count++;
			})
		)
}));

export default function App() {
	const {
		deep: {
			nested: {
				obj: { count }
			}
		},
		increment
	} = useStore();

	return (
		<div>
			<div>{count}</div>
			<button onClick={increment}>+1</button>
		</div>
	);
}
```

这里我们换成了我们的 produce，然后点 +1，没有问题：

![_produce](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/_produce.gif)

至此我们就完成了一个极简版 Immer 的实现
