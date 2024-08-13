# 组件实战之 Icon 图标组件

Icon 图标组件是常用的组件，使用起来非常简单，只需要复制图标的组件名字就可以直接渲染：

![image-20240813234102407](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813234102407.png)

它也有一些 props，比如 spin 是让图标不断的转圈，rotate 是指定图标的旋转角度

antd 内置了很多图标组件，如果觉得不够用，还可以自己扩展：

```tsx
import React from "react";
import Icon from "@ant-design/icons";
import type { GetProps } from "antd";

type CustomIconComponentProps = GetProps<typeof Icon>;

const HeartSvg = () => (
	<svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
		<path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
	</svg>
);

const HeartIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={HeartSvg} {...props} />
);

const App: React.FC = () => <HeartIcon style={{ color: "pink" }} />;

export default App;
```

只要对 Icon 组件包一层，component 参数传入图标的 svg，那就是一个新的图标组件。

![image-20240813234405799](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813234405799.png)

如果你的项目使用了 iconfont，还可以把 iconfont 图标封装成 Icon 组件：

```tsx
import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";
import { Space } from "antd";

const IconFont = createFromIconfontCN({
	scriptUrl: "xxx.js"
});

const App: React.FC = () => (
	<Space>
		<IconFont type="icon-tuichu" />
		<IconFont type="icon-facebook" />
		<IconFont type="icon-twitter" />
	</Space>
);

export default App;
```

通过`createFromIconfontCN`方法，传入 scriptUrl，就可以直接用 IconFont 的组建了。

Icon 组件没有很多用法，我们接下来自己实现一个，新建：

```sh
npx create-react-app --template=typescript icon-component
```

## 编写组件

新建`src/Icon`目录，新建`index.tsx`文件：

```tsx
import React, { forwardRef, PropsWithChildren } from "react";

type BaseIconProps = {
	className?: string;
	style?: React.CSSProperties;
	size?: string | string[];
	spin?: boolean;
};

export type IconProps = BaseIconProps &
	Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
	(props, ref) => {
		const { className, style, size = "1em", spin, children, ...rest } = props;

		return (
			<svg ref={ref} style={style} fill="currentColor" {...rest}>
				{children}
			</svg>
		);
	}
);
```

`className`、`style`、`size`、`spin`、`children`这些好理解，多的`rest`是因为 Icon 就是对 svg 的封装，所以我们也接受所有 svg 的属性，透传给内部的 svg。

这里使用了`forwardRef`将 svg 的 ref 转发出去，从而暴露 api

然后`size`大小默认为`1em`，它就相当于用`font-size`的大小

填充颜色用 currentColor，也就是 color 的值：

![image-20240813235749290](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240813235749290.png)

这也就是为什么我们可以通过 font-size 和 color 来修改 Icon 组件的大小和颜色。

### 处理 size

随后我们处理一下 size 参数，它可以传 `[width, height]` 分别指定宽高，也可以传 `某px` 来同时指定宽高，所以要做下处理。

```tsx
export const getSize = (size: IconProps["size"]) => {
	if (Array.isArray(size) && size.length === 2) {
		return size as string[];
	}
	const width = (size as string) || "1em";
	const height = (size as string) || "1em";

	return [width, height];
};
```

定义一个处理函数，传数组就不变，传单个就处理返回一个数组，然后在组件里面用它：

![image-20240814000335055](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814000335055.png)

### 处理 className

我们要类名合并，所以你就能想到要用到 classnames 这个包了：

```sh
npm install --save classnames
```

然后处理使用一下：

![image-20240814000619368](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814000619368.png)

这里需要实现 icon-spin 的样式，先安装一下 sass 包：

```sh
npm install --save-dev sass
```

然后在`src/Icon`下新建`index.scss`文件：

```scss
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

.icon {
	display: inline-block;
}

.icon-spin {
	animation: spin 1s linear infinite;
}
```

icon 设置为 `inline-block`，也就是行内元素但是可以设置宽高，icon-spin 执行无限旋转动画。

然后我们引入一下：

![image-20240814000858845](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814000858845.png)

至此，我们就封装完了 Icon 组件，没错，就是这么简单。

## 创建 Icon 组件

在封装完毕后，我们需要一个创建 Icon 的方法，接收 svg 的内容，同时可以设置 IconProps、fill 颜色等

在`src/Icon`下新建`createIcon.tsx`：

```tsx
import React, { forwardRef } from "react";
import { Icon, IconProps } from ".";

interface CreateIconProps {
	content: React.ReactNode;
	iconProps?: IconProps;
	viewBox?: string;
}

export function createIcon(options: CreateIconProps) {
	const { content, iconProps = {}, viewBox = "0 0 1024 1024" } = options;

	return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
		return (
			<Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
				{content}
			</Icon>
		);
	});
}
```

