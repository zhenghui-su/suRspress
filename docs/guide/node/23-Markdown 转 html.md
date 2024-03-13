## 23-Markdown 转 html

什么是 Markdown ?

> Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。

而 Markdown 转 html 是一种非常常见的需求，常用于博客等地方

### 所用库

**EJS**：一款强大的 JavaScript 模板引擎，它可以帮助我们在 HTML 中嵌入动态内容。使用 EJS，您可以轻松地将 Markdown 转换为美观的 HTML 页面。

**Marked**：一个流行的 Markdown 解析器和编译器，它可以将 Markdown 语法转换为 HTML 标记。Marked 是一个功能强大且易于使用的库，它为您提供了丰富的选项和扩展功能，以满足各种转换需求。

**BrowserSync**：一个强大的开发工具，它可以帮助您实时预览和同步您的网页更改。当您对 Markdown 文件进行编辑并将其转换为 HTML 时，BrowserSync 可以自动刷新您的浏览器，使您能够即时查看转换后的结果。

### EJS 语法

#### 1. 纯脚本语言

`<% code %>`
里面可以写任意的 js，用于流程控制，无任何输出。如下面：会执行弹框

```cpp
<% alert('hello world') %>
```

#### 2. 输出经过 HTML 转义的内容

`<%= value %>` 可以是变量
`<%= a ? b : c %>` 也可以是表达式
`<%= a + b %>`
即变量如果包含 '<'、'>'、'&'等 HTML 字符，会被转义成字符实体，像`< > &`
因此用`<%=`，最好保证里面内容不要有 HTML 字符

```cpp
const text = '<p>你好你好</p>'
<h2><%= text %></h2>// 输出 &lt;p&gt;你好你好&lt;/p&gt; 插入 <h2> 标签中
```

#### 3. 输出非转义的内容(原始内容)

`<%- 富文本数据 %>` 通常用于输出富文本，即 HTML 内容
上面说到`<%=`会转义 HTML 字符，那如果我们就是想输出一段 HTML 怎么办呢？
`<%-`不会解析 HTML 标签，也不会将字符转义后输出。像下例，就会直接把 `<p>我来啦</p>` 插入标签中

```cpp
const content = '<p>标签</p>'
<h2><%- content %></h2>
```

#### 4. 引入其他模版

`<%- include('***文件路径') %>`
将相对于模板路径中的模板片段包含进来。
用`<%- include`指令而不是`<% include`，为的是避免对输出的 HTML 代码做转义处理。

```cpp
// 当前模版路径：./views/tmp.ejs
// 引入模版路径：./views/user/show.ejs
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```

#### 5. 条件判断

```cpp
<% if (condition1) { %>
  ...
<% } %>

<% if (condition1) { %>
  ...
<% } else if (condition2) { %>
  ...
<% } %>

// 举例
<% if (a && b) { %>
  <p>可以直接放 html 内容</p>
<% } %>

<% if (a && b) { %>
  <% console.log('也可以嵌套任意ejs模版语句') %>
<% } %>
```

#### 6. 循环

```cpp
<% for(var i = 0; i < target.length; i++){ %>
  <%= i %> <%= target[i] %>
<% } %>

<% for(var i in jsArr) { %>
  <script type="text/javascript" src="<%= jsArr[i] %>" ref="preload"></script>
<% } %>

// 推荐
<% for(var css of cssArr) { %>
  <link rel="stylesheet" href="<%= css %>" />
<% } %>
```

### 编写

#### template.ejs

初始化模板 到时候会转换成 html 代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <%- content %>
</body>
</html>
```

#### marked

- 编写一个简单的 Markdown 文档

```markdown
### 标题

