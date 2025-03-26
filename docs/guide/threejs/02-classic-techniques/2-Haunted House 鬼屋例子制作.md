### Haunted House 鬼屋例子制作

本小节我们来制作一个屋子的例子，同时巩固之前的知识。

#### 初始代码

如下：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
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
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 32),
	new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
scene.add(sphere);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

其中`Timer`解释一下，它和`Clock`差不多，不过修复了一些 bug，通过`timer.update`手动更新，在切换 tab 的时候尤为明显，你可以用它代替`Clock`

#### 一些建议

在建造之前，我们需要明确单位，单位 1 在各个场景下可能不一样，比如在房子是 1m，城市是 1km，物体是 1cm，因此需要明确好。

#### 建造地板

我们首先创建地板即`floor`：

```js
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial()
);
scene.add(floor);
```

我们使用了网格标准材质，这是为了后续的逼真效果。接下来是调整，我们会发现地板的方向错了，需要调整一下：

```js
floor.rotation.x = -Math.PI * 0.5;
```

#### 分组

房子的立方体很多，因此我们建立 Group 方便后续如果需要统一调整：

```js
// House container
const house = new THREE.Group();
scene.add(house);
```

后续我们只需添加到`house`即可，而不需要添加到`scene`。

#### 建造 house

##### walls 墙壁

先建造墙壁`walls`：

```js
// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial()
);
house.add(walls);
```

查看一下，起作用了：

![image-20250202165654650](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202165654650.png)

不过有点矮，我们加高一些：

```js
walls.position.y += 1.25;
```

##### 可选提取

我们创建 walls 的时候立方体传入固定值，我们提取出去方便后续维护修改

```js
const houseMeasurements = {
	width: 4,
	height: 2.5,
	depth: 4,
};
//...
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(
		houseMeasurements.width,
		houseMeasurements.height,
		houseMeasurements.depth
	),
	new THREE.MeshStandardMaterial()
);
```

当然如果觉得麻烦也可以选择不提取，自己可以选择喜好的。

##### Roof 屋顶

接下来是添加 Roof 屋顶，我们想要一个金字塔像样子的，不过你会搜索不到，不过我们可以使用圆锥体立方体，通过属性`raidaiSegments`为 4 即可得到，第三个参数就是这个属性：

```js
// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial()
);
house.add(roof);
```

生成了不过位置不太对，调整一下：

```js
roof.position.y = 2.5 + 0.75;
```

2.5 是 walls 的高，那 0.75 呢？其实参考如下图就知道了：

![image-20250202171000602](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171000602.png)

我们需要往上加一些才能正好让底部贴着 walls，不过它还是有点歪歪的

![image-20250202171222000](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171222000.png)

我们需要旋转一下它，至于角度也容易，一般都是通过 π 来计算：

```js
roof.rotation.y = Math.PI * 0.25;
```

很不错，完美贴合：

![image-20250202171357168](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202171357168.png)

##### Door 门

接下来是建造 Door 门，我们通过平面立方体创建：

```js
// Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2),
	new THREE.MeshStandardMaterial()
);
house.add(door);
```

不过我们需要放大才能看见，这个位置不太对，移动一下：

```js
door.position.y = 1;
door.position.z = 2;
```

当然因为它和 walls 材质一样所以合在一起了，为了明显，加个颜色

```js
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2),
	new THREE.MeshStandardMaterial({
		color: 'red',
	})
);
```

你会看到奇怪的现象，我们称为`z-fighting`即 z 轴冲突：

![image-20250202172125631](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202172125631.png)

当它们位于同一个位置，GPU 不知道谁在谁的前面，因此就出现这个现象，解决方法也很简单，只需要让门往前移动一点点：

```js
door.position.z = 2 + 0.01;
```

很好，没有冲突了：

![image-20250202172310678](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202172310678.png)

我们可以把红色去掉了，后续再加上纹理。

##### Bushes 灌木丛

接下来我们要建造各式各样的灌木丛，因此材质和立方体要提取：

```js
// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();
```

然后创建不同的灌木丛 mesh：

```js
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);
```

保存查看，看起来不错：

![image-20250202173012463](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202173012463.png)

