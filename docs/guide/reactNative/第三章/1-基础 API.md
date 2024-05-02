## 基础 API

从本章开始我们进入 RN 中一些 API 的学习。这里我将整个 RN 的 API 分为了5个部分，分别是:

+ 基础 API
+ 屏幕 API
+ 动画 API
+ 设备 API
+ 手势 API

本小节我们先来看基础 API，如下：

+ *Alert*
+ *StyleSheet*
+ *Transforms*
+ *Keyboard*
+ *AppState*

### Alert

Alert 主要用于显示个带有指定标题和消息的警报对话框。*Alert.alert* 方法接收 3 个参数，一个参数是警报对话框的标题，第二个参数是警报内容，最后一个参数是一个数组， 数组的每一项是按钮对象。

官方文档地址：[Alert](https://reactnative.cn/docs/alert)

```jsx
import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';

const App = () => {
	const createTwoButtonAlert = () =>
		Alert.alert('标题', '我的 Alert 内容', [
			{
				text: '取消',
				onPress: () => console.log('点击了取消'),
				style: 'cancel', // 仅 iOS
			},
			{ text: '确定', onPress: () => console.log('点击了确定') },
		]);

	const createThreeButtonAlert = () =>
		Alert.alert('标题', '我的 Alert 内容', [
			{
				text: '稍后再说',
				onPress: () => console.log('点击了稍后再说'),
			},
			{
				text: '取消',
				onPress: () => console.log('点击了取消'),
				style: 'cancel',
			},
			{ text: '确定', onPress: () => console.log('点击了确定') },
		]);

	return (
		<View style={styles.container}>
			<Button title={'按钮1'} onPress={createTwoButtonAlert} />
			<Button title={'按钮2'} onPress={createThreeButtonAlert} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
});

export default App;
```

###  StyleSheet

这个 API 我们已经用到很多了，*StyleSheet* 是一种类似于 *CSS StyleSheets* 的抽象

官方文档地址：[StyleSheet](https://reactnative.cn/docs/stylesheet)

需要注意以下几个点：

+ 并不是所有的 *CSS* 属性在 *StyleSheet* 中都支持
+ 书写样式时要使用驼峰命名法，例如 *backgroundColor*

属性：

+ *hairlineWidth*：自适应不同设备生成一条线

```js
const styles = StyleSheet.create({
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
    }
})
```

+ *adsoluteFill*：是 `postion: 'absolute', left: 0, right: 0, top: 0, bottom: 0`的缩写形式

```js
const styles = StyleSheet.create({
    wrapper: {
        ...StyleSheet.absoluteFill;
        top: 10,
        backgroundColor: 'transparent'
    }
})
```

方法：

+ *create*：根据对象创建样式表
+ *flatten*：可以把样式对象的数组整合成一个样式对象，重复的样式属性以后面一个为准

```js
const styles = StyleSheet.create({
    listItem: {
		flex: 1,
        fontSize: 16,
        color: 'white',
    },
    selectedListItem: {
        color: 'green'
    },
});
console.log(StyleSheet.flatten([styles.listItem, styles.selectedListItem]));
// 输出 { flex: 1, fontSize: 16, color: 'green' }
```

### Transforms

*Transforms* 类似于 *CSS* 中的变形。可以帮助我们使用 2D 或者 3D 变换来修改组件的外观和位置。

但是需要注意的是，一旦应用了变换，变换后的组件周围的布局将保持不变，因此它可能会与附近的组件重叠。

官方文档地址：[Transforms](https://reactnative.cn/docs/transforms)

```jsx
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

const App = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.box}>
        <Text style={styles.text}>Original Object</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{scale: 2}],
          },
        ]}>
        <Text style={styles.text}>Scale by 2</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{scaleX: 2}],
          },
        ]}>
        <Text style={styles.text}>ScaleX by 2</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{scaleY: 2}],
          },
        ]}>
        <Text style={styles.text}>ScaleY by 2</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{rotate: '45deg'}],
          },
        ]}>
        <Text style={styles.text}>Rotate by 45 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{rotateX: '45deg'}, {rotateZ: '45deg'}],
          },
        ]}>
        <Text style={styles.text}>Rotate X&Z by 45 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{rotateY: '45deg'}, {rotateZ: '45deg'}],
          },
        ]}>
        <Text style={styles.text}>Rotate Y&Z by 45 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{skewX: '45deg'}],
          },
        ]}>
        <Text style={styles.text}>SkewX by 45 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{skewY: '45deg'}],
          },
        ]}>
        <Text style={styles.text}>SkewY by 45 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{skewX: '30deg'}, {skewY: '30deg'}],
          },
        ]}>
        <Text style={styles.text}>Skew X&Y by 30 deg</Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{translateX: -50}],
          },
        ]}>
        <Text style={styles.text}>TranslateX by -50 </Text>
      </View>

      <View
        style={[
          styles.box,
          {
            transform: [{translateY: 50}],
          },
        ]}>
        <Text style={styles.text}>TranslateY by 50 </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  box: {
    height: 100,
    width: 100,
    borderRadius: 5,
    marginVertical: 40,
    backgroundColor: '#61dafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 8,
    color: '#000',
    textAlign: 'center',
  },
});

export default App;
```

### Keyboard

*Keyboard* 模块用来控制键盘相关的事件。

利用 *Keyboard* 模块，可以监听原生键盘事件以做出相应回应，比如收回键盘。

官方文档地址：[Keyboard](https://reactnative.cn/docs/keyboard)

```jsx
import React, { useState, useEffect } from 'react';
import { Keyboard, Text, TextInput, StyleSheet, View } from 'react-native';

const App = () => {
	const [keyboardStatus, setKeyboardStatus] = useState('');

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setKeyboardStatus('键盘显示了');
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardStatus('键盘隐藏了');
		});

		return () => {
            // 该函数会在执行下一次副作用前执行对上一次绑定的事件移除
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	return (
		<View style={style.container}>
			<TextInput
				style={style.input}
				placeholder='Click here…'
				onSubmitEditing={Keyboard.dismiss}
			/>
			<Text style={style.status}>{keyboardStatus}</Text>
		</View>
	);
};

const style = StyleSheet.create({
	container: {
		flex: 1,
		padding: 36,
	},
	input: {
		padding: 10,
		borderWidth: 0.5,
		borderRadius: 4,
	},
	status: {
		padding: 10,
		textAlign: 'center',
	},
});

export default App;
```

### AppState

在 RN 开发中，经常会遇到前后台切换的场景。为了监控应用的运行状态，RN提供了 *AppState*。通过 *AppState* 开发者可以很容易地获取应用当前的状态。

官方文档地址：[AppState](https://reactnative.cn/docs/appstate)

在 *AppState* 中，应用的状态被分为：

- *active*：应用正在前台运行

- *background*：应用正在后台运行。用户可能面对以下几种情况:
  
  - 在别的应用中
  - 停留在桌面
  - 对 *Android* 来说还可能处在另一个 *Activity* 中 ( 即便是由你的应用拉起的 )
  
- [*iOS*] *inactive*：此状态表示应用正在前后台的切换过程中，或是处在系统的多任务视图，又或是处在来电状态中。

要获取当前的状态，你可以使用 `AppState.currentState`，这个变量会一直保持更新。不过在启动的过程中，*currentState* 可能为 *null*，直到 *AppState* 从原生代码得到通知为止。

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';

const App = () => {
	const appState = useRef(AppState.currentState);
	const [appStateVisible, setAppStateVisible] = useState(appState.current);

	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				console.log('App has come to the foreground!');
			}

			appState.current = nextAppState;
			setAppStateVisible(appState.current);
			console.log('AppState', appState.current);
		});

		return () => {
			subscription.remove();
		};
	}, []);

	return (
		<View style={styles.container}>
			<Text>Current state is: {appStateVisible}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default App;
```

我们回到桌面，然后再返回应用试试，控制台会打印

![image-20240502233630748](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240502233630748.png)
