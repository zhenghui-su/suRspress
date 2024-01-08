## 从零手写 create-react-app

前置知识：

+ yarn包管理
+ workspace工作区知识概念
+ Monorepo知识概念

### 初始化

一些知识科普讲解

+ Lerna 是一个用于管理具有多个包（packages）的 JavaScript 项目的工具。在一个大型 JavaScript 项目中，通常会有多个独立的模块或包，这些包可能相互依赖，或者需要一起发布。

+ 工作区（Workspace）通常是指在一个项目中，可以同时处理多个相关联的子项目（packages，modules等），而不需要将它们分别作为独立的项目来处理。在软件开发领域，工作区通常是指一个包含了多个子项目的项目容器，这些子项目可以共享一些配置、依赖关系和构建流程。
+ Monorepo是 "单一代码仓库"（Monorepository）的缩写，它是一种软件开发的组织结构模式，其中所有项目或者库的代码都放在一个单一的版本控制仓库中。通常，这种仓库包含了多个相关的项目、库或者组件，这些项目可能共享某些代码、依赖关系或者配置。

全局安装 lerna

```bash
npm i lerna@3.22.1 -g
```

输入如下检测是否安装成功

```bash
lerna -v
```

在要创建的文件夹，打开终端，输入如下初始化

```bash
lerna init
```

打开后，这里我用 **yarn**管理，终端输入

```bash
yarn install
```

两个作用：安装lerna和它的依赖，在根目录的node_modules里面创建软链接，链向各个packages中的各个包

> yarn 支持workspace 	npm只有在7版本以上支持
>
> yarn workspace    VS     lerna
>
> yarn重点在于包管理、处理依赖和软链
>
> lerna重点在于多个项目管理和发布

然后创建 packages 文件夹（workspace），最终形成的初始文件目录如下

![image-20231004232629874](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231004232629874.png)

### 创建 package

##### 创建 create-react-app

在终端输入,然后在协议(license)改为 MIT，入口(main)改为`index.js`其它不变

```bash
lerna create create-react-app
```

然后进入，把一些无用的删除，最终形成如下

![image-20231004233303465](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231004233303465.png)

##### 创建react-scripts

终端输入

```bash
lerna create react-scripts
```

##### 创建cra-template

终端输入

```bash
lerna create cra-template
```

##### 查看工作包

终端输入

```bash
yarn workspaces info
```

![image-20231004234845726](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231004234845726.png)

最终形成的结构图如下

![image-20231004234956700](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231004234956700.png)

### 添加依赖

在添加之前记得要设置为淘宝源，不然可能会安装很慢

安装如下依赖

```bash
yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check
```

> - **chalk:** `chalk` 是一个用于在终端中添加颜色和样式的库。它允许你在命令行界面中使用不同的颜色和样式来输出文本，使得输出更加清晰和易读。
> - **cross-spawn:** `cross-spawn` 是一个用于跨平台（Windows、Linux、Mac 等）运行子进程的库。它解决了在不同操作系统下创建子进程的差异性，使得在 Node.js 环境中能够一致地运行子进程。
> - **fs-extra:** `fs-extra` 是 Node.js 的文件系统模块（`fs` 模块）的扩展，提供了更多的功能和便捷的方法，使得文件和目录的操作更加容易和灵活。
> - **--ignore-workspace-root-check**:这是 `yarn add` 命令的一个选项。当你在一个使用 Yarn 工作区（Workspace）的项目中执行 `yarn add` 命令时，默认情况下 Yarn 会检查你是否在工作区的根目录（root）中运行该命令。如果你使用了 `--ignore-workspace-root-check` 选项，Yarn 将忽略这个检查，允许你在工作区的任意位置执行 `yarn add` 命令。

在lerna里面，packages里面的各个会在node_modules里面形成符号链接即软链，这样可以在别的package中访问另一个package

![image-20231004235537950](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231004235537950.png)

然后可以根据工作空间安装如下依赖

```bash
yarn workspace create-react-app add commander
```

> `commander` 是一个用于构建命令行界面（CLI）的 Node.js 框架。它可以帮助开发者轻松地构建复杂和易用的命令行工具，提供了处理命令行参数、解析用户输入、显示帮助信息等功能

### createReactApp.js文件

在根目录`package.json`添加脚本命令

