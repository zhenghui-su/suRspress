# Shader Pattern 使用 Shader 绘制

我们绘制图案可以通过纹理，但纹理的问题首先是需要加载，如果加载太多，会导致卡顿，纹理还需要发送到 GPU，也会有延迟，同时需要需要调整图案会比较麻烦。而通过 Shader，我们可以直接在 GPU 中绘制图案，卡顿少同时可以灵活调整。

初始的项目可以从 [Three Journey](https://threejs-journey.com/)的 Shader Pattern 下载
启动后是一个紫色的平面：

![image-20250612000142071](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612000142071.png)

## 在平面上绘制

我们可以通过uv来访问属性，同时可以利用varying将值传递给Fragment片元着色器：

```glsl
// vertex.glsl
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}
// fragment.glsl
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);
}
```

接下来我们通过uv坐标来画出渐变，将其作为颜色的前两个：

```glsl
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```

看起来颜色不错：

![image-20250612001533344](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612001533344.png)

我们将其变成左右黑白渐变，只需要利用uv坐标从0到1的变化：

```glsl
varying vec2 vUv;

void main() {
    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
}
```

![image-20250612001716017](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612001716017.png)

我们提取一下：

```glsl
varying vec2 vUv;

void main() {
    float strength = vUv.x;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

从上白到下黑渐变就是换成uv的y坐标即可。

那如果要上黑下白呢，其实只需要`float strength = 1 - vUv.y;`就可以了，这样就是从1到0变化。

如果只需要一点黑色呢？我们只需要乘一下：

```glsl
varying vec2 vUv;

void main() {
    float strength = vUv.y * 10.0;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612002615704](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612002615704.png)

接下来我们想试试分隔这个平面，分成很多份，可以通过取模：

```glsl
varying vec2 vUv;

void main() {
    float strength = mod(vUv.y * 10.0, 1.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612002839999](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612002839999.png)

然后我们想让它只有1和0，可以通过`if`：

```glsl
varying vec2 vUv;

void main() {
    float strength = mod(vUv.y * 10.0, 1.0);

    if(strength < 0.5) {
        strength = 0.0;
    } else {
        strength = 1.0;
    }
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612003104305](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612003104305.png)

不过我们尽量不使用if，因为条件会影响性能，我们可以使用step来优化性能，当 strength 大于 0.5 返回1，小于返回0，我们可以调整step的值来控制黑色区域的长度：

```glsl
varying vec2 vUv;

void main() {
    float strength = mod(vUv.y * 10.0, 1.0);
    strength = step(0.5, strength);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

修改uv坐标可以控制，那如果要实现棋盘的样子呢？我们将原本的合并一下，只需要在后续加上y轴的处理就可以实现：

```glsl
varying vec2 vUv;

void main() {
    float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

我们还可以相乘，这样只有交点显示：

![image-20250612004639239](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612004639239.png)

## 较难图案

我们试试画个半方框，先画x的条形，然后画y的，最后合并：

```glsl
varying vec2 vUv;

void main() {
    float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    float strength = barX + barY;

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612005207759](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612005207759.png)

然后我们画个+号，其实就是调整一下数值，将其偏移一下：

```glsl
    barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
```

![image-20250612005544847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612005544847.png)

接下来是中间黑色，两边白色，我们可以利用绝对值：

```glsl
varying vec2 vUv;

void main() {
    float strength = abs(vUv.x - 0.5);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612234647112](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612234647112.png)

那如何让这个黑色变成十字黑色呢，并且对角更亮一点点，实际上是使用了最小值判断：

```glsl
varying vec2 vUv;

void main() {
    float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612234917175](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612234917175.png)

我们换成max最大值试试：

```glsl
    float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
```

![image-20250612235027370](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612235027370.png)

我想让这个变化更绝对一些，比如利用step区分出0和1：

```glsl
    float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
```

![image-20250612235245149](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612235245149.png)

我们利用1减去原值得到相反的结果，调整一下值同时合并一下：

```glsl
varying vec2 vUv;

void main() {
    float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float strength = square1 * square2;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612235736950](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612235736950.png)

然后我们还是要弄渐变，不过有层次感，分割，利用floor：

```glsl
varying vec2 vUv;

void main() {
    float strength = floor(vUv.x * 10.0) / 10.0;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250612235943369](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250612235943369.png)

然后是结合一下y轴的渐变：

```glsl
varying vec2 vUv;

void main() {
    float strength = floor(vUv.x * 10.0) / 10.0;
    strength *= floor(vUv.y * 10.0) / 10.0;
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613000107252](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613000107252.png)

## 复杂绘制

然后我们想弄一个类似电视机无信号出现的一堆黑白画面，glsl没有内置的随机值，因此弄一个函数来返回随机的0到1的值，当然这里都是假随机，CPU也无法弄出真随机：

```glsl
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    float strength = random(vUv);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

如果你移动它就会出现效果，类似电视机无信号

![image-20250613000531334](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613000531334.png)

接下来是弄一个类似二维码的东西，其实就是将之前的x、y结合的渐变传给随机数：

```glsl
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    float strength = random(gridUv);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613000848207](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613000848207.png)

我们试试偏移一下，

```glsl
    vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
```

![image-20250613001148157](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613001148157.png)

然后是只想让左下角的地方变黑一些，其他都白，其实很容易，因为uv坐标就是从左下角开始，因此只需要利用长度即可得到：

```glsl
    float strength = length(vUv);
```

![image-20250613001535070](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613001535070.png)

然后是中心黑，其实就是将开始的点0移动到中心，即减去0.5：

```glsl
    float strength = length(vUv - 0.5);
```

![image-20250613001622965](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613001622965.png)

还有方法是计算距离，利用distance计算vUV到0.5点的距离：

```glsl
    float strength = distance(vUv, vec2(0.5));
```

接下来是相反的，即中心是亮的，其实就是用1减去即可：

```glsl
    float strength = 1.0 - distance(vUv, vec2(0.5));
```

![image-20250613002034783](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613002034783.png)

然后是只想要一个中心亮点，我们可以通过很小的值除即可：

```glsl
    float strength = 0.015 / distance(vUv, vec2(0.5));
```

![image-20250613002217920](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613002217920.png)

我们可以拉伸一下这个光源：

```glsl
vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
float strength = 0.015 / distance(lightUv, vec2(0.5));
```

![image-20250613002720296](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613002720296.png)

然后是把这个光源变成一个星星的样子：

```glsl
void main() {
    vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY;

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613003201383](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613003201383.png)

我们试试旋转它？如何做到呢，我们无需手动处理旋转uv，已有前人为我们实现了这个函数：

```glsl
// 围绕指定中心点旋转二维坐标
// @param uv     原始二维坐标点
// @param rotation 旋转角度（弧度制），正值表示逆时针旋转
// @param mid    旋转中心点坐标
// @return vec2  旋转后的新坐标点 
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}
```

然后就可以利用它来旋转，我们用define定义一下π的值：

```glsl
#define PI 3.1415926535897932384626433832795
void main() {
    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5, 0.5));
    vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    float strength = lightX * lightY;

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613004817053](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613004817053.png)

