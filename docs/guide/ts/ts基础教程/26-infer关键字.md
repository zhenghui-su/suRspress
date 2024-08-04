# infer 关键字

## infer

`infer` 的作用是**推导泛型参数**，`infer`声明只能出现在`extends`子语句中

我们举个简单的例子，获取 Promise 的返回值：

```ts
interface User {
	name: string;
	age: number;
}

type PromiseType = Promise<User>;

type GetPromiseType<T> = T extends Promise<infer R> ? R : T;

type r = GetPromiseType<PromiseType>;
```

查看`r`，没问题，正是`User`

![image-20240804210434578](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804210434578.png)

如果出现多层嵌套的情况，那我们递归提取一下就好

```ts
type PromiseType = Promise<Promise<Promise<User>>>;

type GetPromiseType<T> = T extends Promise<infer R> ? GetPromiseType<R> : T;
```

![image-20240804210720141](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804210720141.png)

## infer 协变

做个小工具，获取对象属性的类型并且返回元组类型，不行就返回原类型：

```ts
let obj = {
	name: "su",
	age: 123
};
type protyKey<T> = T extends { name: infer N; age: infer A } ? [N, A] : T;

type res = protyKey<typeof obj>;
```

![image-20240804210943669](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804210943669.png)

如果我们用`infer`推断出的类型用同一个变量，就会产生协变，返回值为联合类型：

```ts
type protyKey<T> = T extends { name: infer U; age: infer U } ? U : T;
```

![image-20240804211132982](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804211132982.png)

## infer 逆变

一般在函数的参数上会产生逆变，我们举个例子：

```ts
type FnType<T> = T extends {
	a: (args: infer U) => void;
	b: (args: infer U) => void;
}
	? U
	: never;
type T = FnType<{ a: (args: number) => void; b: (args: string) => void }>;
```

我们查看结果会发现变为了 `never`类型，为什么呢？

![image-20240804211517504](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240804211517504.png)

分析一下，因为我们用`infer`推断的时候同时用了`U`变量，此时产生了逆变，逆变的返回为交叉类型，所以我们传入`number`和`string`类型，`U`就是`number & string`

怎么可能一个类型同时是`string`又是`number`，所以`U`不存在，返回了`never`

**总结**：

- 在**协变位置**上同一个类型变量的多个候选类型会被推断为**联合类型**
- 在**逆变位置**上，同一个类型变量的多个候选类型则会被推断为**交叉类型**

## infer 类型提取

由于 `infer` 可以进行类型推断用变量表示，我们就可以通过`infer`来做许多工具

### 提取头部元素

我们可以实现一个泛型工具，提取一个数组的**第一个**元素：

```ts
type Arr = ["a", "b", "c"];

type First<T extends any[]> = T extends [infer First, ...any[]] ? First : [];

type a = First<Arr>;
```

类型参数 `T` 通过 `extends` 约束只能是数组类型，然后通过`infer`声明局部 `First` 变量做提取，后面的元素可以是任意类型，然后把**局部变量**返回

### 提取尾部元素

其实就是和上面反过来操作：

```ts
type Arr = ["a", "b", "c"];

type Last<T extends any[]> = T extends [...any[], infer Last] ? Last : [];

type c = Last<Arr>;
```

### 剔除头部元素

就是数组的第一个元素不要，其他都要：

```ts
type Arr = ["a", "b", "c"];

type Shift<T extends any[]> = T extends [unknown, ...infer Shift] ? Shift : [];

type a = Shift<Arr>;
```

思路即我们除了第一个元素，把其他的剩余元素声明成一个变量，直接返回，就剔除了第一个

### 剔除尾部元素

就是把上面的反过来：

```ts
type Arr = ["a", "b", "c"];

type Pop<T extends any[]> = T extends [...infer Pop, unknown] ? Pop : [];

type a = Pop<Arr>;
```

这块知识需要多练，TS 中最博大精深的一块即**类型体操**
