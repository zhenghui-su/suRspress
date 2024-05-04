## RN 基础知识

我们根据 RN 的官网，来学习最基础的操作，主要包含：

- 样式与布局
- 图片
- 文本输入与按钮
- 使用滚动视图
- 使用长列表
- 网络连接

### 样式与布局

在 RN 中，所有组件都接受名为 _style_ 的属性，属性值为一个对象，用来书写 CSS 样式。

书写样式时需要注意的是要按照 _JavaScript_ 语法来使用驼峰命名法，例如将 _background-color_ 改为 _backgroundColor_。

还有就是在 RN 中无法使用缩写样式，例如 _border: 1px solid_ 这样的样式是无法使用的，只能分成两条样式来写 _borderWidth:1_, _borderStyle: 'solid'_

在 RN 中提供了一个 _StyleSheet.create_ 方法来集中定义组件的样式，如下:

```jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
	return (
		<View style={styles.container}>
			<Text style={{ color: 'red', textDecorationLine: 'underline' }}>
				内嵌样式
			</Text>
			<Text style={styles.red}>red</Text>
			<Text style={styles.bigBlue}>blue</Text>
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
	bigBlue: {
		color: 'blue',
		fontWeight: 'bold',
		fontSize: 30,
	},
	red: {
		color: 'red',
	},
});
```

如果要复用 _StyleSheet.create_ 中所定义的样式，可以传入一个数组，但是要注意在数组中位置居后的样式对象比居前的优先级更高，这样你可以间接实现样式的继承。

```jsx
<Text style={[styles.bigBlue, styles.red]}>Red优先级更高</Text>
```

