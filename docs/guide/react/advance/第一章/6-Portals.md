## Portals

_Portals_ 被翻译成传送门，它要做的事情实际上也确实和传送门很相似，根据官方的解释：

> Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

其语法为：

```jsx
ReactDOM.createPortal(child, container);
```

第一个参数 (child) 是任何可渲染的 React 子元素，第二个参数 (container) 是一个 DOM 元素。

学习一个知识我们仍然是应该从以下 2 个点着手：

- 何时使用？
- 如何用？

### 什么场景下需要使用 Portals

首先我们来看一个场景，如下：

```jsx
// App.jsx
import { useState } from 'react';
import Modal from './components/Modal';
function App() {
	const [isShow, setIsShow] = useState(false);
	return (
		<div>
			<h1>App组件</h1>
			<button onClick={() => setIsShow(!isShow)}>显示/隐藏</button>
			{isShow ? <Modal /> : null}
		</div>
	);
}
export default App;
```

```jsx
function Modal() {
	return (
		<div
			style={{
				width: '450px',
				height: '250px',
				border: '1px solid',
				position: 'absolute',
				left: 'calc(50% - 225px)',
				top: 'calc(50% - 125px)',
				textAlign: 'center',
				lineHeight: '250px',
			}}
		>
			模态框
		</div>
	);
}
export default Modal;
```

在上面的示例中，Modal 是一个模态框，在 App 根组件中能够控制该模态框组件是否显示。

![image-20240413223257036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240413223257036.png)

上面的示例，功能倒是没有什么问题，但是从最终渲染出来的 html 结构上来讲，将整个模态框都放在 root 这个 div 中不是那么合适，我们生成的 html 结构上，这个模态框能够渲染到 modal 那个 div 里面。

![image-20240413222938956](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240413222938956.png)

并且一旦父组件上面设置了额外的样式，都会影响这个子组件的渲染，例如：

```jsx
<div
	style={{
		position: 'relative',
	}}
>
	<h1>App组件</h1>
	<button onClick={() => setIsShow(!isShow)}>显示/隐藏</button>
	{isShow ? <Modal /> : null}
</div>
```

我们在 App 组件中添加一条相对定位的样式，此时我们就会发现由于 Modal 是放在整个 root 元素里面的，模态框的位置就会收到影响。

![image-20240413223317972](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240413223317972.png)

因此，在这种时候，我们就可以使用 _Portals_ 来解决这个问题。

### 如何使用 Portals

_Portals_ 的使用方式也非常简单，只需要使用`createPortal`方法来指定渲染到哪个元素中即可。需要注意的是这是和 React 渲染相关的，所以 `createPortal` 方法来自于 _react-dom_ 这个库。

```jsx
// Modal.jsx
import { createPortal } from 'react-dom';
function Modal() {
	return createPortal(
		<div
			style={{
				width: '450px',
				height: '250px',
				border: '1px solid',
				position: 'absolute',
				left: 'calc(50% - 225px)',
				top: 'calc(50% - 125px)',
				textAlign: 'center',
				lineHeight: '250px',
			}}
		>
			模态框
		</div>,
		document.getElementById('modal')
	);
}
export default Modal;
```

在上面的代码中，我们将要渲染的视图作为`createPortal`方法的第一个参数，而第二个参数用于指定要渲染到哪个 DOM 元素中。

![image-20240413223741142](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240413223741142.png)

可以看到，这一次模态框就被渲染到了 id 为 modal 的 div 中。并且在 root 中所设置的样式都不会影响到模态框的显示。

> 其实根据官方的介绍，_Portals_ 的典型用例是当父组件有 overflow: hidden 或 z-index 样式时，但你需要子组件能够在视觉上"跳出"其容器。例如，对话框、悬浮卡以及提示框。

### 通过 Portals 进行事件冒泡

最后需要注意一下的就是使用 _Portal_ 所渲染的元素在触发事件时的冒泡问题。

以上面的例子为例，看上去模态框已经渲染到了 modal 这个元素里面，但是在 React 中事件冒泡是按照组件结构来进行冒泡的，我们可以看到即使模态框已经渲染到了 modal 里面，但是在组件树中模态框组件仍然是在根组件中。

![image-20240413223958759](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240413223958759.png)

我们也可以书写一个例子来验证一下，例如我们为 App 根组件绑定一个点击事件，如下:

```jsx
// App.jsx
import { useState } from 'react';
import Modal from './components/Modal';
function App() {
	const [isShow, setIsShow] = useState(false);
	return (
		<div
			style={{
				position: 'relative',
			}}
			onClick={() => console.log('App组件被点击了')}
		>
			<h1>App组件</h1>
			<button onClick={() => setIsShow(!isShow)}>显示/隐藏</button>
			{isShow ? <Modal /> : null}
		</div>
	);
}
export default App;
```

然后我们点击 Modal，会发现事件也被触发了

> 官方解释：
>
> 尽管 portal 可以被放置在 DOM 树中的任何地方，但在任何其他方面，其行为和普通的 React 子节点行为一致。由于 portal 仍存在于 React 树，且与 DOM 树中的位置无关，那么无论其子节点是否是 portal,像 context 这样的功能特性都是不变的。
>
> 这包含事件冒泡。一个从 portal 内部触发的事件会一直冒泡至包含 React 树的祖先，即便这些元素并不是 DOM 树中的祖先。
