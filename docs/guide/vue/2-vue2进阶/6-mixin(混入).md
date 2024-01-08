## mixin(混入)

- 功能：可以把多个组件共用的配置提取成一个混入对象

- 使用方式：

  - 第一步定义混合：

  ```
  {
      data(){....},
      methods:{....}
      ....
  }
  ```

  - 第二步使用混入：

    ​ 全局混入：`Vue.mixin(xxx)`
    ​ 局部混入：`mixins:['xxx']	`

**需求：需要将共用的配置提取出来**

`School.vue`文件

```vue
<template>
  <div>
    <h2 @click="showName">学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
  </div>
</template>

<script>
//引入一个hunhe
// import {hunhe,hunhe2} from '../mixin'

export default {
  name: 'School',
  data() {
    return {
      name: 'Vue',
      address: 'GitHub',
      x: 666,
    };
  },
  // mixins:[hunhe,hunhe2],
};
</script>
```

`Student.vue`文件

```vue
<template>
  <div>
    <h2 @click="showName">学生姓名：{{ name }}</h2>
    <h2>学生性别：{{ sex }}</h2>
  </div>
</template>

<script>
// import {hunhe,hunhe2} from '../mixin'

export default {
  name: 'Student',
  data() {
    return {
      name: '张三',
      sex: '男',
    };
  },
  // mixins:[hunhe,hunhe2]
};
</script>
```

创建`mixin.js`文件，在`main.js`文件的同级目录下

```js
export const hunhe = {
  methods: {
    showName() {
      alert(this.name);
    },
  },
  mounted() {
    console.log('你好啊！');
  },
};
export const hunhe2 = {
  data() {
    return {
      x: 100,
      y: 200,
    };
  },
};
```

上面我将局部引入给注释，下面在`main.js`中可以进行全局引入

```js
//引入Vue
import Vue from 'vue';
//引入App
import App from './App.vue';
import { hunhe, hunhe2 } from './mixin';
//关闭Vue的生产提示
Vue.config.productionTip = false;
Vue.mixin(hunhe);
Vue.mixin(hunhe2);
//创建vm
new Vue({
  el: '#app',
  render: (h) => h(App),
});
```
