## 初识 Vue

### Hello 小案例

1. 想让 Vue 工作，就必须创建一个 Vue 实例，且要传入一个配置对象
2. root 容器里的代码依然符合 html 规范，不过混入了一些特殊的 Vue 语法
3. root 容器里的代码被称为 Vue 模版

html 代码如下

```html
<!-- 引入Vue-->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
<!-- html文件中准备一个根容器-->
<div id="root">
  <h1>Hello {{name}}</h1>
  <!-- {{}} 为插值语法，解析了data中的name-->
</div>
<script type="text/javascript">
  // 设置阻止Vue在启动时生成生产提示
  Vue.config.producitonTip = false;
  // 创建Vue实例
  new Vue({
    el: '#root', // el用于指定当前Vue实例为哪个容器服务，值通常为css选择器字符串
    data: {
      // data中用于存储数据，数据供el所指定的容器去使用，值暂时先写成对象
      name: 'Vue',
    },
  });
</script>
```

### 分析 Hello 小案例

- 如果有两个容器 root 绑定，一个 Vue 实例只会解析一个

```html
<div class="root">
  <h1>Hello {{name}}</h1>
</div>
<div class="root">
  <h1>Hello {{name}}</h1>
</div>
<script type="text/javascript">
  new Vue({
    el: '.root',
    data: {
      name: 'Vue',
    },
  });
</script>
```

- 如果有两个 Vue 实例解析一个容器，第一个实例接管了 root，第二个实例没有作用

```html
<div id="root">
  <h1>Hello {{name}}</h1>
</div>
<script type="text/javascript">
  new Vue({
    el: '#root',
    data: {
      name: 'Vue',
    },
  });
  new Vue({
    el: '#root',
    data: {
      address: 'Git',
    },
  });
</script>
```

- 容器和实例的关系为一对一，不能一对多或者多对一

> 在{{}}里面写的是 JS 表达式
>
> 注意区分：JS 表达式和 JS 代码(语句)
>
> 1.  表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
>
>     (1). a
>
>     (2). a+b
>
>     (3). demo(1)
>
>     (4). x === y ? 'a' : 'b'
>
> 2.  JS 代码(语句)
>
>     (1). if(){}
>
>     (2). for(){}

1. 真实开发中只有一个 Vue 实例，并且会配合着组件一起使用
2. 在{{xxx}}中 xxx 可以自动读取到 data 中的所有属性
3. 一旦 data 中的数据发生改变，那么页面中用到该数据的地方也会自动更新
