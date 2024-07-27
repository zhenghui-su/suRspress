# 回顾 HelloWorld 流程

流程一般如下：

![image-20240727154540530](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727154540530.png)

> 当然不一定从 Docker Hub 下载，根据你的镜像加速源决定

## 底层原理

### Docker 是怎么工作的？

Docker 是一个 Client-Server 结构的系统，Docker 的守护进程运行在主机上，通过 Socket 从客户端访问

Docker Server 接收到 Docker-Client 的指令，就会执行这个命令

![image-20240727155311453](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727155311453.png)

### Docker 为什么比 VM 快？

- Docker 有着比虚拟机更少的抽象层
- Docker 利用的是宿主机的内核，VM 需要是 Guest OS(即再搭一个环境)

![image-20240727155446185](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240727155446185.png)

所以说，新建一个容器的时候，Docker 不需要像虚拟机一样重新加载一个操作系统内核，避免引导。

虚拟机是加载 Guest OS，分钟级别加载速度，Docker 利用宿主机的操作系统内核，秒级加载速度。
