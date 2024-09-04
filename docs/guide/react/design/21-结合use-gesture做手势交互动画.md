# 结合 use-gesture 做手势交互动画

上小节学习了如何使用 react-spring 做动画，非常简单，就是指定某些属性的开始值和结束值，然后还有动画时长和弹簧动画的一些参数。

不过还有些情况下，动画不是直接触发的，而是通过 drag、hover、scroll 等事件触发。

本小节，我们就用一个手势库`@use-gesture`，它就是对上面这些事件的一个封装：

![image-20240904212104491](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240904212104491.png)

为什么不直接绑事件呢？主要是算移动方向、距离和速率比较麻烦，有库这些就不需要算了。

新建一个项目：

![image-20240904212417655](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240904212417655.png)

然后安装一下库：

```sh
npm install --save @react-spring/web @use-gesture/react
```

然后我们在`App.tsx`写：

```tsx
import { useSprings, animated } from '@react-spring/web'

import './App.css'

const pages = [
	'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

function Viewpager() {
	const width = window.innerWidth

	const [props, api] = useSprings(pages.length, (i) => ({
		x: i * width,
		scale: 1,
	}))

	return (
		<div className='wrapper'>
			{props.map(({ x, scale }, i) => (
				<animated.div className='page' key={i} style={{ x }}>
					<animated.div
						style={{ scale, backgroundImage: `url(${pages[i]})` }}
					/>
				</animated.div>
			))}
		</div>
	)
}

export default Viewpager
```

这里是多个元素并行的动画，用 `useSprings`。然后改变 x 和 scale 属性，x 的初始值是 `width * i`，也就是依次平铺。

所有接收动画属性的地方都要用 `<animated.div>` ，这里用到 x 和 scale 属性的两个 div 换成 `<animated.div>`

然后是样式`App.css`：

```css
html,
body,
#root {
	height: 100%;
	width: 100%;
}

.wrapper {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.page {
	position: absolute;
	width: 100%;
	height: 100%;
	touch-action: none;
}

.page > div {
	touch-action: none;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
	width: 100%;
	height: 100%;
	box-shadow: 0 0 50px #000;
}
```

这里图片要充满屏幕，从 html、body、#root 到 .wrapper、.page 都要设置宽高 100%

`touch-action` 设置为 none 是禁止移动端的默认 touch 处理。

不然默认会导致页面的缩放和滑动：

![image-20240904213202898](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240904213202898.png)

接下来用 `use-gesture`来加上手势的处理：

![image-20240904213555333](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240904213555333.png)

```tsx
import { useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

import './App.css'

const pages = [
	'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

function Viewpager() {
	const index = useRef(0)
	const width = window.innerWidth

	const [props, api] = useSprings(pages.length, (i) => ({
		x: i * width,
		scale: 1,
	}))

	const bind = useDrag(
		({ active, movement: [mx], direction: [xDir], cancel }) => {},
	)

	return (
		<div className='wrapper'>
			{props.map(({ x, scale }, i) => (
				<animated.div className='page' {...bind()} key={i} style={{ x }}>
					<animated.div
						style={{ scale, backgroundImage: `url(${pages[i]})` }}
					/>
				</animated.div>
			))}
		</div>
	)
}

export default Viewpager
```

用 `useRef` 保存当前的 index，初始值是 0。用 use-gesture 也很简单，绑定啥事件就用 useXxx，比如 useDrag、useHover、useScroll 等。

还可以用`useGesture`同时绑定多个事件，手势库最大的好处就是可以拿到方向、距离、速率

![image-20240904213721909](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240904213721909.png)

- movment：代表拖动距离`[x, y]`
- direction：代表拖动方向`[x, y]`，1 代表向左（向上），-1 点向右（向下）
- active：代表当前是否在拖动
- cancel：是一个方法，可以终止事件
