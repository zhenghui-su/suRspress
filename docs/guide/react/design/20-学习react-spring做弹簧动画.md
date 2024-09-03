# 学习 react-spring 做弹簧动画

网页中经常会使用一些动画，它可以加强交互体验，一般的动画通过 css 的 animation 和 transition 就可以实现了，但如果涉及了多个元素的动画，就会变得比较复杂。

尤其在遇到动画顺序等场景下，使用 css 来做需要考虑设置不同的动画开始时间，这时候如果使用专门的动画库如 react-spring 就可以比较轻松的完成了。

## 尝试

新建一个项目，然后安装 react-spring 的包：

```sh
npm install --save @react-spring/web
```

然后我们改一下`App.tsx`：

```tsx
import { useSpringValue, animated, useSpring } from '@react-spring/web'
import { useEffect } from 'react'
import './App.css'

export default function App() {
	const width = useSpringValue(0, {
		config: {
			duration: 2000,
		},
	})

	useEffect(() => {
		width.start(300)
	}, [])

	return <animated.div className='box' style={{ width }}></animated.div>
}
```

然后改一下`App.css`：

```css
.box {
	background: skyblue;
	height: 100px;
}
```

启动运行，会看到 box 在 2s 内完成宽度 width 从 0 到 300 的动画：

![_1_2](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/_1_2.gif)

此外我们可以不定义 duration 持续时间，而是定义摩擦力等参数：

![image-20240903203641974](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903203641974.png)

此时就会发现它想弹簧一样了：

![_2_1](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/_2_1.gif)

这也就是为什么这个库叫 react-spring，它主打的就是弹簧动画，当然如果只需要普通的动画，也可以指定 duration，那就是常规的动画了。回头来看这三个参数：

- mass：质量（也就是重量），质量越大，回弹惯性越大，回弹的距离和次数越多
- friction：摩擦力，增加点阻力可以抵消质量和张力的效果
- tension：张力，弹簧松紧程度，弹簧越紧，回弹速度越快。

这些参数多多尝试就可以发现数值之间的区别了。

## useSpring

然后我们看其他的 api，在涉及到多个 style 都要变化的时候，需要使用`useSpring`：

```tsx
export default function App() {
	const styles = useSpring({
		from: {
			width: 0,
			height: 0,
		},
		to: {
			width: 200,
			height: 200,
		},
		config: {
			duration: 2000,
		},
	})

	return <animated.div className='box' style={{ ...styles }}></animated.div>
}
```

使用`useSpring`指定 from 和 to，然后指定 duration，当然也可以换成弹簧动画：

![image-20240903204741026](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903204741026.png)

效果就不贴图了，可以自己试试看。

`useSpring`还有另外一种传入函数的重载，这样它会返回`[styles, api]`两个参数：

```tsx
export default function App() {
	const [styles, api] = useSpring(() => {
		return {
			from: {
				width: 0,
				height: 0,
			},
			config: {
				// duration: 2000,
				mass: 2,
				friction: 10,
				tension: 400,
			},
		}
	})
	function clickHandler() {
		api.start({
			width: 200,
			height: 200,
		})
	}

	return (
		<animated.div
			className='box'
			style={{ ...styles }}
			onClick={clickHandler}
		></animated.div>
	)
}
```

这样不会直接执行动画，而是通过返回的`api.start`来控制动画的开始。

## useSprings

如果涉及到多个元素同时做动画，然后就需要`useSprings`，就是上面的复数：

```tsx
export default function App() {
	const [springs, api] = useSprings(3, () => ({
		from: { width: 0 },
		to: { width: 300 },
		config: {
			duration: 1000,
		},
	}))

	return (
		<div>
			{springs.map((styles) => (
				<animated.div style={styles} className='box'></animated.div>
			))}
		</div>
	)
}
```

然后在 css 里面加个外边距，间隔一下：

```css
.box {
	background: skyblue;
	height: 100px;
	margin: 10px;
}
```

