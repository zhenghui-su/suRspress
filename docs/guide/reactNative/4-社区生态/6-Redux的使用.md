## Redux的使用

本小节，我们结合 *React Native* 来回顾一下 *Redux* 的使用

打开 *Redux* 的官方，这里有个快速入门的示例：[入门 Redux](https://cn.redux.js.org/introduction/getting-started)

### @reduxjs/toolkit 基本使用

首先第一步，我们需要安装两个依赖，分别是 *@reduxjs/toolkit* 和 *react-redux*

```bash
npm i @reduxjs/toolkit react-redux
yarn add @reduxjs/toolkit react-redux
```

接下来，创建一个新的目录 *redux*，用于存放和 *redux* 操作相关的文件，在 *redux* 目录下，我们创建一个 *store* 和一个 *reducers* 文件，如下：

![image-20240506143547445](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240506143547445.png)

在 *store* 文件中，我们从 *@reduxjs/toolkit* 中解构导出一个名为 *configureStore* 的函数，该函数可以生成一个 *store* 仓库，导出这个仓库。

在创建该仓库时，接收一个配置选项，其中有一项就是要配置的 *reducer*

 ```js
 import { configureStore } from '@reduxjs/toolkit';
 import counterReducer from './reducers';
 
 // 创建一个仓库
 export default configureStore({
 	reducer: {
 		counter: counterReducer,
 	},
 });
 ```

可以看到，*reducer* 是从当前目录下的另一个文件 *reducers* 中引入的，该文件代码如下：

```js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
	name: 'counter',
	// 初始化状态
	initialState: {
		value: 0,
	},
	// 定义reducer函数
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
	},
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

然后我们新增加一个 *Counter.js* 文件，就是一个简单的计数器，代码如下：

```jsx
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/reducers';

export const Counter = () => {
	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();
	return (
		<View style={styles.container}>
			<View style={styles.counterContainer}>
				<Button title='-' onPress={() => dispatch(decrement())} />
				<Text style={styles.count}>{count}</Text>
				<Button title='+' onPress={() => dispatch(increment())} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	counterContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	count: {
		marginLeft: 30,
		fontSize: 30,
		marginRight: 30,
	},
});
```

在 *App.js* 中，用 *Provider* 包裹，然后放入 *Counter*，代码如下：

```jsx
import 'react-native-gesture-handler';
import { Counter } from './views/Counter';
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
	return (
		<Provider store={store}>
			<Counter />
		</Provider>
	);
};

export default App;
```

然后这个简单的计数器示例就完成，具体效果就不展示了，很简单。