```json
"scripts": {
    "create-react-app": "node ./packages/create-react-app/index.js"
}
```

在`packages`中的`create-react-app`文件夹的`index.js`文件更改

```js
const { init } = require('./createReactApp');

init();
```

在`create-react-app`文件夹中新建`createReactApp.js`文件

> 由于接下来我们需要用到刚刚安装的依赖，我们可以快速学习一下

```js
const chalk = require('chalk');
const {Command} = require('commander');
let program = new Command('create-react-app');
program
    .version('1.0.0') // 设置版本号
	.arguments('<must1> <must2> [option1] [option2]')//设置命令行的参数格式 <>表示必选 []表示可选
	.usage(`${chalk.green(`<must1> <must2> [option1] [option2]`)}`) // 设置用法说明，改颜色
    .action((must1,must2,option1,option2)=>{ // 指令命令的行为
    
	})
```

#### init函数

然后我们开始写`createReactApp.js`文件

```js
const { Command } = require('commander');
const packageJSON = require('./package.json');
const chalk = require('chalk');

function init() {
    let projectName;
    new Command(packageJSON.name) // 项目名
        .version(packageJSON.version) // 版本号
        .arguments('<project-directory>') // 项目的目录名
        .usage(`${chalk.green('<project-directory>')} [options]`)
        .action(name => {
            projectName = name;
        })
        .parse(process.argv); // [node完整路径,当前node脚本的路径,...其它参数]
    console.log('projectName',projectName);
}

module.exports = {
    init
}
```

如果报错等，可以修改`package.json`文件的chalk，高版本可能有错

```json
"dependencies": {
    "chalk": "^4.1.2",
  }
```

在终端运行如下测试是否成功

> -- 后面代码传参

```bash
npm run create-react-app -- myApp
```

此处我们传入项目名，最终终端会输出 myApp

```bash
projectName myApp
```

#### createApp函数

然后在`createReactApp.js`中创建createApp函数，在init中添加，并修改init为async

```js
async function init() {
    ... // 上面代码搬运下来
    createApp(projectName)
}
```

> 这里用到了path模块和fs-extra模块

```js
async function createApp(appName) { // projectName = appName
    let root = path.resolve(appName); // 得到将生成项目绝对路径
    fs.ensureDirSync(appName);// 保证此目录是存在的，如果不存在则创建
    console.log(`Creating a new React app in ${chalk.green(root)}.`);
    const packageJSON = {
        name: appName,
        version: '0.1.0',
        private: true
    }
    // 写入
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJSON, null, 2)
    );
    const originalDirectory = process.cwd(); // 原始的命令工作目录
    process.chdir(root); // change directory 改变工作目录
    console.log('appName',appName);
    console.log('root',root);
    console.log('originalDirectory', originalDirectory); 
}
```

在终端执行,就会生成一个文件夹myApp并有一个package.json文件了

```bash
npm run create-react-app -- myApp
```

![image-20231005013532488](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005013532488.png)

> 扩展 JSON.stringify
>
> 如下代码
>
> ```js
> let obj = {name:'chenchen',age:20};
> let result = JSON.stringify(obj,replacer,2); // replacer 替换器 2 为缩进空格
> function replacer(key,value){
>  console.log(key,value);
>  if(key == 'age') return value*2;
>  return value;
> }
> console.log(result);
> ```
>
> 打印结果如下
>
> ```bash
> {name:'chenchen',age:20} //原始的obj
> name chenchen // replacer的console.log(key,value);
> age 10 // replacer的console.log(key,value);
> {
> 	"name":"chenchen", //前面的缩进就是上面定义的2空格
> 	"age":20
> } // 替换后结果
> ```

#### run函数

在createApp函数最后加上执行run函数

```js
async function createApp(appName) {
    ...//上面代码
    await run(root, appName, originalDirectory);
}
```

创建run函数

```js
async function run(root, appName, originalDirectory) {
    let scriptName = 'react-scripts'; // create生成的代码里 源文件编译，启动服务放在了react-scripts
    let templateName = 'cra-template';
    const allDependencies = ['react', 'react-dom', scriptName, templateName];
    
    console.log('Installing packages. This might take a couple of minutes.');
    // Installing react, react-dom, and react-scripts with cra-template
    console.log(
        `Installing ${chalk.cyan('react')}, ${chalk.cyan(
            'react-dom'
        )}, and ${chalk.cyan(scriptName)}${` with ${chalk.cyan(templateName)}`}...`
    );
    await install(root,allDependencies);
}
```

