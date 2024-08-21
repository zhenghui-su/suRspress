# WeakMap

WeakMap 是与垃圾回收机制对应的一个重要知识点，与之关联的还有 WeakSet。

WeakMap 是一种键值对的集合，类似 Map，但其中的键是弱引用，**只能是对象**，并且值可以是任意类型，当键对象被**回收**时候，与之关联的值也会被**自动清除**。

## 键只能是对象

概念上很难理解，我们根据代码来解释，先看正常的 Map 使用：

```js
const map = new Map()

const key1 = "key1"
const key2 = 123
const key3 = { name: "su" }

map.set(key1, "value1")
map.set(key2, "value2")
map.set(key3, "value3")

console.log(map.get(key3)) // 输出 value3
```

然后我们将`new Map()`改为`new WeakMap()`：

```js
const weakMap = new Map()

const key1 = "key1"
const key2 = 123
const key3 = { name: "su" }
// 使用非对象作为键，会引发 TypeError 报错
weakMap.set(key1, "value1") // TypeError
weakMap.set(key2, "value2") // TypeError
// 使用对象作为键
weakMap.set(key3, "value3")

console.log(map.get(key3)) // 输出 value3
```

WeakMap 只能用对象作为键，其他的基本类型会报错。

## 键是弱引用

再来看，WeakMap 中，键是弱引用，因此**不会阻止**关联的对象被垃圾回收，而在 Map 中，键是强引用，会**阻止**关联的对象被垃圾回收。

我们可以来看一下代码：

```js
const weakMap = new WeakMap()
const map = new Map()

let key1 = { name: "su" }
let key2 = { name: "chen" }

weakMap.set(key1, "value1")
map.set(key2, "value2")
```

这其中，如果`key1`指向了别的对象，那么`{ name:  "su" }`将会进入垃圾回收，因为 WeakMap 是弱引用，在垃圾回收中它不会计算 WeakMap 对这个的引用，因此不会阻止回收，而如果是 Map，`{ name: "chen" }`则会被阻止，因为它是强引用。

## 键无法遍历

WeakMap 与 Map 还有个区别就是它的键无法使用`forEach`和`keys()`来遍历：

```js
const map = new Map()
let key1 = { name: "su" }
let key2 = { name: "chen" }
map.set(key1, "value1")
map.set(key2, "value2")
// 使用forEach遍历Map
map.forEach((key, value) => {
	console.log(key, value)
})
// 使用keys遍历Map
for (const key of map.keys()) {
	console.log(key, map.get(key))
}
```

这里普通的 Map 我们可以通过两种方式来遍历，而换成 WeakMap 会报错：

```js
const weakMap = new WeakMap()
let key1 = { name: "su" }
let key2 = { name: "chen" }
weakMap.set(key1, "value1")
weakMap.set(key2, "value2")
// 使用forEach遍历WeakMap,会抛出 TypeError
weakMap.forEach((key, value) => {
	console.log(key, value)
})
// TypeError: weakMap.forEach is not a function
// 使用keys遍历WeakMap,会抛出 TypeError
for (const key of weakMap.keys()) {
	console.log(key, weakMap.get(key))
}
// TypeError: weakMap.keys is not a function
```

所以我们无法通过这两种方法来遍历。那么为什么会报错，其实也是因为它的特性，它的键是弱引用，不会计算进垃圾回收中，所以 WeakMap 并不知道它的键是否已经被垃圾回收了，因此就报错。

## 使用场景

### 引用 DOM 元素

WeakMap 的第一个场景就是引用 DOM 元素，我们先看普通 Map 使用：

```js
let btn1 = document.getElementById("btn")
const map = new Map()
map.set(btn1, 0)
btn1.addEventListener("click", () => map.set(btn1, map.get(btn1) + 1))
```

这个 Map 就是存储这个 button 点击的次数，每次点击的时候 +1。

> `document.getElementById("btn")`就称为`button object`

那么它有什么问题呢？首先我们有一个`btn1`指向了`button object`，然后还有一个 Map 的 `key1` 也指向`button object`，所以这个`button object`它的引用次数为 2。

但是当我们不再需要这个对象即不需要`button object`时，`btn1`可以指向别的值，而 Map 中的`key`依旧指向着这个`button object`，引用一直存在，因此`button object`不会进入垃圾回收

所以我们可以使用 WeakMap 来解决：

```js
let btn1 = document.getElementById("btn")
const weakmap = new WeakMap()
weakmap.set(btn1, 0)
btn1.addEventListener("click", () => weakmap.set(btn1, weakmap.get(btn1) + 1))
```

在换成 WeakMap 后，由于它是弱引用，因此不会阻止垃圾回收，在`btn1`指向别的值之后，`button object`就没有引用，进入了垃圾回收。

### 实现对象的缓存

我们来看一个例子：

```js
let apples = [3, 4, 5]
function computeTotalPrice(basket) {
	let total = 0
	console.log("计算苹果总价")
	basket.forEach((itemPrice) => (total += itemPrice))
	return total
}
let p1 = computeTotalPrice(apples)
let p2 = computeTotalPrice(apples)
let p3 = computeTotalPrice(apples)
```

这里会输出三次计算苹果总价，因为调用了三次函数，那么我们可以优化它，在每次计算后将总价放入一个缓存中，在遇到一样的情况下，直接从缓存取，而不在重新循环计算。

我们使用 WeakMap 来做缓存：

```js
let apples = [3, 4, 5]
const cache = new WeakMap()
function computeTotalPrice(basket) {
	if (cache.has(basket)) {
		console.log("从缓存取无需重复计算")
		return cache.get(basket)
	} else {
		let total = 0
		basket.forEach((itemPrice) => (total += itemPrice))
		cache.set(basket, total)
		return total
	}
}
let p1 = computeTotalPrice(apples)
let p2 = computeTotalPrice(apples)
let p3 = computeTotalPrice(apples)
```

这样子，就不会出现重新计算，减少消耗资源。

那么为什么实现这个缓存，不能用 Map 呢，还是上面的引用问题：

这里我们计算的是`apples`这个数组，如果后面我们不再需要这个`apples`变量，那么`[3, 4, 5]`应该需要进入垃圾回收，如果使用 Map，它的 key 指向了`[3, 4, 5]`，由于是强引用，会阻止垃圾回收，就会出现问题，而使用 WeakMap，它的 key 是弱引用，不会阻止`[3, 4, 5]`进入垃圾回收。
