# 自定义 Hook(一)

对于一些 React 常用的逻辑，是可以复用的，普通 js 一般有 lodash 库，而用了 hook 的逻辑，我们一般会封装成自定义 hook，也有一些库如 react-use、ahooks 等

这节我们学习一下 react-use 中的几个 hook，实现后对这方面理解加深。

自定义 hook 就是函数逻辑，和普通函数区别就是名字规范和内部使用了 react 的内置 hook

我们新建一个项目：

```sh
szh create react-use-hook
```

然后去掉`index.css`和严格模式：

![image-20240901211112553](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901211112553.png)

然后我们安装一下`react-use`：

```sh
npm install --save react-use
```

## useMountedState 和 useLifeCycles

`useMountedState` 可以用来获取组件是否 mount 到 dom：

```tsx
import { useEffect, useState } from 'react'
import { useMountedState } from 'react-use'

const App = () => {
	const isMounted = useMountedState()
	const [, setNum] = useState(0)

	useEffect(() => {
		setTimeout(() => {
			setNum(1)
		}, 1000)
	}, [])

	return <div>{isMounted() ? 'mounted' : 'pending'}</div>
}

export default App
```

第一次渲染，组件渲染的时候，组件还没 mount 到 dom，1 秒后通过 setState 触发再次渲染的时候，这时候组件已经 mount 到 dom 了。

![image-20240901211329240](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901211329240.png)

![image-20240901211335847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901211335847.png)

而这个 hook 的实现也非常简单，如下：

```tsx
import { useCallback, useEffect, useRef } from 'react'

export default function useMountedState(): () => boolean {
	const mountedRef = useRef(false)
	const get = useCallback(() => mountedRef.current, [])

	useEffect(() => {
		mountedRef.current = true

		return () => {
			mountedRef.current = false
		}
	}, [])

	return get
}
```

通过`useRef`保存 mount 的状态，然后在`useEffect`回调中修改为 true

因为`useEffect`是在 dom 操作之后异步执行的，所以这个时候已经是 mount 了

这里不使用`useRef`的原因是修改`ref.current`的值不会引起重复渲染

而返回的`get`使用`useCallback`包裹，这样使用它时作为其他 memo 组件参数不会导致额外的渲染

而和这个 hook 类似的还有一个`useLifeCycles`的 hook：

```tsx
import { useLifecycles } from 'react-use'

const App = () => {
	useLifecycles(
		() => console.log('MOUNTED'),
		() => console.log('UNMOUNTED'),
	)

	return null
}

export default App
```

这个的实现也是通过`useEffect`的特性：

```ts
import { useEffect } from 'react'

const useLifeCycles = (mount: () => void, unmount?: () => void) => {
	useEffect(() => {
		if (mount) {
			mount()
		}

		return () => {
			if (unmount) {
				unmount()
			}
		}
	}, [])
}
export default useLifeCycles
```

就是在`useEffect`里面调用 mount，这时候 dom 操作完了，组件已经 mount。

然后在返回的清理函数里面调用 unmount，在组件从 dom 卸载的时候调用。

## useCookie

`useCookie`可以方便的增删改 cookie，相较直接操作要简便一些：

```tsx
import { useEffect } from 'react'
import { useCookie } from 'react-use'

const App = () => {
	const [value, updateCookie, deleteCookie] = useCookie('sususu')

	useEffect(() => {
		deleteCookie()
	}, [])

	const updateCookieHandler = () => {
		updateCookie('666')
	}

	return (
		<div>
			<p>cookie 值: {value}</p>
			<button onClick={updateCookieHandler}>更新 Cookie</button>
			<br />
			<button onClick={deleteCookie}>删除 Cookie</button>
		</div>
	)
}
export default App
```

结果如下：

![image-20240901212559533](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901212559533.png)

至于原理则是对 `js-cookie`这个包的进一步封装，安装一下：

```sh
npm i --save js-cookie
```

然后我们实现一下`useCookie`：

```ts
import { useCallback, useState } from 'react'
import Cookies from 'js-cookie'

const useCookie = (
	cookieName: string,
): [
	string | null,
	(newValue: string, options?: Cookies.CookieAttributes) => void,
	() => void,
] => {
	const [value, setValue] = useState<string | null>(
		() => Cookies.get(cookieName) || null,
	)

	const updateCookie = useCallback(
		(newValue: string, options?: Cookies.CookieAttributes) => {
			Cookies.set(cookieName, newValue, options)
			setValue(newValue)
		},
		[cookieName],
	)

	const deleteCookie = useCallback(() => {
		Cookies.remove(cookieName)
		setValue(null)
	}, [cookieName])

	return [value, updateCookie, deleteCookie]
}

export default useCookie
```

如果有 js-cookie 类型报错，可以安装一下类型声明：

```sh
npm i -D @types/js-cookie
```

这个 hook 就是基于 js-cookie 来 get、set、remove 到 cookie 信息：

![image-20240901213437834](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901213437834.png)

不过注意，一般我们自定义 hook 返回的函数都用 `useCallback`包裹一下，这样调用者就不用自己处理了。

![image-20240901213541607](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901213541607.png)

## useHover

css 中有一个`:hover`伪类，但是 js 是没有 hover 事件，只有 mouseenter、mouseleave 事件，而`useHover`封装了 hover 事件：

