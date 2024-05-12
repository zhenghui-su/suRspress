# 为什么要用 path 处理服务端路径

这节把之前小节的一点说一下，就是为什么我们需要使用path处理服务端的路径

举个例子，我们的插件就是在服务端运行，这其中一定会涉及到读文件，但如果我们写的是相对路径，会发生什么呢？如下：

```js
const fs = require('fs');
const result = fs.readFileSync('./index.css');
console.log('result', result.toString());
```

如果我们是在这个js代码的目录下运行，是不会出错。但如果我们换一个目录，比如换一个目录，然后运行这个js代码，就会发现报错了

```bash
node test-path/main.js
```

因为你所在的目录没有这个东西，所以就会报错

node 端去读取文件或者操作文件的时候，如果发现你用的是相对路径，则会使用`process.cwd()`来进行相应的拼接

> `process.cwd()`：获取当前的node执行目录

但我们希望它读取的时候基于 main.js 去进行一个绝对路径的拼接生成，所以我们需要处理它

由于我们在服务端，它是commonjs 规范，会注入一个变量`__dirname`，它代表当前文件所在的目录，那我们用它拼接吧

```js
const fs = require('fs');
const result = fs.readFileSync(__dirname + '/index.css');
console.log('result', result.toString());
```

运行，发现没问题了，但为什么我们要用path呢？其实主要是兼容，因为如果是Windows下，会发现不是正斜杠，而是反斜杠了，如下，只差`\`

```js
const fs = require('fs');
const result = fs.readFileSync(__dirname + '\index.css');
console.log('result', result.toString());
```

所以为了统一，使用path，path本质就是一个字符串处理模块，它有很多的路径字符串处理方法

```js
const fs = require('fs');
const path = require('path');
// 使用 resovle 方法来拼接
const indexCSSPath = path.resovle(__dirname, './index.css');
const result = fs.readFileSync(indexCSSPath);
console.log('result', result.toString());
```

这样每个操作系统都可以读取到了

那为什么每个地方都会有一个变量`__dirname`呢？

其实涉及到Common JS 规范的原理，它其实是将东西都放到一个立即执行函数中，这样就实现作用域隔绝，实现模块化，我们可以尝试一下

```js
console.log('arguments', arguments);
```

运行会发现打印出东西，我们往下翻翻就会找到几个字符串：

![image-20240512141027568](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240512141027568.png)

是不是很熟悉，4 其实代表的就是 `__dirname`

Common JS 规范将东西包在立即执行函数中，它传了五个参数

```js
(function(exports, require, module, __filename, __dirname) }{
 console.log('arguments', arguments);
}())
```

这下就知道为什么会有这个了，了解一下即可