# Vite 插件之 vite-aliases 插件

Vite 会在不同的生命周期中去调用不同的插件以达到不同的目的

> 生命周期：Vite 从开始执行到执行结束，中间这个过程就是生命周期

webpack 中有一个输出 HTML 文件的插件 清除输出目录：clean-webpack-plugin

Vite 其实和 webpack 的非常类似

## 基本使用 vite-aliases

我们从一个简单的插件 vite-aliases 学起

vite-aliases 可以帮助我们生成别名：它会检测你的当前目录下包括 src 在内的所有文件夹，并帮助我们去生成别名

先安装它，如果 node 版本不对可以使用 nvm 切换

```js
npm i vite-aliases -D
```

然后在`vite.config.js`中使用 plugins 来配置插件：

```js
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';

export default defineConfig({
	plugins: [ViteAliases()],
});
```

这个插件生成的别名是如何的呢？比如下面这样，\*\*代表你的工程路径

```js
{
    "@": "/**/src",
    "@assets": "/**/src/assets",
    "@components": "/**/src/components"
}
```

它还有很多配置，可以参考[官方 Github](https://github.com/Subwaytime/vite-aliases)，这里举一个即可

```js
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';

export default defineConfig({
	plugins: [
		ViteAliases({
			prefix: '&',
		}),
	],
});
```

这样配置，你的别名就是以 & 开头的，如下：

```js
import testPng from '&assets/test.png';
```

## 手写 vite-aliases 插件

整个插件就是在 Vite 的生命周期的不同阶段去做不同的事情，我们利用官方提供的钩子来做事情

比如说 Vue 和 React 官方就会提供一些生命周期函数如 created

我们去手写 vite-aliases 其实就是在 vite 执行配置文件之前将配置文件改了

从[官网文档地址：Vite 独有钩子](https://cn.vitejs.dev/guide/api-plugin.html#vite-specific-hooks)，我们可以使用 `config`来做这个事情

我们新建一个文件夹`plugins`，新建文件`ViteAliases.js`

Vite 的插件必须返回给 Vite 一个配置对象，而我们看大部分插件导出的都是一个函数，然后我们去调用这个函数来使用

> 用函数的形式，可以拥有更多的自定义配置，如果导出一个对象也可以，但多元化就没了

```js
// vite的插件必须返回给vite一个配置对象
export default () => {
	return {
		config() {
			return {};
		},
	};
};
```

然后我们看`config`

```js
// vite的插件必须返回给vite一个配置对象
export default () => {
	return {
		// config函数可以返回一个对象，这个对象是部分的vite config配置
		config(config, env) {
			console.log('参数', config, env);
			// config参数: 目前的一个配置对象
			// env: mode: string, command: string
			// mode: development 或者 production 代表环境
			// command: 运行的命令 serve 或者 build
			return {};
		},
	};
};
```

我们先返一个空对象，然后我们用一下插件，看看打印出的参数是什么

```js
import { defineConfig } from 'vite';
import MyViteAliases from './src/plugins/ViteAliases';

export default defineConfig({
	plugins: [MyViteAliases()],
});
```

我们发现打印实在 Vite 执行之前调用的，这没问题

![image-20240513163021609](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513163021609.png)

这里还需要强调，通过`vite.config.js`返回出去的配置对象以及我们在插件的`config`生命周期中返回的对象都不是最终的一个配置对象

Vite 会把这几个配置对象进行一个 **merge** 合并，类似`...`合并

现在我们来写插件，这里我们要返回一个 resolve 出去, 将 src 目录下的所有文件夹进行别名控制

第一步我们先读目录

```js
// vite的插件必须返回给vite一个配置对象
const fs = require('fs');
const path = require('path');

module.exports = () => {
	return {
		// config函数可以返回一个对象，这个对象是部分的vite config配置
		config(config, env) {
			console.log('参数', config, env);
			// config参数: 目前的一个配置对象
			// env: mode: string, command: string
			// mode: 就是当前环境比如开发还是打包
			const result = fs.readdirSync(path.resolve(__dirname, '../src'));
			console.log('result', result);
			return {
				// 这里我们要返回一个resolve出去, 将src目录下的所有文件夹进行别名控制
				// 先读目录
			};
		},
	};
};
```

运行，会发现把我们目录打印都读取了，但有个不必要的文件`test.js`，我们需要去掉

![image-20240513164319658](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513164319658.png)

我们来编写一个函数`getTotalSrcDir`用来处理

```js
function getTotalSrcDir() {
	const result = fs.readdirSync(path.resolve(__dirname, '../src'));
	const diffResult = diffDirAndFile(result, '../src');
}
function diffDirAndFile(dirFilesArr = [], basePath = '') {
	const result = {
		dirs: [],
		files: [],
	};

	dirFilesArr.forEach((name) => {
		// 用同步写容易理解
		const currentFileStat = fs.statSync(
			path.resolve(__dirname, basePath + '/' + name)
		);
		console.log(currentFileStat);
	});
}
```

我们先调用打印一下，发现每个文件的 Stat 打印出来了

![image-20240513165142615](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513165142615.png)

然后我们调用 Stat 上有一个方法`isDirectory`可以识别是否是目录

```js
console.log('currentFileStat', name, currentFileStat.isDirectory());
```

打印看看，发现不是目录的 `test.js`就变为 false 了，这样我们就可以识别了

![image-20240513165435542](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513165435542.png)

```js
function diffDirAndFile(dirFilesArr = [], basePath = '') {
	const result = {
		dirs: [],
		files: [],
	};

	dirFilesArr.forEach((name) => {
		// 用同步写容易理解
		const currentFileStat = fs.statSync(
			path.resolve(__dirname, basePath + '/' + name)
		);
		console.log('currentFileStat', name, currentFileStat.isDirectory());
		const isDirectory = currentFileStat.isDirectory();
		if (isDirectory) {
			result.dirs.push(name);
		} else {
			result.files.push(name);
		}
	});
	return result;
}
```

然后我们看看结果：

```js
function getTotalSrcDir() {
	const result = fs.readdirSync(path.resolve(__dirname, '../src'));
	const diffResult = diffDirAndFile(result, '../src');
	console.log(diffResult);
}
```

运行，结果如下，这样我们就成功获取了目录，第一步读目录完成

![image-20240513165725602](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513165725602.png)

第二步，我们要生成 resolve 这个配置对象，继续改进`getTotalSrcDir`

```js
function getTotalSrcDir() {
	const result = fs.readdirSync(path.resolve(__dirname, '../src'));
	const diffResult = diffDirAndFile(result, '../src');
	console.log(diffResult);

	const resolveAliasesObj = {}; // 放的就是一个一个的别名配置 @assets: xxx

	diffResult.dirs.forEach((dirName) => {
		const key = `@${dirName}`;
		const absPath = path.resolve(__dirname, '../src/' + dirName);
		console.log('key--', key, 'absPath--', absPath);
		resolveAliasesObj[key] = absPath;
	});

	return resolveAliasesObj;
}
```

然后调用获取它，打印看看：

```js
const resovleAliasesObj = getTotalSrcDir();
console.log('resolve', resovleAliasesObj);
```

发现打印出来的毫无问题，对应成功

![image-20240513170253223](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513170253223.png)

最后我们只需要在返回的配置对象中挂上去就成功啦

```js
return {
	// 这里我们要返回一个resolve出去, 将src目录下的所有文件夹进行别名控制
	resolve: {
		alias: resovleAliasesObj,
	},
};
```

`test.js`使用别名引入一下

```js
import reactSvg from '@assets/react.svg';
```

我们先什么插件都不用，启动之后会发现报错：

![image-20240513170739160](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513170739160.png)

然后我们启用我们的写的插件，会发现成功运行了，并且成功引入，在页面上显示了

![image-20240513170915973](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513170915973.png)

接下来我们弄一个上面的自定义配置，就是自定义别名符号，这里就是利用函数传参来做

下面是`ViteAliases.js`完整代码，其实就是把`keyName`传给`getTotalSrcDir`了

```js
// vite的插件必须返回给vite一个配置对象
const fs = require('fs');
const path = require('path');

function getTotalSrcDir(keyName) {
	const result = fs.readdirSync(path.resolve(__dirname, '../src'));
	const diffResult = diffDirAndFile(result, '../src');
	console.log(diffResult);

	const resolveAliasesObj = {}; // 放的就是一个一个的别名配置 @assets: xxx

	diffResult.dirs.forEach((dirName) => {
		const key = `${keyName}${dirName}`;
		const absPath = path.resolve(__dirname, '../src/' + dirName);
		console.log('key--', key, 'absPath--', absPath);
		resolveAliasesObj[key] = absPath;
	});

	return resolveAliasesObj;
}
function diffDirAndFile(dirFilesArr = [], basePath = '') {
	const result = {
		dirs: [],
		files: [],
	};

	dirFilesArr.forEach((name) => {
		// 用同步写容易理解
		const currentFileStat = fs.statSync(
			path.resolve(__dirname, basePath + '/' + name)
		);
		console.log('currentFileStat', name, currentFileStat.isDirectory());
		const isDirectory = currentFileStat.isDirectory();
		if (isDirectory) {
			result.dirs.push(name);
		} else {
			result.files.push(name);
		}
	});
	return result;
}
module.exports = ({ keyName = '@' }) => {
	return {
		// config函数可以返回一个对象，这个对象是部分的vite config配置
		config(config, env) {
			console.log('参数', config, env);
			// config参数: 目前的一个配置对象
			// env: mode: string, command: string
			// mode: 就是当前环境比如开发还是打包

			// 先读目录
			const resovleAliasesObj = getTotalSrcDir(keyName);
			console.log('resolve', resovleAliasesObj);
			return {
				// 这里我们要返回一个resolve出去, 将src目录下的所有文件夹进行别名控制
				resolve: {
					alias: resovleAliasesObj,
				},
			};
		},
	};
};
```

然后我们在配置中调用时候传别名配置：

```js
import { defineConfig } from 'vite';
import MyViteAliases from './plugins/ViteAliases';

export default defineConfig({
	plugins: [
		MyViteAliases({
			keyName: '&',
		}),
	],
});
```

当然`test.js`也要改一下

```js
import reactSvg from '&assets/react.svg';
```

照样可以运行，这就是自定义配置的实现，完整目录如下，后续插件基本都在这做：

![image-20240513171737595](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240513171737595.png)
