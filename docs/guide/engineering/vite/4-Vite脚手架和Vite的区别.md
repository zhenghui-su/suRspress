# Vite 脚手架和 Vite 的区别

Vite 官网搭建 Vite 项目文档：[搭建第一个 Vite 项目](https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project)

这里我们用 `yarn create vite` 举例，步骤如下：

- 全局安装一个东西：create-vite ( vite 的脚手架 )

- 直接运行这个 create-vite 中某个目录下的一个执行配置，该目录取决于我们选择的模板

> 这里可能有个误区：认为 yarn create 构建项目也是 Vite 做的事情，这是错误的

create-vite 和 vite 的关系是 create-vite 内置了 vite

就像是使用 create-react-app 内置了 webpack

我们先学习 Vite，而不是 Vite脚手架 create-vite

> 脚手架就是搭建一套预设项目，这是什么意思呢？
>
> 比如我们自己搭建一个项目，需要下载vite、react、sass等等，还需要建目录等
>
> 而脚手架帮我们都干了，它下载了基本的库，同时给你搭好了目录，这就是预设