#### install函数

> 这里用到了cross-spawn模块，记得导入

创建install函数

```js
async function install(root,allDependencies) {
    return new Promise(resolve =>{
        const command = 'yarnpkg'; //yarnpkg = yarn
        const args = ['add', '--exact', ...allDependencies, '--cwd', root];
        console.log(command,args);
        const child = spawn(command, args, { stdio: 'inherit' });//stdio = 'inherit' 表示子进程的输出会直接打印到父进程中
        child.on('close',resolve); // 回调执行
    })
}
```

> `cross-spawn` 是一个用于跨平台（Windows、Linux 和 macOS）的 Node.js 包，用于跨平台地启动子进程。
>
> ```js
> const child = spawn('npm', ['install', 'some-package']);
> ```
>
> 换成这个就熟悉了吧

#### executeNodeScript函数

> 拷贝模板的文件

在run函数中补充

```js
async function run(root, appName, originalDirectory) {
    ...//上面代码
    //项目根目录    项目名字   verbose是否显示详细信息 原始的目录 模板名称cra-template
    let data = [root, appName, true, originalDirectory, templateName];
    let source = `
    const init = require('react-scripts/scripts/init.js');
    init.apply(null, JSON.parse(process.argv[1]));
    `;
    await executeNodeScript({cwd:process.cwd()},data,source);
    console.log('Done.');
    process.exit(0); //退出
}
```

创建executeNodeScript函数

```js
async function executeNodeScript({ cwd }, data, source) {
    return new Promise((resolve) => {
        const child = spawn(
            process.execPath,//node可执行文件的路径
            ['-e', source, '--', JSON.stringify(data)],
            { cwd, stdio: 'inherit' }
        );
        child.on('close', resolve);
    });
}
```

> 上述简化的意思是通过node执行脚本
>
> 即把data里面的数据放到了node后面
>
> 如下，执行出来就是输出aaa
>
> ```bash
> node -e "console.log('aaa')" 
> ```
>
> process.argv是一个包含命令行参数的数组
>
> ```bash
> node -e "console.log(process.argv)" -- a b c
> ```
>
> 如下输出 就会发现上面abc也带入了
>
> ```bash
> ['C:\\Progaram Files\\nodejs\\node.exe','a','b','c']
> ```

此时基本完成，我们在终端输入

```bash
npm run create-react-app -- bbb
```

安装上述的四个模块

![image-20231005153831814](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005153831814.png)

拷贝模板文件到bbb文件夹下

![image-20231005153929823](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005153929823.png)

然后会删除cra-template模块因为拷贝完了

![image-20231005154009464](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005154009464.png)

最终安装成功，`cd bbb`切换到bbb文件夹，输入`yarn start`查看是否启动成功

![image-20231005154209323](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005154209323.png)

查看bbb文件目录，发现和我们平时用cra创建的一样

![image-20231005154332617](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005154332617.png)

**至此手写create-react-app已完成**

### 手写react-scripts编译

> create-react-app流程
>
> + 执行命令
> + 创建了一个React项目
> + 安装依赖包
> + 初始化git，拷贝模板，安装模板依赖
> + 移除模板，成功

![image-20231005160524479](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231005160524479.png)

#### react-scripts.js

##### 初始化

在package.json中配置

```js
"bin": {
    "react-scripts": "./bin/react-scripts.js"
  },
```

在根目录的package.json配置

```js
"scripts": {
    "create-react-app": "node ./packages/create-react-app/index.js",
    "build": "cd packages/react-scripts && node bin/react-scripts.js build"
  }
```

在`react-scripts`文件夹创建bin文件夹，并创建`react-scripts.js`文件

```js
console.log("done");
```

终端执行`npm run build`，输出`done`证明成功

##### 书写

在`react-scripts`文件夹下新建`scripts`文件夹，并创建`build.js`文件

```js
console.log('build.js')
```

书写`react-scripts.js`文件

```js
// 开启子进程
const spawn = require('cross-spawn');
// 获取命令行参数 ['build']
const args = process.argv.slice(2);
const script = args[0]; // build
// 以同步方式开始子进程执行scripts下面的build.js脚本
spawn.sync(
    process.execPath, // node的可执行文件路径
    [require.resolve('../scripts/' + script)],// 执行对应命令的文件如build.js
    { stdio: 'inherit' } // 让父进程和子进程共享输入输出
)
```

