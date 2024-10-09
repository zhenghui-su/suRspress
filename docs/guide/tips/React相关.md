# React相关

## 如何理解React组件状态？

对于React来说，相较于Vue的响应式对象，它以状态来驱动视图更新。

- React使用 useState / this.setState 等来控制状态的变化
  - 源码中有一个 createUpdate 的函数要执行
  - shared.pending = update
  - processUpdateQueue 中去消费这个update

- React 通过状态的变化来进行视图更新，状态变化了意味着视图迭代到了下一个状态
- 在开发过程中，我们的思路只需要围绕React在一些事件发生以后当前界面状态是什么

### 状态是同步还是异步？

在通常情况下，React 17 的 lagecy 模式或更低版本，同步和异步要看调用的方式，如果 setState 是在当前的任务中执行，则是异步的(batchedUpdate)，如果使用了定时器、事件或者类似的异步任务去执行 state 更新，则是同步的，因为`isBatchingEventUpdate`已经变为false。

在React 18 中，都是异步更新的了。

### 如何在异步情况下批量更新？

可以用`unstable_batchedUpdates()`主动触发

### 如何让某个更新优先级更高？

可以使用`ReactDOM.flushSync()`马上执行

## React组件生命周期以及各阶段区别？

- constructor

  - 初始化 state
  - 绑定 this，如果有一些防抖节流可以在这个做
  - 劫持生命周期

- getDerivedStateFromProps 静态函数

  - 代替 componentWillReceiveProps

  - 返回值与 state 合并完作为 shouldComponentUpdate 的第二个参数 newState

  - 为什么希望是一个静态方法？因为希望它是一个纯函数
  
   ```js
   static getDerivedStateFromProps(newProps) {
        const { type } = newProps;
        switch(type) {
                case: 'age': 
                	return { name: '年龄', defaultValue: 18 }
                case: 'sex':
                	return { name: '性别', defaultValue: '男' }
        }
    }
   ```

- componentWillReceiveProps
  - 可以监听父组件是否执行render
  - props 改变，判断是否执行更新 state

- componentWillUpdate

  - 获取组件更新前的状态

- getSnapshotBeforeUpdate

  - 配置 componentDidUpdate 一起计算形成一个 snapShot 传给componentDidUpdate

  ```js
  getSnapshotBeforeUpdate(prevProps, prevState) {
      const snapshot = {
          // 一些组件的位置信息
      };
      return snapshot;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}
  ```

- componentDidUpdate

  - 更新完以后调用，切记如果 setState 要注意防止死循环
  - 配合 getSnapshotBeforeUpdate

- componentDidMount

  - 可以做一些 DOM 的操作，比如DOM的事件监听

  - 请求监听

- shouldComponentUpdate

  - 性能优化，看返回值是否更新组件


### React的hooks是怎么模拟生命周期的？

```js
import { useEffect } from 'react';

const MockLifeCycle = (props) => {
    useEffect(() => {
        console.log('mock: componentDidMount');
        return () => {
            console.log('moce: componentWillUnmount')
        }
    },[])
    useEffect(() => {
        console.log('mock: componentWillReciveProps')
    }, [props])
    useEffect(() => {
        console.log('mock: componentDidUpdate')
    })
}
```

## React事件创建以及合成事件

React的事件系统可以分为三个部分：

- 初始化注册

  - 在底层有这样的两个对象，事件系统本质上是插件化，合成事件就是注册不同的插件

  ```js
  const registrationNameModules = {
      onClick: SimpleEventPlugin,
      onChange: ChangeEventPlugin,
      onBlur: SimpleEventPlugin,
      //...
  }
  const registrationNameDependencies = {
      onClick: ['click'],
      onChange: ['blur', 'change', 'click'...]
  }
  ```

- 事件注册、注册事件

  - 当我发现有一个 onChange 事件，它会绑定`blur`、`change`、`click`、`focus`、`keydown`、`keyup`等多个事件

    ```js
    deps = registrantionNameDependencies['onChange'];
    deps.forEach(event => {
        // 绑定原生的事件监听器
    })
    ```

- 事件触发

