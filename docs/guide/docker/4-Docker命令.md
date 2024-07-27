# Docker 命令

## 帮助命令

Docker 拥有如下的帮助命令：

```shell
docker version 			# 显示docker版本信息
docker info 			# 显示docker系统信息, 包括镜像和容器数量
docker <command> --help # 帮助命令
```

帮助文档的地址：[Reference](https://docs.docker.com/reference/)，所有的命令都可以在这里找到

可以使用`docker --help`查看所有命令，也可以单独使用比如`docker info --help`查看 info 命令的详细使用方法

## 镜像基本命令

#### docker images

`docker images`：查看所有本地主机上的镜像，我们现在应该是只有一个 hello-world 镜像

```shell
[root@VM-8-9-centos ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
hello-world   latest    feb5d9fea6a5   2 years ago   13.3kB
```

我们解释一下各个名称：

- **REPOSITORY**：镜像的仓库源
- **TAG**：镜像的标签
- **IMAGE ID**：镜像的 ID
- **CREATED**：镜像的创建时间
- **SIZE**：镜像的大小

当我们使用`docker images --help`可以查看该命令的使用方法，我将其简化只列出常用的

```shell
Options:
  -a, --all             # 列出所有镜像
  -q, --quiet           # 只显示镜像的id
```

比如这个，使用命令`docker images -q`，就会只显示镜像的 id 了

![image-20240727162506680](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727162506680.png)

#### docker search

`docker search`：搜索镜像命令

我们经常需要搜索相关镜像，又不想去 Docker Hub 查看，比如我需要搜索一下 MySQL：

![image-20240727162842394](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727162842394.png)

但我们发现有很多，我们可以根据**STARS**数量来过滤一下

```shell
# 可选项
 --filter=STARS=5000 # 搜索出来的镜像的STARS就是大于5000的
```

我们尝试一下`docker search mysql --filter=STARS=5000`，结果如下：

![image-20240727163411177](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727163411177.png)

这样很多干扰就没了，我们发现第一个就是 MySQL 了

#### docker pull

我们现在搜索到了 MySQL，那我们需要下载这个镜像，怎么下载呢？

`docker pull`：用于下载镜像，可以根据名称和 tag 下载

我们可以使用`docker pull mysql`下载 MySQL 的镜像

```shell
# 下载镜像 docker pull 镜像名[:tag]
[root@VM-8-9-centos ~]# docker pull mysql
Using default tag: latest # 如果不写tag, 默认就是 latest
latest: Pulling from library/mysql
72a69066d2fe: Pull complete # 分层下载, docker image的核心 - 联合文件系统
93619dbc5b36: Pull complete
99da31dd6142: Pull complete
626033c43d70: Pull complete
37d5d7efb64e: Pull complete
ac563158d721: Pull complete
d2ba16033dad: Pull complete
688ba7d5c01a: Pull complete
00e060b6d11d: Pull complete
1c04857f594f: Pull complete
4d7cfa90e6ea: Pull complete
e0431212d27d: Pull complete
Digest: sha256:e9027fe4d91c0153429607251656806cc784e914937271037f7738bd5b8e7709 # 签名
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest # 真实地址
```

真实地址啥意思，其实我们`docker pull mysql`就等于`docker pull docker.io/library/mysql:latest`

我们上面还提到了 tag，这个就相当于版本了，比如我们可以再下载一个 5.7 版本的，使用`docker pull mysql:5.7`

```shell
[root@VM-8-9-centos ~]# docker pull mysql:5.7
5.7: Pulling from library/mysql
72a69066d2fe: Already exists
93619dbc5b36: Already exists
99da31dd6142: Already exists
626033c43d70: Already exists
37d5d7efb64e: Already exists
ac563158d721: Already exists
d2ba16033dad: Already exists
0ceb82207cd7: Pull complete
37f2405cae96: Pull complete
e2482e017e53: Pull complete
70deed891d42: Pull complete
Digest: sha256:f2ad209efe9c67104167fc609cca6973c8422939491c9345270175a300419f94
Status: Downloaded newer image for mysql:5.7
docker.io/library/mysql:5.7
```

我们发现分层下载有的和之前的不一样了，变成`Already exists`了，为什么呢？这就是 Docker Image 的核心

这个就是 Docker 发现有的文件是一样的，通过联合文件系统，之前下载过的是可以复用的

然后我们查看一下已经下载的镜像：

![image-20240727164723930](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727164723930.png)

#### docker rmi

`docker rmi`：删除镜像

我们下了两个 MySQL，那我们想删除一个比如删除 5.7 的，可以通过`docker rmi`来

一般来说我们使用`docker rmi -f <id>`来删除，`-f`代表全部删除的意思，`<id>`即镜像 id

> 当然也可以通过镜像名称删除，但我们有两个 mysql，自然需要 id 来判断是哪一个了

![image-20240727165209641](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727165209641.png)

再次查看镜像，5.7 版本的 MySQL 就被我们删除了

![image-20240727165242960](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727165242960.png)

我们可以根据之前的`docker images -aq`玩一些小操作，我想把所有镜像删除怎么实现呢

通过 Linux 命令`$()`，将`docker images -q`的返回结果即所有镜像 id 传入给`docker rmi -f`即可

```shell
docker rmi -f $(docker images -q)
```

![image-20240727165645131](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727165645131.png)

我们再次查看镜像，发现都被我们删除了：

![image-20240727165710056](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727165710056.png)

删除镜像命令基本如下：

```shell
docker rmi -f 镜像id # 删除指定的镜像
docker rmi -f 镜像id 镜像id 镜像id # 删除多个指定镜像
docker rmi -f $(docker images -q) # 删除全部的镜像
```

这就是镜像相关的基本命令了

## 容器命令
