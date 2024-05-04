## 手势 API

这一小节我们来看一下 RN 中和手势相关的 API

官网文档地址：[PanResponder](https://reactnative.cn/docs/panresponder)

先来看一个示例：

```jsx
import React from 'react';
import { StyleSheet, View, PanResponder } from 'react-native';

// 创建手势对象
const panResponder = PanResponder.create({
	// 触发事件开始
	onStartShouldSetPanResponder: () => {
		console.log('触摸开始');
		// 允许开始
		return true;
	},
	// move 事件, 手指移动的时候会实时的触发
	onPanResponderMove: () => {
		console.log('移动中');
	},
	// 手指离开的事件
	onPanResponderRelease: () => {
		console.log('触摸结束');
	},
});
// 通过 create 返回的对象的 panHandlers 属性可以获取到手指触摸事件的集合
// console.log(PanResponder.panHandlers);

const App = () => {
	return (
		<View style={styles.container}>
			<View style={styles.box} {...panResponder.panHandlers}></View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	box: {
		width: 80,
		height: 80,
		backgroundColor: '#61dafb',
		borderRadius: 4,
	},
});

export default App;
```

我们手指先触摸方块然后移动，最后结束触摸，就会打印如下效果：

![image-20240504141237014](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504141237014.png)

在上面的示例中，我们通过 *PanResponder* 这个 API 的 *create* 方法来创建一个手势方法的集合对象。该方法接收一个配置对象，配置对象中能够传递的参数如下：

![image-20240504140124133](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504140124133.png)

可以看到，配置对象对应的每一个配置值都是一个回调函数，每个回调函数都接收两个参数，一个 是原生事件对象，另一个是 *gestureState* 对象。两者配置如下：

原生事件是指由以下字段组成的合成触摸事件：

- `nativeEvent`
  - `changedTouches` - 在上一次事件之后，所有发生变化的触摸事件的数组集合（即上一次事件后，所有移动过的触摸点）
  - `identifier` - 触摸点的 ID
  - `locationX` - 触摸点相对于父元素的横坐标
  - `locationY` - 触摸点相对于父元素的纵坐标
  - `pageX` - 触摸点相对于根元素的横坐标
  - `pageY` - 触摸点相对于根元素的纵坐标
  - `target` - 触摸点所在的元素 ID
  - `timestamp` - 触摸事件的时间戳，可用于移动速度的计算
  - `touches` - 当前屏幕上的所有触摸点的集合

一个`gestureState`对象有如下的字段：

- `stateID` - 触摸状态的 ID。在屏幕上有至少一个触摸点的情况下，这个 ID 会一直有效。
- `moveX` - 最近一次移动时的屏幕横坐标
- `moveY` - 最近一次移动时的屏幕纵坐标
- `x0` - 当响应器产生时的屏幕坐标
- `y0` - 当响应器产生时的屏幕坐标
- `dx` - 从触摸操作开始时的累计横向路程
- `dy` - 从触摸操作开始时的累计纵向路程
- `vx` - 当前的横向移动速度
- `vy` - 当前的纵向移动速度
- `numberActiveTouches` - 当前在屏幕上的有效触摸点的数量

我们根据这个改一点上面移动的代码：

```jsx
// move 事件, 手指移动的时候会实时的触发
onPanResponderMove: (event, gestureState) => {
	console.log(`正在移动: X轴: ${gestureState.dx} Y轴: ${gestureState.dy}`);
},
```

如下，我们移动的时候就会打印出值了：

![image-20240504141748021](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240504141748021.png)

最后，我们把已经学过的 *Animated* 结合起来，书写一个拖动小方块的示例，这也是官方的示例：

```jsx
import React, { useState } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

const App = () => {
	// 记录了一个 X 轴和 Y 轴的移动距离
	const pan = new Animated.ValueXY();

	// 创建手势对象
	const panResponder = PanResponder.create({
		// 触发事件开始
		onStartShouldSetPanResponder: () => {
			console.log('触摸开始');
			// 允许开始
			return true;
		},
		// 在手势开始时，记录当前位置的偏移值
		onPanResponderGrant: () => {
			pan.setOffset({
				x: pan.x._value,
				y: pan.y._value,
			});
		},
		// move 事件, 手指移动的时候会实时的触发
		// 这里我们需要将 dx 和 dy 映射到 pan 上
		onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
			useNativeDriver: false,
		}),
		// 手指离开的事件
		onPanResponderRelease: () => {
			// 将当前的偏移值应用到pan中，并且清空偏移值
			pan.flattenOffset();
		},
	});
	return (
		<View style={styles.container}>
			{/* 使用 Animated.View 包裹要进行动画的组件，并将 panResponder 的事件绑定到上面 */}
			<Animated.View
				style={[
					styles.box,
					{
						transform: [{ translateX: pan.x }, { translateY: pan.y }],
					},
				]}
				{...panResponder.panHandlers}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	box: {
		width: 80,
		height: 80,
		backgroundColor: '#61dafb',
		borderRadius: 4,
	},
});

export default App;
```

其中 *Animated.ValueXY*，其实和 *Animated.Value* 差不多，参考官网文档：[Animated.ValueXY](https://reactnative.cn/docs/animatedvaluexy)