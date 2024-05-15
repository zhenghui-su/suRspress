# Vite 的依赖预构建

比如下面的代码

```js
import _ from 'lodash';
```

Vite 会自动帮我们补全路径，类似下面

```js
import _ from '/node_modules/.vite/lodash'; // 简略
import __vite__cjsImport0_loadsh from '/node_modules/.vite/deps/lodash.js?v=d9505e06'; //编译结果
```

> 找寻依赖的过程是自当前目录依次向上查找的过程，直到搜寻到根目录或者搜寻到对应依赖上为止

生产和开发

- 开发中每次依赖预构建所重新构建的相对路径都是正确的
- 生产中 Vite 会交给 Rollup 去完成生产环境的打包，让兼容性更好

而我们导入库的时候会出现一个问题，有些库它不是 ES Module 的导出，它是 common js 规范的导出，为了解决这个问题，Vite 使用了 **依赖预构建** 解决它

## 依赖预构建

依赖预构建的步骤如下：

- 首先 Vite 会找到对应的依赖，然后调用 esbuild（对 js 语法进行处理的一个库）将其他规范的代码转换为 esmodule 规范
- 然后将它放入到当前目录的 node_modules/.vite/deps 中
- 将各个模块进行统一集成，变成一个文件

它解决了 3 个问题：

- 不同的第三方库会有不同的导出格式，Vite 将它都转为 esmodule
- 对路径的处理下可以直接使用 .vite/deps，方便路径重写
- 解决网络多包传输的性能问题（嵌套 import 问题，也是浏览器不支持 node_modules 的原因）

## 配置初识

创建一个文件 `vite.config.js`，这就是 Vite 的配置文件类似 `webpack.config.js`

```js
export default {
	optimizeDeps: {
		exclude: ['lodash-es'], // 当遇到 lodash-es 这个依赖时不进行依赖预构建
	},
};
```

这里知道一下就行，后续会详细解读
