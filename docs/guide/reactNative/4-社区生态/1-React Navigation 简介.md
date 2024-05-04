## React Navigation 简介

从本章起我们开始学习 RN 社区相关的生态库。RN 的社区生态相当丰富，很多东西官方没有提供，但是在社区已经有了很好的解决方案。

这里首当其冲要介绍的就是 React Navigation，这是一个诞生于社区的 RN 导航库。

本小节将介绍如下内容：

+ 什么是 *React Navigation*
+ *React Navigation* 的安装
+ *React Navigation* 体验

### 什么是 React Navigation

*React Navigation* 的诞生，源于 RN 社区对基于 *Javascript 的可扩展且使用简单的导航解决方案的需求*。

*React Navigation* 是 Facebook、Expo 和 React 社区的开发者们合作的结果：它取代并改进了 RN 生态系统中的多个导航库，其中包括 *Ex-Navigation*、RN 官方的 *Navigator* 和 *NavigationExperimentol* 组件。

学习 *React Navigation*，可以查看官方文档：[React Navigation](https://reactnavigation.org/)

![image-20240504145539253](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504145539253.png)

**React Navifation 特点**

在 *React Navigation* 中，内置了几种导航器，可以帮助我们实现页面之间的跳转

+ *StackNavigator*：一次只渲染一个页面，并提供页面之间跳转的方法。当打开一个新的页面时，它被放置在堆栈的顶部。简单来说就是普通页面跳，可传递参数
+ *TabNavigator*：渲染一个选项卡，类似底部导航栏，让用户可以在同一屏中进行几个页面之间切换
+ *DrawerNavigator*：提供一个从屏幕左侧滑入的抽屉

> 远远不止这些，还有很多如Modal、Deep linking，可以多看官方文档

### React Navigation 安装

接下来，要使用 *React Navigation* 首先肯定是安装它

关于安装，参考文档：[React Navigation 安装](https://reactnavigation.org/docs/getting-started/)

第一步，根据你的包管理器在终端输入如下命令，也可以用 yarn 或者 pnpm

```bash
npm install @react-navigation/native
yarn add @react-navigation/native
pnpm add @react-navigation/native
```

我们现在还是 Expo，所以还需要安装下面的依赖

```bash
npx expo install react-native-screens react-native-safe-area-context
```

> 安装过程有网络问题，请解决科学上网

### React Navigation 体验

安装完成后，我们就可以来书写一个简单的 demo 来体验下 *React Navigation* 。

由于新版本的 *React Navigation* 已经将导航器独立成了一个单独的包，因此我们首先需要安装要用到的导航器，比如我们要用 stack

```bash
yarn add @react-navigation/stack
```

我们是Expo项目，还需要安装如下：

```bash
npx expo install react-native-gesture-handler
```

然后在App.js文件**顶部**添加如下：

```jsx
import 'react-native-gesture-handler';
```

然后我们创建一个新目录 views，两个新文件 *DetailScreen.js* 、*HomeScreen.js*

```jsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
	const pressHandle = () => {
		// 跳转到 Detail 页面
		// 这个参数就是在App配置的name
		navigation.navigate('Detail');
	};

	return (
		<View style={styles.container}>
			<Text>这是首页</Text>
			<Button title='跳转到 Detail 页面' onPress={pressHandle} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
export default HomeScreen;
```

```jsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const DetailScreen = ({ navigation }) => {
	const pressHandle = () => {
		// 跳转到首页
		// 这个参数就是在App配置的name
		navigation.navigate('Home');
	};

	return (
		<View style={styles.container}>
			<Text>这是详情页面</Text>
			<Button title='跳转到首页' onPress={pressHandle} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
export default DetailScreen;
```

这两个类似，主要看App.js

```jsx
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './views/HomeScreen';
import DetailScreen from './views/DetailScreen';

// 创建一个栈导航器
const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='Home'
					component={HomeScreen}
					options={{
						title: '首页',
					}}
				/>
				<Stack.Screen
					name='Detail'
					component={DetailScreen}
					options={{
						title: '详情页',
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
```

在上面的代码中，我们首先创建了 *HomeScreen* 和 *DetailScreen* 这两个组件，也就是我们的两个屏幕。

接下来调用 *createStackNavigator* 方法创建了一个 *Stack* 导航的实例对象，然后通过上面的结构嵌套多个屏幕

可以看到，*Stack.Screen* 就代表一屏，因为我们现在有两屏，所以一共有两个 *Stack.Screen*。

在屏幕组件中，会自动传入当前的导航器实例，通过解构拿到这个导航器实例，上面常用的方法有：

+ *navigate*：导航方法，要导航到哪一屏，如果本身已经处于该屏，则不进行操作
+ *push*：以栈的形式往路由栈里面压入新的一屏，即使当前已处于该屏，也会重复压入新的一屏
+ *goBack*：返回上一屏，简单来讲就是栈顶那一屏出栈，回到栈顶的倒数第二屏

最终效果如下：

![image-20240504153200830](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504153200830.png)

![image-20240504153235556](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504153235556.png)