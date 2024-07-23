# 从 0~1 实现 Jotai 核心

要想从 0 到 1 实现 mini-jotai，第一步就需要确定 mini-jotai 包含哪些功能，这里可以试想一下我们平时在项目中是如何使用 Jotai 的。

举一个例子，首先我们会创建一个`atom`，这个`atom`包含我们想要的数据：

```js
const firstNameAtom = atom("");
const lastNameAtom = atom("");
```

接下来，我们会用派生原子（derived atom）来将它们进一步组合起来：

```js
const fullNameAtom = atom((get) => {
  return get(firstNameAtom) + " " + get(lastNameAtom);
});
```

最终，`atom`会在组件中通过`useAtomValue`被使用：

```jsx
const Display = () => {
  const fullName = useAtomValue(fullNameAtom);
  return <div>fullName: {fullName}</div>;
};
```

也可能会在组件中被更新状态：

```jsx
const Controller = () => {
  const setFirstName = useSetAtom(firstNameAtom);
  const setLastName = useSetAtom(lastNameAtom);
  return (
    <>
      <button
        onClick={() => {
          setFirstName("Michael");
        }}
      >
        set first name
      </button>
      <button
        onClick={() => {
          setLastName("Jordan");
        }}
      >
        set last name
      </button>
    </>
  );
};
```

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/9f3c4ac51d8f40df869010f12a90b4e3~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

在一个组件中可以通过 `useAtom`/`useSetAtom`/`useAtomValue` 完成对 atom 的操作：

![image-20240723223311903](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240723223311903.png)

在上面的例子中，当我们点击按钮的时候会触发两个动作：1. 更新 `atom` 状态；2. 触发组件发生 re-render。

这就是 Jotai 的核心能力，所以我们将会实现：

- **atom 函数**：能够完成各类型 atom 的创建。
- **createStore 函数**：创建 Jotai Store，来完成对所有 atom 的管理，即订阅、改变状态、读取状态。
- **核心 hooks**：`useAtom` / `useSetAtom` / `useAtomValue`。

为了更好的帮助大家理解 Jotai 的源码，我们会做一定的简化。

## 从 0~1 实现 Jotai

### atom 实现

`atom()` 函数可以传入两个参数，第一个参数用来定义状态，第二个参数用来更改状态。

首先下一个定义：

- Primitive atom（原始原子）：只传入第一个参数，并且第一个参数不是函数。
- Read-only atom（只读原子）：只传第一个参数，并且第一个参数是一个函数。
- Read-Write atom（可读可写原子）：两个参数均传入。

基于这个定义我们可以实现 `atom` 函数：

```typescript
function atom(read, write) {
  const config = {}; // 其实就是一个对象，没有什么黑魔法
  if (typeof read === "function") {
    config.read = read;
  } else {
    config.init = read;
    config.read = (get) => get(config);
    config.write = (get, set, arg) =>
      set(config, typeof arg === "function" ? arg(get(config)) : arg);
  }
  if (write) {
    config.write = write;
  }
  return config;
}
```

可以看到，`atom` 返回的其实就是一个对象，并没有什么黑魔法，这个对象将传入的读函数和写函数保存了起来，我们在这个基础上来补充一下类型：

```typescript
export type Getter = <Value>(atom: ReadableAtom<Value>) => Value;
export type Setter = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
) => Result;

type Read<Value> = (get: Getter) => Value;
type Write<Args extends unknown[], Result> = (
  get: Getter,
  set: Setter,
  ...args: Args
) => Result;

// Read-only atom（只读原子）
export type ReadableAtom<Value> = {
  debugLabel: string;
  read: Read<Value>;
};

// Read-Write atom（可读可写原子）
export type WritableAtom<Value, Args extends unknown[], Result> = {
  write: Write<Args, Result>;
} & ReadableAtom<Value>;

type SetStateAction<Value> = Value | ((prev: Value) => Value);
// Primitive atom（原始原子）
export type PrimitiveAtom<Value> = WritableAtom<
  Value,
  [SetStateAction<Value>],
  void
>;
```

完成类型定义后，我们来补充一下 `atom` 函数的类型：

```typescript
export function atom<Value, Args extends unknown[], Result>(
  read: Value | Read<Value>,
  write?: Write<Args, Result>
) {
  const config = {} as WritableAtom<Value, Args, Result> & { init?: Value };
  if (typeof read === "function") {
    config.read = read as Read<Value>;
  } else {
    config.init = read;
    config.read = (get) => get(config);
    config.write = ((get: Getter, set: Setter, arg: SetStateAction<Value>) =>
      set(
        config as unknown as PrimitiveAtom<Value>,
        typeof arg === "function"
          ? (arg as (prev: Value) => Value)(get(config))
          : arg
      )) as unknown as Write<Args, Result>;
  }
  if (write) {
    config.write = write;
  }
  return config;
}
```

