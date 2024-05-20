# nestjs 上传文件-静态目录

## 用到的依赖

主要会用到两个包：

- @nestjs/platform-express **nestJs自带了**

- multer  @types/multer 这两个需要安装

```bash
npm i multer -S
npm i @types/multer -D
```

然后我们生成一个目录，使用`nest g res upload`

在upload Module 使用 MulterModule register 注册存放图片的目录

需要用到 multer 的 diskStorage 设置存放目录 extname 用来读取文件后缀 filename给文件重新命名

![image-20240520173913982](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520173913982.png)

```typescript
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        filename: (_, file, callback) => {
          const fileName = `${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
```

## Controller 使用

使用 UseInterceptors 装饰器，其中参数传两个，FileInterceptor是单个读取字段名称，FilesInterceptor是多个

参数使用 UploadedFile 装饰器接受 file 文件

![image-20240520174443545](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520174443545.png)

```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('album')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log(file, 'file');
    return '123';
  }
}
```

我们使用接口工具测试一下，发送发现上传成功了，终端打印如下：

![image-20240520174924952](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520174924952.png)

## 生成静态目录访问上传之后的图片

我们在 main.ts 来配置生成静态目录

我们从`@nestjs/platform-express`来导入一个类型`NestExpressApplication`，然后使用 `useStaticAssets`配置静态目录，并可以通过 prefix 加上虚拟前缀

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/chenchen',
  });
  await app.listen(3000);
}
bootstrap();
```

这样我们就能访问对应的静态目录了，只需加上名称

![image-20240520175434517](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520175434517.png)