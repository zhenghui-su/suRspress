# never 类型

TypeScript 使用 never 类型来表示不应该存在的状态，感觉比较抽象吧，其实可以理解为无法达到的终点

> 比如异常，死循环

```ts
// 返回never的函数必须存在无法达到的终点

// 因为必定抛出异常，所以 error 将不会有返回值
function error(message: string): never {
	throw new Error(message);
}

// 因为存在死循环，所以 loop 将不会有返回值
function loop(): never {
	while (true) {}
}
```

上面两个就是无法到达，所以用 never 类型

## never 与 void 的差异

### 差异 1

`void`类型只是没有返回值，但本身是不会出错的，而`never`只会抛出异常，没有返回值

```ts
//void类型只是没有返回值 但本身不会出错
function Void(): void {
	console.log();
}

//只会抛出异常没有返回值
function Never(): never {
	throw new Error("aaa");
}
```

### 差异 2

当我们鼠标移上去的时候会发现 只有`void`和`number`，`never`在联合类型中会被直接移除

![image-20240731230556430](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240731230556430.png)

## never 类型的一个应用场景

我们先看下面的简单代码：

```ts
type A = "kun" | "ikun" | "kunkun";

function isKun(value: A) {
	switch (value) {
		case "kun":
			break;
		case "ikun":
			break;
		case "kunkun":
			break;
	}
}
```

然后，新来了一个同事他新增了一个篮球，那我们必须手动找到所有 switch 代码并处理，否则将有可能引入 BUG 。

而且这将是一个"隐蔽型"的 BUG，如果回归面不够广，很难发现此类 BUG。

那 TS 有没有办法帮助我们在类型检查阶段发现这个问题呢？通过`never`就可以解决了，新加一个`default`处理

```ts
type A = "kun" | "ikun" | "kunkun";

function isKun(value: A) {
	switch (value) {
		case "kun":
			break;
		case "ikun":
			break;
		case "kunkun":
			break;
		default:
			// 适用于场景兜底逻辑
			const error: never = value;
			return error;
	}
}
```

由于任何类型都不能赋值给 `never` 类型的变量，所以当存在进入 `default` 分支的可能性时，TS 的类型检查会及时帮我们发现这个问题，我们给`A`类型加一个`lanqiu`，就会发现报错了：

![image-20240731231126628](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240731231126628.png)

这样我们只需找报错的 switch，在上面加上就可以了
