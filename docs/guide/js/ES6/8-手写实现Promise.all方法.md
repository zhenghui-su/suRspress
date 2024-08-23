# 手写实现 Promise.all 方法

本节我们来手写实现`Promise.all()`方法，它接收一个 Promise 对象数组，并返回一个新的 Promise 对象，只有当数组中的**所有 Promise 都成功**完成时候返回执行`then`里面的回调函数，如果**任何一个 Promise 失败**，都会执行`catch`。

具体例子在之前的章节 Promise 已经讲过了，接下来我们来看如何实现它。

首先我们定义函数`all`，同时我们需要知道该方法会返回一个 Promise：

```js
function all(promises) {
	return new Promise((resolve, reject) => {})
}
```

然后我们需要在这个 Promise 内部去依次执行这个数组，等全部 Promise 到达成功时结束，如何知道全部都成功完成呢，就需要一个计数器：

```js
function all(promises) {
	return new Promise((resolve, reject) => {
		let resolvedCount = 0 // 统计有多少个promise达到resolved
	})
}
```

我们还知道，当都达到成功之后，`all`会把所有的值变成一个数组返回：

```js
function all(promises) {
	return new Promise((resolve, reject) => {
		let resolvedCount = 0 // 统计有多少个promise达到resolved
		let results = new Array(promises.length) // 存放所有resolved的值
	})
}
```

接下来我们就可以遍历这个数据，然后依次执行，这里两个结果：

- 如果当前 promise 执行成功, 将 resolve 的值保存到 results
  - 这里还需要判断是否全部执行成功，成功后`resolve`返回 results
- 如果当前 promise 执行失败, 直接进入 catch

```js
function all(promises) {
	return new Promise((resolve, reject) => {
		let resolvedCount = 0 // 统计有多少个promise达到resolved
		let results = new Array(promises.length) // 存放所有resolved的值

		promises.forEach((promise, index) => {
			// 如果当前promise执行成功, 将resolve的值保存到results
			// 如果当前promise执行失败, 直接进入catch
			Promise.resolve(promise)
				.then((value) => {
					resolvedCount++
					results[index] = value
					// 如果所有promise都resolved, 将results传递给resolve
					if (resolvedCount === promises.length) {
						resolve(results)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	})
}
```

至此这个`all`方法就完成了，我们可以写几个用例来测试一下：

```js
let p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve("Promise 1 已经 resolved")
	}, 1000)
})
let p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve("Promise 2 已经 resolved")
	}, 2000)
})
all([p1, p2])
	.then((results) => {
		console.log("所有的Promise都resolved了")
		console.log("Results:", results)
	})
	.catch((error) => {
		console.log("有Promise失败了")
		console.log("Error:", error)
	})
```

先所有的 Promise 是成功的，结果如下，没问题：

![image-20240823172355654](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240823172355654.png)

然后将其中一个改成`reject`，结果如下，成功`catch`了：

![image-20240823172438492](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240823172438492.png)

我们就手写完成了一个简易的`Promise.all()`方法。
