# nestjs 守卫

## 守卫（guard）

守卫有一个单独的责任。

它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理，这通常称为授权。

在传统的 Express 应用程序中，通常由中间件处理授权(以及认证)。中间件是身份验证的良好选择，因为诸如 token 验证或添加属性到 request 对象上与特定路由(及其元数据)没有强关联。

> tips：守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。

### 创建一个守卫

我们通过`nest g gu [name]`就可以自动生成了，可通过`nest --help`来查看所有生成命令

守卫要求实现函数 给定参数 context **执行上下文** 要求返回布尔值

![image-20240521170736057](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521170736057.png)

### Controller 使用守卫

使用`UseGuards`控制守卫

![image-20240521170854819](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521170854819.png)

### 全局守卫

通过在`main.ts`文件中，使用`useGlobalGuards`来使用你所需要的守卫

```typescript
app.useGlobalGuards(new RoleGuard());
```

![image-20240521171002920](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521171002920.png)

### 针对角色控制守卫

我们可以使用`@SetMetadata`装饰器来控制

第一个参数为 key，第二个参数用于自定义，我们的例子是数组存放的权限

![image-20240521171251367](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521171251367.png)

然后我们在守卫中控制，使用 Reflector 反射读取 setMetaData 的值去做判断，这边例子是从 url 判断有没有 admin 权限

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		console.log('经过了守卫', context);
		const admin = this.reflector.get<string[]>('role', context.getHandler());
		const request = context.switchToHttp().getRequest<Request>();
		if (admin.includes(request.query.role as string)) {
			return true;
		} else {
			return false;
		}
	}
}
```

然后我们访问`localhost:3000/guard?role=admin`，会成功：

![image-20240521171609465](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521171609465.png)

换一个访问，比如`localhost:3000/guard?role=user`，会失败，返回 403 也正确

![image-20240521172021459](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521172021459.png)
