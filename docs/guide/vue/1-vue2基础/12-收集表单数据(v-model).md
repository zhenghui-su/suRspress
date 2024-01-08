## 收集表单数据(v-model)

收集表单数据：

- 若:`<input type="text"/>`，则 v-model 收集的是 value 值，用户输入的就是 value 值。

- 若:`<input type="radio"/>`，则 v-model 收集的是 value 值，且要给标签配置 value 值。

- 若:`<input type="checkbox"/>`

  - 没有配置 input 的 value 属性，那么收集的就是 checked（勾选 or 未勾选，是布尔值）

  - 配置 input 的 value 属性:

    - v-model 的初始值是非数组，那么收集的就是 checked（勾选 or 未勾选，是布尔值）

    - v-model 的初始值是数组，那么收集的的就是 value 组成的数组

- v-model 的三个修饰符：

  - lazy：失去焦点再收集数据

  - number：输入字符串转为有效的数字

  - trim：输入首尾空格过滤

效果

![image-20231010202527636](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231010202527636.png)

代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>收集表单数据</title>
    <script type="text/javascript" src="../js/vue.js"></script>
  </head>

  <body>
    <!-- 准备好一个容器-->
    <div id="root">
      <form @submit.prevent="demo">
        账号：<input type="text" v-model.trim="userInfo.account" /> <br /><br />
        密码：<input type="password" v-model="userInfo.password" /> <br /><br />
        年龄：<input type="number" v-model.number="userInfo.age" /> <br /><br />
        性别： 男<input
          type="radio"
          name="sex"
          v-model="userInfo.sex"
          value="male"
        />
        女<input
          type="radio"
          name="sex"
          v-model="userInfo.sex"
          value="female"
        />
        <br /><br />
        爱好： 学习<input
          type="checkbox"
          v-model="userInfo.hobby"
          value="study"
        />
        打游戏<input type="checkbox" v-model="userInfo.hobby" value="game" />
        吃饭<input type="checkbox" v-model="userInfo.hobby" value="eat" />
        <br /><br />
        所属校区
        <select v-model="userInfo.city">
          <option value="">请选择校区</option>
          <option value="beijing">北京</option>
          <option value="shanghai">上海</option>
          <option value="shenzhen">深圳</option>
          <option value="wuhan">武汉</option>
        </select>
        <br /><br />
        其他信息：
        <textarea v-model.lazy="userInfo.other"></textarea> <br /><br />
        <input type="checkbox" v-model="userInfo.agree" />阅读并接受<a
          href="http://www.github.com"
          >《用户协议》</a
        >
        <button>提交</button>
      </form>
    </div>
  </body>

  <script type="text/javascript">
    Vue.config.productionTip = false;

    new Vue({
      el: '#root',
      data: {
        userInfo: {
          account: '',
          password: '',
          age: 18,
          sex: 'female',
          hobby: [],
          city: 'beijing',
          other: '',
          agree: '',
        },
      },
      methods: {
        demo() {
          console.log(JSON.stringify(this.userInfo));
        },
      },
    });
  </script>
</html>
```
