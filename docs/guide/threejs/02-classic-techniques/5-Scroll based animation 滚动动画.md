### Scroll based animation 滚动动画

我们来学习如何使用 Three 让摄像机随着用户滚动而滚动。

#### 初始代码

这是项目的初始代码：

```js
import * as THREE from 'three';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
	materialColor: '#ffeded',
};

gui.addColor(parameters, 'materialColor');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
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
	35,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 6;
scene.add(camera);

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

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

如果不能滚动，是因为 css 文件有个`overflow: hidden`注释一下

还有部分用户滚动到底部可能会有白边，取决于操作系统，解决一下

```js
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
```

我们允许透明度，然后处理一下背景的颜色：

```css
html {
	background: #1e1a20;
}
```

#### 创建对象

先把测试的立方体移除，然后创建新的：

```js
const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 16, 60),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry(1, 2, 32),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
scene.add(mesh1, mesh2, mesh3);
```

当然如果查看会发现比较奇怪，我们会处理一下的。

#### 改进材质

我们只用了基础材质，为了好看，我们可以换一下：

```js
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	material
);
```

当然你会看到全黑的部分。

#### 添加灯光

`MeshToonMaterial`是依赖光的材质，因此我们需要添加 Light：

```js
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
```

现在能看到了，不过 Debug UI 调整颜色的时候没改变，修正一下：

```js
gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor);
});
```

#### 添加纹理

如果你查看文档，会发现这个材质支持渐变，因此我们加载一下纹理来获取更多的色阶效果：

```js
// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
```

然后在材质中使用它：

```js
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: gradientTexture,
});
```

看起来很不错：

![image-20250206212524582](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206212524582.png)

当然感觉有点怪，少了点阴影，我们改一下映射：

```js
gradientTexture.magFilter = THREE.NearestFilter;
```

这样看起来更棒了：

![image-20250206212956616](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206212956616.png)

#### 修改位置

我们把刚刚的立方体部分往下移动，现在还是重合的：

```js
const objectsDistance = 4;
//...
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;
```

#### 添加动画

我们添加一下动画让场景更生动：

```js
const sectionMeshes = [mesh1, mesh2, mesh3];
//...
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x = elapsedTime * 0.1;
		mesh.rotation.y = elapsedTime * 0.12;
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

#### 修改相机

接下来修改相机，让其在滚动的时候视角也动，首先获取滚动值：

```js
/**
 * Scroll
 */
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;
});
```

接下来在`tick`中修改相机，这里要计算一下距离：

```js
const tick = () => {
	//...
	// Animate camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance;
	// ...
};
```

就是除以视口高度然后乘刚刚的距离就是物体的移动距离

#### 修改物体 x

这个简单就是让物体不挡住文字即可：

```js
mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;
```

#### 光标

接下来添加光标相关，通过鼠标控制物体移动：

```js
/**
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});
```

这样值左右上下移动的时候是正负交替，然后修改相机：

```js
const tick = () => {
	//...
	const parallaxX = cursor.x;
	const parallaxY = -cursor.y;
	camera.position.x = parallaxX;
	camera.position.y = parallaxY;
	//...
};
```

现在移动物体会靠近，当然你会发现滚动不起作用了。

#### 修正问题

我们通过`Group`来解决这个问题，创建一个组：

```js
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 6;
cameraGroup.add(camera);
```

然后我们不再移动相机，而是移动组：

```js
const tick = () => {
	//...
	const parallaxX = cursor.x;
	const parallaxY = -cursor.y;
	cameraGroup.position.x = parallaxX;
	cameraGroup.position.y = parallaxY;
	//...
};
```

这样就可以滚动，同时也可以通过鼠标来做移动。

#### 顺滑效果

现在我们移动是直接修改过去，我们让其每帧的时候移动一点，更加顺滑，越近速度越慢：

```js
cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.1;
cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.1;
```

当然还有问题，如果是高频显示器，屏幕刷新率很高，这个公式就会被一直调用，速度会变快，因此我们修改一下：

```js
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Animate camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance;

	const parallaxX = cursor.x * 0.5;
	const parallaxY = -cursor.y * 0.5;
	cameraGroup.position.x +=
		(parallaxX - cameraGroup.position.x) * 5 * deltaTime;
	cameraGroup.position.y +=
		(parallaxY - cameraGroup.position.y) * 5 * deltaTime;
};
```

#### 添加粒子

现在背景都是黑的，不好看，我们加点粒子加点深度：

```js
/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
	const i3 = i * 3;
	positions[i3 + 0] = (Math.random() - 0.5) * 10;
	positions[i3 + 1] =
		objectsDistance * 0.5 -
		Math.random() * objectsDistance * sectionMeshes.length;
	positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.03,
	sizeAttenuation: true,
	color: parameters.materialColor,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
```

这样背景就有点点星光的样子：

![image-20250206221544728](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250206221544728.png)

当然颜色也要修改：

```js
gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor);
	particlesMaterial.color.set(parameters.materialColor);
});
```

#### 简单旋转

当我们旋转到对应物体，我们让物体旋转，先得到对应物体：

```js
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (newSection !== currentSection) {
		currentSection = newSection;
		console.log(currentSection);
	}
});
```

这样我们就能获取，接下来还是使用`gsap`库来做：

```js
window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (newSection !== currentSection) {
		currentSection = newSection;

		gsap.to(sectionMeshes[currentSection].rotation, {
			duration: 1.5,
			ease: 'power2.inOut',
			x: '+=6',
			y: '+=3',
			z: '+=1.5',
		});
	}
});
```

当然你会发现不起作用，因为`tick`里面我们需要修正：

```js
// Animate meshes
for (const mesh of sectionMeshes) {
	mesh.rotation.x += deltaTime * 0.1;
	mesh.rotation.y += deltaTime * 0.12;
}
```

这样就完成了，可以多学学，下面是完整代码：

```js
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
	materialColor: '#ffeded',
};

gui.addColor(parameters, 'materialColor').onChange(() => {
	material.color.set(parameters.materialColor);
	particlesMaterial.color.set(parameters.materialColor);
});

// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const objectsDistance = 4;
const material = new THREE.MeshToonMaterial({
	color: parameters.materialColor,
	gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 161),
	material
);
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
	const i3 = i * 3;
	positions[i3 + 0] = (Math.random() - 0.5) * 10;
	positions[i3 + 1] =
		objectsDistance * 0.5 -
		Math.random() * objectsDistance * sectionMeshes.length;
	positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.03,
	sizeAttenuation: true,
	color: parameters.materialColor,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
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
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setClearAlpha(1);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (newSection !== currentSection) {
		currentSection = newSection;

		gsap.to(sectionMeshes[currentSection].rotation, {
			duration: 1.5,
			ease: 'power2.inOut',
			x: '+=6',
			y: '+=3',
			z: '+=1.5',
		});
	}
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Animate camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance;

	const parallaxX = cursor.x * 0.5;
	const parallaxY = -cursor.y * 0.5;
	cameraGroup.position.x +=
		(parallaxX - cameraGroup.position.x) * 5 * deltaTime;
	cameraGroup.position.y +=
		(parallaxY - cameraGroup.position.y) * 5 * deltaTime;

	// Animate meshes
	for (const mesh of sectionMeshes) {
		mesh.rotation.x += deltaTime * 0.1;
		mesh.rotation.y += deltaTime * 0.12;
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```