#### Grave 坟墓

既然是鬼屋，附近也要有坟墓，我们创建一下：

```js
// Graves
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();
```

不过它不是房子 house 的一部分，因此我们单独创建一个 Group：

```js
const graves = new THREE.Group();
scene.add(graves);
```

坟墓很多，我们使用循环快速创建：

```js
for (let i = 0; i < 30; i++) {
	// Mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial);

	// Add to graves group
	graves.add(grave);
}
```

接下来是坟墓位置，我们想要一个介于 0 到整圆的随机角度，这样就可以随机位置出现坟墓：

```js
const angle = Math.random() * Math.PI * 2;
```

接下来通过`sin`和`cos`正弦余弦函数可以得到-1 到+1，因此发送同一个 angle 会得到同样的结果，通过它来得到 x 和 z：

```js
const x = Math.sin(angle);
const z = Math.cos(angle);
```

然后将其作为位置传给坟墓：

```js
grave.position.x = x;
grave.position.z = z;
```

不过你会发现这个圆太小了，因此我们可以让他半径大点：

```js
const radius = 4;
const x = Math.sin(angle) * radius;
const z = Math.cos(angle) * radius;
```

看起来很不错：

![image-20250202174423651](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202174423651.png)

不过我们还是想让他有些近有些远，通过随机数让他介于 3-7 之间：

```js
const radius = 3 + Math.random() * 4;
```

看起来不过，接下来调整一下 y，让他有些埋地深有些浅：

```js
grave.position.y = Math.random() * 0.4;
```

然后现在它们朝向一致，我们需要随机旋转一下：

```js
grave.rotation.x = (Math.random() - 0.5) * 0.4;
grave.rotation.y = (Math.random() - 0.5) * 0.4;
grave.rotation.z = (Math.random() - 0.5) * 0.4;
```

很不错！看着像乱葬岗了：

![image-20250202174946449](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202174946449.png)

#### 地板 Texturing 纹理化

接下来我们给不同的立方体添加上纹理，让其更加真实，let go！

##### 地板边缘化

首先是地板的边缘处理，我们需要让他模糊看不清：

```js
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
	})
);
```

记得前置条件是允许`transparent`，查看：

![image-20250202183340518](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202183340518.png)

##### 纹理寻找

你可以通过 Poly Haven 寻找自己喜欢的纹理，我选择了[Coast Sand Rocks 02](https://polyhaven.com/zh/a/coast_sand_rocks_02)，这个纯看自己喜欢，选择 1k，压缩包，设置如下：

![image-20250202184753848](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202184753848.png)

随后下载解压，将图片提取一下，放入 floor 文件夹。

##### 加载四个纹理

然后我们加载一下：

```js
const floorColorTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg'
);
const floorARMTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg'
);
const floorNormalTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg'
);
const floorDisplacementTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg'
);
```

##### 使用颜色纹理

随后我们可以使用一下：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
	})
);
```

OK，我们显示出来了：

![image-20250202185847713](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202185847713.png)

##### 优化纹理

首先这些纹理都很大，我们可以通过`repeat`的方式来优化：

```js
floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
```

不过看起来有点小问题，最后一个像素被拉伸到最后，因此出现奇怪的现象。

这是因为 WebGL 的默认工作，我们可以指定一下重复：

```js
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;
```

看起来还可以，Great！

![image-20250202190316418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202190316418.png)

不过看起来颜色有点小怪，可以通过指定方式 SRGB 正确编码：

```js
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
```

现在就是正确的了：

![image-20250202190614699](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202190614699.png)

##### 应用其他纹理

然后我们把其他几个纹理也用上：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
	})
);
```

当然应用后你会发现地形上升了，这是因为`displacementMap`将移动实际顶点，它不像普通地图一样伪造，因此我们需要增加顶点的数量：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100)
	//...
);
```

看起来很棒，我们有地形了：

![image-20250202191118557](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202191118557.png)

不过注意，顶点太多有影响性能，因此根据需要添加。

看起来这些地形凸起有点强，我们可以控制减少点：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		//...
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
	})
);
```

