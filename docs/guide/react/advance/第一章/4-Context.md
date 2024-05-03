## Context

有关 _Context_ _，这是一个非常重要的知识点，甚至我们之后在书写 mini-react，mini-react-router、 mini-redux 时都会用到的一个知识点，所以这一小节，我们就来好好看一下_ _Context_ 的相关内容，主要包含以下几个点:

- _Context_ 要解决的问题
- _Context_ 的用法
- _Context_ 相关 Hook

### Context 要解决的问题

首先来看一下 _Context_ 要解决的问题。正常来讲，我们单页应用中的组件会形成一个像组件树一样结构，当内部组件和组件之间要进行数据传递时，就免不了一层一层先传递到共同的父组件，然后再一层一层传递下去。

![image-20240411161016501](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240411161016501.png)

假设 subComA-1 组件的状态数据要传递给 subComB-2 组件，应该怎么做?

根据我们前面所讲的单项数据流的规则，那么数据应该被提升到 App 根组件，然后通过 props 一层一层的传递给下面的子组件，最终 subComA-1 拿到所需要的数据；如果 subComA-1 组件需要修改传递下来的数据，那么该组件就还需接收从 App 根组件一层一层传递下来的能够修改数据的方法。

官方在"何时使用 _Context_ 这一小节也举了一个形象的例子：[何时使用 Context](https://zh-hans.legacy.reactjs.org/docs/context.html#when-to-use-context)

因此，简单概括 _Context_ ，就是解决组件之间数据共享的问题，避免一层一层的传递。

_Context_ 如果直接翻译成中文，会被翻译成"上下文"，这其实在软件领域很常见的一个词，比如前面我们也学习过"执行上下文"，所谓上下文，往往指的是代码执行时所需的**数据环境信息**。

### Context 的用法

