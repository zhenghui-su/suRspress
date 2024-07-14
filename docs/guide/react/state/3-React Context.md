# React Context

React Context 是我们在项目中所离不开的一种技术方案，常用来解决状态共享，特别是那些需要在多个不直接关联的组件间共享状态，以及 `prop drilling`（prop 下钻） 问题。

为什么要从 React Context 开始讲起呢？

我们在前面提到，状态可以大致分为三种，即局部状态、全局状态和服务器状态。

诸如 React Context 与 Zustand、Jotai、Valtio 等等都是属于全局状态管理，看似它们都能解决组件之间共享状态的问题。

而这些状态管理库的发明某种程度上是为了解决 React Context 的局限性以及性能问题。那本章就来讨论一下 React Context 性能挑战及其优化之道。

## React Context

在日常代码中经常可以看到数据在多个组件层级中进行传递，即数据会从顶层组件传递到深层子组件，这是一种非常不好的实践，请及时制止！

例如，现在你有深度为 5 层的组件树，顶层 `ComponentA` 维护了一个状态 `count`，在 `ComponentE` 中需要使用到这个状态，这时候通过一层层的传递来达到这个目的：

```jsx
function ComponentA() {
	const count = 10;
	return <ComponentB count={count} />;
}

function ComponentB({ count }) {
	return <ComponentC count={count} />;
}

function ComponentC({ count }) {
	return <ComponentD count={count} />;
}

function ComponentD({ count }) {
	return <ComponentE count={count} />;
}

function ComponentE({ count }) {
	return <div>{count}</div>;
}
```

![image-20240713230139610](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240713230139610.png)

可以看到，在上面的例子中，`count` 属性从 ComponentA -> ComponentB -> ComponentC -> ComponentD -> ComponentE 中逐层传递。这就是典型的 **prop drilling（prop 下钻）。**

因此，不难理解，prop drilling 会很容易引发以下几个问题。

- **产生性能问题**。当你在多个组件间传递同一个属性时，这个属性变化会导致所有组件发生 re-render，即使某些组件没有真正使用到该值，这会导致不必要的开销，从而造成`性能问题`。
- **减少可维护性**。prop drilling 会导致你的代码可读性变差，应用变得难以维护，尤其是应用变得足够复杂时，你会发现很难增加新的功能或者改变现有的逻辑，并且容易滋生 Bug，定位和解决 Bug 也变得更加困难。
- **增加心智负担**。当跨多个组件传递同一个值时，你需要在每一个组件中添加额外的 props，即使这些组件并没有直接使用到。你会发现需要花费更多精力来追踪这个值的去向，以及这个值在哪个组件中真正被使用到，这无疑会在开发和维护中带来更多的心智负担。

而 React Context 就常用来解决这种状态共享（特别是需要在多个不直接关联的组件间共享的状态），以及 `prop drilling` 问题。

遗憾的是，虽然 Context 非常实用，帮助我们解决了很多问题，但是当 React Context 中任意属性发生变化时，会引起所有使用到该 Context 的组件发生 re-render，即重新渲染。但是我们希望当只有组件关心的值（或者说实际使用到的值）发生变化才会导致组件发生 re-render。

关于这种重新渲染的性能问题，可以结合下面这个例子来看下，或许你在业务过程也曾遇到过：

```jsx
import { createContext, useContext, useState } from "react";

const context = createContext(null);

const Count1 = () => {
	const { count1, setCount1 } = useContext(context);
	console.log("Count1 render");
	return <div onClick={() => setCount1(count1 + 1)}>count1: {count1}</div>;
};

const Count2 = () => {
	const { count2 } = useContext(context);
	console.log("Count2 render");
	return <div>count2: {count2}</div>;
};

const StateProvider = ({ children }) => {
	const [count1, setCount1] = useState(0);
	const [count2, setCount2] = useState(0);
	return (
		<context.Provider
			value={{
				count1,
				count2,
				setCount1,
				setCount2
			}}
		>
			{children}
		</context.Provider>
	);
};

const App = () => (
	<StateProvider>
		<Count1 />
		<Count2 />
	</StateProvider>
);

export default App;
```

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/b3e50b215602443e9228cd05e366f584~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

可以看到在 `context` 中包含了 `count1` 和 `count2` 以及改变它们状态的方法，在 `<Count1 />` 与 `<Count2 />` 组件中分别引用了 `count1` 和 `count2`，当修改 `count1` 状态时可以发现 `<Count2 />` 组件也会发生 re-render，也就是重新渲染。

