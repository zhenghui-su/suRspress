# 性能优化之 gzip 压缩

有时候我们的文件资源实在太大了比如有个 2000kb，那么 http 传输就会慢

我们的方法是将所有的静态文件进行压缩，以达到减少体积的目的

服务端 -> 压缩文件，客户端收到压缩包 -> 解压缩

过大的时候，一般就会有提示你 chunk 大于 500kb 等等，让你使用几种策略：

> chunk 就是块，块最终会映射成 js 文件，但 chunk 不是 js 文件

- 使用动态导入
- 使用分包策略

我们还有一种操作，使用 gzip 压缩

我们安装一个插件`vite-plugin-compression`，Github 地址：[vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression/blob/main/README.zh_CN.md)

```bash
npm i vite-plugin-compression -D
```

`vite.config.js` 中的配置插件

```js
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [viteCompression()],
});
```

然后我们再打包一次，会发现生成一个 gz 文件

![image-20240515182241028](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240515182241028.png)

然后就是后端或者运维的事情，在客户端请求`index.html`和相关 js 的时候，让他们用我们的 gz 就可以了

服务端读取 gzip 文件（gz 后缀），设置一个响应头 `content-encoding`为 gzip（代表告诉浏览器该文件使用 gzip 压缩过的）

浏览器收到响应结果，发现响应头里有 gzip 对应字段，就解压它得到原来的 js 文件，然后执行

浏览器是需要承担一定的解压时间，如果体积不是很大的话不要用 gzip 压缩
