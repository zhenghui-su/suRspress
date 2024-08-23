# 手写实现 Promise.race 方法

本节我们手写实现`Promise.race()`方法，它也是接收一个 Promise 数组，并返回一个新的 Promise，它会在传入的数组中执行，任何一个成功或失败就会立即解析或拒绝。说简单点，传入的 Promise 数组，第一个完成的决定`race`返回的 Promise

具体的例子在之前的章节有讲，现在我们来看看如何实现它。

还是定义一个`race`方法，返回一个新的 Promise：

```js
function race(promises) {
	return new Promise((resolve, reject) => {})
}
```

然后在这个 Promise 内部，根据刚刚的所讲，它的状态取决于数组中第一个执行结束的 Promise 状态，无论是成功还是失败，都可以决定。

因此我们的逻辑就是遍历数组，最先执行结束的 Promise 来决定`race`的结果：

```js
function race(promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((promise) => {
			Promise.resolve(promise)
				.then((value) => {
					resolve(value)
				})
				.catch((error) => {
					reject(error)
				})
		})
	})
}
```

这里可能有同学会疑问，为什么这样可以保证是第一个执行完成的状态？

这涉及 Promise 的状态只能改变一次，当我们遍历 Promise 数组然后执行它的时候，第一个执行完成的状态会立即被`then`或者`catch`执行，然后就改变了`race`的 Promise 状态。后面无论有几个 Promise 都不会改变这个`race`中的 Promise 状态。

因此第一次完成的改变了`race`的 Promise 状态，后面即使再执行`then`中的`resolve`或`catch`中的`reject`，都无法改变这个`return new Promise`的状态

至此我们就完成了`race`方法，我们可以试一下：

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
race([p1, p2])
	.then((value) => {
		console.log("第一个执行的Promise resolved了")
		console.log("Value:", value)
	})
	.catch((error) => {
		console.log("第一个被拒绝的Promise返回了错误", error)
	})
```

现在 p1 是最先执行完成的，我们来看一下：

![image-20240823174300220](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240823174300220.png)

然后我们把 p1 中的`resolve`改成 `reject`，再次运行，发现成功`catch`：

![image-20240823174403683](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240823174403683.png)

至此，我们就手写实现了一个简易的`Promise.race`方法。
