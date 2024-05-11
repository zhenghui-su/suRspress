# Vite 配置文件中 CSS 配置流程

在 `vite.config.js` 中我们通过 css 属性去控制整个 Vite 对于 CSS 的处理行为

## Modules 配置篇

在 css 属性中，我们可以通过 modules 属性来控制 css 的模块化相关

整个 `vite.config.js`文件如下：

```js
import { defineConfig } from "vite";

export default defineConfig({
  css: { // 对css行为进行配置
    modules: { // 对css模块化的默认行为进行覆盖
      // 控制css模块化的类名格式 camelCase 驼峰 dashes 短横线
      localsConvention: "dashes",
      // 控制当前的模块化是模块化还是全局化
      scopeBehaviour: "local",
      // 生成的类名规则
      generateScopedName: "[name]__[local]___[hash:base64:5]",
      // 在生成的 hash 中加入 hello
      hashPrefix: "hello",
      // 配置你不想参与到css模块化的路径数组
      globalModulePaths: ["./index1.module.css"],
    }
  }
})
```

这里面有几个常用属性：

- ***localsConvention***：控制css模块化的类名格式显示，有如下值
  - camelCase：驼峰命名法，如 footerContent
  - dashes：短横线，如 footer-content
  - camelCaseOnly：只显示驼峰，不是驼峰的不显示
  - dashesOnly：只显示短横线，不是短横线的不显示
- ***scopeBehavior***：配置当前的模块化是 模块化local 还是全局化 global
  - local：有哈希值就代表开启了模块化，保证样式不会被覆盖
  - global：这个代表就是关闭模块化，没有哈希值了，和原生 css 一样
- ***generateScopedName***：对生成的类名进行自定义
  - 比如值为：`"[name]__[local]___[hash:base64:5]"`，其中，name 表示当前文件名，local 表示类名，这样类名就会变为我们定义的如`index-module__header__3qxGt`
  - 这个也可以配置成函数，但很少用函数，了解一下即可
  
  ```js
  generateScopedName: ( name, filename, css) => {
      // name 代表的你此刻css文件中的类型
      // filename 代表当前的css文件的绝对路径
      // css 代表当前的css文件中的样式
  	// 配置成函数, 返回值就决定了他最终显示的类型
  	return `${name}__${filename}`;
  }
  ```
  
- ***hashPrefix***：生成 hash 会根据你的类名 + 文件名 + 等等 去进行生成，如果你想生成的hash更加独特可以通过配置hashPrefix，这个字符串最终会参与到 hash 的生成

> hash：只要你的字符串有一个字不一样，生成hash就会不一样，但如果字符串完全一样hash就会一样

- ***globalModulePaths***：配置你不想参与到css模块化的路径数组

## preprocessorOptions 配置篇

假设我们没有使用 Vite等构建工具，我们又想去编译 less 文件的话，就需要下载 less，它会带上lessc 这个编译器，我们需要使用 `lessc index.less`来编译 less 文件

而在我们使用lessc 这个命令的时候，可以传很多相关的参数如`--math"always"`用来处理计算的如`margin 100px / 2`，如果你不加括号包裹它，它是不会处理的。

而在 css 属性中，我们可以通过 preprocessorOptions 属性来控制预处理器的一些全局参数

整个`vite.config.js`文件内容如下，这里只举例了几个，具体需要参考预处理器文档中的 options选项

```js
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		preprocessorOptions: {
			// key + config key代表预处理器的名字
			less: {
				// 整个的配置对象都会最终到less的执行参数(全局参数)中去
				math: 'always', // 开启less的数学计算
				// 在webpack就给less-loader配置就好
				globalVars: {
					// 配置全局变量
					mainColor: 'red',
				},
				devSourceMap: true, // 开启css的sourceMap(文件索引)
			},
		},
	},
});

```

这里有几个常用的属性

- math：就是我们上面的开启数学计算
- globalVars：定义全局变量，可以做一些全局都需用到的东西，比如颜色
- devSourceMap：开启sourceMap的配置

> sourceMap：代表文件的索引，假设我们的代码被压缩或被编译过了，这个时候如果程序出错，它产生的错误位置信息是编译或压缩的文件中，而不是我们开发时候的位置，如果有 sourceMap，它就会有一个索引文件map能够指向我们开发时候所在的位置

