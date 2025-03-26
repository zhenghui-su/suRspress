### Lights 灯光

之前我们已经简单的使用过灯光，本节我们详细聊聊。

#### 初始化

下面是初始代码：

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 32, 64),
	material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

	// Update objects
	sphere.rotation.y = 0.1 * elapsedTime;
	cube.rotation.y = 0.1 * elapsedTime;
	torus.rotation.y = 0.1 * elapsedTime;

	sphere.rotation.x = 0.15 * elapsedTime;
	cube.rotation.x = 0.15 * elapsedTime;
	torus.rotation.x = 0.15 * elapsedTime;

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

你可以先移除灯光部分，我们会详细讲解这块。

#### AmbitionLight 环境光

首先是环境光，创建它需要`AmbitionLight`实例，第一个参数是颜色，第二个参数是灯光亮度：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// 也可以不传参数使用属性的方式设置
scene.add(ambientLight);
```

保存后能显示了，不过由于光线是均匀分布的因此立方体并不显眼

![image-20250201164035977](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164035977.png)

我们也可以将属性加入到 gui 用于调试：

```js
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
```

#### DirectionalLight 方向光

我们可以通过`DirectionalLight`创建定向光：

```js
const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.3);
scene.add(directionalLight);
```

保存后会发现就像从上面照下来光一样：

![image-20250201164238927](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164238927.png)

参数和环境光一样，但我们要换方向呢？其实就是调整位置：

```js
directionalLight.position.set(1, 0.25, 0);
```

很明显的看到它改变方向了：

![image-20250201164457499](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164457499.png)

这点在用于阴影的时候还是很有用的。

#### HemisphereLight 半球型灯光

我们通过`HemisphereLight`创建半球型的灯光：

```js
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);
```

然后把其他两个添加光先注释一下，先看上面是红色：

![image-20250201164922189](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164922189.png)

再看下面是蓝色：

![image-20250201164948506](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201164948506.png)

中间颜色是它们混合颜色有点像紫色：

![image-20250201165029432](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165029432.png)

现在我们就懂了，第一个参数颜色光从上方射出，第二个参数颜色光从下方射出，中间部分会混合在一起。

之前的注释可以恢复了。

#### PointLight 点光

我们可以通过`PointLight`创建点光：

```js
const pointLight = new THREE.PointLight(0xff9000, 0.5);
scene.add(pointLight);
```

我们会很明显看到一个小光源在照亮：

![image-20250201165439687](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165439687.png)

当然我们还可以改变这个点光源的位置：

```js
pointLight.position.set(1, -0.5, 1);
```

这样就非常明显看到了：

![image-20250201165636071](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201165636071.png)

当然`PointLight`还有两个属性：

- `distance`：距离，即光能照射的距离，超过就没有光了
- `decay`：衰减，即光衰减的速度

#### RectAreaLight 矩形区域光

我们可以通过`RectAreaLight`创建矩形区域的光：

```js
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
scene.add(rectAreaLight);
```

多出的两个参数就是`width`和`height`即宽度和高度。

很明显的看到一个矩形区域的光在照射：

![image-20250201170154375](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201170154375.png)

它有点像摄影棚里面的灯光照射，会往外扩散但主要朝向一个位置

我们可以调整一下，把其他几个光注释一下，这样明显多了：

![image-20250201170324622](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201170324622.png)

不过需要注意，该光源只能在`MeshStandardMaterial`和`MashPhysicalMaterial`两个材质中工作，如果你使用其他材质它不会生效。

我们也可以改变灯光位置和调整方向(利用 lookAt 定位）：

```js
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
```

#### SpotLight 聚光灯

我们可以通过`SpotLight`创建聚光灯，就像手电筒一样：

```js
const spotLight = new THREE.SpotLight('orange', 10, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
```

前两个参数一样，解释一下另外几个参数：

- `distance`：光能照射到的距离，距离越近越亮
- `angle`：光的照射角度
- `penumbra`：边缘半影比例，如果为 0 边缘就会很清晰
- `decay`：光的衰减效果

查看，很明显的一个聚光灯效果：

![image-20250201184437193](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201184437193.png)

当然我们也可以调整位置，不过这次需要通过`target`：

```js
scene.add(spotLight.target);
spotLight.target.position.x = -0.75;
```

这样才能移动最终结果位置：

![image-20250201185048304](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201185048304.png)

#### Performance 性能

加上灯光会影响性能，以上灯光的性能损耗如下举例可参考：

- 较低损耗：`AmbientLight`和`HemisphereLight`
- 中等损耗：`DirectionalLight`和`PointLight`
- 较高损耗：`SpotLight`和`RectAreaLight`

你可以根据项目需求选择好不同的灯光效果。

#### Bake

如果场景中需要移动，且有光照，我们更推荐通过 Bake 烘焙的方式，即将灯光、阴影和照明效果全部放入到纹理之中，这样能比添加光源更加节省性能和更容易开发。

#### Helper

光源定位可能是一件很难的事，Three 提供了`Helper`的方式来帮助我们：

```js
// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
	hemisphereLight,
	0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
	directionalLight,
	0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
```

保存查看，四个光源都定位显示了：

![image-20250201190542257](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201190542257.png)

`RectAreaLight`比较特殊，单独引入一下：

```js
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// ...
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
```

成功显示出来：

![image-20250201190739940](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201190739940.png)
