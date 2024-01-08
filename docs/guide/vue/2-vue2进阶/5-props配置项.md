## props 配置项

- 功能：让组件接收外部传过来的数据

- 传递数据：`<Demo name="xxx"/>`

- 接收数据：

  - 第一种方式（只接收）：`props:['name'] `

  - 第二种方式（限制类型）：`props:{name:String}`

  - 第三种方式（限制类型、限制必要性、指定默认值）：

    ```js
    props:{
    	name:{
    	type:String, //类型
    	required:true, //必要性
    	default:'老王' //默认值
    	}
    }
    ```

> 备注：props 是只读的，Vue 底层会监测你对 props 的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制 props 的内容到 data 中一份，然后去修改 data 中的数据。

`App.vue`文件，传入学生信息

```vue
<template>
  <div>
    <Student name="李四" sex="女" :age="18" />
  </div>
</template>

<script>
import Student from './components/Student';

export default {
  name: 'App',
  components: { Student },
};
</script>
```

`Student.vue`接收参数

```vue
<template>
  <div>
    <h1>{{ msg }}</h1>
    <h2>学生姓名：{{ name }}</h2>
    <h2>学生性别：{{ sex }}</h2>
    <h2>学生年龄：{{ myAge + 1 }}</h2>
    <button @click="updateAge">尝试修改收到的年龄</button>
  </div>
</template>

<script>
export default {
  name: 'Student',
  data() {
    console.log(this);
    return {
      msg: '我是一个Vue新手',
      myAge: this.age,
    };
  },
  methods: {
    updateAge() {
      this.myAge++;
    },
  },
  //简单声明接收
  // props:['name','age','sex']

  //接收的同时对数据进行类型限制
  /* props:{
		name:String,
		age:Number,
		sex:String
	} */

  //接收的同时对数据：进行类型限制+默认值的指定+必要性的限制
  props: {
    name: {
      type: String, //name的类型是字符串
      required: true, //name是必要的
    },
    age: {
      type: Number,
      default: 99, //默认值
    },
    sex: {
      type: String,
      required: true,
    },
  },
};
</script>
```
