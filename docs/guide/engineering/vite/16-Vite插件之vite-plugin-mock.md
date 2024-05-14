# Vite 插件之 vite-plugin-mock

该插件是用来做 mock 数据的，即模拟数据

我们在开发的时候一般是前后端一块并行开发，但后端没写完之前的时候我们是没有接口数据，没有接口文档

为了做一些测试，比如用户列表，我们需要 mock 一些数据

- 简单方式：直接写死一些数据用来调试

  - 缺点：无法做大量数据测试、没法获取一些标准数据、无法感知 http 请求异常

- mockjs：模拟海量数据，vite-plugin-mock 的依赖项就是 mockjs

## 基本使用

我们先安装依赖：

```bash
npm i vite-plugin-mock mockjs -D
```

然后在`vite.config.js`中去配置插件

```js
import { defineConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig({
	plugins: [viteMockServe()],
});
```

我们需要在根目录下新建一个`mock`文件夹，它会自动读取下面的`index.js`

> 如果你想自定义文件夹，也可以用 mockPath 属性来设置，参考[Github 文档](https://github.com/vbenjs/vite-plugin-mock)

```js
module.exports = [
	{
		method: 'post',
		url: '/api/users',
		response: ({ body }) => {
			// body 请求体
			// 比如我们有个分页 page pageSize 一般会放body
			return [];
		},
	},
];
```

然后我们去`main.js`写一个请求

```js
fetch('/api/users', {
	method: 'post',
})
	.then((data) => {
		console.log('data', data);
	})
	.catch((error) => {
		console.log('error', error);
	});
```

启动，打开浏览器查看网络，发现成功：

![image-20240513214013964](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513214013964.png)

我们查看返回，发现返回的是空数组，和我们所写的返回一致，成功

![image-20240513214112268](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513214112268.png)

那我们改一下返回，再查看一下

```js
module.exports = [
	{
		method: 'post',
		url: '/api/users',
		response: ({ body }) => {
			// body 请求体
			// 比如我们有个分页 page pageSize 一般会放body
			return {
				code: 200,
				data: {
					id: 1,
					name: 'mock',
				},
				msg: 'success',
			};
		},
	},
];
```

运行查看，发现完全对上了

![image-20240513214236395](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513214236395.png)

那我们现在和之前的简单方式好像没区别，也是写死的，这时候就需要用到我们刚刚安装的 mockjs 了

```js
import mockjs from 'mockjs';

const userList = mockjs.mock({
	'data|100': [
		{
			// 表示生成100条数据
			name: '@cname', // 表示随机生成中文名字
			ename: '@name()', // 生成不同的英文名字 目前有个bug 英文和中文一块，英文也会生成中文
			'id|+1': 1, // 表示id自增
			avatar: mockjs.Random.image(), // 表示随机生成图片
		},
	],
});
console.log('userList', userList);
```

其中各个模拟的配置可以查看文档：[数据示例文档](http://mockjs.com/examples.html)

我们查看数据，发现基本没问题，除了英文名那有个 bug

![image-20240513220311178](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513220311178.png)

我们去掉中文名字，只生成英文就没啥问题的：

![image-20240513220346190](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513220346190.png)

然后我们把生成的 userList 放入到下面的配置：

```js
module.exports = [
	{
		method: 'post',
		url: '/api/users',
		response: ({ body }) => {
			// body 请求体
			// 比如我们有个分页 page pageSize 一般会放body
			return {
				code: 200,
				data: userList,
				msg: 'success',
			};
		},
	},
];
```

运行，发现没啥问题了，这样就可以模拟大量数据了

![image-20240513220454260](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513220454260.png)

不过注意，mockJS 已经很久没有维护了，这个一般就是用来模拟一下数据

## 手写 vite-plugin-mock 插件

新建`VitePluginMock.js`文件，用来写插件

该插件做的事情就是拦截 http 请求，将请求发到我们本地的开发服务器

当我们使用 fetch 或 axios 去请求的时候，一般有个地址，比如 axios 有个 baseUrl 用来写地址，而当我们没写它时，Vite 可以接管

当打给本地的开发服务器的时候， viteServer 服务器接管

这里我们学习一个新的钩子：[configureServer](https://www.vitejs.net/guide/api-plugin.html#configureserver)，它用来处理用户请求：

```js
module.exports = (options) => {
	// 该插件最主要的工作就是拦截http请求
	// 当我们使用fetch或axios去请求的时候，一般有个域名
	// axios 有个 baseUrl 用来写地址
	// 当打给本地的开发服务器的时候， viteServer 服务器接管
	return {
		configureServer(server) {
			// server 服务器的相关配置
			// middlewares 中间件 这里了解即可, 比较难以理解
			// 一个请求来临了-> 把上下文交给n个中间件来处理 -> 把处理结果返回给用户
			server.middlewares.use((req, res, next) => {
				// req 请求对象 -> 用户发过来的请求, 有请求头请求体如url cookie
				// res 响应对象 -> 服务器返回给用户的数据 可以写东西 比如 res.header
				// next 是否交给下一个中间件, 调用next方法会将处理结果交给下一个中间件
				console.log('req--', req);
				console.log('res--', res);
				if (req.url === '/api/users') {
					console.log('进来了');
					res.end('hello world'); // 会自动设置请求头 它是异步的
				}
				next(); // 如果不调用next 你又不响应就会一直转, 因为没返回
			});
		},
	};
};
```

运行，会发现报了一个错：

![image-20240514150805462](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514150805462.png)

这是因为`res.end`会自动设置请求头，它是异步的，所以走完后放到异步队列，然后就直接到`next`，之后才设置请求头，自然就会报错了，修改一下

> 这里可以结合事件循环来想想

```js
module.exports = (options) => {
	// 该插件最主要的工作就是拦截http请求
	// 当我们使用fetch或axios去请求的时候，一般有个域名
	// axios 有个 baseUrl 用来写地址
	// 当打给本地的开发服务器的时候， viteServer 服务器接管
	return {
		configureServer(server) {
			// server 服务器的相关配置
			// middlewares 中间件 这里了解即可, 比较难以理解
			// 一个请求来临了-> 把上下文交给n个中间件来处理 -> 把处理结果返回给用户
			server.middlewares.use((req, res, next) => {
				// req 请求对象 -> 用户发过来的请求, 有请求头请求体如url cookie
				// res 响应对象 -> 服务器返回给用户的数据 可以写东西 比如 res.header
				// next 是否交给下一个中间件, 调用next方法会将处理结果交给下一个中间件
				console.log('req--', req);
				console.log('res--', res);
				if (req.url === '/api/users') {
					console.log('进来了');
					res.end('hello world'); // 会自动设置请求头 它是异步的
				} else {
					next(); // 如果不调用next 你又不响应就会一直转, 因为没返回
				}
			});
		},
	};
};
```

发现运行成功，并且拦截了：

![image-20240514151324066](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514151324066.png)

查看响应结果，没错，是我们设置的 hello world

![image-20240514151351923](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514151351923.png)

那接下来我们是不是返回我们用 mockjs 写的数据列表就可以了，这里就需要读文件了，这里因为约定 mock 文件放 mock 文件夹下，所以就不用 path 拼了

```js
const mockStat = fs.statSync('mock');
const isDirectory = mockStat.isDirectory();
if (isDirectory) {
	let children = fs.readdirSync('mock');
	console.log('children', children);
}
console.log('mockStat', mockStat);
```

这样我们通过 mockStat 就找到`index.js`了，如下：

![image-20240514151916924](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514151916924.png)

然后我们读取这个文件，当然这里一般只有一个，所以我们可以直接读：

```js
if (isDirectory) {
	// 获取当前的执行根目录 process.cwd()
	const result = require(path.resolve(process.cwd(), 'mock/index.js'));
	console.log('result', result);
}
```

报 import 的错误，把`index.js`里面的 import 导入换成 Commonjs 即可

```js
const mockjs = require('mockjs');
```

打印出了这个，我们会发现都读取到了：

![image-20240514152637823](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514152637823.png)

那我们匹配一下，然后返回对应数据即可，下面是完整代码，这里如果想要整洁还可以把代码提成一个函数：

```js
const fs = require('fs');
const path = require('path');

module.exports = (options) => {
	// 该插件最主要的工作就是拦截http请求
	// 当我们使用fetch或axios去请求的时候，一般有个域名
	// axios 有个 baseUrl 用来写地址
	// 当打给本地的开发服务器的时候， viteServer 服务器接管
	return {
		configureServer(server) {
			// server 服务器的相关配置
			// middlewares 中间件 这里了解即可, 比较难以理解
			// 一个请求来临了-> 把上下文交给n个中间件来处理 -> 把处理结果返回给用户

			const mockStat = fs.statSync('mock');
			console.log('mockStat', mockStat);
			const isDirectory = mockStat.isDirectory();
			let mockResult = [];
			if (isDirectory) {
				// 获取当前的执行根目录 process.cwd()
				mockResult = require(path.resolve(process.cwd(), 'mock/index.js'));
				console.log('mockResult', mockResult);
			}

			server.middlewares.use((req, res, next) => {
				// req 请求对象 -> 用户发过来的请求, 有请求头请求体如url cookie
				// res 响应对象 -> 服务器返回给用户的数据 可以写东西 比如 res.header
				// next 是否交给下一个中间件, 调用next方法会将处理结果交给下一个中间件
				console.log('req--', req);
				console.log('res--', res);
				// 看我们请求的地址在mockResult里面有没有
				const matchItem = mockResult.find(
					(mockDescriptor) => mockDescriptor.url === req.url
				);
				console.log('matchItem', matchItem);

				if (matchItem) {
					console.log('进来了');
					const responseData = matchItem.response(req);
					console.log(responseData); // 这就是那一大串的数据
					// 强制设置请求头格式为json 用以兼容中文
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(responseData)); // 会自动设置请求头 它是异步的
				} else {
					next(); // 如果不调用next 你又不响应就会一直转, 因为没返回
				}
			});
		},
	};
};
```

这样我们运行，再打开，发现成功，并且返回了我们生成的数据

![image-20240514153327390](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514153327390.png)

查看一下服务器终端：

![image-20240514153419727](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514153419727.png)

![image-20240514153427686](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514153427686.png)

至此，这个插件我们就学习了，同时又学习了一个新的钩子`configureServer`

所有插件代码，都在我的 Github 仓库：[vite-plugin-mock](https://github.com/zhenghui-su/vite-plugins-study)
