# 总览 React 状态管理库

该篇以掘金小册《深入浅出 React 状态管理库》参考
请支持正版 [深入浅出 React 状态管理库](https://juejin.cn/book/7311970169411567626?utm_source=course_list)
我们以常见的 React 状态管理库为例来分析，如下表格：

| 库      | GitHub                                                                    | Stars 🌟 | 推出时间 |
| ------- | ------------------------------------------------------------------------- | -------- | -------- |
| Redux   | [github.com/reduxjs/red…](https://github.com/reduxjs/redux)               | 60.6k    | 2012     |
| MobX    | [github.com/mobxjs/mobx](https://github.com/mobxjs/mobx)                  | 27.3k    | 2016     |
| Zustand | [github.com/pmndrs/zust…](https://github.com/pmndrs/zustand)              | 44.1k    | 2017     |
| XState  | [github.com/statelyai/x…](https://github.com/statelyai/xstate)            | 26.5k    | 2017     |
| Recoil  | [github.com/facebookexp…](https://github.com/facebookexperimental/Recoil) | 19.5k    | 2020     |
| Jotai   | [github.com/pmndrs/jota…](https://github.com/pmndrs/jotai)                | 17.7k    | 2021     |
| Valtio  | [github.com/pmndrs/valt…](https://github.com/pmndrs/valtio)               | 8.6k     | 2021     |

我们根据它们的理念可以分类成如下

## 分类

### 中心化模型：Redux

中心化模型指整个应用的状态被存储到一个**单一的、全局的 Store** 中。这种模式下，所有的状态变更都通过这个中心进行管理和分发，确保状态的一致性和可预测性。

优点：

- 可预测性：因为所有状态的操作都通过中心化的 Store 来进行的，所以整个状态的变更会变的更加可预测性。
- 易于调试：中心化的状态使得调试和状态监控变得容易。

缺点：

- 性能问题：由于所有状态都集中到单一的 Store 中，因此任何状态的更新都会导致整个状态树的更新，因此容易触发额外的 re-render，即使不相关的状态发生变化。
- 额外的模板代码：需要编写较多的模板代码，在应用的开发和维护中都带来了额外的成本。
- 较高的学习成本：学习曲线比较陡峭，有大量的概念和中间件需要学习。

### 可变(Mutable)模型：MobX、Valito

Mutable 指的是创建对象之后任何状态更新都是**基于对原先对象的基础之上**进行的，典型的比如 MobX、Valtio 都是属于此类，比如：

```jsx
// Valito
<button onClick={() => (state.deep.nested.obj.count += 1)}>+1</button>
```

优点：

- 提升开发效率：Mutable 方案可以使得更新状态更加容易，尤其是在多层嵌套对象的更新上。同时由于基于 Mutable 方案下的状态管理库内部会基于 Proxy 来实现，会监听组件对于状态的使用情况，从而在更新状态时正确触发对应的组件完成 re-render，因此这种方案下我们可以认为性能默认就是最优的，不需要手动来优化。
- 容易理解：相比于 Immutable 方案，更容易学习和理解。

缺点：

- 因为 Mutable 方案内部采用 Proxy，因此过于黑盒，状态的更新没有那么透明，遇到问题可能比较难以排查。

### Immutable(不可变) 模型：Redux、Zustand、XState、Recoil、Jotai

Immutable 指的是对象一旦创建就不能被修改，需要**基于这个对象生成新的对象**而保证原始对象不变，比如 Zustand、Jotai、Redux 都属于这一类。比如：

```typescript
// Zustand
increment: () =>
  set((state) => ({
  	deep: {
      ...state.deep,
      nested: {
      	...state.deep.nested,
      	obj: {
          ...state.deep.nested.obj,
          count: state.deep.nested.obj.count + 1,
        },
      },
    },
  })),
```

优点：

- 可预测性：当状态发生变化时，这些变化是可以被追踪以及最终状态的更新结果是明确的。

缺点：

- 理解和开发成本：在更新状态时，尤其是多层嵌套的对象中会比较麻烦。不过我们可以结合 Immer 来解决这个问题。

### 原子化模型：Jotai、Recoil

优点：

- 精细的状态控制：原子化的设计模型维护各个原子状态以及原子之间的依赖交错关系，并通过原子之间的相互依赖关系阻止应用 re-render，提高性能。
- 方便组合和重用：各个原子可以相互组合和重用来共同构建整个应用的状态。

缺点：

- 额外的原子管理成本：由于状态被分散成了一个个切片的原子，因此如何拆分和维护较多的原子带来了额外的成本。

### 状态机模型：XState

优点：

- 清晰的状态逻辑：状态机提供了一种数学化的方法来描述状态和转换，使得复杂逻辑变得清晰。
- 可视化：状态机的状态和转换可以被可视化，有助于理解。

缺点：

- 较高的学习成本：状态机模型和其它状态管理库理念有比较大的差别，对于新接触的同学来说，理解需要一定的成本。
- 引入额外的设计复杂度：将应用的功能的状态逻辑适配到状态机模型中可能带来额外的设计复杂度，在应用逻辑的发展变化后对状态机的维护和更新也会带来一定的成本。

## 选择状态管理库的因素

一般来说，选择一个状态管理库有以下几点因素：

- **受欢迎/流行程度**：一个更流行的库意味着它经过更多项目的验证，因此更为可靠。
- **活跃程度**：一个活跃的库表示它正在持续更新和维护，能够及时修复 bug 并及时支持 React 新特性，迎合 React 发展。

- **完善的使用文档**：一个清晰完善的文档非常重要，一个好的文档无论新手还是具有经验的开发者都能从中找到日常开发中所需的信息和解决方案。
- **上手难度**：一个容易上手的状态管理库可以减少开发者学习成本，新同学加入后也能够快速上手进行开发，从而加速项目开发流程。
- **包体积**：如果一个库的体积较大，则会对应用的性能造成影响，增加应用的加载时间，同时也会增大带宽成本。
- **DevTools 支持**：一个好的 DevTools 支持非常重要，良好的 DevTools 支持可以显著提高开发效率。
- **兼容性**：需要确保库与你的技术栈的兼容性，包括 React 版本、Proxy 浏览器兼容版本、SSR 兼容性等。
- **React 新特性的支持程度**：随着 React 不断更新和引入新特性，需要确保状态管理库与这些新特性是否兼容。
- **优化方式**：根据优化方式可以大致分为自动优化和手动优化，手动优化意味着需要更高的开发者素质。

还有几点需要根据你的项目来抉择：

- **SSR/RSC 支持**：如果在项目中正在使用 SSR/RSC，则需要确保状态管理库是否很好的支持。

- **是否支持 Class Components**：如果你在使用 Class Components 的话这意味着面向 Function Components 设计的状态管理库则无法使用。
- **中心化/去中心化状态管理**：随着 React 的发展，状态管理库的心智模型也随之演变，从中心化 Store 到去中心化方案。即考虑你的应用是否需要一个大的中央存储（大 Store）或是更倾向于分散和模块化的存储（分片 Store）。
- **Mutable/Immutable**：Mutable 和 Immutable 各有优劣。Immutable 可以让我们的函数在多次执行时，保持可预测性。Mutable 可以帮助我们更轻松的完成自动优化。
- **解决 Tearing 问题/支持并发更新**：这两个本质上是一种 trade-off，如果你希望在应用中不出现 Tearing 问题，则选择 `useSyncExternalStore` 方案的状态管理库，比如 Zustand、React Redux，如果你想要并发更新，则可以考虑选择 Jotai。

## 分析现在的状态管理库

### 受欢迎程度

由于 Redux 早早推出，因此很多项目还在使用，在 npm 下载方面会遥遥领先，我们一般根据 stars 上升数量来判断哪个库更受欢迎，如下：

![image-20240624225720048](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240624225720048.png)

我们发现虽然 Redux 作为老牌库，但只能排第十，同为状态管理的 Zustand 却遥遥领先

### 活跃的程度

想象一下这种场景：你正在使用某个库开发功能，忽然碰到了一个棘手的 bug。急切间，你跑到 GitHub，发起了一个 issue，心怀希望地等待解答。日复一日，页面上的回复栏却依旧空荡荡，没有一个回音。

因此不难理解，一个频繁迭代的库意味着频繁的功能迭代，社区更加活跃，开发者不断的更新新的功能和改进现有的功能。以及社区在积极的响应各种 issue，及时修复漏洞和缺陷。

我们以这个维度来看一下上面几个库的迭代频繁程度，润去 Github 可以看到迭代，基本上除了 Recoil 都有着稳定的提交更新

> Recoil 团队成员被 Facebook 裁员啦，dddd，打工人打工魂

### 完善的使用文档

一个清晰完善的文档非常重要，因为它不仅可以帮助开发者快速上手和理解库的核心概念、API 使用方法和最佳实践，还可以有效减少在集成和应用开发过程中遇到的问题。

优秀的文档应包含丰富的示例代码、场景说明、常见问题解答和性能优化建议，使得无论是新手还是有经验的开发者都能够在不同阶段的项目开发中找到所需的信息和解决方案，从而提高开发效率和质量。

大部分的状态管理库都有着自己的文档，且稳定更新

### 上手难度

上手难度是一个难以量化的指标，对于每个人来说可能都不相同。

但是我们可以确定的是，整个状态管理库发展的趋势是朝着更容易上手、更加简单、心智负担更小、更符合直觉的方向去发展的。

一个更容易上手的方案也意味着新人上手项目的成本更低，跨团队协作更加容易。

### 是否支持 Class Components

虽然类组件已经过时了，但仍然有大量的项目在使用这种模式进行开发，很可能就需要你维护这种项目。

因为大部分状态管理库都包含了 vanilla（纯 JavaScript 实现，不包含任何框架比如 React Vue 等），所以理论上其实所有状态管理库都可以结合 Class Components 进行开发

但是需要手动使用 vanilla + Class Components `setState` 进行使用，或者在 Class Components 外层包裹 Function Component，这无疑非常影响开发体验。

原生支持类组件的状态管理库只有两个：Redux、MobX

### 包体积

由于我们所使用到的库都会被打包，所以包的体积大小会直接影响性能，更大的体积就会带来更久的下载时间，如果网络较差，首屏白屏时间和交互时间就会变长，带来不好的体验

### 单一/多个/原子化状态管理

大 Store 是指在整个应用中只维护一个全局的状态对象。模块化 Store 是指将应用的状态分割成多个小块或模块，每个模块管理自己的状态。

在 react-redux 中采用的方案就是大 Store，整个应用的状态被存储在一个单一的、大型的对象中。虽然所有状态都存储在一个地方，可以更容易追踪状态的变化和维护状态的一致性，但这种方案有着诸多问题，例如：

- **性能问题**：随着应用规模的增长，整个应用的状态都保存在一个大的对象中，可能导致性能问题。每当状态更新时，即使是小的更改，也可能导致整个应用或大部分应用重新渲染。
- **学习曲线**：对于新手开发者来说，理解和管理一个庞大的状态树可能相对困难，增加了学习曲线。
- **过度的模板代码**：管理大 Store 可能需要编写大量的样板代码，如 actions、reducers 等。
- **难以迁移和重构**：随着项目的发展，对大 Store 的结构进行迁移或重构可能非常困难和耗时。

而现在，整个社区从大 Store 全局统一状态朝着模块化、分片化 Store 在发展。

### Mutable / Immutable

**Mutable（可变）**：指的是创建对象之后任何状态更新都是基于对原先对象的基础之上进行的，典型的比如 MobX、Valtio 都是属于此类，例如：

```jsx
// Valtio
import { proxy, useSnapshot } from "valtio"
// 创建状态
const state = proxy({
	count: 0,
})

export default function App() {
	// hook 使用上面设置的状态
	const snapshot = useSnapshot(state)

	return (
		<div>
			<div>{snapshot.count}</div>
			<button onClick={() => (state.count += 1)}>+1</button>
		</div>
	)
}
```

我们可以看到，在点击按钮后会直接在原始状态上进行修改来完成状态的更新，即 `state.count += 1`。

**Immutable（不可变）**：指的是对象一旦创建就不能被修改，需要基于这个对象生成新的对象而保证原始对象不变。

```jsx
// Zustand
import { create } from "zustand"

const useStore = create((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
}))

export default function App() {
	const { count, increment } = useStore()

	return (
		<div>
			<div>{count}</div>
			<button onClick={increment}>+1</button>
		</div>
	)
}
```

在这个例子中我们可以看到，对于 Immutable 模型的状态管理库而言，不能直接在原先的对象上修改，而是需要生成一个新的对象，包含了修改后的 `count` 值。

一般来说需要根据项目来抉择，我们做个总结：

对于复杂的多层嵌套的数据结构来说，Immutable 方式处理起来非常麻烦，并且容易出错，而 Mutable 方式则更加的自然、清晰和符合直觉。除此之外，基于 Mutable 方案下的状态管理库内部基于 Proxy 来实现，会监听组件对于状态的使用情况，从而在更新状态时正确触发对应的组件完成 re-render，因此这种方案下我们可以认为性能默认就是最优的，不需要手动来优化。

但是 Immutable 可以保证可预测性，而 Mutable 则难以保证这一点。可预测性指的是当状态发生变化时，这些变化是可以被追踪以及最终状态的更新结果是明确的。而 Mutable 方式则会直接修改原始的数组，当应用中不同的地方以不可预期的方式修改了这个状态，尤其是在复杂的应用中，最终这个状态可能会难以追踪，在遇到 Bug 时也难以排查。

### 优化方式

根据优化方式可以分为三类：基于 selector、基于原子化模型、基于 Proxy 的自动优化。我们不能说那种方案是更好的，而是需要根据不同团队情况、产品情况来正确选择合适的方案，接下来我们分别介绍一下：

#### 基于 selector（React Redux、Zustand、XState）

在组件使用状态时需要开发者手动进行性能优化，举个例子：

```jsx
import { create } from "zustand"
// zustand
const usePersonStore = create((set) => ({
	firstName: "",
	lastName: "",
	updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
	updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))

function App() {
	const { firstName } = usePersonStore()
	return <div>firstName: {firstName}</div>
}
```

我们首先创建了一个`usePersonStore`。然后在 App 组件中我们使用解构方式拿到`firstName`的值，但 Zustand 不知道组件用了什么状态，所以`lastName`如果变化也会导致 App 重新渲染，所以我们需要这样取：

```jsx
function App() {
	const firstName = usePersonStore((state) => state.firstName)
	return <div>firstName: {firstName}</div>
}
```

稍不留意可能就会带来性能的问题（虽说这种问题可能可以忽略不计），当然凡事也有双面性，手动优化的方案可以做极其细致的优化配置，而显然也会对开发者的素质有着更高的要求。

#### 基于原子之间交错组合（Jotai）

基于原子化模型的状态管理库中每个原子维护自己的小的状态片段，并通过原子之间的相互依赖关系阻止应用 re-render，提高性能。这类状态管理库不需要我们传入 selector。

```jsx
const firstNameAtom = atom("")

const lastNameAtom = atom("")

const fullNameAtom = atom((get) => {
	const firstName = get(firstNameAtom)
	const lastName = get(lastNameAtom)
	return firstName + lastName
})

function App() {
	const firstName = useAtomValue(firstNameAtom)
	return <div>firstName: {firstName}</div>
}
```

我们使用 Jotai 创建了`firstNameAtom`、`lastNameAtom`，并创建了`fullNameAtom`用来组合`firstNameAtom`与`lastNameAtom`。

然后我们在 App 组件只使用`firstNameAtom`，由于我们并没有用到`lastNameAtom`状态，也没有用到`fullNameAtom`，当`lastNameAtom`状态发生变化是不会导致 App 组件重新渲染的。那么我们稍微改一下 App 组件：

```jsx
function App() {
	const fullName = useAtomValue(fullNameAtom)
	return <div>fullName: {fullName}</div>
}
```

由于`fullNameAtom`内部用到了`lastNameAtom`，所以如果`lastNameAtom`状态发生变化则会导致 App 组件重新渲染。

#### 基于 Proxy 自动优化（Mobx、Valtio）

以 Valtio、Mobx 为首的基于 Mutable 的状态管理库：这类状态管理库内部采用 Proxy 来实现，会自动监听组件使用了哪些状态，只有这些状态变化才会触发组件 re-render。

> 因此你基本可以认为它性能最佳

### DevTools 支持

一个设计良好的 DevTools 可以更好的提高开发者的效率，一个好的 Devtools 工具需要包含状态监视、状态时间旅行（Time Travel）。

状态时间旅行指开发者可以在应用的不同状态之间来回"旅行"，即回溯和重新应用之前的状态。这个功能主要在开发过程中用于调试和理解应用状态的变化。

基本上所有状态管理库都基于如下三类实现了 DevTools

- **Extension DevTools**：例如 Redux DevTools 等，这类工具作为浏览器扩展而存在，需要在开发 DevTools 功能之外额外开发浏览器扩展插件。
- **Hooks DevTools**：例如 Jotai DevTools、Recoil DevTools 等，这类工具基于 Hooks 实现的，用来获取快照、进行时间旅行、将状态集成到 React DevTools 等功能，方便在代码中直接进行调试。
- **UI DevTools**：例如 Jotai DevTools 等，这类工具基于组件实现并最终展示在页面中，这种通常会置于页面底端占用一定的空间，点击可以展开，需要实现一个较为美观的组件界面，以及区分开发环境和生产环境，在生产环境需要确保被 Tree Shaking，避免将 DevTool 带入线上。

> 当然可能社区也有自己的实现，这里举例为官方的实现方案

### React 新特性的支持程度

例如 React 在升级 18 之后引入了并发更新机制，同时也给状态管理库带来了 Tearing 的问题，因此像 React Redux 在 8 版本引入了 useSyncExternalStore 来解决这个问题。

再举个例子，React `use` hooks 是 React 官方提出的新的 hooks，可以方便的配合 Suspense 来进行使用，很多状态管理库都已经内置了 `use`，从而能够更轻松的管理异步的状态。

React 19 也即将到来，各个状态管理库也需要更新用于结合 19 版本的新能力

### 兼容性

有些状态管理库基于 Proxy，如 MobX、Valtio，而 Proxy 在 Chrome 49 版本以下、Edge12 以下、Firefox18 以下不支持，所以需要根据项目选择。

我们还需要考虑 React 版本的兼容，一般来说可以查看状态管理库的 package.json 中的 `peerDependencies` 字段，其给出了需要满足的宿主环境，例如：

```json
"peerDependencies": {
  "react": ">=17.0.0"
}
```

表示当前包需要 React 库作为其宿主环境，并且兼容的 React 版本应该是 17.0.0 或更高，如果你的项目使用的是 16 版本则不能使用。

SSR 兼容性：同样的，我们也需要关注该库是否支持 SSR，即是否提供了一种方式来在 Hydration 阶段填充数据。

### SSR/RSC 支持

当状态管理库结合 SSR/RSC 时面临的最主要的两个问题是：

- 每个请求都需要对应一个 Store
- 状态需要传递给前端，并在前端填入到 Store 中

而其中我们说 Zustand/Valtio 是 React "外部"状态管理库，也就是说这些状态不基于 React Context 来分发 Store。所以当你的项目使用 SSR/RSC，可能需要谨慎考虑使用 Zustand/Valtio。

> Zustand 作者 dai-shi 也意识到了，所以他又创造了 Jotai

## 总结

我们根据分析，可以先排除一部分状态管理库方案，如下原因：

- 上手难度大，概念多，难以使用
- 没有文档或者文档内容较少，缺少丰富的事例代码
- 缺乏 DevTools 的支持
- 更新频次低，几乎不维护
- 对 React 新特性的支持较差

我们根据原因，先排除 Recoil

原因一：项目长时间不维护，根据该库的贡献记录，最近已经没有贡献了

![image-20240624232846552](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240624232846552.png)

- 性能问题：参考 [Issue](https://github.com/pmndrs/jotai/discussions/1484)，dai-shi 显示了一个简单的 benchmark，可以看到结果

```js
recoil: 92.89111328125 ms
context: 0.89990234375 ms
jotai: 12.327880859375 ms
jotai: 10.9609375 ms
```

Recoil 的性能还是过于差劲了

- 活跃和维护：维护 Recoil 的成员都被裁员啦

所以我们可以完全不用考虑 Recoil 了，至于其他方案，都需要根据项目和团队选择

我们可以根据这几个因素选择对应的库：

- 使用类组件：使用 Redux、Mobx
- 兼容低版本浏览器：不使用 MobX、Valtio，其他均可
- 团队大小：
  - 大团队：需要统一规范，不建议使用 Jotai，原子化过于灵活，容易写出大片大片的 atom，难以维护
  - 小团队/个人：注重开发速度和灵活性，可以使用 Jotai，当然也可以使用 Zustand、Valtio 这类简洁灵活的库
- 项目大小：基本和上面团队是类似的，不过大项目也不建议采用基于 Proxy/Mutable 的方案如 Valtio，虽然它可以提升性能但由于过于黑盒，难以跟踪变更来源，导致大项目难以调试
- 开发人员水平：团队开发水平一般，更推荐 Zustand、Jotai、Valtio 这类简洁易懂且易上手的库，像 Valtio、Jotai 这种自动化的优化方案以及在 Zustand 中借助`createSelectors`与`useShallow`可以轻松的保证应用性能。
- 需要复杂的状态逻辑与状态：如果项目需要，推荐 XState，它通过状态机的概念高度结构化和可预测的方式来管理状态，极大地增强了代码的可读性和可维护性，XState 的可视化工具可以帮助团队更好地理解和沟通整个应用的状态逻辑

- 团队现状：最后根据公司内部团队偏好选择的，有些喜欢简洁的 Zustand，也有些喜欢大 Store 的 Redux