在 RN 中设置样式时，如果涉及到尺寸，默认都是不给单位的，表示的是与设备像素密度无关的逻辑像素点。

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function App() {
	return (
		<View style={styles.container}>
			<View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
			<View style={{ width: 100, height: 100, backgroundColor: 'skyblue' }} />
			<View style={{ width: 150, height: 150, backgroundColor: 'steelblue' }} />
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

在组件样式中，使用 flex 可以使其在可利用的空间中动态地扩张或收缩。一般而言我们会使用 `flex:1` 来指定某个组件扩张以撑满所有剩余的空间。

如果有多个并列的子组件使用了`flex:1`，则这些子组件会平分父容器中剩余的空间。如果这些并列的子组件的 flex 值不一样，则谁的值更大，谁占据剩余空间的比例就更大。

> 即占据剩余空间的比等于并列组件间 flex 值的比。

```jsx
import React from 'react';
import { View } from 'react-native';

export default function App() {
	return (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: 'powderblue' }} />
			<View style={{ flex: 2, backgroundColor: 'skyblue' }} />
			<View style={{ flex: 3, backgroundColor: 'steelblue' }} />
		</View>
	);
}
```

> 注：组件能够撑满剩余空间的前提是其父容器的尺寸不为零。如果父容器既没有固定的 width 和 height，也没有设定 flex，则父容器的尺寸为零。其子组件如果使用了 flex，也是无法显示的。

在进行宽高设置时，还可以很方便的使用百分比来进行设置。例如:

```jsx
import React from 'react';
import { View } from 'react-native';

export default function App() {
	return (
		<View style={{ height: '100%' }}>
			<View style={{ height: '15%', backgroundColor: 'powderblue' }} />
			<View
				style={{ width: '66%', height: '35%', backgroundColor: 'skyblue' }}
			/>
			<View
				style={{ width: '33%', height: '50%', backgroundColor: 'steelblue' }}
			/>
		</View>
	);
}
```

在进行移动端开发时，最推荐的布局方案就是使用 flexbox 弹性盒布局。fiexbox 可以在不同屏幕尺寸上提供一致的布局结构。

RN 中的 flexbox 的工作原理和 Web 上的 CSS 基本一致，当然也存在少许差异。首先是默认值不同：flexDirection 的默认值是 column 而不是 row，而 flex 也只能指定一个数字值。

下面我们来看一个 RN 中 flexbox 的示例:

```jsx
import React from 'react';
import { View } from 'react-native';

export default function App() {
	return (
		// 尝试把 flexDirection 改为 column 试试, 然后去掉它
		<View
			style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}
		>
			<View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
			<View style={{ width: 50, height: 50, backgroundColor: 'skyblue' }} />
			<View style={{ width: 50, height: 50, backgroundColor: 'steelblue' }} />
		</View>
	);
}
```

### 图片

目前，我们的 RN 应用已经有了显示文本的能力，你能够通过弹性盒布局将文本显示到合适的位置。

但是一个应用中不单单只有文字，还会存在图片。在 RN 中，提供了一个名为 Image 的组件来显示图片。例如：

```jsx
<Image source={require('./assets/favicon.png')}
```

来看一个具体的例子，通过 Imgae 组件显示图片

```jsx
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

export default function App() {
	return (
		<View style={styles.container}>
			<Image source={require('./assets/favicon.png')} style={styles.tinyLogo} />
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
	tinyLogo: {
		width: 50,
		height: 50,
	},
});
```

require 中的图片名字必须是一个静态字符串，不能使用变量！因为 require 是在编译时期执行，而非运行时期执行！

```jsx
// 正确
<Image source={require('./favicon.png')} />;
// 错误
const icon = this.props.active ? 'active' : 'inactive';
<Image source={require('./' + icon + '.png')} />;
// 正确
const icon = this.props.active
	? require('./active.png')
	: require('./inactive.png');
<Image source={icon} />;
```

本地图片在引入时会包含图片的尺寸(宽度，高度)信息，但是如果是网络图片，则必须手动指定图片的尺寸。

```jsx
// 正确
<Image
    source={{ uri: 'https://legacy.reactjs.org/logo-og.png' }}
    style={{ width: 400, height: 400 }}
/>
// 错误
<Image
    source={{ uri: 'https://legacy.reactjs.org/logo-og.png' }}
/>
```

### 文本输入与按钮

目前，我们的应用已经能够显示图片和文字，最基本的信息展示已经没问题了。但是一个应用往往还会涉及到用户的文本输入以及最基本的交互——按钮。

#### 文本输入

我们先来看文本输入。

RN 中提供了一个 _TextInput_ 组件，该组件是一个允许用户输入文本的基础组件。它有一个名为 `onChangeText` 的属性，此属性接受一个函数，而此函数会在文本变化时被调用。另外还有一个名为 `onSubmitEditing` 的属性，会在文本被提交后(用户按下软键盘上的提交键)调用。

例如:

```jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

export default function App() {
	const [text, setText] = useState('');
	return (
		<View style={styles.container}>
			<TextInput
				style={{ width: 300, height: 40, borderColor: '#000', borderWidth: 1 }}
				placeholder='请输入内容'
				onChangeText={(text) => setText(text)}
				defaultValue={text}
			/>
			<Text style={{ padding: 10, fontSize: 10 }}>你输入的内容为:</Text>
			<Text>{text}</Text>
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

#### 按钮

按钮也是一个应用中最基本的需求，在 RN 中提供了 Button 组件来渲染按钮，这是一个简单的跨平台的按钮组件，会调用原生环境中对应的按钮组件。

在 _Android_ 设备中，Button 组件显示为一个按钮，而在 _iOS_ 设备中，则显示为一行文本。

该组件需要传递两个必须的属性，一个是 _onPress_，对应点击后的事件，另一个是 _title_，用来指定按钮内的文本信息。

![image-20240424221759559](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240424221759559.png)

```jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function App() {
	const [text, setText] = useState('');
	return (
		<View style={styles.container}>
			<Button title='点击我输出文字' onPress={() => setText('按钮被点击了')} />
			<Text>{text}</Text>
			<Button title='点击我弹出alert' onPress={() => alert('你点击了按钮')} />
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

由于 Button 组件是调用原生代码，因此不同的平台显示的外观是不同的，如果想要各个平台显示的外观都相同，则可以使用 _Touchable_ 系列组件。

![image-20240424222628177](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240424222628177.png)

> 可以参考官方：[TouchableHighlight](https://reactnative.cn/docs/touchablehighlight)、[TouchableOpacity](https://reactnative.cn/docs/touchableopacity)、[TouchableWithoutFeedback](https://reactnative.cn/docs/touchablewithoutfeedback)、[TouchableNativeFeedback 安卓特有](https://reactnative.cn/docs/touchablenativefeedback)

Touchable 系列组件一共有 4 个，其中跨平台的有 3 个：

- _TouchableHighlight_
  Touchable 系列组件中比较常用的一个，它是在 _TouchableWithoutFeedback_ 的基础上添加了一些 UI 上的扩展，即当手指按下的时候，该视图的不透明度会降低，同时会看到视图变暗或者变亮，该标签可以添加 style 样式属性。

> 官方现在推荐使用 Pressable，参考[Pressable](https://reactnative.cn/docs/pressable)
>
> ![image-20240424223758687](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240424223758687.png)

- _TouchableOpacity_

  完全和 _TouchabieHighlight_ 相同，只是不可以修改颜色，只能修改透明度。

- _TouchableWithoutFeedback_
  最基本的一个 Touchable 组件，只响应用户的点击事件，不会做任何 UI 上的改变，所以不用添加 style 样式属性，加了也没效果。

另外在 Android 平台上支持一个叫 _TouchableNativeFeedback_ 的组件:

- TouchableNativeFeedback

  为了支持 Android 5.0 的触控反馈而新增的组件。该组件在 _TouchableWithoutFeedback_ 所支持的属性的基础上增加了触摸的水波纹效果。可以通过 _background_ 属性来自定义原生触摸操作反馈的背景。(仅限 _Android_ 平台，_iOS_ 平台使用会报错)

_TouchableHighlight_ 示例如下：

```jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default function App() {
	return (
		<View style={styles.container}>
			<TouchableHighlight
				onPress={() => console.log('触摸效果')}
				onLongPress={() => console.log('长按效果')}
				onPressIn={() => console.log('触摸开始')}
				onPressOut={() => console.log('触摸结束')}
			>
				<View
					style={{
						width: 260,
						height: 50,
						alignItems: 'center',
						backgroundColor: '#2196F3',
					}}
				>
					<Text
						style={{
							lineHeight: 50,
							color: 'white',
						}}
					>
						Touch Here
					</Text>
				</View>
			</TouchableHighlight>
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

### 使用滚动视图

到目前为止，我们的应用能显示文字、图片，也能够进行简单的互动。但还有一个很重要的需求，那就是滑屏操作。

RN 中，则直接为我们提供了滚动视图的组件 _ScrollView_。

_ScrollView_ 是一个通用的可滚动的容器，你可以在其中放入多个组件和视图，而且这些组件并不需要是同类型的。_ScrollView_ 不仅可以垂直滚动，还能水平滚动(通过 _horizontol_ 属性来设置)。

示例如下：

```jsx
import React from 'react';
import { ScrollView, Image, Text } from 'react-native';

export default function App() {
	const logo = {
		uri: 'https://legacy.reactjs.org/logo-og.png',
		width: 64,
		height: 64,
	};
	return (
		<ScrollView>
			<Text>Text</Text>
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
			<Image source={logo} />
		</ScrollView>
	);
}
```

### 使用长列表

除了 _ScrollView_ 滚动视图组件外，RN 中还提供了用于长列表组件。常见的长列表有两个：

- FlatList
- SectionList

#### FlatList

_FlatList_ 组件用于显示一个垂直的滚动列表，其中的元素之间结构近似而仅数据不同。

_FlatList_ 更适于长列表数据，且元素个数可以增删。和 _ScrollView_ 不同的是，_FlatList_ 并不立即渲染所有元素，而是优先渲染屏幕上可见的元素。

_FlatList_ 组件必须的两个属性是 _data_ 和 _renderItem_。dota 是列表的数据源，而 _renderItem_ 则从数据源中逐个解析数据，然后返回一个设定好格式的组件来渲染。

下面的例子创建了一个简单的 _FlatList_，并预设了一些模拟数据。首先是初始化 _FlatList_ 所需的 _data_，其中的每一项(行) 数据之后都在 _renderItem_ 中被渲染成了 _Text_ 组件，最后构成整个*FlatList* 。

```jsx
import React from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

export default function App() {
	// FlatList 所用数据
	const data = [
		{ key: '张三' },
		{ key: '李四' },
		{ key: '王五' },
		{ key: '坤坤' },
		{ key: '唱歌' },
		{ key: '跳舞' },
		{ key: '篮球' },
		{ key: '基尼太美' },
		{ key: '张三' },
		{ key: '李四' },
		{ key: '王五' },
		{ key: '坤坤' },
		{ key: '唱歌' },
		{ key: '跳舞' },
		{ key: '篮球' },
		{ key: '基尼太美' },
		{ key: '张三' },
		{ key: '李四' },
		{ key: '王五' },
		{ key: '坤坤' },
		{ key: '唱歌' },
		{ key: '跳舞' },
		{ key: '篮球' },
		{ key: '基尼太美' },
	];
	return (
		<FlatList
			data={data}
			renderItem={({ item }) => {
				return <Text style={styles.item}>{item.key}</Text>;
			}}
			keyExtractor={(item, index) => index}
		/>
	);
}

const styles = StyleSheet.create({
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
		borderWidth: 1,
		borderColor: '#ccc',
		marginBottom: 10,
	},
});
```

#### SectionList

如果要渲染的是一组需要分组的数据，也许还带有分组标签的，那么 _SectionList_ 将是个不错的选择。

```jsx
import React from 'react';
import { StyleSheet, FlatList, Text, View, SectionList } from 'react-native';

export default function App() {
	// SectionList 所用数据
	const setions = [
		{ title: '标题：法外', data: ['法外狂徒', '张三'] },
		{
			title: '标题：坤坤',
			data: [
				'寄你太美',
				'鸡你太美',
				'篮球太美',
				'坤你太美',
				'坤鸡太没',
				'夺坤鸡',
				'暗藏玄鸡',
			],
		},
	];
	return (
		<SectionList
			sections={setions}
			renderItem={({ item }) => {
				return <Text style={styles.item}>{item}</Text>;
			}}
			renderSectionHeader={({ section }) => {
				return <Text style={styles.sectionHeader}>{section.title}</Text>;
			}}
			keyExtractor={(item, index) => index}
		/>
	);
}

const styles = StyleSheet.create({
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
		borderWidth: 1,
		borderColor: '#ccc',
		marginBottom: 10,
	},
	sectionHeader: {
		padding: 10,
		fontSize: 25,
		fontWeight: 'bold',
		backgroundColor: '#eee',
		marginTop: 30,
	},
});
```

在上面的示例中，我们使用到了 _SectionList_ 组件的 4 个属性，分别是

- _sections_ (必填)：用来渲染的数据，类似于 _FlatList_ 中的 _data_ 属性。

- _renderItem_ (必填) ：用来渲染每一个 section 中的每一个列表项的默认渲染器。必须返回一个 react 组件。

- _renderSectionHeader_：在每个 _section_ 的头部渲染。在 _iOS_ 上，这些 _headers_ 是默认粘接在 _ScrollView_ 的顶部的。

- _keyExtractor_：此函数用于为给定的 _item_ 生成一个不重复的 key。

  key 的作用是使 react 能区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。

  若不指定此函数，则默认抽取 _item.key_ 作为 key 值。若 _item.key_ 也不存在，则使用数组下标。注意这只设置了每行 _(item)_ 的 key，对于每个组 _(section)_ 仍然需要另外设置 key。

### 网络连接

开发应用时，我们往往还需要从服务器上面获取数据。

在 RN 中，支持 _fetchAPI_ 以及传统的 Ajax 的形式来发送网络请求，但是这里推荐使用最新的 _fetch_ 形式来发送请求。

> 当然基于 XMLHttpRequest 封装的 axios 也可以使用哦，不过不能使用 JQuery，[参考官网](https://reactnative.cn/docs/network#%E4%BD%BF%E7%94%A8%E5%85%B6%E4%BB%96%E7%9A%84%E7%BD%91%E7%BB%9C%E5%BA%93)

注意：默认情况下 _iOS_ 会阻止所有的 _http_ 的请求，以督促开发者使用 _https_。从 _Android9_ 开始，也会默认阻止 _http_ 请求

下面我们来看一个在 RN 中使用 _fetch_ 发送请求的示例:

```jsx
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default function App() {
	function getInfo() {
		return fetch('https://cnodejs.org/api/v1/topics')
			.then((res) => res.json())
			.then((res) => {
				console.log(res, 'res');
			})
			.catch((err) => {
				console.error(err);
			});
	}
	return (
		<View style={styles.container}>
			<Button onPress={getInfo} title='点击按钮获取数据' color='skyblue' />
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

输出结果如下：

![image-20240424233337476](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240424233337476.png)

我们试试用 axios，下载一下

```bash
npm i axios
```

然后改一下

```jsx
import axios from 'axios';
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default function App() {
	function getInfo() {
		return axios
			.get('https://cnodejs.org/api/v1/topics')
			.then((res) => {
				console.log(res, 'res');
			})
			.catch((err) => {
				console.error(err);
			});
	}
	return (
		<View style={styles.container}>
			<Button onPress={getInfo} title='点击按钮获取数据' color='skyblue' />
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

依旧成功，输出如下

![image-20240424233710750](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240424233710750.png)
