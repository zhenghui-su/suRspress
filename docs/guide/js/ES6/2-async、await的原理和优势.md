# async、await 的原理和优势

首先我们要知道什么是 `async`、`await`

## async 和 await

`async`用于声明一个异步函数，`await`用于等待一个异步方法执行完成，语法上规定，`await`只能出现在`async`函数之中，我们来看下面的例子：

```js
async function fn() {
	return "123"
}
let result = fn()
console.log(result)
```

我们给一个函数加上了`async`关键字，会打印出一个 Promise：

![image-20240822162825275](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822162825275.png)

那么它其实和我们想要的不一样，我们想要`return`的`123`，但给我返回了 Promise

原因是使用了`async`修饰，如果修饰的函数返回的不是 Promise，它会自动包一下。

那么如果我们就是想要这个`return`中的值呢？此时就可以使用`await`，它可以等待这个 Promise 完成，然后返回值

```js
async function fn() {
	return "123"
}
let result = await fn()
console.log(result)
```

![image-20240822162946724](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822162946724.png)

那么`async`是如何将我们的返回值包装成 Promise 对象的呢？其实就是通过`Promise.resolve()`把值给包裹了一下，就会返回了

### 能否单独使用

那么`async`和`await`必须配合使用吗？我们单独使用其中一个会怎么样？

#### 单独使用 async

首先我们来看如果不用`await`，单独使用`async`，要如何获取数据？

```js
async function fn() {
	return "123"
}
let result = fn()
result.then((value) => {
	console.log(value)
})
```

我们需要通过`then`方法，将数据传递进去，然后获取，结果如下，能够获取：

![image-20240822163601872](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822163601872.png)

这就说明了`async`关键字是可以单独使用的，只需通过`then`方法获取数据即可。

#### 单独使用 await

然后我们去掉`async`，单独使用`await`来等待一个我们包装的 Promise：

```js
function fn() {
	return Promise.resolve("123")
}
let result = await fn()
console.log(result)
```

然后运行查看结果，会发现报错：

![image-20240822163851749](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822163851749.png)

浏览器提示`await`只能在`async`修饰的函数使用，那我们改一下：

```js
function fn() {
	return Promise.resolve("123")
}
async function getData() {
	let res = await fn()
	console.log(res)
}
getData()
```

然后运行，没有问题：

![image-20240822164051108](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822164051108.png)

这就证明了`await`不能单独使用，必须和`async`配合使用。

## 优点

### 处理同步和异步错误

那么我们使用`async`和`await`的优点有哪些，它可以使处理同步和异步错误更加方便。

比如下面例子，使用`try/catch`，如果使用 Promise，`try/catch`难以处理`JSON.parse`过程中遇到的问题，因为这个错误发生在 Promise 内部。

```js
const getJSON = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject("网络请求发生错误")
		}, 1000)
	})
}
const makeRequest = () => {
	try {
		getJSON().then((result) => {
			const data = JSON.parse(result)
			console.log(data)
		})
	} catch (err) {
		console.log("try/catch 的catch 结果", err)
	}
}
makeRequest()
```

我们需要注意这个网络请求是错误的，我调用了`reject`，但是`try/catch`是无法捕获这个错误的：

![image-20240822164759397](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822164759397.png)

因为这个是 Promise 内部的错误，所以我们必须通过`Promise.catch`方法来捕获：

```js
const getJSON = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject("网络请求发生错误")
		}, 1000)
	})
}
const makeRequest = () => {
	try {
		getJSON()
			.then((result) => {
				const data = JSON.parse(result)
				console.log(data)
			})
			.catch((err) => {
				console.log("Promise的catch结果", err)
			})
	} catch (err) {
		console.log("try/catch 的catch 结果", err)
	}
}
makeRequest()
```

然后运行查看结果：

![image-20240822164932103](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822164932103.png)

发现成功捕获了，那么有人会疑惑，外面的`try/catch`捕获的又是什么，它捕获的是`try`这个括号内的错误，比如我上面将`reject`换成`resolve`，然后查看：

```js
const getJSON = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(jsonString)
			// reject("网络请求发生错误")
		}, 1000)
	})
}
const makeRequest = () => {
	try {
		getJSON()
			.then((result) => {
				const data = JSON.parse(result)
				console.log(data)
			})
			.catch((err) => {
				console.log("Promise的catch结果", err)
			})
	} catch (err) {
		console.log("try/catch 的catch 结果", err)
	}
}
makeRequest()
```

然后我们查看结果：

![image-20240822165153680](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822165153680.png)

因为`jsonString`不能被`JSON.parse`正确解析，第二个`catch`捕获的就是这个错误。

那么在这个场景下，我们两个`catch`都必不可少，少了哪个，错误都有可能无法捕获，但这样的代码非常的冗余，写多之后就很麻烦，而如果我们使用`async`和`await`就可以解决，我们只改`makeRequest`

