# Vite 与 Ts 的结合

TypeScript 是 Javascript 的一个超集，它能够进行类型标注，检查代码的隐形问题，同时可以进行语法智能提示 (类似之前的 JSDoc )

## 两者比较

我们来个小例子，先用 JSDoc 来做

```js
/**
* 
* @param {{ name: string; age: number }} params
*/
function bar(params) {
    params.name = 'chen';
}
```

在我们标注了JSDoc 之后，我们打`params.`的时候就会有提示，如下：

![image-20240514165618215](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514165618215.png)

接下来我们用 Ts 来做一下：

```typescript
type paramsType = {
  name: string,
  age: number
}

function bar(params: paramsType) {
  params.name = 'chen'
}
```

在我们输入的时候也会有语法提示，两者都差不多

![image-20240514165559432](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514165559432.png)

ts 的好处是他把类型标注提取出来，我们可以单独创建一个类型标注文件，同时易于扩展，JSDoc 毕竟是在注释中不容易扩展

## 使用 Ts

Vite 其实天生支持 TypeScript，参考：[TypeScript](https://cn.vitejs.dev/guide/features.html#typescript)

我们可以直接使用`.ts`文件，但注意的是 Vite 仅执行`.ts`文件的转译，**并不执行** 任何类型检查。并假定类型检查已经被你的 IDE 或构建过程处理了。

> 就是它能用 TS 文件，但 ts 的类型报错等等它不会检测，这和其他静态分析检查，例如 ESLint一样

我们先来看 Ts 的一个好处，不允许不同类型赋值

```typescript
let str: string = "hello";
// 我们假设这个 bar 函数有个很多处理, 最终需要返回字符串
// 但其中有个if 将返回变成了 数字 number, 那是不是不符合我们的需求
// 由于有 ts 的存在, 它就会提示不同的类型不允许返回给你标注红色
function bar(params: string) {
    if(params === "123") {
        return 123;
    }
}
str = bar("123");
```

如下会直接提示你，这就是它的一大好处，保证最终返回的一定是字符串

![image-20240514171543200](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514171543200.png)

如果我们换成 Js，就不会爆红，如果处理很多你可能还找不到问题在哪

Ts 的类型标注，让我们拥有强类型锁定

Ts 还有类型推导，比如上面的`str`，我们不标注 string类型也可以，因为我们给他赋值了一个 string，鼠标悬浮在上面会发现给我们自动推导了类型：

![image-20240514171905250](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514171905250.png)

当然上面的代码，在浏览器还是可以执行的，没有任何输出报错，毕竟 Javascript 允许这么做

有些人不愿意看到爆红，将爆红配置给关了，那这样用 Ts 的意义就没了，我们就需要约束别人

## 类型报错约束

那我们如何让 Ts 的错误直接输出到控制台呢？需要安装一个插件`vite-plugin-checker`

它在官方也有说到，如下

![image-20240514172412061](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514172412061.png)

这是他们官方的示例图，这意味着我们必须解决类型报错才行

![image-20240514172526250](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514172526250.png)

官方文档地址：[vite-plugin-checker](https://vite-plugin-checker.netlify.app/introduction/getting-started.html)

先按照依赖：

```bash
npm i vite-plugin-checker -D
```

然后在配置中使用

```js
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
export default defineConfig({
	plugins: [
		checker({
			typescript: true,
		}),
	],
});
```

运行的时候可能有报错：

![image-20240514174714751](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514174714751.png)

因为这个插件依赖 TypeScript，所以我们需要安装TypeScript：`npm i typescript -D`

然后再运行还会有个报错，说少了`tsconfig.json`文件，这个其实是ts的配置文件，我们可以自己新建

> 或者全局安装ts：`npm insatll typescript -g`，用`tsc --init`来创建

```json
{
  "compilerOptions": {                                   
    "skipLibCheck": true // 跳过node_modules文件夹的检查
  }
}
```

这时候我们在运行，就会发现浏览器直接弹出报错了：

![image-20240514174516800](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514174516800.png)

这是开发环境，我们打包一下看看呢？运行如下，当然package需要配置scripts哦

```bash
npm run build
```

打包过程中，就会给我们提示错误了：

![image-20240514175541546](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514175541546.png)

但这还是打包成功了，我们可以配置一下如果有错误，编译等等都不能进行，就不会生成目录了

参考官方：

![image-20240514175844656](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514175844656.png)

我们配置一下packcge的脚本，让前面的必须走通才能做后面的 build 打包工作

```json
"scripts": {
	"dev": "vite",
	"build": "tsc --noEmit && vite build"
},
```

然后我们再运行，就会发现提示错误并且不会打包成功：

![image-20240514180109009](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514180109009.png)

## 一些报错

我们在使用`import.meta`的时候会报错，提示这个是在高级语法中才能使用，因为 TypeScript 默认用的时候ES的低版本，我们需要改一下`tsconfig.json`的配置

```json
{
	"compilerOptions": {
		"skipLibCheck": true, // 跳过node_modules文件夹的检查
    	"module": "ESNext"
	}
}
```

但当我们用`import.meta.env`，有些时候我们自己定义了`.env`文件，当我们用的时候没有语法提示，这时候就需要配置一下

在 `src` 目录下创建一个 `vite-env.d.ts` 文件，接着按下面这样增加 `ImportMetaEnv` 的定义：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}
```

这样我们在用`import.meta.env.VITE_APP_TITLE`就会有语法提示了

![image-20240514183627041](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240514183627041.png)

这里不多解释这里的含义，因为需要讲到 ts 的东西，只需`///`其实就类似`import`就可以了
