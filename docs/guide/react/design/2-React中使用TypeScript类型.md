# React中使用TypeScript类型

大量的项目都是基于 TypeScript 的，也应运出 tsx 这个文件后缀，我们在构建组件的时候写类型也很重要，本小节我们就学习一下相关的React的类型

先用 create-react-app 构建一个项目，当然也可以用 vite：

```sh
npx create-react-app --template typescript react-ts
```

我们平时用的类型在 `@types/react` 这个包里，cra 已经帮我们引入了。

![image-20240807222428029](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807222428029.png)

## JSX 的类型

平时我们写组件，我们知道这是 JSX，那么 JSX 的类型是什么呢？即组件的类型是什么呢？

```tsx
interface AaaProps {
	name: string;
}

function Aaa(props: AaaProps) {
	return <div>aaa, {props.name}</div>;
}

function App() {
	return (
		<div>
			<Aaa name="su"></Aaa>
		</div>
	);
}

export default App;
```

这个类型如下，大部分情况我们不会写返回值类型，TS 会默认推导出来：

![image-20240807222713073](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807222713073.png)

React 函数组件的默认返回类型就是`JSX.Element`，那我们看一下这个的类型定义

创建一个然后定义这个类型，`Ctrl`点进去看：

```ts
const content: JSX.Element = <div>1</div>
interface Element extends React.ReactElement<any, any> {}
```

可以看到它其实就是`React.ReactElement`，也就是说，如果我们想要描述一个 JSX 类型，用这个即可，比如`Aaa`组件的Props需要传入一个组件进去，怎么表示类型，如下：

```tsx
interface AaaProps {
	name: string;
	content: React.ReactElement;
}

function Aaa(props: AaaProps) {
	return (
		<div>
			{props.name}
			{props.content}
		</div>
	);
}

const content: React.ReactElement = <button>click</button>;

function App() {
	return (
		<div>
			<Aaa name="su" content={content}></Aaa>
		</div>
	);
}

export default App;
```

这样子就可以限制`content`这个prop只能传入 JSX 相关的，我们跑一下：

![image-20240807223437853](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807223437853.png)

也就是说这个就是 JSX 类型，但如果有个场景，我们需要判断是不是传入JSX，有可能传入，有可能不传入传一个`null`或`number`，这时候用`ReactElement`就会报错了：

![image-20240807223620697](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807223620697.png)

固然我们可以用联合类型`|`解决它，但如果多起来，每次都要写非常麻烦，这里就可以使用`ReactNode`类型解决：

![image-20240807223741345](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807223741345.png)

我们点击去看一下，发现其实就是把 TS 的基本类型加`ReactElement`相关变成联合类型了：

![image-20240807223828619](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807223828619.png)

所以我们刚刚讲到了`JSX.Element`、`ReactElement`和`ReactNode`这三个类型

它们的关系即`ReactNode` > `ReactElement` > `JSX.Element`

一般情况下，我们使用`ReactNode`即可描述大部分情况了

## 函数组件的类型

我们知道 JSX 的类型，但函数组件的类型怎么表示，它的类型其实如下：

![image-20240807224201006](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807224201006.png)

函数组件的类型就是`FunctionComponent`，非常语义化，接收的泛型为传入Props的类型

我们点进去看一下源码的类型定义，如下：

![image-20240807224333014](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807224333014.png)

也就是参数为 Props，返回值是 `ReactNode`，符合我们的认知，如果你将源码往上翻一点就会发现一个东西，如下：

![image-20240807224446014](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807224446014.png)

即 `FC` 和 `FunctionComponent` 等价，所以我们写的时候一般会缩写：

```tsx
const Aaa: React.FC<AaaProps> = (props) => {
  return <div>aaa, {props.name}{props.content}</div>
}
```

在 Antd 的组件演示代码中也是这种写法：

![image-20240807224729499](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807224729499.png)

认真的同学还会发现函数组件有几个可选的属性，这个待后面用到了再说

## Hook 的类型

