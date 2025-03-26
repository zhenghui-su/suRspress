### Physics 物理特效

本节我们要介绍 Three 里面的物理学，Github：[three-journey](https://github.com/zhenghui-su/three-journey)

#### 初始代码

js 文件初始代码：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.png',
	'/textures/environmentMaps/0/nx.png',
	'/textures/environmentMaps/0/py.png',
	'/textures/environmentMaps/0/ny.png',
	'/textures/environmentMaps/0/pz.png',
	'/textures/environmentMaps/0/nz.png',
]);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshStandardMaterial({
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#777777',
		metalness: 0.3,
		roughness: 0.4,
		envMap: environmentMapTexture,
		envMapIntensity: 0.5,
	})
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

#### 物理计算库

为了方便，我们应该使用库，这边列出几个物理库：

- 3D 物理库：

  - Ammo.js

  - Cannon.js

  - Oimo.js

- 2D 物理库：

  - Matter.js

  - P2.js

  - Planck.js
  - Box2D.js

接下来是将 Three 与物理库结合，我们选择`Cannon.js`，比较简单。

你可以安装一下`npm i --save cannon`，然后引入：

```js
import CANNON from 'cannon';
```

#### 创建物理世界

我们现在拥有地面和球体，接下来创建物理世界，让他动起来：

```js
/**
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
```

我们创建物理世界并且改变重力，这样就能模拟真实世界。注意的是我们是向下的重力，因此是 y 轴，在 Three 中 y 是向下的。

接下来需要在这个物理世界中加入球体，需用到`Body`，在创建它之前我们需要有`Shape`形状，这就和 Three 的网格 Mesh 一样，需要材质和立方体：

```js
// Sphere
const sphereShape = new CANNON.Sphere(0.5);
```

然后通过`Shape`创建`Body`：

```js
const sphereBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0, 3, 0),
	shape: sphereShape,
});
```

然后将其加入到世界中：

```js
world.addBody(sphereBody);
```

当然现在没反应，是因为我们需要让物理世界更新，因此可以让他自行更新。

#### 更新物理世界

更新物理世界我们需要使用`step`函数，我们需要每一帧更新因此在`tick`中写：

```js
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - oldElapsedTime;
	oldElapsedTime = elapsedTime;

	// Update physics world
	world.step(1 / 60, deltaTime, 3);
	//...
};
```

在`step`函数中我们需要提供三个参数：

- 固定时间戳，我们一般设置 1/60，即 60 帧分之 1
- 从上一步开始经过的时间，我们计算得出
- 在出现问题的时候比如物理延迟的时候，环境可以提供多少次迭代

当然还是看不到效果，你可以通过打印`sphereBody.position.y`来查看物体值。

接下来就是将物理世界的坐标传给 Three 的物体坐标：

```js
sphere.position.copy(sphereBody.position);
```

这样就能看到物体掉下来了，当然你也可以单独赋值坐标 x、y、z。

#### 创建物理地面

球体目前会直接穿过地面，因此我们需要在物理世界中创建这个地面让他不掉下来：

```js
// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
	mass: 0,
	shape: floorShape,
});
world.addBody(floorBody);
```

`mass`参数为 0 就是代表这个物体固定不会动，还有 Body 的参数也可以通过属性和函数来添加，如`floorBody.mass = 0`和`floorBody.addShape(floorShape)`

当然你现在会看到物体掉的位置不太对，其实是因为我们如果不旋转 Three 的地面，就会发现地面的方向是竖着的，因此这里物理世界的地面也是这样，我们需要旋转。

不过在`Cannon`中旋转较为困难，因为它只支持四元数，通过`setFromAxisAngle`，第一个参数是轴它是 Vec3 对象，第二个参数是旋转角度：

```js
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
```

这样物体就正正好掉到我们的地面上了，注意如果没出现可能是你的旋转方向错了。

#### 添加材质模拟弹性

现在球体掉下来的时候没有弹性，我们给他添加上物理材质：

```js
// Materials
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');
```

接下来是创建接触材质，模拟混凝土和塑料碰撞的样子：

```js
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
	concreteMaterial,
	plasticMaterial,
	{
		friction: 0.1, // 摩擦力
		restitution: 0.7, // 回弹系数
	}
);
world.addContactMaterial(concretePlasticContactMaterial);
```

当然现在结果还是没有变化，因为我们需要在创建`Body`的时候指定材质：

```js
const sphereBody = new CANNON.Body({
	//...
	material: plasticMaterial,
});
//...
const floorBody = new CANNON.Body({
	//...
	material: concreteMaterial,
});
```

这样子就能看到球体弹跳了，看起来不错。

#### 简化代码

