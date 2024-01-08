## Todo-list 案例

下面我们做一个小案例将前面知识练习一下

### 拆分组件和功能描述

功能描述：类似待做事项的效果，可以添加，删除，完成事件

拆分组件如下

![image-20231023213440032](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231023213440032.png)

### 静态组件撰写

由于 Header 与 html 标签的`<header></header>`有冲突，换为`MyHeader`其他同理

创建`MyHeader.vue`、`MyList.vue`、`MyItem.vue`、`MyFooter.vue`四个文件并在`App.vue`中引入三个，在 List 中引入 Item

html 的结构，先自己尝试将 html 中的放入对应组件中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Vue</title>

    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root">
      <div class="todo-container">
        <div class="todo-wrap">
          <div class="todo-header">
            <input type="text" placeholder="请输入你的任务名称，按回车键确认" />
          </div>
          <ul class="todo-main">
            <li>
              <label>
                <input type="checkbox" />
                <span>xxxxx</span>
              </label>
              <button class="btn btn-danger" style="display:none">删除</button>
            </li>
            <li>
              <label>
                <input type="checkbox" />
                <span>yyyy</span>
              </label>
              <button class="btn btn-danger" style="display:none">删除</button>
            </li>
          </ul>
          <div class="todo-footer">
            <label>
              <input type="checkbox" />
            </label>
            <span> <span>已完成0</span> / 全部2 </span>
            <button class="btn btn-danger">清除已完成任务</button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

css 样式如下，此处我们是练习组件，样式可以注释直接复制然后拆到对应组件

```css
/*base*/
body {
  background: #fff;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/*header*/
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
}

/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}

/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
```

在`MyHeader.vue`中，我们拆分的如下

```vue
<template>
  <div class="todo-header">
    <input type="text" placeholder="请输入你的任务名称，按回车键确认" />
  </div>
</template>

<script>
export default {
  name: 'MyHeader',
};
</script>

<style scoped>
/*header*/
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
}
</style>
```

在`MyList.vue`中，代码如下

```vue
<template>
  <ul class="todo-main">
    <MyItem />
    <MyItem />
  </ul>
</template>

<script>
import MyItem from './MyItem.vue';
export default {
  name: 'MyList',
  components: { MyItem },
};
</script>

<style scoped>
/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
```

在`MyItem.vue`中，代码如下

```vue
<template>
  <li>
    <label>
      <input type="checkbox" />
      <span>xxxxx</span>
    </label>
    <button class="btn btn-danger" style="display:none">删除</button>
  </li>
</template>

<script>
export default {
  name: 'MyItem',
};
</script>

<style scoped>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
</style>
```

在`MyFooter.vue`中，代码如下

```vue
<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox" />
    </label>
    <span> <span>已完成0</span> / 全部2 </span>
    <button class="btn btn-danger">清除已完成任务</button>
  </div>
</template>

<script>
export default {
  name: 'MyFooter',
};
</script>

<style scoped>
/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
```

在`App.vue`中，代码如下

```vue
<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader />
        <MyList />
        <MyFooter />
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader.vue';
import MyList from './components/MyList.vue';
import MyFooter from './components/MyFooter.vue';

export default {
  name: 'App',
  components: {
    MyHeader,
    MyList,
    MyFooter,
  },
};
</script>
<style>
/*base*/
body {
  background: #fff;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}

.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
```

至此静态的组件就已完成了，怎么样呢，你划分的如何呢？具体效果图如下

![image-20231023221556783](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231023221556783.png)

### 初始化列表

在 MyList 配置 todos 数据，根据数据配置 MyItem，此处样式不再写入避免过长

```vue
<template>
  <ul class="todo-main">
    <MyItem v-for="todoObj in todos" :key="todoObj.id" :todo="todoObj" />
  </ul>
</template>

<script>
import MyItem from './MyItem.vue';
export default {
  name: 'MyList',
  components: { MyItem },
  data() {
    return {
      todos: [
        { id: '001', title: '吃饭', completed: true },
        { id: '002', title: '睡觉', completed: false },
        { id: '003', title: '学习', completed: true },
      ],
    };
  },
};
</script>
```

