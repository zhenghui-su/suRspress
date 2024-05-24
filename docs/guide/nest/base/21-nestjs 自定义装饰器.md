# nestjs 自定义装饰器

在 nestjs 中我们使用了大量的装饰器，而 nestjs 也允许我们去定义装饰器

通过`nest --help`来查看，发现有命令可以生成装饰器

![image-20240522011647216](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522011647216.png)

## 案例

### 案例 1—自定义权限装饰器

我们可以把之前的 `setMetadata`封装成一个自定义权限装饰器

我们通过`nest g d [name]`就可以生成装饰器

![image-20240522011851319](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522011851319.png)

```typescript
import { SetMetadata } from '@nestjs/common';

export const Role = (role: string[]) => {
	console.log(role, 1);
	return SetMetadata('role', role);
};
```

然后我们在 Controller 里使用它，可以看到也是没啥问题

![image-20240522012003738](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522012003738.png)

### 案例 2—自定义参数装饰器返回一个 url

我们在 `role.decorator` 文件中再加一个`ReqUrl`：

```typescript
import {
	ExecutionContext,
	SetMetadata,
	createParamDecorator,
} from '@nestjs/common';
import type { Request } from 'express';

export const Role = (role: string[]) => {
	console.log(role, 1);
	return SetMetadata('role', role);
};

export const ReqUrl = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest<Request>();
		return req.url;
	}
);
```

然后在 Controller 层使用，访问后发现获取 url 也是没有问题的：

![image-20240522012500610](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522012500610.png)
