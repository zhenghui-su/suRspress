# nestjs 提供者

## Providers

Providers 是 Nest 的一个基本概念。

许多基本的 Nest 类可能被视为 provider - service，repository，factory，helper 等等。 他们都可以通过 constructor **注入** 依赖关系。这意味着对象可以彼此创建各种关系，并且"连接"对象实例的功能在很大程度上可以委托给 Nest 运行时系统。

Provider 只是一个用 `@Injectable()` 装饰器注释的类。

![image-20240519140003690](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519140003690.png)

### 1-基本用法

module 引入 service 在 providers 注入

![image-20240519135050972](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519135050972.png)

在 Controller 就可以使用注入好的 service 了

![image-20240519135150879](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519135150879.png)

### 2-service 第二种用法(自定义名称)

第一种用法就是一个语法糖，其实他的全称是这样的，我们可以自定义这个名称

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
	controllers: [UserController],
	providers: [
		{
			provide: 'Chenchen', // 自定义名称
			useClass: UserService,
		},
	],
})
export class UserModule {}
```

自定义名称之后 需要用对应的 `Inject` 装饰器取它，不然会找不到的

![image-20240519135516426](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519135516426.png)

### 3-自定义注入值

我们可以通过 `useValue` 来自定义我们要注入到模块的值

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
	controllers: [UserController],
	providers: [
		{
			provide: 'Chenchen',
			useClass: UserService,
		},
		{
			provide: 'JD',
			useValue: ['TB', 'PDD', 'JD'],
		},
	],
})
export class UserModule {}
```

注入后我们就可以通过 `Inject` 装饰器来取了

![image-20240519135846512](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519135846512.png)

### 4-工厂模式

如果服务之间有相互的依赖或者逻辑处理，我们可以使用 `useFactory`

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserService2 } from './user.service2';
import { UserService3 } from './user.service3';
import { UserController } from './user.controller';

@Module({
	controllers: [UserController],
	providers: [
		{
			provide: 'Chenchen',
			useClass: UserService,
		},
		{
			provide: 'JD',
			useValue: ['TB', 'PDD', 'JD'],
		},
		UserService2,
		{
			provide: 'Test',
			inject: [UserService2],
			useFactory(UserService2: UserService2) {
				return new UserService3(UserService2);
			},
		},
	],
})
export class UserModule {}
```

这时我们通过`Inject`装饰器还是可以获取到`Test`

![image-20240519140239811](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519140239811.png)

### 5-异步模式

我们可以通过`useFactory`返回一个 promise 或者其他的异步操作

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserService2 } from './user.service2';
import { UserService3 } from './user.service3';
import { UserController } from './user.controller';

@Module({
	controllers: [UserController],
	providers: [
		{
			provide: 'Chenchen',
			useClass: UserService,
		},
		{
			provide: 'JD',
			useValue: ['TB', 'PDD', 'JD'],
		},
		UserService2,
		{
			provide: 'Test',
			inject: [UserService2],
			useFactory(UserService2: UserService2) {
				return new UserService3(UserService2);
			},
		},
		{
			provide: 'sync',
			async useFactory() {
				return await new Promise((r) => {
					setTimeout(() => {
						r('sync');
					}, 3000);
				});
			},
		},
	],
})
export class UserModule {}
```
