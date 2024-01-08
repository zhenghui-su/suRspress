## 5-npx

### npx 是什么

`npx`是一个命令行工具，它是`npm` 5.2.0 版本中新增的功能。它**允许**用户在**不安装全局包**的情况下，**运行已安装**在**本地项目**中的**包**或者**远程仓库**中的**包**。

`npx`的作用是在命令行中运行 node 包中的可执行文件，而无需全局安装这些包

这可以使开发人员更轻松地管理包的**依赖关系**，并且可以避免**全局污染**的问题。

它还可以帮助开发人员在项目中使用不同版本的包，而不会出现**版本冲突**的问题。

**`npx` 的优势**

1. 避免**全局安装**：`npx`允许你执行`npm package`，而不需要你先全局安装它。
2. 总是使用**最新版本**：如果你没有在本地安装相应的`npm package`，`npx`会从`npm`的`package`仓库中下载并使用最新版。
3. 执行任意`npm`包：`npx`不仅可以执行在`package.json`的`scripts`部分定义的命令，还可以执行任何`npm package`。
4. 执行 GitHub gist：`npx`甚至可以执行**GitHub gist**或者其他公开的**JavaScript**文件。

### npm 和 npx 区别

`npx`侧重于**执行**命令的，执行某个模块命令。虽然会自动安装模块，但是重在执行某个命令

`npm`侧重于**安装**或者**卸载**某个模块的。重在安装，并不具备执行某个模块的功能。

### 示例 1

[create-react-app.bootcss.com/docs/gettin…](https://create-react-app.bootcss.com/docs/getting-started)

![image-20231026223913749](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026223913749.png)

例如创建一个 react 项目 在之前需要安装到全局

```bash
npm install -g create-react-app
```

然后执行 `create-react-app my-app`这样的话会有两个问题

- 首先需要全局安装这个包占用磁盘空间
- 并且如果需要更新还得执行更新命令

如果使用`npx`命令就不会有上面的问题了

### 示例 2

查看全局安装的包

```bash
npm ls -g
```

![image-20231026224039727](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026224039727.png)

> 我全局并没有安装`vite`

当前项目安装`vite`

```bash
npm i vite -D
```

安装完成之后发现无法执行运行`vite`命令

![image-20231026224203612](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026224203612.png)

这时候就可以使用`npx vite` 了

![image-20231026224229655](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026224229655.png)

`npx`的运行规则和`npm`是一样的

本地目录查找`.bin`看有没有 如果没有就去全局的 node_moduels 查找

如果还没有就去下载这个包，然后运行命令，然后删除这个包
