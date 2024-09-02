# 自定义Hook(二)

上一节我们写了 react-use 里面的几个 hook，本节来看 ahooks 里面的几个。

你可以新建项目，也可以在上节的基础继续。

安装 ahooks：

```sh
npm install --save ahooks
```

## useSize

`useSize`是用来获取 dom 尺寸的，并且会在窗口大小改变时实时返回新的尺寸：

```tsx
import { useSize } from 'ahooks'
import { useRef } from 'react'

const App = () => {
	const ref = useRef<HTMLDivElement>(null)
	const size = useSize(ref)
	return (
		<div ref={ref}>
			<p>改变窗口大小试试</p>
			<p>
				width: {size?.width}px, height: {size?.height}px
			</p>
		</div>
	)
}

export default App
```

如下，拖动后会实时获取到窗口的尺寸：

![image-20240902213657513](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902213657513.png)

然后我们实现一下：

```ts
import { RefObject, useEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

type Size = {
	width: number
	height: number
}
function useSize(targetRef: RefObject<HTMLElement>): Size | undefined {
	const [state, setState] = useState<Size | undefined>(() => {
		const el = targetRef.current
		return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
	})

	useEffect(() => {
		const el = targetRef.current
		if (!el) return

		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				const { clientWidth, clientHeight } = entry.target
				setState({ width: clientWidth, height: clientHeight })
			})
		})
		resizeObserver.observe(el)
		return () => {
			resizeObserver.disconnect()
		}
	}, [])
	return state
}
export default useSize
```

用`useState`创建状态，然后初始值是传入的 ref 元素的宽高，这里取`clientHeight`就是不包含边框的高度，然后用`ResizeObserve`监听元素尺寸的变化，改变的时候 setState

这里的`ResizeObserver`用了`resize-observer-polyfill`，主要为了兼容性

```sh
npm install --save resize-observer-polyfill
```

然后刚刚的换成我们的试一下，我把窗口拖小了，实时更新：

![image-20240902214439246](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902214439246.png)

## useHover

上节我们用了传入 ReactElement 的方式，这节用传入 ref 的方式

```tsx
import { useHover } from 'ahooks'
import { useRef } from 'react'

const App = () => {
	const ref = useRef<HTMLDivElement>(null)
	const isHovering = useHover(ref)
	return <div ref={ref}>{isHovering ? 'hover' : 'leaveHover'}</div>
}

export default App
```

![image-20240902214755171](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902214755171.png)

实现其实和之前的差不多，通过`addEventListener`添加事件即可：

```ts
import { RefObject, useEffect, useState } from 'react'

export interface Options {
	onEnter?: () => void
	onLeave?: () => void
	onChange?: (isHovering: boolean) => void
}

function useHover(ref: RefObject<HTMLElement>, options?: Options): boolean {
	const { onEnter, onLeave, onChange } = options || {}

	const [isEnter, setIsEnter] = useState(false)

	useEffect(() => {
		ref.current?.addEventListener('mouseenter', () => {
			onEnter?.()
			setIsEnter(true)
			onChange?.(true)
		})

		ref.current?.addEventListener('mouseleave', () => {
			onLeave?.()
			setIsEnter(false)
			onChange?.(false)
		})
	}, [ref])
	return isEnter
}
export default useHover
```

然后换成我们的试一下，没啥问题：

![image-20240902215237765](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902215237765.png)

![image-20240902215251586](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902215251586.png)

![image-20240902215300108](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902215300108.png)

## useTimeout

`useTimeout`用于弄一个定时器，时间到后执行回调

```tsx
import { useTimeout } from 'ahooks'
import { useState } from 'react'

const App = () => {
	const [state, setState] = useState(1)
	useTimeout(() => {
		setState(state + 1)
	}, 3000)

	return <div>{state}</div>
}

export default App
```

它要保证只能跑一次，不然计时会不准。

![image-20240902215608932](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902215608932.png)

实现也不难，很简单：

