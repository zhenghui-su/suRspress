# React 如何写单测

当我们写完一个组件之后，如何保证它的功能是正常的呢？你可能会回答在浏览器渲染一下手动测试一下就好吗，但如果这个组件交给别人维护了，它不是很清楚这个组件的功能是什么，如何保证改动后组件功能依旧正常，这种情况就需要单元测试，它可以测试函数、类的方法等细粒度的代码单元，保证功能正常。

有了单元测试之后，后续代码改动只需要跑一遍单元测试就知道功能是否正常。但很多同学觉得单元测试没意义，因为代码改动比较频繁，单元测试也跟着需要频繁改动。确实，如果代码改动频繁就没有必要写单元测试了，但如果代码稳定，就很有必要写测试，比如公共基础组件库，公共基础工具函数等

手动测试 5 分钟，每次都要手动测试，假设 20 次，那就是 100 分钟的成本，而且还不能保证测试是可靠的。

写单测要一个小时，每次直接跑单测自动化测试，跑 100 次也是一个小时的成本，而且还是测试结果很可靠。

所以在构建基础方面如组件库，hooks 库的时候还是有必要写单测的。

那 React 里面组件和 hooks 要如何写单元测试呢，我们就开始尝试一下，先创建项目：

```sh
npx create-react-app --template=typescript react-unit-test
```

测试 React 组件和 hooks 可以通过`@testing-library/react` 包，测试用例可以通过 `jest` 组织

## App 组件的测试

这两个包在创建的时候就自动引入了，我们可以直接`npm run test`运行一下试试，按 a 运行全部：

![image-20240812203557684](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812203557684.png)

它怎么判断的呢，App 组件有个文字`Learn React`：

![image-20240812203653943](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812203653943.png)

然后单测`App.test.tsx`就是找有没有匹配的文字：

![image-20240812203748714](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812203748714.png)

它通过`@testing-library/react` 的 render 函数把组件渲染出来，然后通过 screen 函数来查询 dom，找文本内容匹配正则 `/learn react/` 的 a 标签，最后断言它在 document 内。

我们也可以接收一下 render，它会返回组件挂载的容器 dom，它是一个 HTMLElement 的对象，有各种 dom 方法。

![image-20240812203955417](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812203955417.png)

可以用 querySelector 查找到那个 a 标签，然后判断它的内容是否匹配正则。

这两个方法都可以，后面的更容易理解，就是拿到渲染容器的 dom，再用 dom api 来查找 dom。

第一种方法的 screen 是 `@testing-library/react` 提供的 api，是从全局查找 dom，可以直接根据文本查（`getByText`），根据标签名和属性查（`getByRole`） 等。

## 组件事件测试

有些组件有 onClick、onChange 等事件监听器，怎么测试呢？比如我们写一个 `Toggle.tsx`：

```tsx
import { useCallback, useState } from "react";

function Toggle() {
	const [status, setStatus] = useState(false);

	const clickHandler = useCallback(() => {
		setStatus((prevStatus) => !prevStatus);
	}, []);

	return (
		<div>
			<button onClick={clickHandler}>切换</button>
			<p data-testid="paragraph">{status ? "open" : "close"}</p>
		</div>
	);
}

export default Toggle;
```

就是有个 state 来存储 open、close 的状态，点击按钮切换，很简单的组件，不过有事件。

这个组件如何测试呢？单测里触发事件需要用到 `fireEvent` 方法。我们改下 `App.test.tsx`：

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import Toggle from "./Toggle";