我们会发现这个流程代码有点多，因此我们接下来简化代码，只使用一个：

```js
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		friction: 0.1, // 摩擦力
		restitution: 0.7, // 回弹系数
	}
);
world.addContactMaterial(defaultContactMaterial);
// 下面的Body的Material也改
```

你会发现效果没有差别，不过我们还可以不给 Body 添加材质，直接给世界添加默认材质

```js
world.defaultContactMaterial = defaultContactMaterial;
```

你会发现是一样的，这样就可以让我们的世界只使用一个，在大部分情况下够用了。

#### 控制物体

接下来我们可以控制物体相关，如下：

- 通过`applyForce`可以给物体施加一个力，像真实世界一样

- 通过`applyImpulse`可以给物体施加一个冲量，它增加的是物体的速度

- 通过`applyLocalForce`可以给某个坐标施加局部力

- 通过`applyLocalImpulse`可以给某个坐标施加局部冲量

我们使用施加力试试，将物体推向某个方向，同时选择施加力的点为中心：

```js
sphereBody.applyLocalForce(
	new CANNON.Vec3(150, 0, 0),
	new CANNON.Vec3(0, 0, 0)
);
```

通过它我们可以模拟风，让它吹着物体跑：

```js
const tick = () => {
	//...
	// Update physics world
	sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

	world.step(1 / 60, deltaTime, 3);
	//...
};
```

你会看到物体先朝某个方向动，然后停止朝相反的方向运动。

#### 创建函数

代码长度有点多，我们把球体的`Body`和 Three 中的球体删除，然后创建一个生成函数

```js
/**
 * Utils
 */
const createSphere = (radius, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 20, 20),
		new THREE.MeshStandardMaterial({
			metalness: 0.3,
			roughness: 0.4,
			envMap: environmentMapTexture,
		})
	);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);

	// Cannon.js body
	const shape = new CANNON.Sphere(radius);
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});
	body.position.copy(position);
	world.addBody(body);
};
```

然后调用它：

```js
createSphere(0.5, { x: 0, y: 3, z: 0 });
```

接下来是通过一个数组包含所需更新的对象，然后更新：

```js
const objectsToUpdate = [];
const createSphere = (radius, position) => {
	//...
	// Save in objects to update
	objectsToUpdate.push({
		mesh,
		body,
	});
};
//...
const tick = () => {
	//...
	for (const object of objectsToUpdate) {
		object.mesh.position.copy(object.body.position);
	}
	//...
};
```

这样我们就方便了，比如我在创建一个：

```js
createSphere(0.5, { x: 2, y: 3, z: 2 });
```

接下来我们将东西添加到 gui，因此需要一个对象：

```js
/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};
debugObject.createSphere = () => {
	createSphere(0.5, { x: 0, y: 3, z: 0 });
};
gui.add(debugObject, 'createSphere');
```

这样点击右上角的按钮就可以添加一个球体了，我们在弄点随机位置：

```js
debugObject.createSphere = () => {
	createSphere(Math.random() * 0.5, {
		x: (Math.random() - 0.5) * 3,
		y: Math.random() * 3,
		z: (Math.random() - 0.5) * 3,
	});
};
```

接下来点击会出现大小和位置随机的球体，看起来不错。

#### 优化代码

接下来我们优化一下，radius 通过缩放来设置半径。

```js
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	mesh.castShadow = true;
	mesh.scale.set(radius, radius, radius);
	//...
};
```

这样用的都是一个，性能优化一下。

#### 练习：盒子 Box

接下来是练习，我们用 Box 盒子而不是球体，你可以自己练习一下流程：

```js
// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
	metalness: 0.3,
	roughness: 0.4,
	envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
	// Three.js mesh
	const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
	mesh.castShadow = true;
	mesh.scale.set(width, height, depth);
	mesh.position.copy(position);
	scene.add(mesh);

	// Cannon.js body
	const shape = new CANNON.Box(
		new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
	);
	const body = new CANNON.Body({
		mass: 1,
		position: new CANNON.Vec3(0, 3, 0),
		shape,
		material: defaultMaterial,
	});
	body.position.copy(position);
	world.addBody(body);

	// Save in objects to update
	objectsToUpdate.push({
		mesh,
		body,
	});
};
```

其实没区别，唯一注意的是 Cannon 的 Box 是从中心点计算长宽高，因此只需一半。

然后加到 gui 中：

```js
debugObject.createBox = () => {
	createBox(Math.random(), Math.random(), Math.random(), {
		x: (Math.random() - 0.5) * 3,
		y: Math.random() * 3,
		z: (Math.random() - 0.5) * 3,
	});
};
gui.add(debugObject, 'createBox');
```

