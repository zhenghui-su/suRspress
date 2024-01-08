## 16-events 事件触发器

### EventEmitter

Node.js 核心 API 都是采用**异步事件驱动架构**

简单来说就是通过有效的方法来监听事件状态的变化，并在变化的时候做出相应的动作。

```js
fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
process.on('xxx', () => {});
```

举个例子，你去一家餐厅吃饭，这个餐厅就是一个`调度中心`，然后你去点饭，可以理解注册了一个事件`emit`,然后我们等候服务员的喊号，喊到我们的时候就去取餐，这就是监听了这个事件`on`

### 事件模型

Nodejs 事件模型采用了，**`发布订阅设计模式`**

![image-20231027215124525](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027215124525.png)

当一个发布者有新消息时，就将这个消息发布到调度中心。调度中心就会将这个消息通知给所有订阅者。这就实现了发布者和订阅者之间的解耦，发布者和订阅者不再直接依赖于彼此，他们可以独立地扩展自己

### 代码案例

新建一个文件，输入如下代码，

```js
const EventEmitter = require('events');

const event = new EventEmitter();
//监听test事件
event.on('test', (data) => {
  console.log(data);
});

event.emit('test', 'susususu'); //派发事件
```

监听消息数量默认是 10 个，下面的代码超出了 10 个但只会输出 10 个

```js
const EventEmitter = require('events');

const event = new EventEmitter();

event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});

event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});
event.on('test', (data) => {
  console.log(data);
});

event.emit('test', 'susususu');
```

如何解除限制？调用 `setMaxListeners` 传入数量

```js
event.setMaxListeners(20);
console.log(event.getMaxListeners()); // 获取，输出20
```

只想**监听一次**，使用`once`监听，即使`emit`派发多次也只触发一次

```js
const EventEmitter = require('events');

const event = new EventEmitter();
event.setMaxListeners(20);
event.once('test', (data) => {
  console.log(data);
});

event.emit('test', 'susususu1');
event.emit('test', 'susususu2');
```

如何取消侦听？使用`off`

```js
const EventEmitter = require('events');

const event = new EventEmitter();

const fn = (msg) => {
  console.log(msg);
};
event.on('test', fn);
event.off('test', fn);

event.emit('test', 'susususu1');
event.emit('test', 'susususu2');
```

### 使用地方

**`process`**的底层用到了`events`的模块

![image-20231027215433241](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027215433241.png)

打开 nodejs 源码，搜索 `setupProcessObject` 这个函数

![image-20231028003637462](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231028003637462.png)

1. 它首先引入`event`模块
2. 获取`process`的**原型对象**
3. 将`evnet`的**原型对象**设置给了`process`的**原型对象**并且重新绑定上下文
4. 将`process`挂载到`globalThis`，所以我们可以全局访问这个 API

> 我们给`fn`的原型上添加了一个属性`test`，我们如何读到原型上的属性呢？如下
>
> 通过`Object.getPrototypeOf()`方法就可以访问，上面的源码就用到了

```js
let fn = function () {};
fn.prototype.test = 111;
let a = new fn();
console.log(Object.getPrototypeOf(a)); // 输出 { test: 111 }
```

> 我们如何把`b`原型上的属性嫁接到`a`原型呢？通过`Object.setPrototypeOf()`方法

```js
let fn = function () {};
let fn2 = function () {};
fn.prototype.test = 111;
fn2.prototype.test = 666;
let a = new fn();
let b = new fn2();
Object.setPrototypeOf(a, b);
console.log(a.test); // 输出 666
```
