## React 基本介绍

本章主要包含以下内容：

+ React基本介绍
+ React特点
+ 搭建开发环境

### React 基本介绍

React起源于Facebook的内部项目，因为该公司对市场上所有JavaScript MVC框架都不满意，就决定自己写-套，用来架设Instagram的网站。

React的实质其实是一个用于构建用户界面的JavaScript库。React 主要用于构建Ul。React 于2013年5月开源，由于拥有较高的性能，代码逻辑简单，越来越多的人已开始关注和使用它。

> UI = fn(state)

由于React的设计思想极其独特，属于革命性创新，性能出众，所以，越来越多的人开始关注和使用，认为它可能是将来Web开发的主流工具。

这个项目本身也越滚越大，从最早的UI引擎变成了-整套前后端通吃的Web App解决方案。

React 官网：[英文网](https://react.dev/), [中文网](https://zh-hans.react.dev/)

React 从诞生到现在，一直带给我们惊喜，如全新的Hooks概念等，从2015年开始，每年都会举行 React Conf 大会，介绍React本年度所更新的新特性有哪些

> React Conf官网：[https://conf.react.dev/](https://conf.react.dev/)

介绍React几个重要版本的更新：

+ React 16：出现了 **Fiber**，弃用了 **Stack** 架构，整个更新变的可中断、可分片、具有优先级
+ React 16.8：推出了 **Hooks**，标志着从类组件正式转为函数组件
+ React 17：过渡版本，没有添加任何面向开发人员的新功能，主要侧重**升级简化** React 本身
+ React 18
  + transition
  + Suspense
  + 新的 Hooks
  + Offscreen
  + .......

### React 特点

在React官网，罗列了3个特点

+ 声明式
+ 组件化
+ 一次学习，跨平台编写

除此之外，React还具有以下特点：

+ 单项数据流
+ 虚拟DOM
+ Diff算法

### 搭建开发环境

虽然官方提供了通过CDN引入React的方式：[https://zh-hans.legacy.reactjs.org/docs/cdn-links.html](https://zh-hans.legacy.reactjs.org/docs/cdn-links.html)

但实际开发肯定使用React的脚手架工具来搭建，如之前提供的React官方脚手架工具[https://create-react-app.dev/docs/getting-started/](https://create-react-app.dev/docs/getting-started/)

快速开始

```bash
npx create-react-app my-app
cd my-app
npm start
```

官网的新站点现在最近推荐通过Nextjs开始，但这是服务端渲染框架，不建议先从这开始，我们也可以通过Vite来搭建，根据提示选择即可

```bash
npm init vite@latest
```

> create-react-app：通过webpack搭建

进去后，只留public下的favicon.ico和index.html，src下的App.js和index.js即可，这样简洁，有报错一般就是引入没了，删除就行
