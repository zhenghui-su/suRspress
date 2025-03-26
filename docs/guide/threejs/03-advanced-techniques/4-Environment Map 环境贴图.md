### Environment Map 环境贴图

通过环境贴图可以让物体效果更加逼真，我们来尝试它。

#### 初始代码

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
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
	new THREE.MeshStandardMaterial()
);
torusKnot.position.y = 4;
scene.add(torusKnot);

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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
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
	// Time
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

模型来自 GLTF 的 Sample 示例库，可以自己选择下载。

#### 导入模型

我们还是老样子，导入模型：

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
//...
/**
 * Models
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	scene.add(gltf.scene);
});
```

由于它比较小，并且是网格标准材质因此无光源的话只是黑色，我们先放大：

```js
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(10, 10, 10);
	scene.add(gltf.scene);
});
```

#### 导入环境贴图

接下来导入环境贴图，根据之前的网站生成 px、py、pz、nx、ny、nz，然后加载：

```js
const cubeTextureLoader = new THREE.CubeTextureLoader();
//...
/**
 * Environments map
 */
const environmentMap = cubeTextureLoader.load([
	'/environmentMaps/0/px.png',
	'/environmentMaps/0/nx.png',
	'/environmentMaps/0/py.png',
	'/environmentMaps/0/ny.png',
	'/environmentMaps/0/pz.png',
	'/environmentMaps/0/nz.png',
]);
scene.background = environmentMap;
```

这样背景环境就有了：

![image-20250223163949485](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223163949485.png)

当然两个模型重叠，调一下位置，改一下立方体的材质：

```js
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
	new THREE.MeshStandardMaterial({
		roughness: 0.3,
		metalness: 1,
		color: '0xaaaaaa',
	})
);
torusKnot.position.x = -4;
```

然后给模型加上环境贴图，可以单独设置，不过我们可以如下快速先看到模型：

```js
scene.environment = environmentMap;
```

看起来不错，模型也能看到了：

![image-20250223164726958](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223164726958.png)

#### 调整强度

目前感觉这个效果有点暗，我们可以来调整一下，通过`traverse`遍历：

```js
const gui = new GUI();
const global = {};
//...
/**
 * Update all Materials
 */
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			child.material.envMap = environmentMap;
			child.material.envMapIntensity = global.envMapIntensity;
		}
	});
};

/**
 * Environments map
 */
// Global intensity
global.envMapIntensity = 1;
gui
	.add(global, 'envMapIntensity')
	.min(0)
	.max(10)
	.step(0.001)
	.onChange(updateAllMaterials);
