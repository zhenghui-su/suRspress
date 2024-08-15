# React.Children 和它的替代方案

上节我们用到了`React.Children`的 api，这节我们详细聊聊，有这些 api：

- Children.count(children)
- Children.forEach(children, fn, thisArg?)
- Children.map(children, fn, thisArg?)
- Children.only(children)
- Children.toArray(children)

## React.Children

我们每个都试一下，先创建一个项目：

```sh
npx create-react-app --template=typescript children-test
```

然后进入`index.tsx`改一下：

```tsx
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<App />);
```

随后我们在`App.tsx`里面测试这些：

```tsx
import React, { FC } from "react";

interface AaaProps {
	children: React.ReactNode;
}

const Aaa: FC<AaaProps> = (props) => {
	const { children } = props;

	return (
		<div className="container">
			{React.Children.map(children, (item) => {
				return <div className="item">{item}</div>;
			})}
		</div>
	);
};

function App() {
	return (
		<Aaa>
			<a href="#">111</a>
			<a href="#">222</a>
			<a href="#">333</a>
		</Aaa>
	);
}

export default App;
```

在传入的 children 外包了一层类名为 `.item` 的 div，然后跑一下，效果如下：

![image-20240815204320857](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815204320857.png)

有的同学会说，如果直接用数组的 api 可以吗，我们试一下：

```tsx
interface AaaProps {
	children: React.ReactNode[];
}

const Aaa: FC<AaaProps> = (props) => {
	const { children } = props;

	return (
		<div className="container">
			{
				// React.Children.map(children, (item) => {
				children.map((item) => {
					return <div className="item">{item}</div>;
				})
			}
		</div>
	);
};
```

要用数组的 api 需要把 children 类型声明为 `ReactNode[]`，然后再用数组的 map 方法：

![image-20240815204428250](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815204428250.png)

看起来好像一样？但其实有个问题，首先，因为要用数组方法，所以声明了 children 为 `ReactNode[]`，这就导致了如果 children 只有一个元素会报错：

![image-20240815204928074](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815204928074.png)

更重要的是当 children 传数组的时候：

```tsx
function App() {
	return (
		<Aaa>
			{[
				<span>111</span>,
				<span>333</span>,
				[<span>444</span>, <span>222</span>]
			]}
		</Aaa>
	);
}
```

经过数组的 map 处理后就变成了这样：

![image-20240815205035234](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205035234.png)

而如果我们换成`React.Children.map`处理就是这样：

![image-20240815205114456](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205114456.png)

简单说就是`React.Children.map`方法会把 children 组件扁平化，而数组的方法不会。

还有一点，有时候使用数组的 sort 方法会报错：

```tsx
import React, { FC } from "react";

interface AaaProps {
	children: React.ReactNode[];
}

const Aaa: FC<AaaProps> = (props) => {
	const { children } = props;

	console.log(children.sort());

	return <div className="container"></div>;
};

function App() {
	return (
		<Aaa>
			{33}
			<span>hello world</span>
			{22}
			{11}
		</Aaa>
	);
}

export default App;
```

报错如下：

![image-20240815205324009](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205324009.png)

因为 `props.children` 的元素是只读的，不能重新赋值，所以也就不能排序。

但我们使用`React.Children.toArray`方法转成数组就好了

> 这里不用 children 数组方法了，就直接声明为 ReactNode 类型了

![image-20240815205511900](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205511900.png)

打印结果如下，不报错了：

![image-20240815205544430](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205544430.png)

综上，直接用数组方法操作 children 有 3 个问题：

- 用数组的方法需要声明 children 为 `ReactNode[]` 类型，这样就必须**传入多个元素**才行，而 `React.Children` 不用
- 用数组的方法不会对 children 做**扁平化**处理，而 `React.Children` 会
- 用数组的方法不能做排序，因为 children 的元素是**只读**的，而用 `React.Children.toArray` 转成数组就可以了

当然，不用记这些区别，只要操作 children，就用 `React.Children` 的 api 就行了。

我们再试下其它 `React.Children` 的 api：

```tsx
import React, { FC, useEffect } from "react";

interface AaaProps {
	children: React.ReactNode;
}

const Aaa: FC<AaaProps> = (props) => {
	const { children } = props;

	useEffect(() => {
		const count = React.Children.count(children);

		console.log("count", count);

		React.Children.forEach(children, (item, index) => {
			console.log("item" + index, item);
		});

		const first = React.Children.only(children);
		console.log("first", first);
	}, []);

	return <div className="container"></div>;
};

function App() {
	return (
		<Aaa>
			{33}
			<span>hello world</span>
			{22}
			{11}
		</Aaa>
	);
}

export default App;
```

`React.Children.count` 是计数，`forEach` 是遍历、`only` 是如果 children 不是一个元素就报错。

这几个都比较容易，不多解释，接下来说别的。

## 替代