在 MyItem 接收 props，并动态显示 todo 对象和是否勾选

```vue
<template>
  <li>
    <label>
      <!-- 动态是否勾选,根据prop传入决定 -->
      <input type="checkbox" :checked="todo.completed" />
      <span>{{ todo.title }}</span>
    </label>
    <button class="btn btn-danger" style="display:none">删除</button>
  </li>
</template>

<script>
export default {
  name: 'MyItem',
  // 声明接收todo对象
  props: ['todo'],
};
</script>
```

> 此处其实有点不合理，但我们从简，先这样写

### 添加

由于我们目前学到的知识无法让 MyHeader 中添加的 todo 传入到兄弟组件 MyList，所以我们需要将 todos 数组放到 App 下

`App.vue`修改，MyList 中的 data 剪切走

```vue
<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader />
        <MyList :todos="todos" />
        <MyFooter />
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from './components/MyHeader.vue';
import MyList from './components/MyList.vue';
import MyFooter from './components/MyFooter.vue';

export default {
  name: 'App',
  components: {
    MyHeader,
    MyList,
    MyFooter,
  },
  data() {
    return {
      todos: [
        { id: '001', title: '吃饭', completed: true },
        { id: '002', title: '睡觉', completed: false },
        { id: '003', title: '学习', completed: true },
      ],
    };
  },
};
</script>
```

`MyList.vue`修改，接收 App 传入的 todos

```vue
<template>
  <ul class="todo-main">
    <MyItem v-for="todoObj in todos" :key="todoObj.id" :todo="todoObj" />
  </ul>
</template>

<script>
import MyItem from './MyItem.vue';
export default {
  name: 'MyList',
  components: { MyItem },
  props: ['todos'],
};
</script>
```

此时我们就可以将 MyHeader 添加的 todo 传给 App，通过 App 传给 MyList

现在`App.vue`，添加方法 addTodo 接收，并传给 MyHeader，此处是改动上面部分

```vue
<MyHeader :addTodo="addTodo" />
... methods: { addTodo(todoObj) { this.todos.unshift(todoObj) } }
```

`MyHeader.vue`接收方法，并通过 this 调用把 todo 传给 App 组件

在 MyHeader 中添加事件，通过 event 来获取输入值（也可用 v-model 来做），而 id 我们可以通过一个库(nanoid)来生成 id

```vue
<template>
  <div class="todo-header">
    <input
      type="text"
      placeholder="请输入你的任务名称，按回车键确认"
      @keyup.enter="add"
    />
  </div>
</template>

<script>
import { nanoid } from 'nanoid';
export default {
  name: 'MyHeader',
  props: ['addTodo'],
  methods: {
    add(e) {
      //校验数据
      if (!e.target.value.trim()) return alert('输入不能为空');
      // 将用户的输入包装成一个todo对象
      const todoObj = { id: nanoid(), title: e.target.value, completed: false };
      // 将todo对象传给App组件
      this.addTodo(todoObj);
      e.target.value = '';
    },
  },
};
</script>
```

### 勾选

在 App 中声明方法并将其传入 MyList，然后 MyList 传入 MyItem

```js
checkTodo(id) {
      this.todos.forEach(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed
        }
      })
    }
```

在 MyItem 中，需要绑定事件，以便修改 completed

```vue
<template>
  <li>
    <label>
      <!-- 动态是否勾选,根据prop传入决定 -->
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleCheck(todo.id)"
      />
      <span>{{ todo.title }}</span>
    </label>
    <button class="btn btn-danger" style="display: none">删除</button>
  </li>
</template>

<script>
export default {
  name: 'MyItem',
  // 声明接收todo对象
  props: ['todo', 'checkTodo'],
  methods: {
    handleCheck(id) {
      // 发送事件,通知App组件将对应的todo对象的completed属性修改为相反值
      this.checkTodo(id);
    },
  },
};
</script>
```

