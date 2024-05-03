## 动画 API

这一小节我们来看一下 RN 中和动画相关的 API，如下：

+ *LayoutAnimation*
+ *Animated*

### LayoutAnimation

*LayoutAnimation* 是 RN 提供的一套全局布局动画 API，只需要配置好动画的相关属性(例如大小、位置、透明度)，然后调用组件的状态更新方法引起重绘，这些布局变化就会在下一次渲染时以动画的形式呈现。

官方文档地址：[LayoutAnimation](https://reactnative.cn/docs/layoutanimation)

在 *Andriod* 设备上使用 *LayoutAnimotion*，需要通过 *UIManager* 手动启用，并且需要放在任何动画代码之前，比如可以放在入口文件 *App.js* 中。

```jsx
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperiment) {
        UIManager.setLayoutAnimationEnabledExperiment(true)
    }
}
```

下面我们来看一个示例：

```jsx
const customAnime = {
	// 第一个动画
	customSpring: {
		duration: 500,
		create: {
    	springDamping: 0.6, // 弹跳动画阻尼系数
    	type: LayoutAnimation.Types.spring, // 动画类型
    	property: LayoutAnimation.Properties.scaleXY // 动画属性
		},
		update: {
			springDamping: 0.6, // 弹跳动画阻尼系数
    	type: LayoutAnimation.Types.spring, // 动画类型
    	property: LayoutAnimation.Properties.scaleXY // 动画属性
		},
	},
	// 第二个动画
	customLinear: {
		duration: 500,
		create: {
    	springDamping: 0.6, // 弹跳动画阻尼系数
    	type: LayoutAnimation.Types.linear, // 动画类型
    	property: LayoutAnimation.Properties.opacity // 动画属性
		},
		update: {
			springDamping: 0.6, // 弹跳动画阻尼系数
    	type: LayoutAnimation.Types.spring, // 动画类型
    	property: LayoutAnimation.Properties.opacity // 动画属性
		},
	}
}
```

在上面的代码中，我们定义了 *customAnim* 是一个对象， 该对象包含了两种动画方式，一种是 *customSpring*，另一种是 *customLinear*，

每一种动画都用对象来描述，包含4个可选值:

+ *duration*：动画的时长
+ *create*：组件创建时的动画
+ *update*：组件更新时的动画
+ *delete*：组件销毁时的动画

以 *customSpring* 为例，对应的 *duration* 为 400 毫秒，而 *create* 和 *update* 包括 *delete* 对应的又是一个对象，其类型定义如下：

```typescript
type Anim = {
    duration? : number, // 动画时长
    deley? : number, // 动画延迟
    springDamping? : number, // 弹跳动画阻尼系数
    initialVelocity? : number, // 初始速度
    type? : LayoutAnimationType, // 动画类型
    property? : LayoutAnimationProperty // 动画属性
}
```

其中 type 定义在 *LayoutAnimationType* 中，常见的动画类型有：

+ *spring*：弹跳动画
+ *linear*：线性动画
+ *easeInEaseOut*：缓入缓出动画
+ *easeIn*：缓入动画
+ *easeOut*：缓出动画
+ *keyboard*：

动画属性 property 定义在 *LayoutAnimationProperty* 中，支持的动画属性有：

+ *opacity*：透明度
+ *scaleX*：X轴缩放
+ *scaleY*：Y轴缩放
+ *scaleXY*：全部缩放

然后我们运用，如下，每次点击增加的时候都会有个动画效果

```jsx
import React, { useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	View,
	LayoutAnimation,
	UIManager,
	Platform,
} from 'react-native';

if (
	Platform.OS === 'android' &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 定义动画
const customAnime = {
	// 第一个动画
	customSpring: {
		duration: 1000,
		create: {
			springDamping: 0.7, // 弹跳动画阻尼系数
			type: LayoutAnimation.Types.spring, // 动画类型
			property: LayoutAnimation.Properties.scaleXY, // 动画属性
		},
		update: {
			springDamping: 0.7, // 弹跳动画阻尼系数
			type: LayoutAnimation.Types.spring, // 动画类型
			property: LayoutAnimation.Properties.scaleXY, // 动画属性
		},
	},
	// 第二个动画
	customLinear: {
		duration: 1000,
		create: {
			springDamping: 0.7, // 弹跳动画阻尼系数
			type: LayoutAnimation.Types.linear, // 动画类型
			property: LayoutAnimation.Properties.scaleXY, // 动画属性
		},
		update: {
			springDamping: 0.7, // 弹跳动画阻尼系数
			type: LayoutAnimation.Types.spring, // 动画类型
			property: LayoutAnimation.Properties.scaleXY, // 动画属性
		},
	},
};

const App = () => {
	const [width, setWidth] = useState(100);
	const [height, setHeight] = useState(100);

	const pressHandle = () => {
		LayoutAnimation.configureNext(customAnime.customSpring);
		setWidth(width + 10);
		setHeight(height + 10);
	};

	return (
		<View style={styles.container}>
			<View style={[styles.content, { width, height }]}></View>
			<Pressable style={styles.btnContainer} onPress={pressHandle}>
				<Text style={styles.textStyle}>点击增大</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5FCFF',
	},
	content: {
		backgroundColor: '#FF0000',
		marginBottom: 10,
	},
	btnContainer: {
		marginTop: 30,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#EE7942',
		width: 320,
		height: 30,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textStyle: {
		color: '#FFFFFF',
		fontSize: 18,
	},
});

export default App;
```

### Animated

前面所学习的 *LayoutAnimation* 称为布局动画，这种方法使用起来非常便捷，它会在如透明度渐变、缩放这类变化时触发动画效果，动画会在下一次渲染或布局周期运行。布局动画还有个优点就是无需使用动画化组件，如 *Animated.View*。

*Animated* 是 RN 提供的另一种动画方式， 相较于 *LayoutAnimation*，它更为精细，可以只作为单个组件的单个属性，也可以根据手势的响应来设定动画 ( 例如通过手势放大图片等行为 )，甚至可以将多个动画变化组合到一起，并可以根据条件中断或者修改。

官方文档地址：[Animated](https://reactnative.cn/docs/animated)

#### 基本入门

下面我们先来看一个快速入门示例:

```jsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, Animated, Button, Easing } from 'react-native';

const App = () => {
	const [opacity, setOpacity] = useState(new Animated.Value(1));

	const fadeInHandle = () => {
		// setOpacity(1);
		// 第一个的值要针对哪个属性应用动画
		Animated.timing(opacity, {
			toValue: 1, // 动画的终点
			duration: 1000, // 动画的时长
			easing: Easing.linear, // 动画的缓动函数
			useNativeDriver: true, // 是否使用原生动画
		}).start(); // 开始动画
	};
	const fadeOutHandle = () => {
		// setOpacity(0);
		// 第一个的值要针对哪个属性应用动画
		Animated.timing(opacity, {
			toValue: 0, // 动画的终点
			duration: 1000, // 动画的时长
			easing: Easing.linear, // 动画的缓动函数
			useNativeDriver: true, // 是否使用原生动画
		}).start(); // 开始动画
	};
	return (
		<View style={styles.container}>
			<Animated.View
				style={[
					styles.fadingContainer,
					{
						opacity,
					},
				]}
			>
				<Text style={styles.fadingText}>被控制的盒子</Text>
			</Animated.View>
			<View style={styles.buttonRow}>
				<Button title='显示' onPress={fadeInHandle} />
				<Button title='隐藏' onPress={fadeOutHandle} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fadingContainer: {
		padding: 20,
		backgroundColor: 'powderblue',
	},
	fadingText: {
		fontSize: 28,
	},
	buttonRow: {
		flexBasis: 100,
		justifyContent: 'space-evenly',
		marginVertical: 16,
	},
});

export default App;
```

这样我们就可以让其在显示和隐藏的过程中有着动画的效果了

在事件处理函数中，使用 *Animated.timing* 方法并设置动画参数，最后调用 *start* 方法启动动画。

*timing* 对应的参数属性如下：

+ *duration*：动画的持续时间，默认为 500
+ *easing*：缓动动画，默认为 *Easing.inOut*
+ *delay*：开始动画前的延迟时间，默认为 0
+ *isinteraction*：指定本动画是否在 *InteractionManager* 的队列中注册以影响任务调度，默认值为 true
+ *useNativeDriver*：是否启用原生动画驱动，默认为 false

除了 *timing* 动画，*Animated* 还支持 *decay* 和 *spring*。每种动画类型都提供了特定的函数曲线，用于控制动画值从初始值到最终值的变化过程。

+ *decay*：衰减动画，以一个初始速度开始并且逐渐减慢停止
+ *spring*：弹跳动画，基于阻尼谐振动的弹性动画
+ *timing*：渐变动画，按照线性函数执行的动画

在 *Animated* 动画 API 中，*decay*、*spring* 和 *timing* 是动画的核心，其他复杂动画都可以使用这三种动画类型来实现。

除了上面介绍的动画 API 之外，*Animated* 还支持复杂的组合动画，如常见的串行动画和并行动画。*Animated* 可以通过以下的方法将多个动画组合起来。

+ *parallel*：并行执行，就是一起执行
+ *sequence*：串行执行，就是顺序执行
+ *stagger*：错峰执行，其实就是插入 *delay* 的 *parallel* 动画

就像下面这样：

```js
Animated.sequence([
	// 串行执行
	Animated.spring(firstValue, {
		toValue: 1,
		useNativeDriver: true,
	}),
	Animated.delay(500),
	Animated.timing(secondValue, {
		toValue: 1,
		duration: 800,
		easing: Easing.out(Easing.quad),
		useNativeDriver: true,
	}),
]).start(() => {})
```

> 这边在 start 启动里面有个回调函数，指的是在动画结束后执行这个回调函数

#### 插值

在动画方面，更深入的可以参考官方文档：[动画](https://reactnative.cn/docs/animations)，其中有个插值较为重要

插值是指将一定范围的输入值映射到另一组不同的输出值

例如我这有个需要让其旋转 360 度的需求，怎么解决呢？

```jsx
const [rotateValue, setRotateValue] = useState(Animated.Value(0))

export function App(){
    return (
    	<Animated.View
        	style={{
                transform: [{
                    rotate: rotateValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                    })
                }]
            }}    
        ></Animated.View>
    )
}
```

如上，我通过插值将 [0, 1] 映射为 ["0deg", "360deg"] 就可以实现了

#### 动画化组件

关于动画化组件，前面我们使用的是 *Animated.View* ，目前官方提供的动画化组件有6种：

+ *Animated.Image*
+ *Animated.ScrollView*
+ *Animated.Text*
+ *Animated.View*
+ *Animated.FlatList*
+ *Animated.SectionList*

它们非常强大，基本可以满足大部分动画需求，在实际应用场景中，可以应用于透明度渐变、位移、缩放、颜色的变化等。

#### 手势控制动画

除了上面介绍的一些常见的动画场景，*Animated* 还支持手势控制动画。手势控制动画使用的是 *Animated.event*，它支持将手势或其他事件直接绑定到动态值上。

来看一个示例，下面是使用 *Animated.event* 实现图片水平滚动时的图片背景渐变效果。

```jsx
import React, { useState } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
	Animated,
	ScrollView,
	Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const App = () => {
	const [xOffset, setXOffset] = useState(new Animated.Value(1));

	// const onScrollHandle = (event) => {
	//   console.log(event.nativeEvent.contentOffset.x); // 拿到X轴的偏移量
	// }
	return (
		<View style={styles.container}>
			<ScrollView
				horizontal={true}
				style={styles.imageStyle}
				// onScroll={onScrollHandle}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: { x: xOffset },
							},
						},
					],
					{ useNativeDriver: false }
				)}
			>
				<Animated.Image
					style={[
						styles.imageStyle,
						{
							opacity: xOffset.interpolate({
								inputRange: [0, width],
								outputRange: [1, 0],
							}),
						},
					]}
					source={require('./assets/favicon.png')}
					resizeMode='cover'
				/>
				<Image
					style={styles.imageStyle}
					source={require('./assets/logo.webp')}
					resizeMode='cover'
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 44,
		backgroundColor: '#F5FCFF',
	},
	imageStyle: {
		height: 200,
		width: width,
	},
});

export default App;
```

当 *ScrollView* 逐渐向左滑动时，左边的图片的透明度会逐渐降为 0。

作为提升用户体验的重要手段，动画对于移动应用程序来说是非常重要的，因此合理地使用动画是必须掌握的一项技能。
