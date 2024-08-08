# React 的断点调试

本小节我们学习如何在 React 中进行 debugger 断点调试，有同学会说`console.log`，这样也可以，但效率低，只能看到你要打印的零散值，看不到代码具体的执行路线

通过debugger断点调试的方法，可以看到具体的执行流程，更好理解代码逻辑

我们先 create-react-app 创建一个项目：

```sh
npx create-react-app --template typescript debug-test
```

然后改一下`index.tsx`：

```tsx
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<App />);
```

然后我们在 App 中写一个组件：

```tsx
import { useEffect, useLayoutEffect, useState } from "react";

async function queryData() {
	const data = await new Promise<number>((resolve) => {
		setTimeout(() => {
			resolve(666);
		}, 2000);
	});
	return data;
}

function App() {
	const [num, setNum] = useState(0);

	useLayoutEffect(() => {
		queryData().then((data) => {
			setNum(data);
		});
	}, []);

	return (
		<div>
			{num}
			<button
				onClick={(e) => {
					setNum((prevNum) => prevNum + 1);
				}}
			>
				+1
			</button>
		</div>
	);
}

export default App;
```

把开发服务跑一下：

```sh
npm run start
```

功能没问题就行：

![image-20240808161703362](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808161703362.png)

## 开始调试

我们开始调试，点击 debug 面版，然后点击 `create a launch.json file`：

![image-20240808161826221](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808161826221.png)

选择 Web 应用，然后选择 Chrome：

![image-20240808161853882](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808161853882.png)

它会在你的根目录下创建`.vscode`文件夹，里面存放`launch.json`文件：

![image-20240808161958812](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808161958812.png)

我们改一下端口，改成 3000 端口，然后点击开始按钮，会启动浏览器：

![image-20240808162116594](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808162116594.png)

![image-20240808162142903](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808162142903.png)

然后我们在 App 里面打几个断点：

![image-20240808162422391](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808162422391.png)

随后点击上面菜单栏的刷新，代码就会在断点处断住，左边就可以看到作用域，调用栈：

![image-20240808162637677](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808162637677.png)

至于菜单项的几个按钮分别是 跳断点执行、单步执行、进入函数、跳出函数、刷新、停止：

![image-20240808162741163](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808162741163.png)

然后我们在页面点击 button，会触发 click 事件，在我们设置的断点断住：

> 上面的可以点第一个继续，让 666 这个初始值有了即可

![image-20240808163135811](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163135811.png)

可以在下面的状态栏的 debug console 即调试控制栏 输入变量或者表达式，会输出执行结果：

![image-20240808163421961](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163421961.png)

这不就可以不断输入你要的变量相关，比一次次 `console.log`要快

## 其他断点类型

在断点的时候也可以选择其他几种断点类型，比如右键可以选择添加一个条件断点：

![image-20240808163616988](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163616988.png)

我们选择在 `num === 670` 时候断住，代码会在满足条件的时候断住，去页面点击几下：

![image-20240808163721840](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163721840.png)

可以鼠标悬浮到 num 上，会显示当前值，也可以调试控制台打印：

![image-20240808163937923](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163937923.png)

![image-20240808163945213](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808163945213.png)

我们还可以选择不同的方式，比如 hit count 即命中次数，代码会在触发对应的次数的时候断住：

![image-20240808164047251](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164047251.png)

或者是 logpoint 即日志消息，它不会断住，但会在代码执行到这里的时候打印表达式的值：

![image-20240808164232506](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164232506.png)

![image-20240808164257297](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164257297.png)

这样我们就可以在 vscode 中调试 React 组件了，不过细心的同学会发现，调试启动的浏览器没有了 React DevTools 了

![image-20240808164440631](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164440631.png)

很简单，因为这是一个新的浏览器示例，没有我们的用户数据，用户数据是保存在 userDataDir 里面的，一个 userDataDir 对应一个浏览器实例

我们调试的时候，如果没有指定 userDataDir，默认是临时创建一个新的 userDataDir。

如果想要之前的插件，那就设置 userDataDir 为 false，这样就用默认的用户数据跑了：

![image-20240808164706614](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164706614.png)

然后关掉我们之前的浏览器，再次启动调试，就会有之前的用户数据，插件等等都在：

![image-20240808164915915](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240808164915915.png)

这样也可以使用 React DevTools 了。

**总结**：我们学会了如何在 React 中进行断点调试同时可以使用 React DevTools