## 9-全局变量 & 全局 API

### 全局变量

如何在`nodejs`定义全局变量呢？

在`nodejs`中使用`global`定义全局变量，新建文件`index.js`

```js
global.name = '全局变量';
require('./child.js');
```

创建文件`child.js`，运行会输出`全局变量`

```js
console.log(global.name);
```

> 注意 require 引入 child 文件需要在定义变量后，否则会访问到 undefined

在浏览器中我们定义的全局变量都在`window`，`nodejs`在`global`，不同的环境还需要**判断**，于是在 ECMAScript 2020 出现了一个**`globalThis`**全局变量，在`nodejs`环境自动切换`global`，浏览器环境自动切换`window`，非常方便

```js
globalThis.name = '全局变量'; // 上面换为这个还是能读到
```

### 关于其他全局 API

> nodejs 中没有 DOM 和 BOM，除了这些 API，其他的 ECMAscriptAPI 基本都能用

例如下面，这些 API 都是可以正常用的

```js
setTimeout、setInterval、Promise、Math、console、Date、fetch(node v18) 等...
```

### nodejs 内置全局 API

#### \_\_dirname

它表示当前模块的所在`目录`的绝对路径

```js
console.log(__dirname);
```

#### \_\_filename

它表示当前模块`文件`的绝对路径，包括文件名和文件扩展名

```js
console.log(__filename);
```

#### require module

```js
const fs = require('node:fs');
```

引入模块和模块导出上一章已经详细讲过了

#### process

1. `process.argv`: 这是一个包含**命令行参数**的数组。第一个元素是 Node.js 的执行路径，第二个元素是当前执行的 JavaScript 文件的路径，之后的元素是传递给脚本的命令行参数
2. `process.env`: 这是一个包含**当前环境变量**的对象。您可以通过`process.env`访问并操作**环境变量**
3. `process.cwd()`: 这个方法返回**当前工作目录**的路径
4. `process.on(event, listener)`: 用于**注册事件监听器**。您可以使用`process.on`监听诸如`exit`、`uncaughtException`等事件，并在事件发生时执行相应的回调函数
5. `process.exit([code])`: 用于**退出**当前的 Node.js 进程。您可以提供一个可选的退出码作为参数
6. `process.pid`: 这个属性返回当前进程的**PID**（进程 ID）

这些只是`process`对象的一些常用属性和方法，还有其他许多属性和方法可用于监控进程、设置信号处理、发送 IPC 消息等

需要注意的是，`process`对象是一个**全局对象**，可以在任何模块中直接访问，无需导入或定义

#### Buffer

1. 创建 `Buffer` 实例：
   - `Buffer.alloc(size[, fill[, encoding]])`: 创建一个指定大小的新的`Buffer`实例，初始内容为零。`fill`参数可用于**填充缓冲区**，`encoding`参数指定填充的**字符编码**
   - `Buffer.from(array)`: 创建一个包含**给定数组**的`Buffer`实例
   - `Buffer.from(string[, encoding])`: 创建一个包含**给定字符串**的`Buffer`实例
2. 读取和写入数据：
   - `buffer[index]`: 通过**索引**读取或写入`Buffer`实例中的**特定字节**
   - `buffer.length`: 获取`Buffer`实例的**字节长度**
   - `buffer.toString([encoding[, start[, end]]])`: 将`Buffer`实例转换为**字符串**
3. 转换数据：
   - `buffer.toJSON()`: 将`Buffer`实例转换为**JSON 对象**
   - `buffer.slice([start[, end]])`: 返回一个新的`Buffer`实例，其中包含原始`Buffer`实例的部分内容
4. 其他方法：
   - `Buffer.isBuffer(obj)`: **检查**一个对象是否是`Buffer`实例
   - `Buffer.concat(list[, totalLength])`: 将一组`Buffer`实例或字节数组**连接起来**形成一个新的`Buffer`实例

请注意，从**Node.js 6.0**版本开始，`Buffer`构造函数的使用已被弃用，推荐使用`Buffer.alloc()`、`Buffer.from()`等方法来创建`Buffer`实例

`Buffer`类在处理文件、网络通信、加密和解密等操作中非常有用，尤其是在需要处理二进制数据时