//...
/**
 * Models
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	gltf.scene.scale.set(10, 10, 10);
	scene.add(gltf.scene);
	updateAllMaterials();
});
```

这样就可以通过 Debug UI 来调整强度了。

#### 背景相关

我们可以设置背景模糊度和背景强度，让物体更突出和背景更亮：

```js
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

gui
	.add(scene, 'backgroundBlurriness')
	.min(0)
	.max(1)
	.step(0.001)
	.name('backgroundBlurriness');
gui
	.add(scene, 'backgroundIntensity')
	.min(0)
	.max(10)
	.step(0.001)
	.name('backgroundIntensity');
```

#### HDRI

hdr 文件表示高动态图像，它包含了丰富的信息且拥有高精度，它呈现的是整个场景的 360 度视图，如下：

![image-20250223194540544](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223194540544.png)

我们来试着加载使用它，先注释之前的环境贴图加载：

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
//...
const rgbeLoader = new RGBELoader();
//...
// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) => {
	// 等距圆柱反射贴图
	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = environmentMap;
	scene.environment = environmentMap;
});
```

加载成功，和原来的没什么区别：

![image-20250223195140301](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223195140301.png)

#### Blender 制作环境贴图

##### 初始化

打开 blender，然后调整渲染引擎为 Cycles，这样效果会更好：

![image-20250223212625868](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223212625868.png)

然后是采样改为 256：

![image-20250223212808835](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223212808835.png)

然后是背景，调整为全黑：

![image-20250223212914670](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223212914670.png)

随后是分辨率，调整为 2K，即 2 的幂次方都行：

![image-20250223213011695](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223213011695.png)

##### 创建物体

接下来是创建物体，选择立方体，随意添加对照一下：

![image-20250223213316119](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223213316119.png)

它们只是拿来看环境贴图是否生效的，随意即可。

##### 创建相机

接下来是创建相机，我们 Shift+a 创建，然后可以按 n 打开信息，更改如下：

![image-20250223213535977](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223213535977.png)

然后是相机属性，选择全景，类型是 ERP 和我们上面一样：

![image-20250223213731272](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223213731272.png)

##### 创建光源

然后我们添加一个光源，选择面光，位置、缩放、旋转随便调整，或者参考我的：

![image-20250223214014371](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223214014371.png)

然后修改灯光属性，灯光 1000w：

![image-20250223214144972](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223214144972.png)

接下来你就可以按 z 然后选择渲染来预览：

![image-20250223214954502](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223214954502.png)

可以点击灯光，然后物体-可见性-射线可见性-摄像机勾选：

![image-20250223215055836](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223215055836.png)

这样渲染的时候就可以看到光线了：

![image-20250223215129615](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223215129615.png)

接下来我们就可以进行第一个渲染了，按下 f12，等待时间可能比较久：

![image-20250223215356369](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223215356369.png)

它看起来就和我们之前的一样，我们保存一下，按下 Alt+S，设置如下：

![image-20250223215624767](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223215624767.png)

保存即可，然后我们使用它：

```js
rgbeLoader.load('/environmentMaps/blender-2k.hdr', (environmentMap) => {
	// 等距原型反射贴图
	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = environmentMap;
	scene.environment = environmentMap;
});
```

可以看到成功运作：

![image-20250223215811442](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223215811442.png)

当然这个场景不是很好看，你可以花费更多的时间做一个完美的场景。

#### Blender 继续制作环境贴图

让我们回到 Blender，删除所有物体，保留摄像机和光源，然后 Shift+D 复制光源，一个灯光红色，一个灯光蓝色，最初的保持白色：

![image-20250223221229070](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223221229070.png)

然后我们可以 f12 继续渲染保存，然后使用：

![image-20250223221551517](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223221551517.png)

#### NVIDIA Canvas 生成环境贴图

AI 可以帮我们生成环境贴图，可以通过 NVIDIA Canvas 来，目前官网不知道为什么找不到了似乎是整合了，不过还有第三方的，网址：[Download](https://nvidia-canvas.en.softonic.com/download)

不过它只能支持部分 GPU，因此这里就不展示了，fuck NVIDIA，这里直接用。

它生成的是 exr 文件，我们需要使用另外的加载器：

```js
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
const exrLoader = new EXRLoader();
//...
// EXR
exrLoader.load('/environmentMaps/nvidiaCanvas-4k.exr', (environmentMap) => {
	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.background = environmentMap;
	scene.environment = environmentMap;
});
```

看起来不错：

![image-20250223224329413](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223224329413.png)

#### Blockade Labs 生成环境贴图

还有一个是 Blockade Labs 来生成，网址：[Blockade Labs](https://skybox.blockadelabs.com/)

这是其中自带的：

![image-20250223224653173](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223224653173.png)

你可以通过下面的文字描述来随便生成，我们就随便用：

```js
const textureLoader = new THREE.TextureLoader();
//...
const environmentMap = textureLoader.load(
	'/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg'
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
scene.background = environmentMap;
scene.environment = environmentMap;
```

当然你会发现这个颜色不太对，这是因为它是 sRGB 的，而 Three 默认使用线性，因此它们的色域不太一样，只需改一下：

```js
environmentMap.colorSpace = THREE.SRGBColorSpace;
```

看起来不错：

![image-20250223225547408](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250223225547408.png)

觉得暗可以 Debug UI 那里调整强度。

#### 解决“飞行”问题

在我们看的时候，模型是在半空的，因此有种飞行的感觉，解决一下，注释之前：

```js
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
//...
// Ground projected skybox
rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
	environmentMap.mapping = THREE.EquirectangularReflectionMapping;
	scene.environment = environmentMap;

	// Skybox
	const skybox = new GroundedSkybox(environmentMap, 1, 1);
	skybox.scale.setScalar(50);
	scene.add(skybox);
});
```

这样模型就是贴在地面上的了（新版本的地面投射器可能有点问题不能紧贴）

#### 创建动态环境

我们要如何创建动态环境呢，首先是注释前面的内容，然后引一个新的：

```js
/**
 * Real time environment map
 */
const environmentMap = textureLoader.load(
	'/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg'
);
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;
```

现在应该是看不到，全是黑色，我们创建一个甜甜圈光源来照亮：

```js
// Holy dount
const holyDount = new THREE.Mesh(
	new THREE.TorusGeometry(8, 0.5),
	new THREE.MeshBasicMaterial({
		color: 'white',
	})
);
holyDount.position.y = 3.5;
scene.add(holyDount);
```

然后要让这个光源旋转：

```js
const tick = () => {
	// Time
	const elapsedTime = clock.getElapsedTime();

	// Real time environment map
	if (holyDount) {
		holyDount.rotation.x = Math.sin(elapsedTime) * 2;
	}
	//...
};
```

然后创建立方体渲染目标：

```js
// Cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
	type: THREE.HalfFloatType, // 半浮点类型让细节更多
});

scene.environment = cubeRenderTarget.texture;
```

当然现在还是黑的，因为没有纹理，接下来是创建一个立方体相机：

```js
// Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
//...
const tick = () => {
	// Time
	const elapsedTime = clock.getElapsedTime();

	// Real time environment map
	if (holyDount) {
		holyDount.rotation.x = Math.sin(elapsedTime) * 2;

		cubeCamera.update(renderer, scene);
	}
	//...
};
```

这样你就能实时看到渲染了，也能看到光线反射：

![image-20250224231155901](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250224231155901.png)

我们可以改一下光线：

```js
const holyDount = new THREE.Mesh(
	new THREE.TorusGeometry(8, 0.5),
	new THREE.MeshBasicMaterial({
		color: new THREE.Color(10, 4, 2),
	})
);
```

我们可以将物体`torusKnot`的粗糙度降为 0，然后观察：

![image-20250224231511899](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250224231511899.png)

会看到反射了物体，但物体又反射了光线，这样重复，我们通过图层 Layers 解决：

```js
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);
```

这样就会移除其他层，设置成 1，然后我们让光源在摄像机中可见：

```js
holyDount.layers.enable(1);
```

这样里面就不会有其他的模型了：

![image-20250224231948659](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250224231948659.png)

看起来很棒，这章节就完成了，可以多多练习。
