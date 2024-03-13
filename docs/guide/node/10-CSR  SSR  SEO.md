## 10-CSR SSR SEO

### 概述

在上一章的时候我们说过在 node 环境中无法操作 DOM 和 BOM，但是如果非要操作 DOM 和 BOM 也是可以的我们需要使用第三方库帮助我们`jsdom`

```bash
npm i jsdom
```

`jsdom` 是一个模拟浏览器环境的库，可以在 Node.js 中使用 DOM API

#### 简单案例

```js
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><div id='app'></div>`);

const document = dom.window.document;

const window = dom.window;
// fetch node 18版本之后才有
fetch('https://api.thecatapi.com/v1/images/search?limit=10&page=1')
  .then((res) => res.json())
  .then((data) => {
    const app = document.getElementById('app');
    data.forEach((item) => {
      const img = document.createElement('img');
      img.src = item.url;
      img.style.width = '200px';
      img.style.height = '200px';
      app.appendChild(img);
    });
    fs.writeFileSync('./index.html', dom.serialize());
  });
```

运行完该脚本会在执行目录下生成 html 文件，里面内容都是渲染好的

![image-20231027155719992](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027155719992.png)

### CSR SSR

我们上面的操作属于**SSR **`(Server-Side Rendering)`**服务端渲染**请求数据和拼装都在**服务端**完成

而我们的`Vue`，`React`等框架(这里不谈 nuxtjs,nextjs)，是在**客户端**完成渲染拼接的属于**CSR**`(Client-Side Rendering)`**客户端渲染**

CSR 和 SSR 区别

1. 页面加载方式：
   - CSR：在 CSR 中，**服务器**返回一个初始的 **HTML** 页面，然后浏览器**下载并执行 JavaScript 文件**，JavaScript 负责动态生成并更新页面内容。这意味着初始页面加载时，内容较少，页面结构和样式可能存在一定的**延迟**。
   - SSR：在 SSR 中，服务器在**返回**给浏览器之前，会**预先**在**服务器端**生成完整的 HTML 页面，包含了初始的页面内容。浏览器接收到的是**已经渲染**好的 HTML 页面，因此初始加载的**速度较快**。
2. 内容生成和渲染：
   - CSR：在 CSR 中，页面的内容生成和渲染是由**客户端**的 JavaScript 脚本负责的。当数据变化时，JavaScript 会**重新生成并更新 DOM**，从而实现内容的动态变化。这种方式使得前端开发更加灵活，可以创建**复杂**的交互和动画效果。
   - SSR：在 SSR 中，**服务器**在渲染页面时会执行应用程序的代码，并生成最终的 HTML 页面。这意味着页面的初始内容是由服务器生成的，对于一些**静态**或**少变**的内容，可以提供更好的**首次加载性能**。
3. 用户交互和体验：
   - CSR：在 CSR 中，一旦初始页面加载完成，后续的用户交互通常是通过 AJAX 或 WebSocket 与服务器进行数据交互，然后通过 JavaScript 更新页面内容。这种方式可以提供更快的页面切换和响应速度，但对于**搜索引擎爬虫**和 **SEO**（搜索引擎优化）来说，可能需要一些额外的处理。
   - SSR：在 SSR 中，由于页面的初始内容是由服务器生成的，因此用户交互可以直接在服务器上执行，然后服务器返回更新后的页面。这样可以提供更好的**首次加载性能**和对**搜索引擎**友好的内容。

### SEO

SEO `（Search Engine Optimization）`**搜索引擎**优化

CSR 应用对 SEO 并不是很友好

> 因为在首次加载的时候获取 HTML 信息较少 搜索引擎爬虫可能无法获取完整的页面内容

如下的一个网页源代码 网址：[https://iviewui.com/view-ui-plus/guide/introduce](https://iviewui.com/view-ui-plus/guide/introduce)

![image-20231027161037567](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027161037567.png)

而 SSR 就不一样了 由于 SSR 在服务器端预先生成完整的 HTML 页面，搜索引擎爬虫可以直接获取到完整的页面内容。这有助于搜索引擎正确理解和评估页面的内容

下面是掘金，通过`nuxt.js`服务端渲染 网址：[https://juejin.cn/](https://juejin.cn/)

![image-20231027161156404](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027161156404.png)

说了这么多，哪些网站适合做 CSR，哪些适合做 SSR

CSR 应用：ToB 型，例如后台管理系统、大屏可视化，都可以采用 CSR 渲染，不需要很高的 SEO 支持

SSR 应用：内容密集型应用 ToC 型，例如 新闻网站、博客网站、电子商务、门户网站，需要 SEO 支持
