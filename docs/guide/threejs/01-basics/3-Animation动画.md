### Animation 动画

在 threejs 中想要实现动画，一般需要通过配合帧的绘制，我们可以通过浏览器的`requestAnimationFrame`来实现：

```js
const tick = () => {
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

然后在`tick`函数中来改变上面物体的对象来实现动画，一般有 2 种方式

#### Clock 方式

通过 three 自带的`Clock`可以获取过去了多少时间，从而实现动画：

```js
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// 更新对象
	mesh.rotation.y = elapsedTime * Math.PI;
	// 	mesh.position.x = Math.sin(elapsedTime);
	// 	mesh.position.y = Math.cos(elapsedTime);
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

#### gsap 库

另一种就是不自己计算，通过`gasp`库，但每帧绘制也要重新 render

通过`npm i gasp`下载库，然后如下：

```js
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
const tick = () => {
	// 渲染更新
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};
tick();
```

当然通过`Date.now()`计算也可以，不过比较麻烦就不推荐了。
