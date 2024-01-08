## 11-Path Windows & posix

> path 模块在不同的操作系统是有差异的(windows | posix)

`windows`大家肯定熟悉，`posix`可能大家没听说过

**posix（Portable Operating System Interface of UNIX）**

`posix`表示**可移植操作系统接口**，也就是定义了一套**标准**

遵守这套标准的操作系统有(unix、linux、macOs、windows wsl)

为什么要定义这套标准？比如在 Linux 系统启动一个进程需要调用`fork`函数，在 Windows 启动一个进程需要调用`creatprocess`函数

这样就有问题，比如我在 Linux 写好了代码，需要移植到 Windows 发现函数不统一，`posix`标准的出现就是为了解决这个问题

Windows 并没有完全遵循 POSIX 标准，Windows 在设计上采用了不同于 POSIX 的路径表示方法

> 在 Windows 系统中，路径使用反斜杠（`\`）作为路径分隔符。这与 POSIX 系统使用的正斜杠（`/`）是不同的。这是 Windows 系统的历史原因所致，早期的 Windows 操作系统采用了不同的设计选择。

### Windows posix 差异

`path.basename()` 方法返回的是给定路径中的最后一部分

在 posix 处理 Windows 路径，会发现结果返回的并不对，应该返回 `myfile.html`

```js
path.basename('C:\tempmyfile.html');
// 返回: 'C:\temp\myfile.html'
```

如果要在`posix`系统处理 Windows 的路径，需要调用对应**操作系统**的方法，应该修改为

```js
path.win32.basename('C:\tempmyfile.html');
```

这样就能返回 `myfile.html`

### path.dirname

这个 API 和`basename`正好互补

```js
path.dirname('/aaaa/bbbb/cccc/index.html');
```

`dirname` API 返回 `/aaaa/bbbb/cccc` **除了**最后一个路径的**前面路径**。

`basename` API 返回 **最后一个路径** index.html

### path.extname

这个 API 用来返回**扩展名**，例如`/bbb/ccc/file.txt` 返回就是`.txt`

```js
path.extname('/aaaa/bbbb/cccc/index.html.ccc.ddd.aaa');
//.aaa
```

> 如果有多个` .` 返回最后一个，如果没有扩展名，返回空

### path.join

这个 API 主要是用来**拼接路径**的

```js
path.join('/foo', '/cxk', '/ikun');
// /foo/cxk/ikun
```

> 可以支持 .. ./ ../操作符

```js
path.join('/foo', '/cxk', '/ikun', '../');
// /foo/cxk/
```

### path.resolve

用于将**相对路径解析**并且**返回绝对路径**

如果传入了**多个**绝对路径 它将返回**最右边**的绝对路径

```js
path.resolve('/aaa', '/bbb', '/ccc');
//   /ccc
```

传入绝对路径 + 相对路径

```js
path.resolve(__dirname, './index.js');
//  /User/xiaoman/DeskTop/node/index.js
```

如果只传入相对路径

```js
path.resolve('./index.js');
// 返回工作目录 + index.js
```

### path.parse 和 path.format

`path.format` 和 `path.parse` 正好互补

**parse**用于解析文件路径

它接受一个**路径**字符串作为输入，并返回一个包含路径各个组成部分的**对象**

```js
path.parse('/home/user/dir/file.txt')
//返回如下
{
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
```

- `root`：路径的根目录，即 `/`
- `dir`：文件所在的目录，即 `/home/user/documents`
- `base`：文件名，即 `file.txt`
- `ext`：文件扩展名，即 `.txt`
- `name`：文件名去除扩展名，即 `file`

**format** 正好相反，把**对象**转回**字符串**

```js
path.format({
  root: '/',
  dir: '/home/user/documents',
  base: 'file.txt',
  ext: '.txt',
  name: 'file',
});
// /home/user/dir/file.txt
```

### path.sep

根据操作系统返回的值是不一样的

Windows 返回是`\` posix 返回的是`/`

```js
console.log(path.sep);
```
