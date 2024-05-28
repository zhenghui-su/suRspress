# 装饰器实现 GET 请求

首先安装依赖

```bash
npm install axios -S
```

然后定义控制器 Controller

```typescript
class Controller {
	constructor() {}
	getList() {}
}
```

然后我们定义装饰器

这里需要用到装饰器工厂，它会为装饰器默认塞入一些参数

我们定义 descriptor 的类型 通过 descriptor 描述符里面的 value 把 axios 的结果返回给当前使用装饰器的函数

```typescript
const Get = (url: string): any => {
	return (target, key, descriptor: PropertyDescriptor) => {
		const fnc = descriptor.value;
		axios
			.get(url)
			.then((res) => {
				fnc(res, {
					status: 200,
				});
			})
			.catch((e) => {
				fnc(e, {
					status: 500,
				});
			});
	};
};
```

然后我们把装饰器用到 Controller 里

```typescript
class Controller {
	constructor() {}
	@Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	getList(res: any, status: any) {
		console.log(res.data.result.list, status);
	}
}
```

完整代码：

```typescript
import axios from 'axios';

const Get = (url: string): any => {
	return (target, key, descriptor: PropertyDescriptor) => {
		const fnc = descriptor.value;
		axios
			.get(url)
			.then((res) => {
				fnc(res, {
					status: 200,
				});
			})
			.catch((e) => {
				fnc(e, {
					status: 500,
				});
			});
	};
};

//定义控制器
class Controller {
	constructor() {}
	@Get('https://api.apiopen.top/api/getHaoKanVideo?page=0&size=10')
	getList(res: any, status: any) {
		console.log(res.data.result.list, status);
	}
}
```

使用 ts-node 运行，这个接口没有跨域限制，能返回数据

![image-20240518171146931](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518171146931.png)
