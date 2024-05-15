# Vite 启动项目初体验

Vite 是开箱即用的( out of box)：你不需要做任何额外的配置就可以使用 Vite 来帮你处理构建工作

在默认情况下，我们的 ES Module 去导入资源的时候，要么是绝对路径，要么是相对路径

那我们下载一个包放在 node_modules，浏览器为什么在我们导入非绝对路径和非相对路径的时候不默认帮我们搜寻 node_modules 呢？

因为依赖树，比如我们导入 lodash，这个库中又 import 了别的库，这个别的库又 import 了别的，一层一层的嵌套，那网络请求是不是要请求一大堆，就会及其消耗性能

这时候就需要我们的 Vite 出场了。

## 简单示例

初始化`package.json`

```bash
npm init -y
```

随便安装一个库，比如 loadsh

```js
npm i lodash
```

创建一个`counter.js`

```js
export const count = 0;
```

再创建一个`main.js`

```js
import lodash from 'lodash';
import count from './counter.js';

console.log(lodash);
console.log(count);
```

创建一个 html，默认就好，导入 main.js

```html
<script src="./main.js" type="module"></script>
```

这时候我们运行会报错说找不到 lodash，所以我们下载 vite

```bash
npm i vite -D
```

然后在 package.json 的 script 中添加

```json
{
	"scripts": {
		"dev": "vite"
	}
}
```

我们在终端运行：`npm run dev`，然后打开就发现没错了
