## RN 内置基础组件

在上一章节中，我们已经对 RN 有了一个最基本的了解，接下来我们继续挖掘 RN 的其他内容

打开 RN 的官网，可以看到官方文档中核心分为 4 个部分，分别是：

+ Guides（向导）
+ Component（内置组件）
+ API（接口文档）
+ Architecture（架构）

在上一章中，我们相当于把 Guides 的部分内容学完了，本章我们就着重来学习 Component 和 API 。

![image-20240426145903625](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240426145903625.png)

RN 的内置组件在不同的宿主环境会被编译为不同的组件

其核心组件又可以根据用途分为以下几大类：

+ 基础组件
+ 容器组件
+ 列表组件
+ 功能组件

本小节我们先来看第一类组件——基础组件。基础组件大致如下：

+ *Image* 组件
+ *TextInput* 组件
+ *Button* 组件
+ *Switch* 组件

### Image 组件

*Image* 是一个图片展示组件，其作用类似于 *Andriod* 的 *imageView* 或者 iOS 的 *UIImageview*。*Image* 组件支持多种类型的图片显示，包括网络图片、静态资源、base64 图片格式。

要使用 *Image* 组件加载图片，只需要设置 *source* 属性即可，如果加载的是网络图片，还需要添加 *uri*  标识以及手动指定图像的尺寸。

