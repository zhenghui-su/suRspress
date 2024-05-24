# nestjs 管道-验证 DTO

上一小节我们讲了转换，这节主要讲验证 DTO

我们先`nest g pi p`创建一个 pipe 验证管道

![image-20240521155159274](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521155159274.png)

## 安装验证器

我们安装一下验证器所需要的库：

```bash
npm i --save class-validator class-transformer
```

然后我们找到对应的 dto 目录，找到`create-p.dot.ts`文件书写：

![image-20240521155332995](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521155332995.png)

```typescript
import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePDto {
	@IsNotEmpty() //验证是否为空
	@IsString() //是否为字符串
	name: string;

	@IsNotEmpty()
	age: number;
}
```

还可以自己写抛出错误后返回的信息

```typescript
import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePDto {
	@IsNotEmpty({
		message: '名字不能为空',
	}) //验证是否为空
	@IsString() //是否为字符串
	name: string;

	@IsNotEmpty()
	age: number;
}
```

## controller 使用管道和定义类型

我们在 Controller 层使用管道并定义所需要的类型：

![image-20240521155512880](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521155512880.png)

## 实现验证 transform

回到我们生成的`p.pipe.ts`文件，其中 value 就是前端传过来的数据，metaData 就是元数据，通过 metatype 可以去实例化这个类，如下：

![image-20240521155858296](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521155858296.png)

我们实例化一下 DTO，发现打印出来的已经是我们发送的内容了

![image-20240521160051380](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521160051380.png)

这时我们通过 validate 验证 DTO，返回一个 promise 的错误信息，如果有错误抛出

我们发送的时候把名字为空，就会抛出错误了

![image-20240521160417825](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521160417825.png)

这里我们还保留了之前的异常拦截器，我们把它注释一下，再看看：

![image-20240521160553708](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521160553708.png)

这下就没问题，抛出异常同时把信息返回了，让前端能够知道哪些参数错误了

## 注册全局 DTO 验证管道

就是在 `main.ts` 文件下使用`useGlobalPipes`方法，传入`ValidationPipe`即可，这是 nestjs 内置的一个验证管道，注册后，运行如下，返回信息是我在 DTO 层改成中文了：

![image-20240521161450837](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240521161450837.png)

可以看到最终效果和我们自己写的差不多，只不过我们写的会多出一些参数，当然我们自己写的也可以手动去除这个让返回的更加精简
