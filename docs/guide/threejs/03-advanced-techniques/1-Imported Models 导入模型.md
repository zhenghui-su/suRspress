### Imported Models 导入模型

接下来聊如何导入外部的模型文件，如 GLTF，后面我们会学习如何自己创建模型。

3D 模型的文件格式有很多，因为加载文件的时候有不同的需要，有些时候需要加密，有些时候需要专门针对某个软件等等，有的格式很轻便但可能会少一些数据，有的格式很大比较全面但可能会导致网站卡顿，有的格式是开源的，有的格式是二进制因此无法修改等等，你还可以自己导出一个格式的数据。

常见的有`OBJ`、`FBX`、`STL`、`PLY`、`COLLADA`、`3DS`、`GLTF`，目前`GLTF`能满足我们大部分的需求，它的发明者同样也是 OpenGL、WebGL 的开发者，因此很适合我们，该格式正在成为一种标准。

它还提供了一些 gltf 的样本模型库：[glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)，你可以免费使用。

#### glTF 的不同形式

##### glTF

glTF 也是有各个形式的，首先是 glTF，它包含三个文件：

- glTF：存储了相机，资源引入等数据
- bin：二进制数据，类似一个带有顶点相关数据的几何体
- png：纹理图片

##### glTF-Binary

它只有一个文件：`glb`格式，它包含了上面的所有数据，它是二进制因此加载更容易，唯一的问题是无法修改数据，比如纹理。

##### glTF-Draco

它和 glTF 差别不大，主要区别是它的大小更加轻便。

##### glTF-Embedded

它也只有一个文件即`gltf`，不过它将纹理和 Buffer 数据直接嵌入到这里了。不过我们一般不使用，它的体积是最大的。

#### 导入鸭子 GLTF

GLTF 是比较真实的模型，因此一般采用 PBR 材质。

接下来我们加载 GLTF，首先是导入 GLTFLoader，需要单独导入：

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
```

然后创建加载器，随后加载：

```js
/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
	'/models/Duck/glTF/duck.gltf',
	(gltf) => {
		console.log('success');
		console.log(gltf);
	},
	(progress) => {
		console.log(progress);
	},
	(error) => {
		console.log(error);
	}
);
```

当然，我们现在用不到后面两个回调，可以删除，然后我们可以看看`gltf`参数：

![image-20250213005643910](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213005643910.png)

- animations：动画相关
- asset：资源相关
- cameras：相机相关
- parser：解析器相关
- scene：单个场景
- scenes：多个场景，这代表你可以导出多个场景，但只有一个文件
- userData：用户数据

`scene`是一个 Group，因此我们可以访问它的 children 即对象组，再查看它的 children 就会发现相机和网格：

![image-20250213010052251](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213010052251.png)

我们找到模型在哪了，我们可以直接添加组内的所有子元素或者直接添加组：

```js
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

成功，看起来很不错：

![image-20250213010455763](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213010455763.png)

当然你还可以试试其他的文件夹的格式，除了 Draco 都是可以的，这个我们后面解释。

#### 导入 FlightHelmet

我们试试另一个模型：

```js
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

你会发现显示不全，可能是眼镜或者别的，我们没有完全的头盔，原因很简单，我们只加载了一部分，这个 gltf 有很多元素，因此我们需要循环添加：

```js
for (const child of gltf.scene.children) {
	scene.add(child);
}
```

好像没问题？不过查看会发现它们是乱的或者少了，这是因为每次添加的时候会自动移除这个场景，解决方法有两个。

首先是`while`然后判断：

```js
while (gltf.scene.children.length) {
	const child = gltf.scene.children[0];
	scene.add(child);
}
```

这样不错，不过有些人不想使用 while，第二个方案是使用新数组而不是使用原来的：

```js
const children = [...gltf.scene.children];
for (const child of children) {
	scene.add(child);
}
```

这两个方法都可以解决，看起来不错：

![image-20250213011454690](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213011454690.png)

当然这是为了练习，我们还可以直接添加，因为`gltf.scene`是一个 Group：

```js
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	scene.add(gltf.scene);
});
```

#### Draco 压缩

让我们回到刚刚的鸭子模型，加载 Draco：

```js
gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
	scene.add(gltf.scene.children[0]);
});
```

会发现报错，因为现在还不支持 Draco，我们需要采用专门的`DRACOLoader`：

```js
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
//...
const dracoLoader = new DRACOLoader();
```

Draco 还支持 WebAssembly 和 Worker，因此我们可以让它更快，找到`node_modules\three\examples\jsm\libs\draco`文件夹复制到静态文件夹，它里面包含了 wasm 文件，这样就会在不同线程中运行。

让我们指定 DracoLoader 的解码路径：

```js
dracoLoader.setDecoderPath('/draco/');
```

当然现在模型还是不能使用，我们需要设置 gltfLoader 的 Draco 加载器：

```js
gltfLoader.setDRACOLoader(dracoLoader);
```

这样就成功导入了，并且加载速度更快体积更小：

![image-20250213012921701](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213012921701.png)

我们使用 DracoLoader 首先需要导入，然后可以使用解码类，使用 Draco 的场景就是如果有大型文件，通过它能够减少很多的体积。

#### 加载动画

gltf 还有一个好处就是可以加载动画，我们加载一个狐狸模型：

```js
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
	scene.add(gltf.scene);
});
```

当然你会发现模型很大，我们需要解决，缩小一下即可：

```js
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
	gltf.scene.scale.set(0.025, 0.025, 0.025);
	scene.add(gltf.scene);
});
```

接下来我们如何处理动画呢？我们查看`gltf.animations`就会看到动画的数据。

我们需要创建动画混合器，它就像一个播放器，将动画的关键帧播放：

```js
let mixer;
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
	mixer = new THREE.AnimationMixer(gltf.scene);
	// 获取动画的动画片段动作
	const action = mixer.clipAction(gltf.animations[0]);
	// 播放
	action.play();

	gltf.scene.scale.set(0.025, 0.025, 0.025);
	scene.add(gltf.scene);
});
```

当然你会发现还不行，这是因为我们需要让他知道要更新，因此到`tick`：

```js
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Update mixer
	if (mixer) {
		// 加载模型需要时间因此需要判断才能更新
		mixer.update(deltaTime);
	}
	//...
};
```

这样狐狸就会播放第一个动画片段，看起来不错。

#### Three.js Editor

最后说一下 Three.js Editor，它是一个在线模型编辑网站，地址：[Editor](https://threejs.org/editor/)

你可以直接导入外部模型，它就像一个小型的 3D 软件，你可以查看等操作：

![image-20250213014647419](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250213014647419.png)

它看起来很棒，你还可以自己创建一些模型然后导出。
