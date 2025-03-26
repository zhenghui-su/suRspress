### Materials 材质

材质其实就是给几何体的每个可见像素上色，如果像素不可见它就不会工作。决定材质颜色的是通过着色器，目前我们只需要了解 Three 自带的着色器，无需自己编写。

#### 初始化

让我们将项目回到最开始，红色立方体也不需要，我们要从头创建网格和材质等：

```js
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update size
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	// Update Renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
const tick = () => {
	// Update Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

#### 创建基础

回到初始，然后创建材质和一个球体、一个平面和一个圆环：

```js
const material = new THREE.MeshBasicMaterial();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 16, 32),
	material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);
```

保存后查看如下：

![image-20250131195710812](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131195710812.png)

我们只用了一个材质，因此改变它就能改变所有，默认白色。

#### 添加动画

接下来我们添加上动画：

```js
const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update Objects
	sphere.rotation.y = 0.1 * elapsedTime;
	plane.rotation.y = 0.1 * elapsedTime;
	torus.rotation.y = 0.1 * elapsedTime;

	sphere.rotation.x = 0.15 * elapsedTime;
	plane.rotation.x = 0.15 * elapsedTime;
	torus.rotation.x = 0.15 * elapsedTime;

	// Update Controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
```

#### 加载纹理

接下来加上纹理：

```js
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
	'textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg');
```

#### 加载 matcap 和 gradient 纹理

```js
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
```

#### MeshBasicMaterial 网格基础材质

显然`MeshBasicMaterial`是最基础的材质，不过还需介绍属性：

- `color`：颜色，传入字符串或颜色
- `map`：纹理，传入 Texture
- `wireframe`：线框模式，传入布尔值
- `transparent`：允许透明，传入布尔值
- `opacity`：透明度，需要设置`transparent`为 true
- `alphaMap`：设置`alpha`透明材质，也需设置允许透明
- `side`：侧面属性，允许三个值
  - `THREE.FrontSide`：默认值，能看到前侧
  - `THREE.BackSide`：能看到后侧
  - `THREE.DoubleSide`：前后都可以看到

#### MeshNormalMaterial 网格法线材质

接下来是网格法线材质，法线是信息，包含面向的方向等信息

```js
const material = new THREE.MeshNormalMaterial();
```

为什么需要法线，这和光的反射，散色有关，当你需要光照射这个物体的时候，它们之间的结果需要通过它来确定。

网格法线材质和基础材质属性差不多，新增一个属性：

- `flatShading`：是否使用平面着色，传入布尔值

效果如下，会看到渲染在上面的是一个个平面

![image-20250131202638621](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131202638621.png)

网格法线材质一般用于调试法线纹理，可以直接看到法线纹理的效果，当然也可以直接使用，如果你喜欢这个颜色。

#### MeshMatcapMaterial 网格自由材质

`MeshMatcapMaterial`会利用法线作为参照，从纹理中选取正确的颜色：

```js
const material = new THREE.MeshMatcapMaterial({
	matcap: matcapTexture,
});
```

对比一下，这两个基本颜色是一样的：

![image-20250131203100979](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131203100979.png)

这样我们模拟阴影和光，即便场景中无光。

当然，我们可以通过[matcaps](https://github.com/nidorx/matcaps)开源项目找到很多材质球，不过确保使用它们时有相应许可，或者可以自己使用 3D 软件制作。

#### MeshDepthMaterial 网格深度材质

`MeshDepthMaterial`如果靠近相机近点，它会将几何体涂抹成白色，如果靠远一些就会变黑，如下：

![image-20250131203741334](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131203741334.png)

这非常适合做一些雾效或预处理，这可以做出类似寂静岭的效果。

#### Lights

后面我们会专门讲述光源，本节我们只需简单添加环境光：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
```

刷新后看不到变化，因为光不对深度材质起作用，我们换一个材质

#### MeshLambertMaterial 网格朗伯材质

`MeshLambertMaterial`是一个对光有反应的材质：

```js
const material = new THREE.MeshLambertMaterial();
```

当我们运用它后，查看就会发现几何体被点亮了：

![image-20250131204716574](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131204716574.png)

当然我们有一些新特性和光有关，不过不急，我们有更多的材质。

`MeshLambertMaterial`确实不错，不过拉近线条有点模糊

#### MeshPhongMaterial 网格冯氏材质

它和上面的差不多一样，不过刚刚的线条模糊就消失了，而且更加亮了，还会发现光反射：

```js
const material = new THREE.MeshPhongMaterial();
```

它唯一的缺点是性能不如`MeshLambertMaterial`，不过物体较小的时候性能不是问题。

###### shininess

它还有新属性`shininess`：材质的光泽度。

```js
material.shininess = 1000;
```

保存会发现更加亮了，他会增加光反射：

![image-20250131222200230](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222200230.png)

##### specular

你还可以改变它的高亮，它和颜色一样，必须是三色：

```js
material.specular = new THREE.Color(0xff0000);
```

保存会发现红色的光反射：

![image-20250131222425941](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222425941.png)

#### MeshToonMaterial 网格卡通材质

顾名思义，它是卡通风格的，可以直接用：

