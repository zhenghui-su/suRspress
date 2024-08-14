# 组件实战之 Space 间距组件

我们一般使用 flex、margin 等写布局，每个组件都要用，但其实很多布局是通用的，我们能否可以把布局抽离出来，作为一个组件来复用呢？

可以，这类组件叫布局组件，**布局就是确定元素的位置**，比如间距、对齐都是确定元素位置的

antd 中也有专门一个分类就是布局分类：

![image-20240814202026056](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814202026056.png)

本小节我们写一下其中的 Space 间距组件，先创建项目：

```sh
npx create-react-app --template=typescript space-component
```

## 使用 Space 组件

我们首先了解一下这个组件是啥样的，安装一下 antd：

```sh
npm install --save antd
```

然后改一下`App.tsx`：

```tsx
import "./App.css";

export default function App() {
	return (
		<div>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</div>
	);
}
```

随后我们改一下样式`App.css`：

```css
.box {
	width: 100px;
	height: 100px;
	background: pink;
	border: 1px solid #000;
}
```

通过`npm run start`跑开发服务器，渲染结果如下：

![image-20240814202448798](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814202448798.png)

可以看到紧紧的贴合在一起了，然后我们使用 antd 的 Space 组件包裹一下：

```tsx
import { Space } from "antd";
import "./App.css";

export default function App() {
	return (
		<div>
			<Space direction="horizontal">
				<div className="box"></div>
				<div className="box"></div>
				<div className="box"></div>
			</Space>
		</div>
	);
}
```

效果如下，变成方向水平排列，同时有一个默认的间距：

![image-20240814202632666](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814202632666.png)

我们还可以改成原来的竖直，把`direction`的值改为`vertical`：

![image-20240814202720037](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814202720037.png)

其中，水平和竖直的间距都可以通过 `size` 属性来设置：

![image-20240814202836206](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814202836206.png)

`size`属性可以设置为`large`、`middle`、`small`，或者像上面的任意数值

还可以用数组分别设置行、列的间距，比如`size={['large', 200]}`

如果下面有多个子节点，可以设置对齐方式为 `start`、`end`、`center` 或者 `baseline`：

![image-20240814203111077](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814203111077.png)

如果子节点过多，还可以设置`wrap`属性为 true 来换行

![image-20240814203234307](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814203234307.png)

我们还可以设置`split`分割线部分，即分隔间距中塞入什么东西：

![image-20240814203459427](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814203459427.png)

此外，我们也可以不设置`size`属性，而通过`ConfigProvider` 修改 context 中的默认值：

![image-20240814203654893](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814203654893.png)

很明显，`Space` 内部会读取 Context 中的 `size` 值，因此如果有多个 `Space` 组件，可以统一通过 `ConfigProvider` 来管理它们的`size` 值

![image-20240814203929538](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814203929538.png)

因此，Space 组件的全部用法，大概就是下面几点：

- direction: 设置子组件方向，水平还是竖直排列
- size：设置水平、竖直的间距
- align：子组件的对齐方式
- wrap：超过一屏是否换行，只在水平时有用
- split：分割线
- 多个 Space 组件的 size 可以通过 ConfigProvider 统一设置默认值。

这类布局组件好处就是在固定的布局中可以快速复用，那么它如何实现呢？打开控制台查看

![image-20240814204113627](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814204113627.png)

我们发现实现就是对每个 child 包一层 div，然后加上不同的 className 就好了。

## 组件编写

下面我们来写这个组件，创建`src/Space`目录，新建`index.tsx`：

```tsx
import React from "react";

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
}

export const Space: React.FC<SpaceProps> = (props) => {
	const { className, style, ...rest } = props;

	return <div className={className} style={style} {...rest}></div>;
};
```

`className` 和 `style` 的参数就不解释了，主要这里继承了 `HTMLAttributes<HTMLDivElement>` 类型，那就可以传入各种 div 的属性。

我们把这个从 `App.tsx`里面替换一下：

```tsx
import { Space } from "./Space";
import "./App.css";

export default function App() {
	return (
		<div>
			<Space></Space>
		</div>
	);
}
```

我们可以在 Space 上传入 div 的相关属性：

![image-20240814204704926](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814204704926.png)

这样，Space 用起来其实和 div 一样，我们只需要把其他参数传给 Space 组件里的 div 即可。

### 声明 props

随后我们声明一下我们自己要用到的 props：

```tsx
export type SizeType = "small" | "middle" | "large" | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	direction?: "horizontal" | "vertical";
	size?: SizeType | [SizeType, SizeType];
	align?: "start" | "end" | "center" | "baseline";
	wrap?: boolean;
	split?: React.ReactNode;
}
```

`split` 是 ReactNode 类型，也就是可以传入 jsx，其他不多解释，上面刚刚用过。

### React.Children

然后我们需要写内容部分，还记得上面的实现吗，我们传入的子节点都被包了一层 div，这是怎么做到的呢？