根目录终端输入`npm run build`，输出`build.js`证明成功

#### build.js

在`react-scripts`文件夹下新建`config`文件夹，并创建`webpack.config.js`文件和`path.js`文件

> 在根目录下缺少什么依赖就安装什么依赖，如@babel/preset-react

```js
/**
 * 生产webpack配置文件工厂
 * @param {*} webpackEnv 环境信息 development production
 */
const path = require('path');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development'; // 是否是开发环境
    const isEnvProduction = webpackEnv === 'production'; // 是否是生产环境
    return {
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        output: {
            path: paths.appBuild
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    include: paths.appSrc, //只转译src目录下面的文件
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.appHtml
            })
        ]
    }
}
```

```js
const path = require('path');
const appDirectory = process.cwd();//当前的工作目录
// 接收一个相对路径，返回一个从应用目录出发的绝对路径
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
    appBuild: resolveApp('build'),// 指向打包后的输出目录 webpack默认是dist
    appHtml: resolveApp('public/index.html'), // html模板给html-webpack-plugin用的
    appIndexJs: resolveApp('src/index.js'),// 默认的入口文件
    appPublic: resolveApp('public')
}
```

**书写build.js文件**

```js
// 1.设置环境变量为生产环境
process.env.NODE_ENV = 'production'
const fs = require('fs-extra');//加强版的fs
const webpack = require('webpack');
// 2.获取webpack的配置文件
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const chalk = require('chalk');
const config = configFactory('production');

// 3.如果build目录不为空，要把build目录清空
fs.emptyDirSync(paths.appBuild);
// 4.拷贝public下面的静态文件到build目录
copyPublicFolder();
build();

function build() {
    // compiler是总的编译对象
    let compiler = webpack(config);
    // 开始启动编译
    compiler.run((err, stats) => {
        console.log(err);
        console.log(stats);//它是一个描述对象，描述本次打包出来的结果
        console.log(chalk.green('Compiled successfully!'));
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        filter: file => file !== paths.appHtml // index.html文件交由插件编译处理，它不需要拷贝
    });
}
```

在react-scripts目录随意创建public和src，public创建index.html并添加id为root的div，src创建index.js并输入如下

```js
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(<h1>Hello World</h1>, document.getElementById('root'));
```

在react-scripts中修改package.json,并安装

```json
"dependencies": {
    "@babel/core": "^7.16.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.3",
    "@svgr/webpack": "^5.5.0",
    "babel-jest": "^27.4.2",
    "babel-loader": "^8.2.3",
    "babel-plugin-named-asset-import": "^0.3.8",
    "babel-preset-react-app": "^10.0.1",
    "bfj": "^7.0.2",
    "browserslist": "^4.18.1",
    "camelcase": "^6.2.1",
    "case-sensitive-paths-webpack-plugin": "^2.4.0",
    "css-loader": "^6.5.1",
    "css-minimizer-webpack-plugin": "^3.2.0",
    "dotenv": "^10.0.0",
    "dotenv-expand": "^5.1.0",
    "eslint": "^8.3.0",
    "eslint-config-react-app": "^7.0.1",
    "eslint-webpack-plugin": "^3.1.1",
    "file-loader": "^6.2.0",
    "fs-extra": "^10.0.0",
    "html-webpack-plugin": "^5.5.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^27.4.3",
    "jest-resolve": "^27.4.2",
    "jest-watch-typeahead": "^1.0.0",
    "mini-css-extract-plugin": "^2.4.5",
    "postcss": "^8.4.4",
    "postcss-flexbugs-fixes": "^5.0.2",
    "postcss-loader": "^6.2.1",
    "postcss-normalize": "^10.0.1",
    "postcss-preset-env": "^7.0.1",
    "prompts": "^2.4.2",
    "react-app-polyfill": "^3.0.0",
    "react-dev-utils": "^12.0.1",
    "react-refresh": "^0.11.0",
    "resolve": "^1.20.0",
    "resolve-url-loader": "^4.0.0",
    "sass-loader": "^12.3.0",
    "semver": "^7.3.5",
    "source-map-loader": "^3.0.0",
    "style-loader": "^3.3.1",
    "tailwindcss": "^3.0.2",
    "terser-webpack-plugin": "^5.2.5",
    "webpack": "^5.64.4",
    "webpack-dev-server": "^4.6.0",
    "webpack-manifest-plugin": "^4.0.2",
    "workbox-webpack-plugin": "^6.4.1"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "optionalDependencies": {
    "fsevents": "^2.3.2"
  },
  "peerDependencies": {
    "react": ">= 16",
    "typescript": "^3.2.1 || ^4"
  },
  "peerDependenciesMeta": {
    "typescript": {
      "optional": true
    }
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```