我们还发现整个地形都上升了一部分，我们可以通过`displacementBias`属性来调整，不过为了找到正确，我们加入 debug UI 方便调整：

```js
gui
	.add(floor.material, 'displacementScale')
	.min(0)
	.max(1)
	.step(0.001)
	.name('floorDisplacementScale');
gui
	.add(floor.material, 'displacementBias')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('floorDisplacementBias');
```

当你找到对应的值，你可以添加到属性中：

```js
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		// ...
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	})
);
```

#### 墙壁 Texturing 纹理化

接下来处理墙壁，资源地址：[castle_brick_broken_06](https://polyhaven.com/zh/a/castle_brick_broken_06)，如果下载了上面的，设置只需要去掉 Displacement 即可，我们不需要它，然后操作一样解压放入 wall 文件夹中

##### 加载纹理

和之前一样，加载一下：

```js
// Wall
const wallColorTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg'
);
const wallARMTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg'
);
const wallNormalTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg'
);
```

然后一样，调整颜色纹理编码：

```js
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后在墙壁使用：

```js
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
	})
);
```

看起来很棒：

![image-20250202193312113](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202193312113.png)

#### 屋顶 Texturing 纹理化

资源地址：[roof_slates_02](https://polyhaven.com/zh/a/roof_slates_02)，和墙壁一样不用改了，下载解压放到 roof 文件夹

##### 加载纹理

然后一样加载：

```js
// Roof
const roofColorTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg'
);
const roofARMTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg'
);
const roofNormalTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg'
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;
```

使用：

```js
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	})
);
```

然后优化，重复：

```js
roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
```

然后这屋顶还有问题，它纹理是歪着的，还有它的光源反射不太对，这是由于纹理展开等原因导致的，较难解决，不过我们可以给出两个：

- 第一个是通过 Blender 等建模软件来解决，我们以后会学习
- 第二个是通过自己创建几何体，需要自己设置位置，UV 等信息，工作量很大

虽然这个屋顶有缺陷，不过我们还是用着，另外两个工作量大先不急。

#### 灌木丛 Texturing 纹理化

资源地址：[leaves_forest_ground](https://polyhaven.com/zh/a/leaves_forest_ground)，设置一样，解压放入 bush 中

##### 加载纹理

```js
const bushColorTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg'
);
const bushARMTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg'
);
const bushNormalTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg'
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后复制：

```js
bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;
```

使用：

```js
const bushMaterial = new THREE.MeshStandardMaterial({
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});
```

看起来还行，不过它也有小问题，球体展开后导致这个：

![image-20250202195730069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202195730069.png)

解决方式第一个也是建模软件，不过我们还有更简单的：

```js
bush1.rotation.x = -0.75;
bush2.rotation.x = -0.75;
bush3.rotation.x = -0.75;
bush4.rotation.x = -0.75;
```

将他隐藏起来，我们最开始看不到就行：

![image-20250202200017844](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202200017844.png)

不过他们的颜色不够绿，我们可以修改一下材质：

```js
const bushMaterial = new THREE.MeshStandardMaterial({
	color: '#ccffcc',
	//...
});
```

看起来很不错：

![image-20250202200204515](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202200204515.png)

#### 坟墓 Texturing 纹理化