目前，*Image* 组件支持的图片格式有 PNG、JPG、JPEG、BMP、GIF、WebP 以及 PSD(仅iOS）。默认情况下 Android 是不支持 GIF 和 WebP 格式的。你需要在`android/app/build.gradle`文件中根据需要手动添加以下模块：

```javascript
dependencies {
  // 如果你需要支持Android4.0(API level 14)之前的版本
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // 如果你需要支持GIF动图
  implementation 'com.facebook.fresco:animated-gif:2.5.0'

  // 如果你需要支持WebP格式，包括WebP动图
  implementation 'com.facebook.fresco:animated-webp:2.5.0'
  implementation 'com.facebook.fresco:webpsupport:2.5.0'

  // 如果只需要支持WebP格式而不需要动图
  implementation 'com.facebook.fresco:webpsupport:2.5.0'
}
```

API 文档地址：[Image](https://www.reactnative.cn/docs/image)

使用 *Image* 组件时，有一个常用的属性 *resizeMode*，此属性用于控制当组件和图片尺寸不成比例时以何种方式调整图片的大小，对应的值有5种:

+ cover：在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸。
+ contain：在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸。
+ stretch：拉伸图片且不维持图片的宽高比，直到宽度和高度都刚好填满容器。
+ repeat：在维持原始尺寸的前提下，重复平铺图片直到填满容器。
+ center：居中且不拉伸的显示图片。

下面的示例演示了不同属性值之间视觉效果上的区别:

```jsx
import { StyleSheet, Text, View, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/favicon.png")}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.text}>cover</Text>
      <Image
        source={require("./assets/favicon.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>contain</Text>
      <Image
        source={require("./assets/favicon.png")}
        style={styles.image}
        resizeMode="stretch"
      />
      <Text style={styles.text}>stretch</Text>
      <Image
        source={require("./assets/favicon.png")}
        style={styles.image}
        resizeMode="repeat"
      />
      <Text style={styles.text}>repeat</Text>
      <Image
        source={require("./assets/favicon.png")}
        style={styles.image}
        resizeMode="center"
      />
      <Text style={styles.text}>center</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  image: {
    width: 140,
    height: 110,
    backgroundColor: "red",
  },
  text: {
    justifyContent: "center",
    fontSize: 24,
  },
});
```

> 更多属性可以参考官方的文档

### TextInput 组件

*TextInput* 是一个输入框组件，用于将文本内容输入到 *TextInput* 组件上。作为一个高频使用的组件，*TextInput* 支持自动拼写、自动大小写切换、占位默认字符设置以及多种键盘设置功能。

```jsx
import { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [number, SetNumber] = useState(null);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="默认为字母键盘"
        value={text}
        onChangeText={(t) => setText(t)}
      />
      <TextInput
        style={styles.input}
        placeholder="默认为数字键盘"
        value={number}
        onChangeText={(n) => SetNumber(n)}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
```

API 文档地址：[TextInput](https://www.reactnative.cn/docs/textinput)

需要注意的是，`TextInput`在安卓上默认有一个底边框，同时会有一些 padding。如果要想使其看起来和 iOS 上尽量一致，则需要设置`padding: 0`。

下面我们来看一个实际开发中使用到 *TextInput* 的案例——搜索框，如下：

```jsx
import { useState } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";

export default function App() {
  const [text, setText] = useState("");
  const [show, SetShow] = useState(false);

  const showOption = (newVal) => {
    setText(newVal);
    SetShow(true);
  }
  const hideOption = (newVal) => {
    setText(newVal);
    SetShow(false);
  };
  return (
    <View style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        {/* 输入框 */}
        <TextInput
          style={styles.inputStyle}
          placeholder="请输入搜索内容"
          returnKeyType="search" // 键盘右下角按钮样式
          value={text}
          onChangeText={(t) => showOption(t)} // 当文本框内容变化时调用此回调函数。改变后的文字内容会作为参数传递。
          onEndEditing={() => alert(text)} // 当文本输入结束后调用此回调函数。
        />
        {/* 搜索按钮 */}
        <View style={styles.btnStyle}>
          <Text style={styles.search} onPress={() => alert(text)}>
            搜索
          </Text>
        </View>
      </View>
      {/* 搜索结果 */}
      {show ? (
        <View style={styles.resultStyle}>
          <Text
            style={styles.itemsStyle}
            numberOfLines={1} // 用来当文本过长时候裁剪文本
            onPress={() => hideOption(text + "街道")}
          >
            {text} 街道
          </Text>
          <Text
            style={styles.itemsStyle}
            numberOfLines={1}
            onPress={() => hideOption(text + "道路")}
          >
            {text} 道路
          </Text>
          <Text
            style={styles.itemsStyle}
            numberOfLines={1}
            onPress={() => hideOption(text + "车站")}
          >
            {text} 车站
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    paddingTop: 25,
  },
  searchContainer: {
    height: 45,
    flexDirection: "row",
  },
  inputStyle: {
    height: 45,
    flex: 1,
    marginTop: 20,
    borderWidth: 1,
    marginLeft: 10,
    paddingLeft: 5,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  btnStyle: {
    width: 80,
    marginTop: 20,
    marginLeft: -5,
    marginRight: 10,
    backgroundColor: "#23BEFF",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  resultStyle: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    height: 200,
    borderColor: "#ccc",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  itemsStyle: {
    fontSize: 16,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderTopWidth: 0,
  },
});
```

### Button 组件

Button是一个最基本的按钮组件，可以在跨平台上很好地呈现，支持最低级别的定制。

API 文档地址：[Button](https://www.reactnative.cn/docs/button)

```jsx
import React from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";

const Separator = () => <View style={styles.separator} />;

const App = () => (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        title 和 onPress 处理程序是必需的。建议设置 accessibilityLabel
        可帮助您的应用程序人人可用。
      </Text>
      <Button title="点击我" onPress={() => Alert.alert("按下简单按钮")} />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>
        以在每个平台上看起来标准的方式调整颜色。在iOS上, color
        控制文本的颜色。在Android上, color调整按钮的背景颜色。
      </Text>
      <Button
        title="点击我"
        color="#f194ff"
        onPress={() => Alert.alert("按下已调整颜色的按钮")}
      />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>组件的所有交互都被禁用。</Text>
      <Button
        title="点击我"
        disabled
        onPress={() => Alert.alert("无法点击我")}
      />
    </View>
    <Separator />
    <View>
      <Text style={styles.title}>此布局策略允许 title 定义按钮的宽度。 </Text>
      <View style={styles.fixToText}>
        <Button
          title="左边Button"
          onPress={() => Alert.alert("左边Button被点击了")}
        />
        <Button
          title="右边Button"
          onPress={() => Alert.alert("右边Button被点击了")}
        />
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
```

### Switch 组件

*Switch* 是 RN 提供的一个状态切换的组件，俗称开关组件，主要用来对开和关两个状态进行切换。

*Swich*  组件的用法比较简单，只需要给组件绑定 *value* 属性即可，这样它就是一个受控组件。如果需要改变组件的状态，则必须使 *onValueChange*  方法来更新 *value* 的值。

API 文档地址：[Switch](https://www.reactnative.cn/docs/switch)

```jsx
import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
```

