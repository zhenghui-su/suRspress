## 2-npm 和 package.json

### npm

`npm`（全称 Node Package Manager）是 Node.js 的包管理工具，它是一个基于命令行的工具，用于帮助开发者在自己的项目中安装、升级、移除和管理依赖项。

> [官网地址](https://www.npmjs.com/)

- 类似于 `PHP` 的工具：`Composer`。它是 PHP 的包管理器，可以用于下载、安装和管理 PHP 的依赖项，类似于 npm。
- 类似于 `Java` 的工具：`Maven`。它是 Java 的构建工具和项目管理工具，可以自动化构建、测试和部署 Java 应用程序，类似于 npm 和 webpack 的功能。
- 类似于 `Python` 的工具：`pip`。它是 Python 的包管理器，可以用于安装和管理 Python 的依赖项，类似于 npm。
- 类似于 `Rust` 的工具：`Cargo`。它是 Rust 的包管理器和构建工具，可以用于下载、编译和管理 Rust 的依赖项，类似于 npm 和 Maven 的功能。

### npm 命令

1. **`npm init`**：初始化一个新的 npm 项目，创建 package.json 文件。

2. **`npm install`**：安装一个包或一组包，并且会在当前目录存放一个 node_modules。

   > npm install 安装模块的时候一般是扁平化安装的，但是有时候出现嵌套的情况是因为版本不同
   >
   > A 依赖 C 1.0 B 依赖 C 1.0 D 依赖 C 2.0,
   >
   > 此时 C 1.0 就会被放到 A B 的 node_moduels, C 2.0 会被放入 D 模块下面的 node_moduels

3. **`npm install <package-name>`**：安装指定的包。

   > 简写 npm i，通过在包后`@版本号`来安装指定版本

4. **`npm install <package-name> --save`**：安装指定的包，并将其添加到 package.json 文件中的**依赖列表**中。(如`Vue`，是生产环境所需要的依赖)

5. **`npm install <package-name> --save-dev`**：安装指定的包，并将其添加到 package.json 文件中的**开发依赖列表**中。(如`webpack`，是开发环境所需要的依赖)

6. **`npm install -g <package-name>`**：全局安装指定的包。

7. `npm update <package-name>`：更新指定的包。

8. `npm uninstall <package-name>`：卸载指定的包。

9. **`npm run <script-name>`**：执行 package.json 文件中定义的脚本命令。

10. `npm search <keyword>`：搜索 npm 库中包含指定关键字的包。

11. `npm info <package-name>`：查看指定包的详细信息。

12. `npm list`：列出当前项目中安装的所有包。

13. `npm outdated`：列出当前项目中需要更新的包。

14. `npm audit`：检查当前项目中的依赖项是否存在安全漏洞。

15. `npm publish`：发布自己开发的包到 npm 库中。

16. `npm login`：登录到 npm 账户。

17. `npm logout`：注销当前 npm 账户。

18. `npm link`: 将本地模块链接到全局的 `node_modules` 目录下

19. **`npm config list` **用于列出所有的 npm 配置信息。执行该命令可以查看当前系统和用户级别的所有 npm 配置信息，以及当前项目的配置信息（如果在项目目录下执行该命令）

20. **`npm get registry`** 用于获取当前 npm 配置中的 registry 配置项的值。registry 配置项用于指定 npm 包的下载地址，如果未指定，则默认使用 npm 官方的包注册表地址

21. **`npm set registry` `npm config set registry <registry-url>` **命令，将 registry 配置项的值修改为指定的 `<registry-url>` 地址

### Package json

执行`npm init`便可以初始化一个`package.json`文件

1. `name`：项目名称，必须是唯一的字符串，通常采用小写字母和连字符的组合。

2. `version`：项目版本号，通常采用语义化版本号规范。

   > version 是三段式版本号一般是 1.0.0 大版本号、次版本号 、修订号
   >
   > - 大版本号一般是有重大变化才会升级
   > - 次版本号一般是增加功能进行升级
   > - 修订号一般是修改 bug 进行升级

3. `description`：项目描述。

4. `main`：项目的主入口文件路径，通常是一个 JavaScript 文件。

5. `keywords`：项目的关键字列表，方便他人搜索和发现该项目。

6. `author`：项目作者的信息，包括姓名、邮箱、网址等。

7. `license`：项目的许可证类型，可以是自定义的许可证类型或者常见的开源许可证（如 MIT、Apache 等）。

8. `dependencies`：项目所依赖的包的列表，这些包会在项目运行时自动安装。

9. `devDependencies`：项目开发过程中所需要的包的列表，这些包不会随项目一起发布，而是只在开发时使用。

10. `peerDependencies`：项目的**同级依赖**，即项目所需要的模块被其他模块所依赖。

    > 一般是给编写插件的人员使用的，如在`devDependencies`有一个自己的插件`vite-plugin-chen`，但它不能凭空运行，需要依赖`vite`环境，这时就需要添加`"vite":"^2.0.0"`

11. `scripts`：定义了一些脚本命令，比如启动项目、运行测试等。

12. `repository`：项目代码仓库的信息，包括类型、网址等。

13. `bugs`：项目的 bug 报告地址。

14. `homepage`：项目的官方网站地址或者文档地址。
