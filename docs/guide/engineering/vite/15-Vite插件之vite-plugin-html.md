# Vite 插件之 vite-plugin-html

Vite 其实内置了很多插件，不需要像 webpack 那样承担很高的心智负担，不需要学很多东西，所以在学习过程中就没有那么难

接下来我们学习 vite-plugin-html 这个插件，它就是帮我们动态地控制我们生成的 HTML 文件中的内容

## 基本使用

先安装依赖，下载 vite-plugin-html

```bash
npm i vite-plugin-html -D
```

可以查看 Github 文档来查看它的插件配置：[Github：vite-plugin-html](https://github.com/vbenjs/vite-plugin-html)

我们来主要看 `inject`这个配置，我们一般需要书写`ejs`语法来配置

> ejs 语法一般在服务端用的多，服务端一般会频繁修改 HTML 文件的内容

我们来书写它，在`index.html`文件

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title><%= title %></title>
	</head>

	<body>
		<div>111</div>
	</body>
	<script src="./main.js" type="module"></script>
</html>
```

我在这里使用`ejs`书写了一个 `title`，然后我们在插件配置注入它

```js
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
	plugins: [
		createHtmlPlugin({
			inject: {
				data: {
					title: '首页',
				},
			},
		}),
	],
});
```

然后我们运行它，打开网页，查看标题，发现成功修改：

![image-20240513204048150](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513204048150.png)

我们尝试打包后查看一下，发现打包后的也是修改成功的

![image-20240513204246745](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513204246745.png)

## 手写 vite-plugin-html 插件

在`plugins`文件夹下新建`CreateHtmlPlugin.js`文件

这一小节，我们学习一个 Vite 提供的一个新的钩子：[transformIndexHtml](https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml)

我们思路是获取配置然后将 html 内容中的 ejs 替换

```js
module.exports = (options) => {
	return {
		// 转换 html
		transformIndexHtml: (html, ctx) => {
			// ctx 表示当前整个请求的一个执行期上下文, 和之前的开发服务器类似
			console.log('html', html);

			return html.replace(/<%= title %>/g, options.inject.data.title);
		},
	};
};
```

会发现报错，我们仔细看，会发现没有打印 html，证明它没有执行

这证明什么意思呢？证明有人在它之前就把 html 给读取了，我们就需要将这个插件往前提，把他变成对象，利用 enforce 属性，这在官方文档里也有说明：

![image-20240513205806232](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513205806232.png)

```js
module.exports = (options) => {
	return {
		// 转换 html
		transformIndexHtml: {
			enforce: 'pre',
			transform: (html, ctx) => {
				// ctx 表示当前整个请求的一个执行期上下文, 和之前的开发服务器类似
				console.log('html', html);

				return html.replace(/<%= title %>/g, options.inject.data.title);
			},
		},
	};
};
```

然后调用，运行，发现成功

```js
import { defineConfig } from 'vite';
import CreateHtmlPlugin from './plugins/CreateHtmlPlugin';
export default defineConfig({
	plugins: [
		CreateHtmlPlugin({
			inject: {
				data: {
					title: '主页',
				},
			},
		}),
	],
});
```

![image-20240513205719565](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513205719565.png)

这里为了简单示例，是没有引入 ejs 解析啥的，所以这个插件自定义配置相关就没有那么丰富的，这里是为了引入 enforce 属性。
