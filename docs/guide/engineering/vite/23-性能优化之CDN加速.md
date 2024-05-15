# 性能优化之CDN加速

CDN：content delivery network 内容分发网络

我们举个例子，我们所有依赖以及文件在我们进行打包后会放到服务器上

然后我们服务器在深圳，而你在纽约，然后访问网站，就会发现有点卡

而CDN就是将我们的第三方模块全部写成CDN的形式，然后保证我们自己代码的一个小体积（体积小服务器和客户端的传输压力就没那么大）

cdn  ---> 内容分发 dns

其实就是一个网址：比如下面这个

`https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`

你要加载lodash，然后你在纽约，它就会根据你的位置去找更近的网络分发给你

由于你的第三方模块是cdn加载的，所以你自身代码的体积就小了，所以你访问速度就快了

## 使用 CDN

之前我们打包的时候，做了分包，但lodash依旧是一个文件，如果放到服务器，加载依旧需要不小时间，这时候我们使用cdn来试试

我们使用一个插件：[vite-plugin-cdn-import](https://github.com/mmf-fe/vite-plugin-cdn-import/blob/HEAD/README.zh-CN.md)，先安装：

```bash
npm i vite-plugin-cdn-import --save-dev
```

然后我们在 vite.config.js 中使用它：

```js
// vite.config.js
import cdn from 'vite-plugin-cdn-import'

export default {
    plugins: [
        cdn({
            modules: [
                {
                    name: 'lodash',
                    var: '_',
                    path: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
                }
            ],
        }),
    ],
}
```

然后我们打包看一下，这是之前的：



这是之后的：



这个插件还有预设的几个常用的npm包，也就是说我们可以不用写cdn地址了，比如react相关

```js
// vite.config.js
import cdn from 'vite-plugin-cdn-import'

export default {
    plugins: [
        cdn({
            modules: ['react', 'react-dom'],
        }),
    ],
}
```

预设的 npm 包如下：

react、react-dom、react-router-dom、antd、vue、vue2、vue-router、vue-router@3、moment、dayjs、axios、lodash