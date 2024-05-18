# 认识 nestjs 控制器

## Controller Request 

它用于获取前端传过来的参数，nestjs 提供了方法参数装饰器用来帮助我们快速获取参数，如下：

| 装饰器                  | 获取的参数                    |
| ----------------------- | ----------------------------- |
| @Request()              | req                           |
| @Response()             | res                           |
| @Next()                 | next                          |
| @Session()              | req.session                   |
| @Param(key?: string)    | req.params/req.params[key]    |
| @Body(key?: string)     | req.body/req.body[key]        |
| @Query(key?: string)    | req.query/req.query[key]      |
| @Headers(name?: string) | req.headers/req.headers[name] |
| @HttpCode               |                               |

调试工具可以使用Postman、ApiPost、ApiFox等

比如：[ApiFox](https://apifox.com/?utm_source=baidu_sem1)

### 1-获取 get 请求传参

可以使用Request 装饰器，配合`req.query`即可获取

![image-20240518213455405](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518213455405.png)

也可以使用Query 直接获取 不需要在通过req.query 了

![image-20240518213535967](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518213535967.png)

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query) {
    console.log(query);
    return {
      code: 200,
      message: query.name,
    };
  }
}
```

### 2-获取 post 请求参数

可以使用Request装饰器，配合`req.body`即可获取

![image-20240518214156774](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518214156774.png)

也可以使用Body装饰器

![image-20240518214258148](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518214258148.png)

也可以直接读取key，上面Query也可以

![image-20240518214424422](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518214424422.png)

```typescript
import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query) {
    console.log(query);
    return {
      code: 200,
      message: query.name,
    };
  }

  @Post()
  create(@Body() bdoy) {
    console.log(bdoy);
    return {
      code: 200,
      message: bdoy.name,
    };
  }
}
```

### 3-动态路由

可以使用Request装饰器，配合`req.param`即可获取，这里就不展示了

也可以使用 Param 装饰器，它也可以接受key来获取，它们都差不多

![image-20240518214927323](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518214927323.png)

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  find(@Query() query) {
    console.log(query);
    return { code: 200 };
  }

  @Post()
  create(@Body('name') body) {
    console.log(body);
    return { code: 200 };
  }

  @Get(':id')
  findId(@Param() param) {
    console.log(param);
    return { code: 200 };
  }
}
```

### 4-读取 header 信息

我们随便加一个Cookie，然后通过Headers装饰器就可以获取到

![image-20240518215309151](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518215309151.png)

```typescript
import { Controller, Get, Post, Body, Headers, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  find(@Query() query) {
    console.log(query);
    return { code: 200 };
  }

  @Post()
  create(@Body('name') body) {
    console.log(body);
    return { code: 200 };
  }

  @Get(':id')
  findId(@Headers() header) {
    console.log(header);
    return { code: 200 };
  }
}
```

### 5-状态码

使用 HttpCode 装饰器可以控制接口返回的状态码

![image-20240518215531904](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518215531904.png)

我再改成200试试

![image-20240518215613113](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518215613113.png)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  find(@Query() query) {
    console.log(query);
    return { code: 200 };
  }

  @Post()
  create(@Body('name') body) {
    console.log(body);
    return { code: 200 };
  }

  @Get(':id')
  @HttpCode(200)
  findId(@Headers() header) {
    console.log(header);
    return { code: 200 };
  }
}
```

当然还有一些比较偏的，比如重定向，我们主要先了解一些常用的