## PostCSS

Vite 天生对 PostCSS 有非常良好的支持

PostCSS 保证 CSS 在执行之后时万无一失的，比如为了浏览器的兼容性，PostCSS在使用插件后会给属性添加保证上如`--webkit`来保证浏览器能够执行，它其实和 babel 很类似，babel 也会将一些ES6以后的代码转为更低版本的代码

所以PostCSS 就是解决如下的一些问题，不止下面这些

- 对未来 CSS 属性的一些使用降级问题
- 前缀补全，比如`--webkit`

PostCSS 工作流程：

我们写的CSS -->  PostCSS  -->  对语法进行编译(如函数、变量)Less Sass 也能做  -->  对未来的高级CSS 语法进行降级  -->  前缀补全  -->  浏览器客户端

就像 babel 的工作流程：

我们写的JS  --> babel  --> 将ts语法转为js语法  --> 做语法降级  -->  浏览器客户端去运行

### 简单使用 PostCSS

我们来一个简单的例子来尝试一下，新建一个目录，初始化packge，安装依赖

```bash
npm i postcss-cli postcss -D
```

新建 `index.css`

```css
:root {
    --globalColor: lightblue;
}

div {
    background-color: var(--globalColor);
}
```

然后现在终端运行如下命令，代表用 postcss 将 `index.css` 转换为 `result.css`

```bash
npx postcss index.css -o result.css
```

我们会发现 result 和原来的一样，为什么呢？

因为我们没有加任何的插件，PostCSS 本身是不具备任何功能的，它根据插件来运行的，就像净水系统需要有各个插槽来过滤自来水

我们来书写配置文件`postcss.config.js`

```js
// 预设环境里面是会包含很多的插件
// 语法降级: postcss-low-level
// 编译插件: postcss-compiler
// ...
// 预设就是帮你一次性把这些必要的插件都安装好

const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [postcssPresetEnv()]
}
```

当然这个插件也需要安装：

```bash
npm i postcss-preset-env -D
```

然后我们再运行一下：

```bash
npx postcss index.css -o result.css
```

然后我们会发现它帮我们多加了一行代码，这就是基本的使用

![image-20240511212146829](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511212146829.png)

为什么 PostCSS 叫后处理器呢？在它开始的时候，它试图取代 Less、Sass，利用插件的方法来留住相关的人员

但后面发现Less、Sass不断更新，他们的插件也需要更新，工作量较大，得不偿失，于是他们基本停止维护插件，让使用者自己弄将编译后的结果给PostCSS即可

PostCSS还是会做前缀补全等工作，但前面如Less等编译不再维护，于是业内就有说法说PostCSS是后处理器，当然PostCSS也可以做Less、Sass等工作，但这个插件维护成本高，于是现在交由社区了

## PostCSS 配置篇

我们可以在 css 属性中的 postcss 属性来配置 PostCSS

比如我们配置上节课说的 `postcss-preset-env`

```js
import { defineConfig } from 'vite';
const postcssPresetEnv = require('postcss-preset-env');

export default defineConfig({
	css: {
		postcss: {
			plugins: [postcssPresetEnv],
		},
	},
});

```

我们写一个新语法，不认识也没事，主要看作用：

```css
.footer {
	width: clamp(100px, 30%, 200px);
	height: 200px;
	background-color: blue;
}
```

然后运行，会发现 PostCSS 的插件 postcssPresetEnv 给我们降级了

![image-20240511214311832](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511214311832.png)

再比如写一个别的：

```css
.footer {
	width: clamp(100px, 30%, 200px);
	height: 200px;
	background-color: blue;
	user-select: none;
}
```

查看运行，发现 postcssPresetEnv 给我们前缀补全了

![image-20240511214705259](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511214705259.png)

更多的配置参考 PostCSS 官网即可，如果你不想将这个配置在 Vite 的配置文件中，也可以新建`postcss.config.js`文件，将配置写在里面，Vite 也可以自动识别并且加载。当然 Vite配置文件里面不能有 postcss 这个属性哈。
