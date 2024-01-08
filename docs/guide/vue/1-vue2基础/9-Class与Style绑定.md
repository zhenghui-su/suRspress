## Class 与 Style 绑定

- 绑定样式
  - class 样式写法：class="xxx" xxx 可以是字符串、对象、数组
    - 字符串写法适用于：类名不确定，要动态获取
    - 数组写法适用于：要绑定多个样式，个数不确定，名字也不确定
    - 对象写法适用于：要绑定多个样式，个数确定、名字也确定，但要动态决定用不用
  - style 样式写法
    - :style="{fontSize: xxx}"其中 xxx 是动态值
    - :style="[a,b]"其中 a、b 是样式对象

如下代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>绑定样式</title>
    <style>
      .basic {
        width: 400px;
        height: 100px;
        border: 1px solid black;
      }

      .happy {
        border: 4px solid red;
        background-color: rgba(255, 255, 0, 0.644);
        background: linear-gradient(30deg, yellow, pink, orange, yellow);
      }
      .sad {
        border: 4px dashed rgb(2, 197, 2);
        background-color: gray;
      }
      .normal {
        background-color: skyblue;
      }

      .a1 {
        background-color: yellowgreen;
      }
      .a2 {
        font-size: 30px;
        text-shadow: 2px 2px 10px red;
      }
      .a3 {
        border-radius: 20px;
      }
    </style>
    <script type="text/javascript" src="../js/vue.js"></script>
  </head>
  <body>
    <!-- 准备好一个容器-->
    <div id="root">
      <!-- 绑定class样式--字符串写法-->
      <div class="basic" :class="mood" @click="changeMood">{{name}}</div>
      <br /><br />
      <!-- 绑定class样式--数组写法-->
      <div class="basic" :class="classArr">{{name}}</div>
      <br /><br />
      <!--绑定class样式--对象写法-->
      <div class="basic" :class="classObj">{{name}}</div>
      <br /><br />

      <!-- 绑定style样式--对象写法 -->
      <div class="basic" :style="styleObj">{{name}}</div>
      <br /><br />
      <!-- 绑定style样式--数组写法 -->
      <div class="basic" :style="styleArr">{{name}}</div>
    </div>
  </body>
  <script type="text/javascript">
    Vue.config.productionTip = false;

    const vm = new Vue({
      el: '#root',
      data: {
        name: 'Vue',
        mood: 'normal',
        classArr: ['a1', 'a2', 'a3'],
        classObj: {
          a1: false,
          a2: false,
        },
        styleObj: {
          fontSize: '40px',
          color: 'red',
        },
        styleObj2: {
          backgroundColor: 'orange',
        },
        styleArr: [
          {
            fontSize: '40px',
            color: 'blue',
          },
          {
            backgroundColor: 'gray',
          },
        ],
      },
      methods: {
        changeMood() {
          const arr = ['happy', 'sad', 'normal'];
          const index = Math.floor(Math.random() * 3);
          this.mood = arr[index];
        },
      },
    });
  </script>
</html>
```
