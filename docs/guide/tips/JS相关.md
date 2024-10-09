# JS相关

### 类型检测和快速区别

#### JS有几种基础数据类型？几种新增？*

JS 有 8种基础数据类型：undefined、null、boolean、number、string、symbol、bigInt、object

ES6 之后新增的为 symbol 和 bigInt：

- symbol：独一无二且不可变，用来解决变量冲突和覆盖
- bigInt：任意精度整数，安全地存储和操作大的数据，即便超出了number的安全整数范围

#### 基础数据类型通常如何进行分类？使用起来有什么区别？使用过程中如何区别？**

可以分为原始数据类型和引用数据类型，引用数据类型只有object，原始数据类型有剩下的7个。

使用的区别是原始类型直接赋值，不存在引用关系，而引用类型相反。

存储位置的区别是原始类型存储在栈内存中，且存储的是真实的值，而引用类型，真实对象存储在堆内存中，变量保存了堆内存中的地址，这个地址保存在栈内存之中。

#### 如何进行类型区别判断？几种对类型做判断区分方式？*

- `typeof`：它有问题在于无法区别`null`和`object`，`typeof null`返回`object`，并且无法区分引用类型的相关比如数组和对象
- `instanceof`：返回布尔，判断构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。可以通过`Symbol.hasInstance`自定义instanceof在某个类上的行为
  - 说说或手写实现instanceof的原理实现 ***

```js
function myInstance(left, right) {
    // 获取对象原型
    let _proto = Object.getPrototypeOf(left);
    // 构造函数的prototype
    let _prototype = right.prototype;
    while(true) {
        if (!_proto) {
            return false;
        }
        if (_proto === _prototype) {
            return true;
        }
        _proto = Object.getPrototypeOf(_proto);
    }
}
```

- 通过构造函数判断

```js
(2).constructor === Number // true
([]).constructor === Array // true
```

该方法的隐患在于`constructor`代表的是构造函数执行的类型，构造函数可以被修改

```js
function Fn() {}
Fn.prototype = new Array()
var f = new Fn()
```

- 通过`Object.prototype.toString().call()`来判断

```js
let a = Object.prototype.toString
a.call(2) // [object Number]
a.call([]) // [object Array]
```
这里为什么要用`call`？不能`obj.toString()`吗？**

因为需要保证`toString`是Object上的原型方法，因为`toString`是可以被改写的，调用的时候优先调用本对象属性。

=> 当对象中有某个属性和Object的属性重名时，使用顺序就是优先使用对象本身？那么如果需要优先使用Object属性，就是直接用`Object.`然后用`call`来调用

### 类型转换

#### isNaN和Number.isNaN的区别？**

`isNaN`包含了一个隐式转换，它接收参数，会尝试将参数转成number类型，任何不能被转为number类型的参数都会返回 true，会导致非数字值也会返回`true`，比如`isNaN(aaa)`

`Number.isNaN`不会类型转换，接收参数后，会判断参数是否为数字，然后再判断是否为`NaN`

#### 既然说到了类型转换，有没有其他的类型转换场景？***

- 转为字符串：
  - null 和 undefined => `'null'` 和 `undefined`
  - boolean => `true`和`false`
  - number => `'数字'` 大数据会转为带有指数形式
  - symbol => `'内容'`
  - 普通对象 => `[object Object]`

- 转为数字：
  - undefined => NaN
  - null => 0
  - boolean => true | 1  false | 0
  - string => 包含非数字的值转为 NaN 空字符串 0 纯数字字符串转为数字值
  - symbol => 报错
  - 对象 => 先转为原始类型(依次调用`Symbol.toPrimitive`、`valueOf`、`toString`)，转不成报错，能转根据转换的基本类型然后按上面规则转换
- 转为布尔：
  - undefined | null | false | +0 -0 | NaN | "" 都 => false
  - 其余都为 true

#### 原始数据类型如何具有属性操作的？***

前置知识：js的包装类型

原始类型，在调用属性和方法的时候，js会在后台隐式地将基本类型转换为对象

```js
let a = 'aaa'
a.length; // 3
// js在收集阶段
Object(a);// String { 'aaa' }
// 去包装
let b = Object(a)
let c = b.valueOf() // 'zhaowa'
```

说说下面代码执行结果？

```js
let a = new Boolean(false)
if (!a) {
    console.log('hello world')
}
```

结果是不输出，此时 a 的值不是 false，而是一个对象，对一个对象取反为false，因此不输出

### 数组操作的相关问题

#### 数组的操作基本方法？如何使用？*

- 转换方法：`toString()`、`toLocalString()`、`join()`
- 尾操作：`pop()`、`push()`
- 首操作：`shift()`、`unshift()`
- 排序：`reverse()`、`sort()`
- 连接：`concat()`
- 截取：`slice()`
- 插入：`splice()`
- 索引：`indexOf()`、`lastIndexOf()`
- 迭代方法：`every()`、`some()`、`filter()`、`map()`、`forEach()`
- 归并：`reduce()`、`reduceRight()`

### 变量提升和作用域

#### 谈谈对于变量提升以及作用域的理解？

现象：无论在任何位置声明的函数、变量都被提升到模块、函数的顶部

JS实现原理：

- 解析：检查语法、预编译，代码中即将执行的变量和函数声明调整到全局顶部，并且赋值为 undefined，然后加上下文、arguments、函数参数等等

  - 因此诞生了两个上下文：

    - 全局上下文：变量定义，函数声明

    - 函数上下文：变量定义，函数声明，this，arguments

