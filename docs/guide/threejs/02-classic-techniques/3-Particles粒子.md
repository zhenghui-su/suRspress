### Particles 粒子

#### 初始代码

本节我们聊聊粒子相关的内容，下面是项目初始代码：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

#### 创建粒子

让我们来创建第一个粒子，首先需要几何体和材质：

```js
const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleMaterial = new THREE.PointsMaterial({
	size: 0.02,
	sizeAttenuation: true,
});
```

参数`size`就是粒子大小，`sizeAttenuation`就是大小衰减，即粒子离摄像机越远它就越小，靠近会变大。

然后是创建粒子，或者叫点：

```js
// Point
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
```

保存查看，Great：

![image-20250203165447194](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203165447194.png)

#### 创建自定义立方体

我们运用学习过的东西创建自己的立方体，练习一下：

```js
const particleGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 5;
}
particleGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
);
```

保存查看，看起来很酷，像星空：

![image-20250203170016541](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203170016541.png)

你可以调整数量，以及材质大小等，根据喜欢。

#### 改变属性

##### 颜色

我们可以改变粒子颜色，通过材质：

```js
particleMaterial.color = new THREE.Color('#ff88cc');
```

看起来不错：

![image-20250203171451468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203171451468.png)

##### 纹理

当然你也可以使用纹理：

```js
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/11.png');
//...
particleMaterial.map = particleTexture;
```

加载成功：

![image-20250203171841235](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203171841235.png)

粒子的资源地址：[particle-pack](https://www.kenney.nl/assets/particle-pack)，它是 CC0 许可，随便用。

你也可以自己画图创建，如果你愿意的话。

#### 修复问题

如果仔细观察会发现它有部分区域遮挡了后面的粒子，需要修复一下，使用`alphaMap`，记得前置条件：

```js
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;
```

现在可以看见，不过你还是能看见粒子的边缘有黑黑的，这是因为粒子按照顺序绘制，GPU 需要确定哪个是前面，这算一个 bug，不过不好解决，有几个方法：

##### alphaTest 减少

首先使用`alphaTest`让 GPU 尽量让纹理的黑色部分不渲染：

```js
particleMaterial.alphaTest = 0.001;
```

不过如果仔细观察，你还是能看到这个，在移动时不明显。

#### depthTest 停止

第二个方法是停用深度检测，让 GPU 只绘制不判断在前在后：

```js
particleMaterial.depthTest = false;
```

看起来没啥问题，不过关闭深度检测可能会出现奇怪的 bug，比如我随便添加一个立方体：

```js
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial()
);
scene.add(cube);
```

你会发现你能看到立方体后面的粒子，这是不应该的：

![image-20250203173256435](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203173256435.png)

因此场景中有其他物体或粒子颜色不同，不应该关闭深度检测。

##### depthWrite 深度写入

第三个方法是关闭深度写入`depthWrite`，即不让 WebGL 去写入深度缓冲区，这确实是个有效方法：

```js
particleMaterial.depthWrite = false;
```

看起来问题解决，立方体也不会透视了：

![image-20250203173809556](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203173809556.png)

##### blending 混合

第四种方法不同于前面，要关闭深度写入，然后使用加法混合：

```js
particleMaterial.depthWrite = false;
particleMaterial.blending = THREE.AdditiveBlending;
```

它会将颜色叠加到已有的颜色，不过注意它会影响性能。

#### 粒子不同颜色

让我们给每个粒子一个随机的颜色：

```js
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
	positions[i] = (Math.random() - 0.5) * 5;
	colors[i] = Math.random();
}
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
```

当然我们要告诉材质使用顶点颜色，注释基础颜色：

```js
// particleMaterial.color = new THREE.Color('#ff88cc');
particleMaterial.vertexColors = true;
```

看起来很棒！

![image-20250203184304775](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203184304775.png)

#### 添加动画

##### 整体动画

我们可以给粒子添加上动画，就像其他一样：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update particles
	particles.rotation.y = elapsedTime * 0.2;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

##### 单独动画

整体的动画固然不错，但我想分别控制每个粒子，当然我们可以通过访问立方体属性来访问到数组，数组存放了每个粒子的位置

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update particles
	// particles.rotation.y = elapsedTime * 0.2;

	for (let i = 0; i < count; i++) {
		// x_index
		const i3 = i * 3;
		const x = particleGeometry.attributes.position.array[i3];
		// change position_y
		particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
			elapsedTime + x
		);
	}
	// need to update
	particleGeometry.attributes.position.needsUpdate = true;
	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

通过它你能够得到一个波浪的效果，当然它更新了大量粒子，因此它的压力可能较大，如果觉得卡可以降低粒子数量。

![image-20250203185635200](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250203185635200.png)

如果还是想优化，那么就是使用自定义的着色器，而不是使用`PointsMaterial`材质，后面会详细学习。
