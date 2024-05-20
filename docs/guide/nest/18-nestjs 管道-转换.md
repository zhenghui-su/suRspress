# nestjs 管道-转换

管道，可以做两件事

- 转换：可以将前端传入的数据转成成我们需要的数据
- 验证：类似于前端的 rules 配置验证规则

我们先来看转换，nestjs 提供了八个内置转换 API

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`

## 案例 1

我们接受的动态参数希望是一个 number 类型，现在是 string

比如这个，我们调用的时候，传进来是一个 string 类型

![image-20240520232511239](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520232511239.png)

但我们想要一个 number，如何更改呢？这时候就可以通过内置的管道去做转换

我们利用`ParseIntPipe`，将它放在装饰器的第二个参数

这个时候我们再次调用，就会发现它变为了 number 了

![image-20240520232645004](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520232645004.png)

## 案例 2

这里我们再来弄一个，id 为 uuid 才能访问，先安装它：

```bash
npm install uuid -S
npm install @types/uuid -D
```

然后我们引入：

```typescript
import * as uuid from 'uuid';
console.log(uuid.v4()); // 打印一个方便访问
```

先打印一个方便访问接口：

![image-20240520233205999](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520233205999.png)

然后我们利用`ParseUUIDPipe`来对 id 做限制，必须是 uuid 才能访问这个接口：

![image-20240520233309341](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520233309341.png)

再运行，访问`localhost:3000/p/123`试试，发现没通过，输出错误说需要 uuid

![image-20240520233414550](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520233414550.png)

再访问`localhost:3000/p/41529eec-5aef-4d9c-987c-5267b79de22f`，通过

![image-20240520233450410](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240520233450410.png)
