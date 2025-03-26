### Raycaster and Mouse Events 光线投射器和鼠标事件

通过光线投射器可以用于不少场景，如测试是否命中，距离，是否相关等。

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
 * Objects
 */
const object1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);

const object3 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

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

#### 创建 Raycaster

让我们试试创建，然后是创建光的起点以及它的方向，最后运用到投射器：

```js
/**
 * Raycaster
 */
const ratcaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

ratcaster.set(rayOrigin, rayDirection);
```

当然现在没什么效果，因为我们还没开始投射。

#### 投射光线

我们有两种方式投射方式，就是一个测试单个对象或测试多个对象：

```js
const intersect = ratcaster.intersectObject(object2);
console.log(intersect);
const intersects = ratcaster.intersectObjects([object1, object2, object3]);
console.log(intersects);
```

当然你会发现单个对象输出也是数组，因为有可能你会多次穿过同一个物体。

`intersect`的参数结果如下：

- distance：离光线起点的距离长度
- face：立方体面向光线的朝向
- faceIndex：面向的索引
- object：立方体网格对象
- point：交点处
- uv：uv 坐标

#### 移动的物体投射

如果物体是随时移动的，那么光线投射器就需要在每个 tick 中重新获取：

```js
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Animate objects
	object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
	object2.position.y = Math.sin(elapsedTime * 0.4) * 1.5;
	object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

	// Cast a ray
	const rayOrigin = new THREE.Vector3(-3, 0, 0);
	const rayDirection = new THREE.Vector3(1, 0, 0);
	rayDirection.normalize();

	ratcaster.set(rayOrigin, rayDirection);

	const objectsToTest = [object1, object2, object3];
	const intersects = ratcaster.intersectObjects(objectsToTest);
	console.log(intersects);

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};
```

这样就能获取到与光线相交的物体，我们将相交的涂成蓝色，没有的就红色：

```js
for (const object of objectsToTest) {
	object.material.color.set('#ff0000');
}

for (const intersect of intersects) {
	intersect.object.material.color.set('#0000ff');
}
```

可以看到相交的就变成蓝色了：

![image-20250216225608784](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250216225608784.png)

#### 测试鼠标悬停

让我们注释之前的光线投射器代码，让我们测试鼠标是否在物体上：

```js
/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / sizes.width) * 2 - 1;
	mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});
```

先获取鼠标位置，然后去 tick 中：

```js
const tick = () => {
	//...
	ratcaster.setFromCamera(mouse, camera);

	const objectsToTest = [object1, object2, object3];
	const intersects = ratcaster.intersectObjects(objectsToTest);

	for (const object of objectsToTest) {
		object.material.color.set('#ff0000');
	}
	for (const intersect of intersects) {
		intersect.object.material.color.set('#0000ff');
	}
	//...
};
```

这样鼠标悬停时就会变蓝，离开就变红色：

![image-20250216230733482](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250216230733482.png)

如果你只想测试最近的，它是按距离排序的，所以可以根据这个来操作。

#### 测试是否有悬停

我们可以测试一下是否有悬停，通过比对之前和现在的 intersect：

```js
let currentIntersect = null;
const tick = () => {
	//...
	if (intersects.length) {
		if (!currentIntersect) {
			console.log('mouse enter');
		}
		currentIntersect = intersects[0];
	} else {
		if (currentIntersect) {
			console.log('mouse leave');
		}
		currentIntersect = null;
	}
	//...
};
```

这样鼠标悬停移入移出的时候就可以监听到了。

#### 鼠标点击事件

接下来我们测试鼠标的点击事件：

```js
window.addEventListener('click', () => {
	if (currentIntersect) {
		console.log('click on a sphere');
	}
});
```

这样只有在点击到球体的时候才会输出，是不是很像一个射击游戏。

如果你想知道是哪个球体被点击，也很简单：

```js
window.addEventListener('click', () => {
	if (currentIntersect) {
		switch (currentIntersect.object) {
			case object1:
				console.log('click on object 1');
				break;
			case object2:
				console.log('click on object 2');
				break;
			case object3:
				console.log('click on object 3');
				break;
		}
	}
});
```

#### 模型测试

我们刚刚用的都是网格，接下来我们换成模型，其实也没差别：

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//...
/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
	gltf.scene.position.y = -1.2;
	scene.add(gltf.scene);
});
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);
```

接下来就是，鼠标悬停时，鸭子变大，离开鸭子变小，在 tick 中，先获取：

```js
const modelIntersects = ratcaster.intersectObject(gltf.scene);
```

当然会发现问题，首先是 gltf 不在作用域，其次是 gltf 加载会耗时，因此我们需要解决：

```js
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/Duck/glTF-Binary/Duck.glb', (gltf) => {
	model = gltf.scene;
	model.position.y = -1.2;
	scene.add(model);
});
//...
const tick = () => {
	//...
	if (model) {
		const modelIntersects = ratcaster.intersectObject(model);
	}
	//...
};
```

注意我们使用了单个对象，因为模型是一个组，这两个方法都会默认调用递归来访问子元素，因此不需要担心获取不到网格，你还可以通过第二个参数控制递归是否开启。

接下来就是改变鸭子的缩放：

```js
if (model) {
	const modelIntersects = ratcaster.intersectObject(model);
	if (modelIntersects.length) {
		model.scale.set(1.2, 1.2, 1.2);
	} else {
		model.scale.set(1, 1, 1);
	}
}
```

这样悬停的时候就会变大，离开就会变小。