- 执行：随后执行阶段，按照代码顺序从上而下逐行运行

变量提升的存在意义？

- 提高性能：解析引用提升了性能，不需要执行到时重新解析
- 更加灵活：让我们可以先使用后定义，比如代码的流程不断掉，函数先用，然后在下面定义

在ES6中提出了`let`、`const`，取消了变量提升机制

### 闭包

#### 什么是闭包？闭包的作用？*

在一个函数可以记住其外部变量并可以访问它，这就叫闭包，在js中，每个运行的函数的代码块以及整个脚本，都有一个词法环境，它是内部隐藏的关联对象。

词法环境由环境记录和对外部词法环境的引用组成，当代码要访问一个变量时，首先会搜索内部词法环境，然后搜索外部环境，直到全局词法环境。所有函数在诞生的时候都会记住创建它们的词法环境，即都有一个`[[Environment]]`的隐藏属性，保存了对创建该函数的词法环境的引用。

因此闭包中，我们访问某个变量，它会先搜索自己的词法环境，然后搜索外部，直到全局。

闭包的作用：

- 跨作用域，创建私有变量
- 由于变量还在闭包中，因此变量无法被回收

#### 闭包经典题目结果和改造方式？*

```js
for(var i = 1; i < 9; i++) {
    setTimeout(function a() {
        console.log(i)
    }, i * 1000)
}
// 利用闭包解决
// 立即执行函数创建独立作用域，i作为参数传入
// 此时里面的j就是闭包，它访问了外部词法环境的i
for(var i = 1; i < 9; i++) {
    (function(j) {
		setTimeout(function a() {
        	console.log(j)
    	}, i * 1000)
    })(i)
}
// 利用作用域 let
for(let i = 1; i < 9; i++) {
    setTimeout(function a() {
        console.log(i)
    }, i * 1000)
}
```

### ES6

#### const对象属性可以修改吗？new一个箭头函数会发生什么呢？**

const 只保证指针固定不变，而指向的数据结构属性无法控制变化。

new 执行过程：

- 创建一个对象
- 构造函数作用域赋给新对象（即原型等）
- 指向构造函数后，构造函数中的this指向该对象
- 返回一个新对象

箭头函数没有prototype，没有独立的this指向，它不能用作构造函数，使用new调用会报错

#### JS ES 内置对象有哪些？**

- 值属性类：Infinity、NaN、undefined、null
- 函数属性：`eval()`、`parseInt()`
- 对象：Object、Function、Boolean、Symbol、Error
- 数字：Number、Math、Date
- 字符串：String、RegExp
- 集合：Map、Set、WeakMap、WeakSet
- 抽象控制：Promise
- 映射：Proxy、Reflect

### 原型和原型链

#### 简单说说原型原型链理解？*

JS中，对象有一个隐藏内部属性`[[Prototype]]`，它要么为null、要么为对另一个对象的引用，该对象就被称为原型。

当我们读取对象的某一个缺失的属性时，JS会自动从原型中获取到属性，属性`[[Prototype]]`是内部且隐藏的，不过我们可以设置它，比如特殊属性`__proto__`

> 不过需要注意，`__proto__`是内部属性`[[Prototype]]`的getter/setter，现代JS更推荐我们使用`Object.getPrototypeOf/Object.setPrototypeOf`来去get/set原型。

其中通过构造函数实例的对象，它的原型指向了构造函数的prototype属性，prototype属性是一个常规对象，每个函数都会有，默认的prototype是一个只有属性`constructor`的对象，属性`constructor`指向函数本身。

通过这种原型保存另一个对象的引用，最终形成了一种链式结构，即原型链。

#### 继承方式？**

- 原型链继承
- 构造函数继承
- 组合继承
- 寄生组合继承

### 异步编程

#### 有哪些异步执行方式？*

- 回调函数：容易形成回调地狱
- Promise：通过then 链式调用，但容易产生语义不明确
- generator：需要考虑如何控制执行
- async/await：语法糖，通过它可以在不改变同步书写习惯的前提下进行异步处理

#### 聊聊Promise的理解？*

它是一个对象，表示异步操作最终的完成或失败以及其结果值

- 有三个状态：pending | resolved | rejected

- 有两个过程：pending => resolved  pending => rejected 过程不可逆

Promise缺点：无法取消，无细分状态

### 内存和浏览器执行相关

#### 简单说说对垃圾回收的理解？*

JS具有自动垃圾回收机制，会找到不再使用的变量，释放其占用的内存空间。其中通过引用计数法和标记清除法来回收。

#### 现代浏览器如何处理垃圾回收？**

基本上都通过引用计数法和标记清除法来，会在其基础上改进优化，比如V8 的垃圾回收策略采用分代式垃圾回收机制，新生代垃圾回收器采用并行回收提高效率，而老生代垃圾回收器采用并行回收、增量标记与惰性回收、并发回收这三个策略融合实现。

老生代主要采用**并发标记**，主线程执行 JS 时候，辅助线程也同时执行标记操作（标记操作全由辅助线程完成），标记完成后，再执行**并行清理操作**（主线程在执行清理操作，辅助线程也在同时执行），同时，清理的任务会采用**增量的方式**分批在各个 JS 任务之间执行。

#### 减少垃圾的方案？***

- 数组优化：清空数组时，赋值一个[] 替换为 length为0

- 对象优化：对象尽量复用，减少深拷贝
- 函数优化：循环中的函数表达式，尽量统一放在外面