```js
const getJSON = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject("网络请求发生错误")
		}, 1000)
	})
}
const makeRequest = async () => {
	try {
		const data = JSON.parse(await getJSON())
		console.log(data)
	} catch (err) {
		console.log("try/catch 的catch 结果", err)
	}
}
makeRequest()
```

然后再次查看，会发现即使是 Promise 内部的错误，我们也可以成功捕获了：

![image-20240822165541460](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822165541460.png)

然后如果是`try`里面的错误，也可以正确捕获：

![image-20240822165657701](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822165657701.png)

这样代码的简洁度大大提高，冗余也减少，代码更加直观了。

### 减少嵌套层数

使用它们的第二个优点就是可以在条件判断中减少嵌套层数，比如下面的代码：

```js
const makeRequest = () => {
	return getJSON().then((data) => {
		if (data.needsAnotherRequest) {
			return makeAnotherRequest(data).then((moreData) => {
				console.log(moreData)
				return moreData
			})
		} else {
			console.log(data)
			return data
		}
	})
}
```

我们通过`getJSON`发送一个网络请求获取到`data`，然后我们会根据`data`里面的信息`needsAnotherRequest`来判断是否发送第二次网络请求，然后返回第二次网络请求的数据。

这个代码看起来没啥问题，但它的嵌套层数其实很多，比如我们在`getJSON`的`then`里面又调用了一次`then`，那么如果第二次请求后又要根据数据请求第三次，就会不断的`if`判断嵌套，形成问题。

我们可以使用`async`和`await`来解决这个问题：

```js
const makeRequest = async () => {
	const data = await getJSON()
	const [needsAnotherRequest] = data
	if (needsAnotherRequest) {
		const moreData = await makeAnotherRequest(data)
		return moreData
	}
	return data
}
```

这样子的代码，减少了大量的`then`，可以让代码更加容易维护。

### 调试中更容易定位错误

我们还是来看一个例子：

```js
const getJSON = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(jsonString)
		}, 200)
	})
}
const getJSON2 = () => {
	const jsonString = "{invalid JSON data}"
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject(jsonString)
		}, 200)
	})
}
const makeRequest = () => {
	return getJSON()
		.then(() => getJSON())
		.then(() => getJSON2())
		.then(() => getJSON())
		.then(() => getJSON())
		.then(() => getJSON())
}
makeRequest().catch((err) => {
	console.log("出现错误, 进入 catch")
	console.log(err)
})
```

我们定义了两个网络请求，来模拟一个成功一个失败，然后`makeRequest`使用`then`的链式调用网络请求，然后运行，查看结果：

![image-20240822171116577](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822171116577.png)

会发现不知道是哪一个网络请求发生的错误，那我们给链式调用上打断点，看是否会知道哪一个的错误：

![image-20240822171354046](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822171354046.png)

在运行到`getJSON2`的时候，查看控制台，会发现是空的，理论上说`getJSON2`是`reject`，会抛出错误，但只有我们所有代码执行完毕后才会打印错误，所以我们难以查看错误来源。

我们可以换成`async`和`await`来解决，请求不变，只改变`makeRequest`：

```js
const makeRequest = async () => {
	await getJSON()
	await getJSON2()
	await getJSON()
	await getJSON()
}
```

此时还是打断点，然后运行，查看：

![image-20240822171834990](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822171834990.png)

然后我们再次点击运行到下一个，会发现退出调试了，因为已经被`catch`捕获了：

![image-20240822171909362](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822171909362.png)

那我们查看一下控制台，发现已经输出了错误，这样我们就知道是`getJSON2`这个网络请求的问题了。

![image-20240822171948360](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822171948360.png)

因此通过`async`和`await`可以在断点调试中更容易定位错误的来源。

## async 和 await 如何捕获异常

大部分场景下，我们都通过`then`和`catch`来处理数据和处理异常：

```js
getJSON()
	.then((res) => {
		const data = JSON.parse(res)
		console.log(data)
	})
	.catch((err) => {
		console.log(err)
	})
```

这个场景下，如果`getJSON`内部出现错误，我们可以通过`catch`来捕获到`getJSON`内部的异常。

那么如果是`async`和`await`，`await`后面的 Promise 执行失败，可以成功捕获吗：

```js
async function fn() {
	let a = await Promise.reject("error")
	console.log(a)
}
fn()
```

我们运行查看结果，会发现没有捕获这个错误：

![image-20240822172704791](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822172704791.png)

这说明`await`只能后面的 Promise 成功时才可以捕获结果，失败则无法捕获错误，那么如何解决？

通过我们前面的例子，我们知道`try/catch`可以捕获`try`中的错误，因此`await`可以写里面：

```js
async function fn() {
	try {
		let a = await Promise.reject("error")
		console.log(a)
	} catch (err) {
		console.log(err)
	}
}
fn()
```

然后运行查看，发现成功捕获了：

![image-20240822172929653](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822172929653.png)
