## Animated 实战案例

前面的都有点基础，这节我们综合之前学到的知识做一个案例，效果如下：

![image-20240503230440817](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240503230440817.png)

滑动几下后

![image-20240503230506587](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240503230506587.png)

可以先复制样式，写样式浪费时间不值得

```js
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollContainer: {
		height: 300,
		alignContent: 'center',
		justifyContent: 'center',
	},
	card: {
		flex: 1,
		marginVertical: 4,
		marginHorizontal: 16,
		borderRadius: 5,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textContainer: {
	  backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 24,
		paddingVertical: 8,	
		borderRadius: 5,
	},
	infoText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	normalDot: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: 'silver',
		marginHorizontal: 4,
	},
	indicatorContainer: {
	  flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
	}
});
```

然后我们先写一个简单的，先出现一个图片，这里可以用本地也可以用网上，自行选择

```jsx
import React, { useState } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
	ImageBackground,
	ScrollView,
	Animated,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
// 图片链接
const imageURL = "";

const App = () => {
	return (
		<View style={styles.container}>
			<View style={styles.scrollContainer}>
				{/* 上面滑动图片部分 */}
				<ScrollView>
					<View style={{ width: windowWidth, height: 250 }}>
						<ImageBackground source={{ uri: imageURL }} style={styles.card} />
					</View>
				</ScrollView>
				{/* 下面小圆点部分 */}
			</View>
		</View>
	);
};

export default App;
```

如下面的效果：

![image-20240503221310574](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240503221310574.png)

然后我们通过循环生成六个图片，我们先用弄一个数组

```js
// 图片链接
const images = new Array(6).fill('图片链接');
```

然后循环生成

```jsx
<ScrollView>
	{images.map((image, imageIndex) => {
		return (
			<View
                style={{ width: windowWidth, height: 250 }}
                key={imageIndex}
            >
				<ImageBackground
					source={{ uri: image }}
					style={styles.card}
				/>
			</View>
		);
	})}
</ScrollView>
```

然后我们为了区分每个图片，我们加一个文字进去

```jsx
<ImageBackground source={{ uri: image }} style={styles.card}>
	<View style={styles.textContainer}>
		<Text style={styles.infoText}>
			{'Image - ' + (imageIndex + 1)}
		</Text>
	</View>
</ImageBackground>
```

如下：

![image-20240503223052351](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240503223052351.png)

然后我们改一下 *ScrollView* 的属性，让他水平排列，不显示滚动条以及启用分页

```jsx
<ScrollView
	horizontal={true} // 水平排列
	showsHorizontalScrollIndicator={false} // 不显示水平滚动条
	pagingEnabled={true} // 当值为 true 时，滚动条会停在滚动视图的尺寸的整数倍位置。这个可以用在水平分页上。默认值为 false。
>
	{/* 原内容 */}
</ScrollView>
```

然后我们写下面的小圆点部分

```jsx
{/* 下面小圆点部分 */}
<View style={styles.indicatorContainer}>
	{images.map((image, imageIndex) => {
		return (
			<View style={styles.normalDot}></View>
		);
	})}
</View>
```

但现在小圆点和我们的图片没有关联起来，我们就用 *Animated* 来做，先一个状态

```jsx
const [scrollX] = useState(new Animated.Value(0));
```

然后给 *ScrollView* 的 *onScroll* 事件加上 *Animated.event* 来映射 x 的偏移到我们设置的状态

```jsx
<ScrollView
	horizontal={true}
	showsHorizontalScrollIndicator={false}
	pagingEnabled={true}
	// 当我们滚动图片的时候会有个实时的 x 变化, 我们将这个 x 映射到 scrollX 中
	onScroll={Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{ useNativeDriver: false }
)}
></ScrollView>
```

然后修改下面的小圆点，给样式部分加上

```jsx
<View style={styles.indicatorContainer}>
	{images.map((image, imageIndex) => {
	// 根据 scrollX 的值来动态地修改小圆点的 width
	return (
		<Animated.View
			style={[
				styles.normalDot,
				{
					width: scrollX.interpolate({
					inputRange: [
						windowWidth * (imageIndex - 1),
						windowWidth * imageIndex,
						windowWidth * (imageIndex + 1),
					],
					outputRange: [8, 16, 8],
				}),
				},
			]}
			key={imageIndex}
		/>
	);
	})}
</View>
```

