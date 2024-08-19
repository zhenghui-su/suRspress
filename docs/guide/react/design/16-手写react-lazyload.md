# 手写 react-lazyload

网页中可能有很多的图片，这些图片加载会有一个过程，我们希望在图片加载过程中用占位图片展示，因为我们不需要一开始就加载所有图片，而是希望在图片滚动到可视区域的时候加载。

这类效果在电商网站等常常出现，我们一般用 react-lazyload 来实现

## 使用

先创建一个项目，可以用我的脚手架，也可以用`vite`或者别的：

```sh
npx create vite
# 你也可以用我的脚手架 npm i -g szh-cli 下载然后运行 szh create
```

![image-20240819200849641](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819200849641.png)

然后安装依赖：

```sh
npm install

npm install --save react-lazyload

npm install --save-dev @types/react-lazyload

npm install --save prop-types
```

`prop-types`是`react-lazyload`用到的包。

我们在`main.tsx`里面去掉`index.css`和严格模式`StrictMode`：

![image-20240819201159420](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201159420.png)

然后在`App.tsx`里面搞一下：

```tsx
import img1 from "./img1.png";
import img2 from "./img2.png";
import LazyLoad from "react-lazyload";

export default function App() {
	return (
		<div>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<p>xxxxxx</p>
			<LazyLoad placeholder={<div>loading...</div>}>
				<img src={img1} />
			</LazyLoad>
			<LazyLoad placeholder={<div>loading...</div>}>
				<img src={img2} />
			</LazyLoad>
		</div>
	);
}
```

在超出一屏的位置加载两张图片，用 LazyLoad 包裹。

![image-20240819201420403](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201420403.png)

由于网络很快，我们可以查看控制台，可以发现现在没到可视区域，所以加载的是预设的：

![image-20240819201605060](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201605060.png)

待我们滚动到可视区域的时候，才会加载图片，如下：

![image-20240819201657589](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201657589.png)

我们可以再查看网络，会发现最开始是没有图片的加载资源的：

![image-20240819201801098](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201801098.png)

待我们到达可视区域的时候才会网络请求图片：

![image-20240819201836118](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819201836118.png)

这就是 react-lazyload 的作用，当然，它能做的可不只是懒加载图片，组件也可以。

我们知道，用 lazy 包裹的组件可以异步加载。我们写一个 `Test.tsx`：

```tsx
export default function Test() {
	return "这是一段测试jsx";
}
```

然后在`App.tsx`里面异步引入一下：

![image-20240819202141322](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819202141322.png)

通过`import()`方法包裹的模块会单独打包，`lazy`方法会在用到这个组件的时候在加载：

![image-20240819202310749](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819202310749.png)

这里确实是异步下载了，但现在有个需求，我想组件进入可视的区域之后再加载，那么就和上面的图片一样，可以用 react-lazyload 包裹：

![image-20240819202449567](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819202449567.png)

然后我们再打开，刷新一下网络请求，现在可视区域没有到 Test 组件，所以没有它的请求：

![image-20240819202554367](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819202554367.png)

然后我们到达可视区域之后就会发现加载 Test 组件的请求：

![image-20240819202646336](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819202646336.png)

你还可以设置 offset，也就是不用到可视区域，如果 offset 设置 200，那就是距离 200px 到可视区域就触发加载，这里就不图片展示了。

知道了 react-lazyload 怎么使用，那么它是如何实现的呢？其实就是我们之前说的，浏览器的五种 Observer 中的 IntersectionObserser 就可以实现

## 实现 react-lazyload

我们写一个自己的 LazyLoad 组件，新建`src/MyLazyLoad.tsx`：

```tsx
import { CSSProperties, FC, ReactNode, useRef, useState } from "react";

interface MyLazyLoadProps {
	style?: CSSProperties;
	className?: string;
	placeholder?: ReactNode;
	offset?: string | number;
	width?: string | number;
	height?: string | number;
	onContentVisible?: () => void;
	children: ReactNode;
}

const MyLazyLoad: FC<MyLazyLoadProps> = (props) => {
	const {
		className = "",
		style,
		placeholder,
		offset,
		width,
		height,
		onContentVisible,
		children
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	const styles = { width, height, ...style };

	return (
		<div ref={containerRef} className={className} style={styles}>
			{visible ? children : placeholder}
		</div>
	);
};
export default MyLazyLoad;
```

### props 和其他解释

我们看一下 props 各个解释：

- className 和 style 是给外层 div 添加样式的。
- placeholder 是占位的内容。
- width 和 height 是宽高，不用多说
- offset 是距离到可视区域多远就触发加载。
- onContentVisible 是进入可视区域的回调。

我们用`useRef`保存外层 div 的引用，然后用`useState`保存 visible 状态，用来表示是否可见，可见就展示 children，不可见就展示 placeholder

### IntersectionObserver 使用

随后我们使用 IntersectionObserver 来监听 div 是否进入可视区域的情况：

```tsx
const elementObserver = useRef<IntersectionObserver>();

useEffect(() => {
	const options = {
		rootMargin: typeof offset === "number" ? `${offset}px` : offset || "0px",
		threshold: 0
	};

	elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

	const node = containerRef.current;

	if (node instanceof HTMLElement) {
		elementObserver.current.observe(node);
	}
	return () => {
		if (node && node instanceof HTMLElement) {
			elementObserver.current?.unobserve(node);
		}
	};
}, []);
```

其中 options 中的 rootMargin 就是距离多少进入可视区域触发，和参数的 offset 含义一样

threshold 是元素进入可视区域多少比例触发，这里为 0 代表刚进入可视区域就触发

接下来就是写 lazyloadHandler 函数了：

```tsx
function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
	const [entry] = entries;
	const { isIntersecting } = entry;

	if (isIntersecting) {
		setVisible(true);
		onContentVisible?.();

		const node = containerRef.current;
		if (node && node instanceof HTMLElement) {
			elementObserver.current?.unobserve(node);
		}
	}
}
```

当 `isIntersecting` 为 true 的时候，就是从不相交到相交，即进入可视区域，然后这里设置 visible 为 true，回调 onContentVisible，最后去掉监听。

### 测试使用

我们把之前的 `Lazyload` 换成我们的 `MyLazyLoad`：

![image-20240819204518346](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819204518346.png)

打开网页，最先开始的时候没有请求图片和`Test`组件：

![image-20240819204612975](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819204612975.png)

元素中也没有组件和图片，只有我们预设的 div ：

![image-20240819205051321](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819205051321.png)

随后我们移动到可视区域后就可以请求了：

![image-20240819204639414](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819204639414.png)

再打开控制台，也可以打印回调了：

![image-20240819205006848](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240819205006848.png)

这样我们就实现了 react-lazyload 。

## 总结

当图片进入可视区域才加载，可以用 react-lazyload，它支持设置 placeholder 占位内容，设置 offset 距离多少可视区域触发。

此外它还支持组件懒加载，配合`React.lazy`和`import()`使用即可。

它的实现原理就是 IntersectionObserver，设置 rootMargin 也就是 offset，设置 threshold 为 0 也就是一进入可视区域就触发。