```js
const material = new THREE.MeshToonMaterial();
```

保存查看，立方体变成卡通风格的：

![image-20250131222632378](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131222632378.png)

##### 渐变控制

我们可以通过渐变控制它：

```js
material.gradientMap = gradientTexture;
```

保存查看会发现没有卡通风格了，因为我们的纹理很小，所以 MIP 映射会出现问题，解决的方法就是之前讲过的使用最近邻滤镜：

```js
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;
```

重新查看：

![image-20250131223531663](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131223531663.png)

#### MeshStandardMaterial 网格标准材质

网格标准材质经常使用，它支持光反应，且更逼真，遵循 PBR 规则，可以调整粗糙度和金属度，两个属性的范围为 0-1：

```js
const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0.65;
```

保存查看：

![image-20250131223919781](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131223919781.png)

当然它也支持纹理`map`，这里就不贴图了。

```js
material.map = doorColorTexture;
```

##### Debug UI

属性调整不容易方便我们调试，我们创建一个 Debug UI：

```js
import GUI from 'lil-gui';

const gui = new GUI();

// ...在Material之后
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
```

##### aoMap

它也支持环境遮蔽纹理，它可以增加阴影效果，但支持它需要提供另一组 UV 坐标：

```js
material.aoMap = doorAmbientOcclusionTexture;
sphere.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
```

这样看起来缝隙处有着阴影更加逼真：

![image-20250131225654046](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131225654046.png)

我们可以设置 ao 映射强度，并放入到 Debug UI：

```js
material.aoMapIntensity = 1;

gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
```

![image-20250131230021055](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230021055.png)

##### displacementMap 置换贴图

我们还可以设置置换贴图其实就是位移或高度纹理：

```js
material.displacementMap = doorHeightTexture;
```

当然看起来很乱，我们慢慢修正：

![image-20250131230253683](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230253683.png)

首先因为我们的顶点不够，所以有些没有顶起来：

```js
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
	new THREE.TorusGeometry(0.3, 0.2, 64, 128),
	material
);
```

然后这个效果太强了，我们需要减少一些：

```js
material.displacementScale = 0.05;
```

通过这个属性调整后，能看到一些凸起：

![image-20250131230658884](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131230658884.png)

可以放入 Debug UI 慢慢调试：

```js
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
```

##### metalnessMap 和 roughnessMap

金属度和粗糙度纹理也可以加载：

```js
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
```

记得把上面的属性注释了，它们会相互影响。

##### normalMap 法线贴图

法线纹理自然也可以加载：

```js
material.normalMap = doorNormalTexture;
```

质感不错很逼真：

![image-20250131231224825](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131231224825.png)

还可以调整法线比例：

```js
material.normalScale.set(0.5, 0.5);
```

##### alphaMap 透明度贴图

我们还可以加载透明度纹理：

```js
material.transparent = true; // 前置
material.alphaMap = doorAlphaTexture;
```

看起来不错：

![image-20250131231633053](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131231633053.png)

#### MeshPhysicalMaterial 网格物理材质

它和标准材质基本一样，但增加了一层透明图层，更加逼真。

看你的项目需要，如果不需要不建议使用它，性能压力高。

#### PointsMaterial 点材质

点材质后续会有专门的章节讲解，现在不急

#### ShaderMaterial 和 RawShaderMaterial

着色器材质和原始着色器材质会在专门的着色器章节讲解，但需要创建自己的材质的时候使用

#### EnvironmentMap 环境贴图

现在我们可以使用一个很酷的东西，环境贴图，它可以提供场景外的贴图，既可以给光亮也可以反射，我们可以使用一下。

我们首先把材质的都注释，只保留金属度和粗糙度：

```js
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
```

加载环境贴图方法很多，Three 支持立方体环境贴图，我们需要通过`CubeTextureLoader`加载立方体纹理：

```js
const cubeTextureLoader = new THREE.CubeTextureLoader();
// ...
const environmentMapTexture = cubeTextureLoader.load([
	'textures/environmentMaps/0/px.jpg', // 正x
	'textures/environmentMaps/0/nx.jpg', // 负x
	'textures/environmentMaps/0/py.jpg', // 正y
	'textures/environmentMaps/0/ny.jpg', // 负y
	'textures/environmentMaps/0/pz.jpg', // 正z
	'textures/environmentMaps/0/nz.jpg', // 负z
]);
```

然后给材质的`envMap`属性赋值它即可使用：

```js
material.envMap = environmentMapTexture;
```

Debug UI 调整一下粗糙度可以直接看到环境反射到立方体上：

![image-20250131232919265](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131232919265.png)

当然如何寻找环境贴图，首先除非是个人项目否则确保你可以商用，你可以通过如[Poly Haven](https://polyhaven.com/)寻找然后下载：

![image-20250131233357584](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233357584.png)

下载后它是一张环境，而我们之前是立方体的 6 个贴图，然后你可以通过[HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap)这个来上传贴图，它可以将其变为立方体贴图：

![image-20250131233700727](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233700727.png)

点击 save 即可保存下载，选择一下方向即可：

![image-20250131233824655](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250131233824655.png)

本节材质就到这里了
