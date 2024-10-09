# Node相关

## 如何理解node中模块的概念

### 软件工程的本质是什么？

- 管理数据 - 管理变量
  - DB：lesson - blob / chatList -- chat -- name， text
  - BE：数据的组织，查询
  - FE：runtime 的时间，管理变量
    - 管理变量的生命周期 [model] 和展示形式 [view]
- 进行通信

什么是模块？模块就是通过函数作用域，把变量和函数进行隔离，其中闭包就是他的基石

### 模块化的方案

ESM、CommonJS、AMD、CMD、UMD

## 简述require的模块加载机制

CommonJS 遵循文件直接获取，node 是 CommonJS 的实现，在 node 端，可以直接`fs.read`

```js
// index.js
// const { xxx } = require('xxx')
// module.exports = { xxx, xxx, xxx }
const { readFileSync } = require('fs');
const { Script } = require('vm');
function my_require(filename) {
    const fileContent = readFileSync(path.resolve(__dirname, filename), 'utf-8');
    const warpped = `(function(require, module, exports) {
    	${fileContent}
    })`
    // 运行这个字符串
    const script = new Script(warpped, {
        filename: 'index.js',
    });
    
    const module = {
        exports: {}
    }
    const func = script.runInThisContext();
    func(my_require, module, module.exports);

    return module.exports;
}
global.my_require = my_require;

my_require('./module.js') // 打印 hello
// module.js
console.log('hello')
```

### 为什么浏览器端不能require？

很简单，require的模块加载机制是通过文件的读取和script上下文执行实现的，浏览器端不能读取

## 如何描述异步 I/O 的流程

### 什么是阻塞/非阻塞

系统在接收输入的时候，再到输出的过程中，能不能接收其他的输入？

问题：多个任务执行时，存在 I/O 和 CPU 计算任务，如何合理地利用资源？

#### 方案1：多线程

线程之间切换，同时需要加锁

#### 方案2：单线程 + 异步 I/O

- I/O 不能阻塞CPU的执行
- 不带来锁的问题
- 性能要好
- 因此采用轮询，做完异步操作直接通知即可

## 如何理解node的事件循环流程

如图：

![image-20241004230754603](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20241004230754603.png)

看个题分析：

```js
async function async1() {
    console.log('async1 started');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(() => {
    console.log('setTimeout0');
    setTimeout(() => {
        console.log('setTimeout1');
    }, 0);
    setImmediate(() => {
        console.log('setImmediate');
    })
}, 0);

async1();
process.nextTick(() => {
   console.log('nextTick'); 
})
new Promise((resolve) => {
    console.log('promise1');
    resolve();
    console.log('promise2');
}).then(() => {
    console.log('promise.then')
})
console.log('script end')
```

一个个分析：

- 同步代码打印 script start
- 然后先跳过定时器，看下面的代码执行了 async1，因此执行它
- 然后async1里面同步代码先打印 async1 started，然后await因此需要先执行，打印async2
- 随后看Promise，它同步先打印 promise1，然后打印 promise2，其他产生了微任务是后面执行
- 随后最外面同步代码打印 script end
- 然后进入处理微任务，process的优先级比promise高，因此先打印 nextTick
- 随后上面的await async2 产生的微任务开始执行打印 async1 end
- 然后后面的Promise.then 产生的微任务执行，打印 promis.then
- 最后看setTimeout，先打印setTimeout0
- 然后又嵌套一层，这个任务在下一个循环执行，因此先打印下面的 setImmedaite
- 最后打印setTimeout1

## 简述V8垃圾回收机制

V8 的垃圾回收策略采用分代式垃圾回收机制，新生代垃圾回收器采用并行回收提高效率，而老生代垃圾回收器采用并行回收、增量标记与惰性回收、并发回收这三个策略融合实现。

老生代主要采用**并发标记**，主线程执行 JS 时候，辅助线程也同时执行标记操作（标记操作全由辅助线程完成），标记完成后，再执行**并行清理操作**（主线程在执行清理操作，辅助线程也在同时执行），同时，清理的任务会采用**增量的方式**分批在各个 JS 任务之间执行。

详见：[V8对GC的优化](https://www.xiaosu2003.cn/guide/js/garbageCollection/4-V8%E5%AF%B9GC%E7%9A%84%E4%BC%98%E5%8C%96.html#%E5%88%86%E4%BB%A3%E5%BC%8F%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6)

## 常见内存泄漏的原因以及排查方法

- 全局变量
- 函数闭包过多
- 事件监听

检测方法：

- heapdump （npm包）
- chrome DevTools 内存快照

## WebSocket和http的区别

WebSocket是一个双向的通信协议，客户端可以通过 upgrade 一个http升级为WebSocket，和服务端保持长连接

http是一个在TCP协议之上的单向协议

## 简述对于node多进程架构的理解

Master - Worker 的一个模式，即主从模式。通过fork复制出一个独立的进程，通过libuv进行提供

## 如何创建子进程？以及子进程crash后如何自动重启

通过 spawn、fork、exec、execfile 四种方式

详见：[子进程child_process](https://www.xiaosu2003.cn/guide/node/14-child_process%20%E5%AD%90%E8%BF%9B%E7%A8%8B%20%E6%A0%B8%E5%BF%83API.html#14-child_process-%E5%AD%90%E8%BF%9B%E7%A8%8B-%E6%A0%B8%E5%BF%83-api)

- spawn

```js
// 在父进程中
const cp = spawn('node', 'child.js', {
    cwd: path.resolve(process.cwd(), './worker'),
    stdio: ['pipe', 'pipe', 2]
});
// 在子进程中
process.stdout.write('sum:' + sum)
```

- fork

```js
// master.js
const child_process = require('child_process');
const processMaster = child_process.fork(__dirname + '/child.js');
processMaster.send('hello');
processMaster.on('message', (str) => {
    console.log('parent:', str);
});
// child.js
process.on('message', (str) => {
    console.log('child:', str);
    process.send('hello');
});
```

如何重启

- 一般在生产环境中使用 pm2 进行进程守护，原理是父进程监听子进程的退出事件然后重启
- 进行健康检查，定时启动一个进程查询目标进程的健康状态

## 简述koa中间件原理

```js
function discount(ctx, next) {
    console.log('开始打折');
    next(ctx * 0.8);
    console.log('打折完毕');
}
function num(ctx, next) {
    console.log('开始计算10件');
    next(ctx * 10);
    console.log('10件计算完毕');
}
function express(ctx, next) {
    console.log('不包邮');
    next(ctx + 12);
    console.log('打包完毕');
}

function compose(args) {
    let result;
    return function (ctx) {
        let i = 0;
        let dispatch = function(i, ctx) {
            let fn;
            if (i < args.length) fn = args[i];
            if (i === args.length) {
                result = ctx;
                return;
            }
            return fn(ctx, dispatch.bind(null, ++i))
        }
        dispatch(0, ctx);
    	return result;
    }
};

const pipe = compose([num, discount, express]);
console.log(pipe(150))
```

