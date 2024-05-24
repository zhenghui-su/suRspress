# 认识 nestjs cli

## 创建新项目

nest 也有像 React 一样的脚手架，叫 nestjs cli，我们安装它

```bash
npm i -g @nestjs/cli
```

然后我们通过 cli 来创建 nest 项目

```bash
nest new [项目名称]
```

会让你选择包管理器，自己选择即可

随后我们进入，启动项目，我们需要热更新就启动`npm run start:dev`就可以

```json
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
```

## 目录介绍

### main.ts 入口文件

它是主文件 类似于 vue 的 main.ts

通过` NestFactory.create(AppModule)` 创建一个 app 就是类似于绑定一个根组件`App.vue`，`app.listen(3000)` 就是监听一个端口

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000);
}
bootstrap();
```

### app.controller.ts 控制器

常见用于处理 http 请求以及调用 service 层的处理方法

`private readonly appService: AppService` 这一行代码就是依赖注入不需要实例化 `appService` 它内部会自己实例化的我们只需要放上去就可以了

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
```

我们可以修改一下地址：

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/get')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/hello')
	getHello(): string {
		return this.appService.getHello();
	}
}
```

然后运行，访问`localhost:3000/get/hello`，如下：

![image-20240518172649445](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518172649445.png)

### app.service.ts

这个文件主要实现业务逻辑的 当然 Controller 可以实现逻辑，但是就是单一的无法复用，放到`app.service`有别的模块也需要就可以实现复用

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
}
```

### app.module.ts

就是类似之前我们的 IOC 容器，用于处理其他类的引用和共享

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
```

### app.controller.spec.ts

这是测试相关的东西，不懂的话可以不用看，因为一般不需要你写，其实就是一个断言

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
	let appController: AppController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AppController],
			providers: [AppService],
		}).compile();

		appController = app.get<AppController>(AppController);
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(appController.getHello()).toBe('Hello World!');
		});
	});
});
```

## 相关配置

如果是 Windows 电脑可能有报错，如下：

![image-20240518174547213](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518174547213.png)

我们只需配置`.eslintrc.js`文件就可以了，在`rules`里加上

```js
'prettier/prettier': ['error', { endOfLine: 'auto' }],
```

![image-20240518174648304](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518174648304.png)

因为 Prettier 默认是以 Unix 的行尾字符，默认为 LF，而 Windows 以 CRLF 结尾，自然报错，加上后就不会报错了
