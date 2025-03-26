### Debug UI

我们创建物体的时候，会有很多数值需要调整，如果每次自己调整然后去查看浏览器，这样会比较麻烦且费劲。

我们可以使用一些调试 UI 工具，帮助我们快速调整属性，下面列出一些：

- dat.GUI => 已经不在更新，可替换为 lil-gui
- control-panel
- ControlKit
- Guify
- Oui

下面我们使用 lil-gui，它可以帮助我们快速找到场景的属性值，如相机的位置，调整方向，颜色等等。

将之前的项目还原到初始，然后记得安装`gsap`库和` lil-gui`库：

```js
npm i gsap lil-gui
```

#### 初始化 gui

在项目中引入，并初始化：

```js
import GUI from 'lil-gui';

/**
 * GUI
 */
const gui = new GUI();
```

保存，随后就会看到右上角出现一个东西：

![image-20250131131853659](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131131853659.png)

目前它还是空的，但我们可以往里面添加很多东西，然后进行微调

#### 添加 mesh 的 y 轴

我们先添加网格的 position 的 y 轴：

```js
// Debug
gui.add(mesh.position, 'y');
```

然后页面上右上角就会出现这个属性，我们可以输入改变值：

![image-20250131132507069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131132507069.png)

但输入数字不是很实用，因此我们可以调整为最小和最大数值并设置 step：

```js
gui.add(mesh.position, 'y', -1, 1, 0.01);
```

这样调整的时候就可以拖动改变，可以更加精细的调整：

![image-20250131132722737](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131132722737.png)

如果使用`dat.GUI`也一样，只是样式可能不同，我们可以加上另外两个轴

```js
gui.add(mesh.position, 'y', -1, 1, 0.01);
gui.add(mesh.position, 'x', -1, 1, 0.01);
gui.add(mesh.position, 'z', -1, 1, 0.01);
```

![image-20250131133028532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133028532.png)

当然这个也不一定要放到参数，还可以通过方法添加，如下：

```js
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);
```

这样更直观并且后续有些方法可以链式调用，因为有些不能放进 add 中

#### 控制属性的名字

目前这个属性在 Debug UI 上就叫 y，我们可以通过 name 方法改变名字：

```js
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
```

这样上面显示的就是这个了：

![image-20250131133606672](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133606672.png)

#### 控制布尔值

我们还可以控制布尔值，mesh 上有一个 visible 可见的布尔值属性：

```js
gui.add(mesh, 'visible');
```

然后你会看到一个 checkbox，我们如果取消勾选，mesh 就不可见了：

![image-20250131133920463](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131133920463.png)

#### 控制线框模式

我们尝试控制一下物体的材质 Material：

```js
gui.add(material, 'wireframe');
// gui.add(mesh.material, 'wireframe'); 这个也可以访问
```

这也是一个布尔值，选择勾选会切换到线框模式：

![image-20250131134112585](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131134112585.png)

#### 控制颜色

控制颜色就不在使用`add`方法了，我们使用`addColor`方法，因为你传如`0x00ff00`的字符串，计算机会认为这是数字，`add`就会认为这是一个区间，所以需要单独的一个方法`addColor`：

```js
gui.addColor(material, 'color');
```

##### 老版本 threejs 问题

请确保 three 的版本是最新的，因为老版本我们访问`material.color`它的结果是一个类，而`addColor`需要传入对象，如果是老版本的 threejs，则需要自己创建一个对象然后将其放入 gui，最后手动更新 material：

```js
// threejs新版本 0.172.0无需查看这段
const parameters = {
	color: 0xff0000,
};
gui.addColor(parameters, 'color').onChange(() => {
	material.color.set(parameters.color);
});
```

新版本 three 无需在意上面的，保存查看，我们可以改变物体的材质颜色：

![image-20250131135132572](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131135132572.png)

#### 控制函数执行

我们还可以给 UI 加上函数执行，记得`add`的第一个参数是一个对象：

```js
const obj = {
	spin: () => {
		gsap.to(mesh.rotation, {
			duration: 1,
			y: mesh.rotation.y + 10,
		});
	},
};
gui.add(obj, 'spin');
```

然后保存，点击右上角的 spin 按钮，物体就会旋转：

![image-20250131135840074](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131135840074.png)

你可以根据需要随时添加属性，建议在写项目的过程中就顺便添加，如果打算在完成之后添加所有，那将会花费更多的时间去查看之前的属性。
