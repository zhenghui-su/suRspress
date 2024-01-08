## ref 属性

想要获取 dom 元素，可以采用`ref`属性

- 被用来给元素或子组件注册引用信息（id 的替代者）

- 应用在 html 标签上获取的是真实 DOM 元素，应用在组件标签上是组件实例对象（vc）

- 使用方式：

  - 打标识：`<h1 ref="xxx">.....</h1>` 或 `<School ref="xxx"></School>`

  - 获取：`this.$refs.xxx`

```vue
<template>
  <div>
    <h1 v-text="msg" ref="title"></h1>
    <button ref="btn" @click="showDOM">点我输出上方的DOM元素</button>
    <School ref="sch" />
  </div>
</template>

<script>
//引入School组件
import School from './components/School';

export default {
  name: 'App',
  components: { School },
  data() {
    return {
      msg: '欢迎学习Vue！',
    };
  },
  methods: {
    showDOM() {
      console.log(this.$refs.title); //真实DOM元素
      console.log(this.$refs.btn); //真实DOM元素
      console.log(this.$refs.sch); //School组件的实例对象（vc）
    },
  },
};
</script>
```
