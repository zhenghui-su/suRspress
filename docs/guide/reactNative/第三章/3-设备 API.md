## 设备 API

设备 API 主要用于获取当前用户的设备相关信息，从而根据不同的设备信息来做出可能不同的操作，主要包括：

- _Platform_
- _PlatformColor_
- _Appearance_

### Platform

_Platform_ 主要用于获取设备的相关信息。

官方文档地址：[Platform](https://reactnative.cn/docs/platform)

```jsx
import React from 'react';
import { Platform, StyleSheet, Text, ScrollView } from 'react-native';

const App = () => {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text>OS</Text>
			<Text style={styles.value}>{Platform.OS}</Text>
			<Text>OS Version</Text>
			<Text style={styles.value}>{Platform.Version}</Text>
			<Text>isTV</Text>
			<Text style={styles.value}>{Platform.isTV.toString()}</Text>
			{Platform.OS === 'ios' && (
				<>
					<Text>isPad</Text>
					<Text style={styles.value}>{Platform.isPad.toString()}</Text>
				</>
			)}
			<Text>Constants</Text>
			<Text style={styles.value}>
				{JSON.stringify(Platform.constants, null, 2)}
			</Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	value: {
		fontWeight: '600',
		padding: 4,
		marginBottom: 8,
	},
});

export default App;
```

### PlatformColor

每个平台都有系统定义的颜色，尽管可以通过 _Appearance API_ 或 _AccessibilityInfo_ 检测并设置其中的某些样式，但是这样的操作不仅开发成本高早，而且还局限。

RN 从 0.63 版本开始提供了一个开箱即用的解决方案来使用这些系统颜色。_PlatformColor_ 是一个新的 API，可以像 RN 中的其它任何颜色一样使用。

官方文档地址：[PlatformColor](https://reactnative.cn/docs/platformcolor)

例如，在 _iOS_ 上，系统提供一种颜色 _labelColor_，可以在 RN 中这样使用 _PlatformColor_：

```jsx
import { PlatformColor, Text } from 'react-native';

<Text style={{ color: PlatformColor('labelColor') }}>This is a label</Text>;
```

另一方面，_Android_ 提供像 _colorButtonNormal_ 这样的颜色，可以在 RN 中这样使用 _PlatformColor_：

```jsx
import { PlatformColor, Text, View } from 'react-native';

<View style={{ backgroundColor: PlatformColor('?attr/colorButtonNormal') }}>
	<Text>This is color like a button</Text>
</View>;
```

同时 _DynamicColorIOS_ 是仅限于 _iOS_ 的 API，可以定义在浅色和深色模式下使用的颜色。与 _PlatformColor_ 相似，可以在任何可以使用颜色的地方使用:

```jsx
import { DynamicColorIOS, Text } from 'react-native';

const customDynamicTextColor = DynamicColorIOS({
	dark: 'lightskyblue',
	light: 'midnightblue',
});

<Text style={{ color: customDynamicTextColor }}>
	This color changes automatically based on the system theme!
</Text>;
```

最后是一个官方的例子：

```jsx
import React from 'react';
import { Platform, PlatformColor, StyleSheet, Text, View } from 'react-native';

const App = () => (
	<View style={styles.container}>
		<Text style={styles.label}>I am a special label color!</Text>
	</View>
);

const styles = StyleSheet.create({
	label: {
		padding: 16,
		...Platform.select({
			ios: {
				color: PlatformColor('label'),
				backgroundColor: PlatformColor('systemTealColor'),
			},
			android: {
				color: PlatformColor('?android:attr/textColor'),
				backgroundColor: PlatformColor('@android:color/holo_blue_bright'),
			},
			default: { color: 'black' },
		}),
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
```

### Appearance

_Appearance_ 模块主要用于获取用户当前的外观偏好。目前的手机系统一般都可以选择线色模式和深色模式，通过 _Appearance_ 开发者就可以获取此信息。

官方文档地址：[Appearance](https://reactnative.cn/docs/appearance)

_Appearance_ 模块提供了个 _getColorScheme_ 的静态方法，该方法可以获取当前用户首选的配色方案， 对应的值有 3 个:

- _light_：浅色主题

- _dark_：深色主题

- _null_：没有选择外观偏好

例如：

```jsx
import React from 'react';
import { Appearance, StyleSheet, Text, View } from 'react-native';

const App = () => (
	<View style={styles.container}>
		<Text>外观偏好</Text>
		<Text style={styles.value}>{Appearance.getColorScheme()}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	value: {
		fontSize: 20,
		color: 'black',
	},
});

export default App;
```

> 用户对颜色方案的偏好将映射到 Android 10（API 级别 29）、iOS 13 及更高版本设备上用户的浅色或[深色主题](https://developer.android.com/guide/topics/ui/look-and-feel/darktheme)偏好。

尽管颜色方案可以立即使用，但这可能会发生变化（例如，在日出或日落时计划更改颜色方案）。任何依赖于用户首选颜色方案的渲染逻辑或样式都应该在每次渲染时调用此函数，而不是缓存值。

可以使用 _useColorScheme_，因为它提供并订阅了颜色方案更新，或者您可以使用内联样式而不是在 _StyleSheet_ 中设置值。参考地址：[useColorScheme](https://reactnative.cn/docs/usecolorscheme)