这样效果就是三个元素一块做动画了。

当然上面我们指定的是 to，那会立刻执行，我们可以不指定，用`api.start`来做动画

```tsx
export default function App() {
	const [springs, api] = useSprings(3, () => ({
		from: { width: 0 },
		config: {
			duration: 1000,
		},
	}))
	useEffect(() => {
		api.start({ width: 300 })
	}, [])
	return (
		<div>
			{springs.map((styles) => (
				<animated.div style={styles} className='box'></animated.div>
			))}
		</div>
	)
}
```

## useTrail

在涉及到多个元素的动画依次进行的场景，可以使用`useTrail`：

```tsx
export default function App() {
	const [springs, api] = useTrail(3, () => ({
		from: { width: 0 },
		config: {
			duration: 1000,
		},
	}))
	useEffect(() => {
		api.start({ width: 300 })
	}, [])
	return (
		<div>
			{springs.map((styles) => (
				<animated.div style={styles} className='box'></animated.div>
			))}
		</div>
	)
}
```

和`useSprings`一样，不过这个动画是依次执行的，而不是同时的。

## useChain

那么如果多个动画需要安排顺序，可以使用`useChain`：

```tsx
import {
	animated,
	useChain,
	useSpring,
	useSpringRef,
	useSprings,
	useTrail,
} from '@react-spring/web'
import './App.css'

export default function App() {
	const api1 = useSpringRef()

	const [springs] = useTrail(
		3,
		() => ({
			ref: api1,
			from: { width: 0 },
			to: { width: 300 },
			config: {
				duration: 1000,
			},
		}),
		[],
	)

	const api2 = useSpringRef()

	const [springs2] = useSprings(
		3,
		() => ({
			ref: api2,
			from: { height: 100 },
			to: { height: 50 },
			config: {
				duration: 1000,
			},
		}),
		[],
	)

	useChain([api1, api2], [0, 1], 500)

	return (
		<div>
			{springs.map((styles1, index) => (
				<animated.div
					style={{ ...styles1, ...springs2[index] }}
					className='box'
				></animated.div>
			))}
		</div>
	)
}
```

我们用 `useSpringRef` 拿到两个动画的 api，然后用 `useChain` 来安排两个动画的顺序。

`useChain` 的第二个参数指定了 0 和 1，第三个参数指定了 500，那就是第一个动画在 0s 开始，第二个动画在 500ms 开始。

如果第三个参数指定了 3000，那就是第一个动画在 0s 开始，第二个动画在 3s 开始。

## 例子

接下来我们就实现一个笑脸动画，如图：

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/87e8c27b94ee4e89b2d3c2da9943eb74~tplv-k3u1fbpfcp-jj-mark:1890:0:0:0:q75.awebp)

我们想一下思路，横线和竖线用`useTrail`实现，然后中间的笑脸用`useSprings`同时做动画，随后顺序用`useChain`来安排：

```tsx
const STROKE_WIDTH = 0.5

const MAX_WIDTH = 150
const MAX_HEIGHT = 100

export default function App() {
	const gridApi = useSpringRef()

	const gridSprings = useTrail(16, {
		ref: gridApi,
		from: {
			x2: 0,
			y2: 0,
		},
		to: {
			x2: MAX_WIDTH,
			y2: MAX_HEIGHT,
		},
	})

	return (
		<div className='container'>
			<svg viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}>
				<g>
					{/* x轴动画 */}
					{gridSprings.map(({ x2 }, index) => (
						<animated.line
							x1={0}
							y1={index * 10}
							x2={x2}
							y2={index * 10}
							key={index}
							strokeWidth={STROKE_WIDTH}
							stroke='currentColor'
						/>
					))}
					{/* y轴动画 */}
					{gridSprings.map(({ y2 }, index) => (
						<animated.line
							x1={index * 10}
							y1={0}
							x2={index * 10}
							y2={y2}
							key={index}
							strokeWidth={STROKE_WIDTH}
							stroke='currentColor'
						/>
					))}
				</g>
			</svg>
		</div>
	)
}
```

