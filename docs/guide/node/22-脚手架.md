## 22-脚手架

### 编写自己的脚手架

什么是脚手架呢？如`vue-cli`、`Create React App`、`Angular CLI`，这一系列帮我们创建模板的工具

编写自己的脚手架是指创建一个**定制化**的工具，用于快速生成项目的基础结构和代码文件，以及提供一些常用的命令和功能。通过编写自己的脚手架，可以定义项目的目录结构、文件模板，管理项目的依赖项，生成代码片段，以及提供命令行接口等功能

- 项目结构：脚手架定义了项目的目录结构，包括源代码、配置文件、静态资源等。

- 文件模板：脚手架提供了一些预定义的文件模板，如 HTML 模板、样式表、配置文件等，以加快开发者创建新文件的速度。

- 命令行接口：脚手架通常提供一个命令行接口，通过输入命令和参数，开发者可以执行各种任务，如创建新项目、生成代码文件、运行测试等。

- 依赖管理：脚手架可以帮助开发者管理项目的依赖项，自动安装和配置所需的库和工具。

- 代码生成：脚手架可以生成常见的代码结构，如组件、模块、路由等，以提高开发效率。

- 配置管理：脚手架可以提供一些默认的配置选项，并允许开发者根据需要进行自定义配置

![image-20231219160322031](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231219160322031.png)

### 工具介绍

我们来学习一下所需要用到的第三方库，通过`npm init`生成初始的 package，然后`npm i`下载下面的库

- **`commander`**

> Commander 是一个用于**构建命令行工具**的 npm 库。它提供了一种简单而直观的方式来创建命令行接口，并处理命令行参数和选项。使用 Commander，你可以轻松定义命令、子命令、选项和帮助信息。它还可以处理命令行的交互，使用户能够与你的命令行工具进行交互

- **`inquirer`**

> Inquirer 是一个强大的**命令行交互工具**，用于与用户进行交互和收集信息。它提供了各种丰富的交互式提示（如输入框、选择列表、确认框等），可以帮助你构建灵活的命令行界面。通过 Inquirer，你可以向用户提出问题，获取用户的输入，并根据用户的回答采取相应的操作。

- **`ora`**

> Ora 是一个用于在**命令行界面显示加载动画**的 npm 库。它可以帮助你在执行耗时的任务时提供一个友好的加载状态提示。Ora 提供了一系列自定义的加载动画，如旋转器、进度条等，你可以根据需要选择合适的加载动画效果，并在任务执行期间显示对应的加载状态。

- **`download-git-repo`**

> Download-git-repo 是一个用于**下载 Git 仓库的 npm 库**。它提供了一个简单的接口，可以方便地从远程 Git 仓库中下载项目代码。你可以指定要下载的仓库和目标目录，并可选择指定分支或标签。Download-git-repo 支持从各种 Git 托管平台（如 GitHub、GitLab、Bitbucket 等）下载代码。

### 编写代码

#### index.js

第一行要写 `#!/usr/bin/env node`

这是一个 特殊的注释 用于告诉操作系统用 node 解释器去执行这个文件，而不是显式地调用 `node` 命令

```js
#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'node:fs';
import { checkPath, downloadTemp } from './utils.js';
let json = fs.readFileSync('./package.json', 'utf-8');
json = JSON.parse(json);

program.version(json.version); //创建版本号
//添加create 命令 和 别名crt 以及描述 以及 执行完成之后的动作
program
  .command('create <project>')
  .alias('ctr')
  .description('create a new project')
  .action((project) => {
    //命令行交互工具
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'project name',
          default: project,
        },
        {
          type: 'confirm',
          name: 'isTs',
          message: '是否支持typeScript',
        },
      ])
      .then((answers) => {
        if (checkPath(answers.projectName)) {
          console.log('文件已存在');
          return;
        }

        if (answers.isTs) {
          downloadTemp('ts', answers.projectName);
        } else {
          downloadTemp('js', answers.projectName);
        }
      });
  });

program.parse(process.argv);
```

#### utils.js

```js
import fs from 'node:fs';
import download from 'download-git-repo';
import ora from 'ora';
const spinner = ora('下载中...');
//验证路径
export const checkPath = (path) => {
  return fs.existsSync(path);
};

//下载
export const downloadTemp = (branch, project) => {
  spinner.start();
  return new Promise((resolve, reject) => {
    download(
      `direct:https://gitee.com/chinafaker/vue-template.git#${branch}`,
      project,
      { clone: true },
      function (err) {
        if (err) {
          reject(err);
          console.log(err);
        }
        resolve();
        spinner.succeed('下载完成');
      }
    );
  });
};
```

#### package.json

加入如下的配置

```json
"type": "module", //使用import需要设置这个,写入package记得去注释
"bin": {
  "test-cli": "src/index.js"
}
```

配置完成之后 需要执行`npm link`，用于生成软连接挂载到全局，便可以全局执行 vue-cli 这个命令

![image-20231219162059321](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231219162059321.png)

然后执行命令：

![image-20231219210802350](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231219210802350.png)

生成如下：
![image-20231219210742294](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231219210742294.png)
