# Vite调用插件原理以及查缺补漏

我们在之前的插件学习中已经学习了 Vite 提供的几个独有钩子了，分别是：

- [config](https://cn.vitejs.dev/guide/api-plugin.html#config)

- [configureServer](https://cn.vitejs.dev/guide/api-plugin.html#configureserver)

- [transformIndexHtml](https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml)

如果有点忘记，可以点击上面，进入官方网址看看，或者回之前章节看看

## 三个独有新钩子

我们除了学习了上面的三个，再简单讲一下别的

### configResovled

官方文档：[configResovled](https://cn.vitejs.dev/guide/api-plugin.html#configresolved)

`configResovled`：在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

```js
configResolved(resolvedConfig) {
	// 整个配置文件的解析流程完全完毕以后会走的钩子
    console.log("resolvedConfig", resolvedConfig);
}
```

打印出来会发现有很多，因为我们有一个默认的`defineConfig`，查看插件会发现有很多内置的插件：

![image-20240514155822841](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514155822841.png)

### configurePreviewServer

官方文档：[configurePreviewServer](https://cn.vitejs.dev/guide/api-plugin.html#configurepreviewserver)

configurePreviewServer 与 configureServer 相同，但用于预览服务器。

这个钩子也是在其他中间件安装前被调用。如果你想要在其他中间件 **之后** 安装一个插件，你可以从 `configurePreviewServer` 返回一个函数，它将会在内部中间件被安装之后再调用：

```js
const myPlugin = () => ({
  name: 'configure-preview-server',
  configurePreviewServer(server) {
    // 返回一个钩子，会在其他中间件安装完成后调用
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义处理请求 ...
      })
    }
  },
})
```

### handleHotUpdate

官方文档：[handleHotUpdate](https://cn.vitejs.dev/guide/api-plugin.html#handlehotupdate)

这个就是用来自定义你的热更新行为用来覆盖官方的热更新，这块就不细讲了，后续有机会讲

## 通用钩子

上述的几个钩子是 Vite 独有的，接下来的通用钩子在 rollup 也会调用

官方文档地址：[通用钩子](https://cn.vitejs.dev/guide/api-plugin.html#universal-hooks)

### options

在服务器启动时被调用，我们现在打印的话会发现什么都没有，因为我们没有弄和 rollup 相关的配置

```js
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [
		{
			options(rollupOptions) {
				console.log('rollupOptions', rollupOptions);
			},
		},
	],
});
```

打印如下

![image-20240514161655419](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514161655419.png)

我们加一点 rollup 相关的配置

```js
import { defineConfig } from 'vite';
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				assetFileNames: '[hash].[name].[ext]',
			},
		},
	},
	plugins: [
		{
			options(rollupOptions) {
				console.log('rollupOptions', rollupOptions);
			},
		},
	],
});
```

再次运行，就有值了：

![image-20240514161940045](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514161940045.png)

### buildStart

和 options 类似，我们打印一下试试：

```js
import { defineConfig } from 'vite';
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				assetFileNames: '[hash].[name].[ext]',
			},
		},
	},
	plugins: [
		{
			options(rollupOptions) {
				console.log('rollupOptions', rollupOptions);
			},
			buildStart(fullRollupOptions) {
				console.log('fullRollupOptions', fullRollupOptions);
			},
		},
	],
});
```

结果如下：

![image-20240514162124562](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514162124562.png)

更多的就不介绍了，可以自行参考官方文档

## 社区生态插件

我们可以参考社区生态插件列表：[awesome-vite#plugins](https://github.com/vitejs/awesome-vite#plugins)

基本上大部分的需求要求都会在社区插件中有实现，根据介绍选择即可

## 调用插件原理

本质上就是读取文件，通过生命周期钩子来调用，如下：

```js
const viteConfig = require('./vite.config');
// 调用配置
viteConfig.plugins.forEach(plugin => plugin.config && plugin.config(viteConfig));
// 多个配置合并
const mergeOptions = Object.assign({}, defaultConfig, viteConfig, terminalConf);
// 对合并完的配置调用
viteConfig.plugins.forEach(plugin => plugin.config && plugin.configResolved(mergeOptions));
// 如果有html相关 就调用 transformIndexHtml
```