React 官方对于 _Context_ 的用法，分为旧版 API 和新版 API,有关旧版 API 的用法，本文档就不再赘述，如果有需要的同学，可以参阅: [过时的 Context](https://zh-hans.reactjs.org/docs/legacy-context.html)

#### 新版 API 使用

这里我们来看一下新版 API 的使用，示例如下:

```javascript
// src/context/index.js
import React from 'react';

const MyContext = React.createContext();
export default MyContext;
```

首先，使用`React.createContext` API 创建的一个上下文对象，该对象里面会提供两个组件，分别是 _Provider_ 和 _Consumer_ ，表示数据的提供者和消费者。

```jsx
// App.jsx
import ChildCom1 from './components/ChildCom1';
import MyContext from './context';
import { useState } from 'react';

const { Provider } = MyContext;

function App() {
	// 这是我在根组件维护的状态数据
	const [count, setCount] = useState(0);

	return (
		// 这里的value 相当于将数据放入到上下文环境
		<Provider value={{ count, setCount }}>
			<div style={{ border: '1px solid', width: '250px' }}>
				<ChildCom1 />
			</div>
		</Provider>
	);
}
export default App;
```

在根组件 App.jsx 中，我们设置了一个根组件的状态数据 count，然后从 MyContext 中解构出 _Provider_ 组件来作为数据的提供者，value 属性用来设置要提供的数据。

```jsx
// ChildCom1.jsx
import React from 'react';
import ChildCom2 from './components/ChildCom2';
import ChildCom3 from './components/ChildCom3';

function ChildCom1() {
	return (
		<div>
			这是子组件1
			<ChildCom2 />
			<ChildCom3 />
		</div>
	);
}
export default ChildCom1;
```

在 ChildCom1 子组件中，无需再像中转站一样接受父组件的数据然后又传递给 ChildCom2 和 ChildCom3 组件。

```jsx
// ChildCom2.jsx
import React from 'react';
import MyContext from '../context';

// 从上下文中读取数据
const { Consumer } = MyContext;

function ChildCom2() {
	return (
		<Consumer>
			{(context) => {
				console.log(context); // {count: 0, setCount: f}
				return (
					<div
						style={{
							border: '1px solid',
							width: '200px',
							userSelect: 'none',
						}}
						onClick={() => context.setCount(context.count + 1)}
					>
						ChildCom2
						<div>count:{context.count}</div>
					</div>
				);
			}}
		</Consumer>
	);
}
export default ChildCom2;
```

ChildCom2 组件是一个函数组件，函数组件想要获取 _Context_ 上下文中的数据，需要使用 _Consumer_ 组件，这种方法需要一个函数作为主元素，这个函数接收当前的 context 值，并返回一个 React 节点。

```jsx
import React, { Component } from 'react';
import MyContext from '../context';

class ChildCom3 extends Component {
	static contextType = MyContext;

	render() {
		return (
			<div
				style={{
					border: '1px solid',
					width: '200px',
					userSelect: 'none',
				}}
				onClick={() => this.context.setCount(this.context.count + 1)}
			>
				ChildCom3
				<div>count:{this.context.count}</div>
			</div>
		);
	}
}
export default ChildCom3;
```

ChildCom3 组件是一个类组件， 类组件当然也可以使用上面 _Consumer_ 的方式来获取上下文中的数据，但对于类组件而言，还可以使用 _contextType_ 的方式。挂载在 class 上的 _contextType_ 属性可以赋值为由`React createContext()`创建的 Context 对象。

> 最终效果就是点击 ChildCom2 或者 ChildCom3，count 数据都会增加

#### displayName

如果安装了 React Developer Tools 工具，那么在 components 选项卡中可以看到如下的组件树结构，默认的名字就为`Context.Provider`和`Context.Consumer`

```javascript
|-App
	|-Context.Provider
		|-ChildCom1
			|-ChildCom2
				|-Context.Consumer
			|-ChildCom3
```

通过设置 _displayName_ 可以修改显示名字，如下：

```javascript
import React from 'react';

const MyContext = React.createContext();
MyContext.displayName = 'count';
export default MyContext;
```

#### 默认值

_Context_ 上下文环境可以设置默认值，如下：

```javascript
import React from 'react';

const MyContext = React.createContext({
	name: 'chenchen',
	age: 18,
});
MyContext.displayName = 'count';
export default MyContext;
```

此时就<u>不再需要 _Provider_ 组件来提供数据</u>了，子组件可以直接消费上下文环境的默认数据。

#### 多个上下文环境

在上面的示例中，我们示例的都是一个 _Context_ 上下文环境，这通常也够用了，但是这并不意味着只能提供一个上下文环境，我们可以创建多个上下文环境，示例如下:

```javascript
import React from 'react';

export const MyContext1 = React.createContext();
export const MyContext2 = React.createContext();
```

首先，我们导出两个上下文环境，接下来在 App.jsx 中，使用多个 _Provider_ 作为数据的提供者

```jsx
import ChildCom1 from './components/ChildCom1';
import { MyContext1, MyContext2 } from './context';

function App() {
	return (
		<MyContext1.Provider value={{ a: 1, b: 2 }}>
			<MyContext2.Provider value={{ b: 10, c: 20 }}>
				<div style={{ border: '1px solid', width: '250px' }}>
					<ChildCom1 />
				</div>
			</MyContext2.Provider>
		</MyContext1.Provider>
	);
}
export default App;
```

之后在 ChildCom2 中同样也可以使用多个 _Consumer_ 来消费不同上下文中的数据

```jsx
import React from 'react';
import { MyContext1, MyContext2 } from '../context';

function ChildCom2() {
	return (
		<MyContext1.Consumer>
			{(context1) => {
				return (
					<MyContext2.Consumer>
						{(context2) => {
							return (
								<div>
									ChildCom2
									<div>Context1-a: {context1.a}</div>
									<div>Context1-b: {context1.b}</div>
									<div>Context2-b: {context2.b}</div>
									<div>Context2-c: {context2.c}</div>
								</div>
							);
						}}
					</MyContext2.Consumer>
				);
			}}
		</MyContext1.Consumer>
	);
}
export default ChildCom2;
```

> 如果重名回调里面 context 参数重名，就会根据最近的 context 读取

### Context 相关 Hook

在 React Hook API 中，为我们提供了一个更加方便的`useContext`钩子函数，该 Hook 接收一个由`React.createContext` API 创建的上下文对象，并返回该 _context_ 的当前值。

例如:

```jsx
import { useContext } from 'react'
import { MyContext1 } from '../context'

function ChildCom2() {
    const { a, b } = useContext(MyContext1);
    return (
    	<div>Context1-a的值: {a}</div>
        <div>Context1-b的值: {b}</div>
    )
}
export default ChildCom2;
```

`useContext(MyContext)`相当于类组件中的`static contextType = MyContext`或者`<MyContext.Consumer>`，但是我们仍然需要在上层组件树中使用`<MyContext.Provider>`来为下层组件提供 _context_ 。
