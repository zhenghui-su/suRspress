## 7-搭建 npm 私服

### 构建 npm 私服

构建私服有什么收益吗？

- 可以**离线使用**，你可以将**npm 私服**部署到**内网集群**，这样离线也可以访问私有的包。
- 提高包的**安全性**，使用私有的 npm 仓库可以更好的管理你的包，避免在使用公共的 npm 包的时候出现**漏洞**。
- 提高包的**下载速度**，使用私有 npm 仓库，你可以将经常使用的 npm 包缓存到本地，从而显著提高包的下载速度，减少依赖包的下载时间。这对于团队内部开发和持续集成、部署等场景非常有用

### 如何搭建 npm 私服

[verdaccio.org/zh-CN/](https://verdaccio.org/zh-cn/)

Verdaccio 是可以帮我们快速构建 npm 私服的一个工具

```bash
npm install verdaccio -g
```

使用方式非常简单，直接运行命令`verdaccio`即可

> 可以通过`verdaccio --help`查看配置

![image-20231027003334766](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027003334766.png)

然后访问 4873 默认端口即可

![image-20231027003540676](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027003540676.png)

如果不是中文，点击设置切换为中文简体即可

![image-20231027003617194](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027003617194.png)

### 基本命令

```sh
#创建账号
npm adduser --registry http://localhost:4873/
# 账号 密码 邮箱

# 发布npm
npm publish --registry http://localhost:4873/

#指定开启端口 默认 4873
verdaccio --listen 9999

# 指定安装源
npm install --registry http://localhost:4873

# 从本地仓库删除包
npm unpublish <package-name> --registry http://localhost:4873
```

其他配置文件项

[verdaccio.org/zh-CN/docs/…](https://verdaccio.org/zh-cn/docs/configuration/)
