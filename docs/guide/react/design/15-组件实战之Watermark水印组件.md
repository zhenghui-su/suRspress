# 组件实战之Watermark水印组件

很多网站会加上水印标识，用来版权声明和防止盗用，antd 等组件库也提供了 Watermark 水印组件，那么这种水印是如何实现的呢？

## 思路

我们可以打开 antd 的，控制台查看一下：

![image-20240817210820729](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817210820729.png)

首先，有一个 div 覆盖在需要加水印的区域，宽高 100%，绝对定位，设置 `pointer-events:none` 也就是不响应鼠标事件。

然后使用 background 设置 repeat，用 image 平铺

其中 image 是一个包含文字的图片，但我们一般使用的时候是没有传入图片的：

![image-20240817211024246](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817211024246.png)

也就是说，我们需要用 canvas 画出来，做个旋转，然后导出为 base64 的图片，把它作为 div 的背景就实现了。

当然，我们还需要支持可以传入图片，antd 也支持：

![image-20240817211151536](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817211151536.png)

那么如何画这个图片呢？其实查看 antd 的参数就知道了：

![image-20240817211329075](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817211329075.png)

可以传入宽高、旋转角度、字体样式、水印间距、水印偏移等。

整体思路如下：

- 用 canvas 把文字或者图片画出来，导出 base64 地址 data url 

- data url 设置为 div 的重复背景
- div 整个覆盖在需要加水印的元素上，设置 `pointer-events` 是 none。

- 还需要通过`MutationObserver`监听 dom 修改，修改后重新添加水印

## 组件实现

思路已经清楚了，开始写代码，创建一下项目：

```sh
npx create-vite
# 也可以用我的 szh create
```

然后去掉`index.css`和严格模式`StrictMode`：

![image-20240817211942705](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817211942705.png)

新建一个`Watermark`目录，新建`index.tsx`：

```tsx
import React, { FC, PropsWithChildren, useRef } from "react";

export interface WatermarkProps extends PropsWithChildren {
	style?: React.CSSProperties;
	className?: string;
	zIndex?: string | number;
	width?: number;
	height?: number;
	rotate?: number;
	image?: string;
	content?: string | string[];
	fontStyle?: {
		color?: string;
		fontSize?: number | string;
		fontWeight?: number | string;
		fontFamily?: string;
	};
	gap?: [number, number];
	offset?: [number, number];
	getContainer?: () => HTMLElement;
}

export const Watermark: FC<WatermarkProps> = (props) => {
	const {
		style,
		className,
		zIndex,
		width,
		height,
		rotate,
		image,
		content,
		fontStyle,
		gap,
		offset,
		getContainer
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);

	return props.children ? (
		<div style={style} className={className} ref={containerRef}>
			{props.children}
		</div>
	) : null;
};
```

### 参数解释

style、className 无需解释。

width、height、rotate、gap、offset 都是水印 canvas 的参数

- gap 是两个水印之间的空白距离
- offset 是水印相对于 container容器的偏移量，也就是左上角的空白距离

### useWatermark 

我们来封装一个 useWatermark 来绘制这个水印：

```ts
import { useEffect, useState } from "react";
import { WatermarkProps } from ".";
import { merge } from "lodash-es";

export type WatermarkOptions = Omit<
	WatermarkProps,
	"style" | "className" | "children"
>;

export default function useWatermark(params: WatermarkOptions) {
	const [options, setOptions] = useState(params || {});

	function drawWatermark() {}

	useEffect(() => {
		drawWatermark();
	}, [options]);
	return {
		generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
			setOptions(merge({}, options, newOptions));
		},
		destory: () => {}
	};
}
```

这里用到了 lodash 的 merge 来合并参数，记得`npm i lodash-es`下载

参数就是 WatermarkProps 去了 style、className、children。

把传入的参数保存到 options 的 state，根据它渲染。

调用返回的 generateWatermark 的时候设置 options 触发重绘。

### 简单使用

我们使用它的时候，会返回`generateWatermark`方法，参数变化的时候重新调用`generateWatermark`绘制水印，在组件里面用一下：

```tsx
  const getContainer = useCallback(() => {
      return props.getContainer ? props.getContainer() : containerRef.current!;
  }, [containerRef.current, props.getContainer]);

  const { generateWatermark } = useWatermark({
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      fontStyle,
      gap,
      offset,
      getContainer,
  });

  useEffect(() => {
      generateWatermark({
          zIndex,
          width,
          height,
          rotate,
          image,
          content,
          fontStyle,
          gap,
          offset,
          getContainer,
      });
  }, [
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      JSON.stringify(props.fontStyle),
      JSON.stringify(props.gap),
      JSON.stringify(props.offset),
      getContainer,
  ]);
```