```ts
import { useCallback, useEffect, useRef } from 'react'

const useTimeout = (fn: () => void, delay?: number) => {
	const fnRef = useRef(fn)

	fnRef.current = fn

	const timeRef = useRef<number>()

	const clear = useCallback(() => {
		if (timeRef.current) {
			clearTimeout(timeRef.current)
		}
	}, [])

	useEffect(() => {
		timeRef.current = setTimeout(() => fnRef.current(), delay)

		return clear
	}, [delay])

	return clear
}
export default useTimeout
```

首先 useRef 保存回调函数，每次调用都会更新这个函数，避免闭包陷阱（函数里引用之前的 state）。

至于要不要在渲染函数里面该 ref.current，其实都可以，文档虽然不建议但很多库也有改。

这里用`useRef`保存了 timer 引用，方便后续 clear 清除它。

然后我们换成我们的试一下，先 1，过三秒后变为 2：

![image-20240902220507530](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902220507530.png)

![image-20240902220513155](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902220513155.png)

## useWhyDidYouUpdate

在 props 改变后会导致组件重新渲染，而`useWhyDidYouUpdate`是用来打印哪些 props 改变导致的重新渲染：

```tsx
import { useWhyDidYouUpdate } from 'ahooks'
import React, { useState } from 'react'

const Demo: React.FC<{ count: number }> = (props) => {
	const [randomNum, setRandomNum] = useState(Math.random())

	useWhyDidYouUpdate('Demo', { ...props, randomNum })

	return (
		<div>
			<div>
				<span>number: {props.count}</span>
			</div>
			<div>
				randomNum: {randomNum}
				<button onClick={() => setRandomNum(Math.random)}>
					设置随机 state
				</button>
			</div>
		</div>
	)
}
const App = () => {
	const [count, setCount] = useState(0)

	return (
		<div>
			<Demo count={count} />
			<div>
				<button onClick={() => setCount((prevCount) => prevCount - 1)}>
					减一
				</button>
				<button onClick={() => setCount((prevCount) => prevCount + 1)}>
					加一
				</button>
			</div>
		</div>
	)
}

export default App
```

Demo 组件有 count 的 props，有 randomNum 的 state。

当改变 count 时，导致组件重新渲染，会打印：

![image-20240902220822888](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902220822888.png)

然后我们试试改变 randomNum，它也会打印出：

![image-20240902220907433](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902220907433.png)

并且都会打印出从哪些值改变到哪些值，实现其实也很简单：

```ts
import { useEffect, useRef } from 'react'

export type Iprops = Record<string, any>

function useWhyDidYouUpdate(componentName: string, props: Iprops) {
	const prevProps = useRef<Iprops>({})

	useEffect(() => {
		if (prevProps.current) {
			const allKeys = Object.keys({ ...prevProps.current, ...props })
			const changedProps: Iprops = {}

			allKeys.forEach((key) => {
				if (!Object.is(prevProps.current[key], props[key])) {
					changedProps[key] = {
						from: prevProps.current[key],
						to: props[key],
					}
				}
			})

			if (Object.keys(changedProps).length) {
				console.log('[why-did-you-update]', componentName, changedProps)
			}
		}
		prevProps.current = props
	})
}

export default useWhyDidYouUpdate
```

这个 hook 的核心就是`useRef`保存 props 或者其他值，在下次渲染的时候，通过`Obeject.is`来比较新的值和旧的，打印出值的变化：

![image-20240902221536259](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902221536259.png)

传入的第二个参数可以传入任意 props或者state 或者其他值，所以用 Record

## useCountDown

`useCountDown`用于获取倒计时：

```tsx
import { useCountDown } from 'ahooks'

const App = () => {
	const [countdown, formattedRes] = useCountDown({
		targetDate: `${new Date().getFullYear()}-12-31 23:59:59`,
	})
	const { days, hours, minutes, seconds, milliseconds } = formattedRes

	return (
		<p>
			距离今年年底还剩 {days} 天 {hours} 小时 {minutes} 分钟 {seconds} 秒{' '}
			{milliseconds} 毫秒
		</p>
	)
}

export default App
```

第一个是时间戳，第二个是一个对象，我们获取距离今年年底的倒计时，它是实时变动的

![image-20240902221915976](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902221915976.png)

然后我们实现一下：

