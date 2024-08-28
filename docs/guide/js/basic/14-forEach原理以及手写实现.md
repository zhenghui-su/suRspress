# forEach 原理以及手写实现

为什么要单独将`forEach`拿出来讲，因为它比较特殊，无法通过`break`等方式来跳出循环。

我们可以先看这个代码，它的结果是什么？或者说这个循环会循环几次呢？

```js
let numbersOne = [1, 2, 3]
numbersOne.forEach((number, index) => {
	console.log(number)
	numbersOne.push(number + 3)
})
console.log('结果', numbersOne)
```

我们运行后会发现只输出了三次`number`，即这个循环只循环了 3 次，为什么呢？

### 易错点一

这就和`forEach`的实现原理有关了，可以根据 ECMA 规范来实现，这块就不贴图了。

具体思路就是先获取长度 len 然后设置 k，从 0 遍历到 len，每次循环时执行传入的回调函数。

根据这个思路我们就可以自己写一个`forEach`了：

```js
Array.prototype.myForEach = function (callback, thisArg) {
	if (this === null || this === undefined) {
		throw new TypeError('this is null or undefined')
	}
	let o = this
	let len = o.length
	if (typeof callback !== 'function') {
		throw new TypeError(callback + ' is not a function')
	}
	for (let k = 0; k < len; k++) {
		if (k in o) {
			callback.call(thisArg, o[k], k, o)
		}
	}
	return undefined
}
```

所以根据它我们就知道，循环的次数 length 在循环**开始之前**就已经确定，因此即使在循环的过程中增加数组的长度，循环的次数也**不会改变**。

### 易错点二

那么在遍历中增加不会改变循环次数，如果删除数组元素，会影响吗，根据上面的结论是不影响的

那么我们看看下面的代码：

```js
let numbersOne = [1, 2, 3]
numbersOne.forEach((number, index) => {
	console.log(number)
	numbersOne.pop()
})
console.log('结果', numbersOne)
```

运行，我们会发现只循环了两次，只输出了两次，发现被影响了：

![image-20240828214855471](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240828214855471.png)

那么就和上面的结论冲突了，因此这里就是第二个易错点，它和上面的原理也是有关的。

因为在 ECMA 的规范中，`forEach`需要判断这个索引是否在数组中，如果不是就不能调用调

我们根据这个在我们的`forEach`中加上一个打印，看看`k`的值以及它是否在数组中

```js
Array.prototype.myForEach = function (callback, thisArg) {
	if (this === null || this === undefined) {
		throw new TypeError('this is null or undefined')
	}
	let o = this
	let len = o.length
	if (typeof callback !== 'function') {
		throw new TypeError(callback + ' is not a function')
	}
	for (let k = 0; k < len; k++) {
		console.log('k的值', k, 'k是否在数组中', k in o)
		if (k in o) {
			callback.call(thisArg, o[k], k, o)
		}
	}
	return undefined
}
```

然后运行，结果如下：

![image-20240828215433356](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240828215433356.png)

因此，我们在第一次循环中`pop`把索引 2 从数组中删除了，后面自然就无法找到然后执行了。