getContainer 默认用 `containerRef.current`，或者传入的 `props.getContainer`。

getContainer 我们加了 `useCallback` 避免每次都变，对象参数（fontSize）、数组参数（gap、offset）用 `JSON.stringify` 序列化后再放到 deps 数组里：

### 处理 options

随后我们再回来处理一下 options，先写一个默认的：

```ts
const defaultOptions = {
  zIndex: 1,
  width: 100,
  rotate: -20,
  gap: [100, 100],
  fontStyle: {
    color: 'rgba(0, 0, 0, 0.15)',
    fontSize: '16px',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
  },
  getContainer: () => document.body
}
```

然后我们需要把传入的 options 和默认的合并：

```ts
const getMergedOptions = (o: Partial<WatermarkOptions>) => {
	const options = o || {};

	const mergedOptions = {
		...options,
		zIndex: options.zIndex || defaultOptions.zIndex,
		rotate: options.rotate || defaultOptions.rotate,
		width: toNumber(
			options.width,
			options.image ? defaultOptions.width : undefined
		),
		height: toNumber(options.height, undefined)!,
		fontStyle: {
			...defaultOptions.fontStyle,
			...options.fontStyle
		},
		gap: [
			toNumber(options.gap?.[0], defaultOptions.gap[0]),
			toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1])
		],
		getContainer: options.getContainer || defaultOptions.getContainer
	} as Required<WatermarkOptions>;

	const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
	const mergedOffsetY = toNumber(
		mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
		0
	)!;
	mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

	return mergedOptions;
};
```

这里的 toNumber 是自己定义的函数，不是 lodash 的哦，它会把第一个参数转为 number，如果不是数字的话就返回第二个参数的默认值：

```ts
export function isNumber(obj: string | number): obj is number {
  return Object.prototype.toString.call(obj) === '[object Number]' && obj === obj;
}

const toNumber = (value?: string | number, defaultValue?: number) => {
  if (value === undefined) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue
}
```

#### 合并逻辑

我们说说上面的合并逻辑：

- 先合并传入的 options，如果没有传入的就用默认值
- `fontStyle`是用默认的`fontStyle`和传入的`fontStyle`合并
- `width`的默认值处理，如果是图片就用默认`width`，否则 `undefined`，因为后面文字宽度是动态算的。
- `offset`默认值为 0
- 断言为`Required<WatermarkOptions>`，因为处理完必定有值，没传也有默认值，用`Required`来去掉可选

### 挂载 dom

我们已经可以拿到合并后的 options了，接下来就需要创建 dom 来绘制了：

```ts

	const mergedOptions = getMergedOptions(options);
	const watermarkDiv = useRef<HTMLDivElement>();

	const container = mergedOptions.getContainer();
	const { zIndex, gap } = mergedOptions;

	function drawWatermark() {
		if (!container) {
			return;
		}
		getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
			const wmStyle = `
			width:100%;
			height:100%;
			position:absolute;
			top:0;
			left:0;
			bottom:0;
			right:0;
			pointer-events: none;
			z-index:${zIndex};
			background-position: 0 0;
			background-size:${gap[0] + width}px ${gap[1] + height}px;
			background-repeat: repeat;
			background-image:url(${base64Url})`;

			if (!watermarkDiv.current) {
				const div = document.createElement("div");
				watermarkDiv.current = div;
				container.append(div);
				container.style.position = "relative";
			}

			watermarkDiv.current?.setAttribute("style", wmStyle.trim());
		});
	}
```

用 `useRef` 保存水印元素的 dom。调用 `getCanvasData` 方法来绘制，返回 `base64Url`、`width`、`height` 这些信息。

生成水印的 dom 元素，挂载到 container 下，设置 style，注意 `background-size` 是 `gap` + `width`、`gap` + `height` 算出的。

接下来只要实现 getCanvasData 方法，用 canvas画出水印就好了。

### getCanvasData

创建一个 canvas 元素，拿到画图用的 context，然后封装`drawText`和`drawImage`两个方法，我们优先绘制 image：

![image-20240817221052521](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817221052521.png)

#### configCanvas

我们还需要一个`configCanvas`方法，统一设置 canvas 的宽高、`rotate`、`scale`：

![image-20240817221407289](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817221407289.png)