创建成功了，看起来不错：

![image-20250212184428855](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250212184428855.png)

不过它的物理特性有点怪，如果一个盒子的部分撞到另一个应该旋转，需要调整一下：

```js
const tick = () => {
	//...
	for (const object of objectsToUpdate) {
		object.mesh.position.copy(object.body.position);
		object.mesh.quaternion.copy(object.body.quaternion);
	}
	//...
};
```

通过直接复制四元数即可解决了，这样盒子就会是东倒西歪的：

![image-20250212184753371](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250212184753371.png)

#### 性能

需要注意，Cannon 是默认通过监测一个对象是否碰撞另一个，这样一个一个的，因此对象过多的时候会对 CPU 压力大，这个过程是叫做原始广义监测。

因此我们还可以使用其他广义监测，下面是列举：

- NativeBroadphase：默认的原始广义监测，每个 Body 都监测是否碰撞另一个
- GridBroadphase：网格化广义监测，就是分出网格，当一个物体要碰撞，就会和同一个网格的其他物体进行检测测试，因此性能较好。唯一的问题是如果物体速度过快可能检测会出现 bug。
- SAPBroadphase（Sweep And Prune）：扫掠和修剪法，它会在轴上进行测试，它比网格也较好，唯一问题是物体运动过快可能会碰不到。

让我们试试吧，这样能提高性能：

```js
world.broadphase = new CANNON.SAPBroadphase(world);
```

当然这样不错，不过有部分物体它不动了就应该不用测了，即让它休眠：

```js
world.allowSleep = true;
```

#### 事件

接下来我们来看看事件，我们可以给球体的碰撞添加上声音：

```js
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = () => {
	hitSound.play();
};
```

然后我们在创建物体后监听事件：

```js
const createBox = (width, height, depth, position) => {
	//...
	body.addEventListener('collide', playHitSound);
	//...
};
```

这样 Box 的盒子碰撞的时候就会听到声音，不过你会听到声音不太对，是连续的而不是叠加的，尤其是多个物体同时碰撞，我们修正一下：

```js
const playHitSound = () => {
	hitSound.currentTime = 0; // 重置音频播放位置
	hitSound.play();
};
```

不过这样的声音看起来有点多并且嘈杂，因此我们可以检测只有碰撞力度足够才有声：

```js
const playHitSound = (collision) => {
	// 获取冲击力
	const impactStrength = collision.contact.getImpactVelocityAlongNormal();

	if (impactStrength > 1.5) {
		hitSound.currentTime = 0; // 重置音频播放位置
		hitSound.play();
	}
};
```

不过这个声音太规律了，我们可以调整一下音量：

```js
const playHitSound = (collision) => {
	// 获取冲击力
	const impactStrength = collision.contact.getImpactVelocityAlongNormal();

	if (impactStrength > 1.5) {
		hitSound.volume = Math.random(); // 设置随机音量
		hitSound.currentTime = 0; // 重置音频播放位置
		hitSound.play();
	}
};
```

#### 删除物体

有些时候太多物体，我们可以创建一个重置按钮：

```js
debugObject.reset = () => {
	for (const object of objectsToUpdate) {
		// Remove body
		object.body.removeEventListener('collide', playHitSound);
		world.remove(object.body);

		// Remove mesh
		scene.remove(object.mesh);
	}
	// 清空对象数组
	objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, 'reset');
```

#### 设置约束

你还可以给物体之间设置约束，如下：

- HingeConstraint：铰链约束，就像一扇铰链门一样转动
- DistanceConstraint：距离约束，让物体之间保持相同的距离
- LockConstraint：固定约束，就是绑定成一个整体，同时旋转移动
- PointToPointConstraint：点对点约束，就像在特定位置粘合东西一样

#### 更多

Cannon 还有很多，类，事件等等，你可以查看 Github 的官方文档，不过遗憾的是它已经很久没有更新了，幸运的是有人 fork 并且修复问题添加一些更新。

你可以通过`npm i --save cannon-es`来下载，Github 地址：[cannon-es](https://github.com/pmndrs/cannon-es)

当然你还可以使用`Ammo.js`，它通过 Bullet 和 c++来编写，Github 地址：[ammo.js](https://github.com/kripken/ammo.js)，它还支持 WebAssembly，它较难理解，不过它支持的东西也更多。

或者还有`Physijs`，它理念是无需先创建网格再添加物体，只需要创建它的网格，它帮你两个事情都做了，不过出错时不容易找出问题，Github 地址：[physijs](https://github.com/chandlerprall/Physijs)

在后面我们通过 react 来创建 Three 项目时，还可以使用别的物理库。
