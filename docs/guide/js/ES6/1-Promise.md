# Promise

本节我们即将进入异步编程阶段，提到异步编程，我们就需要知道 Promise。

## Promise 对象

Promise 对象代表一个异步操作，它有三种状态：

- pending：进行中
- fulfilled：已成功
- rejected：已失败

Promise 构造函数接收一个函数作为参数，该函数的两个参数分别是 resolve 和 reject

我们可以简单使用：

```js
const promise = new Promise(function(resolve, reject) {
    if (/* 异步操作成功 */) {
        resolve(value)
    }else {
        reject(value)
    }
})
```

假设网络请求成功，就`resolve`把数据传递出去，失败就`reject`把错误消息传递

## 方法

Promise 有常见的五个方法：`then`、`catch`、`all`、`race`、`finally`

### then

当 Promise 执行的内容成功后，调用 resolve，失败调用 reject。那么这里的 resolve 是哪里定义的呢，其实是通过`then`方法，你传给它的。

我们来看一个例子：

```js
const promise = new Promise(function (resolve, reject) {
	setTimeout(function () {
		const userDate = { name: "su" }
		resolve(user)
	}, 1000)
})
promise.then(function (param) {
	console.log(param)
})
```

我们在 Promise 模拟网络请求，然后通过`resolve`传递，那么`resolve`是什么，其实就是下面`then`方法里面的函数，`resolve`就是调用这个函数，同时把`userData`传给它，所以我们可以获取到用户数据。

简单理解，就是我们在 Promise 结束后要干嘛，比如 Promise 请求数据后，我们通过`then`来获取到数据。

### catch

除了`then`之外，Promise 还有一个 `catch`方法，上面我们学到了`resolve`可以通过`then`来定义，那么`reject`呢？就是通过`catch`方法。

我们还是上面的例子，改成`reject`

```js
const promise = new Promise(function (resolve, reject) {
	setTimeout(function () {
		const userDate = { name: "su" }
		reject("网络请求错误")
	}, 1000)
})
promise
	.then(function (param) {
		console.log(param)
	})
	.catch(function (param) {
		console.log("进入了catch方法")
		console.log(param)
	})
```

我们执行，打印结果如下：

![image-20240822153142778](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822153142778.png)

可以看到，请求失败后，执行`reject`，这个`reject`就是`catch`里面的函数，它就是调用这个函数，然后会把信息传递进去。

通过刚刚的学习，我们知道 Promise 的基本用法：无非就是成功执行`resolve`，用`then`来处理后续，失败执行`reject`，用`catch`处理后续。

### all

然后我们假设一个场景，有很多的 Promise，这些 Promise 有的执行 1 秒，有的 2 秒，我想等这些 Promise 都执行成功之后，再使用`then`方法处理后续，怎么做呢？

我们可以通过`all`方法，它可以完成并行任务，它接收一个数组，数组的每一项都是 Promise 对象，当数组中的所有 Promise 都到达 `resolved`时候，`all`方法的状态变为`resolved`，当数组有一个状态为`rejected`，`all`方法状态就为`rejected`

```js
const promise1 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(2)
	}, 1000)
})
const promise2 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(3)
	}, 3000)
})
const promise3 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(1)
	}, 2000)
})
Promise.all([promise1, promise2, promise3]).then((res) => {
	console.log(res)
})
```

比如上面的场景，有三个 Promise，我们可以通过`all`并行完成，等这三个 Promise 都达到`resolve`的时候，才会返回数据。结果如下，没问题：

![image-20240822154012940](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822154012940.png)

但如果有一个变成`reject`，`all`的状态也会是`reject`，用`catch`捕获：

```js
const promise1 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(2)
	}, 1000)
})
const promise2 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(3)
	}, 3000)
})
const promise3 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		reject("3失败")
	}, 2000)
})
Promise.all([promise1, promise2, promise3])
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.log(err)
	})
```

### race

假设有一个场景，我们发送了 3 个请求，我们只需要返回速度最快的请求数据，比如 2 号请求最先返回，那么我们直接返回 2 号的数据结果，不用管 1 号和 3 号了，如何解决？

