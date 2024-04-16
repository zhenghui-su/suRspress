## 虚拟 DOM

> 什么是虚拟DOM？其优点有哪些？

虚拟DOM 最早是由React团队提出来的，因此React团队在对虚拟DOM的定义上有着如下

> 官网：[虚拟DOM](https://zh-hans.legacy.reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom)

**Virtual DOM是一种编程概念**。在这个概念里，UI 以一种理想化的，或者说"虚拟的"表现形式被保存于内存中。

也就是说，只要我们有一种方式，能够将真实DOM的层次结构描述出来，那么这就是一个虚拟DOM。

在React中，React 团队使用的是 JS 对象来对DOM结构进行一个描述。但是很多人会直接把JS对象和虚拟DOM划等号，这种理解是不太准确的，比较片面的。

虛拟DOM和JS对象之间的关系：前者是一种思想，后者是一种思想的具体实现

### 为什么需要虚拟 DOM

使用虚拟 DOM 主要有两个方面的优势：

+ 相较于 DOM 的体积优势和速度优势

> 这里的速度优势并不全面，因为虚拟DOM是通过比较差异来减少对实际DOM的访问，以提高性能，在一些场景中其实直接操作DOM更高效，但在复杂UI变化中，心智负担严重

+ 多平台的渲染抽象能力

**相较于 DOM 的体积优势和速度优势**

首先我们需要明确一个点，JS 层面的计算速度要比DOM层面的计算要快:

+ DOM对象最终要被浏览器渲染出来之前，浏览器会有很多工作要做(浏览器的渲染原理)
+ DOM对象上面的属性也非常非常多

比如这两行代码，可以直接浏览器控制台运行一下看看：

```javascript
const div = document.createElement("div");
for(let i in div){console.log(i + "")}
```

操作JS对象的时间和操作DOM对象的时间是完全不一样的。

JS层面的计算速度要高于DOM层面的计算速度。

```javascript
console.time()// 计时开始
const arr = [];
// 创建 10000 个 DOM 对象
for (let i = 0; i < 10000; i++) {
    arr.push(document.createElement("div"))
}
console.timeEnd() // 计时结束 平均5ms

console.time()// 计时开始 
const arr2 = []
// 创建 10000 个 JS 对象
for(let i = 0; i< 10000; i++) {
    arr2.push({
        tag: 'div'
    })
}
console.timeEnd() // 计时结束 平均1ms
```

此时有一个问题：虽然使用了 JS 对象来描述 UI，但是最终不还是要用原生 DOM API 去操作 DOM 么?

虛拟 DOM在第一次渲染页面的时候， 并没有什么优势，速度肯定比直接操作原生 DOM API 要慢一些，虚拟 DOM真正体现优势是在更新阶段。

根据React团队的研究，在更新页面时，相比使用原生 DOM API，开发人员更加倾向于使用 innerHTML

```js
// DOMAPI
let newP = document.createElement("p");
let newContent = document.createTextNode ("this is a test");
newP.appendchild(newContent);
docunent.body.appendChild(newP);
```

```js
// innerHTML
document.body.innerHTML = `
	<p>
		this is a test
	</p>
`;
```

因此在使用 innerHTML 的时候，就涉及到了两个层面的计算:

+ JS 层面：解析字符串
+ DOM 层面：创建对应的 DOM 节点

接下来我们加入虚拟 DOM 来进行对比

|              | innerHTML           | 虚拟 DOM            |
| ------------ | ------------------- | ------------------- |
| JS 层面计算  | 解析字符串          | 创建 JS 对象        |
| DOM 层面计算 | 创建对应的 DOM 节点 | 创建对应的 DOM 节点 |

虚拟 DOM 真正发挥威力的时候，是在更新阶段

innerHTML进行更新的时候，要全部重新赋值，这意味着之前创建的DOM节点需要全部销毁掉，然后重新进行创建，但是虚拟DOM只需要更新必要的DOM节点即可

|              | innerHTML               | 虚拟 DOM          |
| ------------ | ----------------------- | ----------------- |
| JS 层面计算  | 解析字符串              | 创建 JS 对象      |
| DOM 层面计算 | 销毁原来所有的 DOM 节点 | 修改必要的 DOM 节 |
| DOM 层面计算 | 创建对应的 DOM 节点     |                   |

**多平台的渲染抽象能力**

虚拟 DOM 只是多真实 UI 的一个描述，根据不同的宿主环境，可以执行不同的渲染代码：

+ 浏览器、Node.js宿主环境使用 ReactDOM 包

+ Native宿主环境使用 ReactNative 包

+ Canvas, SVG或者VML (IE8) 宿主环境使用 ReactArt 包

+ ReactTest包用于渲染出 JS 对象，可以很方便地测试"不隶属于任何宿主环境的通用功能"



### React 中的虚拟 DOM

在 React 中通过 JSX 来描述 UI, JSX最终会被转为一个叫做 createElement 方法的调用，调用该方法后就会得到虚拟DOM对象。

经过 Babel 编译过后结果如下：[在线Babel工具地址](https://www.babeljs.cn/repl)

![image-20240417004058244](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240417004058244.png)

在源码中 createElement 方法如下：

```javascript
/**
* 
* @param {*} type 元素类型 如 h1
* @param {*} config 属性对象 如 {id: "aa"}
* @param {*} children 子元素 如 hello
* @returns <h1 id="aa">hello</h1>
*/
export function createElement(type, config, children) {
    let propName;
    
    const props = {};
    let key = null;
	let ref = null;
	let self = null;
	let source = null;
    //说明有属性
	if (config != null) {
        //...
        for (propName in config) {
            if(
                hasOwnProparty.call(config, propName) &&
                !RESERVED_PROPS.hasOwnProparty(propName)
            ) {
                props[propName] = config[propName];
            }
        }
	}
    // 经历了上面的 if 之后，所有的属性都放到了 props 对象上面
	// props ==> {id : "aa"}
	// children 可以有多个参数，这些参数被转移到新分配的 props 对象上
	// 如果是多个子元素，对应的是一个数组
    const childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        props.children = children;
    } else if (childrenLength > 1) {
        const childArrat = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        // ... 
        props.children = children;
    }
	// 添加默认的 props
    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName]''
            }
        }
    }
    // ...
    return ReactElement (
    	type,
       	key,
        ref,
        self,
        source,
        ReactCurrentOwner.current,
        props
    );
}

const ReactElement = function (type, key, ref, self, source, owner, props) {
    // 该对象就是最终向外部返回的vdom (也就是用来描述DOM层次结构的JS对象)
    const element = {
        // 让我们能够唯一 地将其标识为React元素
		$$typeof: REACT_ELEMENT_TYPE,
        // 元素的内置属性
        type: type,
        key: key,
        ref: ref,
        props: props,
        // 记录负责创建此元素的组件
        _owner: owner,
    };
    // ... 
    return element;
};
```

在上面的代码中，最终返回的element对象就是我们所说的虚拟DOM对象。在官方文档中，官方更倾向于将这个对象称之为React元素

### 问题解答

问：什么是虚拟DOM？其优点有哪些？

答：

虚拟 DOM 最初是由 React 团队所提出的概念，这是一种编程的思想，指的是针对真实UI DOM 的一种描述能力。

在React中，使用了 JS 对象来描述真实的 DOM 结构。虚拟 DOM 和 JS 对象之间的关系：前者是一种思想，后者是这种思想的具体实现。

使用虚拟DOM有如下的优点:

+ 相较于DOM的体积和速度优势

+ 多平台渲染的抽象能力

**相较于 DOM 的体积和速度优势**

+ JS 层面的计算的速度， 要比DOM层面的计算快得多
  。DOM对象最终要被浏览器显示出来之前，浏览器会有很多工作要做(浏览器渲染原理)
  。DOM上面的属性也是非常多的
+ 虚拟DOM发挥优势的时机主要体现在更新的时候，相比较innerHTML要将已有的DOM节点全部销毁，虚拟DOM能够做到针对DOM节点做最小程度的修改

**多平台渲染的抽象能力**

+ 浏览器、Node.js宿主环境使用 ReactDOM 包

+ Native宿主环境使用 ReactNative 包

+ Canvas、 SVG或者VML (IE8) 宿主环境使用 ReactArt 包

+ ReactTest包用于渲染出JS对象，可以很方便地测试"不隶属于任何宿主环境的通用功能”

在React中，通过JSX来描述UI, Jsx 仅仅是个语法糖， 会被Babel 编译为createElement 方法的调用。 该方法调用之后会返回一个JS对象，该对象就是虚拟DOM对象，官方更倾向于称之为一个React 元素。