# nestjs 中间件

## 中间件

中间件是在路由处理程序**之前**调用的函数。 中间件函数可以访问请求和响应对象

中间件函数可以执行以下任务：

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求——响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求——响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

### 1-创建一个依赖注入中间件

我们先使用`nest g mi logger`生成一个中间件，不过我们可以自己手写一下加深一下印象

要求我们实现 use 函数，返回 req res next 参数，如果不调用 next 程序将被挂起

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req);
    next();
  }
}
```

然后使用方法是在模块里面实现 configure，返回一个消费者 consumer，通过 apply 注册中间件，通过 forRoutes 指定 Controller 路由

```typescript
import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Logger } from "src/logger/logger.middleware";

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes("user");
  }
}
```

然后我们运行访问`localhost:3000/user`，查看终端发现打印成功

![image-20240520000212279](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520000212279.png)

我们把 Logger 里面的 next 注释一下，再次访问就会发现挂起了

![image-20240520000437037](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520000437037.png)

我们也可以做拦截，比如

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("进入到了Logger中间件");
    res.send("我被拦截了");
    // next();
  }
}
```

这时候再访问页面就出现我们发送的内容了

> 这两个建议不要一块写，一块写一般会有问题，比如我需要对应 Service 的返回却被 res 拦截没了，得不偿失

![image-20240520000553980](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520000553980.png)

也可以指定 拦截的方法 比如拦截 GET POST 等 forRoutes 使用对象配置

```typescript
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Logger } from "src/logger/logger.middleware";

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Logger)
      .forRoutes({ path: "user", method: RequestMethod.GET });
  }
}
```

你甚至可以直接吧 UserController 塞进去，如果我们配置`res.send`，它就会所有方法都拦截

```typescript
import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Logger } from "src/logger/logger.middleware";

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes(UserController);
  }
}
```

### 2-全局中间件

注意全局中间件只能使用函数模式 案例可以做白名单拦截之类的

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const whiteList = ["/list"];
// 这里也可以和上面一样类型标注一下
function middleWareAll(req, res, next) {
  console.log(req.originalUrl, "我收全局的kun");

  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    res.send("小黑子露出鸡脚了吧");
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(middleWareAll);
  await app.listen(3000);
}
bootstrap();
```

这里除了白名单里面的`/list`可以访问，其他都会被拦截，运行如下：

![image-20240520001321108](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520001321108.png)

![image-20240520001428388](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520001428388.png)

### 接入第三方中间件

之前我们 session 案例的时候已经接入第三方中间件了

现在再来个，比如 cors 处理跨域，安装

```bash
npm install cors
npm install @types/cors -D
```

然后使用，和 express 一样用法

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cors from "cors";

const whiteList = ["/list"];

function middleWareAll(req, res, next) {
  console.log(req.originalUrl, "我收全局的kun");

  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    res.send({ code: 200 });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(middleWareAll);
  await app.listen(3000);
}
bootstrap();
```

然后在随便一个网站，比如百度，打开控制台运行如下：

![image-20240519235510261](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519235510261.png)

使用后就没有跨域问题了