在 React 官网中，Children 的 api 被放到了 Legacy 目录下，并且提示用 Children 的 api 会导致代码脆弱，建议用别的方式替代：

![image-20240815205939866](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815205939866.png)

我们来看看这些替代方案，先用`React.Children`实现：

```tsx
import React, { FC } from "react";

interface RowListProps {
	children?: React.ReactNode;
}

const RowList: FC<RowListProps> = (props) => {
	const { children } = props;

	return (
		<div className="row-list">
			{React.Children.map(children, (item) => {
				return <div className="row">{item}</div>;
			})}
		</div>
	);
};

function App() {
	return (
		<RowList>
			<div>111</div>
			<div>222</div>
			<div>333</div>
		</RowList>
	);
}

export default App;
```

对传入的 children 做了一些修改之后渲染，结果如下：

![image-20240815210107738](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815210107738.png)

### 第一种方案

第一种替代的方案，就是把对 children 包装的那一层封装个组件，然后外面自己来包装。

```tsx
import React, { FC } from "react";

interface RowProps {
	children?: React.ReactNode;
}

const Row: FC<RowProps> = (props) => {
	const { children } = props;
	return <div className="row">{children}</div>;
};

interface RowListProps {
	children?: React.ReactNode;
}

const RowList: FC<RowListProps> = (props) => {
	const { children } = props;

	return <div className="row-list">{children}</div>;
};

function App() {
	return (
		<RowList>
			<Row>
				<div>111</div>
			</Row>
			<Row>
				<div>222</div>
			</Row>
			<Row>
				<div>333</div>
			</Row>
		</RowList>
	);
}

export default App;
```

效果是一样的：

![image-20240815210222029](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815210222029.png)

当然这里 `RowListProps` 和 `RowProps` 都是只有 children，我们直接用内置类型 `PropsWithChildren` 来简化下：

```tsx
import React, { FC, PropsWithChildren } from "react";

const Row: FC<PropsWithChildren> = (props) => {
	const { children } = props;
	return <div className="row">{children}</div>;
};

const RowList: FC<PropsWithChildren> = (props) => {
	const { children } = props;

	return <div className="row-list">{children}</div>;
};

function App() {
	return (
		<RowList>
			<Row>
				<div>111</div>
			</Row>
			<Row>
				<div>222</div>
			</Row>
			<Row>
				<div>333</div>
			</Row>
		</RowList>
	);
}

export default App;
```

### 第二种方案

第二种方案，不使用 children 传入具体内容，而是自己定义一个 prop，我们声明了 items 的 props，通过其中的 content 来传入内容：

```tsx
import { FC, PropsWithChildren, ReactNode } from "react";

interface RowListProps extends PropsWithChildren {
	items: Array<{
		id: number;
		content: ReactNode;
	}>;
}

const RowList: FC<RowListProps> = (props) => {
	const { items } = props;

	return (
		<div className="row-list">
			{items.map((item) => {
				return (
					<div className="row" key={item.id}>
						{item.content}
					</div>
				);
			})}
		</div>
	);
};

function App() {
	return (
		<RowList
			items={[
				{
					id: 1,
					content: <div>111</div>
				},
				{
					id: 2,
					content: <div>222</div>
				},
				{
					id: 3,
					content: <div>333</div>
				}
			]}
		></RowList>
	);
}

export default App;
```

渲染的结果是一样的：

![image-20240815210423433](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815210423433.png)

而且还可以通过 render props 来定制渲染逻辑：

```tsx
import { FC, PropsWithChildren, ReactNode } from "react";

interface Item {
	id: number;
	content: ReactNode;
}

interface RowListProps extends PropsWithChildren {
	items: Array<Item>;
	renderItem: (item: Item) => ReactNode;
}

const RowList: FC<RowListProps> = (props) => {
	const { items, renderItem } = props;

	return (
		<div className="row-list">
			{items.map((item) => {
				return renderItem(item);
			})}
		</div>
	);
};

function App() {
	return (
		<RowList
			items={[
				{
					id: 1,
					content: <div>111</div>
				},
				{
					id: 2,
					content: <div>222</div>
				},
				{
					id: 3,
					content: <div>333</div>
				}
			]}
			renderItem={(item) => {
				return (
					<div className="row" key={item.id}>
						<div className="box">{item.content}</div>
					</div>
				);
			}}
		></RowList>
	);
}

export default App;
```

结果如下：

![image-20240815210542839](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240815210542839.png)

综上，替代 props.children 有两种方案：

- 把对 children 的修改封装成一个组件，使用者用它来手动包装
- 声明一个 props 来接受数据，内部基于它来渲染，而且还可以传入 render props 让使用者定制渲染逻辑

挑一个 antd 的 Tabs 组件来说，它之前是通过`React.Children`实现，用`Tabs.TabPanel`，现在建议使用`items`方式，这个方式就是用第二种方案来实现的。
