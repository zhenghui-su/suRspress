# null、undefined、NaN

这节我们详细讲讲这三个的内容。

## null 和 undefined 的区别

我们在执行`null == undefined`的时候，会发现为 true，大部分场景下它们是一致的。

### 最初设计

要区别它们，需要想 JS 最初设计时的考虑，在设计中，`null`表示一个**无**的对象，转为数值时为 0，`undefined`表示一个**无**的原始值，转为数值为 NaN

### 实际运用

但我们实际项目场景中不会这么用，更多时候有如下运用：

#### null

`null`表示**没有对象**，即该处不应该有值，如下：

- 作为函数的参数，表示该函数的参数不是对象
- 作为对象原型链的终点

比如第一个，作为函数的参数，下面的例子，我有年龄但我没有房子，但函数需要传入 house，那么我就传一个 null 进去：

```js
let fn = function (age, house) {
	console.log(age, house);
};
fn(18, null);
```

再比如第二个，对象原型链的终点为 null

```js
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

#### undefined

`undefined`表示**缺少某个值**，即该处应该有一个值，但没有定义，典型用法如下：

- 变量被声明，但没有赋值，就等于 undefined
- 调用函数时候，应该提供的参数没有提供，该参数就等于 undefined
- 对象没有赋值的属性，该属性值为 undefined
- 函数没有任何返回值时，默认返回值为 undefined

下面的代码就展示了这四个用法：

```js
var i;
console.log(i); // undefined

function f(a) {
	console.log(a);
}
f(); // undefined

var obj = new Object();
console.log(obj.name); // undefined

var x = f();
console.log(x); // undefined
```

**总结：**一般开发者手动赋值的为 `null`，忘记赋值的为 `undefined`

## typeof null

为什么`typeof null`的结果为 object，我们知道 null 是一个基本类型，而 `typeof null`的结果却为 object 引用类型，通过`null instanceof Object`结果为 false 得知，null 并不是 Object 的实例，所以这里存在了矛盾问题。

### 机器码

要解决这个问题，我们需要知道 JS 中`typeof`是如何识别类型的，它通过机器码：

| 数据类型    | 机器码标识     |
| ----------- | -------------- |
| 对象 Object | 000            |
| 整数        | 1              |
| 浮点数      | 010            |
| 字符串      | 100            |
| 布尔        | 110            |
| undefined   | -2^31 即全为 1 |
| null        | 全为 0         |

我们可以看到由于`null`的机器码**全为 0** ，由于对象的机器码也是`000`，所以`typeof null`的结果就错误的识别为了 object。

但需要记住，null 是基本类型，只有 null 是属于这个类型的，跟 object 引用类型不同。

## 如何安全获取 undefined

看到这个，我们会问为什么不能直接使用 `undefined`，因为`undefined`是 JS 的一个全局变量，它挂载到 window 对象上，不是一个**关键字**。

这意味着我们可以使用`undefined`来作为一个变量名字：

```js
undefined = 1;
```

这样 undefined 就会被修改，为什么防止 undefined 被修改无法获取，我们可以使用 void

表达式`void __` 没有返回值，因为结果为 undefined，`void` 并不改变表达式的结果，只是让表达式没有返回值，因此我们使用`void 0`可以安全的获取 undefined

```js
let a = void 0;
console.log(a); // undefined
```

## isNaN 和 Number.isNaN

首先我们要记住 NaN 是什么意思，它代表 Not a Number，不是一个数字即非数字

函数`isNaN`接收参数后，会尝试**将参数进行类型转换**，如果**不能转为 number 类型**，就返回 true，因此非数字值传入也可能返回 true，影响 NaN 的判断。

而`Number.isNaN`则**不会进行数据类型的转换**，这种方法对于 NaN 判断更加准确。

我们来看下面的例子：

```js
console.log(isNaN("Hello")); // true 区别
console.log(Number.isNaN("Hello")); // false 区别

console.log(isNaN(NaN)); // true
console.log(Number.isNaN(NaN)); // true

console.log(isNaN(123)); // false
console.log(NumberisNaN(123)); // false
```

总结：`isNaN`只要不能转为 number 类型就返回 true，`Number.isNaN`只对 NaN 返回 true
