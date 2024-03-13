## 13-process 进程

`process` 是 Nodejs 操作当前进程和控制当前进程的 API，并且是挂载到 globalThis 下面的全局 API

### API 介绍

#### process.arch

`process.arch`返回操作系统 CPU 架构 跟我们之前讲的`os.arch` 一样

值：`'arm'`、`'arm64'`、`'ia32'`、`'mips'`、`'mipsel'`、`'ppc'`、`'ppc64'`、`'s390'`、`'s390x'`、以及 `'x64'`

#### process.argv

`process.argv`获取执行进程后面的参数，返回是一个数组

后面我们讲到命令行交互工具的时候会很有用，各种 cli 脚手架也是使用这种方式接受配置参数例如`webpack`

![image-20231027191228993](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027191228993.png)

#### process.cwd()

`process.cwd()`返回当前的工作目录

> ESM 模式下，`__dirname`无法使用，这个是代替`__dirname`使用的

例如在 `F:\project\node>` 执行的脚本就返回这个目录

![image-20231027191059831](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027191059831.png)

#### process.memoryUsage

`process.memoryUsage`用于获取当前进程的内存使用情况

该方法返回一个对象，其中包含了各种内存使用指标，如 rss（Resident Set Size，常驻集大小）、heapTotal（堆区总大小）、heapUsed（已用堆大小）和 external（外部内存使用量）等

```js
{
    rss: 30932992, // 常驻集大小 这是进程当前占用的物理内存量，不包括共享内存和页面缓存。它反映了进程实际占用的物理内存大小
    heapTotal: 6438912, //堆区总大小 这是 V8 引擎为 JavaScript 对象分配的内存量。它包括了已用和未用的堆内存
    heapUsed: 5678624,  //已用堆大小
    external: 423221, //外部内存使用量 这部分内存不是由 Node.js 进程直接分配的，而是由其他 C/C++ 对象或系统分配的
    arrayBuffers: 17606 //是用于处理二进制数据的对象类型，它使用了 JavaScript 中的 ArrayBuffer 接口。这个属性显示了当前进程中 ArrayBuffers 的数量
  }
```

#### process.exit()

调用 `process.exit()` 将强制进程退出，即使仍有未完全完成的异步操作挂起

下面例子 5 不会被打印出来 因为在 2 秒钟的时候就被退出了

![image-20231027191940126](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027191940126.png)

它还可以监听对应的方法

```js
process.on('exit', () => {
  console.log('进程退出了');
});
```

#### process.kill

`process.kill`与`exit`类似，`kill`用来杀死一个进程，接受一个参数进程 id 可以通过`process.pid`获取

```js
process.kill(process.pid);
```

#### process.env

`process.env`用于读取**操作系统所有的环境变量**，也可以修改和查询环境变量

> 注意：修改并不会真正影响操作系统的变量，而是只在当前线程生效，线程结束便释放

![image-20231027192143184](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027192143184.png)

### 环境变量场景

区分开发环境 和 生产环境

```bash
npm install cross-env
```

`cross-env`能跨平台设置和使用环境变量，不论是在 Windows 系统还是 POSIX 系统。同时，它提供了一个设置环境变量的脚本，使得您可以在脚本中以 unix 方式设置环境变量，然后在 Windows 上也能兼容运行

如下，在 package 中设置`cross-env NODE_ENV=dev`

![image-20231027192352096](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027192352096.png)

`cross-env`原理:

- 如果是 windows，就调用 SET 设置环境变量
- 如果是 posix，就调用 export 设置环境变量

```bash
set NODE_ENV=production  #windows
export NODE_ENV=production #posix
```
