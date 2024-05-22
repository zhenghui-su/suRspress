# nestjs swagger接口文档

swagger 是一个用于提供给前端的接口文档生成库，安装如下：

```bash
npm install  @nestjs/swagger swagger-ui-express
```

## 注册 swagger

在`main.ts`文件中注册它：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('晨晨接口文档')
    .setDescription('描述如下')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
```

然后我们启动运行，访问我们设置的路径`localhost:3000/api-docs`

![image-20240522175505941](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522175505941.png)

## 使用 ApiTags 添加分组

上面的接口文档，我们发现没有分组，他们都挤在一起了，很乱

我们在 Controller 层可以使用 `@ApiTags()`装饰器来添加分组，可以传入分组名称

比如我这里，设置分组为 守卫：

![image-20240522175701177](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522175701177.png)

然后我们再访问，就会发现有守卫相关接口的分组了：

![image-20240522175754401](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522175754401.png)

## 使用 ApiOperation 添加接口描述

我们发现每个接口只有孤单单的一个接口设置，没有相关描述，难以理解

我们可以使用`@ApiOperation()`来对接口添加接口描述，如下：

![image-20240522180023105](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180023105.png)

这时候再看这个接口，就会有对应的描述了：

![image-20240522180101327](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180101327.png)

## 使用 ApiParam 添加动态参数描述

我们发现有些接口需要带上参数，比如 id，但我们没有相关描述说这个是哪些的 id

我们可以使用`@ApiParam()`装饰器来为这些动态参数添加描述：

![image-20240522180305465](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180305465.png)

然后再次查看，就会发现有相关的描述了，还添加上了必须

![image-20240522180355220](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180355220.png)

## 使用 ApiQuery 修饰 get

我们也可以使用`@ApiQuery()`装饰器来修饰get相关参数

![image-20240522180533800](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180533800.png)

访问查看：

![image-20240522180551168](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180551168.png)

## 使用 ApiProperty 定义Post

如果是 post 的请求，我们可以使用`@ApiProperty`来定义相关参数描述

比如我们可以在 Dto 层来定义一下：

![image-20240522180740835](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180740835.png)

然后查看 post 接口，就会发现有了

![image-20240522180831021](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522180831021.png)

## 使用 ApiResponse 自定义返回信息

我们如何自定义返回的信息呢，可以使用`@ApiResponse()`装饰器来做状态码和描述

![image-20240522181039600](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181039600.png)

访问如下：

![image-20240522181054616](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181054616.png)

## 使用 ApiBearerAuth 添加 jwt token

有些接口需要 token 才能发送，我们如何做这方面的限制呢？

首先在`main.ts`中添加 addBearerAuth 函数

![image-20240522181232954](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181232954.png)

然后我们在需要增加 token 验证的接口的 Controller 上增加 `@ApiBearerAuth()`装饰器

![image-20240522181358734](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181358734.png)

再次访问，会出现这个选项，这就是添加 token 的地方

![image-20240522181451314](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181451314.png)

点击后，输入对应的 token 即可，这里随便输了

![image-20240522181538441](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181538441.png)

如果添加了 token 验证的接口，末端有一把锁，锁上代表带了 token，没锁则代表没有 token

![image-20240522181656741](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181656741.png)

我们随便点一个接口，然后点击尝试：

![image-20240522181732343](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181732343.png)

点击执行，用来测试一下：

![image-20240522181755597](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181755597.png)

执行后会出现结果，我们找找，会发现 请求头 已经带上我们刚刚输入的 token：

![image-20240522181850579](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522181850579.png)

## 其他装饰器

如下图，自行参考：

![image-20240522182043778](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522182043778.png)