- test
```

- 将 md 转换成 html

```js
const marked = require('marked');
marked.parse(readme.toString()); //调用parse即可
```

#### browserSync

创建 browser 并且开启一个服务 设置根目录和 index.html 文件

```js
const browserSync = require('browser-sync');
const openBrowser = () => {
  const browser = browserSync.create();
  browser.init({
    server: {
      baseDir: './',
      index: 'index.html',
    },
  });
  return browser;
};
```

#### index.css

html 代码有了 但是没有通用的 markdown 的通用 css

```css
/* Markdown通用样式 */

/* 设置全局字体样式 */
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

/* 设置标题样式 */
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 1.3em;
  margin-bottom: 0.6em;
  font-weight: bold;
}

h1 {
  font-size: 2.2em;
}

h2 {
  font-size: 1.8em;
}

h3 {
  font-size: 1.6em;
}

h4 {
  font-size: 1.4em;
}

h5 {
  font-size: 1.2em;
}

h6 {
  font-size: 1em;
}

/* 设置段落样式 */
p {
  margin-bottom: 1.3em;
}

/* 设置链接样式 */
a {
  color: #337ab7;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 设置列表样式 */
ul,
ol {
  margin-top: 0;
  margin-bottom: 1.3em;
  padding-left: 2em;
}

/* 设置代码块样式 */
pre {
  background-color: #f7f7f7;
  padding: 1em;
  border-radius: 4px;
  overflow: auto;
}

code {
  font-family: Consolas, Monaco, Courier, monospace;
  font-size: 0.9em;
  background-color: #f7f7f7;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

/* 设置引用样式 */
blockquote {
  margin: 0;
  padding-left: 1em;
  border-left: 4px solid #ddd;
  color: #777;
}

/* 设置表格样式 */
table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1.3em;
}

table th,
table td {
  padding: 0.5em;
  border: 1px solid #ccc;
}

/* 添加一些额外的样式，如图片居中显示 */
img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

/* 设置代码行号样式 */
pre code .line-numbers {
  display: inline-block;
  width: 2em;
  padding-right: 1em;
  color: #999;
  text-align: right;
  user-select: none;
  pointer-events: none;
  border-right: 1px solid #ddd;
  margin-right: 0.5em;
}

/* 设置代码行样式 */
pre code .line {
  display: block;
  padding-left: 1.5em;
}

/* 设置代码高亮样式 */
pre code .line.highlighted {
  background-color: #f7f7f7;
}

/* 添加一些响应式样式，适应移动设备 */
@media only screen and (max-width: 768px) {
  body {
    font-size: 14px;
    line-height: 1.5;
  }

  h1 {
    font-size: 1.8em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.3em;
  }

  h4 {
    font-size: 1.1em;
  }

  h5 {
    font-size: 1em;
  }

  h6 {
    font-size: 0.9em;
  }

  table {
    font-size: 14px;
  }
}
```

### 完整代码

```js
const ejs = require('ejs'); // 导入ejs库，用于渲染模板
const fs = require('node:fs'); // 导入fs模块，用于文件系统操作
const marked = require('marked'); // 导入marked库，用于将Markdown转换为HTML
const readme = fs.readFileSync('README.md'); // 读取README.md文件的内容
const browserSync = require('browser-sync'); // 导入browser-sync库，用于实时预览和同步浏览器
const openBrowser = () => {
  const browser = browserSync.create();
  browser.init({
    server: {
      baseDir: './',
      index: 'index.html',
    },
  });
  return browser;
};
ejs.renderFile(
  'template.ejs',
  {
    content: marked.parse(readme.toString()),
    title: 'markdown to html',
  },
  (err, data) => {
    if (err) {
      console.log(err);
    }
    let writeStream = fs.createWriteStream('index.html');
    writeStream.write(data);
    writeStream.close();
    writeStream.on('finish', () => {
      openBrowser();
    });
  }
);
```

目录如下：index.js 即完整的转换代码
![image-20231220161823013](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231220161823013.png)

编写后，终端输入`node index.js`运行，自动弹出网页，效果如下

![image-20231220161923121](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231220161923121.png)
