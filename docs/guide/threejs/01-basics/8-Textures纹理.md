### Textures 纹理

本节聊聊 Textures 纹理，它覆盖在几何体的表面。纹理分很多，常见如下：

- Albedo：反照率纹理，就是直接应用到几何体上的颜色
- Alpha：透明纹理，灰度图像，白色可见，黑色不可见
- Displacement：位移纹理，灰度图像，用于移动顶点，白色顶点上升，黑色顶点下降，灰色顶点不动（通过它可以创建地形这种）
- Normal：法线纹理，可以增加细节，用于光影光照效果，顶点固定
- AmbientOcclusion：环境光遮蔽纹理，他会在缝隙中加入假阴影，增加细节
- Metalenss：金属纹理，灰度图像，创造反射的效果
- Roughness：粗糙纹理，灰度图像，类似粗糙质感，涉及光的散射（比如地毯几乎不反光很粗糙）

这些纹理遵循 PBR，即基于物理的渲染，它们基于现实的算法模型，从而获取逼真的效果，大部分建模软件如 Blender 也遵循 PBR，Three 也是，这意味着你们使用相同的纹理效果渲染结果都会是一样的。

#### 加载纹理

纹理其实就是图片，我们如何在项目加载图片呢？一般使用 Vite 可以直接引入图片，它会自己加载图片的 url：

```js
import image from './1.png';
```

当然更简单的是放入 public，它会自动拥有一个 url，在你启动的本地服务器加入对应的路径即可加载，注意不需要加上 public，如下：

![image-20250131144834324](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131144834324.png)

这样我们就可以在代码中直接加载图片，先使用原生 JavaScript：

```js
const image = new Image();
image.onload = () => {
	console.log('image loaded');
};
image.src = '/textures/door/color.jpg';
```

这样就是成功加载了图片，然后就可以加载纹理了：

```js
image.onload = () => {
	const texture = new THREE.Texture(image);
	console.log(texture);
};
```

打印就可以看到纹理：

![image-20250131145505202](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131145505202.png)

不过我们无法在作用域外访问它，可以修改一下，将其放到外部：

```js
const texture = new THREE.Texture(image);
image.onload = () => {
	texture.needsUpdate = true;
};
```

这样就是告诉 Three 需要更新纹理，然后将其应用到材质中：

```js
const material = new THREE.MeshBasicMaterial({ map: texture });
```

保存，就可以看到纹理应用到上面了：

![image-20250131145955322](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131145955322.png)

#### 纹理加载器