```jsx
function Index() {
    const handle1 = () => console.log(1)
    const handle2 = () => console.log(2)
    const handle3 = () => console.log(3)
    const handle4 = () => console.log(4)
    
    return <div onClick={handle3} onClickCapture={handle4}>
    	<button onClick={handle1} onClickCapture={handle2}>click</button>
    </div>
}
// 4, 2, 1, 3
// [handle2, handle1]
// [handle4, handle2, handle1, handle3]
```

### React为什么要做一套自己的事件系统？

- 兼容性，不同浏览器兼容性不一致
- 大量的dom绑定很多事件，GC会有问题，合成事件性能好一些
- 通过它可以做SSR和跨端，根据不同宿主环境绑定不同的原生即可

### V17后为什么事件放到app上而不是document上

放到document上，在一些微前端中就不好处理了

## 什么是HOC？以及高阶组件的传参和事件

### 属性代理

```jsx
function HoC(Component) {
    // 做一些事件比如日志等 或者新属性可以传入
    return class Advanced extends React.Component {
        render() {
            return <Component {...this.props} />
        }
    }
}
```

优点：

- 组件松耦合，又能对组件能力进行增强，比如`withRouter`
- 隔离一些业务组件的渲染
- 可以嵌套

缺点：

- 一般无法获取原始组件的状态，只能通过 ref 等手段
- 无法直接继承静态属性

### 反向继承

```jsx
class Index extends React.Component {
    render() {
        return <div>hello</div>
    }
}
function HoC(Component) {
    return class warpComponent extends Component {
        //...
    }
}
```

优点：

- 方便获取组件内部的状态
- 静态属性无需特殊处理

缺点：

- hook不能用
- 耦合度很高

## react的hook理解

挂载在Fiber的memoizedState的链表，以next链接

```js
workInPorgress -> 
    	memoizedState [next]
		- memoizedState = 0
		- memoizedState = 'hello'
		- memoizedState = { current: null }
		- memoizedState = { create: () => console.log()}
```

### hook出现本质上原因？

- 让函数组件也能做类组件的事情，比如状态，副作用，ref
- 解决逻辑难以复用的问题
- 面向FP，放弃OOP

### 为什么useAPI不能加条件语句

根据前面所说，它以通过链表的形式串联的，如果加上条件语句，它的链表结构就会被破坏，导致有时候找不到对应的useAPI

### 为什么useState要使用数组而不是对象

因为数组的解构可以任意命名，而对象的解构需要一一对应，然后再取别名

### useEffect和useLayoutEffect的区别

执行时机的一个区别，`useLayoutEffect`是在DOM更新之后浏览器绘制之前执行的，它用于修改DOM改变布局，`useEffect`是在绘制之后执行的。

### useEffect和componentDidMount / componentDidUpdate执行时机区别？

`useEffect`在react的执行栈中，是异步执行的，而 cdm和 cdu 是同步执行的。

`useEffect`代码不会阻塞浏览器绘制，cdm / cdu 的执行都是在commitLayoutEffect中

### 你知道useInsertionEffect

`useInsertionEffect`执行时间在DOM更新前，主要用于处理css in js 样式方案，避免浏览器重绘重排，性能更好

## Redux遵循的三原则

- 单向数据流
  - newState = reducer(state, actions)
- state 只读
  - 唯一修改state的方法，只有 dispatch 一个 action
- 纯函数执行
  - 每一个reducer都是纯函数

### Redux中的发布订阅和中间件思想

compose的实现

```js
const compose = (...func) => {
    return func.reduce((f, g) => (x) => f(g(x)))
}
```

- redux 是一种发布订阅的核心实现方式，以 store 为数据中心，使用 dispatch 修改是数据，使用 subscribe 订阅数据，dispatch 是，会通知所有的 subscribe 的函数
- redux 把副作用交给 compose 以中间件的形式去处理
  - 核心就是强化 dispatch
  - 还有处理副作用

### react-redux、redux、react三者关系

react就是一个UI框架，redux是一个数据管理工具，react-redux基于redux，因为redux作为数据管理工具无法触发视图更新的，react-redux就是让它消费触发更新