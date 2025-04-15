# Shaders 着色器

本节我们将学习什么是着色器，以及如何创建自己的着色器

## 什么是着色器

如果你不使用任何库，只使用WebGL来会绘制某个几何体，你需要使用着色器。

着色器其实就是一个程序，在Web我们使用GLSL语言来编写，这个程序会发送到GPU，它会为几何体定位并给每个相关的点位绘制。我们需要发送大量数据，如相机位置，顶点颜色，纹理，灯光等，它会通过计算来给对应的地方处理。

着色器有两种：`vertex`顶点着色器和`fragment`片段着色器。

我们通过GLSL发送顶点着色器的数据，GPU会计算它们的定位，然后得到几何体中可见的部分，随后进入片段着色器部分，它会给可见的部分上色。因为片段着色器中没有属性，可以在顶点着色器中传入变量，从而将数据给到片段着色器，可以让它处理。

为什么我们要学习着色器，不能用Three内置的吗？其实很简单，因为Three的材质是有限的，有部分场景是它无法实现的，而自定义着色器可以实现场景，同时可以优化性能。

初始代码：

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

// Material
const material = new THREE.MeshBasicMaterial()

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
```

## RawShaderMaterial

我们可以通过Three的`ShaderMaterial`和`RawShaderMaterial`来创建自己的着色器，不过前者会自动添加一些代码，不过我们先学习后者，编写所有代码来学习。

我们来使用`RawShaderMaterial`：

```js
// Material
const material = new THREE.RawShaderMaterial({
    vertexShader: ``,
    fragmentShader: ``
})
```

我们会在这两个模板字符串中编写，这样可以换行且插入变量：

```js
// Material
const material = new THREE.RawShaderMaterial({
	vertexShader: `
	uniform mat4 projectionMatrix;
	uniform mat4 viewMatrix;
	uniform mat4 modelMatrix;

	attribute vec3 position;

	void main() {
  		gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
	}`,
	fragmentShader: `
	precision mediump float;

	void main() {
  		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
	`,
});
```

保存，就可以看到一个红色的平面了，不过都在字符串中的话，一是没有语法高亮，二是如果出错我们会不知道在哪里，因此我们可以创建文件然后管理：

![image-20250414221448073](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250414221448073.png)

将我们刚刚的内容粘贴到里面，然后可以下载插件用以语法高亮，如插件`Shader languages support for VS Code`和`WebGL GLSL Editor`，给你高亮和语法提示。

随后我们需要在vite中引入它，直接引入肯定是不行的，它会用js的形式读取，我们只需要将其变为字符串，我们可以通过下载vite插件解决，`vite-plugin-glsl`和`vite-plugin-glslify`都可以解决，只是导入语法不同，前者较为活跃。

然后在vite配置中引入插件：

```js
import glslPlugin from 'vite-plugin-glsl'

export default {
	//...
    plugins:
    [
        glslPlugin()
    ],
}
```

随后我们在导入就不会有错了：

```js
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';
//...
const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
});
```

保存查看，效果一样：

![image-20250414224131986](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250414224131986.png)

这样我们可以分离代码，毕竟它是另一种语言，方便维护它。

## glsl语言小基础

GLSL和C语言是很像的，不过它使用GPU计算，因此无法使用打印日志相关，请记住分号很重要，如果少了一个就会报错，它还可以创建变量，需要你指定该变量的类型，并且赋值也必须是该类型，这是一门强类型的语言。

### 基础变量

```glsl
int a = 1;
bool b = true;
float c = 1.0;
```

可以数学运算，不过记住不同类型之间是不能数学运算的，不过可以通过转换来进行：

```glsl
float d = float(a) * c;
```

接下来还有特有的`vec2`二维向量，不能为空，必须提供值，后续通过x和y修改：

```glsl
vec2 foo = vec2(1.0, 2.0);
foo.x = 2.0;
foo.y = 1.0;
foo += 2.0;
```

其他还有`vec3`，三维使用r、g、b修改，还可以通过传入`vec2`和一个值来创建：

```glsl
vec3 foo = vec3(0.0);
vec3 bar = vec3(1.0, 2.0, 3.0);
bar.r = 4.0;
bar.g = 5.0;
bar.b = 6.0;
vec2 a = vec2(1.0, 2.0);
vec3 b = vec3(a, 3.0);
vec2 c = bar.xy; // xx xy xz yy yx yz zz zx zy
```

还有`vec4`，差不多，就不细讲了：

```glsl
vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
vec4 bar = vec4(foo.zx, vec2(5.0, 6.0));
```

上面还有很多代码如`mat4`等，我们先不深入讲解。

### 函数

我们还可以在glsl中创建函数，很容易：

```glsl
float fn(float a, float b) {
  return a + b;
}
float c = fn(1.0, 2.0);
```

glsl还有很多经典的运算，如`sin`、`cos`、`max`，还有复杂的`reflect`、`dot`等等，我们后续会在了解到。

在学习glsl中，文档是很难找寻的，你可以通过搜索或者ai问询来解决问题。

## Vertex Shader

在知道部分基础概念后，我们来看之前写的顶点着色器代码。

- `void main()`：会被自动调用，因此你的代码中需要有它，它没有返回值。
- `gl_Position`：已经存在的变量，它是一个四维向量，GPU绘制的时候类似一个几何体在里面，我们提供x、y、z三个，随后提供一个视角的值
- `attribute`：这里是坐标属性，这个我们在Three中已经知道了
- `uniform`的三个`mat4`：它其实就是矩阵。
  - `modelMatrix`：模型矩阵，位置变换、旋转、缩放都会变为它
  - `viewMatrix`：视图矩阵，即相机矩阵，相机的朝向、视野等都会变为它
  - `projectionMatrix`：投影矩阵，它将坐标转换为最终的裁剪空间坐标从而绘制。

### 分解部分

我们将这个部分分解拆开，这样可以更容易掌握：

```glsl
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
```

将其拆分后我们就可以更好的控制它，比如让它像旗帜飘动后的状态：

```glsl
  modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