但这种写法会发现需要传两次 props，我们可以换一个写法，将`:checked`和`@change`合并起来，用`v-model`实现，但不建议这样写，因为这样是修改了 props

```html
<input type="checkbox" v-model="todo.completed" />
```

### 删除

在 MyItem 修改 li 样式，让其鼠标悬浮时候有背景色和将按钮显示

```css
li:hover {
  background-color: #ddd;
}
li:hover button {
  display: block;
}
```

然后将 button 的行内样式`display:none`删除

```html
<button class="btn btn-danger">删除</button>
```

接下来做交互，与添加类似，在 App 添加方法然后传入 MyList，再传入 MyItem

```js
// 删除一个todo
    deleteTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
```

`MyItem.vue`简写，@click 自己绑定哦

```js
// 删除
    handleDelete(id) {
      if (confirm("确定删除吗?")) {
        this.deleteTodo(id);
      }
    },
```

### 底部统计

先传入 todos，然后通过**计算属性**来遍历统计已完成的数量和全部

```vue
<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox" />
    </label>
    <span>
      <span>已完成{{ completedTotal }}</span> / 全部{{ total }}
    </span>
    <button class="btn btn-danger">清除已完成任务</button>
  </div>
</template>

<script>
export default {
  name: 'MyFooter',
  props: ['todos'],
  computed: {
    total() {
      return this.todos.length;
    },
    completedTotal() {
      // 也可以用forEach遍历最简单的方法，但这个毕竟看起来高级
      return this.todos.reduce((total, todo) => {
        return total + (todo.completed ? 1 : 0);
      }, 0);
    },
  },
};
</script>
```

### 底部交互

先给底部的 checkbox 框来添加一个 checked 的计算属性 isAll，满了就自动都选

```js
isAll() {
      return this.completedTotal === this.total && this.total > 0;
 },
```

如果没有一个任务了，那其实不应该展示 footer，给其添加`v-show`，total 只有 0 和以上的值，如果为 0 就代表不展示了

```html
<div class="todo-footer" v-show="total"></div>
```

如果底部的 checkbox 改变，则需要改变上面的所有框，在 App 添加方法

```js
// 全选 or 全不选
    checkAllTodo(completed) {
      this.todos.forEach((todo) => {
        todo.completed = completed;
      });
    },
```

MyFooter 添加方法，在 input 那绑定`@change="checkAll"`，这里就不写了

```js
methods: {
    checkAll(e) {
      this.checkAllTodo(e.target.checked);
    },
  },
```

当然可以用`v-model`，不用添加方法，通过计算属性`isAll`的 set 来配置

```js
isAll:{
   get(){
     return this.completedTotal === this.total && this.total > 0;
   },
   set(value){
     this.checkAllTodo(value)
   }
},
```

接下来我们写清除已完成任务的交互，在 App 中添加事件并传入，给 button 绑定事件执行，和上面一样

```js
// 清除所有已完成的todo
    clearAllTodo() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },
```

### 总结案例

- 组件化编码流程：

  - 拆分静态组件：组件要按照功能点拆分，命名不要与 html 元素冲突

  - 实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

    - 一个组件在用：放在组件自身即可
    - 一些组件在用：放在他们共同的父组件上（<span style="color:red">状态提升</span>）

  - 实现交互：从绑定事件开始

- props 适用于：

  - 父组件 ==> 子组件 通信

  - 子组件 ==> 父组件 通信（要求父先给子一个函数）

- 使用 v-model 时切记：绑定的值不能是 props 传的值，因为 props 是不能修改的

- props 传的是对象类型的值，修改对象中的属性时 Vue 不会报错，但**不推荐**这样做。
