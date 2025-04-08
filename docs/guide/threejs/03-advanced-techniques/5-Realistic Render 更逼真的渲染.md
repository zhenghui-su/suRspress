# Realistic Render 更逼真的渲染

## 初始化

本节我们将学习更逼真的渲染，初始代码如下：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            // Activate shadow here
        }
    })
}

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001)

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Models
 */
// Helmet
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

## ToneMapping 色调映射相关

### toneMapping 映射

首先是色调映射，我们设置一下，同时通过Debug UI来自由选择：

```js
// Tone Mapping
renderer.toneMapping = THREE.ReinhardToneMapping;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
```

可以自由选择，每种的映射看起来都不一样，看起来不错。

我们可以选择`ReinhardToneMapping`，它看起来较为真实。

### toneMappingExposure 曝光度

接下来调整曝光度，顾名思义越大就越亮：

```js
renderer.toneMappingExposure = 3;
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);
```

## Aliasing 锯齿

通常在几何的边缘上很容易出现部分锯齿状，我们要抗锯齿，在很多游戏选项中会看到它。

业内一般分为几个方案：

- Super sampling ：SSAA 超采样，超出画布
- Fullscreen sampling：FSAA 全采样，全屏
- Multi sampling：MSAA 多采样，利用GPU检查邻居是否在里面然后合并

我们来启用它，只需要开启一个选项即可：

```js
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
    antialias: true,
});
```

## 添加光源

然后我们添加一个方向光：

```js
/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(-4, 6.5, 2.5);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity');
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX');
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY');
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('lightZ');
```

## 激活阴影

接下来我们开启阴影：

```js
// Shadows
directionalLight.castShadow = true;
gui.add(directionalLight, 'castShadow');
//...
// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

顺便加一个光源的辅助线：

```js
// Helper
const directionalLightCameraHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);
```

通过这个我们就可以调整部分：

```js
directionalLight.shadow.camera.far = 15;
// ...
// Target
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateWorldMatrix();
```

然后让阴影更清晰：

```js
directionalLight.shadow.mapSize.set(1024, 1024);
```

最后将阴影添加到模型：

```js
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// Activate shadow here
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};
```

## 纹理

然后我们添加一个地面，通过贴图即可：

```js
const textureLoader = new THREE.TextureLoader();
//...
/**
 * Floor
 */
const floorColorTexture = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg'
);
const floorNormalTexture = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.jpg'
);
const floorAORoughnessMatalnessTexture = textureLoader.load(
	'/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg'
);

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(8, 8),
	new THREE.MeshStandardMaterial({
		map: floorColorTexture,
		normalMap: floorNormalTexture,
		aoMap: floorAORoughnessMatalnessTexture,
		roughnessMap: floorAORoughnessMatalnessTexture,
		metalnessMap: floorAORoughnessMatalnessTexture,
	})
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
```

然后是一个墙体，和上面一样：

```js
/**
 * Wall
 */
const wallColorTexture = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg'
);
const wallNormalTexture = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.jpg'
);
const wallAORoughnessMatalnessTexture = textureLoader.load(
	'/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg'
);

const wall = new THREE.Mesh(
	new THREE.PlaneGeometry(8, 8),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		normalMap: wallNormalTexture,
		aoMap: wallAORoughnessMatalnessTexture,
		roughnessMap: wallAORoughnessMatalnessTexture,
		metalnessMap: wallAORoughnessMatalnessTexture,
	})
);
wall.position.y = 4;
wall.position.z = -4;
scene.add(wall);
```

当然墙体会觉得有点发白，这是因为颜色空间，three默认采用线性的，而颜色贴图采用了srgb：

```js
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
```

## 汉堡

我们之前自己制作了一个汉堡模型，用一下：

```js
gltfLoader.load('/models/hamburger.glb', (gltf) => {
	gltf.scene.scale.set(0.4, 0.4, 0.4);
	gltf.scene.position.set(0, 2.5, 0);
	scene.add(gltf.scene);
	updateAllMaterials();
});
```

如果你将环境强度调低，就会看到Shadow acne阴影痤疮：

![image-20250408163450436](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250408163450436.png)

它通常发生在光滑和平坦的表面上，在计算表面是否在阴影的时候很容易出现。

我们可以修复它，通过偏差`bias`修复平面，`normalBias`修复曲面，不过取决于你的场景。

```js
gui.add(directionalLight.shadow, 'bias').min(-0.05).max(0.05).step(0.001);
gui.add(directionalLight.shadow, 'normalBias').min(-0.05).max(0.05).step(0.001);
```

随意调整就会很容易看到变化。