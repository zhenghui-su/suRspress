## render 函数

之前我们在`main.js`中出现了一个我们不认识的`render`函数，这地方我们不认识，如果我们使用之前的方法

```js
new Vue({
  el: '#app',
  template: `<App></App>`,
  components: { App },
});
```

会发现出现报错，因为该处引入的是 Vue 是一个残缺的，它缺少了模板解析器，具体到`vue/dist/vue.runtime.esm.js`，在 dist 目录下的 vue.js 才是无缺的，其他都是为了精简产生的

想要解决该报错，第一个解决方法是引入无缺的`vue.js`

```js
import Vue from 'vue/dist/vue.js';
```

第二个解决方法就是使用`render`函数

```js
new Vue({
  el: '#app',
  render(createElement) {
    return createElement('h1', '你好啊');
  },
});
```

但由于没有用到 this，且只有一行，然后我们创建的是`App`组件，就可以简化为下面

```js
new Vue({
  el: '#app',
  render: (h) => h(App),
});
```

### **关于不同版本的 Vue**

- `vue.js`与`vue.runtime.xxx.js`的区别：

  - `vue.js`是完整版的 Vue，包含**核心功能**和**模板解析器**

  - `vue.runtime.xxx.js`是运行版的 Vue，只包含**核心功能**，没有**模板解析器**

- 因为`vue.runtime.xxx.js`没有模板解析器，所以不能使用`template`配置项，需要使用`render`函数接收到的`createElement`函数去指定具体内容

### 配置文件

如果需要自定义脚手架的配置，则需要在根目录下创建`vue.config.js`文件

```js
module.exports = {
  pages: {
    index: {
      // 入口
      entry: 'src/main.js',
    },
  },
  lintOnSave: false, // 关闭语法检查
};
```

1. 在终端输入`vue inspect > output.js`查看 Vue 脚手架的默认配置
2. 使用`vue.config.js`对脚手架进行个性化定制

> 详情见：https://cli.vuejs.org/zh