宽高同样需要加上`gap`，然后`tanslate`移动到中心点即宽高的一半位置，然后再去`scale`和`rotate`

上面的这里设置了这个：

![image-20240817221542713](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817221542713.png)

因为不同屏幕的设备像素比不一样，也就是 1px 对应的物理像素不一样，所以要在单位后面乘以 `devicePixelRatio`，我们设置了 `scale` 放大 `devicePixelRatio` 倍，这样接下来绘制尺寸就不用乘以设备像素比了。

#### drawImage

我们先实现 drawImage 函数：

```ts
	function drawImage() {
		return new Promise<{ width: number; height: number; base64Url: string }>(
			(resolve) => {
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.referrerPolicy = "no-referrer";

				img.src = image;
				img.onload = () => {
					let { width, height } = img;
					if (!width || !height) {
						if (width) {
							height = (img.height / img.width) * +width;
						} else {
							width = (img.width / img.height) * +height;
						}
					}
					configCanvas({ width, height });

					ctx?.drawImage(img, -width / 2, -height / 2, width, height);
					return resolve({ base64Url: canvas.toDataURL(), width, height });
				};
				img.onerror = () => {
					return drawText();
				};
			}
		);
	}
```

思路如下：

- 先用 new Image创建，然后指定 src 加载图片。
- 在`onload`的时候，对于没有设置宽高的情况，根据图片的宽高比计算出宽高值
- 调用`configCanvas`来设置 canvas 的宽高、缩放、旋转
- 调用api 在中心点绘制一张图片，然后返回 base 64 的结果
- 在加载图片失败的时候，调用`drawText`方法绘制文本
- crssOrign 设置 anonymous 是跨域的时候不携带 cookie
- refererPolicy 设置 no-referrer 是不携带 referer

#### drawText

然后我们实现绘制文本背景图片，思路就是：

- `fontSize` 先转为 number

- 如果没有传入 width、height 就自己计算，这个 `measureTextSize` 待会实现。

- 设置 `textBaseline` 为 top，顶部对齐。

- 然后依次绘制文字，绘制文字要按照坐标来，在 `measureTextSize` 里计算出每一行的 lineSize，也就是行高、行宽。

- 在行宽的一半的地方开始绘制文字，行内每个文字的位置是行高的一半 * index。

```ts
	function drawText() {
		const { color, fontSize, fontWeight, fontFamily } = fontStyle;
		const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

		ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
		const measureSize = measureTextSize(ctx, [...content], rotate);

		const width = options.width || measureSize.width;
		const height = options.height || measureSize.height;

		configCanvas({ width, height });

		ctx.fillStyle = color!;
		ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
		ctx.textBaseline = "top";

		[...content].forEach((item, index) => {
			const { width: lineWidth, height: lineHeight } =
				measureSize.lineSize[index];

			const xStartPoint = -lineWidth / 2;
			const yStartPoint =
				-(options.height || measureSize.originHeight) / 2 + lineHeight * index;

			ctx.fillText(
				item,
				xStartPoint,
				yStartPoint,
				options.width || measureSize.originWidth
			);
		});
		return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
	}
```

##### measureTextSize

实现一下 measureTextSize 方法：

```ts
const measureTextSize = (
	ctx: CanvasRenderingContext2D,
	content: string[],
	rotate: number
) => {
	let width = 0;
	let height = 0;
	const lineSize: Array<{ width: number; height: number }> = [];

	content.forEach((item) => {
		const {
			width: textWidth,
			fontBoundingBoxAscent,
			fontBoundingBoxDescent
		} = ctx.measureText(item);

		const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

		if (textHeight > width) {
			width = textHeight;
		}

		height += textWidth;

		lineSize.push({ width: textWidth, height: textHeight });
	});

	const angle = (rotate * Math.PI) / 180;

	return {
		originWidth: width,
		originHeight: height,
		width: Math.ceil(
			Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)
		),
		height: Math.ceil(
			Math.abs(Math.cos(angle) * height) + Math.abs(Math.sin(angle) * width)
		),
		lineSize
	};
};
```

其中`ctx.measureText`是用来测量文字尺寸的。`fontBoudingAscent`是 baseline 到顶部的距离，而 `fontBoundingBoxDescent` 是到底部的距离。

所以这两个加起来就是行高，当然如果有旋转，我们需要用`sin`和`cos`来算出旋转后的宽高

这样我们就完成了文字和图片的水印绘制。

### 测试

我们在`App`里面用一下：

