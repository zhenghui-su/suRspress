## Pressable 组件

通过前面的学习，我们已经知道在 RN 中提供了 *Button* 和 *Touchable* 这两个交互组件来处理用户的点击操作。但是到了RN 0.63版本，官方又提供了新的交互组件: *Pressable* 。

新的交互组件在未来将替代目前可以进行交互的组件: *Button*，*TouchableWithoutFeedback*，*TouchableHighlight*，*TouchableOpacity*，*TouchableNativeFeedback*。

新核心组件 *Pressable*，可用于检测各种类型的交互。提供的 API 可以直接访问当前的交互状态，而不必在父组件中手动维护状态。它还可以使用各平台的所有功能，包括悬停，模糊，聚焦等。RN 希望开发者利用 *Pressable* 去设计组件，而不是使用带有默认效果的组件。如: *TouchableOpacity*。

那么在这里，我们就要对这几代不同的交互组件做一个总结。

首先，开发者在开发时会用到点按组件，那么它的功能越简单开发者用起来就越轻松：但是与其相对的，应用最后开发出来是给用户使用的，对于用户来讲，则是希望功能越丰富就越能满足各种场景的需求。

那是让开发者简单易用好，还是用丰富的功能去满足用户，有没有两全其美之计?

实际上，RN 的点按组件经历了三个版本的迭代，才找到了两全其美的答案。等你了解了这个三个版本的迭代思路后，你就能很好明白优秀通用组件应该如何设计，才能同时在用户体验 UX 和开发者体验 DX 上找到平衡。

### 第一代 Touchable 组件

是的，你没有看错，*Touchable* 系列组件反而是在 RN 中所提供的第一代点按组件。

第一代点按组件想要解决的核心问题是，提过多种反馈风格。

一个体验好的点按组件，需要在用户点按后进行实时地反馈，通过视觉变化等形式，告诉用户点到了什么，现在的点击状态又是什么。

但不同的原生平台，有不同的风格，反馈样式也不同。*Android* 按钮点击后会有涟漪，*iOS* 按钮点击后会降低透明度或者加深背景色。RN 是跨平台的，那它应该如何支持多种平台的多种反馈风格呢?

第一代 *Touchable* 点按组件的设计思路是，提供多种原生平台的反馈风格给开发者自己选择。所以我们看到整个 *Touchable* 是一套组件，让开发者自己选择。

不过，对于开发者来讲，有经验的开发者可能知道如何进行选择，但新手却要花上很长时间，去了解不同组件之间的区别。所以说，*Touchable* 点按组件在提供多样性的功能支持的同时，也带来了额外的学习成本。

为了降低学习成本，RN团队又开发了第二代点按组件——Button。

### 第二代 Button 组件

第二代 *Button* 组件的实质是对 *Touchable* 组件的封装。在 *Android* 上是*TouchableNativeFeedback* 组件，在 *iOS* 上是 *TouchableOpacity* 组件。

*Button* 组件的设计思想就是，别让开发者纠结选啥组件了，框架已经选好了，点按反馈的样式就和原生平台的自身风格保持统一就好了。

但是这仍然存在一个问题，那就是要让大多数开发者都选择同一个默认的 *UI* 样式真是太难了，萝卜白菜各有所爱。

另外，用户的审美也在慢慢地变化，涟漪风格也好，降低透明风格也好，背景高亮风格也好，或许几年后就不会再流行了。甚至连 *Button* 这个概念本身，都在慢慢地变化，现在的 *App* 中几平只要是个图片或者文字都能点按，不再局限干只有四四方方的色块才能点按了。

### 第三代 Pressable 组件

第三代 *Pressable* 点按组件，不再是 *Touchable* 组件的封装，而是一个全新重构的点按组件，它的反馈效果可由开发者自行配置。

下面我们就来看一下 *Pressable* 组件的相关知识。

*Pressable* 是一个核心组件的封装，它可以检测到任意子组件的不同阶段的按压交互情况。

```jsx
<Pressable onPress={onPressFunction}>
	<Text>我是 Pressable</Text>
</Pressable>
```

在被 *Pressable* 包装的元素上：

+ *onPressIn* 在按压时被调用
+ *onPressOut* 在按压动作结束后被调用

在按下 *onPressIn* 后，将会出现如下两种情况的一种：

+ 用户移开手指，依次触发 *onPressOut* 和 *onPress* 事件
+ 按压持续 500 毫秒以上，触发 *onLongPress* 事件。(*onPressOut* 在移开手后依旧会触发)

