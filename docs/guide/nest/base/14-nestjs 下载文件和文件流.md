# nestjs 下载文件和文件流

下载文件的方式有很多种

## 1-download 直接下载

这个文件信息应该存数据库 我们这儿演示就写死了

```typescript
import {
	Controller,
	Get,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import type { Response } from 'express';

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('album')
	@UseInterceptors(FileInterceptor('file'))
	upload(@UploadedFile() file) {
		console.log(file, 'file');
		return '123';
	}
	@Get('export')
	downLoad(@Res() res: Response) {
		const url = join(__dirname, '../images/1716207756190.jpg');
		// res
		// console.log(url)
		res.download(url);
		// return  true
	}
}
```

接口工具测试一下，下载成功：

![image-20240520202325058](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520202325058.png)

## 2-使用文件流的方式下载

可以使用 compressing 把他压缩成一个 zip 包，下载：`npm i compressing -S`

```js
import { zip } from 'compressing';
```

然后编写一个新接口：

```typescript
  @Get('stream')
  async down(@Res() res: Response) {
    const url = join(__dirname, '../images/1662894316133.png');
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=chenchen`);

    tarStream.pipe(res);
  }
```

我们如果直接访问，下载是一个二进制流文件，不能访问，需要前端来解析一下流文件

我们封装一个接口：

```typescript
const useFetch = async (url: string) => {
	const res = await fetch(url).then((res) => res.arrayBuffer());
	console.log(res);
	const a = document.createElement('a');
	a.href = URL.createObjectURL(
		new Blob([res], {
			// type:"image/png"
		})
	);
	a.download = 'chenchen.zip';
	a.click();
};

const download = () => {
	useFetch('http://localhost:3000/upload/stream');
};
```

具体操作就是读取流然后转为 zip，页面创建这就简单弄一下。
