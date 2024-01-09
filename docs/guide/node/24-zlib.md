## 24-zlib

在 Node.js 中，`zlib` 模块提供了对数据压缩和解压缩的功能，以便在应用程序中减少数据的传输大小和提高性能。该模块支持多种压缩算法，包括 Deflate、Gzip 和 Raw Deflate。

`zlib` 模块的主要作用如下：

1. 数据压缩：使用 `zlib` 模块可以将数据以无损压缩算法（如 Deflate、Gzip）进行压缩，减少数据的大小。这在网络传输和磁盘存储中特别有用，可以节省带宽和存储空间。
2. 数据解压缩：`zlib` 模块还提供了对压缩数据的解压缩功能，可以还原压缩前的原始数据。
3. 流压缩：`zlib` 模块支持使用流（`Stream`）的方式进行数据的压缩和解压缩。这种方式使得可以对大型文件或网络数据流进行逐步处理，而不需要将整个数据加载到内存中。
4. 压缩格式支持：`zlib` 模块支持多种常见的压缩格式，如 Gzip 和 Deflate。这些格式在各种应用场景中广泛使用，例如 HTTP 响应的内容编码、文件压缩和解压缩等。

使用 `zlib` 模块进行数据压缩和解压缩可以帮助优化应用程序的性能和资源利用。通过减小数据的大小，可以减少网络传输的时间和带宽消耗，同时减少磁盘上的存储空间。此外，`zlib` 模块还提供了丰富的选项和方法，使得开发者可以根据具体需求进行灵活的压缩和解压缩操作。

### 代码案例

压缩一个 txt 文件**gzip** 原大小`index.txt(439kb)` 压缩完`index.txt.gz(4b)`

```js
// 引入所需的模块
const zlib = require('zlib'); // zlib 模块提供数据压缩和解压缩功能
const fs = require('node:fs'); // 引入 Node.js 的 fs 模块用于文件操作

// 创建可读流和可写流
const readStream = fs.createReadStream('index.txt'); // 创建可读流，读取名为 index.txt 的文件
const writeStream = fs.createWriteStream('index.txt.gz'); // 创建可写流，将压缩后的数据写入 index.txt.gz 文件

// 使用管道将可读流中的数据通过 Gzip 压缩，再通过管道传输到可写流中进行写入
readStream.pipe(zlib.createGzip()).pipe(writeStream);
```

解压 **gzip**

```js
const readStream = fs.createReadStream('index.txt.gz');
const writeStream = fs.createWriteStream('index2.txt');
readStream.pipe(zlib.createGunzip()).pipe(writeStream);
```

无损压缩 `deflate` 使用 createDeflate 方法

```js
const readStream = fs.createReadStream('index.txt'); // 创建可读流，读取名为 index.txt 的文件
const writeStream = fs.createWriteStream('index.txt.deflate'); // 创建可写流，将压缩后的数据写入 index.txt.deflate 文件
readStream.pipe(zlib.createDeflate()).pipe(writeStream);
```

解压 **deflate**

```js
const readStream = fs.createReadStream('index.txt.deflate');
const writeStream = fs.createWriteStream('index3.txt');
readStream.pipe(zlib.createInflate()).pipe(writeStream);
```

### gzip 和 deflate 区别

1. 压缩算法：Gzip 使用的是 Deflate 压缩算法，该算法结合了 LZ77 算法和哈夫曼编码。LZ77 算法用于数据的重复字符串的替换和引用，而哈夫曼编码用于进一步压缩数据。
2. 压缩效率：Gzip 压缩通常具有更高的压缩率，因为它使用了哈夫曼编码来进一步压缩数据。哈夫曼编码根据字符的出现频率，将较常见的字符用较短的编码表示，从而减小数据的大小。
3. 压缩速度：相比于仅使用 Deflate 的方式，Gzip 压缩需要更多的计算和处理时间，因为它还要进行哈夫曼编码的步骤。因此，在压缩速度方面，Deflate 可能比 Gzip 更快。
4. 应用场景：Gzip 压缩常用于文件压缩、网络传输和 HTTP 响应的内容编码。它广泛应用于 Web 服务器和浏览器之间的数据传输，以减小文件大小和提高网络传输效率。

### http 请求压缩

**deflate** 压缩前`(8.2kb)` -> 压缩后`(236b)`

```js
const zlib = require('zlib');
const http = require('node:http');
const server = http.createServer((req, res) => {
  const txt = 'susu'.repeat(1000);

  //res.setHeader('Content-Encoding','gzip')
  res.setHeader('Content-Encoding', 'deflate');
  res.setHeader('Content-type', 'text/plan;charset=utf-8');

  const result = zlib.deflateSync(txt);
  res.end(result);
});

server.listen(3000);
```

**gizp** 压缩前`(8.2kb)` ->压缩后`(245b) `

```js
const zlib = require('zlib');
const http = require('node:http');
const server = http.createServer((req, res) => {
  const txt = 'susu'.repeat(1000);

  res.setHeader('Content-Encoding', 'gzip');
  //res.setHeader('Content-Encoding','deflate')
  res.setHeader('Content-type', 'text/plan;charset=utf-8');

  const result = zlib.gzipSync(txt);
  res.end(result);
});

server.listen(3000);
```