我们可以用它创建几个 Icon 组件试一下，新建`src/Icon/icons/IconAdd.tsx`：

```tsx
import { createIcon } from "../createIcon";

export const IconAdd = createIcon({
	content: (
		<>
			<path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
		</>
	)
});
```

新建`src/Icon/icons/IconEmail.tsx`：

```tsx
import { createIcon } from "../createIcon";

export const IconEmail = createIcon({
	content: (
		<>
			<path d="M874.666667 181.333333H149.333333c-40.533333 0-74.666667 34.133333-74.666666 74.666667v512c0 40.533333 34.133333 74.666667 74.666666 74.666667h725.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V256c0-40.533333-34.133333-74.666667-74.666666-74.666667z m-725.333334 64h725.333334c6.4 0 10.666667 4.266667 10.666666 10.666667v25.6L512 516.266667l-373.333333-234.666667V256c0-6.4 4.266667-10.666667 10.666666-10.666667z m725.333334 533.333334H149.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V356.266667l356.266666 224c4.266667 4.266667 10.666667 4.266667 17.066667 4.266666s12.8-2.133333 17.066667-4.266666l356.266666-224V768c0 6.4-4.266667 10.666667-10.666666 10.666667z"></path>
		</>
	)
});
```

然后我们在`App.tsx`引入看一下效果：

```tsx
import { IconAdd } from "./Icon/icons/IconAdd";
import { IconEmail } from "./Icon/icons/IconEmail";

function App() {
	return (
		<div style={{ padding: "50px" }}>
			<IconAdd></IconAdd>
			<IconEmail></IconEmail>
		</div>
	);
}

export default App;
```

通过`npm run start`跑一下开发服务器，查看 Icon 渲染，没有问题：

![image-20240814001931736](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814001931736.png)

然后我们试一下 props：

```tsx
import { IconAdd } from "./Icon/icons/IconAdd";
import { IconEmail } from "./Icon/icons/IconEmail";

function App() {
	return (
		<div style={{ padding: "50px" }}>
			<IconAdd size="40px"></IconAdd>
			<IconEmail spin></IconEmail>
			<IconEmail style={{ color: "blue", fontSize: "50px" }}></IconEmail>
		</div>
	);
}

export default App;
```

效果如下，也没有问题：

![image-20240814002007573](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814002007573.png)

## 支持 iconfont 图标

我们自己手动搞 svg 不方便，可以直接用 iconfont 的，所以支持它很有必要。

新建`src/Icon/createFromIconfont.tsx`：

```tsx
import React from "react";
import { Icon, IconProps } from ".";

const loadedSet = new Set<string>();

export function createFromIconfont(scriptUrl: string) {
	if (
		typeof scriptUrl === "string" &&
		scriptUrl.length &&
		!loadedSet.has(scriptUrl)
	) {
		const script = document.createElement("script");
		script.setAttribute("src", scriptUrl);
		script.setAttribute("data-namespace", scriptUrl);
		document.body.appendChild(script);

		loadedSet.add(scriptUrl);
	}

	const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
		const { type, ...rest } = props;
		return (
			<Icon {...rest} ref={ref}>
				{type ? <use xlinkHref={`#${type}`} /> : null}
			</Icon>
		);
	});
	return Iconfont;
}
```

`createFromIconfont`该方法需要传入 scriptUrl，我们在 `document.body` 上添加 `<script>` 标签引入它。当然我们通过 Set 记录已经加载过的，防止重复加载。

使用的时候通过 <use xlinkHref={`#${type}`} /> 引用，antd 也是这么做的。

我们可以试一下，登录到 iconfont，地址：[https://www.iconfont.cn/](https://www.iconfont.cn/)

![image-20240814002922142](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814002922142.png)

选几个图标添加到购物车：

![image-20240814003024532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814003024532.png)

然后点击上面的购物车，点击添加到项目：

![image-20240814003113250](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814003113250.png)

然后生成就会看到在线 js 链接：

![image-20240814003250804](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814003250804.png)

我们可以项目里面引入一下，这里的`type`需要注意是图标底部的文字哦：

```tsx
import { createFromIconfont } from "./Icon/createFromIconfont";

const IconFont = createFromIconfont("你的js在线连接.js");

function App() {
	return (
		<div>
			<div style={{ padding: "50px" }}>
				<IconFont type="icon-cart-empty" size="40px"></IconFont>
				<IconFont
					type="icon-cart-empty-fill"
					fill="blue"
					size="40px"
				></IconFont>
			</div>
		</div>
	);
}

export default App;
```

然后查看，没有问题：

![image-20240814003722149](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240814003722149.png)

至此我们的 Icon 图标组件就完成了，代码的 Github 地址: [icon-component](https://github.com/zhenghui-su/icon-component)
