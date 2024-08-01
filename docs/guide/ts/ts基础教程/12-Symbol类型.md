# Symbol 类型

TS 官网：[Symbols](https://www.tslang.cn/docs/handbook/symbols.html)

## Symbol

自 ECMAScript 2015 起，`symbol`成为了一种新的原生类型，就像`number`和`string`一样。

`symbol`类型的值是通过`Symbol`构造函数创建的。

可以传递参做为唯一标识 只支持 `string` 和 `number` 类型的参数

```ts
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串key
```

`Symbol` 的值是唯一的，比如在使用`===`比对时就会返回 false

```ts
const s1 = Symbol();
const s2 = Symbol();
// s1 === s2 =>false
```

那么就来个小问题，如何让两个`Symbol`返回 true 呢？其实可以通过`for`方法：

```ts
console.log(Symbol.for("1") === Symbol.for("1")); // true
```

`for`它会全局`Symbol`去找有没有已经注册过的，如果有就会直接拿来用，地址一样，如果没有它就会再创建一个

`Symbol` 还可以用作对象属性的键

```ts
let sym = Symbol();

let obj = {
	[sym]: "value"
};

console.log(obj[sym]); // "value"
```

使用 `Symbol` 定义的属性，是不能通过如下方式遍历拿到的

```ts
const symbol1 = Symbol("666");
const symbol2 = Symbol("777");
const obj1 = {
	[symbol1]: "张三",
	[symbol2]: "二蛋",
	age: 18,
	sex: "男"
};
// 1- for in 遍历
for (const key in obj1) {
	// 注意在console看key,是不是没有遍历到symbol1
	console.log(key);
}
// 2- Object.keys 遍历
Object.keys(obj1);
console.log(Object.keys(obj1));
// 3- getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj1));
// 4- JSON.stringfy
console.log(JSON.stringify(obj1));
```

那我们如何拿到`Symbol`定义的属性呢？可以通过下面两个方法：

```ts
// 1- 拿到具体的symbol 属性,对象中有几个就会拿到几个
Object.getOwnPropertySymbols(obj1);
console.log(Object.getOwnPropertySymbols(obj1));
// 2- es6 的 Reflect 拿到对象的所有属性
Reflect.ownKeys(obj1);
console.log(Reflect.ownKeys(obj1));
```

## 生成器和迭代器

### 生成器

我们可以通过下面的方法使用生成器，注意`*`号和`yield`，里面支持同步异步，使用`next`方法打印值

```ts
function* gen() {
	yield Promise.resolve("1");
	yield "2";
	yield "3";
	yield "4";
}
const num = gen();
console.log(num.next()); // 调用next方法才能显示数字
console.log(num.next());
console.log(num.next());
console.log(num.next());
console.log(num.next());
```

结果如下，打印了五次：

![image-20240801165637153](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240801165637153.png)

其中`value`代表值，而`done`代表有没有值迭代，如果为`false`代表还可以继续迭代

那我们为什么要讲生成器呢，我们打印一下`num`，如下：

![image-20240801165811681](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240801165811681.png)

从中我们发现了`Symbol`，同时发现了它带着一个方法`iterator`，这就是迭代器了

### 迭代器 iterator

迭代器支持遍历大部分类型，比如 arr、nodeList、argumetns、set、map 等，没错包括**伪数组**

```ts
var arr = [1, 2, 3, 4];
let iterator = arr[Symbol.iterator]();

console.log(iterator.next()); //{ value: 1, done: false }
console.log(iterator.next()); //{ value: 2, done: false }
console.log(iterator.next()); //{ value: 3, done: false }
console.log(iterator.next()); //{ value: 4, done: false }
console.log(iterator.next()); //{ value: undefined, done: true }
```

测试一下：

```ts
interface Item {
	age: number;
	name: string;
}

const array: Array<Item> = [
	{ age: 123, name: "1" },
	{ age: 123, name: "2" },
	{ age: 123, name: "3" }
];

type mapTypes = string | number;
const map: Map<mapTypes, mapTypes> = new Map();

map.set("1", "王爷");
map.set("2", "陆北");

const obj = {
	aaa: 123,
	bbb: 456
};

let set: Set<number> = new Set([1, 2, 3, 4, 5, 6]);
// let it:Iterator<Item> = array[Symbol.iterator]()
const gen = (erg: any): void => {
	let it: Iterator<any> = erg[Symbol.iterator]();
	let next: any = { done: false };
	while (!next.done) {
		next = it.next();
		if (!next.done) {
			console.log(next.value);
		}
	}
};
gen(array);
```

但这个还是太过麻烦了，我们平时开发中不会手动调用它，它是有对应的语法糖的即`for of`

```ts
for (let value of map) {
	console.log(value);
}
```

数组解构的原理其实也是调用迭代器的

```ts
var [a, b, c] = [1, 2, 3];

var x = [...xxxx];
```

值得注意的是`for of`是不能循环对象的，因为对象没有 iterator，我们可以实现一个迭代器让对象支持`for of`

```ts
const obj = {
	max: 5,
	current: 0,
	[Symbol.iterator]() {
		return {
			max: this.max,
			current: this.current,
			next() {
				if (this.current == this.max) {
					return {
						value: undefined,
						done: true
					};
				} else {
					return {
						value: this.current++,
						done: false
					};
				}
			}
		};
	}
};
console.log([...obj]);

for (let val of obj) {
	console.log(val);
}
```

这个迭代器就是通过我们生成器中的`done`来实现的

## Symbol 相关

- `Symbol.hasInstance`：方法，会被`instanceof`运算符调用。构造器对象用来识别一个对象是否是其实例。

- `Symbol.isConcatSpreadable`：布尔值，表示当在一个对象上调用`Array.prototype.concat`时，这个对象的数组元素是否可展开。

- `Symbol.iterator`：方法，被`for-of`语句调用。返回对象的默认迭代器。

- `Symbol.match`：方法，被`String.prototype.match`调用。正则表达式用来匹配字符串。

- `Symbol.replace`：方法，被`String.prototype.replace`调用。正则表达式用来替换字符串中匹配的子串。

- `Symbol.search`：方法，被`String.prototype.search`调用。正则表达式返回被匹配部分在字符串中的索引。

- `Symbol.species`：函数值，为一个构造函数。用来创建派生对象。

- `Symbol.split`：方法，被`String.prototype.split`调用。正则表达式来用分割字符串。

- `Symbol.toPrimitive`：方法，被`ToPrimitive`抽象操作调用。把对象转换为相应的原始值。

- `Symbol.toStringTag`：方法，被内置方法`Object.prototype.toString`调用。返回创建对象时默认的字符串描述。

- `Symbol.unscopables`：对象，它自己拥有的属性会被 with 作用域排除在外。
