# Vite 中处理 CSS

## Vite 中处理原生 CSS

Vite 天生就支持对 CSS 文件的直接处理

```js
// main.js
import './index.css';
```

上面的处理分几步：

- Vite 在读取到 `main.js` 中，发现引用了 `index.css`
- 直接使用 fs 模块去读取`index.css`中的文件内容
- 然后创建一个 style 标签，将 `index.css` 中的内容 copy 到 style 标签中
- 将 style 标签插入到 `index.html`的 head 中
- 将该 CSS 文件中的内容直接替换为 js 脚本(方便热更新和 CSS 模块化)

我们可以看一下是不是被替换了，随便写一点 `index.css` 的内容

```css
html,
body {
	font-size: 18;
}
```

然后运行查看是这样的：

![image-20240511162641122](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511162641122.png)

它在替换 JS 的时候，会设置 Content-Type 为 js，让浏览器以 js 的方式来解析该 CSS 后缀的文件

![image-20240511162808379](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511162808379.png)

这就是 Vite 中如何处理原生 CSS

## Vite 处理 CSS 模块化

我们首先构建一个场景：

- 一个组件最外层的元素类名一般取名：wrapper
- 一个组件最底层的元素类名一般取名：footer

你取了 footer 这个名字，但别人并不知道，它也取名了 footer 这个类名，那不是会冲突吗？同样的样式类名就会覆盖之前的，这就是协同开发的时候很容易出现的问题

为了解决这类的问题，就诞生了 CSS Module

我们只需在 css 文件名加上 module 后缀，变成如`index.module.css`就代表 CSS Module，这时候就会将类名后面加上哈希值以防止重复

我们来一个例子，建两个 css 和两个 js 文件，如下，另一个名字换一下就好

```css
/*index1.module.css*/
.footer {
	width: 200px;
	height: 200px;
	background-color: red;
}
/*index2.module.css*/
.footer {
	width: 200px;
	height: 200px;
	background-color: blue;
}
```

```js
import index1 from './index1.module.css';

console.log('index1-CSS', index1);
const div = document.createElement('div');
document.body.appendChild(div);
// CSS Module 是一个对象，我们从对象上取值就是这样
div.className = index1.footer;
```

然后查看，就会发现两个不会覆盖，查看控制台会发现加上了哈希值：

![image-20240511164937987](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240511164937987.png)

- 在我们将文件名改为`module.css`（module 是一种约定，表示需要开启 CSS 模块化），Vite 认为你开启了 CSS Module
- Vite 会将你的所有类名进行一定规则的替换（将 footer 替换为 \_footer_5nipi_1）
- 同时创建一个映射对象 `{ footer: "_footer_5nipi_1" }`
- 将替换过后的内容塞进 style 标签里然后放入到 head 标签中
- 将 `index1.module.css` 内容进行全部替换为 JS
- 将创建的映射对象在脚本中进行默认导出

这就是 Vite 中如何处理 CSS Module

## Vite 中处理 CSS 预处理器

由于 Vite 的目标仅为现代浏览器，因此建议使用原生 CSS 变量和实现 CSSWG 草案的 PostCSS 插件（例如 [postcss-nesting](https://github.com/jonathantneal/postcss-nesting)）来编写简单的、符合未来标准的 CSS。

话虽如此，但 Vite 也同时提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖：

```bash
# .scss and .sass
npm install -D sass

# .less
npm install -D less

# .styl and .stylus
npm install -D stylus
```

预处理就是支持一些原生 CSS 不支持的东西，比如循环，变量等等

在你安装后就可以使用了

## Vite 处理 PostCSS 后处理器

如果项目包含有效的 PostCSS 配置 (任何受 [postcss-load-config](https://github.com/postcss/postcss-load-config) 支持的格式，例如 `postcss.config.js`)，它将会自动应用于所有已导入的 CSS

PostCSS 是一个后处理器，可以添加各个插件，比如为了兼容性就可以安装`autoprefixer `插件，然后在`postcss.config.js`中添加

```js
const autoprefixer = require（'autoprefixer'）//导入自动添加前缀的插件
module.exports = {
    plugins: [autoprefixer] // 挂载插件
}
```

这下它就会自动添加兼容各个浏览器的前缀如 --webkit

详细在后面章节会介绍
