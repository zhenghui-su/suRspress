## 4-npm run 原理

### npm run xxx 发生了什么

按照下面的例子`npm run dev`举例过程中发生了什么

![image-20231026222300913](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026222300913.png)

读取`package json`的`scripts`对应的脚本命令`dev:vite`,vite 是个可执行脚本，他的查找规则是：

- 先从当前项目的`node_modules/.bin`去查找可执行命令`vite`

- 如果没找到就去全局的`node_modules`去找可执行命令`vite`

  > 全局的可以通过`npm config list`输出的 prefix 找到路径

- 如果还没找到就去环境变量查找

- 再找不到就进行报错

如果成功找到会发现有三个文件

![image-20231026222324037](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026222324037.png)

> 因为 nodejs 是跨平台的所以可执行命令兼容各个平台

- `.sh`文件是给 Linux、Unix、Macos 使用
- `.cmd`给 Windows 的 cmd 使用
- `.ps1`给 Windows 的 powerShell 使用

### npm 生命周期

没想到吧 npm 执行命令也有**生命周期**！

创建了 3 个文件`index.js`、`post.js`、`prev.js`，内容是`console.log(文件名字)`

> 注意：nodejs 的 console api 是自己实现的，与浏览器的 console api 不同

在`package.json`的`scripts`书写如下代码

```json
"predev": "node prev.js",
"dev": "node index.js",
"postdev": "node post.js"
```

执行`npm run dev`命令的时候`predev`会自动执行 他的生命周期是在`dev`之前执行，然后执行`dev`命令，再然后执行`postdev`，也就是`dev`之后执行

运用场景：例如`npm run build`可以在打包之后删除 dist 目录等等

post 例如你编写完一个工具发布 npm，那就可以在之后写一个 cli 脚本顺便帮你推送到 git 等等

> 谁用到了如上的场景
>
> 例如 vue-cli [github.com/vuejs/vue-c…](https://github.com/vuejs/vue-cli/blob/dev/package.json)

![image-20231026222441396](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026222441396.png)
