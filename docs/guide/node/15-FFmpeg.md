## 15-FFmpeg

FFmpeg 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。

### FFmpeg 的主要功能和特性：

1. 格式转换：FFmpeg 可以将一个媒体文件从一种格式转换为另一种格式，支持几乎所有常见的音频和视频格式，包括 MP4、AVI、MKV、MOV、FLV、MP3、AAC 等。
2. 视频处理：FFmpeg 可以进行视频编码、解码、裁剪、旋转、缩放、调整帧率、添加水印等操作。你可以使用它来调整视频的分辨率、剪辑和拼接视频片段，以及对视频进行各种效果处理。
3. 音频处理：FFmpeg 可以进行音频编码、解码、剪辑、混音、音量调节等操作。你可以用它来提取音频轨道、剪辑和拼接音频片段，以及对音频进行降噪、均衡器等处理。
4. 流媒体传输：FFmpeg 支持将音视频流实时传输到网络上，可以用于实时流媒体服务、直播和视频会议等应用场景。
5. 视频处理效率高：FFmpeg 是一个高效的工具，针对处理大型视频文件和高分辨率视频进行了优化，可以在保持良好质量的同时提供较快的处理速度。
6. 跨平台支持：FFmpeg 可以在多个操作系统上运行，包括 Windows、MacOS、Linux 等，同时支持多种硬件加速技术，如 NVIDIA CUDA 和 Intel Quick Sync Video。

### 安装 FFmpeg

[官方网址](https://ffmpeg.p2hp.com/download.html)，选择对应的操作系统下载即可，Windows 点击第一个，找到`release builds`下载 zip 包

![image-20231027201345633](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027201345633.png)

下载完成配置一下环境变量就 ok 了，输入 `ffmpeg -version` 不报错即可

![image-20231027203240100](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027203240100.png)

### 子进程配合 ffmpeg

常用的五个功能如下，更多的可以查看官网

#### **转换格式**

简单的 demo 视频转 gif ，`-i` 表示输入的意思

```js
const { execSync } = require('child_process');
execSync(`ffmpeg -i test.mp4 test.gif`, { stdio: 'inherit' });
```

![image-20231027203755592](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027203755592.png)

#### 视频裁剪 + 控制大小\*\*

`-ss`起始时间 `-to`结束事件

> ss 写在 -i 的前面可能会导致精度问题，因为视频还没解析就跳转到了相关位置，但是解析速度快

> ss 写在 -i 后面精度没问题，但是解析速度会变慢

```js
const { execSync } = require('child_process');

execSync(`ffmpeg -ss 10 -to 20 -i test.mp4  test3.mp4`, { stdio: 'inherit' });
```

如下，该视频只有十秒被我们截取出来了

1![image-20231027204459239](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027204459239.png)

#### **提取视频的音频**

```js
const { execSync } = require('child_process');
execSync(`ffmpeg -i test.mp4 test.mp3`, { stdio: 'inherit' });
```

如下，音频已经被我们提取出来了

![image-20231027204440891](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027204440891.png)

#### **添加水印**

`-vf `就是`video filter`

`drawtext`添加文字、`fontsize`大小、`xy`垂直水平方向、`fontcolor`颜色、`text`水印文案

> 以上内容`全部小写`

```js
const { execSync } = require('child_process');

execSync(
  `ffmpeg -i test.mp4 -vf drawtext=text="Su":fontsize=30:fontcolor=white:x=10:y=10 test2.mp4`,
  { stdio: 'inherit' }
);
```

可以发现水印已经添加上了

![image-20231027204542720](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027204542720.png)

#### **去掉水印**

`w h`宽高，`xy` 垂直水平坐标，`delogo`使用的过滤参数删除水印

宽高就是通过上面的水印大小，我们上面大小为 30，有两个字符，所以 w 为 60，h 即 30，x 和 y 与上面一致

```js
const { execSync } = require('child_process');

execSync(`ffmpeg -i  test2.mp4 -vf delogo=w=60:h=30:x=10:y=10 test3.mp4`, {
  stdio: 'inherit',
});
```

可以发现水印已经去除了

![image-20231027205058567](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027205058567.png)