```tsx
import { useHover } from 'react-use'

const App = () => {
	const element = (hovered: boolean) => (
		<div>Hover me! {hovered && 'Thanks'}</div>
	)

	const [hoverable, hovered] = useHover(element)

	return (
		<div>
			{hoverable}
			<div>{hovered ? 'HOVERED' : ''}</div>
		</div>
	)
}

export default App
```

只有鼠标悬浮在上面，才会显示：

![image-20240901213717845](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901213717845.png)

然后我们来实现一下：

```ts
import React, { cloneElement, useState } from 'react'

export type Element =
	| ((state: boolean) => React.ReactElement)
	| React.ReactElement

const useHover = (element: Element): [React.ReactElement, boolean] => {
	const [state, setState] = useState(false)

	const onMouseEnter = (originalOnMounseEnter?: any) => (e: any) => {
		originalOnMounseEnter?.(e)
		setState(true)
	}
	const onMouseLeave = (originalOnMouseLeave?: any) => (e: any) => {
		originalOnMouseLeave?.(e)
		setState(false)
	}
	if (typeof element === 'function') {
		element = element(state)
	}
	const el = cloneElement(element, {
		onMouseEnter: onMouseEnter(element.props?.onMouseEnter),
		onMouseLeave: onMouseLeave(element.props?.onMouseLeave),
	})
	return [el, state]
}

export default useHover
```

传入的可以直接是 ReactElement，也可以返回的是 ReactElement，后者需要执行一下：

![image-20240901214345847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214345847.png)

![image-20240901214351467](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214351467.png)

其次就是用`cloneElement`复制 ReactElement，然后给他添加 onMouseEnter、onMouseLeave 事件，同时用 `useState`保存是否 hover 的状态：

![image-20240901214740234](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214740234.png)

这里注意如果传入的 ReactElement 本身有 onMouseEnter、onMouseLeave 的事件处理函数，要先调用下：

![image-20240901214816249](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214816249.png)

然后换成我们的实现尝试一下，效果一样

![image-20240901214906026](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214906026.png)

![image-20240901214917360](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901214917360.png)

## useScrolling

`useScrolling`封装了滚动的状态：

```tsx
import { useRef } from 'react'
import { useScrolling } from 'react-use'

const App = () => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const scrolling = useScrolling(scrollRef)

	return (
		<>
			{<div>{scrolling ? '滚动中..' : '没有滚动'}</div>}

			<div ref={scrollRef} style={{ height: '200px', overflow: 'auto' }}>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
				<div>sususu</div>
			</div>
		</>
	)
}

export default App
```

滚动的时候会显示`滚动中`，代表`scrolling`值为`true`，不滚动就是`false`：

![image-20240901215055459](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901215055459.png)

![image-20240901215102067](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901215102067.png)

和刚刚的`useHover`其实差不多，不过这里要传入`ref`：

```ts
import { RefObject, useEffect, useState } from 'react'

const useScrolling = (ref: RefObject<HTMLElement>): boolean => {
	const [scrolling, setScrolling] = useState(false)

	useEffect(() => {
		if (ref.current) {
			let scrollingTimer: number

			const handleScrollEnd = () => {
				setScrolling(false)
			}

			const handleScroll = () => {
				setScrolling(true)
				clearTimeout(scrollingTimer)
				scrollingTimer = setTimeout(() => handleScrollEnd(), 150)
			}

			ref.current?.addEventListener('scroll', handleScroll)

			return () => {
				if (ref.current) {
					ref.current?.removeEventListener('scroll', handleScroll)
				}
			}
		}
		return () => {}
	}, [ref])
	return scrolling
}
export default useScrolling
```

用 `useState` 创建一个滚动状态，给传入的 ref 绑定 scroll 监听事件，scroll 的时候设置 scrolling 为 true，并且定时器 150ms 以后修改为 false

![image-20240901215751710](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901215751710.png)

这样只要不断滚动，就会一直重置定时器，结束滚动后才会设置为 false。

至于为什么`useHover`是传入 element 元素，然后通过`cloneElement`添加事件，而`useScrolling`是传入 ref，通过`addEventListener`添加事件，原因如下：

- 传入 element 元素通过`cloneElement`修改后返回的方式，因为它会覆盖这个属性，所以需要先调用一下之前的事件处理函数
- 而传入 ref 通过`addEventListener`的方式，则是把事件绑定在元素上，可以绑多个

这两个方式选择哪种都差不多，比如`useHover`在`react-use`使用了第一种，而在 ahooks 中就是用了第二种方式：

![image-20240901221006334](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240901221006334.png)

当然也有别的如返回 props 对象，让调用者自己绑定，或者只返回一个事件处理函数

封装事件的 hook 一般就这三种封装方式：

- 传入 React Element 然后 cloneElement
- 传入 ref 然后拿到 dom 执行 addEventListener
- 返回 props 对象或者事件处理函数，调用者自己绑定

## 总结

本小节我们封装了 useMountedState、useLifecycles、useCookie、useHover、useScrolling 这些自定义 hook。

封装它们可以帮助我们理解各个特性和方式，下小节我们再看看 ahooks 里面的几个 hook
