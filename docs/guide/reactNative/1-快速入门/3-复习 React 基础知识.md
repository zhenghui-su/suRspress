## 复习 React 基础知识

这里简单复习一下React中的几个核心概念：

+ components 组件
+ JSX
+ props 属性
+ state 状态

### components 组件

在现代前端开发中，离不开组件化开发。将一个页面上的元素拆解成一个个组件， 能够极大程度的复用代码。

在现在流行的三大框架中，无论是Angular、Vue 还是React,都支持组件化开发。其中在React中，支持两种书写组件的方式。

#### 函数式组件

在函数式组件中，一个函数就是一个组件， 在函数中会返回一段 JSX。早期的函数式组件又被称之为无状态组件，但是自从Hook出来后，函数式组件也能够维持自身的状态。

```jsx
import React from 'react';
import { Text } from 'react-native';
export default function Cat() {
    return (
    	<Text>Hello, I am Cat!</Text>
    )
}
```

#### Class 组件

Class 类组件，一个组件就是一个 Class 类，这个类需要继承 Component 类，并且在该类中需要提供个 render 方法，在 render 方法中返回一段 JSX

早期的 Class 类组件被称之为有状态组件，但是随着Hook的推出，函数组件也能维护自身的组件状态，因此现在Class类组件相比函数组件使用的频率有所降低，因为相比类，前端开发人员更加熟悉函数，并且避开了烦人的this。

```jsx
import React, { Component } from 'react';
import { Text } from 'react-native';
export default Class Cat extends Component {
    render() {
        return (
    		<Text>Hello, I am Cat!</Text>
    	)
    }
}
```

### JSX

上面提到：无论是函数组件还是 Class 类组件，都需要返回一段 JSX

JSX 是 React 中提供的一种特殊的语法， 本质上就是使用 JS 对象来描述 DOM 结构。在 React 中提供了 React.createElement 方法来创建虚拟 DOM 对象，从而对 DOM 结构进行描述。

```jsx
React.createElement(type, [props], [...children]);
```

参数说明：

+ type：创建的 React 元素类型(可选的值有:标签名字符串、React 组件)
+ props（可选）：React 元素的属性
+ children（可选）：React 元素的子元素。

例如：

```jsx
const h1 = React.createElement('h1', null, '你好 React')
const p = React.createElement('p', null, 'React 你好')
```

但是显然如果要开发者通过这种方式来描述页面，会分分钟劝退开发者。因此 JSX 应运而生，JSX 本质上就是 React.createElement 方法的一种语法糖，通过 JSX，开发者可以通过类似于 HTML 的语法来描述页面。

```jsx
const ele = (
	<div>
    	<h1>你好 React</h1>
        <p>React 你好</p>
    </div>
)
```

JSX具有如下的特点：

+ 可以在 JSX 中使用 JavaScript 表达式。表达式写在花括号 {} 中。
+ 在 JSX 中不能使用语句，只能使用表达式。例如不能使用 if else 语句，但可以使用 *conditional* (三元运算) 表达式来替代。
+ 如果我们在 JSX 中要给标签设置 class，不能够像 HTML 中那样直接书写 class 因为 JSX 实际上是 JS 对象，所以class 需要替换为 className。
+ 花括号 {} 中可以是数组，数组的每一项为一段JSX，之后在渲染的时候会自动展开数组中的每一段JSX。
+ JSX 中如果要书写注释，需要写在 `{/*注释内容... */}`中

当然，上面所列举的 JSX 示例是在开发 PC 网页时的例子。在 RN 中使用 JSX 可没有什么div、p这些标签，使用的都是RN所提供的内置组件

```jsx
import React from 'react';
import { Text } from 'react-native';
export default function Cat() {
    const name = 'Cat';
    return (
    	<Text>Hello, I am {name}!</Text>
    )
}
```

### props 属性

props 是组件对外的接口，在组件内部可以通过 props 拿到外部传给组件的参数。

如果是使用的函数的方式来创建的组件，那么使用 props 对象来传递参数显得非常的简单，就像函数传参一样使用即可。

例如:

```jsx
import React from 'react';
import { Text, View } from 'react-native';
function Cat(props) {
    return (
        <View>
    		<Text>Hello, I am {props.name}!</Text>
        </View>
    )
}
export default function App() {
    return (
    	<View>
        	<Cat name="Maru" />
            <Cat name="Spot" />
            <Cat name="Jack" />
        </View>
    )
}
```

如果是 Class 类组件，则需要在 constructor 中将 props 由 super 函数传递给父组件。然后在 JSX 中通过 this.props 来获取传入的数据。

```jsx
class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        	<View>
            	<Text>Hello, I am {this.props.name}!</Text>
            </View>
        )
    }
}
```

### state 状态

state 为组件自身的数据状态。早期只有Class 类组件能够维护组件状态

后来 React 加入了 Hook，函数式组件也能够维护 state 了。

```jsx
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

function Cat(props) {
	const [count, setCount] = useState(0);
	return (
		<View>
			<Text>Hello, I am {props.name}!</Text>
			<Text>计数：{count}</Text>
			<Button
				onPress={() => {
					setCount(count + 1);
				}}
				title='count+1'
			></Button>
		</View>
	);
}

export default function App() {
	return (
		<View style={styles.container}>
			<Text>Hello React Native!</Text>
			<StatusBar style='auto' />
			<Cat name='welcome' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
```

当然，上面的内容我们只是列举了一些 React 中的核心知识，以助于帮你快速的回顾一下 React 中的重要知识，这并不意味着你不需要掌握 React 相关内容。

如果你对 React 还不了解，建议你先暂停这里的学习，然后先学习了 React 相关知识后在回来继续学习 RN。