# Vite开发服务器原理

在我们执行`yarn create vite`或者如`npm init vite@latest`实际上就等于在安装 create-vite 脚手架，它会使用脚手架的指令去构建项目

尝试执行

```bash
npm init vite@latest my-vue-app -- --template vue
npm init vite@latest my-react-app -- --template react
```

执行后，`npm i`下载依赖，然后我们运行，f12查看网络一栏，会发现这个：

![image-20240511151021391](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511151021391.png)

为什么浏览器可以识别 jsx 后缀的文件呢？就像为什么能识别 vue 后缀的文件呢？

这里需要开发服务器的知识了，我们来实现一套简单的类似 vite 的开发服务器

## 实现开发服务器

我们先创建一个目录 vite-dev-server，初始化目录`yarn init -y`

然后下载依赖 koa，这里node服务端的一个框架，如果不熟知道就好

```bash
yarn add koa
```

新建一个`index.js`

```js
const Koa = require('koa');

const app = new Koa();
// 当请求来临时会直接进入到use注册的回调函数中
app.use((ctx) => { // context 上下文 request 请求信息 response 响应信息
	console.log('ctx', ctx.request, ctx.response);
});

app.listen(5173, () => {
	console.log('vite dev server listen on http://localhost:5173');
});
```

然后在终端使用 `node index.js`运行，然后打开 `http://localhost:5173`，就会打印如下：

![image-20240511152123874](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511152123874.png)

这上面就是开启了一个5173端口的服务器，同时有个执行上下文打印，包括请求信息和响应信息，那我们联想，服务端是不是应该要处理请求然后把响应返回

我们来增加一下`index.js`

```js
const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();
// 当请求来临时会直接进入到use注册的回调函数中
app.use(async (ctx) => {
	// context 上下文 request 请求信息 response 响应信息
	console.log('ctx', ctx.request, ctx.response);

	if (ctx.request.url === '/') {
		// 这意味着别人在访问我们根路径的东西, 比如你访问baidu.com
		console.log('////', path.resolve(__dirname, 'index.html')); // 打印绝对路径
		// 读取index.html文件
		const indexContent = await fs.promises.readFile(
			path.resolve(__dirname, 'index.html'),
			'utf-8'
		); // 在服务端一般不会这么用性能比较弱
		console.log('indexContent', indexContent.toString());
		// 作为响应体发给对应请求的人
		ctx.response.body = indexContent;
	}
	// 这个比如后台给我们一个获取用户信息的接口 api/getUserInfo post
	if (ctx.request.url === '/api/getUserInfo' && ctx.request.method === 'POST') {
		// 去数据库找到用户信息然后返回给前端
	}
});

app.listen(5173, () => {
	console.log('vite dev server listen on http://localhost:5173');
});
```

这里就是根据请求信息返回对应的东西，创建了一个html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite</title>
</head>

<body>
  <div>Vite dev server</div>
</body>

</html>
```

运行，浏览器就访问到我们所创建的html了

![image-20240511154525824](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511154525824.png)

当然我们上面没设置什么形式，我们只填充了响应体，高版本浏览器可能会自动解析，但我们最好还是自己设置一下

```js
ctx.response.set("Content-Type", "text/html");
```

查看控制台，确实是按照这样解析的

![image-20240511154758248](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511154758248.png)

那我们增加一个`main.js`和`App.jsx`

```js
// main.js
import './App.jsx';
console.log("123");
```

```jsx
// App.jsx
export default function App() {
	return <div>App</div>;
}
```

然后在`index.html`引入 main

```html
<script src="./main.js" type="module"></script>
```

会发现无法解析，为什么呢？因为我们没有在`index.js`中处理呗，查看控制台就可以看到，我们只处理了根路径，所以无法解析

![image-20240511155242330](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511155242330.png)

增加一个

```js
if (ctx.request.url === '/main.js') {
	const mainJSContent = await fs.promises.readFile(
		path.resolve(__dirname, 'main.js'),
		'utf-8'
	);
	console.log('mainJS', mainJSContent.toString());
	ctx.response.body = mainJSContent;
    ctx.response.set('Content-Type', 'text/javascript'); // 换成这个解析
}
```

重新运行，会发现`main.js` 找到了， 但 `App.jsx`无法解析了，这就回到我们上面的问题了

我们首先要知道，在启动之前，App.jsx 已经是编译过的了，里面都是js的内容，所以我们暂时先把App.jsx改成类似js的内容

```jsx
const div = 'div';
console.log('App.jsx');
console.log(div);
```

然后我们是不是还需要在服务端配置 `App.jsx`

```js
if (ctx.request.url === '/App.jsx') {
	const appJSXContent = await fs.promises.readFile(
		path.resolve(__dirname, 'App.jsx'),
		'utf-8'
	);
    // 在实际中会通过 AST 语法分析等等将其变成 JS 代码
	console.log('AppJSX', appJSXContent.toString());
	ctx.response.body = appJSXContent;
	ctx.response.set('Content-Type', 'text/javascript');
}
```

然后再次运行，就会发现可以解析了，再查看控制台，也都打印了：

![image-20240511160653813](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511160653813.png)

![image-20240511160659778](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511160659778.png)

我们查看，就会发现浏览器看到 jsx 的文件，也是按照Javascript去解析的：

![image-20240511161036224](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511161036224.png)

这就是 Vite 开发服务器的类似原理

浏览器是不管你的后缀的，在浏览器的原理中，你传过来的都是字符串，然后根据`Content-Type`来解析这段字符串