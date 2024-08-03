# weakMap, weakSet, set, map

ES5 的时候就有`Array`、`Object`这类，在 ES6 中又新增了两个，`Set`和`Map`，类似数组和对象

## Set

Set 又称集合，是由一组无序且唯一(即**不能重复**)的项组成的，可以想象成集合是一个既没有重复元素，也没有顺序概念的数组

- 属性：只有一个`size`，返回字典所包含的元素个数
- 操作方法，有四个方法，同时包括`size`
  - `add(value)`：添加某个值，返回 `Set` 结构本身
  - `delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功
  - `has(value)`：返回一个布尔值，表示该值是否为`Set`的成员
  - `clear()`：清除所有成员，无返回值
  - `size`：返回`Set`数据结构的数据长度

使用如下，很简单的例子，其中 TS 的类型也是`Set`

```typescript
let set: Set<number> = new Set([1, 2, 3, 4]);

set.add(5);

set.has(5);

set.delete(5);

set.size; // 4
```

`Set`是可以自动去重的，如下，我们创建的时候给了多个`1`和`5`，打印的时候只会有一个`1`和`5`：

```ts
let set = new Set([1, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5]);

console.log(set); // Set(5) { 1, 2, 3, 4, 5 }
```

当然我们可以这样直接返回一个去重后的数组：

```ts
let arr = [...new Set([1, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5])];

console.log(arr); // [ 1, 2, 3, 4, 5 ]
```

值得注意的是，引用类型是除外的，不能去重

## Map

Map 类似于对象，它也是键值对的集合，但是键的范围不限于字符串，Map 的键可以是任何类型(包括对象)，它是一种更完善的 Hash 结构实现，我们在上一节存储事件的时候就使用了 Map 的结构。

简单的使用，它的操作和 Set 是一致的，且类型也是`Map<key,value>`，其中`key`也可以是`object`这种引用类型，`value`一样，下面我们就把`value`变为`Function`类型

```ts
let obj = { name: "su" };
let map: Map<object, Function> = new Map();

map.set(obj, () => 123);

map.get(obj);

map.has(obj);

map.delete(obj);

map.size;
```

## WeakSet 和 WeakMap

Weak 在单词的意思是弱，WeakSet 和 WeakMap 的键都是弱引用，它不会被计入垃圾回收，我们简单演示一下

```ts
let obj = { name: "su" }; // obj引用次数1
let a = obj; // obj 引用次数2
let weakmap: WeakMap<object, any> = new WeakMap();
weakmap.set(obj, "aaa"); // weakmap引用了, 但是obj引用次数不会加1
```

需要注意`WeakMap`的`key`只能是引用类型，不能是基础类型

首先`obj`引用了这个对象 + 1，`a`也引用了 + 1，`weakmap`也引用了，但是不会 + 1，因为他是弱引用，不会计入垃圾回收，因此 `obj` 和 `a`释放了该引用 `weakMap` 也会随着消失的。

```ts
let obj: any = { name: "su" }; //1
let a: any = obj; //2
let weakmap: WeakMap<object, string> = new WeakMap();

weakmap.set(obj, "aaa"); //2 他的键是弱引用不会计数的

obj = null; // -1
a = null; //-1
//v8 GC 不稳定 最少200ms

setTimeout(() => {
	console.log(weakmap);
	console.log(weakmap.get(obj));
}, 500);
```

我们查看一下浏览器控制台，我们会发现这个`weakMap`为空的：

![image-20240803211525741](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240803211525741.png)

但是有个问题你会发现有时候控制台能输出，值是取不到的，因为 V8 的 GC 回收是需要一定时间的，你可以延长到`500ms`看一看，并且为了避免这个问题不允许读取键值，也不允许遍历，同理`weakSet`也一样

![image-20240803211746501](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240803211746501.png)
