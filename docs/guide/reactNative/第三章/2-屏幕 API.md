## 屏幕 API

这一小节我们来看 RN 中和屏幕信息相关的 API，如下：

+ *Dimensions*
+ *PixelRatio*

### Dimensions

*Dimensions* 这个 API 在前面学习组件相关知识的时候，我们已经见到过它了。这里我们来正式介绍该 API。

官方文档地址：[Dimensions](https://reactnative.cn/docs/dimensions)

该 *API* 主要用于获取设备屏幕的宽高，*Dimensions* 的使用比较简单，只需要使用 *get* 方法即可获取宽高信息，如下：

```js
const windowWidth = Dimensions.get('windows').width;
const windowheigth = Dimensions.get('windows').heigth;
```

当然还有一种方法，利用解构

```js
const { width, height } = Dimensions.get('windows')
```

> 对于 Android，`window` 尺寸将不包括 `状态栏`（如果不透明）和 `底部导航栏` 占用的大小。

```jsx
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height, scale } = Dimensions.get('window');

const App = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.textStyle}>屏幕宽: {width}</Text>
			<Text style={styles.textStyle}>屏幕高: {height}</Text>
			<Text style={styles.textStyle}>Scale(尺寸): {scale}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textStyle: {
		fontSize: 18,
		color: '#333',
	},
});

export default App;
```

> 注意：尽管尺寸信息立即就可用，但它可能会在将来被修改（譬如设备的方向改变），所以基于这些常量的渲染逻辑和样式应当每次 render 之后都调用此函数，而不是将对应的值保存下来。（举例来说，你可能需要使用内联的样式而不是在`StyleSheet`中保存相应的尺寸）。

对于 React 函数组件，官方更推荐使用[`useWindowDimensions`](https://reactnative.cn/docs/usewindowdimensions)这个 Hook API。和 `Dimensions` 不同，它会在屏幕尺寸变化时自动更新。参考：[useWindowDimensions](https://reactnative.cn/docs/usewindowdimensions)

### PixelRatio

*PixelRatio* 可以获取到设备的物理像素和 *CSS* 像素的比例，也就是 *DPR*。

如果 *CSS* 像素和设备像素 *1:1* 关系，那么 *DPR* 值就为 1。如果 1 个 *CSS* 像素对应 2 个设备像素，那么 *DPR* 值就为 2。

说简单点，就是一个 *CSS* 像素要用多少个设备像素来显示。如果 *DPR* 值为 1，表示用一个设备像素就够了，如果 *DPR* 值为 2，则表示一个 *CSS* 像素要用 2 个设备像素来表示。

以 *iPhone4* 为例，设备的物理像素为 640，为 *CSS* 像素为 320，因此 *PixelRatio* 值为2。

在 RN 中，通过`PixelRatio.get()`方法即可获取 *DPR* 值。

官方文档地址：[PixelRatio](https://reactnative.cn/docs/pixelratio)

```jsx
import React from 'react';
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

const DPR = PixelRatio.get();

const App = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.textStyle}>DPR值: {DPR}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textStyle: {
		fontSize: 18,
		color: '#333',
	},
});

export default App;
```

常见的屏幕像素密度表如下：

| 设备像素密度 | 设备                                                      |
| ------------ | --------------------------------------------------------- |
| 1            | iPhone2G/3G/3GS 以及 mdpi Android 设备                    |
| 1.5          | hdpi Android 设备                                         |
| 2            | iPhone4/5s/5/5c/5s/6/7/8 以及 xdpi Android 设备           |
| 3            | iPhone6Plus/6sPlus/7Plus/X/XS/Max 以及 xxdpi Android 设备 |
| 3.5          | Nexus6/PixelXL/2XL Android设备                            |

我们通过前面的学习已经知道，在 RN 中所有尺寸都是没有单位的，例如: `width: 100`，这是因为 RN 中尺寸只有一个单位 dp，这是一种基于屏幕密度的抽象单位，默认省略。

在 RN 中，我们可以通过 *PixelRatio* 来将真实像素大小和 dp 单位进行一个转换

+ `static getPixelSizeForLayoutSize(layoutSize: number): number`：将dp 单位转为 真实像素 px。返回值是一个四舍五入的整型
+ `static roundToNearestPixel(layoutSize)`：将真实像素 px 转为 dp 单位

```jsx
import React from 'react';
import { PixelRatio, View } from 'react-native';

const dpTopx = (dp) => PixelRatio.getPixelSizeForLayoutSize(dp);
const pxTodp = (px) => PixelRatio.roundToNearestPixel(px);

const App = () => {
	return (
		<View>
			<View
				style={{
					width: pxTodp(100),
					height: pxTodp(100),
					backgroundColor: 'red',
				}}
			/>
			<View
				style={{
					width: dpTopx(100),
					height: dpTopx(100),
					backgroundColor: 'green',
				}}
			/>
		</View>
	);
};

export default App;
```

