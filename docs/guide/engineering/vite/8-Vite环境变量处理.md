# Vite 环境变量处理

## 为何需要环境变量

环境变量：会根据当前的代码环境产生值的变化的变量就叫做环境变量

代码环境：开发环境，测试环境，预发布环境，灰度环境，生产环境

举个例子，如果用过百度地图SDK或者小程序的SDK，里面有一个 APP_KEY，它在不同的环境中，值是不一样的，在我们请求第三方SDK接口的时候就会带上它，这样他就会根据你的环境来返回不同的值

比如开发环境需要110，测试环境需要111，生产环境需要112，那每次请求都要写，都要带上，就觉得很烦

再举个现实例子，在和后端对接的时候，开发环境和生产环境的API一般都是不一样的，如下：

- 开发和测试：`http://test.api/`
- 生产：`https://api/`

这时候我们总不能在每次生产前去改url等等，这不是很麻烦吗？如果有一次忘记修改了，那用户访问的不就是开发和测试的数据了？

所以这时候我们就需要环境变量了

## 如何处理

我们创建三个文件`.env`、`.env.development`、`.env.production`

```js
// .env 所有环境都需要用到的环境变量
AAA = 1
```

```js
// .env.development 开发环境所用的环境变量
APP_KEY = 110
BASE_URL = "http://test.api/"
```

```js
// .env.production 生产环境所用的环境变量
APP_KEY = 112
BASE_URL = "https://api/"
```

在 Vite 中的环境变量处理，Vite 中内置了 dotenv

Vite 使用 dotenv 这个第三方库，它会在你执行如`npm run dev`的时候自动读取`.env`文件，并解析这个文件中的对应环境变量，将其注入到 process 对象上(process具体可看 node 章节)

> 小知识：为什么 vite.config.js 可以书写成ES Module的形式，这是因为 Vite 它在读取这个文件的时候率先使用node去解析文件语法，如果遇到ES Module就会将其转为 Common JS 规范

我们就可以使用 `process.env`来获取各个值了，但注意 Vite 考虑到和其他配置的一些冲突问题， 默认是不加载 `.env` 文件将其值注入到 process 对象上

涉及到 vite.config.js 中的一些配置：

- root：项目根目录（`index.html` 文件所在的位置）
- envDir：用来配置当前环境变量的文件地址

Vite 给我们提供了一个函数，我们可以调用 loadEnv 来手动确认 env 文件

```js
import { defineConfig, loadEnv } from "vite";
import viteBaseConfig from "./vite.base.config";
import viteDevConfig from "./vite.dev.config";
import viteProdConfig from "./vite.prod.config";

// 策略模式，两种写法都可以
const envResolver = {
  "build": () => ({ ...viteBaseConfig, ...viteProdConfig }),
  "server": () => Object.assign({}, viteBaseConfig, viteDevConfig)
}
// 根据你的命令将mode的值传递进来
export default defineConfig(({ command, mode }) => {
  // 第二个参数不是必须使用process.cwd(), 也可以自己传路径
  const env = loadEnv(mode, process.cwd(), "")
  // 使用 npm run dev 就会
  console.log("env/////", env);
  return envResolver[command]();
})
```

- process.cwd 方法：返回当前 node 进程工作的目录，详情见 node 章节

- mode：根据你的运行命令决定值，比如运行`npm run dev`，Vite会在后面补上mode，就变成运行`npm run dev --mode development`，这时候mode 的值就是 development，我们也可以手动改变mode，自己取名，比如`npm run dev --mode dev`，这时候mode 的值就是dev

当我们调用 loadEnv 的时候，会做如下的事情：

- 直接找到 .env 文件，并解析其中的环境变量放入到对象中
- 会将传递进来的 mode 这个变量与 env 拼接：`.env.[mode]`，然后根据我们提供的目录去取对应的配置文件并进行解析，然后放入到对象中，这个放入是在之前的基础上添加的

我们运行，打印如下，.env 公有的值有，开发环境的值也有

![image-20240510204845318](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240510204845318.png)

## 客户端获取

上面我们获取到了 env 的环境变量，可他是在服务端获取的，如果是客户端，我们如何获取呢？

Vite 会将对应的环境变量注入到 `import.meta.env` 中，我们打印一下

```js
console.log(import.meat.env)
```

会发现并没有我们在 env 中定义的环境变量

这是因为 Vite 做了一个校验拦截，为了防止我们将隐私性的变量直接送到其中

如果你的变量不是以VITE开头的，它就不会帮你将环境变量注入到客户端中

我们改一下env

```js
VITE_AAA = 111
```

然后运行，查看就会发现已经有了

![image-20240510210022461](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240510210022461.png)

如果我们不想要以 VITE 开头的配置，我们可以使用 envPrefix 配置

```js
import { defineConfig, loadEnv } from "vite";
import { cwd } from 'node:process';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, cwd(), "")

  return {
    envPrefix: "TEST", // 配置vite注入客户端环境变量校验的env前缀
  }
})
```

然后把env 改一下

```js
TEST_AAA = 111
```

我们运行一下看一下有没有变成 TEST_AAA，成功

![image-20240510210434673](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240510210434673.png)

所以我们在请求的时候就可以根据环境变量来弄了

