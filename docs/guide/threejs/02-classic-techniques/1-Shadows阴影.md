### Shadows 阴影

上面讲解了灯光，那么光照过去应该出现阴影，本节就聊聊它。

#### 初始代码

先提供一下这小节的初始代码：

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere, plane);

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

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

打开，就会看到球有一部分阴影：

![image-20250201232221964](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201232221964.png)

上面阴影即核心阴影，阴影总是 3D 的难题，使用 Blender 等软件涉及到光线追踪来实现，它非常耗时，因此我们需要性能优秀的方案，Three 有内置的实现，虽然它并不完美，但它简单且快速：

- 当你渲染时，Three 会为每个支持阴影的光源进行渲染
- 当渲染到光源时，Three 会将在位置放一个相机然后生成灯光渲染结果，材质会被替换为`MeshDepthMaterial`以便获取深度信息
- 灯光渲染结果存储在纹理，它被称为阴影纹理
- 阴影纹理可以运用到材质上，随后被投射到几何体

#### Start Shadows 启动阴影

要启用阴影，首先检查渲染器的属性`shadowMap.enabled`开启：

```js
renderer.shadowMap.enabled = true;
```

接下来就是看立方体是否可以接收阴影和投射阴影，我们需要让球投射阴影到平面上，因此球投射，平面接收：

```js
sphere.castShadow = true; // 投射阴影
// ...
plane.receiveShadow = true; // 接收阴影
```

接下来我们需要打开灯光阴影，需注意支持灯光阴影的只有如下：

- `PointLight`
- `DirectionalLight`
- `SpotLight`

#### 处理平行光阴影

处理一下我们的`DirectionalLight`：

```js
directionalLight.castShadow = true;
```

保存后，你立马就能看到平面上出现了球的投射阴影：

![image-20250201234252904](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201234252904.png)

##### 优化平行光阴影

目前看着这个阴影还是有很多缺点，我们一步步来优化。

首先是优化渲染尺寸，因为阴影纹理贴图是有宽高的，因此可以调整

```js
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
```

请记住一定使用 2 的幂次值，涉及到 MIP 映射的原因。

接下来我们可以调整阴影的相机，平行光的相机是正交型的，你可以通过`shadow.camera`访问它的相关属性，我们需要找到近平面和远平面的最佳参数。

可以添加一个`CameraHelper`来帮助我们寻找：

```js
const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);
```

蓝色是光源，绿色是近平面和远平面：

![image-20250201235714475](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201235714475.png)

很明显的远平面太过遥远，近平面也可以稍微近点，调整一下：

```js
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
```

这样看起来不错：

![image-20250201235933676](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250201235933676.png)

##### Amplitude 振幅

从画出的线框可以看出，现在的纹理生成范围有点太大了，我们可以缩小一些，相机有左右上下的范围，调整一下：

```js
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
```

缩小了不少：

![image-20250202000518545](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202000518545.png)

这样子不错了，我们可以将`CameraHelper`隐藏：

```js
directionalLightCameraHelper.visible = false;
```

##### 控制阴影模糊半径

我们还可以调整平行光的阴影半径：

```js
directionalLight.shadow.radius = 10;
```

这样它的边缘更模糊了：

![image-20250202000839518](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202000839518.png)

#### 阴影算法

接下来说一下 Three 可用的几个阴影算法：

- `THREE.BasicShadowMap`：基础算法，性能好画质低
- `THREE.PCFShadowMap`：PCF 算法，默认采用，性能稍差画质不错
- `THREE.PCFSoftShadowMap`：比上面加上了软化效果
- `THREE.VSMShadowMap`：VSM 算法，性能较差，画质不错

你可以改变渲染器的`shadowMap.type`来选择使用哪个：

```js
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

注意，阴影半径在`PCFSoftShadowMap`不起作用，因此不模糊：

![image-20250202001330426](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202001330426.png)

#### 处理聚光灯阴影

前面讲过聚光灯也支持阴影，让我们试试：

```js
const spotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI * 0.3);

