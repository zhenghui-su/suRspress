# Vite 加载静态资源

什么是静态资源？

图片，视频资源，一般除了动态API，大部分资源都视作静态资源

动态 API 指我们向服务器发请求然后返回资源，这个就不是静态资源

Vite 对静态资源基本上是开箱即用的，我们说几个常用的加载

## 加载图片

先准备一个图片，随便一个png，然后我们尝试一下

```js
import sylasPicUrl from './assets/images/sylas.png';

const img = document.createElement('img');
img.src = sylasPicUrl;
document.body.append(img)
```

运行，就会发现可以加载了，效果就不演示了，很简单

## 加载 json 文件

创建一个`index.json`文件

```json
{
    "name": "chen",
    "age": "18"
}
```

然后我们尝试读取使用：

```js
import jsonFile from './assets/json/index.json';

console.log('jsonFile', jsonFile);
```

运行，会打印一个对象，这就很方便，因为有部分构件工具，json文件的导入会作为一个JSON字符串形式存在，我们还需要解析

接下来我们假设这个json文件里面有100个字段，但我们只想取出两个，怎么做呢？

我们可以通过如下的形式来：

```js
import { name, age } from './assets/json/index.json';
console.log('name', name);
console.log('age', age);
```

> 这个导入形式叫做 tree shaking 摇树优化，打包工具会自动帮你移除没有用到的变量或者方法，以此提高性能

## 别名 resolve.alias 配置

我们在开发中引入静态资源，基本通过相对路径，但如果我们项目较大，嵌套的较多，出现如下情况，会觉得很长而且很麻烦

```js
import imgPicUrl form '../../../../../assets/images/img.png';
```

我们可以通过配置`vite.config.js`中的别名来做：

```js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@assets': path.resolve(__dirname, './assets'),
		}
	},
});
```

这样我们遇到上面的情况就可以这样引入了，也可以正常加载

```js
import imgPicUrl form '@assets/images/img.png';
```

别名的原理就是读取到这个将它进行替换了

## resolve.alias 原理

我们回到之前的`vite-dev-server`，之前写简易开发服务器的时候的目录，还有映像吗，改一下`index.js`，精简一下：

```js
const Koa = require('koa');
const fs = require('fs');
const path = require('path');

const app = new Koa();
app.use(async (ctx) => {
	if (ctx.request.url === '/') {
		const indexContent = await fs.promises.readFile(
			path.resolve(__dirname, 'index.html'),
			'utf-8'
		);
		ctx.response.body = indexContent;
		ctx.response.set('Content-Type', 'text/html');
	}
	if (ctx.request.url.endsWith('.js')) {
		const JSContent = await fs.promises.readFile(
			path.resolve(__dirname, '.' + ctx.request.url),
			'utf-8'
		);
		ctx.response.body = JSContent;
		ctx.response.set('Content-Type', 'text/javascript');
	}
});

app.listen(5173, () => {
	console.log('vite dev server listen on http://localhost:5173');
});
```

然后我们创建一个`vite.config.js`文件，这个不是vite配置哈，这个只是我们要演示如何实现别名原理的文件：

```js
const path = require('path');

module.exports = {
	resovle: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
};
```

然后我们需要获取这个文件，因为不用返回给客户端，我们这里约定名字叫`vite.config.js`，就像Vite为什么要配置文件叫这个一样

```js
const viteConfig = require('./vite.config');
console.log(viteConfig);
```

我们会发现已经获取到了，我们新创建一个src目录，新建一个`test.js`文件

```js
console.log('123');
```

然后在`main.js`中引入一下

```js
import '@/test.js';
```

现在我们需要在读取 js 文件中进行 alias 的替换，引入就不写了

```js
if (ctx.request.url.endsWith('.js')) {
	const JSContent = await fs.promises.readFile(
		path.resolve(__dirname, '.' + ctx.request.url),
		'utf-8'
	);
	// 直接进行 alias 替换
	const aliasJSContent = aliasResolver(viteConfig.resovle.alias, JSContent);
	ctx.response.body = aliasJSContent;
	ctx.response.set('Content-Type', 'text/javascript');
}
```

新建一个文件`aliasResolver.js`用来处理替换这个替换

