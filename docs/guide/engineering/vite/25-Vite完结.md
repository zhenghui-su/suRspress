# Vite 完结

本节并不是很重要，主要讲讲部分不重要的配置

## root

- **类型：** `string`
- **默认：** `process.cwd()`

项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。

更多细节请见 [项目根目录](https://cn.vitejs.dev/guide/#index-html-and-project-root)。

## publicDir

- **类型：** `string | false`
- **默认：** `"public"`

作为静态资源服务的文件夹。该目录中的文件在开发期间在 `/` 处提供，并在构建期间复制到 `outDir` 的根目录，并且始终按原样提供或复制而无需进行转换。该值可以是文件系统的绝对路径，也可以是相对于项目根目录的相对路径。

将 `publicDir` 设定为 `false` 可以关闭此项功能。

欲了解更多，请参阅 [`public` 目录](https://cn.vitejs.dev/guide/assets.html#the-public-directory)。

## logLevel

- **类型：** `'info' | 'warn' | 'error' | 'silent'`

调整控制台输出的级别，默认为 `'info'`

## clearScreen

- **类型：** `boolean`
- **默认：** `true`

设为 `false` 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 `--clearScreen false` 设置

## server.port

- **类型：** `number`
- **默认值：** `5173`

指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是开发服务器最终监听的实际端口。

## build.emptyOutDir

- **类型：** `boolean`
- **默认：** 若 `outDir` 在 `root` 目录下，则为 `true`

默认情况下，若 `outDir` 在 `root` 目录下，则 Vite 会在构建时清空该目录。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

## 完结

这里面大部分都是一些边缘化的配置，如果忘记了看看官方文档就知道了：[配置](https://cn.vitejs.dev/config/)

本次 Vite 章节就完结了，共勉！