## 圆形相关

之前在平面中间画了一个方形，我们试试画一个圆形：

```glsl
    float strength = step(0.25, distance(vUv, vec2(0.5)));
```

![image-20250613004828294](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613004828294.png)

然后还是利用距离调整一下：

```glsl
    float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
```

![image-20250613004940868](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613004940868.png)

让我们试试加一个step：

```glsl
    float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
```

![image-20250613005459770](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613005459770.png)

接下来就是用1减去，变成相反的结果：

![image-20250613005924266](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613005924266.png)

## 奇怪的图案

接下来我们用到正弦函数，让y的uv坐标产生变化：

```glsl
    vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);

    float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
```

![image-20250613010236346](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613010236346.png)

再试试x轴的变化：

```glsl
    vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
```

![image-20250613010616853](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613010616853.png)

我们试试调高一下值：

```glsl
    vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);
```

![image-20250613010818379](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613010818379.png)

## 角度相关

我们接下来让uv坐标改变一些角度，利用atan：

```glsl
    float angle = atan(vUv.x, vUv.y);
    float strength = angle;
```

![image-20250613011046725](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613011046725.png)

我们试试从中心开始，只需要做个偏移：

```glsl
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
```

![image-20250613011130209](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613011130209.png)

让我们试试旋转一整圈，我们利用一下π：

```glsl
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float strength = angle;
```

![image-20250613011503818](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613011503818.png)

利用angle角度可以做出更酷炫的东西：

```glsl
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    angle *= 20.0;
    angle = mod(angle, 1.0);
    float strength = angle;
```

![image-20250613011657447](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613011657447.png)

换一种变化：

```glsl
    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float strength = sin(angle * 100.0);
```

![image-20250613012551542](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613012551542.png)

接下来是一个圆，但圆的边会随着某个值变化：

```glsl
void main() {

    float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    angle /= PI * 2.0;
    angle += 0.5;
    float sinusoid = sin(angle * 100.0);

    float radius = 0.25 + sinusoid * 0.02;
    float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613013047403](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613013047403.png)

## Perlin Noise

接下来的图案比较奇怪，像是一团水或者污渍，其实它是一种佩林噪声，它可以用来生成自然的形状，比如云、草地等等，你可以找到各类佩林噪声的实现[Perlin Noise](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)，我们使用经典的：

```glsl
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
```

当然现在里面还用到了别的函数permute，我们加上：

```glsl
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
```

现在我们可以调用它了：

```glsl
void main() {
    float strength = cnoise(vUv * 10.0);
    gl_FragColor = vec4(strength, strength, strength, 1.0);
}
```

![image-20250613014127620](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613014127620.png)

我们可以多试试，让里面的白色更明亮，利用step，这里用0是因为Perlin生成的值是从负值到正值的，是不可预期的：

```glsl
    float strength = step(0.0, cnoise(vUv * 10.0));
```

![image-20250613014259597](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613014259597.png)

让我们再试试：

```glsl
    float strength = 1.0 - abs(cnoise(vUv * 10.0));
```

![image-20250613014450079](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613014450079.png)

然后让黑白分明，利用sin，再加上step：

```glsl
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));
```

![image-20250613014720186](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613014720186.png)

接下来我们将最开始的渐变效果应用到上面，实现颜色混合：

```glsl
    float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);
```

![image-20250613015052489](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20250613015052489.png)

不过有些图案会超出边界值，因此我们需要限制一下：

```glsl
    strength = clamp(strength, 0.0, 1.0);
```

你可以将一些常用的图形进行封装，变成函数，方便以后使用，这章我们练习了很多，继续努力。