```js
module.exports = function (aliasConf, JSContentBuffer) {
	const JSContent = JSContentBuffer.toString();
	const entires = Object.entries(aliasConf);
	console.log('entires', entires);
	let lastContent = JSContent;
	entires.forEach((entire) => {
		const [alias, path] = entire;
		// path是一个从根目录上来的绝对路径, 过长, 需要裁剪一下
		// vite 会做path的相对路径处理,我们这里无
		const srcIndex = path.indexOf('/src');
		console.log('srcIndex', srcIndex);
		const realPath = path.slice(srcIndex, path.length);
		console.log('realPath', realPath);
		// alias 别名最终做的事情就是一个字符串替换
		lastContent = JSContent.replace(alias, realPath);
	});
	console.log('lastContent----', lastContent);
	return lastContent;
};
```

当然你如果是Windows，这里就会报错无法引入，因为path路径分隔是这样的`\\`，Vite 会做更多的兼容处理，这里只是知道一下 alias 原理是什么即可

## 加载 SVG 资源

SVG：可伸缩矢量图形

优点：不会失真，且尺寸小

缺点：没法很好的去表示层次丰富的图片信息

我们一般使用 SVG 去做图标，先来尝试一下怎么使用

先准备一个svg，如果没有可以使用`create-vite`创建项目，里面一般会有svg图片

新建一个文件，随便取名：

```js
import svgIcon from './assets/react.svg';
console.log('svgIcon', svgIcon);
const img = document.createElement('img');
img.src = svgIcon;
document.body.appendChild(img);
```

这是第一种方式加载，但这种方式很麻烦，比如我需要鼠标悬浮在上面，变化某个东西，就难以扩展

接下来是第二种方式，我们在加载静态资源的时候是可以加一个参数的，默认是加上了`url`参数

```js
import svgIcon from './assets/react.svg?url';
```

我们接下来换一个参数`raw`，这个是读取整个文件内容，获取内容字符串

```js
import svgRaw from './assets/react.svg?raw';
console.log('svgIcon', svgIcon);
document.body.innerHTML = svgRaw;
```

这样也能加载出svg，如果我们要改它，比如鼠标触摸上面变个色也很方便：

```js
import svgRaw from './assets/react.svg?raw';
console.log('svgIcon', svgIcon);
document.body.innerHTML = svgRaw;
const svgElement = document.getElementsByTagName('svg')[0];
svgElement.onmouseenter = function() {
    this.style.fill = red;
}
```

这样就可以了，当然要记住改svg颜色用的是fill属性，而不是background-color或者color

## Vite 在生产环境对静态资源的处理

当我们将工程进行打包以后，打包后的静态资源会有个哈希后缀，为什么要有hash？

浏览器有一个缓存机制，静态资源名字只要不改变，那么它就会直接用缓存以此提高速度，比如在我们刷新页面的时候，就会重新请求对不对？它会看请求的名字是不是一样，如果一样就读取缓存，不一样就重新请求，当然更加深入缓存的知识，在别的章节会细讲，这里了解一下即可。

所以为了尽量避免名字一致，在打包的时候会采用hash算法，将一串字符串经过运算得到一个新的乱码字符串，只要你文件不变，hash就不会变，如果文件内容变化一点点，hash也会变化。

利用好哈希算法，可以更好的控制浏览器的缓存机制

Vite 在打包的时候是通过 rollup 来打包的，以此利用丰富生态

我们在`vite.config.js`中也可以通过 build 属性配置打包相关的：

```js
import { defineConfig } from 'vite';

export default defineConfig({
	build: { // 构建生产包的一些配置
		rollupOptions: { // 配置 rollup的一些构建策略
			output: { // 控制输出
				// 在 rollup里面, hash代表将你的文件名和文件内容进行组合计算得来的结果
			  assetFileNames: "[hash].[name].[ext]", // 配置静态资源文件名
			}
		},
		assetsInlineLimit: 4096, // 4kb 如果图片小于4kb就转为base64,大于就保存为图片
		outDir: 'testDir', // 配置输出目录
		assetsDir: 'static', // 配置输出目录中的静态资源目录
	}
});
```

这里解释就不多介绍了，注释都有，自己试试就明白了