资源地址：[plastered_stone_wall](https://polyhaven.com/zh/a/plastered_stone_wall)，其他一样。

##### 加载

```js
// Grave
const graveColorTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg'
);
const graveARMTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg'
);
const graveNormalTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg'
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
```

然后使用：

```js
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});
```

不过纹理有点被拉扯，这也是没法，我们就先不处理。

#### 门 Texturing 纹理化

##### 加载

用的之前的，直接搞：

```js
// Door
const doorColorTexture = textureLoader.load('./door/color.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'./door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
```

然后使用，记得使用了位移图纹理要增加顶点，然后调整属性：

```js
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		roughnessMap: doorRoughnessTexture,
		metalnessMap: doorMetalnessTexture,
		normalMap: doorNormalTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
	})
);
```

看起来不错：

![image-20250202211431374](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202211431374.png)

#### Lights 添加光

接下来为了渲染氛围，自然就需要光源了。

##### 调整颜色和强度

首先调整光源的颜色和强度：

```js
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
//...
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
```

有那个感觉了：

![image-20250202211831259](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202211831259.png)

##### 添加门灯

我们要在门上添加一个灯，以便照明：

```js
// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);
```

看起来不错：

![image-20250202212612589](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202212612589.png)

#### Ghost 添加鬼魂

目前我们还没学到建模，因此这里的鬼魂使用旋转的灯来代替。

##### 添加 ghost

我们使用点光源：

```js
/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);
```

然后我们需要制作动画，让他们围绕房子旋转：

```js
const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Ghost
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

很棒，旋转起来了：

![image-20250202213303581](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202213303581.png)

然后我们需要让 ghost 向上向下，使用 sin 和 cos 有点太规律了，我们可以使用在线工具[desmos](https://www.desmos.com/calculator?lang=zh-CN)自己添加公式测试：

![image-20250202213835058](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202213835058.png)

你可以随意取值等，我们就用这个吧：

```js
ghost1.position.y =
	Math.sin(ghost1Angle) *
	Math.sin(ghost1Angle * 2.34) *
	Math.sin(ghost1Angle * 3.45);
```

这样它就有时向上有时向下。

另外两个就可以复制了，改一下半径啥的即可：

```js
const ghost2Angle = -elapsedTime * 0.38;
ghost2.position.x = Math.cos(ghost2Angle) * 5;
ghost2.position.z = Math.sin(ghost2Angle) * 5;
ghost2.position.y =
	Math.sin(ghost2Angle) *
	Math.sin(ghost2Angle * 2.34) *
	Math.sin(ghost2Angle * 3.45);

const ghost3Angle = elapsedTime * 0.23;
ghost3.position.x = Math.cos(ghost3Angle) * 6;
ghost3.position.z = Math.sin(ghost3Angle) * 6;
ghost3.position.y =
	Math.sin(ghost3Angle) *
	Math.sin(ghost3Angle * 2.34) *
	Math.sin(ghost3Angle * 3.45);
```

#### Shadows 添加阴影

##### 添加阴影

既然有了光，那么也要有阴影，我们来添加一下。

```js
/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;
```

然后坟墓的要单独通过组循环处理：

```js
for (const grave of graves.children) {
	grave.castShadow = true;
	grave.receiveShadow = true;
}
```

##### 优化性能

太多的阴影会影响性能，我们可以通过调整分辨率、相机区域、近平面和远平面来优化一下：

```js
// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
```

然后是幽灵 Ghost 的阴影优化：

```js
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;
```

#### Sky 添加天空

真实的场景应该还有个天空，让我们添加一下：

```js
import { Sky } from 'three/addons/objects/Sky.js';
//...
/**
 * Sky
 */
const sky = new Sky();
scene.add(sky);
```

当然在默认情况下，你什么都看不到，我们只需要调整一下，更多得详细解释会在后面的章节：

```js
sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
```

然后移动相机你能看到，不过缩放不太对，我们调整一下：

```js
sky.scale.set(100, 100, 100);
// 同样值可以用 sky.scale.setScalar(100)
```

没问题了，很棒：

![image-20250202225501610](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202225501610.png)

#### Fog 添加雾气

鬼屋的气氛应该还要有雾气，让我们添加：

```js
/**
 * Fog
 */
scene.fog = new THREE.Fog('#04343f', 1, 13);
```

它很简单，参数就是`color`、`near`和`far`。

不过我们可以通过`FogExp2`来添加，它更真实：

```js
scene.fog = new THREE.FogExp2('#04343f', 0.1);
```

参数就是`color`和`density`，第二个是雾气密度。

很棒，我们离远点就会被雾气遮盖：

![image-20250202230035141](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202230035141.png)

#### 优化项目

当你加载的时候，可以注意网络资源，会发现很大

![image-20250202230322895](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202230322895.png)

优化方法是可以将 jpg 格式换成 webp 格式，它既可以压缩且不会损失数据。

你可以使用 [Squoosh](https://squoosh.app/)在线网站上传，可以看到压缩的差异，且可以导出你需要的图片格式。

你还可以使用 [CloudConvert](https://cloudconvert.com/image-converter)来使用相同统一多次转换。

当然你还可以通过 [TinyPNG](https://tinypng.com/)选择图片格式，然后上传很快就得到所需要的压缩图片了。

你可以根据你的需要选择网站，然后压缩图片等。

本项目最终代码:

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Timer } from 'three/addons/misc/Timer.js';
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

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg'
);
const floorARMTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg'
);
const floorNormalTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg'
);
const floorDisplacementTexture = textureLoader.load(
	'./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg'
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg'
);
const wallARMTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg'
);
const wallNormalTexture = textureLoader.load(
	'./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg'
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofColorTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg'
);
const roofARMTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg'
);
const roofNormalTexture = textureLoader.load(
	'./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg'
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// Bush
const bushColorTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg'
);
const bushARMTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg'
);
const bushNormalTexture = textureLoader.load(
	'./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg'
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

// Grave
const graveColorTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg'
);
const graveARMTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg'
);
const graveNormalTexture = textureLoader.load(
	'./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg'
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'./door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('./door/height.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		transparent: true,
		alphaMap: floorAlphaTexture,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.3,
		displacementBias: -0.2,
	})
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
	.add(floor.material, 'displacementScale')
	.min(0)
	.max(1)
	.step(0.001)
	.name('floorDisplacementScale');
gui
	.add(floor.material, 'displacementBias')
	.min(-1)
	.max(1)
	.step(0.001)
	.name('floorDisplacementBias');

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture,
	})
);
walls.position.y += 1.25;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1.5, 4),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture,
	})
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		map: doorColorTexture,
		transparent: true,
		alphaMap: doorAlphaTexture,
		aoMap: doorAmbientOcclusionTexture,
		roughnessMap: doorRoughnessTexture,
		metalnessMap: doorMetalnessTexture,
		normalMap: doorNormalTexture,
		displacementMap: doorHeightTexture,
		displacementScale: 0.15,
		displacementBias: -0.04,
	})
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
	color: '#ccffcc',
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
	map: graveColorTexture,
	aoMap: graveARMTexture,
	roughnessMap: graveARMTexture,
	metalnessMap: graveARMTexture,
	normalMap: graveNormalTexture,
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
	const angle = Math.random() * Math.PI * 2;
	const radius = 3 + Math.random() * 4;
	const x = Math.sin(angle) * radius;
	const z = Math.cos(angle) * radius;

	// Mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial);

	grave.position.x = x;
	grave.position.y = Math.random() * 0.4;
	grave.position.z = z;

	grave.rotation.x = (Math.random() - 0.5) * 0.4;
	grave.rotation.y = (Math.random() - 0.5) * 0.4;
	grave.rotation.z = (Math.random() - 0.5) * 0.4;

	// Add to graves group
	graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graves.children) {
	grave.castShadow = true;
	grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13);
scene.fog = new THREE.FogExp2('#04343f', 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
	// Timer
	timer.update();
	const elapsedTime = timer.getElapsed();

	// Ghost
	const ghost1Angle = elapsedTime * 0.5;
	ghost1.position.x = Math.cos(ghost1Angle) * 4;
	ghost1.position.z = Math.sin(ghost1Angle) * 4;
	ghost1.position.y =
		Math.sin(ghost1Angle) *
		Math.sin(ghost1Angle * 2.34) *
		Math.sin(ghost1Angle * 3.45);

	const ghost2Angle = -elapsedTime * 0.38;
	ghost2.position.x = Math.cos(ghost2Angle) * 5;
	ghost2.position.z = Math.sin(ghost2Angle) * 5;
	ghost2.position.y =
		Math.sin(ghost2Angle) *
		Math.sin(ghost2Angle * 2.34) *
		Math.sin(ghost2Angle * 3.45);

	const ghost3Angle = elapsedTime * 0.23;
	ghost3.position.x = Math.cos(ghost3Angle) * 6;
	ghost3.position.z = Math.sin(ghost3Angle) * 6;
	ghost3.position.y =
		Math.sin(ghost3Angle) *
		Math.sin(ghost3Angle * 2.34) *
		Math.sin(ghost3Angle * 3.45);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```
