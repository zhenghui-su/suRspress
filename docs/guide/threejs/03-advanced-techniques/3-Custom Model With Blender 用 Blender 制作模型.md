### Custom Model With Blender 用 Blender 制作模型

本节我们学习如何用 Blender 制作自己的模型，官网下载：[blender](https://www.blender.org/download/)

当然还有许多 3D 软件，如 C4D，我们选择 Blender 首先是因为它免费，性能不错，文件体积很小，支持大多数操作系统，社区庞大，操作简单等原因。

打开后根据所需设置，可以调整中文，然后界面 UI 如下：

![image-20250217150031976](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217150031976.png)

我们分几个区域：

- 3D 视图区域：中间的模型展示区
- 时间轴：下面的时间轴一般用于制作动画
- 大纲区域：右上方的模型大纲
- 属性区域：模型的具体属性

#### 创建 3D 视图和区域

点击左下角的小图标创建一个新的 3D 视图：

![image-20250217150805019](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217150805019.png)

接下来就是创建新区域，首先分割现有的区域，将鼠标移动到区域最左边，看到光标切割

![image-20250217151126857](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151126857.png)

当然还可以分割出更多，还可以垂直分割，随意发挥：

![image-20250217151412762](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151412762.png)

然后我们将几个区域合并，只需要在区域的边角拖动，方向朝要减除的区域即可：

![image-20250217151748106](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217151748106.png)

#### 控制视图

##### 旋转、放大、平移

你可以通过按下鼠标中键即按下滚轮拖动来控制围绕视点旋转，还可以通过 Shift+滚动来平移视图，还可以滚动来放大缩小视图，通过它我们就能找到适合的角度，自己试试。

你还可以通过这里来控制它们：

![image-20250217153230461](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217153230461.png)

你有可能遇到无法放大的问题，这是因为视角的原因导致，如下：

![image-20250217153610743](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217153610743.png)

通过 ctrl+shift+鼠标中键按下即可无限制移动，即可解决视角问题。

##### 视图导航

你可以通过 shift+反引号即`符号进入视图导航，还可以通过左上角编辑-偏好设置-键盘映射，随后搜索视图导航，更改你想要的快捷方式：

![image-20250217154324195](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154324195.png)

启动它有点像第一人称一样，光标如下，退出只需左键按一下即可：

![image-20250217154535596](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154535596.png)

在这个模式下，还可以通过方向键来放大缩小平移。

##### 视图相机切换

你可以通过小键盘上的 5 来切换一下模式，查看左上角，这样就不是透视视图了：

![image-20250217154938285](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217154938285.png)

##### 特定轴

我们可以通过小键盘 1、3、7 分别控制相机放到 Y、X、Z 轴上，通过 Ctrl+数字可以控制放到相反的对应轴上，你也可以点击右上角小图标的字符切换：

![image-20250217155940857](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217155940857.png)

值得注意的是在 Blender 中默认是 Z 轴朝上的，不用担心，这可以随意改变。

##### 摄像机视角

通过小键盘的 0 可以切换到摄像机视角，来看看自己的模型怎么样：

![image-20250217160134153](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160134153.png)

##### 重置

如果你控制视图后找不到原来的模型了，通过 Shift+C 即可重置，对准场景：

![image-20250217160306580](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160306580.png)

##### 聚焦

你可能会遇到需要聚焦某个东西，先点击该东西，然后按下小键盘的句号即可聚集：

![image-20250217160446896](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160446896.png)

这里不局限于物体模型，还可以是光源等。

##### 关注并隐藏其他

如果你只想关注某个物体，而不想看别的，点击它然后按下斜杠即除号：

![image-20250217160935181](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217160935181.png)

会发现光源和小物体都没了。

#### 控制物体

你可以点击某个物体选中它，也可以通过 Shift+点击选中多个物体，会有颜色轮廓：

![image-20250217161334544](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217161334544.png)

你还可以重复 Shift+点击来取消刚刚的选中。

当你点击某个物体，然后不小心再点击选错，通过 Ctrl+Z 来撤销之前的操作。

如果要选中所有，通过键盘 A 键即 All 即可选中所有物体，再按就是取消选中。

你还可以通过按 B 来画框选中，或者按 C 来画圆选中物体，圆通过滚轮控制大小。

#### 控制物体对象

##### 创建物体

让我们创建物体，首先是鼠标在视图区域，然后 Shift+A 创建：

![image-20250217162306694](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162306694.png)

选择 UV 球即经纬球，被立方体挡住了。

##### 删除物体

我们点击立方体，然后按 X 去除它：

![image-20250217162451030](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162451030.png)

##### 创建属性控制

在创建的时候，左下角会出现控制这个球体的属性：

![image-20250217162617090](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217162617090.png)

通过它来修改球的各项东西，如果找不到可以按下 F9 来显示它，部分键盘是 Fn+F9。

##### 隐藏物体

上面我们知道通过/来只关注一个，还可以通过 H 键来只隐藏一个物体：

![image-20250217163122284](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217163122284.png)

还可以通过 Alt+H 来显示所有隐藏的物体，有的键盘可能是 Option+H。

要隐藏未选中的对象可以通过 Shift+H，显示就用 Alt+H 即可。

如果发现无法显示物体，可能是键盘冲突，改一下映射或者点击大纲的眼睛即可显示：

![image-20250217164822933](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217164822933.png)

##### 物体调整

选中物体，然后通过左边菜单来控制物体移动，如果没菜单按 T 即可显示：

![image-20250217165005820](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217165005820.png)

这三个分别是移动、旋转、缩放，当然还有快捷键，G 调整位置，R 调整选择，S 调整缩放

如果想精准的沿着某个轴，只需要 G 按下后，然后按下 X、Y、Z 轴对应的字符即可。

如果只想水平运动，不想上下，按下 G 后 Shift+Z 即可排除 Z 轴。

#### 模式选择

现在是物体模式，我们可以移动物体，我们还可以通过左上角来切换不同模式：

![image-20250217212824202](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217212824202.png)

当然还有快捷键 Ctrl + Tab 即可出现一个圆形菜单：

![image-20250217212929101](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217212929101.png)

切换到编辑模式，通过左上角的选择，可以选择顶点、边、面，让物体形状不同：

![image-20250217213621036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217213621036.png)

当然还可以通过键盘的 1、2、3 来选择对应的模式，还可以按 Tab 键退出编辑模式。

#### 物体渲染模式

现在所有的物体都是同样的材质，我们可以通过 Z 键切换到材质预览。现在看不出啥，当我们添加了颜色和纹理的时候就可以显现了。

Z 的模式中也有我们熟悉的线框模式，还有一个特别的渲染模式，让物体更真实：

![image-20250217214607832](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217214607832.png)

#### 属性菜单

右下角的属性区域有很多不同的图标，我们来看看。

首先是物体菜单，选中一个物体，然后点击右下角的图标，通过它们输入更加精准的值：

![image-20250217214920924](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217214920924.png)

下面一个是修改器，可以选择自己喜欢的：

![image-20250217215206245](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217215206245.png)

倒数的第二个是材质，你可以选择自己的材质或创建：

![image-20250217215249958](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217215249958.png)

默认的材质是 BSDF，它遵循 PBR 原则。

切换到渲染模式，然后查看上面，会发现渲染引擎是 EEVEE：

![image-20250217220236551](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217220236551.png)

它的性能不错，也挺真实，另外的 WorkBench 即工作台性能出色，但不真实，Cycles 性能较差，而真实程度最高，因为它能处理光线的反弹，用到光线追踪。

再提一嘴，如果你想渲染，通过 F12 即可渲染，有的需要加上 Fn 键：

![image-20250217221102543](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221102543.png)

点击左上角的图像，里面即可保存图片。

#### 搜索

有些时候你会不知道功能位置，你可以通过 F3 来搜索，这样可以启动各个功能：

![image-20250217221334460](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221334460.png)

#### 保存启动文件

让我们从头，删除所有东西，a 键然后 x 键，然后只创建一个立方体：

![image-20250217221802451](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217221802451.png)

随后添加一个点光源，通过 G 移动它：

![image-20250217222016396](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222016396.png)

然后选中光源，点击右下角的光源设置，调整强度：

![image-20250217222144847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222144847.png)

接着是下面的区域，我想要换成 X 和 Z 轴，还有线框模式：

![image-20250217222307128](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222307128.png)

这样子，我们就可以保存启动文件，下次启动的时候默认就是它：

![image-20250217222410186](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222410186.png)

#### 制作模型

OK，简要的功能都熟悉了，我们开始做模型，做一个汉堡。

##### 单位比例

首先是确保单位比例，我们会发现有很多网格，并且物体属性也显示了米为单位：

![image-20250217222755418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217222755418.png)

不过如果是 cm，blender 里面显示太小了，我们可以把一个单位看为一厘米来做。

当然如果不喜欢 m，通过场景属性就可以更改为自适应，和 Three 一样：

![image-20250217223036596](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223036596.png)

##### 底部面包

做一个汉堡的底部面包，删除立方体，然后创建圆柱体，调整缩放：

![image-20250217223503037](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223503037.png)

看着不错，不过可以用更好的技巧，回到立方体，然后进入编辑模式来缩放：

![image-20250217223707069](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217223707069.png)

我们会发现缩放还是 1:1:1，这样很棒。

接下来使用修改器，添加一个表面细分修改器：

![image-20250217224003772](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224003772.png)

你就会得到类似的球体：

![image-20250217224053464](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224053464.png)

对它右键，让它表面光滑：

![image-20250217224250777](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224250777.png)

可以调整右边的层级增加更多细节：

![image-20250217224334286](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224334286.png)

看起来是圆，如果我们进入编辑模式，就会发现它还是立方体，操作立方体就容易许多了

![image-20250217224806612](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217224806612.png)

选择底面，然后 G 键调整位置底面的 Z 轴：

![image-20250217225043602](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225043602.png)

然后再移动上面的 Z 轴：

![image-20250217225150570](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225150570.png)

接下来我们来增加多边形，通过循环切割，Ctrl + R 键，选中垂直分割，往上移动：

![image-20250217225501947](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225501947.png)

下面可以再平整一些，通过再次 Ctrl + R 来分割：

![image-20250217225651783](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225651783.png)

然后调整一下厚度，有点太厚了：

![image-20250217225854865](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217225854865.png)

看起来不错，我们可以先保存吧，Ctrl + S 或 Command+S 即可：

![image-20250217230222448](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217230222448.png)

##### 肉饼

复制这个物体，Ctrl+C 复制 Ctrl+V 粘贴，然后 G+Z 调整 Z 轴位置：

![image-20250217230918421](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217230918421.png)

然后进入编辑模式微调肉饼，做成你喜欢的样子：

![image-20250217232104291](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232104291.png)

##### 芝士片或者奶酪

下面做芝士片，需要创建平面，调整缩放记得进入编辑缩放，然后调整位置：

![image-20250217232412530](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232412530.png)

现在只有四个顶点，我们添加一下细分：

![image-20250217232456953](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232456953.png)

调整如下：

![image-20250217232635184](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217232635184.png)

然后通过选择边缘角落的顶点，激活比例或衰减编辑，可以按 O 键：

![image-20250217233022280](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233022280.png)

然后使用锐化效果，只在 z 轴让它掉落：

![image-20250217233156973](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233156973.png)

然后移动 Z 轴，随意调整成喜欢的样子：

![image-20250217233830088](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217233830088.png)

右键开启平滑，然后加点厚度，修改器选择实体化，调整高度即可。

##### 顶部面包

接下来就是顶部，复制底部，然后 R 旋转，X 轴固定，然后 Ctrl 旋转会磁性：

![image-20250217234751095](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217234751095.png)

这看起来非常棒！我们可以调整让他更圆：

![image-20250217234925715](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217234925715.png)

##### 添加材质

接下来我们来添加材质，我们加点颜色即可，调整到渲染模式确保灯光足够。

先顶部面包，选择材质，调整颜色和粗糙度：

![image-20250217235741606](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250217235741606.png)

然后是底部的，直接用原来的，然后是肉饼，材质如下：

![image-20250218000122863](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000122863.png)

最后是奶酪片或芝士片：

![image-20250218000233619](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000233619.png)

你可以自己做的好看一些：

![image-20250218000256532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000256532.png)

#### 导出模型

我们做完了，接下来是导出这个模型，注意只选中这个模型，灯光不要选中，然后文件-导出-gltf2：

![image-20250218000539029](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218000539029.png)

导出设置如下：

![image-20250218001142468](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218001142468.png)

压缩可开启或不开启，看你喜好。

然后代码引入：

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
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
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

gltfLoader.load('/models/hamburger.glb', (gltf) => {
	scene.add(gltf.scene);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(50, 50),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5,
	})
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
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
camera.position.set(-8, 4, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
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
let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	if (mixer) {
		mixer.update(deltaTime);
	}

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

看起来很棒，我们就成功自己创建模型了：

![image-20250218001226280](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250218001226280.png)

看起来和软件中颜色不一样，这个东西我们会在后面用更逼真的效果渲染。