随后终端输入`npm run build`，成功打包，生成build目录里面有所创建的压缩文件

#### start命令

根目录package.json配置,与build一样

```js
"start": "cd packages/react-scripts && node bin/react-scripts.js start"
```

在在react-scripts的config里新建webpackDevServer.config.js

```js
module.exports = function () {
    return {
        hot: true // 热更新
    }
}
```

在react-scripts的scripts里新建start.js

```js
// 1.设置环境变量为开发环境
process.env.NODE_ENV = 'development';
// 2.获取配置文件的工厂
const configFactory = require('../config/webpack.config');
const config = configFactory('development');
//3.创建compiler编译对象
const chalk = require('chalk');
const webpack = require('webpack');
// @ts-ignore
const compiler = webpack(config);
// 4.获取devServer的配置对象
const createDevServerConfig = require('../config/webpackDevServer.config');
const serverConfig = createDevServerConfig();
const webpackDevServer = require('webpack-dev-server');
/**
 * 1.内部会启动compiler的编译
 * 2.会启动一个http服务器并返回编译后的结果
 */
const devServer = new webpackDevServer(compiler, serverConfig);
// 启动一个HTTP开发服务器，监听3000端口
devServer.listen(3000, 'localhost', () => {
    console.log(chalk.cyan('Starting the development server...'))
});
```

在终端输入`npm run start`就会看到我们上面创建index.js所要显示的Hello World

**至此build和start命令我们都完成了，下面有源码讲解，如果上面有点吃力，建议再加深知识后来查看。**



## 源码解析

### react-scripts.js源码

```js
'use strict';

// 使脚本在未处理的拒绝时崩溃，而不是静默
// 忽略它们。将来，未处理的promise拒绝将使用非零退出代码终止Node.js进程。
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('react-dev-utils/crossSpawn');
const args = process.argv.slice(2);
// 找到命令所在索引
const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['build', 'eject', 'start', 'test'].includes(script)) {
  const result = spawn.sync(
    process.execPath,
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' }
  );
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log('Unknown script "' + script + '".');
  console.log('Perhaps you need to update react-scripts?');
  console.log(
    'See: https://facebook.github.io/create-react-app/docs/updating-to-new-releases'
  );
}
```

### build.js

```js
'use strict';

// 设置为生产环境
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
// 未处理抛异常
process.on('unhandledRejection', err => {
  throw err;
});

// 这里用到了env源码在下面.
require('../config/env');

const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const bfj = require('bfj');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
// 文件打包后 文件大小的一个打印器 在npm run build后会显示大小
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// 检测文件是否存在，不存在退出
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
const config = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
// 检查浏览器的配置文件
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // 清空build目录
    fs.emptyDirSync(paths.appBuild);
    // 拷贝
    copyPublicFolder();
    // 开启打包build函数
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }
	  // 打印文件相关信息在build之后
      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrlOrPath;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printBuildError(err);
      } else {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// 创建生产构建并打印说明
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage +=
            '\nCompileError: Begins at CSS selector ' +
            err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        // Ignore sourcemap warnings in CI builds. See #8227 for more info.
        const filteredWarnings = messages.warnings.filter(
          w => !/Failed to parse source map/.test(w)
        );
        if (filteredWarnings.length) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(filteredWarnings.join('\n\n')));
        }
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };

      if (writeStatsJson) {
        return bfj
          .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
```

### env.js

