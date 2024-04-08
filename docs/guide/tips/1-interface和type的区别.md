## interface 和 type 的区别

比如下面这段代码

```typescript
interface Obj {
	name: string;
}

type Obj2 = {
	name: string;
};

let a: Obj = { name: 'test' }; // interface

let b: Obj2 = { name: 'test' }; // type

let user: Record<string, string>; // key:string value:string

user = a; // interface赋值给Record类型会报错 提示是interface缺少了索引签名

user = b; // 而type类型不会报错
```

从上面我们看到了 interface 缺失了索引签名, 那我们加上, 发现不报错了

```typescript
interface Obj {
	name: string;
	[key: string]: string;
}
```

所以解决方案是加上索引签名

那么产生的原因是什么呢

把 interface 赋值 Record 的时候需要明确 interface 的属性,那我们明确了呀,为什么还会报错, 因为 interface 会进行声明合并,如下,同名的 interface 都可以合并

```typescript
interface Obj {
	name: string;
}

interface Obj {
	age: number;
} // 这样就多出来了一个number
```

所以我们需要明确索引签名才能保证 Record 的正确性,但使用 type 就没有这个问题了,因为 type 不会进行声明合并,重名的会报错