为什么我们这里没有额外定义 Write-only atom（只写原子）呢？因为对于 Write-only atom 来说，虽然叫“只写”原子，但其实无论如何都要传入第一个参数，只不过我们通常会用 `null` 占位，所以获取的状态也是这里的 `null`，也就是说严格意义上并不存在 Write-only atom 的概念，因此我们这里对概念做了一些简化。

### Hooks 实现

我们对于一个 atom 会有三种操作：1. 读（`get`）；2. 写（`set`）；3. 订阅（`sub`）。

前两个很好理解，那什么是订阅呢？订阅的目的是希望当 `atom` 状态发生变化时，可以通知当前组件来发生 re-render，从而基于最新的状态更新 UI。这个订阅操作是内置在 `useAtomValue` 中的，也就是说当组件调用 `useAtomValue` 来获取 `atom` 状态时，同时也会订阅这个 `atom` 以便当状态变化时可以重新渲染，展示正确的 UI。我们用一个图来表示这个过程：

![image-20240723224402542](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240723224402542.png)

在上面图中只有 ComponentA 和 ComponentC 调用了 `useAtomValue` hook 对 atom 订阅，当 atom 状态变化时也只会触发 ComponentA 和 ComponentC 重新渲染。当然通过上节课的学习我们了解了 `useAtom` 内部会调用 `useAtomValue`, 因此在组件中使用 `useAtom` 也会达到相同的订阅效果。

`get`、`set`、`sub` 三个 Api 在 Jotai 中是通过 `createStore` 函数暴露出来的，也就是：

```typescript
const createStore = () => {
  const readAtom = () => {};
  const writeAtom = () => {};
  const subscribeAtom = () => {};

  return {
    get: readAtom,
    set: writeAtom,
    sub: subscribeAtom,
  };
};

export type Store = ReturnType<typeof createStore>;

let defaultStore: Store | null = null;
export const useStore = () => {
  if (!defaultStore) {
    defaultStore = createStore();
  }
  return defaultStore;
};
```

也就是说会有这么一个 `createStore` 函数用来创建 Store，这个 Store 会暴露出 `get`、`set`、`sub` 三个核心的 Api。同时我们创建了 `useStore` hook 可以创建并缓存 Store。

好！我们现在已经可以基于以上概念来实现 hooks 了，首先我们来实现`useAtom`：

```typescript
export const useSetAtom = () => {};

export const useAtomValue = () => {};

export const useAtom = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
) => {
  return [useAtomValue(atom), useSetAtom(atom)];
};
```

可以看到对于 `useAtom` 来说实现非常简单，只是通过 `useAtomValue` 读取数据，以及通过 `useSetAtom` 拿到修改 atom 状态的方法，并将结果作为一个二元组 `[useAtomValue(atom), useSetAtom(atom)]` 返回出来。接下来我们来实现 `useSetAtom`：

```typescript
export const useSetAtom = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
) => {
  // 获取store
  const store = useStore();
  // 用useCallback包裹一层的目的是保持返回的setAtom引用不变
  const setAtom = useCallback(
    (...args: Args) => {
      return store.set(atom, ...args);
    },
    [store, atom]
  );
  return setAtom;
};

export const useAtomValue = () => {};

export const useAtom = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
) => {
  // useAtom仅仅是调用useAtomValue获取状态，useSetAtom获取更新atom的函数。并返回一个二元组而已。
  return [useAtomValue(atom), useSetAtom(atom)];
};
```

还记得前面我们说的吗，通过 `useStore` 可以拿到 Jotai Store，并且通过 Store 上的 `set` 函数可以更新 `atom` 的状态。因此可以看到，其实`useSetAtom` 只是将 `set` 包了一层而已，同时用 `useCallback` 来保证函数的引用不变。

最后我们来实现 `useAtomValue`：

```typescript
export const useAtomValue = <Value>(atom: ReadableAtom<Value>) => {
  // 获取store
  const store = useStore();

  const [value, rerender] = useReducer((prev) => {
    const nextValue = store.get(atom);
    if (Object.is(prev, nextValue)) {
      // 状态不变则不触发re-render
      return prev;
    }
    return nextValue;
  }, store.get(atom));

  useEffect(() => {
    // 订阅组件
    const unsub = store.sub(atom, rerender);
    // 取消订阅
    return unsub;
  }, [store, atom]);

  return value;
};
```

这里借助了 `useReducer` 来实现状态的更新以及性能的优化。

多提一嘴，当 `useReducer` 接收的函数返回结果不变时，React 不会 re-render，这里使用了 `store.get(atom)` 作为初始状态，也就是传入到 `useReducer` 的第二个参数。同时在 `useEffect` 中，我们对当前 `atom` 进行订阅（`sub`），当 `atom` 状态发生更新时，会调用上面 `useReducer` 返回的 `rerender` 函数来实现重新渲染。

当组件卸载时会进行 `unsub`，即取消订阅。

### Store 实现
