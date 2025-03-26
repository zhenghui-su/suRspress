### Galaxy Generatory 银河生成器

本节我们通过上一节学到的粒子来创建一个自己的银河。

#### 初始代码

这是初始的代码：

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
 * Test cube
 */
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial()
);
scene.add(cube);

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
camera.position.x = 3;
camera.position.y = 3;
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

#### 创建基础

可以先把立方体移除，然后我们先创建立方体及其位置：

```js
/**
 * Galaxy
 */
const paramters = {
	count: 1000,
};
const generateGalaxy = () => {
	const geometry = new THREE.BufferGeometry();

	const positions = new Float32Array(paramters.count * 3);

	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;
		positions[i3] = (Math.random() - 0.5) * 3;
		positions[i3 + 1] = (Math.random() - 0.5) * 3;
		positions[i3 + 2] = (Math.random() - 0.5) * 3;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
};
generateGalaxy();
```

随后设置材质相关，通过粒子：

```js
const paramters = {
	count: 1000,
	size: 0.02,
};
const generateGalaxy = () => {
	// ...
	// Material
	const material = new THREE.PointsMaterial({
		size: paramters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});
};
```

然后加上这些粒子：

```js
const generateGalaxy = () => {
	// ...
	// Points
	const points = new THREE.Points(geometry, material);
	scene.add(points);
};
```

当然可以把我们的参数放入到 Debug UI：

```js
gui
	.add(paramters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy);
gui
	.add(paramters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

记得`onFinishChange`即变化后重新调用生成，同时我们应该在调整后把之前的对象删除，因此调整一下：

```js
let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {
	geometry = new THREE.BufferGeometry();
	//...
	material = new THREE.PointsMaterial({
		size: paramters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});
	//...
	points = new THREE.Points(geometry, material);
	scene.add(points);
};
```

把他们提出去，然后在每次生成的时候判断：

```js
const generateGalaxy = () => {
	/**
	 * Destroy old galaxy
	 */
	if (points !== null) {
		geometry.dispose();
		material.dispose();
		scene.remove(points);
	}
	//...
};
```

这样就可以随便调整值，同时也会随时改变页面显示。

#### 创建分支

我们要创建一个螺旋星系，接下来就是这个形状：

![image-20250206154432674](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206154432674.png)

首先我们会看到里面有个中心点，因此有个半径：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
};
//...
gui
	.add(paramters, 'radius')
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy);
```

然后我们来创建线，先把粒子放到线上：

```js
const generateGalaxy = () => {
	//...
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;

		positions[i3] = radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;
	}
	//...
};
```

接下来是创建几个分支线，我们放到参数里面：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
};
//...
gui
	.add(paramters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy);
```

然后在 for 循环里面生成分支的角度，通过模运算我们得到固定的 0 1 2 等值，然后除以分支数以及乘 π，这样就可以得到角度，通过 sin 和 cos 乘半径得到位置

可以参考图：

![image-20250206160011019](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160011019.png)

```js
const generateGalaxy = () => {
	// ...
	for (let i = 0; i < paramters.count; i++) {
		const i3 = i * 3;

		const radius = Math.random() * paramters.radius;
		const branchesAngle =
			((i % paramters.branches) / paramters.branches) * Math.PI * 2;

		positions[i3] = Math.cos(branchesAngle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(branchesAngle) * radius;
	}
	// ...
};
```

查看，我们就得到了是三个线：

![image-20250206160150454](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160150454.png)

#### 添加旋转角度

接下来我们需要让它旋转，变为螺旋样式，加到参数：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 1,
};
//...
gui
	.add(paramters, 'spin')
	.min(-5)
	.max(5)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后在其中添加旋转：

```js
for (let i = 0; i < paramters.count; i++) {
	const i3 = i * 3;

	const radius = Math.random() * paramters.radius;
	const spinAngle = radius * paramters.spin;
	const branchesAngle =
		((i % paramters.branches) / paramters.branches) * Math.PI * 2;

	positions[i3] = Math.cos(branchesAngle + spinAngle) * radius;
	positions[i3 + 1] = 0;
	positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius;
}
```

看看样子不错：

![image-20250206160833589](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206160833589.png)

#### 添加随机性

目前粒子都分布在线上，我们需要随机性，添加到参数：

```js
const paramters = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 1,
	randomness: 0.2,
};
//...
gui
	.add(paramters, 'randomness')
	.min(0)
	.max(2)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后运用随机性：

```js
for (let i = 0; i < paramters.count; i++) {
	const i3 = i * 3;

	const radius = Math.random() * paramters.radius;
	const spinAngle = radius * paramters.spin;
	const branchesAngle =
		((i % paramters.branches) / paramters.branches) * Math.PI * 2;

	const randomX = (Math.random() - 0.5) * paramters.randomness * radius;
	const randomY = (Math.random() - 0.5) * paramters.randomness * radius;
	const randomZ = (Math.random() - 0.5) * paramters.randomness * radius;

	positions[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX;
	positions[i3 + 1] = randomY;
	positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ;
}
```

看看不错，调高随机性可以分布的更多：

![image-20250206161307969](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206161307969.png)

#### 添加随机强度

上面的随机性值还算是一个固定的直线，我们需要让他变为曲线，这样竖着看就不像一个立方体，添加随机强度到参数：

```js
const paramters = {
	//...
	randomnessPower: 3,
};
//...
gui
	.add(paramters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy);
```

然后通过`pow`来做运算：

```js
const randomX =
	Math.pow(Math.random(), paramters.randomnessPower) *
	(Math.random() < 0.5 ? 1 : -1);
const randomY =
	Math.pow(Math.random(), paramters.randomnessPower) *
	(Math.random() < 0.5 ? 1 : -1);
const randomZ =
	Math.pow(Math.random(), paramters.randomnessPower) *
	(Math.random() < 0.5 ? 1 : -1);
```

#### 添加颜色

接下来我们添加颜色：

```js
const paramters = {
	//...
	insideColor: '#ff6030',
	outsideColor: '#1b3984',
};
//...
gui.addColor(paramters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(paramters, 'outsideColor').onFinishChange(generateGalaxy);
```

然后运用到材质：

```js
material = new THREE.PointsMaterial({
	size: paramters.size,
	sizeAttenuation: true,
	depthWrite: false,
	blending: THREE.AdditiveBlending,
	vertexColors: true,
});
```

当然我们还需要创建一个新属性：

```js
const colors = new Float32Array(paramters.count * 3);

for (let i = 0; i < paramters.count; i++) {
	// ...
	// Color
	colors[i3] = 1;
	colors[i3 + 1] = 0;
	colors[i3 + 2] = 0;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
```

先看看有没有，有红色就行，然后我们创建内圈和外圈颜色，随后混合它，然后添加到 rgb：

```js
const colorInside = new THREE.Color(paramters.insideColor);
const colorOutside = new THREE.Color(paramters.outsideColor);
for (let i = 0; i < paramters.count; i++) {
	//...
	// Color
	const mixedColor = colorInside.clone();
	mixedColor.lerp(colorOutside, radius / paramters.radius);

	colors[i3 + 0] = mixedColor.r;
	colors[i3 + 1] = mixedColor.g;
	colors[i3 + 2] = mixedColor.b;
}
```

看起来很不错：

![image-20250206164101093](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206164101093.png)

我们就完成这个了，你还可以调整参数以及添加更多参数等。