我们用`useSpringRef`拿到动画引用，然后手动调用 start 开始动画，用`useTrail`来做从 0 到指定宽高的动画，然后遍历它通过`animated.line`来绘制横线竖线。

随后就是做笑脸，其实就是用 rect 绘制几个方块，然后做一下 scale 从 0 到 1 的动画

先搞一下位置

![image-20240903211041986](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903211041986.png)

然后用`useSprings`做动画，用弹簧动画的方式，指定 mass（质量） 和 tension（张力），并且每个 box 都有不同的 delay：

![image-20240903211126967](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903211126967.png)

随后用`useChain`指定一下画横线竖线动画和画笑脸动画的顺序：

![image-20240903211205697](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903211205697.png)

最后把笑脸方块放入到里面：

![image-20240903211335896](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903211335896.png)

最后是`App.css`里面的一点样式，记得要把`index.css`注释了，或者删了。

```css
body {
	background: blue;
	color: white;
}

.container {
	width: 50%;
	margin: 50px auto;
}
```

最终效果图，gif 动画就不贴了：

![image-20240903212250476](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240903212250476.png)

全部代码如下：

```tsx
import {
	useTrail,
	useChain,
	useSprings,
	animated,
	useSpringRef,
} from '@react-spring/web'
import './App.css'

const COORDS = [
	[50, 30],
	[90, 30],
	[50, 50],
	[60, 60],
	[70, 60],
	[80, 60],
	[90, 50],
]

const STROKE_WIDTH = 0.5

const MAX_WIDTH = 150
const MAX_HEIGHT = 100

export default function App() {
	const gridApi = useSpringRef()

	const gridSprings = useTrail(16, {
		ref: gridApi,
		from: {
			x2: 0,
			y2: 0,
		},
		to: {
			x2: MAX_WIDTH,
			y2: MAX_HEIGHT,
		},
	})

	const boxApi = useSpringRef()

	const [boxSprings] = useSprings(7, (i) => ({
		ref: boxApi,
		from: {
			scale: 0,
		},
		to: {
			scale: 1,
		},
		delay: i * 200,
		config: {
			mass: 2,
			tension: 220,
		},
	}))

	useChain([gridApi, boxApi], [0, 1], 1500)

	return (
		<div className='container'>
			<svg viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}>
				<g>
					{gridSprings.map(({ x2 }, index) => (
						<animated.line
							x1={0}
							y1={index * 10}
							x2={x2}
							y2={index * 10}
							key={index}
							strokeWidth={STROKE_WIDTH}
							stroke='currentColor'
						/>
					))}
					{gridSprings.map(({ y2 }, index) => (
						<animated.line
							x1={index * 10}
							y1={0}
							x2={index * 10}
							y2={y2}
							key={index}
							strokeWidth={STROKE_WIDTH}
							stroke='currentColor'
						/>
					))}
				</g>
				{boxSprings.map(({ scale }, index) => (
					<animated.rect
						key={index}
						width={10}
						height={10}
						fill='currentColor'
						style={{
							transform: `translate(${COORDS[index][0]}px, ${COORDS[index][1]}px)`,
							transformOrigin: `5px 5px`,
							scale,
						}}
					/>
				))}
			</svg>
		</div>
	)
}
```

## 总结

我们综合运用了`useSprings`、`useTrail`、`useSpringRef`、`useChain`，更多的可以参考 react-spring 的官方案例，上面的就是里面一种，地址： [examples](https://www.react-spring.dev/examples)

api 总结：

- useSpringValue：指定单个属性的变化。
- useSpring：指定多个属性的变化
- useSprings：指定多个元素的多个属性的变化，动画并行执行
- useTrial：指定多个元素的多个属性的变化，动画依次执行
- useSpringRef：用来拿到每个动画的 ref，可以用来控制动画的开始、暂停等
- useChain：串行执行多个动画，每个动画可以指定不同的开始时间