接下来我们过一过 React 中 重要Hook的类型

### useState

先从最常用的`useState`开始，一般来说`useState`可以用推导出的类型：

![image-20240807225110665](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225110665.png)

当然，需要特殊的，也可以手动声明类型，`useState`通过泛型来接收：

![image-20240807225252016](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225252016.png)

### useEffect 和 useLayoutEffect

注意，这两个是**没有类型参数**的，没有它们相关的类型，记住即可

### useRef

`useRef`我们常用来保存`dom`引用或者其他内容，所以它传入的类型也有两种

首先是保存`dom`引用的时候，后面的参数需要传入`null`：

![image-20240807225529625](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225529625.png)

否则如果不传，它会报错：

![image-20240807225637060](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225637060.png)

至于为什么再看一下下面的内容

在保存其他内容的时候，则不能传入`null`，因为`current` 是只读的：

![image-20240807225833709](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225833709.png)

为什么出现这个情况呢？看一下`useRef`即可，点进去，当我们传入`null`时候，返回`RefObject`，而它的`current`是只读的

![image-20240807225919054](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807225919054.png)

![image-20240807230011301](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807230011301.png)

这很合理，因为保存的 `dom` 引用肯定不能改呀。

而不传 `null` 的时候，返回的 `MutableRefObject`，它的 `current` 就可以改了：

![image-20240807230121204](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807230121204.png)

![image-20240807230132448](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807230132448.png)

因为 `ref` 既可以保存 `dom` 引用，又可以保存其他数据，而保存 `dom` 引用又要加上 `readonly`，所以才用`null` 做了个区分。

传 `null` 就是 `dom` 引用，返回 `RefObject`，不传就是其他数据，返回 `MutableRefObject`。它就是一种约定，知道区别就行了。

### useImperativeHandle

我们知道`forwardRef`和`useImperativeHandle`可以向父组件暴露`ref`引用