我们可以使用`race`方法，它和`all`一样，接收数组，每一项都是 Promise，与`all`不同的时候，当最先执行的事件被完成，会直接返回这个 promise 的结果。如果第一个 Promise 对象状态为`resolved`，那么`race`也为`resolved`，反之通样。

```js
const promise1 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		reject(2)
	}, 1000)
})
const promise2 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		reject(1)
	}, 2000)
})
const promise3 = new Promise(function (resolve, reject) {
	setTimeout(function () {
		resolve(3)
	}, 3000)
})
Promise.race([promise1, promise2, promise3])
	.then((res) => {
		console.log(res)
	})
	.catch((err) => {
		console.log("进入了catch")
		console.log(err)
	})
```

我们弄了三个 Promise，最快的是 1 号，它返回`reject`，前面说过`race`只关心最快的，所以它会进入`catch`，打印结果为`2`

![image-20240822155128238](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822155128238.png)

### race 和 all 的区别

`Promise.all`的成功和失败返回不同，成功返回是一个结果数组，失败返回最先`reject`失败状态的值

需要注意`Promise.all`获得成功结果的数组，数据顺序和传入的 Promise 数组顺序一致，这样在遇到发送多个请求，且根据请求顺序获取的使用场景可以用`all`方法解决。

`Promise.race`就是赛跑，传入的 Primise 数组，哪个最快，就返回哪个结果，不管它是否是成功还是失败，当遇到一个东西超过多长时间就不做了，可以用`race`解决。

### finally

通过刚刚的例子，我们知道了`then`和`catch`可以各自捕获，那么假设有一个场景，不管 Promise 调用了`resolve`还是`reject`，我们都希望它能够执行，如何解决？

我们通过`finally`方法，它用于指定不管 Promise 对象最后状态如何，都会执行的操作

> 该方法从 ES2018 引入标准，低版本浏览器可能不支持。

```js
const promise = new Promise((resolve, reject) => {
	reject("网络错误")
})
promise
	.then(function (param) {
		console.log(param)
	})
	.catch(function (param) {
		console.log("进入catch")
		console.log(param)
	})
	.finally(() => {
		console.log("进入了finally")
	})
```

我们可以运行查看，进入了`catch`，同时也会进入`finally`：

![image-20240822160431195](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822160431195.png)

然后我们改成`resolve`，进入了`then`，同时也会进入`finally`：

```js
const promise = new Promise((resolve, reject) => {
	resolve("请求的数据")
})
promise
	.then(function (param) {
		console.log(param)
	})
	.catch(function (param) {
		console.log("进入catch")
		console.log(param)
	})
	.finally(() => {
		console.log("进入了finally")
	})
```

![image-20240822160542611](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822160542611.png)

所以`finally`方法，无论你的 Promise 的状态如何，它都可以进行操作。

## Promise 解决的问题

在 Promise 出现之前，如果需要进行异步操作，一般使用回调函数，但如果有个场景，用 ajax 发一个 A 请求，成功后拿数据，需要给 B 请求，依次嵌套，就会形成回调地狱：

![image-20240822160845467](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240822160845467.png)

这样代码缺点就是后一个请求依赖前面的请求成功，会导致多个请求嵌套，代码不够直观，并且如果后面的请求无需前面的数据，也需要等待前面完成才可以。

在 Promise 之后，我们就可以通过它，利用`then`的链式调用来解决：

```js
function getData(url) {
	console.log()
	return fetch(url).then((response) => response.json())
}

getData("xxx.com/d")
	.then((data) => {
		console.log(data)
		getData("xxx.com/a")
	})
	.then((data) => {
		console.log(data)
		getData("xxx.com/b")
	})
	.then((data) => {
		console.log(data)
		getData("xxx.com/c")
	})
	.catch((err) => {
		console.log(err)
	})
```

这样子，我们每次请求只需要传入接口地址，而上一次的网络请求数据会通过`then`传递下来，这样代码简洁美观，哪里的网络请求有问题，直接查看就知道了。

所以，Promise 有效解决了回调地狱的问题。