```js
'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// 先删除paths，环境变量改完后paths可能变了
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean);
// 用来读取数据将其放入process.env中
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});
// 我们支持根据`NODE_PATH`解析模块。
// 这允许您在大型 monorepos 内的导入中使用绝对路径：
// 它的工作方式类似于 Node 本身中的 `NODE_PATH`：
// 请注意，与 Node 不同，仅考虑“NODE_PATH”中的“相对”路径。
// 否则，我们将面临将 Node.js 核心模块而不是 webpack shim 导入到应用程序中的风险。
// 我们还解决了这些问题，以确保使用它们的所有工具都能一致地工作。
// NODE_PATH 是一个用来路径分隔符分开的路径目录的集合
// 用来告诉我们去哪里查找模块
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter) // delimiter windows是分号; mac是冒号:
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
// 获取环境变量
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)// 通过正则过滤
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // 用于确定我们是否在生产模式下运行。
        // 最重要的是，它将 React 切换到正确的模式。
        NODE_ENV: process.env.NODE_ENV || 'development',
        // 对于解析“public”中静态资源的正确路径很有用。
        // 例如，<img src={process.env.PUBLIC_URL + '/img/logo.png'} />。
        // 将图像放入`src`并在代码中`import`它们以获取它们的路径。
        PUBLIC_URL: publicUrl, // 资源访问路径的前缀
        // 我们支持在开发过程中配置sockjs路径名。
        // 这些设置允许开发人员同时运行多个项目。
        // 它们用作连接“主机名”、“路径名”和“端口”
        // 在 webpackHotDevClient 中。 它们被用作 `sockHost`, `sockPath`
        // 和 webpack-dev-server 中的 `sockPort` 选项。
        // 热更新的时候用，像指热更新主机
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST, 
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
        // 是否启用react-refresh。
        // 它在这里定义，因此可以在 webpackHotDevClient 中使用。
        FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
      }
    );
  // 将所有值序列化，以便我们可以将其输入到 webpack DefinePlugin 中
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;

```

### webpack.config.js

展现部分代码，源代码配置等过多

