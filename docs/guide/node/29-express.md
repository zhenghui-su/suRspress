## 29-express

### express介绍

Express是一个流行的Node.js Web应用程序框架，用于构建灵活且可扩展的Web应用程序和API。它是基于Node.js的HTTP模块而创建的，简化了处理HTTP请求、响应和中间件的过程。

1. 简洁而灵活：Express提供了简单而直观的API，使得构建Web应用程序变得简单快捷。它提供了一组灵活的路由和中间件机制，使开发人员可以根据需求定制和组织应用程序的行为。
2. 路由和中间件：Express使用路由和中间件来处理HTTP请求和响应。开发人员可以定义路由规则，将特定的URL路径映射到相应的处理函数。同时，中间件允许开发人员在请求到达路由处理函数之前或之后执行逻辑，例如身份验证、日志记录和错误处理。
3. 路由模块化：Express支持将路由模块化，使得应用程序可以根据不同的功能或模块进行分组。这样可以提高代码的组织性和可维护性，使得多人协作开发更加便捷。
4. 视图引擎支持：Express可以与各种模板引擎集成，例如EJS、Pug（以前称为Jade）、Handlebars等。这使得开发人员可以方便地生成动态的HTML页面，并将数据动态渲染到模板中。
5. 中间件生态系统：Express有一个庞大的中间件生态系统，开发人员可以使用各种中间件来扩展和增强应用程序的功能，例如身份验证、会话管理、日志记录、静态文件服务等。

### 编码

+ 启动一个http服务

```js
import express from 'express';

const app = express() //express 是个函数

app.listen(3000, () => console.log('Listening on port 3000'))
```

+ 编写get/post接口

```js
app.get('/', (req, res) => {
    res.send('get')
})

app.post('/create', (req, res) => {
    res.send('post')
})
```

+ 接收前端的参数

```js
app.use(express.json()) //如果前端使用的是post并且传递json 需要注册此中间件 不然是undefined

app.get('/', (req, res) => {
    console.log(req.query) //get 用query
    res.send('get')
})

app.post('/create', (req, res) => {
    console.log(req.body) //post用body
    res.send('post')
})

//如果是动态参数用 params
app.get('/:id', (req, res) => {
    console.log(req.params)
    res.send('get id')
})
```

### 模块化

> 我们正常开发的时候肯定不会把代码写到一个模块里面，Express允许将路由处理程序拆分为多个模块，每个模块负责处理特定的路由。通过将路由处理程序拆分为模块，可以使代码逻辑更清晰，易于维护和扩展

结构大部分如下

```tex
src
 --user.js
 --list.js
app.js
```

src/user.js

```js
import express from 'express'

const router = express.Router() //路由模块

router.post('/login', (req, res) => {
    res.send('login')
})

router.post('/register', (req, res) => {
    res.send('register')
})

export default router
```

app.js

```js
import express from 'express';
import User from './src/user.js'
const app = express()
app.use(express.json())
app.use('/user', User)
app.get('/', (req, res) => {
    console.log(req.query)
    res.send('get')
})

app.get('/:id', (req, res) => {
    console.log(req.params)
    res.send('get id')
})

app.post('/create', (req, res) => {
    console.log(req.body)
    res.send('post')
})

app.listen(3000, () => console.log('Listening on port 3000'))
```

### 中间件

中间件是一个关键概念。中间件是处理HTTP请求和响应的函数，它位于请求和最终路由处理函数之间，可以对请求和响应进行修改、执行额外的逻辑或者执行其他任务。

中间件函数接收三个参数：`req`（请求对象）、`res`（响应对象）和`next`（下一个中间件函数）。通过调用`next()`方法，中间件可以将控制权传递给下一个中间件函数。如果中间件不调用`next()`方法，请求将被中止，不会继续传递给下一个中间件或路由处理函数

+ 实现一个日志中间件

```bash
npm install log4js
```

log4js是一个用于Node.js应用程序的流行的日志记录库，它提供了灵活且可配置的日志记录功能。log4js允许你在应用程序中记录不同级别的日志消息，并可以将日志消息输出到多个目标，如控制台、文件、数据库等

express\middleware\logger.js

```js
import log4js from 'log4js';

// 配置 log4js
log4js.configure({
  appenders: {
    out: {
      type: 'stdout', // 输出到控制台
      layout: {
        type: 'colored' // 使用带颜色的布局
      }
    },
    file: {
      type: 'file', // 输出到文件
      filename: './logs/server.log', // 指定日志文件路径和名称
    }
  },
  categories: {
    default: {
      appenders: ['out', 'file'], // 使用 out 和 file 输出器
      level: 'debug' // 设置日志级别为 debug
    }
  }
});

// 获取 logger
const logger = log4js.getLogger('default');

// 日志中间件
const loggerMiddleware = (req, res, next) => {
  logger.debug(`${req.method} ${req.url}`); // 记录请求方法和URL
  next();
};

export default loggerMiddleware;
```

app.js

```js
import express from 'express';
import User from './src/user.js'
import loggerMiddleware from './middleware/logger.js';
const app = express()
app.use(loggerMiddleware)
```
