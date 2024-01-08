## scoped 样式

- 作用：让样式在局部生效，防止冲突
- 写法：`<style scoped>`

在`School`组件写样式，中间的 script 部分省略

```vue
<template>
  <div class="demo">
    <h2 class="title">学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
  </div>
</template>
<style scoped>
.demo {
  background-color: skyblue;
}
</style>
```

在`Student`组件写样式，中间 script 部分省略，这里加上了`lang="less"`表示使用 less

> 此时会报错，需要下载`less-loader`，在终端输入如下代码安装
>
> ```bash
> yarn add less-loader
> ```

这里两个类名一样冲突了，School 的背景色变为粉色，因为在 App 中我们后引入 Student

但是如果我们在 style 中加上**scoped**，因为**scoped**让样式在局部生效，就会发现不冲突了

```vue
<template>
  <div class="demo">
    <h2 class="title">学生姓名：{{ name }}</h2>
    <h2 class="name">学生性别：{{ sex }}</h2>
  </div>
</template>
<style lang="less" scoped>
.demo {
  background-color: pink;
  .name {
    font-size: 40px;
  }
}
</style>
```

在`App`组件中写样式，中间 script 部分省略

```vue
<template>
  <div>
    <h1 class="title">你好啊</h1>
    <School />
    <Student />
  </div>
</template>
<style scoped>
.title {
  color: red;
}
</style>
```