很显然这里有性能上的问题，我们希望当 `count1` 状态发生变化时，不依赖该状态的组件不发生 re-render。

那如何解决这个问题呢？

## 解决方案

### React 官方

最方便的还是依靠 React 官方来直接解决这个问题，其实早在 2021 年 1 月份就有 PR 来实现这个能力：[github.com/facebook/re…](https://github.com/facebook/react/pull/20646)，使用方式如下：

```js
const context = useContextSelector(Context, (c) => c.selectedField);
```

也就是说，我们会**通过传入的第二个参数来选取我们需要的值，只有当这个值发生改变时才重新渲染**，可以看到其实这就是我们想要达到理想的状态。很可惜貌似 React 团队仍在忙于其他更重要的事情，直到今天这个能力也没有被支持。

### 代码层面优化

为了尽量避免无用的 re-render，我们还可以考虑在代码层面通过拆分 context 的方式，以及借助 `memo`、`useMemo` 工具来达到我们的目标。

#### 方法一：拆分 context

将 context 进行拆分，将 "大" context 拆分为多个 "小" context，这样每个组件只关心自己所用到的 context。

![image-20240713231517523](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240713231517523.png)

我们对上面的代码进行改造一下：

```jsx
import { createContext, useContext, useState } from "react";

const context1 = createContext(null);
const context2 = createContext(null);

const Count1 = () => {
	const { count1, setCount1 } = useContext(context1);
	console.log("Count1 render");
	return <div onClick={() => setCount1(count1 + 1)}>count1: {count1}</div>;
};

const Count2 = () => {
	const { count2 } = useContext(context2);
	console.log("Count2 render");
	return <div>count2: {count2}</div>;
};

const StateProvider = ({ children }) => {
	const [count1, setCount1] = useState(0);
	return (
		<context1.Provider
			value={{
				count1,
				setCount1
			}}
		>
			{children}
		</context1.Provider>
	);
};

const StateProvider2 = ({ children }) => {
	const [count2, setCount2] = useState(0);
	return (
		<context2.Provider
			value={{
				count2,
				setCount2
			}}
		>
			{children}
		</context2.Provider>
	);
};

const App = () => (
	<StateProvider>
		<StateProvider2>
			<Count1 />
			<Count2 />
		</StateProvider2>
	</StateProvider>
);

export default App;
```

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/b99ee50f628a49a7b03fc3b32cc3b4be~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

但是这会带来一个新的问题 —— Provider hell，即如果 Context 过多：

```jsx
// Provider hell
<context1.Provider value={}>
  <context2.Provider value={}>
    <context3.Provider value={}>
      <context4.Provider value={}>
        <context5.Provider value={}>
          <context6.Provider value={}>
            {children}
          </context6.Provider>
        </context5.Provider>
      </context4.Provider>
    </context3.Provider>
  </context2.Provider>
</context1.Provider>
```

#### 方法二：借助 memo

将组件进行拆分，拆分出的子组件用 `memo` 包裹。

```jsx
import { createContext, useContext, useState, memo } from "react";

const context = createContext(null);

const Count1 = () => {
	const { count1, setCount1 } = useContext(context);
	console.log("Count1 render");
	return <div onClick={() => setCount1(count1 + 1)}>count1: {count1}</div>;
};

const Count2 = memo(({ count2 }) => {
	console.log("Count2 render");
	return <div>count2: {count2}</div>;
});

const Count2Wrapper = () => {
	const { count2 } = useContext(context);
	return <Count2 count2={count2} />;
};

export default function App() {
	const [count1, setCount1] = useState(0);
	const [count2, setCount2] = useState(0);
	return (
		<context.Provider
			value={{
				count1,
				count2,
				setCount1,
				setCount2
			}}
		>
			<Count1 />
			<Count2Wrapper />
		</context.Provider>
	);
}
```

#### 方法三：借助 useMemo

在组件的 return 中，用 `React.useMemo` 包裹，将 Context 中消费的值，作为其依赖项。

```jsx
import { createContext, useContext, useState, useMemo } from "react";

const context = createContext(null);

const Count1 = () => {
  const { count1, setCount1 } = useContext(context);
  console.log("Count1 render");
  return <div onClick={() => setCount1(count1 + 1)}>count1: {count1}</div>;
};

const Count2 = ({ count2 }) => {
- const { count2 } = useContext(context);
  console.log("Count2 render");
  return <div>count2: {count2}</div>;
};

+ const Count2Wrapper = () => {
+   const { count2 } = useContext(context);
+   return useMemo(() => <Count2 count2={count2} />, [count2]);
+ };

export default function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  return (
    <context.Provider
      value={{
        count1,
        count2,
        setCount1,
        setCount2
      }}
    >
      <Count1 />
      <Count2Wrapper />
    </context.Provider>
  );
}
```

### 社区

社区关于这个问题的解决方案分为了两派：

- 不直接基于 Context 完成状态共享方案，比如我们耳熟能详的 Jotai、React Redux、Zustand 等等，这些库都不是直接基于 React Context 之上进行的改造，或者说是 React Context 的替代方案，本质上没有直接的关联，因此在状态共享的时候自然也就没有了 React Context 的性能问题。
- 以 [use-context-selector](https://github.com/dai-shi/use-context-selector) 为首的直接基于 Context 之上进行的优化：

use-context-selector 的用法非常简单，核心 API：`createContext`/`useContextSelector` 可以用来创建 context 和从 context 选取你需要的属性，如果这个属性没有发生变化则不会导致组件发生 re-render。

```jsx
import React, { useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";

const context = createContext(null);

const Count1 = () => {
	const { count1, setCount1 } = useContext(context);
	const count1 = useContextSelector(context, (state) => state.count1);
	const setCount1 = useContextSelector(context, (state) => state.setCount1);
	console.log("Count1 render");
	return <div onClick={() => setCount1(count1 + 1)}>count1: {count1}</div>;
};

const Count2 = () => {
	const { count2 } = useContext(context);
	const count2 = useContextSelector(context, (state) => state.count2);
	console.log("Count2 render");
	return <div>count2: {count2}</div>;
};

const StateProvider = ({ children }) => {
	const [count1, setCount1] = useState(0);
	const [count2, setCount2] = useState(0);
	return (
		<context.Provider
			value={{
				count1,
				count2,
				setCount1,
				setCount2
			}}
		>
			{children}
		</context.Provider>
	);
};

const App = () => (
	<StateProvider>
		<Count1 />
		<Count2 />
	</StateProvider>
);

export default App;
```

至此我们完成了 React Context 性能问题全部解决方案的讲解，下面，让我们更深入一点，探寻性能问题产生的原因。

## 源码解读：React v18 Context

> 说明：本节展示出来的源码会经过一些简化。

首先来看下面的例子：

```jsx
import { useContext, createContext } from "react";

const context = createContext(0);

const Display = () => {
	const value = useContext(context);
	return <span>{value}</span>;
};

// 展示的是 121
const App = () => {
	return (
		<context.Provider value={1}>
			<Display />
			<context.Provider value={2}>
				<Display />
			</context.Provider>
			<Display />
		</context.Provider>
	);
};

export default App;
```

可以看到，我们在多个地方使用了 `context.Provider`，同时传入了不同的 value，并在跨组件中使用 context 的 `value`。

根据这个简单的例子，我们可以提出以下三个问题，并从这三个问题作为起点，来深入讲解 React v18 Context 源码。

- React Context 是如何做到跨组件传递的？
- React Context 是如何做到每次 `useContext` 时，都可以正确读到最近的 `context.Provider` 传入的 `value`？
- React Context 为什么每次某一属性发生变化，无论组件是否使用到了该值都会引起组件 re-render？

### React Context 如何做到跨组件传递？

首先看 **`createContext`**：

```typescript
export const REACT_PROVIDER_TYPE: symbol = Symbol.for('react.provider');
export const REACT_CONTEXT_TYPE: symbol = Symbol.for('react.context');

function createContext<T>(defaultValue: T): ReactContext<T> {
  const context: ReactContext<T> = { // 可以看到，createContext创建的东西只是一个对象而已，没有任何黑魔法
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue, // 保存了初始传进去的值
    Provider: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };

  return context;
}
```

在一开始，我们会通过 `createContext` 来创建一个 `context`，在使用时我们会使用`context.Provider` 来向其传入实际的 `value`，以便子组件来进行消费。

通过源码可以看到，其实我们通过 `createContext` 创建出来的只是一个对象而已，没有什么黑魔法。

在这个对象中包含了 `Provider`，因此我们才可以取到 `context.Provider`。并且我们向 `createContext` 传入的值会被保存在 `_currentValue` 中。

至于 `$$typeof`，仅仅是为了让 React 知道这个对象实际是什么，比如 `REACT_CONTEXT_TYPE`，React 就知道这是一个 context，如果是 `REACT_PROVIDER_TYPE` 则代表它是一个 `Provider`。

接下来看 **`useContext`**。

还记得自己经常被面试官问到的一个 React 问题吗：为什么 React Hooks 不能脱离组件来使用？接下来会告诉你最准确的答案！

以 `useContext` 为例，我们来看它的源码：

```typescript
export function useContext<T>(Context: ReactContext<T>): T {
	const dispatcher = resolveDispatcher();
	return dispatcher.useContext(Context);
}
```

可以看到，首先会调用 `resolveDispatcher`，而 `resolveDispatcher` 会返回 `ReactCurrentDispatcher.current`：

```typescript
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (__DEV__) {
    if (dispatcher === null) {
      console.error(
        'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
          ' one of the following reasons:\n' +
          '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
          '2. You might be breaking the Rules of Hooks\n' +
          '3. You might have more than one copy of React in the same app\n' +
          'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
      );
    }
  }
  return ((dispatcher: any): Dispatcher);
}
```

而 `ReactCurrentDispatcher.current` 初始值是 `null`：

```typescript
const ReactCurrentDispatcher = {
  current: (null: null | Dispatcher),
};
```

React 会在不同的时机，向 `ReactCurrentDispatcher.current` 挂上不同的 Hooks 实现，例如 React 会在**渲染阶段**区分 mount 还是 update 来使用不同的 Hooks 实现：

```typescript
// mount时向ReactCurrentDispatcher.current挂上的hooks实现
const HooksDispatcherOnMount: Dispatcher = {
	readContext,

	useCallback: mountCallback,
	useContext: readContext,
	useEffect: mountEffect,
	useImperativeHandle: mountImperativeHandle,
	useLayoutEffect: mountLayoutEffect,
	useInsertionEffect: mountInsertionEffect,
	useMemo: mountMemo,
	useReducer: mountReducer,
	useRef: mountRef,
	useState: mountState,
	useDebugValue: mountDebugValue,
	useDeferredValue: mountDeferredValue,
	useTransition: mountTransition,
	useMutableSource: mountMutableSource,
	useSyncExternalStore: mountSyncExternalStore,
	useId: mountId
};
```

```typescript
// update时向ReactCurrentDispatcher.current挂上的hooks实现
const HooksDispatcherOnUpdate: Dispatcher = {
	readContext,

	useCallback: updateCallback,
	useContext: readContext,
	useEffect: updateEffect,
	useImperativeHandle: updateImperativeHandle,
	useInsertionEffect: updateInsertionEffect,
	useLayoutEffect: updateLayoutEffect,
	useMemo: updateMemo,
	useReducer: updateReducer,
	useRef: updateRef,
	useState: updateState,
	useDebugValue: updateDebugValue,
	useDeferredValue: updateDeferredValue,
	useTransition: updateTransition,
	useMutableSource: updateMutableSource,
	useSyncExternalStore: updateSyncExternalStore,
	useId: updateId
};
```

也就是说，当 React 在组件挂载/更新阶段对于同一个 Hook 所对应真实调度（使用）的函数是不同的。

在组件之外调用 Hooks 时，因为还没有进入到组件的渲染，因此 `ReactCurrentDispatcher.current` 并没有被挂上 Hooks 的具体实现，因此 `ReactCurrentDispatcher.current` 还处于 `null` 的状态，React 就可以利用 `ReactCurrentDispatcher.current === null` 来判断开发者是否正确的在组件调用 Hooks，从而抛出错误。

我们回到 `useContext` 话题，当调用完 `resolveDispatcher` 之后，会返回 `dispatcher.useContext(Context)`，而 `dispatcher.useContext` 我们可以看到无论在 mount 时机还是在 update 时机都返回 `readContext`。

接下来我们看 `readContext` 源码：

```typescript
export function readContext<T>(context: ReactContext<T>): T {
	const value = context._currentValue;
	return value;
}
```

还记得我们 `createContext` 返回的是什么吗？返回的是一个包含 `_currentValue` 的对象，因此当我们调用 `readContext` 时，实际上就是从对象中取出 `_currentValue` 并返回。

> 我们第一个问题 "React Context 是如何做到跨组件传递？"就得到了解答：
>
> 当我们用 createContext 创建 context 时，实际上会返回一个对象，这个对象包含了 \_currentValue 记录了 context 的实际值；当我们在组件中使用 useContext 时，会直接从该对象中取出 \_currentValue 并返回。

### React Context 如何正确读到传入的 value？

我们回忆一下上面的例子，在调用 `useContext` 时返回的并不是一开始传入 `createContext` 的值，而是通过 `context.Provider` 传进去的值，我们很容易猜到，当 React 渲染到 `<context.Provider value={1}>` 这里时，会将传进去的 `value` 覆盖掉 `_currentValue`，当渲染完成这部分，又会把一开始的 0 重新写回 `_currentValue` 上。

我们来看下 React 的源码。当 React 渲染到 `Provider` 时，会执行 `updateContextProvider` 函数：

```typescript
function updateContextProvider(
	current: Fiber | null,
	workInProgress: Fiber,
	renderLanes: Lanes
) {
	// ...
	// 核心部分，newValue就是我们向 context.Provider 传入的 value，context就是createContext返回的那个对象
	pushProvider(workInProgress, context, newValue);
	// ...
}
```

接下来我们需要理解，我们向 `context.Provider` 上传入的 `value`，是如何替换掉 `context._currentValue` 的。我们具体来看`pushProvider`：

```typescript
function createCursor<T>(defaultValue: T): StackCursor<T> {
	return {
		current: defaultValue
	};
}

const valueStack: Array<any> = [];
let index = -1;
const valueCursor: StackCursor<mixed> = createCursor(null);

function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
	index++;
	valueStack[index] = cursor.current;
	cursor.current = value;
}

function pushProvider<T>(
	providerFiber: Fiber,
	context: ReactContext<T>,
	nextValue: T
): void {
	push(valueCursor, context._currentValue, providerFiber); // 在替换_currentValue之前需要保存一下当前值
	context._currentValue = nextValue; // 将传入到context.Provider的value赋给_currentValue
}
```

可以看到，React 在这里创建了一个数组：`valueStack`，每当执行到 `pushProvider` 时，就会把我们传进去的 `value` 压入栈中，同时更新 `context._currentValue`。这时候，聪明的你一定会猜到， `pushProvider` 会对应一个 `popProvider` 来恢复状态：

```typescript
function pop<T>(cursor: StackCursor<T>, fiber: Fiber): void {
	if (index < 0) {
		return;
	}
	cursor.current = valueStack[index];
	valueStack[index] = null;
	index--;
}

function popProvider(context: ReactContext<any>, providerFiber: Fiber): void {
	const currentValue = valueCursor.current;
	context._currentValue = currentValue; // 从历史记录中恢复状态
	pop(valueCursor, providerFiber);
}
```

React 会不断地从 `valueStack` 中取出历史数据并赋值给 `context._currentValue`。

> 第二个问题：React Context 是如何做到每次 useContext 时，都可以正确读到最近的 context.Provider 传入的 value？
>
> React 在内部维护了一个栈（数组），每次当渲染到 context.Provider 时，就会将历史的 \_currentValue 推入栈中进行保存，并将最新传入的 value 赋值给 \_currentValue；当渲染完毕后，React 会出栈，并恢复 \_currentValue 的值。因此，每次调用 useContext 时都可以正确读取到最近的 context.Provider 传入的 value。

现在回过头来看开头的例子：

```jsx
import { useContext, createContext } from "react";

const context = createContext(0);

const Display = () => {
	const value = useContext(context);
	return <span>{value}</span>;
};

const App = () => {
	return (
		<context.Provider value={1}>
			<Display />
			<context.Provider value={2}>
				<Display />
			</context.Provider>
			<Display />
		</context.Provider>
	);
};

export default App;
```

我们来回顾一遍整个过程：

1. 首先我们通过 `createContext`创建一个 `context` 对象，这个对象包含了 `Provider`、值为 0 的 `_currentValue`。
2. 当 React 渲染到 `<context.Provider value={1}>` 时，会将 1 赋值给 `context._currentValue`。
3. 渲染 `<Display />` 组件，调用 `useContext`，实际上调用 `readContext` 函数，从 `context` 对象中直接取出 `_currentValue` 并返回，此时 `_currentValue` 值为 1。
4. React 继续渲染，此时走到 `<context.Provider value={2}>`，将 2 赋值给 `context._currentValue`，同时 React 调用 `pushProvider` 将 1 压入栈中进行保存。
5. 渲染 `<Display />` 组件，调用 `useContext`，从 `context` 对象中直接取出 `_currentValue` 并返回，此时 `_currentValue` 值为 2。
6. 此时 `<context.Provider value={2}>` 渲染完毕，React 调用 `popProvider`，将 `valueCursor.current`（此时是 1）取出并赋值给 `context._currentValue`。
7. 渲染 `<Display />` 组件，调用 `useContext`，从 `context` 对象中直接取出 `_currentValue` 并返回，此时 `_currentValue` 值为 1。

因此，答案是 121。好！我们再看最后一个例子，回答下面代码所展示的内容是什么：

```jsx
import { useContext, createContext } from "react";

const contextA = createContext("A0");
const contextB = createContext("B0");

const Display = () => {
	const valueA = useContext(contextA);
	const valueB = useContext(contextB);
	return (
		<div>
			{valueA}, {valueB}
		</div>
	);
};

const App = () => {
	return (
		<contextA.Provider value={"A1"}>
			<Display />
			<contextB.Provider value={"B1"}>
				<Display />
				<contextA.Provider value={"A2"}>
					<Display />
				</contextA.Provider>
			</contextB.Provider>
		</contextA.Provider>
	);
};

export default App;
```

> 答案放小节最后，看看你对不对

### React Context 如何引发组件 re-render 的？

最后一个问题：React Context 为什么每次某一属性发生变化，无论组件是否使用到了该值都会引起组件 re-render？

首先当在组件中使用了 `useContext` 时，React 会对当前组件做一个标记，代表这个组件用到了某个 context。这样当 React 发现 `context.Provider` 传入的 `value` 值有变化时，就知道了该 re-render 哪些组件。

![image-20240713234344753](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240713234344753.png)

举一个例子，假设现在我们通过 `createContext` 创建了一个 context，并在上面图里组件树中的 ComponentB 和 ComponentC 两个组件中调用 `useContext` 完成了消费，那么这时候 React 就会对这两个组件进行标记。

其次，我们在前文中介绍，React 当渲染到 `context.Provider` 时会调用 `updateContextProvider` 函数，保存当前的 `context._currentValue`。`updateContextProvider` 还会做另一件事情，就是对比当前渲染阶段的 context 状态与上一次的状态是否一致：

```typescript
function updateContextProvider(
	current: Fiber | null,
	workInProgress: Fiber,
	renderLanes: Lanes
) {
	// ...
	const newProps = workInProgress.pendingProps; // 本次渲染阶段传入Provider的Props
	const oldProps = workInProgress.memoizedProps; // 上次渲染阶段传入Provider的Props

	const oldValue = oldProps.value; // 上次渲染传入Provider的value
	const newValue = newProps.value; // 本次渲染传入Provider的value

	// 核心部分，newValue就是我们向 context.Provider 传入的 value，context就是createContext返回的那个对象
	pushProvider(workInProgress, context, newValue);

	// ...

	if (Object.is(oldValue, newValue)) {
		// 对比前后的状态是否一致
	} else {
		// 不一致，代表消费了当前context的组件应该被re-render
	}
	// ...
}
```

可以看到 React 会调用 `Object.is(oldValue, newValue)` 来对比 context 前后的状态是否一致，如果不一致 React 会沿着当前节点遍历 fiber 树来寻找消费了当前 context 的组件（也就是我们刚才提到的，使用 `useContext` 时 React 做标记的组件），并且对其进行二次标记代表这个组件应该被重新渲染。当渲染到这个组件时，React 会看是否包含这个标记，如果包含，则重新渲染它。

> 至此我们第最后一个问题：React Context 为什么每次某一属性发生变化，无论组件是否使用到了该值都会引起组件 re-render 也得到了解答。
>
> React 内部会**直接**通过 Object.is 来对比新旧 context 状态是否变化来决定要不要重新渲染，因为用的是 Object.is 所以只要任意属性发生变化都会触发 re-render，这也是 React Context 产生性能问题的根本原因。

### 前面答案

答案如下，你是否答对了呢？

```js
A1, B0;
A1, B1;
A2, B1;
```
