### Cameras 相机

本小节讲下相机，上面我们用的都是透视型相机，具体参数如下：

```js
/**
 * PerspectiveCamera 透视型相机
 * @param 1. Field of View (FOV) 视野角度 越大物体显示越小 一般推荐45 - 75
 * @param 2. Aspect Ratio 宽高比
 * @param 3. Near Plane 近平面 一般0.1 默认1
 * @param 4. Far Plane 远平面 一般100 默认 1000
 * 近距和远距不要过于极端，在后续与其他物体合一起容易出bug
 **/
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
```

然后我们可以看看另一种正交型相机：

```js
/**
 * OrthographicCamera 正交型相机
 * @param 1. Left 左边界
 * @param 2. Right 右边界
 * @param 3. Top 上边界
 * @param 4. Bottom 下边界
 * @param 5. Near Plane 近平面 一般0.1 默认1
 * @param 6. Far Plane 远平面 一般100 默认 1000
 * 它是一个方形渲染, 因此会受到物体Sizes的影响, 比如x或y轴被压缩
 * 解决方法是保持宽高比
 */
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
	-1 * aspectRatio, // left
	1 * aspectRatio, // right
	1, // top
	-1, // bottom
	0.1, // near plane
	100 // far plane
);
```

#### 瞄向

创建了相机，我们如何控制它瞄向某个点呢？通过`lookAt`，我们可以让他瞄准网格

```js
camera.lookAt(mesh.position);
```

#### 控制器-小例子

我们可以先通过监听鼠标移动获取到鼠标坐标：

```js
const cursor = {
	x: 0,
	y: 0,
};
window.addEventListener('mousemove', (event) => {
	// -0.5 用于靠左值为-0.5 靠右为0.5
	cursor.x = event.clientX / sizes.width - 0.5;
	// 在threejs中y轴认为向上, 因此前面加个负号
	cursor.y = -(event.clientY / sizes.height - 0.5);
});
```

然后通过控制器 Controls 来控制，控制器就是用于控制 camera 相机的，我们可以拖动等，比如让最终位置的 y 坐标为 1，注意控制器需要单独引入：

```js
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// 控制器 Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 1;
controls.update(); // 修改后需要update更新
```

还可以添加一个阻尼效果：

```js
// 阻尼效果 - 下面的tick每一帧需要更新控制器
controls.enableDamping = true;
// ...
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update objects
	// mesh.rotation.y = elapsedTime;

	// Update camera
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = cursor.y * 5;
	// camera.lookAt(mesh.position);

	// 控制器更新
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

这样就可以拖动查看整个立方体，上面中注释的是一个小例子，让 camera 可以一直改变位置，这样看起来物品就旋转起来了，它是通过我们获取的 cursor 对象值来实现。