这里需要用 React.Children 的 api，可以查看文档：[https://react.dev/reference/react/Children](https://react.dev/reference/react/Children)

![image-20240814205134185](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814205134185.png)

这些就是用于 children 的遍历、修改、计数等操作的。

可能有疑问的点是`toArray`函数，children 不已经是数组了吗，为什么还有这个函数，我们看下面代码

```tsx
import React from "react";

interface TestProps {
	children: React.ReactNode[];
}

function Test(props: TestProps) {
	const children2 = React.Children.toArray(props.children);

	console.log(props.children);
	console.log(children2);
	return <div></div>;
}

export default function App() {
	return (
		<Test>
			{[[<div>111</div>, <div>222</div>], [<div>333</div>]]}
			<span>hello world</span>
		</Test>
	);
}
```

分别打印 `props.children` 和 `Children.toArray` 处理之后的 children：

![image-20240814205322026](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814205322026.png)

可以看到，`Reac.Children.toArray`方法会对 children 做扁平化处理。而且 `props.children` 调用 `sort` 方法会报错，而在`toArray`之后就不会且可以正常排序

### 内容部分

我们根据刚刚学到的知识，来遍历下 Children，给每个外面包一个 div：

```tsx
export const Space: React.FC<SpaceProps> = (props) => {
	const { className, style, ...rest } = props;

	const childNodes = React.Children.toArray(props.children);

	const nodes = childNodes.map((child: any, i) => {
		const key = (child && child.key) || `space-item-${i}`;

		return (
			<div className="space-item" key={key}>
				{child}
			</div>
		);
	});

	return (
		<div className={className} style={style} {...rest}>
			{nodes}
		</div>
	);
};
```

然后我们测试一下，改一下`App.tsx`：

```tsx
export default function App() {
	return (
		<div>
			<Space>
				<div>111</div>
				<div>222</div>
				<div>333</div>
			</Space>
		</div>
	);
}
```

可以看到每个字节点都包裹上 div 了：

![image-20240814205901946](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814205901946.png)

### props

把 props 的默认值啥的弄一下：

![image-20240814210322006](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814210322006.png)

### 处理类名

然后依旧引入 classnames 包用来合并类名，记得下载

![image-20240814210353455](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814210353455.png)

```tsx
import React from "react";
import classNames from "classnames";

export type SizeType = "small" | "middle" | "large" | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	direction?: "horizontal" | "vertical";
	size?: SizeType | [SizeType, SizeType];
	align?: "start" | "end" | "center" | "baseline";
	wrap?: boolean;
	split?: React.ReactNode;
}

export const Space: React.FC<SpaceProps> = (props) => {
	const {
		className,
		style,
		children,
		size = "small",
		direction = "horizontal",
		align,
		split,
		wrap = false,
		...rest
	} = props;

	const childNodes = React.Children.toArray(children);
	const mergedAlign =
		direction === "horizontal" && align === undefined ? "center" : align;

	const cn = classNames(
		"space",
		`space-${direction}`,
		{
			[`space-align-${mergedAlign}`]: mergedAlign
		},
		className
	);

	const nodes = childNodes.map((child: any, i) => {
		const key = (child && child.key) || `space-item-${i}`;

		return (
			<div className="space-item" key={key}>
				{child}
			</div>
		);
	});

	return (
		<div className={cn} style={style} {...rest}>
			{nodes}
		</div>
	);
};
```

我们需要根据 direction、align 的 props 来生成 className，试一下：

```tsx
export default function App() {
	return (
		<Space direction="horizontal" align="end">
			<div>111</div>
			<div>222</div>
			<div>333</div>
		</Space>
	);
}
```

查看控制台，没问题了

![image-20240814210505398](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814210505398.png)

### 处理样式

接下来就简单了，根据不同的类名，写一下样式，下载 sass 包：

```sh
npm install --save-dev sass
```

新建`Space/index.scss`

整个容器 `inline-flex`，然后根据不同的参数设置 `align-items` 和 `flex-direction` 的值。

```scss
.space {
	display: inline-flex;

	&-horizontal {
		flex-direction: row;
	}

	&-vertical {
		flex-direction: column;
	}

	&-align {
		&-center {
			align-items: center;
		}

		&-start {
			align-items: flex-start;
		}

		&-end {
			align-items: flex-end;
		}

		&-baseline {
			align-items: baseline;
		}
	}
}
```

在 Space 中引入一下：

![image-20240814210811536](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814210811536.png)

然后试一下：

```tsx
export default function App() {
	return (
		<Space direction="vertical" align="end">
			<div>111</div>
			<div>222</div>
			<div>333</div>
		</Space>
	);
}
```

查看控制台：

![image-20240814210955969](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814210955969.png)

### 处理 size 和 wrap

接下来是根据传入的 size 来计算间距

![image-20240814211604032](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814211604032.png)

![image-20240814211615386](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814211615386.png)

如果 size 不是数组，就要扩展成数组，然后再判断是不是 `small`、`middle`、`large` 这些，是的话就变成具体的值。

最终根据 size 设置 `column-gap` 和 `row-gap` 的样式，如果有 wrap 参数，还要设置 `flex-wrap`。

```tsx
import React from "react";
import classNames from "classnames";
import "./index.scss";

export type SizeType = "small" | "middle" | "large" | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	style?: React.CSSProperties;
	direction?: "horizontal" | "vertical";
	size?: SizeType | [SizeType, SizeType];
	align?: "start" | "end" | "center" | "baseline";
	wrap?: boolean;
	split?: React.ReactNode;
}

const spaceSize = {
	small: 8,
	middle: 16,
	large: 24
};

function getNumberSize(size: SizeType) {
	return typeof size === "string" ? spaceSize[size] : size || 0;
}

export const Space: React.FC<SpaceProps> = (props) => {
	const {
		className,
		style,
		children,
		size = "small",
		direction = "horizontal",
		align,
		split,
		wrap = false,
		...rest
	} = props;

	const childNodes = React.Children.toArray(children);
	const mergedAlign =
		direction === "horizontal" && align === undefined ? "center" : align;

	const cn = classNames(
		"space",
		`space-${direction}`,
		{
			[`space-align-${mergedAlign}`]: mergedAlign
		},
		className
	);

	const nodes = childNodes.map((child: any, i) => {
		const key = (child && child.key) || `space-item-${i}`;

		return (
			<div className="space-item" key={key}>
				{child}
			</div>
		);
	});

	const otherStyles: React.CSSProperties = {};

	const [horizontalSize, verticalSize] = React.useMemo(
		() =>
			((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map(
				(item) => getNumberSize(item)
			),
		[size]
	);

	otherStyles.columnGap = horizontalSize;
	otherStyles.rowGap = verticalSize;

	if (wrap) {
		otherStyles.flexWrap = "wrap";
	}

	return (
		<div
			className={cn}
			style={{
				...otherStyles,
				...style
			}}
			{...rest}
		>
			{nodes}
		</div>
	);
};
```

然后我们试下：

```tsx
export default function App() {
	return (
		<Space
			className="container"
			direction="horizontal"
			align="end"
			wrap={true}
			size={["large", "small"]}
		>
			<div className="box"></div>
			<div className="box"></div>
			<div className="box"></div>
		</Space>
	);
}
```

改一下`App.css`方便查看：

```css
.box {
	width: 100px;
	height: 100px;
	background: pink;
	border: 1px solid #000;
}

.container {
	width: 300px;
	height: 300px;
	background: green;
}
```

可以看到，gap、flex-wrap 的设置都是对的：

![image-20240814211838035](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814211838035.png)

### 处理 split

接下来处理 split 参数，其实就是在包裹 div 的时候加上 split 分隔的 jsx ：

![image-20240814212116031](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814212116031.png)

```tsx
const nodes = childNodes.map((child: any, i) => {
	const key = (child && child.key) || `space-item-${i}`;

	return (
		<>
			<div className="space-item" key={key}>
				{child}
			</div>
			{i < childNodes.length && split && (
				<span className={`${className}-split`} style={style}>
					{split}
				</span>
			)}
		</>
	);
});
```

### 处理 context

前面有提到，Space 还可以从 ConfigProvider 中取值，当有 ConfigProvider 包裹的时候，就不用单独设置 size 了，会直接用那里的配置。

这个很明显用的 context 实现，我们新建`Spcae/ConfigProvider.tsx`：

```tsx
import React from "react";
import { SizeType } from ".";

export interface ConfigContextType {
	space?: {
		size?: SizeType;
	};
}

export const ConfigContext = React.createContext<ConfigContextType>({});
```

在 Space 组件里用 useContext 读取它：

![image-20240814212502203](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814212502203.png)

这样通过`||`默认值会优先使用 context 里面的值。

至此，我们的 Space 组件就完成了，我们测试一下，就按之前的代码：

```tsx
import "./App.css";
import { Space } from "./Space";
import { ConfigContext } from "./Space/ConfigProvider";

export default function App() {
	return (
		<div>
			<ConfigContext.Provider value={{ space: { size: 20 } }}>
				<Space direction="horizontal">
					<div className="box"></div>
					<div className="box"></div>
					<div className="box"></div>
				</Space>
				<Space direction="vertical">
					<div className="box"></div>
					<div className="box"></div>
					<div className="box"></div>
				</Space>
			</ConfigContext.Provider>
		</div>
	);
}
```

渲染结果如下，没有问题：

![image-20240814212635992](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814212635992.png)

## 简化 Provider

这里的 ConfigProvider 和 antd 的还是不大一样，我们还需要通过 Provider 来，所以需要再包裹一下：

![image-20240814212921278](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814212921278.png)

这样子我们用的时候就一样了：

```tsx
import "./App.css";
import { Space } from "./Space";
import { ConfigProvider } from "./Space/ConfigProvider";

export default function App() {
	return (
		<div>
			<ConfigProvider space={{ size: 20 }}>
				<Space direction="horizontal">
					<div className="box"></div>
					<div className="box"></div>
					<div className="box"></div>
				</Space>
				<Space direction="vertical">
					<div className="box"></div>
					<div className="box"></div>
					<div className="box"></div>
				</Space>
			</ConfigProvider>
		</div>
	);
}
```

至此我们这个 Space 间距组件就完成了。

代码 Github 仓库地址：[https://github.com/zhenghui-su/space-component](https://github.com/zhenghui-su/space-component)
