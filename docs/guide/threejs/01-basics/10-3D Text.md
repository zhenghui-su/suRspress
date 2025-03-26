### 3D Text

本节我们将实现类似 3D 字体的效果。

#### 字体样式

Three 提供了字体立方体，但我们需要提供字体样式，如何获取它呢？

- 可以自己转换，使用[facetype.js](https://gero3.github.io/facetype.js/)上传字体转换
- 另一种方法是使用 Three 自带的，在`three/examples/fonts/`中

我们使用自带的`helvetiker_regular.typeface.json`，复制到`static`中的`fonts`文件夹，接下来我们加载

#### FontLoader

Three 提供了类似纹理一样的加载器，字体加载器`FontLoader`，使用即可：

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// ...
const fontLoader = new FontLoader();
fontLoader.load(
	'/fonts/helvetiker_regular.typeface.json',
	() => {
		console.log('loaded');
	},
	() => {
		console.log('progress');
	},
	() => {
		console.log('error');
	}
);
```

#### TextGeometry

我们只需要第一个 loaded，然后通过`TextGeometry`创建立方体：

```js
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// ...
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Hello Three.js', {
		font: font, // 字体
		size: 0.5, // 字体大小
		depth: 0.2, // 厚度或者深度
		curveSegments: 12, // 圆弧分段数
		bevelEnabled: true, // 是否有边缘即斜面
		bevelThickness: 0.03, // 边缘厚度
		bevelSize: 0.02, // 边缘大小
		bevelOffset: 0, // 边缘偏移
		bevelSegments: 5, // 边缘分段数
	});
	const textMaterial = new THREE.MeshBasicMaterial();
	const textMesh = new THREE.Mesh(textGeometry, textMaterial);
	scene.add(textMesh);
});
```

保存后就可以看到字体了：

![image-20250201134104501](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134104501.png)

#### 去除立方体和调整相关

我们把下面的立方体去掉，你还可以开启线框模式查看：

```js
textMaterial.wireframe = true;
```

可以看到三角形有点多：

![image-20250201134423761](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134423761.png)

我们需要优化一下性能，让圆弧的三角形减少点，这两个参数调整：

```js
curveSegments: 5, // 圆弧分段数
bevelSegments: 4, // 边缘分段数
```

然后文字打开不在中间，我们需要让他居中，可以开启轴辅助工具确认：

```js
// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
```

可以看到 z 应该朝向我们，x 朝向右边了：

![image-20250201134847499](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201134847499.png)

#### 边界

我们需要让文字居中，可以使用边界方法，边界就是立方体所占据的空间，Three 提供了方法可以计算立方体的边界，需要注意先计算再访问，不计算是 null

```js
textGeometry.computeBoundingBox();
console.log(textGeometry.boundingBox);
```

它其实就是坐标，通过它我们就可以知道文本的大小，然后移动一半即可：

```js
textGeometry.translate(
	-textGeometry.boundingBox.max.x * 0.5,
	-textGeometry.boundingBox.max.y * 0.5,
	-textGeometry.boundingBox.max.z * 0.5
);
```

虽然看起来居中，不过因为我们上面参数加上了厚度，还需减掉这块：

```js
textGeometry.translate(
	-(textGeometry.boundingBox.max.x - 0.02) * 0.5,
	-(textGeometry.boundingBox.max.y - 0.02) * 0.5,
	-(textGeometry.boundingBox.max.z - 0.03) * 0.5
);
textGeometry.computeBoundingBox();
console.log(textGeometry.boundingBox);
```

我们重新计算，然后查看结果，值基本相反就证明基本居中了：

![image-20250201140301237](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201140301237.png)

#### center

当然边界盒子的方法好复杂，我们只是练习一下，还有更简单的方法：

```js
textGeometry.center();
```

Three 提供了这个方法，让我们更加方便操作了。

#### MeshMatcapMaterial

为了让文字更好看，我们可以使用`MeshMatcapMaterial`材质渲染：

```js
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
// ...
const textMaterial = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
```

记得删除线框模式，保存查看，不错，随后可以把轴辅助线删除了

![image-20250201140923825](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201140923825.png)

#### 添加甜甜圈即环形立方体

我们在它周围添加多个甜甜圈，然后随机移动它：

```js
for (let i = 0; i < 100; i++) {
	const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
	const dountMaterial = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	const dountMesh = new THREE.Mesh(dountGeometry, dountMaterial);
	dountMesh.position.x = (Math.random() - 0.5) * 10;
	dountMesh.position.y = (Math.random() - 0.5) * 10;
	dountMesh.position.z = (Math.random() - 0.5) * 10;
	scene.add(dountMesh);
}
```

然后我们调整一下旋转角度，要不然朝向一致了：

```js
dountMesh.rotation.x = Math.random() * Math.PI;
dountMesh.rotation.y = Math.random() * Math.PI;
```

然后调整一下缩放，让它们大小随机：

```js
const scale = Math.random();
dountMesh.scale.set(scale, scale, scale);
```

值得注意的是，不要如下的操作：

```js
dountMesh.scale.x = Math.random();
dountMesh.scale.y = Math.random();
dountMesh.scale.z = Math.random();
```

因为这样就不是等比缩放，会让甜甜圈长的很奇怪，我们需要让 x、y、z 缩放固定

![image-20250201141918835](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201141918835.png)

#### 优化性能

上面看起来不错，不过耗时还是挺多的，你可以使用`console.time`和`console.timeEnd`计算甜甜圈的生成时间，还是很久的。

我们需要改进一下，将几何体和材质放到外部，因为它们是一样的：

```js
const dountGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const dountMaterial = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});

for (let i = 0; i < 100; i++) {
	// ...
}
```

这样就不会重复创建同一个材质和立方体了，同时我们发现甜甜圈和文字用的是一个材质，我们也可以优化：

```js
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
// ...
const textMesh = new THREE.Mesh(textGeometry, material);
// ...
for (let i = 0; i < 100; i++) {
	const dountMesh = new THREE.Mesh(dountGeometry, material);
}
```

查看，确实不错！

![image-20250201142553719](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201142553719.png)
