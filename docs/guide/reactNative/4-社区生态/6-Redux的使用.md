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

### TODO示例

接下来我们举一反三，来书写一个待办事项的示例。

在 *src* 目录下，新建三个子组件，分别是 *Input*、*List*、*ToDoList*，如下：

![image-20240507143633460](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240507143633460.png)

在 *App.js* 中，引入 *ToDoList* 组件：

```jsx
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './redux/store';
import ToDoList from './src/ToDoList.jsx';

const App = () => {
	return (
		<Provider store={store}>
			<ToDoList></ToDoList>
		</Provider>
	);
};

export default App;
```

其中 *store* 如下：

```js
import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from './reducers';

export default configureStore({
	reducer: {
		todolist: todoListReducer,
	},
});
```

*reducer* 如下：

```js
import { createSlice } from '@reduxjs/toolkit';

const todoListSlice = createSlice({
	name: 'todolist',
	// 初始化状态
	initialState: {
		listItem: [
			{
				title: '看书',
				isCompleted: false,
			},
			{
				title: '学习React',
				isCompleted: false,
			},
			{
				title: '学习RN',
				isCompleted: true,
			},
		],
	},
	// 定义reducer函数
	reducers: {
		increment: (state, action) => {
			let arr = [...state.listItem];
			arr.push({
				title: action.payload,
				isCompleted: false,
			});
			state.listItem = arr;
		},
		decrement: (state, action) => {
			let arr = [...state.listItem];
			arr.splice(action.payload, 1);
			state.listItem = arr;
		},
		changeStatus: (state, action) => {
			let arr = [...state.listItem];
			arr[action.payload].isCompleted = !arr[action.payload].isCompleted;
			state.listItem = arr;
		},
	},
});

export const { increment, decrement, changeStatus } = todoListSlice.actions;
export default todoListSlice.reducer;
```

其中 *ToDoList* 是 *Input* 和 *List* 组成的，如下

```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Input from './Input';
import List from './List';

const ToDoList = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>待办事项</Text>
			<Input />
			<List />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		marginTop: 50,
	},
	title: {
		fontSize: 20,
		marginBottom: 10,
	},
});

export default ToDoList;
```

其中 *Input* 如下：

```jsx
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { increment } from '../redux/reducers';

// 负责接收用户的输入, 当用户点击确定时需要将输入内容同步到仓库里面
const Input = () => {
	const [inputValue, setInputValue] = useState('');

	const dispatch = useDispatch();

	// 事件出来方法
	const pressHandle = () => {
		// 获取用户的输入, 通过 inputValue
		// 调用 actionCreator 生成一个 action, 然后派发到仓库里面
		dispatch(increment(inputValue));
		setInputValue('');
	};
	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='请输入内容'
				placeholderTextColor={'#999'}
				value={inputValue}
				onChangeText={(text) => setInputValue(text)}
			/>
			<Button title='添加' onPress={pressHandle} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		justifyContent: 'flex-start',
	},
	input: {
		width: 300,
		backgroundColor: '#fff',
		height: 40,
		padding: 10,
		borderWidth: 1,
		borderColor: '#DDD',
		borderRadius: 3,
		marginHorizontal: 10,
	},
});

export default Input;
```

*List* 如下：

```jsx
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changeStatus, decrement } from '../redux/reducers';
// 一项一项的待办事项
const List = () => {
	// todolistItem 是从仓库拿到的数据
	const todolistItem = useSelector((state) => state.todolist.listItem);
	const dispatch = useDispatch(); // 通过 dispatch 方法来派发 action 对象

	// 短按, 切换已完成和未完成的状态
	const pressHandle = (index) => {
		dispatch(changeStatus(index));
	};
	// 删除
	const longPressHandle = (index) => {
		Alert.alert('通知', '你是否要删除此条待办事项？', [
			{
				text: '取消',
				onPress: () => console.log('取消删除'),
				style: 'cancel',
			},
			{
				text: '确定',
				onPress: () => {
					dispatch(decrement(index));
				},
				style: 'default',
			},
		]);
	};

	return (
		<View style={styles.container}>
			{todolistItem.map((item, index) => (
				<View style={styles.item} key={index}>
					<Pressable
						onPress={() => pressHandle(index)}
						onLongPress={() => longPressHandle(index)}
					>
						{item.isCompleted ? (
							<Text style={styles.complete}>{item.title}</Text>
						) : (
							<Text>{item.title}</Text>
						)}
					</Pressable>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
	},
	item: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		marginBottom: 10,
		textAlign: 'center',
		width: 300,
	},
	complete: {
		textDecorationLine: 'line-through',
	},
});

export default List;
```

最终效果如下：

![](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240507153225030.png)

![image-20240507153243343](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240507153243343.png)

![image-20240507153325361](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240507153325361.png)