```ts
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'

export type TDate = dayjs.ConfigType

export interface Options {
	leftTime?: number
	targetDate?: TDate
	interval?: number
	onEnd?: () => void
}

export interface FormattedRes {
	days: number
	hours: number
	minutes: number
	seconds: number
	milliseconds: number
}

const calcLeft = (target?: TDate) => {
	if (!target) {
		return 0
	}

	const left = dayjs(target).valueOf() - Date.now()
	return left < 0 ? 0 : left
}

const parseMs = (milliseconds: number): FormattedRes => {
	return {
		days: Math.floor(milliseconds / 86400000),
		hours: Math.floor(milliseconds / 3600000) % 24,
		minutes: Math.floor(milliseconds / 60000) % 60,
		seconds: Math.floor(milliseconds / 1000) % 60,
		milliseconds: Math.floor(milliseconds) % 1000,
	}
}

const useCountDown = (options: Options = {}) => {
	const { leftTime, targetDate, interval = 1000, onEnd } = options || {}

	const memoLeftTime = useMemo<TDate>(() => {
		return leftTime && leftTime > 0 ? Date.now() + leftTime : undefined
	}, [leftTime])

	const target = 'leftTime' in options ? memoLeftTime : targetDate

	const [timeLeft, setTimeLeft] = useState(() => calcLeft(target))

	const onEndRef = useRef(onEnd)
	onEndRef.current = onEnd

	useEffect(() => {
		if (!target) {
			setTimeLeft(0)
			return
		}

		setTimeLeft(calcLeft(target))

		const timer = setInterval(() => {
			const targetLeft = calcLeft(target)
			setTimeLeft(targetLeft)
			if (targetLeft === 0) {
				clearInterval(timer)
				onEndRef.current?.()
			}
		}, interval)

		return () => clearInterval(timer)
	}, [target, interval])

	const formattedRef = useMemo(() => parseMs(timeLeft), [timeLeft])

	return [timeLeft, formattedRef] as const
}
export default useCountDown
```

我们一个个看，首先是 Options ，它可以传入 leftTime 剩余时间，也可以传入目标日期值 targetDate，interval 是倒计时变化的时间间隔，默认 1s，onEnd 是倒计时结束的回调。

然后是FormattedRes，它是返回格式化后的日期。TDate就是dayjs允许的日期类型

![image-20240902222851629](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902222851629.png)

然后 leftTime 和 targetDate 只需要取一个。

如果是 leftTime 那么 `Date.now()` 加上 targetDate 就是目标日期。否则，就用传入的 targetDate。

![image-20240902222930613](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902222930613.png)

onEnd 的函数也是要用 useRef 保存，然后每次更新 ref.current，取的时候取 ref.current。

这也是为了避免闭包陷阱的。

![image-20240902222952731](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902222952731.png)

核心就是通过`useState`创建剩余时间状态，在初始和每次定时器时都计算一次剩余时间：

![image-20240902223121397](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902223121397.png)

计算剩余时间函数，就是把目标时间的值减去当前时间得到差值即可：

![image-20240902223213482](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902223213482.png)

然后正常格式化就返回了我们要的东西：

![image-20240902223328797](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902223328797.png)

倒计时的逻辑很简单，就是通过定时器，每次计算下当前日期和目标日期的差值，返回格式化以后的结果。

注意传入的回调函数都要用 useRef 包裹下，用的时候取 ref.current，避免闭包陷阱。

然后换成我们的试一下：

![image-20240902223416130](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902223416130.png)

![image-20240902223408719](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240902223408719.png)

没有问题，至此我们就完成了五个自定义 hook 的练习

## 总结

把五个hook功能原理总结：

- useSize：拿到元素尺寸，通过 ResizeObserver 监听尺寸变动返回新的尺寸。
- useHover：用 ref + addEventListener 实现的 hover 事件。
- useTimeout：对 setTimeout 的封装，通过 useRef 保存 fn 避免了闭包陷阱。
- useWhyDidYouUpdate：打印 props 或者 state 等的变化，排查引起组件重新渲染的原因，原理很简单，就是通过 useRef 保存之前的值，和当前渲染时的值对比
- useCountDown：倒计时，通过当前时间和目标时间的差值实现，基于 dayjs。