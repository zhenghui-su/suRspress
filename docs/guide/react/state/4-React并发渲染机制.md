# React 并发渲染机制

React 18 版本最主要的就是并发机制了，同时由于并发机制的特性给社区带来了新的活力，当然也产生了一些新的问题，例如 React Tearing。因此，我们非常有必要先来介绍一下 React 的并发机制。

## React 渲染流程

假设现在有一个页面，如下：

![image-20240714180202278](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714180202278.png)

它包含了一个应用中通常会具备的元素 —— Header、Sidebar、Content、Footer。它的组件树形式是这样的：

![image-20240714180229921](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714180229921.png)

那么 React 在渲染这棵树时会以 DFS（深度优先搜索）形式来遍历整棵树，以上面的图为例，遍历顺序为：

```js
App -> Header -> Sidebar -> Content -> ComponentA -> ComponentC -> ComponentB -> Footer
```

对于每个组件，React 都会为其创建对应的 Fiber Node（Fiber Node 其实就是 js 的对象，没什么特别的，保存着必要的渲染信息例如 props、key、ref、lanes 等等）方便 React 处理，这就是 Fiber 架构。

什么时候会开始渲染？

- **mount**：例如在执行 `ReactDOM.createRoot(document.querySelector('#root')).render(<App />)`， 这时候会开启 mount 阶段，渲染整个页面。
- **update**：例如通过 `useState`、`useReducer` 等来更新页面，这时候会开启 update 阶段。

但无论 mount 还是 update，React 都会从根节点来渲染，遍历整个树，在 React 18 以前整个渲染过程是不能被中断的，因此在渲染过程中不能及时响应用户的交互，当渲染开销比较大时用户会明显地感觉到卡顿。

