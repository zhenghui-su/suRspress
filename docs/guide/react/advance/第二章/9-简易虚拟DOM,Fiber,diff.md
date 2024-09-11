# 简易虚拟 DOM,Fiber,diff

本节通过学习 小满 zs react 教程
简易版本代码：

```js
const React = {
	createElement(type, props = {}, ...children) {
		return {
			type,
			props: {
				...props,
				children: children.map((child) =>
					typeof child === 'object' ? child : React.createTextElement(child),
				),
			},
		}
	},

	createTextElement(text) {
		return {
			type: 'TEXT_ELEMENT',
			props: {
				nodeValue: text,
				children: [],
			},
		}
	},
}

// const vdom = React.createElement('div', { id: 1 }, React.createElement('span', null, '小满zs'));

// console.log(vdom)

//Fiber 是 React 16 引入的一种新的协调引擎
let nextUnitOfWork = null // 下一个工作单元
let currentRoot = null // 旧的 Fiber 树
let wipRoot = null //  当前正在工作的 Fiber 树
let deletions = null // 存储需要删除的 Fiber

// Fiber 渲染入口
function render(element, container) {
	//wipRoot 表示“正在进行的工作根”，它是 Fiber 架构中渲染任务的起点
	wipRoot = {
		dom: container, //渲染目标的 DOM 容器
		props: {
			children: [element], //要渲染的元素（例如 React 元素）
		},
		alternate: currentRoot,
		//alternate 是 React Fiber 树中的一个关键概念，用于双缓冲机制（双缓冲 Fiber Tree）。currentRoot 是之前已经渲染过的 Fiber 树的根，wipRoot 是新一轮更新的根 Fiber 节点。
		//它们通过 alternate 属性相互关联
		//旧的fiber树
	}
	nextUnitOfWork = wipRoot
	//nextUnitOfWork 是下一个要执行的工作单元（即 Fiber 节点）。在这里，将其设置为 wipRoot，表示渲染工作从根节点开始
	deletions = []
	//专门用于存放在更新过程中需要删除的节点。在 Fiber 更新机制中，如果某些节点不再需要，就会将它们放入 deletions，
	//最后在 commitRoot 阶段将它们从 DOM 中删除
}

// 创建 Fiber 节点
function createFiber(element, parent) {
	return {
		type: element.type,
		props: element.props,
		parent,
		dom: null, // 关联的 DOM 节点
		child: null, // 子节点
		sibling: null, // 兄弟节点
		alternate: null, // 对应的前一次 Fiber 节点
		effectTag: null, // 'PLACEMENT', 'UPDATE', 'DELETION'
	}
}

// 创建 DOM 节点
function createDom(fiber) {
	const dom =
		fiber.type === 'TEXT_ELEMENT'
			? document.createTextNode('')
			: document.createElement(fiber.type)
	updateDom(dom, {}, fiber.props)
	return dom
}

// 更新 DOM 节点属性
function updateDom(dom, prevProps, nextProps) {
	// 移除旧属性
	Object.keys(prevProps)
		.filter((name) => name !== 'children')
		.forEach((name) => {
			dom[name] = ''
		})

	// 添加新属性
	Object.keys(nextProps)
		.filter((name) => name !== 'children')
		.filter((name) => prevProps[name] !== nextProps[name])
		.forEach((name) => {
			dom[name] = nextProps[name]
		})
}

// Fiber 调度器
// 实现将耗时任务拆分成多个小的工作单元
function workLoop(deadline) {
	//deadline 表示浏览器空闲时间
	let shouldYield = false
	//是一个标志，用来指示是否需要让出控制权给浏览器。如果时间快用完了，则设为 true，以便及时暂停任务，避免阻塞主线程

	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
		//performUnitOfWork 是一个函数，它处理当前的工作单元，并返回下一个要执行的工作单元。每次循环会更新 nextUnitOfWork 为下一个工作单元
		shouldYield = deadline.timeRemaining() < 1
		//使用 deadline.timeRemaining() 来检查剩余的空闲时间。如果时间少于 1 毫秒，就设置 shouldYield 为 true，表示没有空闲时间了，就让出控制权
	}

	if (!nextUnitOfWork && wipRoot) {
		//当没有下一个工作单元时（nextUnitOfWork 为 null），并且有一个待提交的“工作根”（wipRoot），就会调用 commitRoot() 将最终的结果应用到 DOM 中
		commitRoot()
	}

	requestIdleCallback(workLoop)
	//使用 requestIdleCallback 来安排下一个空闲时间段继续执行 workLoop，让任务在浏览器空闲时继续进行
}
//requestIdleCallback 浏览器绘制一帧16ms 空闲的时间去执行的函数 浏览器自动执行
//浏览器一帧做些什么
//1.处理时间的回调click...事件
//2.处理计时器的回调
//3.开始帧
//4.执行requestAnimationFrame 动画的回调
//5.计算机页面布局计算 合并到主线程
//6.绘制
//7.如果此时还有空闲时间，执行requestIdleCallback
requestIdleCallback(workLoop)

// 执行一个工作单元
function performUnitOfWork(fiber) {
	// 如果没有 DOM 节点，为当前 Fiber 创建 DOM 节点
	if (!fiber.dom) {
		fiber.dom = createDom(fiber)
		// console.log(fiber.dom)
	}
	//确保每个 Fiber 节点都在内存中有一个对应的 DOM 节点准备好，以便后续在提交阶段更新到实际的 DOM 树中

	// 创建子节点的 Fiber
	// const vdom = React.createElement('div', { id: 1 }, React.createElement('span', null, '小满zs'));
	// 子节点在children中
	const elements = fiber.props.children
	reconcileChildren(fiber, elements)

	// 返回下一个工作单元（child, sibling, or parent）
	//console.log(fiber.child)
	if (fiber.child) {
		return fiber.child
	}

	// 递归调用，处理兄弟节点
	let nextFiber = fiber
	// console.log(nextFiber)
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling
		}
		nextFiber = nextFiber.parent
	}
	return null
}

// Diff 算法: 将子节点与之前的 Fiber 树进行比较
function reconcileChildren(wipFiber, elements) {
	let index = 0 //
	let oldFiber = wipFiber.alternate && wipFiber.alternate.child // 旧的 Fiber 树
	let prevSibling = null

	while (index < elements.length || oldFiber != null) {
		const element = elements[index]
		let newFiber = null

		// 比较旧 Fiber 和新元素
		const sameType = oldFiber && element && element.type === oldFiber.type

		//如果是同类型的节点，复用
		if (sameType) {
			console.log(element, 'update')
			newFiber = {
				type: oldFiber.type,
				props: element.props,
				dom: oldFiber.dom,
				parent: wipFiber,
				alternate: oldFiber,
				effectTag: 'UPDATE',
			}
		}

		//如果新节点存在，但类型不同，新增fiber节点
		if (element && !sameType) {
			console.log(element, 'add')
			newFiber = createFiber(element, wipFiber)
			newFiber.effectTag = 'PLACEMENT'
		}

		//如果旧节点存在，但新节点不存在，删除旧节点
		if (oldFiber && !sameType) {
			console.log(oldFiber, 'delete')
			oldFiber.effectTag = 'DELETION'
			deletions.push(oldFiber)
		}

		//移动旧fiber指针到下一个兄弟节点
		if (oldFiber) {
			oldFiber = oldFiber.sibling
		}

		// 将新fiber节点插入到DOM树中
		if (index === 0) {
			//将第一个子节点设置为父节点的子节点
			wipFiber.child = newFiber
		} else if (element) {
			//将后续子节点作为前一个兄弟节点的兄弟
			prevSibling.sibling = newFiber
		}

		//更新兄弟节点
		prevSibling = newFiber
		index++
	}
}

// 提交更新到 DOM
function commitRoot() {
	deletions.forEach(commitWork) // 删除需要删除的 Fiber 节点
	commitWork(wipRoot.child)
	currentRoot = wipRoot
	wipRoot = null
}

// 提交单个 Fiber 节点
function commitWork(fiber) {
	if (!fiber) {
		return
	}

	const domParent = fiber.parent.dom

	if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
		domParent.appendChild(fiber.dom)
	} else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
		updateDom(fiber.dom, fiber.alternate.props, fiber.props)
	} else if (fiber.effectTag === 'DELETION') {
		domParent.removeChild(fiber.dom)
	}

	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

render(
	React.createElement(
		'div',
		{ id: 'root' },
		React.createElement('span', null, 'susususu'),
	),
	document.getElementById('root'),
)

setTimeout(() => {
	render(
		React.createElement(
			'div',
			{ id: 'root' },
			React.createElement('p', null, 'chenchen'),
		),
		document.getElementById('root'),
	)
}, 2000)
```
