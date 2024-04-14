## Render Props

在 React 中，代码复用的最基本单位就是组件，但是如果组件中也出现了重复的代码，该怎么做呢?

那么我们需要通过某种方式将代码中公共的部分抽取出来，这些公共的部分就被称之为横切关注点 (Cross-Cutting Concern)

在 React 中，常见有两种方式来进行横切关注点的抽离:

- 高阶组件(HOC)
- _Render Props_

_Render Props_ 实际上<u>本身并非什么新语法</u>，而是指一种在 React 组件之间<u>使用一个值为函数的 prop 共享代码</u>的简单技术。

有关*Render Props*，咱们主要需要掌握以下 2 个点:

- 如何用?
- 何时用?

### 如何使用 Render Props

我们首先还是来看一个示例：

```jsx
// App.jsx
import ChildCom1 from './components/ChildCom1';
import ChildCom2 from './components/ChildCom2';

function App() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '850px',
			}}
		>
			<ChildCom1 />
			<ChildCom2 />
		</div>
	);
}
export default App;
```

```jsx
// ChildCom1
import { useState } from 'react';

// 移动鼠标, 可以记录当前鼠标的位置
function ChildCom1() {
	const [points, setPoints] = useState({
		x: 0,
		y: 0,
	});

	function mouseMoveHandle(e) {
		setPoints({
			x: e.clientX,
			y: e.clientY,
		});
	}

	return (
		<div
			style={{
				width: '400px',
				height: '400px',
				background: 'red',
			}}
			onMouseMove={mouseMoveHandle}
		>
			<h1>移动鼠标</h1>
			<p>
				当前鼠标的位置: x{points.x} y {points.y}
			</p>
		</div>
	);
}
export default ChildCom1;
```

```jsx
//ChildCom2.jsx
import { useState } from 'react';
// 该组件效果是一个小球会追随鼠标进行移动
function ChildCom2() {
	const [points, setPoints] = useState({
		x: 0,
		y: 0,
	});

	function mouseMoveHandle(e) {
		setPoints({
			x: e.clientX,
			y: e.clientY,
		});
	}

	return (
		<div
			style={{
				width: '400px',
				height: '400px',
				backgroundColor: 'gray',
				position: 'relative',
				overflow: 'hidden',
			}}
			onMouseMove={mouseMoveHandle}
		>
			<h1>移动鼠标</h1>
			<div
				style={{
					width: '15px',
					height: '15px',
					borderRadius: '50%',
					backgroundColor: 'white',
					position: 'absolute',
					left: points.x - 5 - 460,
					top: points.y - 5 - 10,
				}}
			></div>
		</div>
	);
}
export default ChildCom2;
```

在上面的代码中，App 根组件下渲染了两个子组件，这两个子组件一个是显示鼠标的位置，另外一个是根据鼠标位置显示一个跟随鼠标移动的小球。

观察代码，你会发现这两个子组件内部的逻辑基本上是一模一 样的， 只是最终渲染的内容不一样， 此时我们就可以使用 _Render Props_ 对横切关注点进行一个抽离。

方式也很简单，就是在一个组件中使用一个值为函数的 prop，函数的返回值为要渲染的视图。

```jsx
// components/MouseMove.jsx
import { useState } from 'react';
// 该组件负责公共的逻辑
function MouseMove(props) {
	const [points, setPoints] = useState({
		x: 0,
		y: 0,
	});

	function mouseMoveHandle(e) {
		setPoints({
			x: e.clientX,
			y: e.clientY,
		});
	}

	return props.render ? props.render({ points, mouseMoveHandle }) : null;
}
export default MouseMove;
```

在上面的代码中，我们新创建了个 MouseMove 组件，该组件就封装了之前 ChildCom1 和 ChildCom2 组件的公共逻辑。该组件的 props 接收一个名为 render 的参数，只不过该参数对应的值为一个函数，我们调用时将对应的状态和处理函数传递过去，该函数的调用结果为
返回一段视图。