这里其实就是如果是当前的选中的索引，就将它的宽度设置大一点，很容易理解

但目前还有问题是，只显示了2个或3个小圆点，其它的没了

![image-20240503225608697](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240503225608697.png)

原因很简单，就是在超出我们设定的范围时候，会自动进行增量计算，所以在我们选中之前或之后的第二个小圆点开始就变为0了

> 可以看看官网文档：[插值](https://reactnative.cn/docs/animations#%E6%8F%92%E5%80%BC)，通过设置 *extrapolate*、*extrapolateLeft* 或 *extrapolateRight* 属性来限制输出区间。默认值是 *extend*（允许超出），不过你可以使用 *clamp* 选项来阻止输出值超过 *outputRange*。

```jsx
<View style={styles.indicatorContainer}>
	{images.map((image, imageIndex) => {
	// 根据 scrollX 的值来动态地修改小圆点的 width
	return (
		<Animated.View
			style={[
				styles.normalDot,
				{
					width: scrollX.interpolate({
					inputRange: [
						windowWidth * (imageIndex - 1),
						windowWidth * imageIndex,
						windowWidth * (imageIndex + 1),
					],
					outputRange: [8, 16, 8],
                    extrapolate: 'clamp', // 不进行增量计算
				}),
				},
			]}
			key={imageIndex}
		/>
	);
	})}
</View>
```

然后这个案例就完成啦，总的代码如下：

```jsx
import React, { useState } from 'react';
import {
	StyleSheet,
	Dimensions,
	View,
	ImageBackground,
	ScrollView,
	Animated,
	Text,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
// 图片链接
const images = new Array(6).fill(
	'图片链接地址'
);

const App = () => {
	const [scrollX] = useState(new Animated.Value(0));

	return (
		<View style={styles.container}>
			<View style={styles.scrollContainer}>
				{/* 上面滑动图片部分 */}
				<ScrollView
					horizontal={true} // 水平排列
					showsHorizontalScrollIndicator={false} // 不显示水平滚动条
					pagingEnabled={true} // 当值为 true 时，滚动条会停在滚动视图的尺寸的整数倍位置。这个可以用在水平分页上。默认值为 false。
					// 当我们滚动图片的时候会有个实时的 x 变化, 我们将这个 x 映射到 scrollX 中
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: false }
					)}
				>
					{images.map((image, imageIndex) => {
						return (
							<View
								style={{ width: windowWidth, height: 250 }}
								key={imageIndex + image}
							>
								<ImageBackground source={{ uri: image }} style={styles.card}>
									<View style={styles.textContainer}>
										<Text style={styles.infoText}>
											{'Image - ' + (imageIndex + 1)}
										</Text>
									</View>
								</ImageBackground>
							</View>
						);
					})}
				</ScrollView>
				{/* 下面小圆点部分 */}
				<View style={styles.indicatorContainer}>
					{images.map((image, imageIndex) => {
						// 根据 scrollX 的值来动态地修改小圆点的 width
						return (
							<Animated.View
								style={[
									styles.normalDot,
									{
										width: scrollX.interpolate({
											inputRange: [
												windowWidth * (imageIndex - 1),
												windowWidth * imageIndex,
												windowWidth * (imageIndex + 1),
											],
											outputRange: [8, 16, 8],
											extrapolate: 'clamp', // 不进行增量计算
										}),
									},
								]}
								key={imageIndex}
							/>
						);
					})}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollContainer: {
		height: 300,
		alignContent: 'center',
		justifyContent: 'center',
	},
	card: {
		flex: 1,
		marginVertical: 4,
		marginHorizontal: 16,
		borderRadius: 5,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textContainer: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		paddingHorizontal: 24,
		paddingVertical: 8,
		borderRadius: 5,
	},
	infoText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	normalDot: {
		height: 8,
		width: 8,
		borderRadius: 4,
		backgroundColor: 'silver',
		marginHorizontal: 4,
	},
	indicatorContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
	},
});

export default App;
```

