# nestjs 模块

## 模块@Module
每个 Nest 应用程序至少有一个模块，即根模块。

根模块是 Nest 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的功能

### 1-基本用法

当我们使用`nest g res user`创建一个 CURD 模板的时候 nestjs 会自动帮我们引入模块

![image-20240519230015803](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230015803.png)

### 2-共享模块

例如 user 的 Service 想暴露给 其他模块使用就可以使用 exports 导出该服务

![image-20240519230155648](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230155648.png)

由于 App.modules 已经引入过该模块 就可以直接使用 user 模块的 Service 

![image-20240519230239975](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230239975.png)

我们在 Controller 里面使用 userService 的 getHello 方法

![image-20240519230416276](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230416276.png)

### 3-全局模块

我们使用`@Global()`装饰器就可以将某个模块注册为全局模块

![image-20240519230632302](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230632302.png)

然后再生成一个list模块，我们无需在 module 里 import 导入就可以使用 userService 的东西了

![image-20240519230851152](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519230851152.png)

### 4-动态模块

动态模块主要就是为了给模块传递参数，可以给该模块添加一个静态方法，用来接受参数

![image-20240519231054693](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519231054693.png)

代码如下：

```typescript
import { Module, DynamicModule, Global } from '@nestjs/common';

interface Options {
  path: string;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'Config',
          useValue: { baseApi: '/api' + options.path },
        },
      ],
      exports: [
        {
          provide: 'Config',
          useValue: { baseApi: '/api' + options.path },
        },
      ],
    };
  }
}
```

然后我们在 import 里就可以使用该静态方法了

![image-20240519231259444](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519231259444.png)

然后在app的controller里使用一下

![image-20240519232204637](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519232204637.png)

运行一下，访问`localhost:3000`，结果如下：

![image-20240519232223439](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519232223439.png)