```

看起来不错：

![image-20250414232702745](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250414232702745.png)

## Fragment Shader

接下来是片段(片元)着色器的代码：

- `void main()`：和顶点着色器一样，会自动调用

- `precision mediump float`：这个是设定精度，它有三个`highp`、`mediump`和`lowp`，高精度可能会影响性能，低精度可能会引发错误，一般我们使用中等精度

 > 在我们使用ShaderMaterial，它会自动处理这个，因此我们不需要担心它。

- `gl_FragColor`：已存在的变量，简单来说就是上色，需要四维向量，前三个就是RGB，第四个是透明度Alpha，当然如果要调整，记得在材质中设置`transparent`为true

## 添加属性和使用变量

在Three中我们需要通过`setAttribute`来添加属性，如添加一个`aRandom`随机值：

```js
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
	randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
```

然后我们可以将其传入到glsl中，我们通过`attribute`来定义这个值，随后加到z轴：

```glsl
attribute float aRandom;

void main() {
  //...
  modelPosition.z += aRandom * 0.1;
  //...
}
```

这样就会出现随机的效果：

![image-20250415221509067](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250415221509067.png)

接下来让我们给这些地方上色，让其尖刺效果更明显，因此需要通过变量传递，记住Fragment中是无法使用属性的，现在vertex中定义：

```glsl
varying float vRandom;
void main() {
  //...
  vRandom = aRandom;
}
```

接下来在fragment中使用它：

```glsl
precision mediump float;

varying float vRandom;

void main() {
  gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
}
```

直接使用即可，保存即可查看效果，你可以随意调整：

![image-20250415221925651](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250415221925651.png)

## 统一uniform

将代码回到原本旗帜的状态，我们通过three可以定义一个统一的uniform：

```js
const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
	transparent: true,
	uniforms: {
		uFrequency: { value: 10 },
	},
});
```

然后我们可以在glsl中获取：

```glsl
uniform float uFrequency;
void main() {
  //...
  modelPosition.z += sin(modelPosition.x * uFrequency) * 0.1;
}
```

不过我们想要调整多个，因此可以传如Vector2：

```js
const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
	transparent: true,
	uniforms: {
		uFrequency: { value: new THREE.Vector2(10, 5) },
	},
});
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');
```

然后在glsl中：

```glsl
uniform vec2 uFrequency;
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.1;
    //...
}
```

我们再添加一个：

```js
const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
	transparent: true,
	uniforms: {
		uFrequency: { value: new THREE.Vector2(10, 5) },
		uTime: { value: 0 },
	},
});
//...
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	material.uniforms.uTime.value = elapsedTime;
    //...
}
```

然后获取：

```glsl
uniform float uTime;
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
	//...
}
```

这样旗帜就会有飘动的感觉了。这个场景如果不使用自定义着色器实现还是比较困难的

然后我们接下来传递一个颜色：

```js
		uColor: { value: new THREE.Color('orange') }
//...
```

在片段的glsl使用：

```glsl
precision mediump float;
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}
```

这样就可以变为橙色了：

![image-20250415224853516](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250415224853516.png)

## 添加纹理

接下来添加纹理，加载一下：

```js
const flagTexure = textureLoader.load('/textures/flag-french.jpg')
//...
		uTexture: { value: flagTexure }
```

然后在片段的glsl中去使用

```glsl
uniform sampler2D uTexture;
void main() {
    // todo
  vec4 textureColor = texture2D(uTexture, )
  gl_FragColor = vec4(uColor, 1.0);
}
```

其中引入纹理是使用`sampler2D`，然后创建纹理颜色通过`texture2D`，第一个参数是纹理，第二个参数是你要取的纹理位置，一般就是uv坐标，但目前在片段着色器我们无法访问属性，因此需要在顶点那定义变量：

```glsl
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
}
```

然后在fragment中使用，这样就不会报错了：

```glsl
precision mediump float;
uniform sampler2D uTexture;
varying vec2 vUv;
void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = textureColor;
}
```

然后就能看到纹理效果了，看起来不错：

![image-20250415225824669](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250415225824669.png)

## 添加阴影

接下来我们加点阴影，让其更有立体感，先在vertex中操作：

```glsl
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
// attribute float aRandom;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
 
  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;

  // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  // modelPosition.z += aRandom * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
  // vRandom = aRandom;
}
```

然后在fragment中使用：

```glsl
precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;
// varying float vRandom;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = textureColor;
}
```

这样靠近就会明亮，离远就会有阴影：

![image-20250415230254189](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250415230254189.png)

## ShaderMaterial

接下来我们来看看`ShaderMaterial`，他其实就是预置了一部分的必要代码，我们替换一下试试：

```js
const material = new THREE.ShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
	transparent: true,
	uniforms: {
		uFrequency: { value: new THREE.Vector2(10, 5) },
		uTime: { value: 0 },
		uColor: { value: new THREE.Color('orange') },
		uTexture: { value: flagTexure },
	},
});
```

现在肯定会报错，我们需要去掉一些重复代码：

```glsl
// vertex中
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// attribute vec3 position;
// attribute vec2 uv;

// fragment中, 这个不去掉也不会报错, 不过它自带了也可以去掉
// precision mediump float;
```

效果是一样的，`ShaderMaterial`就是预置了这部分代码。

最后，在写着色器代码要多观察控制台报错，Three和WebGL提供了不错的报错机制，大部分情况你都可以定位到是哪里出现了错误。