```tsx
import { Watermark } from "./Watermark";

function App() {
	return (
		<Watermark content={["测试水印", "sususu"]}>
			<div style={{ height: 800 }}>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod
					deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos
					recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet,
					id provident!
				</p>
			</div>
		</Watermark>
	);
}

export default App;
```

效果如下：

![image-20240817225305083](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225305083.png)

把 gap 设置为 0：

![image-20240817225352671](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225352671.png)

效果没有问题：

![image-20240817225416030](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225416030.png)

### 支持offset

这边我们的左上角的空白距离即 offset 还没有实现，我们搞一下。

就是把`left`和`top`的值改一下，当然`width`和`height`也需要从 100% 减去这个距离

![image-20240817225759275](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225759275.png)

然后我们测试一下offset：

![image-20240817225900957](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225900957.png)

没有问题，成功偏移：

![image-20240817225844316](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817225844316.png)

### 支持防删除

现在的水印通过控制台还是可以轻易删除的，我们就需要通过`MutationObserver`来防删除

先用`useRef`保存一下值：

![image-20240817230342291](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817230342291.png)

然后用`MutationObserver`监听子节点的变动和节点属性变动，有就重新绘制：

![image-20240817230458166](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817230458166.png)

```ts
export default function useWatermark(params: WatermarkOptions) {
	const [options, setOptions] = useState(params || {});

	const mergedOptions = getMergedOptions(options);
	const watermarkDiv = useRef<HTMLDivElement>();
	const mutationObserver = useRef<MutationObserver>();

	const container = mergedOptions.getContainer();
	const { zIndex, gap } = mergedOptions;

	function drawWatermark() {
		if (!container) {
			return;
		}

		getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
			const offsetLeft = mergedOptions.offset[0] + "px";
			const offsetTop = mergedOptions.offset[1] + "px";

			const wmStyle = `
			width:calc(100% - ${offsetLeft});
			height:calc(100% - ${offsetTop});
			position:absolute;
			top:${offsetTop};
			left:${offsetLeft};
			bottom:0;
			right:0;
			pointer-events: none;
			z-index:${zIndex};
			background-position: 0 0;
			background-size:${gap[0] + width}px ${gap[1] + height}px;
			background-repeat: repeat;
			background-image:url(${base64Url})`;

			if (!watermarkDiv.current) {
				const div = document.createElement("div");
				watermarkDiv.current = div;
				container.append(div);
				container.style.position = "relative";
			}

			watermarkDiv.current?.setAttribute("style", wmStyle.trim());

			if (container) {
				mutationObserver.current?.disconnect();

				mutationObserver.current = new MutationObserver((mutations) => {
					const isChanged = mutations.some((mutation) => {
						let flag = false;
						if (mutation.removedNodes.length) {
							flag = Array.from(mutation.removedNodes).some(
								(node) => node === watermarkDiv.current
							);
						}
						if (
							mutation.type === "attributes" &&
							mutation.target === watermarkDiv.current
						) {
							flag = true;
						}
						return flag;
					});
					if (isChanged) {
						watermarkDiv.current = undefined;
						drawWatermark();
					}
				});

				mutationObserver.current.observe(container, {
					attributes: true,
					subtree: true,
					childList: true
				});
			}
		});
	}

	useEffect(() => {
		drawWatermark();
	}, [options]);
	return {
		generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
			setOptions(merge({}, options, newOptions));
		},
		destory: () => {}
	};
}
```

我们通过判断水印是否删除，是否修改了水印节点的属性，是否增删了水印节点：

![image-20240817230622636](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817230622636.png)

如果是，就将原来的水印置空，重新绘制，然后我们测试一下：

![image-20240817230823832](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817230823832.png)

可以看到，删除了也不会消失，我们再删除几个：

![image-20240817230906984](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240817230906984.png)

这样就没啥问题了。

## 总结

本小节我们实现了Watermark水印组件，水印的实现原理就是加一个和目标元素宽高一样的 div 覆盖在上面，设置 `pointer-events:none` 不响应鼠标事件。

然后背景用水印图片 repeat 平铺，水印图片是通过 canvas，传入文字或图片，会计算 gap间距、文字宽度等，在正确位置画出，然后生成 base64。

此外支持了防删除功能，利用了 MutationObserver 来监听水印节点的属性、节点变化，有变动就把之前的置空然后重新绘制一个新的。

本节Github地址：[https://github.com/zhenghui-su/watermark-component](https://github.com/zhenghui-su/watermark-component)