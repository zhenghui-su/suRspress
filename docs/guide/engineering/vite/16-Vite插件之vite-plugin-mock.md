# Vite 插件之 vite-plugin-mock

该插件是用来做 mock 数据的，即模拟数据

我们在开发的时候一般是前后端一块并行开发，但后端没写完之前的时候我们是没有接口数据，没有接口文档

为了做一些测试，比如用户列表，我们需要 mock 一些数据

- 简单方式：直接写死一些数据用来调试
  - 缺点：无法做大量数据测试、没法获取一些标准数据、无法感知http请求异常

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

> 如果你想自定义文件夹，也可以用mockPath 属性来设置，参考[Github文档](https://github.com/vbenjs/vite-plugin-mock)

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

我们查看数据，发现基本没问题，除了英文名那有个bug

![image-20240513220311178](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513220311178.png)

我们去掉中文名字，只生成英文就没啥问题的：

![image-20240513220346190](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513220346190.png)

然后我们把生成的userList放入到下面的配置：

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

