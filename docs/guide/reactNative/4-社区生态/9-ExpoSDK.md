## ExpoSDK

除了上一小节介绍的第三方库以外，*expo* 本身也为我们提供了丰富的 *Expo SDK* 供我们便用，例如前面在快速入门章节我们所接触到的 *expo image picker*，就是其中的一员。

你可以在 [https://docs.expo.dev/versions/latest/](https://docs.expo.dev/versions/latest/) 中 查看到 *expo* 中提供的所有 *SDK*

例如我们要播放视频，就可以使用 *Expo SDK* 中所提供的 *Video* 用于播放视频，使用之前需要安装 *expo-av* 依赖。

```bash
npx expo install expo-av
```

文档地址：[Video](https://docs.expo.dev/versions/latest/sdk/video/)，示例如下：

```jsx
import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function App() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

其他的可以多看文档，基本上都提供了