```js
'use strict';

// 一些引入代码过多就不写在这了

module.exports = function (webpackEnv) {
    // 和我们写的一样获取环境
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const isEnvProductionProfile =
        isEnvProduction && process.argv.includes('--profile');

    const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

    const shouldUseReactRefresh = env.raw.FAST_REFRESH;

    return {
        target: ['browserslist'],
        stats: 'errors-warnings',
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? shouldUseSourceMap
                ? 'source-map'
                : false
            : isEnvDevelopment && 'cheap-module-source-map',
        entry: paths.appIndexJs,
        output: {
            path: paths.appBuild,
            pathinfo: isEnvDevelopment,
            filename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].js'
                : isEnvDevelopment && 'static/js/bundle.js',
            chunkFilename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].chunk.js'
                : isEnvDevelopment && 'static/js/[name].chunk.js',
            assetModuleFilename: 'static/media/[name].[hash][ext]',
            publicPath: paths.publicUrlOrPath,
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info =>
                    path
                        .relative(paths.appSrc, info.absoluteResourcePath)
                        .replace(/\\/g, '/')
                : isEnvDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
        },
        cache: {
            type: 'filesystem',
            version: createEnvironmentHash(env.raw),
            cacheDirectory: paths.appWebpackCache,
            store: 'pack',
            buildDependencies: {
                defaultWebpack: ['webpack/lib/'],
                config: [__filename],
                tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f =>
                    fs.existsSync(f)
                ),
            },
        },
        infrastructureLogging: {
            level: 'none',
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {// 解析选项
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        }, // 保持类名
                        keep_classnames: isEnvProductionProfile,
                        keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            // 不设为true的话emoji和regex无法正常压缩
                            ascii_only: true, 
                        },
                    },
                }), 
                // Css
                new CssMinimizerPlugin(),
            ],
        },
        resolve: {
            // 去哪个目录找我们的模块
            modules: ['node_modules', paths.appNodeModules].concat(
                modules.additionalModulePaths || []
            ),
            extensions: paths.moduleFileExtensions
                .map(ext => `.${ext}`)
                .filter(ext => useTypeScript || !ext.includes('ts')),
            alias: {
                'react-native': 'react-native-web',
                // Allows for better profiling with ReactDevTools
                ...(isEnvProductionProfile && {
                    'react-dom$': 'react-dom/profiling',
                    'scheduler/tracing': 'scheduler/tracing-profiling',
                }),
                ...(modules.webpackAliases || {}),
            },
            plugins: [
                new ModuleScopePlugin(paths.appSrc, [
                    paths.appPackageJson,
                    reactRefreshRuntimeEntry,
                    reactRefreshWebpackPluginRuntimeEntry,
                    babelRuntimeEntry,
                    babelRuntimeEntryHelpers,
                    babelRuntimeRegenerator,
                ]),
            ],
        },
        module: {
            // 严格导出模块
            strictExportPresence: true,
            rules: [
                // Handle node_modules packages that contain sourcemaps
                shouldUseSourceMap && {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader'),
                },
                {
                    oneOf: [
                        {
                            test: [/\.avif$/],
                            type: 'asset',
                            mimetype: 'image/avif',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit,
                                },
                            },
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit,
                                },
                            },
                        },
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: paths.appSrc,
                            loader: require.resolve('babel-loader'),
                            options: { //babel macro
                                customize: require.resolve(
                                    'babel-preset-react-app/webpack-overrides'
                                ),
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app'),
                                        // react17 jsx转换规则变了
                                        // 以前：<div></div> React.createElement('div');
                                        // 现在：如下
                                        {
                                            runtime: hasJsxRuntime ? 'automatic' : 'classic',
                                        },
                                    ],
                                ],
                                // @remove-on-eject-begin
                                babelrc: false,
                                configFile: false,
                                cacheIdentifier: getCacheIdentifier(
                                    // 把包名+版本号拼起来成一个标识符
                                    isEnvProduction
                                        ? 'production'
                                        : isEnvDevelopment && 'development',
                                    [
                                        'babel-plugin-named-asset-import',
                                        'babel-preset-react-app',
                                        'react-dev-utils',
                                        'react-scripts',
                                    ]
                                ),
                                // @remove-on-eject-end
                                plugins: [
                                    isEnvDevelopment &&
                                    shouldUseReactRefresh &&
                                    require.resolve('react-refresh/babel'),
                                ].filter(Boolean),
                                cacheDirectory: true, //给webpack做磁盘缓存
                                cacheCompression: false,
                                compact: isEnvProduction,
                            },
                        },
                        // Process any JS outside of the app with Babel.
                        // Unlike the application JS, we only compile the standard ES features.
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [
                                    [
                                        require.resolve('babel-preset-react-app/dependencies'),
                                        { helpers: true },
                                    ],
                                ],
                                cacheDirectory: true,
                                cacheCompression: false,
                                // @remove-on-eject-begin
                                cacheIdentifier: getCacheIdentifier(
                                    isEnvProduction
                                        ? 'production'
                                        : isEnvDevelopment && 'development',
                                    [
                                        'babel-plugin-named-asset-import',
                                        'babel-preset-react-app',
                                        'react-dev-utils',
                                        'react-scripts',
                                    ]
                                ),
                                // @remove-on-eject-end

                                sourceMaps: shouldUseSourceMap,
                                inputSourceMap: shouldUseSourceMap,
                            },
                        },
                        {

                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: 'asset/resource',
                        },
                    ],
                },
            ].filter(Boolean),
        },
        plugins: [
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        template: paths.appHtml,
                    },
                    isEnvProduction
                        ? {
                            minify: {
                                removeComments: true,
                                collapseWhitespace: true,
                                removeRedundantAttributes: true,
                                useShortDoctype: true,
                                removeEmptyAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                keepClosingSlash: true,
                                minifyJS: true,
                                minifyCSS: true,
                                minifyURLs: true,
                            },
                        }
                        : undefined
                )
            ),

            isEnvProduction &&
            shouldInlineRuntimeChunk &&
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),

            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),

            new ModuleNotFoundPlugin(paths.appPath),

            new webpack.DefinePlugin(env.stringified),

            isEnvDevelopment &&
            shouldUseReactRefresh &&
            new ReactRefreshWebpackPlugin({
                overlay: false,
            }),

            isEnvDevelopment && new CaseSensitivePathsPlugin(),
            isEnvProduction &&
            new MiniCssExtractPlugin({

                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),

            new WebpackManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: paths.publicUrlOrPath,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);
                    const entrypointFiles = entrypoints.main.filter(
                        fileName => !fileName.endsWith('.map')
                    );

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    };
                },
            }),

            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),

            isEnvProduction &&
            fs.existsSync(swSrc) &&
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc,
                dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
                exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],

                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            }),
        performance: false,
    };
};
```
