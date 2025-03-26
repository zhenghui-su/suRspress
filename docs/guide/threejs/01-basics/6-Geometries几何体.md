### Geometries 几何体

几何体由各个顶点组成，每个顶点都生成了一个粒子，它们之间形成了面。

在顶点中，存储了 position、UV 坐标、法线 Normal 等等你想存储的值。

这只是一个概念，在后续我们会自己生成顶点粒子和各个面，目前只需用内置的几何体。

Three 内置了很多几何体，你可以通过文档查看示例，这边列出一些：

- BoxGeometry 方形几何体
- PlaneGeometry 平面几何体
- CircleGeometry 圆形几何体
- ConeGeometry 圆锥几何体
- CylinderGeometry 圆柱几何体
- RingGeometry 环状几何体
- TorusGeometry 圆形环状几何体
- TorusKnotGeometry 环面结几何体
- DodecahedronGeometry 十二面几何体
- OctahedronGeometry 八面几何体
- Tetrahedron 四面几何体
- SphereGeometry 球形几何体（参数改改可作为行星）
- ShapeGeometry 心形几何体（基于贝塞尔曲线）
- TubeGeometry 管道几何体
- TextGeometry 文字几何体（3D 文字）

当然你可以用这些几何体做出不错的场景，不过大型的还是推荐使用建模软件比较合适

#### 参数

我们还是使用 BoxGeometry 作为例子，我们讲一下参数：

- width：x 轴大小
- height：y 轴大小
- depth：z 轴大小
- widthSegments：x 轴分段
- heightSegments：y 轴分段
- depthSegments：z 轴分段

下面的三个参数是用于控制顶点之间连接形成的面分段形成的三角形，比如设为 2，如下"十字"分段：

![image-20250130170109495](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130170109495.png)

它一般干嘛用，假如我们使用平面几何体创建类似地形的效果，我们想让这个地形上面有效果如高原等，只靠原来的四个顶点不可能实现，因此通过分段，这样这个几何体上就会有很多的顶点，通过移动各个顶点，就会形成很多细节的地形。

我们可以试试效果：

```js
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
```

给材质加上`wireframe`配置，你会看到划分的三角形：

![image-20250130170656638](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130170656638.png)

#### 缓冲几何体 BufferGeometry

在了解 BufferGeometry 之前，我们需要知道如何存储一个几何体，很简单，我们只需要通过存储顶点就知道整个几何体的构成。

因此我们通过`Float32Array`来存储：

```js
const positionsArray = new Float32Array(9);

positionsArray[0] = 0;
positionsArray[1] = 0;
positionsArray[2] = 0;

positionsArray[3] = 0;
positionsArray[4] = 1;
positionsArray[5] = 0;

positionsArray[6] = 1;
positionsArray[7] = 0;
positionsArray[8] = 0;
```

每三个一组，分别对应一个顶点的 x、y、z 数据，总共三个顶点。当然这个代码有点多，我们可以通过直接一个数组：

```js
const positionsArray = new Float32Array([
	0,
	0,
	0, // 第一个顶点
	0,
	1,
	0, // 第二个顶点
	1,
	0,
	0, // 第三个顶点
]);
```

接下来通过`BufferAttribute`创建属性，指定每个顶点接受的值数量：

```js
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
```

接下来就是创建缓冲几何体，将属性发送到该几何体并设置为 position：

```js
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', positionsAttribute);
```

最后我们会呈现出一个三角形：

![image-20250130172329036](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130172329036.png)

上面的设置属性，`position`换成别的就不显示了，因为它最后会被着色器读取，当然这个着色器是 Three 是自己内置的。

当然这只是一个，接下来我们创建多个：

```js
const geometry = new THREE.BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
	positionsArray[i] = (Math.random() - 0.5) * 4;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute('position', positionsAttribute);
```

最后运行如下：

![image-20250130182944690](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130182944690.png)

我们也可以修改 count 的数量，比如 5000：

![image-20250130183043777](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250130183043777.png)
