# RESTful 风格设计

RESTful 是一种风格，在 RESTful 中，一切都被认为是资源，每个资源有对应的 URL 标识.

不是标准也不是协议，只是一种风格。当然你也可以不按照他的风格去写。

## 接口 url

### 传统接口

我们传统的接口设计如下：

```js
http://localhost:8080/api/get_list?id=1

http://localhost:8080/api/delete_list?id=1

http://localhost:8080/api/update_list?id=1
```

### RESTful 接口

而 RESTful 风格的接口如下：

```js
http://localhost:8080/api/get_list/1/查询 删除 更新
```

RESTful 风格一个接口就会完成 增删改差 他是通过不同的请求方式来区分的

- 查询 GET

- 提交 POST

- 更新 PUT PATCH

- 删除 DELETE

## RESTful 版本控制

一共有三种我们一般用第一种 更加语义化

| 版本                    | 解释                              |
| ----------------------- | --------------------------------- |
| `URI Versioning`        | 版本将在请求的 URI 中传递（默认） |
| `Header Versioning`     | 自定义请求标头将指定版本          |
| `Media Type Versioning` | 请求的`Accept`标头将指定版本      |

我们要控制版本，需要修改`main.ts`中的内容

```typescript
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// 控制版本
	app.enableVersioning({
		type: VersioningType.URI,
	});
	await app.listen(3000);
}
bootstrap();
```

然后在`user.controller` 配置版本，Controller 变成一个对象通过 version 配置版本

```typescript
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
	path: 'user',
	version: '1',
})
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id);
	}
}
```

然后我们访问`localhost:3000/user`会找不到，只有访问`localhost:3000/v1/user`才能找到

![image-20240518192311369](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518192311369.png)

![image-20240518192256533](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518192256533.png)

当然也可以单个接口控制：

```typescript
@Get()
@Version('1')
findAll() {
  return this.userService.findAll();
}
```

## Code 状态码规范

- 200 ➡ OK
- 304 Not Modified ➡ 协商缓存了
- 400 Bad Request ➡ 参数错误
- 401 Unauthorized ➡ token 错误
- 403 Forbidden referer origin ➡ 验证失败
- 404 Not Found ➡ 接口不存在
- 500 Internal Server Error ➡ 服务端错误
- 502 Bad Gateway ➡ 上游接口有问题或者服务器问题