![image-20240427225618324](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240427225618324.png)

下面一个例子来展示

```jsx
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

export default function App() {
	const onPressHandle = () => {
		console.log('onPress');
	};
	const onPressInHandle = () => {
		console.log('onPressIn');
	};
	const onPressOutHandle = () => {
		console.log('onPressOut');
	};
	const onLongPressHandle = () => {
		console.log('onLongPress');
	};
	return (
		<View style={styles.container}>
			<Pressable
				onPress={onPressHandle}
				onPressIn={onPressInHandle}
				onPressOut={onPressOutHandle}
				onLongPress={onLongPressHandle}
			>
				<Text>Press ME!</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
```

在上面的示例中，当我们轻点按钮时，会依次触发 PressIn、Press、PressOut，而如果按住不放，则是先触发 PressIn，500ms后触发 LongPress，松开之后触发 PressOut。

![image-20240427230435249](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240427230435249.png)

关于点按时的样式，也是可以自定义的。来看下面的示例:

```jsx
import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';

export default function App() {
	const onPressHandle = () => {
		console.log('onPress');
	};
	const onPressInHandle = () => {
		console.log('onPressIn');
	};
	const onPressOutHandle = () => {
		console.log('onPressOut');
	};
	const onLongPressHandle = () => {
		console.log('onLongPress');
	};
	return (
		<View style={styles.container}>
			<Pressable
				onPress={onPressHandle}
				onPressIn={onPressInHandle}
				onPressOut={onPressOutHandle}
				onLongPress={onLongPressHandle}
				style={({ pressed }) => {
					return pressed ? styles.pressdStyle : styles.unPressdStyle;
				}}
			>
				{/* 可以根据是否按压来决定 Text 的样式 */}
				{({ pressed }) => {
					return (
						<Text
							style={
								pressed
									? { color: 'red', textAlign: 'center' }
									: { color: 'blue', textAlign: 'center' }
							}
						>
							Pressable
						</Text>
					);
				}}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	pressdStyle: {
		backgroundColor: 'rgb(210, 230, 255)',
		height: 100,
		lineHeight: 100,
	},
	unPressdStyle: {
		backgroundColor: '#ccc',
	},
});
```

没按下的时候是这样的

![image-20240427231732577](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240427231732577.png)

而在按下的时候就是这样的，样式会变化

![image-20240427231746381](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240427231746381.png)

> 当然也可以返回不同的 JSX

*Pressable* 组件有一个可触发区域 *HitRect*，默认情况下，可触发区域 *HitRect* 就是盒模型中的不透明的可见区域。你可以超过修改 *HitRect* 的值，直接扩大可触发区域。

例如：

```jsx
<Pressable
    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
>
	...
</Pressable>
```

在上面的示例中，我们增加了 *Pressable* 组件的可点击区域，并且明确指定了4个边各自扩充多少。在老点不中、老勾不中的场景中，你可以在不改变布局的前提下，设置 *Pressable* 组件的可触发区域 *HitSlop*，让可点击区域多个10像素、20 像素，让用户的更容易点中。

另外，在 *Pressable* 组件中还有一个可保留区域 *PressRect* 的概念。

点按事件可保留区域的偏移量 (*Press Retention Offset*) 默认是0，也就是说默认情况下可见区域就是可保留区域。你可以通过设置 *pressRetentionOffset* 属性，来扩大可保留区域 *PressRect*。 

举一个例子，当你在购物 App 点击购买按钮时，你已经点到购买按钮了，突然犹豫，开始进行心理博弈，想点又不想点。手指从按钮上挪开了，又挪了进去，然后又挪开了，如此反复。这时还要不要触发点击事件呢？要不要触发，其实是根据你手指松开的位置来判断的，如果你松手的位置在可保留区域内那就要触发，如果不是那就不触发。

![image-20240427232638036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240427232638036.png)

最后是官方的示例：

```jsx
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const App = () => {
  const [timesPressed, setTimesPressed] = useState(0);

  let textLog = '';
  if (timesPressed > 1) {
    textLog = timesPressed + 'x onPress';
  } else if (timesPressed > 0) {
    textLog = 'onPress';
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setTimesPressed((current) => current + 1);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : 'white'
          },
          styles.wrapperCustom
        ]}>
        {({ pressed }) => (
          <Text style={styles.text}>
            {pressed ? 'Pressed!' : 'Press Me'}
          </Text>
        )}
      </Pressable>
      <View style={styles.logBox}>
        <Text testID="pressable_press_console">{textLog}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 16
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9'
  }
});

export default App;
```