```jsx
// App.jsx
import ChildCom1 from './components/ChildCom1';
import ChildCom2 from './components/ChildCom2';
import MouseMove from './components/MouseMove';

function App() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '850px',
			}}
		>
			<MouseMove render={(props) => <ChildCom1 {...props} />} />
			<MouseMove render={(props) => <ChildCom2 {...props} />} />
		</div>
	);
}
export default App;
```

接下来在 App 根组件中，我们使用 MouseMove 组件，该组件上有一个 render 属性，对应的值就是函数，函数返回要渲染的组件。

```jsx
// ChildCom1.jsx
// 移动鼠标, 可以记录当前鼠标的位置
function ChildCom1(props) {
	const { points, mouseMoveHandle } = props;
	return (
		<div
			style={{
				width: '400px',
				height: '400px',
				backgroundColor: 'red',
			}}
			onMouseMove={mouseMoveHandle}
		>
			<h1>移动鼠标</h1>
			<p>
				当前鼠标的位置: x{points.x} y {points.y}
			</p>
		</div>
	);
}
export default ChildCom1;
```

```jsx
// ChildCom2.jsx
// 该组件效果是一个小球会追随鼠标进行移动
function ChildCom2(props) {
	const { points, mouseMoveHandle } = props;
	return (
		<div
			style={{
				width: '400px',
				height: '400px',
				backgroundColor: 'gray',
				position: 'relative',
				overflow: 'hidden',
			}}
			onMouseMove={mouseMoveHandle}
		>
			<h1>移动鼠标</h1>
			<div
				style={{
					width: '15px',
					height: '15px',
					borderRadius: '50%',
					backgroundColor: 'white',
					position: 'absolute',
					left: points.x - 5 - 460,
					top: points.y - 5 - 10,
				}}
			></div>
		</div>
	);
}
export default ChildCom2;
```

最后就是子组件 ChildCom1 和 ChildCom2 的改写，可以看到这两个子组件就只需要书写要渲染的视图了。公共的逻辑已经被 MouseMove 抽取出去了。

另外需要说明的是，虽然这个技巧的名字叫做 _Render Props_，但不是说必须要提供一个名为 render 的属性，事实上，**<u>封装公共逻辑的组件(例如上面的 MouseMove ) 只要能够得到要渲染的视图即可</u>**，所以传递的方式可以有多种。

例如:

```jsx
// App.jsx
import ChildCom1 from './components/ChildCom1';
import ChildCom2 from './components/ChildCom2';
import MouseMove from './components/MouseMove';

function App() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '850px',
			}}
		>
			<MouseMove>{(props) => <ChildCom1 {...props} />}</MouseMove>
			<MouseMove>{(props) => <ChildCom2 {...props} />}</MouseMove>
		</div>
	);
}
export default App;
```

上面使用 MouseMove 组件时，并没有传递什么 render 属性，而是通过 props.children 的形式将要渲染的视图传递到了组件内部。

在 MouseMove 组件内部，就不再是执行 render 方法了，而是应该执行 props.children，如下:

```jsx
import { useState } from 'react';
// 该组件负责公共的逻辑
function MouseMove(props) {
	const [points, setPoints] = useState({
		x: 0,
		y: 0,
	});

	function mouseMoveHandle(e) {
		setPoints({
			x: e.clientX,
			y: e.clientY,
		});
	}

	return props.children ? props.children({ points, mouseMoveHandle }) : null;
}
export default MouseMove;
```

### 何时使用 Render Props

我们发现上面的例子其实用高阶组件也能实现

> 这里就不列举代码了，你可以自己尝试

那么自然而然疑问就来了，什么时候使用 _Render Props_ ?什么时候使用 _HOC_ ?

一般来讲， **<u>_Render Props_ 应用于组件之间功能逻辑完全相同，仅仅是渲染的视图不同</u>**。这个时候我们可以通过 _Render Props_ 来指定要渲染的视图是什么。

而 _HOC_ 一般是抽离部分公共逻辑，也就是说组件之间有一部分逻辑相同，但是各自也有自己独有的逻辑，那么这个时候使用 _HOC_ 比较合适，可以在原有的组件的基础上做一个增强处理。
