# Vite 配置跨域

为什么会发生跨域？

因为浏览器的同源策略【仅在浏览器发生，是浏览器的规则】：http交互默认情况下只能在同协议同域名同端口的两台终端进行

比如：`https://www.baidu.com:443/index.html`和`htts://www.360.com:443/api/getUserInfo`就不能通信，因为不同域名，除非客户端得到了服务器的放行

跨域就是当 A 源浏览器网页 向 B 源服务器地址（不满足同源策略，满足同源限制）请求对应信息，就会产生跨域，跨域请求默认情况下会被浏览器拦截，除非对应的请求服务器放行A源，允许拿B源的东西

> 跨域限制是服务器已经响应了东西，但是浏览器不给你，不是说服务器没有响应东西

## 解决跨域

### 开发时解决

开发时，我们一般就利用构建工具或者脚手架或者第三方库的proxy 代理配置，或者我们自己搭建一个开发服务器

这种方法仅限于在开发的时候解决跨域，我们可以在 Vite 的配置中配置

```js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
  },
})
```

以里面的api为例，以后在遇到/api开头的请求就会走这里

它的原理就是代理，通过服务器来发请求，服务器和服务器之间是没有跨域问题的

- 本来我们要请求360 我直接请求的话 一定会被浏览器拦截
- 我自己开一个服务器 -- 我先请求自己的服务器，浏览器一看你请求自己的就放行了
- 请求阶段无论是请求自己的还是360都会放行
- 请求到了我们的服务器，然后用我们的服务器去请求360的服务器，服务器与服务器之间没有跨域限制，请求就成功了
- 我们服务器拿到了结果再把结果给我们的客户端，浏览器一看你是自己的服务器就不拦截了，于是我们就拿到了结果

### 生产时解决

那我们生产环境没有这个开发服务器了，就还是会出现跨域，如何解决呢？

生产环境一般几种解决方法：

- nginx：代理服务器，和开发服务器同理
- 服务器将后端和前端配置在一个域下
- 配置身份标记：
  - Access-Control-Allow-Origin：代表哪些域是可以访问的，配置了浏览器就不会拦截了