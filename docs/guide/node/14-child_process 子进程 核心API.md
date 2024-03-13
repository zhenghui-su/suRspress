## 14-child_process 子进程 核心 API

子进程是 Nodejs 核心 API，如果你会 shell 命令，他会有非常大的帮助，或者你喜欢编写前端工程化工具之类的，他也有很大的用处，以及处理 CPU 密集型应用。

### 创建子进程

Nodejs 创建子进程共有`7个`API Sync 同步 API 不加是异步 API

1. `exec` 执行命令(异步执行)
2. `execSync` 执行命令(同步执行)
3. `execFile` 执行可执行文件(异步执行)
4. `execFileSync` 执行可执行文件(同步执行)
5. `spawn` 执行命令(异步执行)
6. `spawnSync` 执行命令(同步执行)
7. `fork` 创建 node 子进程

### API 示例

#### exec 方法

`exec`适合执行较小的 shell 命令，有字节上限：200kb

```bash
child_process.exec(command, [options], callback)
```

`exec`获取 nodejs 版本号

```js
exec('node -v', (err, stdout, stderr) => {
  if (err) {
    return err;
  }
  console.log(stdout.toString());
});
```

`options`配置项

1. cwd <string> 子进程的当前工作目录。
2. env <Object> 环境变量键值对。
3. encoding <string> 默认为 'utf8'。
4. shell <string> 用于执行命令的 shell。 在 UNIX 上默认为 '/bin/bash'，在 Windows 上默认为 process.env.ComSpec。 详见 Shell Requirements 与 Default Windows Shell。
5. timeout <number> 默认为 0。
6. maxBuffer <number> stdout 或 stderr 允许的最大字节数。 默认为 200\*1024。 如果超过限制，则子进程会被终止。 查看警告： maxBuffer and Unicode。
7. killSignal <string> | <integer> 默认为 'SIGTERM'。
8. uid <number> 设置该进程的用户标识。（详见 setuid(2)）
9. gid <number> 设置该进程的组标识。（详见 setgid(2)）

#### execSync 方法

获取 node 版本号 如果要执行单次`shell`命令，`execSync`方便一些，`options`同上

```js
const nodeVersion = execSync('node -v');
console.log(nodeVersion.toString('utf-8'));
```

打开谷歌浏览器 使用 exec 可以打开一些软件例如 wx 谷歌 qq 音乐等 以下会打开百度并且进入`无痕模式`

```js
execSync('start chrome http://www.baidu.com --incognito');
```

#### execFile 方法

`execFile`适合执行**可执行文件**，例如执行一个 node 脚本，或者 shell 文件

windows 可以编写 cmd 脚本，posix 可以编写 bash 脚本

> 简单示例

新建文件`bat.cmd`写入以下代码。

创建一个文件夹 mkdir，进入目录，写入一个文件 test.js，最后执行。

```cmd
echo '开始'

mkdir test

cd ./test

echo console.log("test1232131") >test.js

echo '结束'

node test.js
```

使用`execFile`执行这个

```js
execFile(path.resolve(process.cwd(), './bat.cmd'), null, (err, stdout) => {
  console.log(stdout.toString());
});
```

![image-20231027195332172](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027195332172.png)

#### spawn 方法(异步用的多)

`spawn`用于执行一些实时获取的信息，因为 spawn 返回的是流边执行边返回

`exec`是返回一个完整的 buffer，buffer 的大小是**200k**，如果**超出**会报错，而`spawn`是无上限的。

```js
//                       命令      参数  options配置和上面一样
const { stdout } = spawn('netstat', ['-an'], {});

//返回的数据用data事件接受
stdout.on('data', (steram) => {
  console.log(steram.toString());
});
stdout.on('close', (msg) => {
  console.log('结束了');
});
```

![image-20231027195540243](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027195540243.png)

> exec -> execFile -> spawn
>
> exec 是底层通过 execFile 实现，execFile 底层通过 spawn 实现

#### fork

场景适合大量的计算，或者容易阻塞主进程操作的一些代码，就适合开发 fork

新建`index.js`文件，写入以下

```js
const { fork } = require('child_process');

const testProcess = fork('./test.js');

testProcess.send('我是主进程');

testProcess.on('message', (data) => {
  console.log('我是主进程接受消息111：', data);
});
```

新建`test.js`文件，写入以下

```js
process.on('message', (data) => {
  console.log('子进程接受消息：', data);
});

process.send('我是子进程');
```

> send 发送信息 ，message 接收消息，可以相互发送接收。

fork 底层使用的是 IPC 通道进行通讯的，IPC 基于 libuv 实现

根据不同操作系统调用不同的 API

![image-20231027195659901](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027195659901.png)
