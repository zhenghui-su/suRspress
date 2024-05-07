## Zustand 的使用

Zustand 是一个没有 Redux 那么大心智负担的状态管理库，具体可看前面小节，这里讲一下他的基本用法

首先先下载：

```bash
npm i zusatnd
```

### 计数器

我们来写之前 Redux 的计数器，看看 Zustand 是怎么管理呢？

_App.js_ 如下，是的，不需要 `Provider`！！

```jsx
import Count from './views/Count';

const App = () => {
	return <Count />;
};

export default App;
```

然后我们来使用 Zustand 来创建状态管理，新建一个目录 zustand，然后创建一个 _CounterStore.ts_

```typescript
import { create } from 'zustand';

type CounterStoreState = {
	count: number;
	increment: () => void;
	decrement: () => void;
};
// 创建store示例和对应的方法
export const useCounterStore = create<CounterStoreState>()((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

其中 _set_ 就是更新的方法，而且我们发现 zustand 不需要扩展运算符 `...state`在前面了，因为 zustand 自动帮我们把第一层的合并了，当然如果你有更深的还是需要扩展运算符的

然后我们来写 _Count.js_

```jsx
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useCounterStore } from '../zustand/CounterStore';

const Count = () => {
	// 取出状态和方法 这里是取出所有 可以用解构
	const { count, increment, decrement } = useCounterStore();

	return (
		<View style={styles.container}>
			<View style={styles.counterContainer}>
				<Button title='-' onPress={decrement} />
				<Text style={styles.count}>{count}</Text>
				<Button title='+' onPress={increment} />
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
		fontSize: 20,
		marginRight: 30,
	},
});

export default Count;
```

我们只需要通过使用我们刚刚创建的示例 Store 就可以解构出所有方法了，但注意这里是需要所有方法才这样，如果是单个单个取就如下：

```js
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);
const decrement = useCounterStore((state) => state.decrement);
```

至此计数器就完成了，是不是发现要简单一点，因为不需要包裹 Provider ，不需要 dispatch

### TodoList 示例

我们再用 Zustand 来写一下上一节的 ToDoList

先写 _ToDoListStore.ts_

```typescript
import { create } from 'zustand';

type ListItem = {
	title: string;
	isCompleted: boolean;
};

type ToDoListStore = {
	listItem: ListItem[];
	increment: (title: string) => void;
	decrement: (index: number) => void;
	changeStatus: (index: number) => void;
};

export const useToDoListStore = create<ToDoListStore>()((set) => ({
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

	increment: (title) => {
		set((state) => ({
			listItem: [...state.listItem, { title, isCompleted: false }],
		}));
	},

	decrement: (index) => {
		set((state) => ({
			listItem: state.listItem.filter((_, i) => i !== index),
		}));
	},

	changeStatus: (index) => {
		set((state) => ({
			listItem: state.listItem.map((item, i) =>
				i === index ? { ...item, isCompleted: !item.isCompleted } : item
			),
		}));
	},
}));
```

然后 Input、List 将方法改成 Zustand 获取即可，类似如下：

```js
const increment = useToDoListStore((state) => state.increment);
```

效果就不展示了，和之前一样
