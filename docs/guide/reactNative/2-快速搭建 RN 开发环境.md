## 快速搭建 RN 开发环境

要进行RN的开发，首先第一步 是搭建其开发环境。
官网为我们提供了搭建开发环境的详细步骤: [搭建开发环境](https://reactnative.cn/docs/environment-setup)

![image-20240423140945367](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423140945367.png)

其中给了我们两个选择：

+ 如果是学习阶段，想要快速体验 RN 开发，那么可以直接使用简易沙盒环境
+ 如果是要做完整的上线应用开发，那么可以搭建完整的原生环境

这里我不希望大家一开始就在搭建环境这件事上消耗太多精力，因此我们先使用简易的沙盒环境，以便于能够快速进入到RN的开发学习。

> 沙盒(英语: sandbox，又译为沙箱)， 计算机术语，在计算机安全领域中是一种安全机制，为运行中的程序提供的隔离环境。通常是作为一些来源不可信、具破坏力或无法判定程序意图的程序提供实验之用。
> 沙盒通常严格控制其中的程序所能访问的资源，比如，沙盒可以提供用后即回收的磁盘及内存空间。在沙盒中，网络访问、对真实系统的访问、对输入设备的读取通常被禁止或是严格限制。从这个角度来说，沙盒属于虚拟化的一种。
> 沙盒中的所有改动对操作系统不会造成任何损失。通常，这种技术被计算机技术人员广泛用于测试可能带海的程序或是其他的恶意代码。

首先第一步，我们需要安装 *expo-cli*，这是一个脚手架工具，可以帮助我们快速搭建一个 RN 的项目

```bash
npm install -g expo-cli
```

安装完毕后可以使用 *expo -V* 来查看所安装的脚手架版本

> Node 高于16 可能还会报expo不支持17+以上

![image-20240423143332229](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423143332229.png)

接下来我们就可以快速拉取一个项目，使用命令`expo init <项目名称>`

现在用本地的cli 创建会报如下的错误：

![image-20240423144604743](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423144604743.png)

> 原因参照博文：[https://blog.expo.dev/the-new-expo-cli-f4250d8e3421](https://blog.expo.dev/the-new-expo-cli-f4250d8e3421)

新的 expo 版本提供了 npx 创建项目的方式，当然Node 版本需要高点比如18

```bash
npx create-expo-app --template
```

![image-20240423143833822](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423143833822.png)

建议选择第二种，毕竟第一种官方都警告弃用了。

首先让我们选择项目模板，如果不用 TypeScript 的话，一般选第一个即可。

然后输入项目的名称，随意输入即可

> 注：使用 expo-cli 拉取项目时，很多依赖需要搭建梯子才能安装，请搞定好科学上网

在梯子稳定的环境下，拉取项目很快，如图，出现这个就证明对了，有些时候会下载依赖失败，检查好上网环境即可

![image-20240423145547399](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423145547399.png)

进入目录后，使用`npm start`运行，出现如下证明运行成功，有错误可以搜索解决

![image-20240423150001079](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423150001079.png)

接下来需要搞定 RN 项目的预览环境。以前写PC网页的时候，电脑上的浏览器就是我们的预览环境，而现在我们使用RN开发的是移动端应用，因此自然预览环境使用的是我们的手机。

除此之外，我们需要在手机上安装一个 expo-client 应用。

你可以点击[这里](https://expo.dev/tools)，然后下滑根据你的手机系统版本下载对应的 Client 的文件。

![image-20240423150628439](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423150628439.png)

当你打开后，可以输入网址或者扫描二维码，安卓expo应用自带扫描功能，ios的话可以使用自己的相机扫码，成功链接后会有个进度条，然后你应该看到如下：

![image-20240423154337422](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240423154337422.png)

你的手机上也能看到这句话：Open up App.js to start working on your app!

我们可以改一下这个话，改为 Hello React Native!，保存

然后就会发现手机上的文字也变化了，这就是热更新了

> 常见问题：如果报错如下
>
> ```bash
> TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["X-React-Native-Project-Root"] at ServerResponse.setHeader (node:_http_outgoing:651:3)
> ```
>
> 这个问题是你的rn目录路径上有空格和别的字符导致，建议放在无空格和全英文目录下
>
> 参考[Github Issues解决方案](https://github.com/react-native-community/cli/issues/2279)