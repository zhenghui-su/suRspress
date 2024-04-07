## *JSX* 基础语法

本章主要包括以下内容：

+ *JSX* 基础语法
+ *createElement* 方法

### *JSX* 基础语法

在 *React* 中，使用*JSX*来描述页面。

```jsx
function App() {
    return (
    	<div>Hello React</div>
    );
}
```

你可以把类似于 *HTML* 的代码单独提取出来，例如：

```jsx
function App() {
    const ele = <div>Hello React</div>
	return (
    	ele
    );
}
```

```jsx
function App() {
    const ele = (
    	<ul>
        	<li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    )
	return ele;
}
```

注意这种类似于 *HTML* 的语法在 *React* 中称之为 *JSX*,这是一种 *JavaScript* 的语法扩展。在 *React* 中推荐使用 *JSX* 来描述用户界面。*JSX* 乍看起来可能比较像是模版语言，但事实上它完全是在 *JavaScript* 内部实现的。

使用 *JSX* 来描述页面时，有如下的一些语法规则：

+ 根元素只能有一个
  如下，这样会报错，需要在两个div外面包裹一个标签

> <></>也可以用来包裹，表示空标签，这样不会显示在DOM中

```jsx
function App() {
    const ele = (
    	<>
        	<div>1</div>
            <div>1</div>
        </>
    )
	return ele;
}
```

+ *JSX* 中使用 *Javascript* 表达式。表达式写在花括号{}中

```jsx
function App() {
    const name = "chen";
    const ele = (
    	<>
        	<div>1</div>
            <div>{1+1}</div>
        	<div>{ name === "chen" ? "晨" : null}</div>
        </>
    )
	return ele;
}
```

+ 属性值指定为字符串字面量，或者在属性值中插入一个 *Javascript* 表达式

```jsx
function App() {
    const text = "two";
    const ele = (
    	<>
        	<div id="one">1</div>
            <div id={text}>2</div>
        </>
    )
	return ele;
}
```

+ *style* 对应样式对象，*class* 要写作 *className*，且要驼峰命名写样式

```jsx
function App() {
    const styles = {
        color: 'green',
        fontSize: '30px'
    };
    const ele = (
    	<>
        	<div className="aa">1</div>
            <div style={{
                color: 'red',
                fontSize: '20px'
            }}>2</div>
        	<div style={styles}>3</div>
        </>
    )
	return ele;
}
```

+ 注释需要写在花括号，指的是jsx里面的注释

```jsx
function App() {
    // 注释
    const ele = (
    	<>
        	{/* 注释 */}
        	<div id="one">1</div>
        </>
    )
	return ele;
}
```

+ *JSX* 允许在模板中插入数组，数组会自动展开所有成员

```jsx
function App() {
    const arr = [
        (<p key={10}>hello</p>),
        (<div key={11}>world</div>),
        (<span key={12}>haha</span>),
    ];
    // 假设这是服务器发过来的数据
    const stuInfo = [
        {id: 1, name: "张三", age: 18},
        {id: 2, name: "李四", age: 19},
        {id: 3, name: "王五", age: 20},
    ];
    const arr2 = stuInfo.map(item=>{
        return (
            // 这里要加个key,用来提升Diff算法效率
        	<div key={item.id}>姓名: {item.name} 年龄: {item.age}</div>
        )
    });
    console.log(arr2, 'arr2')
    const ele = (
    	<>
        	<div id="one">1</div>
        	{arr}
			{arr2}
        </>
    )
	return ele;
}
```

> 可以装vscode插件：搜索React，可自行选择喜欢的插件，如ES7 React/Redux/React-Native snippets for es6/es7

### createElement方法

如果你输出到了arr2，会发现arr2输出的其实是一段不一样的，而且JSX是一种Javascript的语法扩展，它是通过 **Babel** 会把*JSX*转译成一个名为 *React.createElement* 函数调用。

```
React.createElement(type, [props], [...children]);
```

参数说明：

+ type：创建的 React 元素类型（可选的值有：标签名字符串、React组件）。
+ props（可选）：React 元素的属性。
+ children（可选）：React 元素的子元素。

例如：下面两种代码的作用完全是相同的：

```jsx
const element1 = (
	<h1 className="greeting">
    	Hello, world!
    </h1>
);
const element1 = React.createElement(
	'h1',
    {className: 'greeting'},
    'Hello, world!'
);
```

这些对象被称为"React元素"。它们描述了你希望在屏幕上看到的内容。

可以看出，JSX的本质其实就是 *React.createElement* 方法的一种语法糖

> React就是为了方便书写，所以才使用JSX来书写