spotLight.castShadow = true;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
```

为了明显点你可以降低前面两个的光强度，可以看到平面上的阴影：

![image-20250202002158940](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202002158940.png)

我们可以加上`CameraHelper`辅助一下：

```js
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
```

不过这个混合阴影还是不太好看，因此建议不要多个光源产生阴影

##### 优化聚光灯阴影

和之前的一样，优化调整一下，注意聚光灯的相机是透视型相机，我们还需控制相机视野角度：

```js
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30; // 相机视锥体的角度
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
```

然后就可以隐藏辅助工具：

```js
spotLightCameraHelper.visible = false;
```

#### 处理点光阴影

接下来创建`PointLight`相关：

```js
const pointLight = new THREE.PointLight(0xffffff, 5);

pointLight.castShadow = true;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
```

为了明显，我将前面的光强度都降低，能明显看到投影：

![image-20250202003728516](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202003728516.png)

不过你会注意到点光源采用的是透视型相机，这是因为点光源会向各个方向散发光，因此通过透视相机将其放到不同方向(6 个)，最终来形成阴影。

##### 优化点光阴影

我们继续之前操作，优化：

```js
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
```

然后关闭辅助：

```js
pointLightCameraHelper.visible = false;
```

然后随便调整不同光的强度，可以看到三个阴影：

![image-20250202004409093](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202004409093.png)

#### 预渲染阴影

很明显，制作阴影是件困难的事情，尤其在阴影过多的场景，解决的一大方法就是之前所说过的烘焙即预渲染，我们将阴影也放入纹理中，就不在需要实时阴影，我们可以试试。

首先我们需要禁止阴影渲染，这样就不需要注释之前的：

```js
directionalLight.castShadow = false;
spotLight.castShadow = false;
pointLight.castShadow = false;
renderer.shadowMap.enabled = false;
```

然后我们可以使用一下预渲染的纹理，图片如下：

![image-20250202004916893](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202004916893.png)

加载一下这个纹理：

```js
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('textures/bakedShadow.jpg');
// ...
const plane = new THREE.Mesh(
	new THREE.PlaneGeometry(5, 5),
	new THREE.MeshBasicMaterial({
		map: bakedShadow,
	})
);
```

然后保存，查看：

![image-20250202005519880](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202005519880.png)

需要注意你移动球体后可能会看到奇怪的现象，因为它嵌在平面上。

#### 加载简单阴影纹理

还有一种解决方案是通过`alphaMap`然后将其渲染，如下：

![image-20250202005803481](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202005803481.png)

我们将之前的材质恢复，然后加载这个纹理：

```js
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg');
```

随后我们需要在球体下面创建阴影：

```js
const sphereShadow = new THREE.Mesh(
	new THREE.PlaneGeometry(1.5, 1.5),
	new THREE.MeshBasicMaterial({
		color: 0x000000,
		transparent: true, // 前置必须
		alphaMap: simpleShadow,
	})
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphereShadow);
```

保存查看，效果不错：

![image-20250202010252749](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010252749.png)

#### 加载动画

我们给这个球体加上动画，更酷炫：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update sphere
	sphere.position.x = Math.cos(elapsedTime) * 1.5;
	sphere.position.z = Math.sin(elapsedTime) * 1.5;
	sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
	// ...
};
```

这样小球就跳动起来了！

![image-20250202010530078](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010530078.png)

不过我们还需更新阴影，他现在停在原地了：

```js
const tick = () => {
	//...

	// Update shadow
	sphereShadow.position.x = sphere.position.x;
	sphereShadow.position.z = sphere.position.z;
	sphereShadow.material.opacity = (1 - sphere.position.y) * 0.7;
	// ...
};
```

接近平面时，阴影变浓：

![image-20250202010857468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010857468.png)

远离平面时，阴影变淡：

![image-20250202010939483](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250202010939483.png)

Great！我们完成了，当然你可以再控制一些细节，不过我们就到这吧。