上面的原生方法不错，接下来我们使用 Three 自带的纹理加载器，更简单：

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/door/color.jpg');
```

它还可以加载多个纹理，并且拥有几个函数：

```js
const texture = textureLoader.load(
	'/textures/door/color.jpg',
	() => {
		console.log('loaded');
	},
	() => {
		console.log('progess');
	},
	() => {
		console.log('error');
	}
);
```

不过不建议使用 progress，它基本不起作用，我也不懂咋用，后续会介绍大文件的进度条替代方案。

#### LoadingManger

LoadingManger 是为了实现资源共享，目前我们只有纹理加载器，后续可能有模型，字体等加载器，我们希望明确这些加载的相关事件，通过它可以统一管理这些加载器：

```js
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
```

只需要创建后，在每个加载器中加入参数即可，它还有几个函数：

```js
loadingManager.onStart = () => {
	console.log('onStart');
};
loadingManager.onLoad = () => {
	console.log('onLoad');
};
loadingManager.onProgress = () => {
	console.log('onProgress');
};
loadingManager.onError = () => {
	console.log('onError');
};
```

#### 加载多个纹理

我们加载一下刚刚说到的几个纹理，命名一下：

```js
const colorTexture = textureLoader.load('/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
	'/textures/door/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
```

加载后，会看到控制台有 7 个 onProgress：

![image-20250131151527809](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131151527809.png)

#### UV 展开

当你使用不同的几何体去加载这个纹理，你可能会发现拉伸，重复等，这是因为 Three 通过 UV 展开来加载纹理。

UV 展开就像打开立方体的表面，你得到一个方形，如下：

![image-20250131152047142](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131152047142.png)

展开后你就会得到一个 UV 坐标系，每个坐标代表一个顶点。

我们可以通过方法查看这个 uv 坐标：

```js
console.log(geometry.attributes.uv);
```

和我们之前的展示的 Buffer 几何体存储的其实一样的：

![image-20250131152258281](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131152258281.png)

纹理就会通过 UV 坐标将图片应用到几何体上。

#### 纹理变换

##### 重复

我们可以重复纹理：

```js
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 3;
```

还可以这样重复整个贴图：

```js
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
```

也可以选择镜像重复贴图

```js
colorTexture.wrapS = THREE.MirroredRepeatWrapping;
colorTexture.wrapT = THREE.MirroredRepeatWrapping;
```

##### 偏移

我们还可以使用偏移：

```js
colorTexture.offset.x = 0.5;
colorTexture.offset.y = 0.5;
```

##### 旋转

也支持旋转，π 等于半圈

```js
colorTexture.rotation = Math.PI * 0.25;
```

它可以支持哪个顶点旋转：

```js
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
```

#### 滤镜和 MIP 映射

MIP 映射就是创建映射面，每次是之前的一半，直到 1\*1，GPU 会根据可见像素运用不同的版本，所以有可能你放大观察会有模糊的效果。

当纹理像素比渲染像素小，比如你缩小立方体，它会调用**缩小滤镜**，默认采用**线性滤镜**，我们可以改变这个滤镜，换为**最近邻滤镜**如下：

```js
colorTexture.minFilter = THREE.NearestFilter;
```

我们可以换一个纹理：

```js
const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
```

当你放大，会看到各个小方块：

![image-20250131155509577](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155509577.png)

当你缩小，就会产生奇怪的现象，它叫摩尔纹：

![image-20250131155532790](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155532790.png)

当纹理图片不够大，你放大的时候，渲染时像素被拉伸，是因为调用了**放大滤镜**，我们可以换一个纹理：

```js
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
```

你会明显的看到模糊效果：

![image-20250131155858043](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131155858043.png)

要解决就和上面一样，调用`magFilter`：

```js
colorTexture.magFilter = THREE.NearestFilter;
```

对比一下，这样就没有模糊了，非常的锐利：

![image-20250131160116605](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160116605.png)

这种需要根据你项目的需要调整，我们可以加载一个 mc 的钻石块纹理：

```js
const colorTexture = textureLoader.load('/textures/minecraft.png');
```

可以看到很清晰：

![image-20250131160351526](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160351526.png)

如果我们换成线性，即注释掉刚刚的那行滤镜改变，就会非常模糊：

![image-20250131160441483](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131160441483.png)

当我们设置了`minFilter`和`magFilter`时，我们就应该让 Three 不再生成 MIP 映射了，这样可以提高性能：

```js
colorTexture.generateMipmaps = false;
```

#### 格式和优化

创建纹理或者从网上获取纹理时，我们需要注意三个点：

- 纹理文件大小
- 纹理的大小即分辨率
- 嵌入纹理的数据

用户加载网站需要下载纹理文件，因此尽量让文件体积小，你可以通过 TinyPNG 网站压缩图片，不过压缩后图片可能会变化可以调试看看。

当纹理越小即分辨率越小，文件越轻，GPU 压力越小，尽量提供小的纹理

注意使用 MIP 映射时，图像相当于两倍的像素量，当我们使用它，我们需要能被 2 整除的纹理分辨率，如 512×512，因为 MIP 映射会一直除 2，如果不能被 2 整除，Three 会调整你的图像分辨率，这样效率更差且图片效果不好

当使用透明图像时，找到平衡点，是使用 png 或者两倍的 jpg，当使用法线纹理时，我们需要精确的数据，所以通常为 png 格式因为它是无损压缩，我们还可以将多个数据放到一个纹理中。

最后，如何寻找纹理，一般通过网络查找，可以通过下面网站：

- [poliigon.com](https://www.poliigon.com)
- [3dtextures.me](https://www.3dtextures.me)
- [arroway-textures.ch](https://www.arroway-textures.ch)

当然还可以通过自己创建纹理，如通过`Substance Designer`，它通过节点创建纹理。