这里有一个官方提供的例子：[https://react.dev/reference/react/useTransition#examples](https://react.dev/reference/react/useTransition#examples)

![QQ20240303-161917-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/e7f1449688a9476db8e0128c080fd835~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

在这个例子中，渲染 `PostsTab` 组件时模拟了渲染开销大的场景，增加了 500 个 `SlowPost` 组件，并对每个 `SlowPost` 组件渲染手动延迟 1ms：

```js
let startTime = performance.now();
while (performance.now() - startTime < 1) {} // 手动延迟 1ms
```

可以看到，在点击 Posts 按钮后会明显感觉到卡顿，并且后续用户的操作也没办法得到响应。解决方案其实就是使用 `useTransition`：

```js
const [isPending, startTransition] = useTransition();

function selectTab(nextTab) {
	startTransition(() => {
		setTab(nextTab);
	});
}
```

将更新状态的操作使用 `startTransition` 包裹，从而解决卡顿的问题：

![QQ20240303-162600-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/fc8032b244fc4492b6f810f957bb5047~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

我们前面说普通情况下 React 渲染是不可中断的，因此当某个组件渲染开销比较大时用户会明显感到卡顿。但是使用了 `useTransition` 可以看到整个操作变得更加丝滑，这是因为整个渲染过程从不可中断变为了可中断，后续的点击不会被 `PostsTab` 组件的渲染所影响，这就是并发更新的典型应用场景。

**那 React 是怎么实现这个机制的呢？**

答案就是 **`Lane 模型 + 时间切片`**。为了让大家更好地理解这两个概念，在正式开启后面内容之前，我们先用两张图来演示一下上面的例子：

**非并发模式：**

![image-20240714181819633](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714181819633.png)

可以看到非并发模式下在 `PostsTab` 渲染过程中虽然点击了 About 按钮，但是并没有中断 `PostsTab` 组件的渲染立即开始渲染 `AboutTab` 组件，这样的结果就是 `AboutTab` 组件渲染过程被滞后，点击没有立即被响应，用户明显会感受到卡顿。

**并发模式：**

![image-20240714181859302](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714181859302.png)

这里黑色的方块可以简单看作是渲染一个个的 `SlowPost` 组件，在并发模式下，由于整个不可被拆分的渲染过程被拆分为了一个个分片的渲染过程，因此在分片渲染的中间可以响应用户的交互，当用户点击 About 按钮时会中断继续渲染剩余的 `SlowPost` 组件，然后渲染 About 下的内容。而非并发模式则需要等待全部 `SlowPost` 组件渲染完毕以后才可以开始渲染 About 下的内容。

## Lane 模型

"Lane" 中文含义是赛道。**Lane 模型指的是会给每次渲染分配一个优先级，React 会根据这些不同的优先级来决定哪些更新应该优先处理，哪些可以稍后处理**。如下部分的：

```typescript
export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncHydrationLane: Lane = /*               */ 0b0000000000000000000000000000001;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000010;
export const SyncLaneIndex: number = 1;

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000100;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000001000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000010000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000100000;
```

Lane 采用二进制（0b 开头）表示，比如：

```js
0 对应 0b0000000000000000000000000000000
1 对应 0b0000000000000000000000000000001
2 对应 0b0000000000000000000000000000010
```

可以看到有非常多种 Lane 类型，每种 Lane 对应了一个二进制数值，数值越低代表优先级越高。为什么 React Lane 模型中要采用二进制来表示，而不是单纯的 0、1、2、3 …… 这样的数字呢？

- 首先，在计算机底层中，对于二进制的处理比十进制的处理效率更高。
- 其次，基于位运算 React 可以更轻松地合并、比较和操作这些优先级。举个例子，因为有多个优先级，也就是不同的 Lane，自然就有了合并的需求，对应 React `mergeLanes` 函数：

```js
export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
	return a | b;
}
```

有了合并自然也有移除某个 Lane 的需求，例如当完成了这次的渲染任务，我们就需要把这次渲染对应的 Lane 从 Fiber Node 上移除：

```js
export function removeLanes(set: Lanes, subset: Lanes | Lane): Lanes {
	return set & ~subset;
}
```

可以看到非常方便地就完成了合并以及移除操作，而单纯采用数字就需要借助数组和循环了，效率就比较低。

通常用户会在页面中做一些操作来触发页面重新渲染，比如点击、滚动、键盘输入等，对于不同的事件，React 分配了不同的优先级。

```typescript
export function getEventPriority(domEventName: DOMEventName): EventPriority {
  switch (domEventName) {
    case 'click':
    case 'input':
    case 'keydown':
    ...
      return DiscreteEventPriority;
    case 'scroll':
    case 'wheel':
    case 'mouseenter':
    ...
      return ContinuousEventPriority;
    ...
    default:
     return DefaultEventPriority;
```

这里的 `DiscreteEventPriority`、`ContinuousEventPriority`、`DefaultEventPriority` 对应了上面不同 Lane：

```typescript
export const DiscreteEventPriority: EventPriority = SyncLane;
export const ContinuousEventPriority: EventPriority = InputContinuousLane;
export const DefaultEventPriority: EventPriority = DefaultLane;
export const IdleEventPriority: EventPriority = IdleLane;
```

也就是说 `click`、`input`、`keydown` 等这些事件的优先级是高于 `scroll`、`wheel`、`mouseenter` 的，当遇到高优先级的渲染任务 React 会优先处理。

既然 React 需要优先处理高优任务，那必然需要将整个连续不断的渲染过程打散，在每次中间判断有没有更高优先级的任务。

当然通过上面例子我们也知道，可以通过 `useTransition` 来改变这次渲染的优先级。

## 时间切片

那什么是时间切片呢？

**时间切片就是将整个连续不可中断的渲染过程变成可以中断的、离散的渲染**。这样在空隙中可以做三件事情：

1. 判断是否有高优先级的任务，优先处理；
2. 渲染 UI 界面。
3. 及时响应用户的操作。

我们看的电影和动画是由许多静态图像（帧）快速播放组成的，人眼的反应速度有限，当这些帧足够快地切换时，我们看到的就是流畅的动画。对于人眼来说，大约 16-24 帧/秒就足以形成连续动画的感觉，但更高的帧率会提供更流畅、自然的效果。

而常见的显示器刷新率有 60Hz、120Hz、144Hz 等（Hz 代表每秒更新画面的次数）。60Hz 的显示器意味着每秒钟屏幕刷新 60 次，即每次刷新间隔大约 16.7 毫秒。浏览器会自动适配这个频率，这时对应我们前端页面就是每 16.7ms 需要渲染一次。

但是我们知道，UI 渲染和 JS 执行都是运行在主线程上，也就是说当执行 JS 的时候就没有办法进行 UI 渲染，从而带来页面卡顿的感觉。并且我们前面提到正常 React 组件的渲染过程是连续的、不可被中断的，自然当 React 渲染时间过长时就会占用主线程阻止 UI 渲染从而带来卡顿的现象。

那怎么解决这个问题呢？答案就是时间切片。也就是把连续的、不可中断的执行过程变成一小块、一小块的切片去执行，那在执行空隙期间自然有机会得到渲染。就如下图所示：

![image-20240714195907248](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714195907248.png)

也就是说需要在 16.6 ms 内完成 UI 的更新，剩余部分用来执行 React 的渲染。

这里很自然我们会想到 `requestIdleCallback` 和`requestAnimationFrame` API。

## requestIdleCallback

`requestIdleCallback` 会在浏览器空闲时期被调用，这样可以避免卡顿问题：

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="stylesheet" href="styles.css" />
	</head>
	<body>
		<div class="moving-box"></div>
		<button class="requestIdleCallback">requestIdleCallback</button>
		<br />
		<button class="normal">normal</button>
	</body>
	<script>
		function task() {
			const start = performance.now();
			while (performance.now() - start < 0.01) {}
		}
		function processNormalTask() {
			for (let i = 0; i < 10000; i++) {
				task();
			}
		}
		document
			.querySelector(".normal")
			.addEventListener("click", processNormalTask);

		function processIdleTask() {
			let i = 0;
			function handler(idleDeadline) {
				while (idleDeadline.timeRemaining() > 0 && ++i < 10000) {
					task();
				}
				if (i < 10000) {
					requestIdleCallback(handler);
				}
			}
			requestIdleCallback(handler);
		}
		document
			.querySelector(".requestIdleCallback")
			.addEventListener("click", processIdleTask);
	</script>
</html>
```

不使用 `requestIdleCallback`：

![QQ20240307-002951-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/6e7e89cbf3ba46ba90ad5999e18e56d3~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

使用 `requestIdleCallback`：

![QQ20240307-003019-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/d2f11264b1eb45a9b8b4836769ce3e11~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

可以很明显地看到，不使用 `requestIdleCallback` API，当点击按钮时会很明显导致页面卡顿，而使用 `requestIdleCallback` 则不会有这个问题。

但是 React 并没有使用它，而是自己实现了一个，原因有两个。

1. 兼容性：Safari 不支持该 API。
2. 浏览器没有足够积极地执行 `requestIdleCallback`，因此不满足 60HZ 的要求。在下面的例子中观察 1s 钟执行了多少次：

```js
const startTime = performance.now();
let count = 0;

function idleCallback() {
	if (performance.now() - startTime < 1000) {
		count++;
		requestIdleCallback(idleCallback);
	} else {
		console.log(count);
	}
}

requestIdleCallback(idleCallback);
```

## requestAnimationFrame

引用 MDN 的介绍：

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。

可以看到，MDN 说通常每秒执行回调函数 60 次。我们写一个 Demo 来验证一下：

```jsx
const startTime = performance.now();
let count = 0;

function animationFrame() {
	if (performance.now() - startTime < 1000) {
		count++;
		requestAnimationFrame(animationFrame);
	} else {
		console.log(count);
	}
}

requestAnimationFrame(animationFrame);
```

当然在高刷新率的屏幕中会被执行更多次数。那 `requestAnimationFrame` 有什么应用场景呢？

首先就是**动画**，通常我们可以借助 CSS 或者 JavaScript 来实现前端动画效果。无疑对于简单的动画效果，CSS 动画是一个非常直接和高效的选择，并且通常比 JavaScript 动画性能更好。但 JavaScript 提供了更高的灵活性，当 CSS 动画无法满足我们的要求时，我们就需要选择 JavaScript 来实现。

来看下面的例子：

```js
const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");

let left1 = 0;
let left2 = 0;

setInterval(() => {
	left1++;
	box1.style.left = left1 + "px";
}, 17);

function moveBox2() {
	left2++;
	box2.style.left = left2 + "px";
	requestAnimationFrame(moveBox2);
}
requestAnimationFrame(moveBox2);
```

![QQ20240307-235953-HD.gif](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/75ebee1f618942feb49c8b9e84c15b52~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

其中上面盒子使用 `setInterval` ，下面使用 `requestAnimationFrame` 来实现动画效果。上面的例子中可以看到使用 `setInterval` 的实现会卡顿，没有 `requestAnimationFrame` 实现流畅。

**为什么`setInterval` 的实现会卡顿？**

我们在这里指定了 17ms，代表等待 17ms 后会将回调函数加入到宏任务队列中，这时候如果事件循环正在处理其他宏任务或者一些微任务，那么`setInterval`的回调可能会被延迟执行，导致实际间隔时间长于 17 毫秒，没有与屏幕刷新同步，从而导致动画出现跳帧或不连贯的现象。

**为什么 `requestAnimationFrame` 的实现不会卡顿？**

`requestAnimationFrame` 是与浏览器的刷新率同步的，它会在每次屏幕刷新之前执行一次，从而提供更流畅的动画效果。

当然，`requestAnimationFrame` 的应用场景远不仅仅是动画！

- **数据可视化**：在数据可视化应用中，尤其是涉及大量动态数据的情况下，`requestAnimationFrame` 可以用来平滑地更新图表和图形。
- **节流和防抖动**：在处理诸如滚动、调整窗口大小或键盘事件等高频事件时，使用 `requestAnimationFrame` 可以有效控制事件处理的频率。这可以减少计算量并提高性能，尤其是在复杂的布局或高分辨率设备上。
- **游戏循环**：在浏览器中开发游戏时，`requestAnimationFrame` 可以用于游戏的渲染循环。它可以确保游戏的绘图操作与浏览器的刷新率同步，从而提供更平滑的游戏体验。
- ……

让我们再来实现一个 例子。

通常例如滚动、窗口大小调整、鼠标移动等事件会被非常频繁地触发，使用 `requestAnimationFrame` 可以确保在每次浏览器绘制之前只处理一次事件，这样可以减少计算量并提高性能。

```html
<body>
	<div id="size"></div>
	<script>
		let width, height;
		let flag = false;
		const sizeDisplay = document.getElementById("size");

		function updateSize() {
			width = window.innerWidth;
			height = window.innerHeight;
			sizeDisplay.textContent = "Width: " + width + ", Height: " + height;
			flag = false;
		}

		updateSize();

		window.addEventListener("resize", function () {
			if (!flag) {
				flag = true;
				requestAnimationFrame(updateSize);
			}
		});
	</script>
</body>
```

让我们画一张图来帮助大家理解 `requestIdleCallback` 与`requestAnimationFrame` 的执行时机：

![image-20240714200630750](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240714200630750.png)

1. 首先浏览器取出一个宏任务执行。
2. 宏任务执行完毕后，浏览器会处理微任务队列中的所有任务。在这个阶段，新添加的微任务也会被连续执行，直到微任务队列清空。
3. 在浏览器进行下一次重绘之前执行 `requestAnimationFrame` 回调。
4. 进行浏览器渲染。
5. 此时如果有空余时间则执行 `requestIdleCallback` 回调。
6. 重复以上步骤。

## React 的实现

React 在代码仓库中单独实现了一个 Scheduler 包，用来实现调度，并把它发布到了 NPM 上。

> React Scheduler 仓库：[scheduler](https://github.com/facebook/react/tree/main/packages/scheduler)
>
> NPM 地址：[scheduler](https://www.npmjs.com/package/scheduler)

React 会根据是否支持依次选择 `setImmediate` -> `MessageChannel` -> `setTimeout`：

```js
if (typeof setImmediate === "function") {
	// 使用 setImmediate
} else if (typeof MessageChannel !== "undefined") {
	// 使用 MessageChannel
} else {
	// 使用 setTimeout
}
```

因为 `setImmediate` 特性是非标准的，所以我们这里先不详细介绍为什么优先使用 `setImmediate` ，感兴趣可以查看 [Issue](https://github.com/facebook/react/issues/20756)

那为什么优先使用 `MessageChannel`，而不是 `setTimeout` 呢？

因为浏览器出于性能优化的目的会强制一个 4ms 的最小的延迟时间，这意味着即使你写了 `setTimeout(function, 0)`，实际的延迟时间也会被浏览器调整为 4ms。

`MessageChannel` 提供了一种在不同的执行上下文（比如主线程和 worker 线程）之间传递消息的方法。当你创建一个`MessageChannel`实例时，这个实例上会包含 `port1`和`port2`，它们可以相互之间通信。

让我们来写一个简单的例子帮助理解：

```js
const channel = new MessageChannel();

// 设置port1的消息接收处理
channel.port1.onmessage = function (event) {
	console.log("port1 received:", event.data);
};

// 设置port2的消息接收处理
channel.port2.onmessage = function (event) {
	console.log("port2 received:", event.data);
};

// 发送消息到port2（会被port1接收）
channel.port1.postMessage("Message to port2 from port1");

// 发送消息到port1（会被port2接收）
channel.port2.postMessage("Message to port1 from port2");
```

这里首先通过 `MessageChannel` 创建了一个实例，然后分别给 `port1` 与 `port2` 绑定了 `onmessage` 事件处理器，告诉它们收到了消息之后应该如何处理，最后分别通过 `port1` 与 `port2` 上发送了消息。

虽然我们说 `MessageChannel` 最初是设计用来在不同执行上下文中传递消息的，但从上面的例子中我们可以看到它也可以在同一个执行上下文中使用。这里重点是要理解消息的接收 `onmessage` 的处理与 `setTimeout` 一样都是属于宏任务，React 正是借助这个特性设计了时间切片能力。

我们来看一下 React 源码，为了方便理解做了一些简化：

```js
let startTime = -1;
const frameInterval = 5; // 默认的时间切片时间
const taskQueue = []; // 任务队列
let isMessageLoopRunning = false;
let scheduledHostCallback = null;

const getCurrentTime = () => performance.now();

const performWorkUntilDeadline = () => {
	const currentTime = getCurrentTime();
	startTime = currentTime; // 每次调度的时候记录一下当前的时间
	let hasMoreWork = true;
	try {
		hasMoreWork = scheduledHostCallback();
	} finally {
		if (hasMoreWork) {
			// hasMoreWork 为 true 时代表还有任务没有调度完，需要继续调度
			schedulePerformWorkUntilDeadline();
		} else {
			scheduledHostCallback = null;
			isMessageLoopRunning = false;
		}
	}
};

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;

const schedulePerformWorkUntilDeadline = () => {
	port.postMessage(null);
};

function requestHostCallback(callback) {
	scheduledHostCallback = callback;
	if (!isMessageLoopRunning) {
		// 当有新的渲染进来不需要反复调用
		isMessageLoopRunning = true;
		schedulePerformWorkUntilDeadline();
	}
}

function workLoop() {
	let currentTask = taskQueue[0];
	while (currentTask) {
		if (shouldYieldToHost()) {
			// 判断是否需要中断来给浏览器渲染
			break;
		}
		const callback = currentTask.callback;
		callback();
		taskQueue.shift();
		currentTask = taskQueue[0];
	}
	if (currentTask !== null) {
		return true; // 代表还有任务没有调度完
	} else {
		return false; // 代表已经调度完毕
	}
}

function flushWork() {
	return workLoop();
}

function unstable_scheduleCallback(callback) {
	const newTask = {
		callback
	};

	taskQueue.push(newTask); // 向任务队列增加任务
	requestHostCallback(flushWork);
}

function shouldYieldToHost() {
	const timeElapsed = getCurrentTime() - startTime;
	if (timeElapsed < frameInterval) {
		// 判断是否超时
		return false;
	}
	return true;
}
```

React 在每次渲染的时候都会执行 `unstable_scheduleCallback` 用来调度渲染，其中传入的 `callback` 就是渲染执行的函数。

当调用 `unstable_scheduleCallback` 时会向 `port1` 发送一个 message， `port1` 收到后会将 `performWorkUntilDeadline` 推入宏任务队列。`performWorkUntilDeadline` 在调度时会记录当前时间，这样 `shouldYieldToHost` 就可以据此来判断要不要中断来渲染 UI，这里默认时间给了 5ms。可以看到，当中断的时候 `workLoop` 会返回 true，代表当前还没有执行完任务，这时候会继续执行 `schedulePerformWorkUntilDeadline`，继续将 `performWorkUntilDeadline` 推入宏任务队列。

## 题目

现在有一个函数 `runTask`，用来接收一个批量的耗时任务 `tasks`，现在需要你进行合理的设计来避免执行 `tasks` 时浏览器卡顿。

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>HTML + CSS</title>
		<link rel="stylesheet" href="styles.css" />
	</head>
	<body>
		<div class="ball"></div>
		<button class="start">开始执行任务</button>
		<script>
			function runTask(tasks) {
				while (tasks.length > 0) {
					const task = tasks.shift();
					task();
				}
			}
			function task() {
				const start = performance.now();
				while (performance.now() - start < 0.01) {
					// 模拟耗时任务
				}
			}
			document.querySelector(".start").addEventListener("click", () => {
				const tasks = new Array(1e4).fill(task);
				runTask(tasks);
			});
		</script>
	</body>
</html>
```

效果是有一个左右移动的小球，当点击按钮时会出现页面卡顿的现象。那我们如何优化呢？

**第一个，requestIdleCallback**。基于 `requestIdleCallback` 怎么来做优化呢？

```js
function runTask(tasks) {
	requestIdleCallback((deadline) => {
		while (deadline.timeRemaining() > 0 && tasks.length > 0) {
			const task = tasks.shift();
			task();
		}
		if (tasks.length > 0) {
			runTask(tasks); // 继续剩余的任务
		}
	});
}
```

通过 `timeRemaining` 是否还有剩余时间，可以判断是否继续清空 `tasks`。

**第二个，requestAnimationFrame**。我们在前面提到 `requestIdleCallback` 存在兼容性的问题，当然 `requestAnimationFrame` 也可以用来解决浏览器卡顿问题。

```js
function runTask(tasks) {
	const startTime = performance.now();
	requestAnimationFrame(() => {
		while (performance.now() - startTime < 16.6 && tasks.length > 0) {
			const task = tasks.shift();
			task();
		}
		if (tasks.length > 0) {
			runTask(tasks); // 继续剩余的任务
		}
	});
}
```

**第三个，MessageChannel**。前面我们在分析 React 源码时基于 `MessageChannel` 实现了调度能力，我们基于上面的 `unstable_scheduleCallback` API 来实现一下

```js
function runTask(tasks) {
	unstable_scheduleCallback(() => {
		while (tasks.length > 0 && !shouldYieldToHost()) {
			const task = tasks.shift();
			task();
		}
		if (tasks.length > 0) {
			runTask(tasks);
		}
	});
}
```

三个方法都可以解决这个问题。

总结：本节我们介绍了 React 并发机制，内部原理是`时间切片和 Lane 模型`：**Lane 模型代表渲染时不同的优先级，时间切片保证了在渲染过程中可以优先处理更高优先级的渲染**。