> 这里插一嘴，React 19 即将废弃 forwardRef，函数组件的第二个参数就是 ref，参考官方文档：[ref as a prop](https://react.dev/blog/2024/04/25/react-19#ref-as-a-prop)

其中`forwardRef` 包裹的组件会额外传入 ref 参数，所以它不是 `FunctionComponent` 类型，而是专门的 `ForwardRefRenderFunction` 类型。

它有两个类型参数，第一个是 `ref` 内容的类型，第二个是 `props` 的类型

![image-20240807230712612](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807230712612.png)

当然这里我们还是外面包裹，大部分是直接包裹`forwardRef`，所以写在 `forwardRef` 上也行：

![image-20240807231011568](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807231011568.png)

而 `useImperativeHanlde` 有两个类型参数，一个是 ref 内容的类型，一个是 ref 内容扩展后的类型。

![image-20240807231206517](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807231206517.png)

不过一般不会写这个，因为传进来的 ref 就已经是有类型的了，直接用默认推导的就行。

### useReducer

`useReducer`这个Hook也比较常用，它可以传一个类型参数，也可以传入两个

当传入一个的时候即`Reducer<x,y>`，x 是 state 的类型，y 是 aciton 的类型

![image-20240807231614623](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807231614623.png)

![image-20240807231713874](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807231713874.png)

而如果传入两个，那么就是传入初始化函数参数的类型，如下：

![image-20240807231923619](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807231923619.png)

### 其余 hook

剩下的 hook 都比较简单，就放一起了

#### useCallback

`useCallback` 的类型参数是传入函数的类型：

![image-20240807232048914](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807232048914.png)

#### useMemo

`useMemo`的类型参数是传入函数的**返回值类型**，注意是返回值：

![image-20240807232229336](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807232229336.png)

#### useContext

`useContext`的类型参数是 Context 内容的类型：

![image-20240807232416147](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807232416147.png)

#### memo

它可以直接用包裹的函数组件的参数类型：

![image-20240807232631225](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807232631225.png)

也可以自己在类型参数中声明：

![image-20240807232744988](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807232744988.png)

这部分的 hook 大部分不需要手动声明，可以默认推导出来

## 参数类型

回过头来，我们再来看传入组件的 props 的类型。

### PropsWithChildren

前面讲过，jsx 类型用 ReactNode，比如刚刚的 content 参数：

![image-20240807233025303](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233025303.png)

如果你不想通过参数传入内容，想要通过 children 传入，比如：

![image-20240807233234092](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233234092.png)

会发现报错，这时候我们需要修改 Aaa 的 children 类型为 ReactNode：

![image-20240807233321405](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233321405.png)

不过我们没有必要自己写，传 children 这种情况太常见了，React 提供了相关类型`PropsWithChildren`：

![image-20240807233451565](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233451565.png)

我们点进去看一下类型定义：

![image-20240807233520622](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233520622.png)

就是在原基础上加上了一个 children 属性，没啥黑魔法

### CSSProperties

有时候组件可以通过 props 传入一些 css 的值，这时候怎么写类型呢？用 `CSSProperties`

比如加一个 color 参数：

![image-20240807233705351](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233705351.png)

也可以不局限 color，比如加一个 styles 参数：

![image-20240807233806897](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807233806897.png)

可以看到，代码提示相关全部正常

## HTMLAttributes

如果你写的组件希望可以当成普通 html 标签一样用，也就是可以传很多 html 的属性作为参数，如何做呢

那可以继承 `HTMLAttributes`：

![image-20240807234107922](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234107922.png)

我们在用的时候就会提示很多 html 的属性

那 `HTMLAttributes` 的类型参数是干嘛的呢？是其中一些 `onClick`、`onMouseMove` 等事件处理函数的类型参数：

![image-20240807234249418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234249418.png)

当然，继承 `HTMLAttributes` 只有 html 通用属性，有些属性是某个标签特有的，这时候可以指定 `FormHTMLAttributes`、`AnchorHTMLAttributes` 等：

比如 a 标签`AnchorHTMLAttributes` ，会有 `href` 属性

![image-20240807234420532](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234420532.png) 

### ComponentProps

继承 html 标签的属性，前面用的是 `HTMLAttributes`，其实也可以用`ComponentProps`，它更加方便和容易理解，比如需要 a 标签的属性：

![image-20240807234625966](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234625966.png)

使用起来更简单，`ComponentProps` 的类型参数是标签名，比如 a、div、form 这些。

## EventHandler

有些时候，我们组件需要传入一些事件处理函数，如何定义类型呢？

这种参数就需要根据情况，规则为`xxxEventHandler`，比如`MouseEventHandler`、`ChangeEventHandler` 等，它的类型参数是元素的类型。

![image-20240807234904861](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234904861.png)

或者自己声明一个函数类型也可以：

![image-20240807234958214](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240807234958214.png)

## 总结

我们把上面内容简单小总结一下，如下：

- **ReactNode**：JSX 的类型，一般用 ReactNode，但要知道 ReactNode、ReactElement、JSX.Element 的关系
- **FunctionComonent**：也可以写 FC，第一个类型参数是 props 的类型
- **useRef 的类型**：传入 null 的时候返回的是 RefObject，current 属性只读，用来存 html 元素；不传 null 返回的是 MutableRefObject，current 属性可以修改，用来存普通对象。
- **ForwardRefRenderFunction**：第一个类型参数是 ref 的类型，第二个类型参数是 props 的类型。forwardRef 和它类型参数一样，也可以写在 forwardRef 上
- **useReducer**：第一个类型参数是 Reducer<data 类型, action 类型>，第二个类型参数是初始化函数的参数类型。
- **PropsWithChildren**：可以用来写有 children 的 props
- **CSSProperties**： css 样式对象的类型
- **HTMLAttributes**：组件可以传入 html 标签的属性，也可以指定具体的 ButtonHTMLAttributes、AnchorHTMLAttributes。
- **ComponentProps**：类型参数传入标签名，效果和 HTMLAttributes 一样
- **EventHandler**：事件处理器的类型