test("toggle", () => {
	render(<Toggle />);

	const pElement = screen.getByTestId("paragraph");
	const buttonElement = screen.getByRole("button");

	expect(pElement?.textContent).toBe("close");

	fireEvent.click(buttonElement!);

	expect(pElement?.textContent).toBe("open");
});
```

用 render 渲染组件，然后用 screen 的方法找到对应的 dom，第一次断言 p 标签的文本为 close，然后用 `fireEvent.click` 触发 button 的点击事件，第二次断言 p 标签的文本是 open。

我们`npm run test`跑一下，通过：

![image-20240812205652816](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812205652816.png)

那如何触发 change 事件呢？如下，第二个参数传入 target 的 value 值。

```tsx
fireEvent.change(inputElement!, { target: { value: "a" } });
```

还有一种情况，如果我有段异步逻辑，过段时间才会渲染内容，这时候怎么测呢？

比如 Toggle 组件里点击按钮之后，过了 2s 才改状态：

![image-20240812205954421](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812205954421.png)

测试会失败：

![image-20240812210131372](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812210131372.png)

这时候断言用 waitFor 包裹下，设置 timeout 的时间就好了，注意这里超时时间要多一点：

```tsx
await waitFor(() => expect(pElement?.textContent).toBe("open"), {
	timeout: 3000
});
```

然后测试可以通过：

![image-20240812210346587](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812210346587.png)

## act

除了上面的，还有一个 api 比较常用，就是 `act`，它是 `react-dom` 包里的，`@testing-library/react` 对它做了一层包装。

![image-20240812210514551](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812210514551.png)

意思就是把所有浏览器里跑的代码都包一层 `act`，它们的行为会和在浏览器里一样。

我们可以把单测里的 `fireEvent`用 `act` 包一层：

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Toggle from "./Toggle";
import { act } from "react";

test("toggle", async () => {
	render(<Toggle />);

	const pElement = screen.getByTestId("paragraph");
	const buttonElement = screen.getByRole("button");

	expect(pElement?.textContent).toBe("close");

	act(() => {
		fireEvent.click(buttonElement!);
	});

	await waitFor(() => expect(pElement?.textContent).toBe("open"), {
		timeout: 3000
	});
});
```

结果一样：

![image-20240812211334025](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812211334025.png)

## hooks 测试

组件的测试我们学会了，如果我们要单独测试 hooks，怎么做呢？

我们需要用到 renderHook 这个 api，我们先写一个 hook 来做测试，新建`useCounter.tsx`：

```tsx
import { useState } from "react";

type UseCounterReturnType = [
	count: number,
	increment: (delta: number) => void,
	decrement: (delta: number) => void
];

export default function useCounter(
	initialCount: number = 0
): UseCounterReturnType {
	const [count, setCount] = useState(initialCount);

	const increment = (delta: number) => {
		setCount((count) => count + delta);
	};

	const decrement = (delta: number) => {
		setCount((count) => count - delta);
	};

	return [count, increment, decrement];
}
```

然后在 App 里面用一下：

```tsx
import useCounter from "./useCounter";

function App() {
	const [count, increment, decrement] = useCounter();

	return (
		<div>
			<div>{count}</div>
			<div>
				<button onClick={() => increment(1)}>加一</button>
				<button onClick={() => decrement(2)}>减二</button>
			</div>
		</div>
	);
}

export default App;
```

很简单的一个 hook，就是加减法，然后显示结果，然后来写下这个 hook 的单测：

```tsx
import { renderHook } from "@testing-library/react";
import { act } from "react";
import useCounter from "./useCounter";

test("useCounter", async () => {
	const view = renderHook(() => useCounter(0));

	const [count, increment, decrement] = view.result.current;

	act(() => {
		increment(2);
	});
	expect(view.result.current[0]).toBe(2);

	act(() => {
		decrement(3);
	});
	expect(view.result.current[0]).toBe(-1);
	view.unmount();
});
```

`renderHook` 返回的 `result.current` 就是 hook 的返回值。

然后跑一下测试：

![image-20240812212140542](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240812212140542.png)

## 总结

主要学习了组件和 hook 单元测试的写法，用 `@testing-library/react` 这个库，它有一些 api：

- `render`：渲染组件，返回 container 容器 dom 和其他的查询 api
- `fireEvent`：触发某个元素的某个事件
- `createEvent`：创建某个事件（一般不用这样创建）
- `waitFor`：等待异步操作完成再断言，可以指定 timeout
- `act`：包裹的代码会更接近浏览器里运行的方式(该 api 也可以从 react 包引入)
- `renderHook`：执行 hook，可以通过 result.current 拿到 hook 返回值

通过这些就可以写任何组件、hook 的单元测试了。
