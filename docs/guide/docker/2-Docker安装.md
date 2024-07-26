# Docker 安装

我们先了解一些 Docker 相关的名词

## Docker 的基本组成

我们来看一张图：

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/1256425-20190328225339616-1999638395.png)

我们先了解下面几个：

- **镜像（image）**：Docker 镜像好比为软件安装包，可以方便的进行传播和安装。
- **容器（container）**：Docker 利用容器技术，独立运行一个或一个组应用，通过镜像来创建的，我们可以简单把容器理解为一个简易的 Linux 小系统

- **仓库（repository）**：仓库就是存放镜像的地方，仓库分公有仓库和私有仓库，默认为 Docker Hub，但在国外网速慢，我们可以配置镜像加速，将源设置为国内的如阿里云，这一点和 npm 源很像。

## Docker 安装

桌面版：https://www.docker.com/products/docker-desktop

服务器版：https://docs.docker.com/engine/install/#server

### Windows 下安装

Windows 下只需安装桌面版 Docker Desktop 即可

**遇到报错如图：**

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/kvacsk82.png)

**解决方法：**

控制面板->程序->启用或关闭 windows 功能，开启 Windows 虚拟化和 Linux 子系统（WSL2)

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/kvactn57.png)

**命令行安装 Linux 内核**

`wsl.exe --install -d Ubuntu`

> 你也可以打开微软商店 Microsoft Store 搜索 Linux 进行安装，选择一个最新版本的 Ubuntu 或者 Debian 都可以

> 上面命令很可能你安装不了，微软商店你也可能打不开，如果遇到这个问题，参考：https://blog.csdn.net/qq_42220935/article/details/104714114

**设置开机启动 Hypervisor**

`bcdedit /set hypervisorlaunchtype auto`

> 注意要用管理员权限打开 PowerShell

**设置默认使用版本 2**

`wsl.exe --set-default-version 2`

**查看 WSL 是否安装正确**

`wsl.exe --list --verbose`

应该如下图，可以看到一个 Linux 系统，名字你的不一定跟我的一样，看你安装的是什么版本。
并且 VERSION 是 2

![image-20240725220549784](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725220549784.png)

**确保 BIOS 已开启虚拟化，下图检查是否已开启好**

> 如果是已禁用，请在开机时按 F2 进入 BIOS 开启一下，不会设置的可以网上搜索下自己主板的设置方法，Intel 和 AMD 的设置可能稍有不同

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/kvaf7ody.png)

**出现下图错误，点击链接安装最新版本的 WSL2**

https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/kvajwvuw.png)

### Mac 下安装

Mac 只需下载 Docker Desktop，就可以直接使用了

### Docker Desktop 配置镜像加速

默认 Docker 是从国外下载镜像，非常慢，我们可以配置一下国内的，下面是参考加速源：

| 镜像加速源          | 镜像加速源地址                       |
| ------------------- | ------------------------------------ |
| Docker 中国官方镜像 | https://registry.docker-cn.com       |
| DaoCloud 镜像站     | http://f1361db2.m.daocloud.io        |
| Azure 中国镜像      | https://dockerhub.azk8s.cn           |
| 科大镜像站          | https://docker.mirrors.ustc.edu.cn   |
| 阿里云              | https://ud6340vz.mirror.aliyuncs.com |
| 七牛云              | https://reg-mirror.qiniu.com         |
| 网易云              | https://hub-mirror.c.163.com         |
| 腾讯云              | https://mirror.ccs.tencentyun.com    |

根据下面的图设置即可

![img](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/l25jdwrn.png)

### Linux 下安装

Linux 虽然也可以下载桌面版，但由于我们大部分使用远程连接方式，所以更推荐安装 Docker Engine 即可

> 文档地址：https://docs.docker.com/engine/install/#server

根据你们的 Linux 操作系统，选择对应的文档，比如选择 CentOS：

![image-20240725221353830](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725221353830.png)

连接远程服务器，推荐我自己写的前端脚本`npm i -g szh-cli`

只需通过`szh ssh`即可连接，当然需要配置 ssh 密钥，比如我的：

![image-20240725233708495](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725233708495.png)

官方的教程非常的详细，我将其放到下面：

#### 卸载旧版本

如果以前有下载过，需要卸载，运行下面的命令，权限不够可以加`sudo`

```sh
sudo yum remove docker \
           		docker-client \
           		docker-client-latest \
           		docker-common \
           		docker-latest \
          		docker-latest-logrotate \
           		docker-logrotate \
           		docker-engine
```

yum 可能会报告您没有安装这些软件包，这是正常的。

#### 设置存储库

首先安装`yum-utils`，它提供`yum-config-manager`实用程序

```shell
sudo yum install -y yum-utils
```

然后设置存储库

```sh
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

当然这个是国外的，我们可以配置国内的镜像加速源

```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

> 地址相关可能有变动，可以多查查最近的文章博客，或者看官方文档

#### 安装最新 Docker Engine

运行下面的命令即可安装，值得注意的是 ce 是社区版，ee 是企业版

```shell
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

如果提示接受 GPG 密钥，请验证指纹是否与 `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35` 匹配，如果是，则接受。

此命令会安装 Docker，但不会启动 Docker。它还创建一个 docker 组，但是默认情况下不会向该组添加任何用户。

#### 启动 Docker

通过下面的命令启动 Docker

```shell
sudo systemctl start docker
```

通过运行 hello-world 映像来验证 Docker 引擎安装是否成功。

```shell
sudo docker run hello-world
```

此命令下载测试映像并在容器中运行它。当容器运行时，它会打印一条确认消息并退出。

![image-20240725233646657](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725233646657.png)

> 遇到各个问题可以网上搜一下，大部分都是有对应博客解决方案的

也可以通过运行 `docker version`来查看版本

![image-20240725233625120](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725233625120.png)

#### 查看镜像

我们通过`docker images`查看镜像

如果上面运行了 hello-world 镜像，它会去下载，然后在你的镜像里

![image-20240725233909802](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240725233909802.png)

## Docker 卸载

卸载 Docker Engine：

```sh
sudo yum remove docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```

主机上的映像、容器、卷或自定义配置文件不会自动删除。要删除所有映像、容器和卷：

```shell
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

您必须手动删除任何已编辑的配置文件。

## 配置阿里云镜像加速

第一步: 登录到阿里云, 然后搜索容器镜像服务

![image-20240726234303636](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240726234303636.png)

第二步：管理控制台，然后左下有一个镜像工具，下面有一个镜像加速器，点击

![image-20240726234507469](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240726234507469.png)

第三步，根据你的系统，安装步骤设置即可

![image-20240726234543217](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240726234543217.png)

命令如下：

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["地址换成你的"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

这下我们下载镜像什么的就比较快啦
