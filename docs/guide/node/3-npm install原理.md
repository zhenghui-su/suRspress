## 3-npm install 原理

### 执行 npm install 的时候发生了什么

​ 首先安装的依赖都会存放在**根目录**的`node_modules`,默认采用**扁平化**的方式安装，并且排序规则`.bin`第一个然后`@系列`，再然后按照**首字母排序 abcd**等

​ 使用的算法是**广度优先遍历**，在遍历依赖树时，npm 会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖都被处理完毕。

​ 在处理每个依赖时，npm 会检查该依赖的**版本号**是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本

![image-20231026215719361](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026215719361.png)

### 扁平化

**扁平化理想状态如下**

![image-20231026215959785](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026215959785.png)

**安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块**

因为 A 模块下的 C 模块被安装到了第一级，这使得 B 模块能够复用处在同一级下；且名称，版本，均相同的 C 模块

**非理性状态如下**

![image-20231026215920712](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026215920712.png)

因为 B 和 A 所要求的依赖模块不同，（B 下要求是 v2.0 的 C，A 下要求是 v1.0 的 C ）

所以 B 不能像 2 中那样复用 A 下的 C v1.0 模块

所以如果这种情况还是会出现**模块冗余**的情况，他就会给 B 继续搞一层`node_modules`，就是非扁平化了。

### npm install 后续的流程

<img src="https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026220043535.png" alt="image-20231026220043535"  />

通过图片可以很清楚的了解后续的流程

npmrc 的配置可以参考下面

```bash
registry=http://registry.npmjs.org/
# 定义npm的registry，即npm的包下载源

proxy=http://proxy.example.com:8080/
# 定义npm的代理服务器，用于访问网络

https-proxy=http://proxy.example.com:8080/
# 定义npm的https代理服务器，用于访问网络

strict-ssl=true
# 是否在SSL证书验证错误时退出

cafile=/path/to/cafile.pem
# 定义自定义CA证书文件的路径

user-agent=npm/{npm-version} node/{node-version} {platform}
# 自定义请求头中的User-Agent

save=true
# 安装包时是否自动保存到package.json的dependencies中

save-dev=true
# 安装包时是否自动保存到package.json的devDependencies中

save-exact=true
# 安装包时是否精确保存版本号

engine-strict=true
# 是否在安装时检查依赖的node和npm版本是否符合要求

scripts-prepend-node-path=true
# 是否在运行脚本时自动将node的路径添加到PATH环境变量中
```

### package-lock.json 的作用

很多朋友只知道这个东西可以**锁定版本记录即依赖树详细信息**

- `version` 该参数指定了当前包的版本号
- `resolved` 该参数指定了当前包的下载地址
- `integrity` 用于验证包的完整性
- `dev` 该参数指定了当前包是一个开发依赖包
- `bin` 该参数指定了当前包中可执行文件的路径和名称
- `engines` 该参数指定了当前包所依赖的 Node.js 版本范围

知识点来了，`package-lock.json` 帮我们做了缓存，他会通过 `name + version + integrity` 信息生成一个唯一的**key**，这个**key**能找到对应的`index-v5 `下的缓存记录 也就是`npm cache `文件夹下的

> 可以通过命令`npm config list`输出的 cache 来找到缓存的路径

![image-20231026221158218](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026221158218.png)

如果发现有缓存记录，就会找到**tar 包**的**hash 值**，然后将对应的二进制文件解压到`node_modeules`

![image-20231026221258551](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231026221258551.png)
