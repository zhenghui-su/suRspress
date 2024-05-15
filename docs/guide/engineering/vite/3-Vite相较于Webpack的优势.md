# Vite 相较于 Webpack 的优势

官方文档：[为什么选 Vite](https://cn.vitejs.dev/guide/why.html#the-problems)

起因：当项目越大，构建工具 (Webpack) 所需处理的 js 代码就越多，这和 Webpack 的工作流程有关

结果：构建工具需要很长时间才能启动开发服务器

> Webpack 还不能改，如果改了，整个就变化了，生态等等也要改变

Webpack 支持多种模块化，比如下面的例子

```js
const lodash = require('lodash'); // common js 规范
import React from 'react'; // es6 module
```

Webpack 允许我们这么写，它的转换结果大致如下：

```js
const lodash = webpack_require('lodash');
const React = webpack_require('react');
```

> 通过 AST 抽象语法树来转换

由于支持多种模块化，它一开始就需要统一模块化代码，这意味着它需要将所有的依赖都读一遍

为了兼容性，因为还有 node 端，所以 Webpack 性能较差。

Vite 基于 ES Module，Vite 关注浏览器端的开发体验，且在启动方面有些不同，它的性能很快，这就是相较于 Webpack 的优势之一。
