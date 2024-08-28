# Object.freeze 相关

本节我们学习`Object.freeze`相关知识，它的作用是**冻结对象（包括数组）**。

在冻结之后，我们无法对它进行赋值等操作：

```js
let person {
    prop1: 123
}
Object.freeze(person)
person.prop1 = "hhhh"
console.log(person.prop1) // 123
```

我们可以看到赋值是不生效的，那么看到这，我们很容易想到`const`的作用也是不允许变量重新赋值

## 区别

那么`Object.freeze`和`const`有什么区别吗？

- `Object.freeze`返回的是一个不可变的对象，这就意味着我们无法添加、删除或更改对象的任何属性
- `const`则是防止变量重新分配，你`const`的变量，无法指向一个新的对象

我们用下面的例子解释一下：

```js
let person {
    prop1: 123
}
Object.freeze(person)
person = { prop2: 456 }
console.log(person) // { prop2: 456 }
```

这就说明了，`Obect.freeze`只冻结了对象，不会冻结变量，你将变量指向新对象，输出的就是新的。

也就是我们虽然无法修改这个对象，但可以将保存这个对象的引用地址的变量指向新的对象。

## 注意

还需要注意的是`Obejct.freeze`仅能冻结对象的当前层级属性，换而言之，如果对象的某个属性也是一个对象，那么这个内部对象并不会被`Object.freeze`冻结。

```js
let a = {
	name: 'su',
	data: {
		age: 18,
		study: 'js',
	},
}
Object.freeze(a)
a.name = 'chen'
a.data.age = 20
console.log(a.name) // su 当前层级被冻结, 上面修改未生效
console.log(a.data.age) // 20 未被冻结, 上面修改成功
```

这个例子就说明了`a`里的`data`属性，`data`也是一个对象，下面冻结`a`但内部对象没有被冻结。

## 手写深冻结

那么前面`Object.freeze`只能冻结当前的，嵌套的对象无法冻结，因此我们就手写实现一个深冻结：

思路其实就是遍历对象，然后冻结，如果遇到的属性也是对象，就再次遍历冻结。

```js
function deepFreeze(obj) {
	// 取回定义在 obj 上的属性名
	let propNames = Object.getOwnPropertyNames(obj)
	// 在冻结自身之前冻结属性
	propNames.forEach(function (name) {
		let prop = obj[name]
		// 如果 prop 是一个对象，冻结它
		if (typeof prop == 'object' && prop !== null) {
			deepFreeze(prop)
		}
	})
	// 冻结自身
	return Object.freeze(obj)
}
```

其实就是取到所有属性名，然后遍历，遇到对象就递归调用，没遇到就会返回冻结后的对象。

我们就将上面的例子拿来试试：

```js
let a = {
	name: 'su',
	data: {
		age: 18,
		study: 'js',
	},
}
deepFreeze(a)
a.name = 'chen'
a.data.age = 20
console.log(a.name)
console.log(a.data.age)
```

把冻结换成我们的深冻结，然后运行查看，可以看到两次修改都没有生效，证明冻结成功：

![image-20240828205436004](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240828205436004.png)

> 当然这里如果`a`对象属性引用自身会出现栈溢出问题，具体可以用 Map 解决，类似之前的深拷贝，就不细讲了。
