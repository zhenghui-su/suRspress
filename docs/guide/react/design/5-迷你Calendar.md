# 迷你 Calendar

我们我们实现一个迷你的日历组件，在各组件库基本都有，如 antd 的 Calendar

我们首先过一下前置知识，即 Date 的相关 api

## 前置知识

创建一个 Date 对象时候，可以传入 年月日时分秒，比如 2024 年 8 月 9 日：

```ts
new Date(2024, 7, 9).toLocaleString();
```

`toLocaleString`是转成当地日期格式的字符串显示的

我们会奇怪，8 月为什么我们第二个参数是传 7 呢？

因为 Date 的月份 month 是从 0 开始计数，取值范围为 0 到 11，而日期是从 1 到 31，所以这里有个小技巧，当你日期即第三个参数传 0 的时候，会取到上个月的最后一天：

![image-20240809202540196](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809202540196.png)

如果传入 -1 就是上个月的倒数第二天，-2 就是倒数第三天这样，这个小技巧有很大的用处，可以用这个来拿到每个月有多少天：

![image-20240809202708575](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809202708575.png)

当然还有一些别的 api，如通过 `getFullYear`、`getMonth` 拿到年份和月份：

![image-20240809202823975](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809202823975.png)

这里还是需要注意拿到的 month 是少了 1 的，比如上面显示 7 实际则是 8 月

我们还可以通过`getDay`拿到今天是星期几，比如 2024-8-9 是星期五：

![image-20240809202944973](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809202944973.png)

这两个 api 学完之后，我们就可以实现日历组件了，来试试吧

## 日历组件

先创建一个项目，如下：

```sh
npx create-react-app --template=typescript calendar-test
```

### 静态布局

我们先写一个静态的布局，一个 header，下面是从星期日到星期六，再下面是日期从 1 到 31，先改 App：

```tsx
import "./index.css";

function Calendar() {
	return (
		<div className="calendar">
			<div className="header">
				<button>&lt;</button>
				<div>2024 年 8 月</div>
				<button>&gt;</button>
			</div>
			<div className="days">
				<div className="day">日</div>
				<div className="day">一</div>
				<div className="day">二</div>
				<div className="day">三</div>
				<div className="day">四</div>
				<div className="day">五</div>
				<div className="day">六</div>
				<div className="empty"></div>
				<div className="empty"></div>
				<div className="day">1</div>
				<div className="day">2</div>
				<div className="day">3</div>
				<div className="day">4</div>
				<div className="day">5</div>
				<div className="day">6</div>
				<div className="day">7</div>
				<div className="day">8</div>
				<div className="day">9</div>
				<div className="day">10</div>
				<div className="day">11</div>
				<div className="day">12</div>
				<div className="day">13</div>
				<div className="day">14</div>
				<div className="day">15</div>
				<div className="day">16</div>
				<div className="day">17</div>
				<div className="day">18</div>
				<div className="day">19</div>
				<div className="day">20</div>
				<div className="day">21</div>
				<div className="day">22</div>
				<div className="day">23</div>
				<div className="day">24</div>
				<div className="day">25</div>
				<div className="day">26</div>
				<div className="day">27</div>
				<div className="day">28</div>
				<div className="day">29</div>
				<div className="day">30</div>
				<div className="day">31</div>
			</div>
		</div>
	);
}

export default Calendar;
```

然后我们写一下样式布局，先整体有个边框，然后顶部 header 一个 space-between 的 flex 容器：

```css
.calendar {
	width: 300px;
	height: 250px;
	border: 1px solid #aaa;
	padding: 10px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 40px;
}
```

然后我们写下面的 day，就是一个 flex-wrap 为 wrap 的盒子，每个格子宽为 100%/7，分七个：

```css
.days {
	display: flex;
	flex-wrap: wrap;
}

.empty,
.day {
	width: calc(100% / 7);
	text-align: center;
	line-height: 30px;
}
```

不过我们再加样式，在鼠标悬浮到日期 day 上面有个颜色，方便区分：

```css
.day:hover {
	background-color: #ccc;
	cursor: pointer;
}
```

最终效果图如下，很简单的一个东西：

![image-20240809204221185](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809204221185.png)

### 日历逻辑

静态的布局写完了，我们来写一下具体的逻辑

首先是有一个 state 来保存当前的日期，默认今天

然后是顶部 header 的左右切换按钮，用来切换到上个月和下个月的第一天：

```tsx
const [date, setDate] = useState(new Date());
const handlePrevMonth = () => {
	setDate(new Date(date.getFullYear(), date.getMonth() - 1));
};
const handleNextMonth = () => {
	setDate(new Date(date.getFullYear(), date.getMonth() + 1));
};
```

记得把点击事件加到两个 button 上：

![image-20240809204649982](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809204649982.png)

然后我们需要改一下中间包裹的 div 的内容，不能写死了：

![image-20240809204907611](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809204907611.png)

然后试一下，比如我从 2024 年 8 月加到 2025 年 5 月：

![image-20240809205002922](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809205002922.png)

没问题，然后我们来改下面的日期部分，我们需要弄一个函数`renderDates`来做具体的日期渲染操作，就不需要下面的那个长长的静态 div 了，一步步来

我们需要两个函数，一个计算当前月的天数，一个计算当前月的第一个是星期几：

```tsx
const daysOfMonth = (year: number, month: number) => {
	return new Date(year, month + 1, 0).getDate();
};
const firstDayOfMonth = (year: number, month: number) => {
	return new Date(year, month, 1).getDay();
};
```

然后我们写 `renderDates`，首先定义数组来存储渲染的内容，随后计算该月有几天和第一个是星期几，这样才能知道我们从哪里开始渲染，同时要渲染多少天：

```tsx
const renderDates = () => {
	const days = [];

	const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
	const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

	for (let i = 0; i < firstDay; i++) {
		days.push(<div key={`empty-${i}`} className="empty"></div>);
	}

	for (let i = 1; i <= daysCount; i++) {
		days.push(
			<div key={i} className="day">
				{i}
			</div>
		);
	}
	return days;
};
```

知道从哪渲染之后，然后先一个循环，渲染 day - 1 个 empty 的块，再渲染 daysCount 个 day 的块。

```tsx
<div className="days">
	<div className="day">日</div>
	<div className="day">一</div>
	<div className="day">二</div>
	<div className="day">三</div>
	<div className="day">四</div>
	<div className="day">五</div>
	<div className="day">六</div>
	{renderDates()}
</div>
```

我们看看效果：

![image-20240809205758720](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809205758720.png)

![image-20240809205811260](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809205811260.png)

没有啥问题，这样我们就完成了一个日历组件了，很简单的。

## 通用性

接下来，为了通用，我们增加两个参数，`defaultValue`和`onChange`，和 antd 一样

### defaultValue

我们先用非受控模式，`defaultValue`参数设置为`date`的初始值：

![image-20240809210229830](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809210229830.png)

然后试一下可不可以，用两个：

```tsx
function Test() {
	return (
		<div>
			<Calendar defaultValue={new Date("2024-3-1")}></Calendar>
			<Calendar defaultValue={new Date("2024-8-15")}></Calendar>
		</div>
	);
}
export default Test;
```

![image-20240809210329158](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809210329158.png)

年月没有问题，不过日期对不对看不出来，我们加个样式，先在`renderDates`改一下：

![image-20240809210648356](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809210648356.png)

然后给 selected 这个类名加上样式：

```css
.day:hover,
.selected {
	background-color: #ccc;
	cursor: pointer;
}
```

现在再次查看，没有问题了和我们传入的一模一样：

![image-20240809210741444](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809210741444.png)

### onChange

随后我们还需要加上每个小格子的 onChange 回调函数，就是在点击 day 的时候，setDate 修改内部状态，然后回调 onChange 方法。

![image-20240809211122421](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809211122421.png)

然后我们试一下，我们给上面的加了一个`alert`的回调：

```tsx
function Test() {
	return (
		<div>
			<Calendar
				defaultValue={new Date("2024-3-1")}
				onChange={(date) => {
					alert(date.toLocaleDateString());
				}}
			></Calendar>
			<Calendar defaultValue={new Date("2024-8-15")}></Calendar>
		</div>
	);
}

export default Test;
```

结果如下，没有问题：

![image-20240809211333038](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809211333038.png)

大多数情况下，到这里已经完成对日历组件的封装了，不过我们还可以再进一步

## 暴露组件 api

我们可以提供一下 ref 来暴露一些 Calendar 的 api，先包裹一下：

```tsx
const Calendar = React.forwardRef(SuCalendar);
```

然后给原组件`SuCalendar`使用`useImperativeHandle`暴露，注意泛型约束：

![image-20240809211944261](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809211944261.png)

使用的时候如下：

![image-20240809212249644](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809212249644.png)

这里我弄了三秒后通过 ref 的 api 设置时间为 2023 年 3 月 1 日，结果如下：

![image-20240809212332636](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809212332636.png)

查看控制台，没有问题，输出的是我们设置的`defaultValue`：

![image-20240809212417765](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809212417765.png)

我们也就实现了除了通过 props 之外另一种暴露组件 api 的方式，当然其他组件也基本如此

## 支持兼容两个模式

我们上面用了非受控模式，但还需要支持受控模式，上一节我们使用了自己的 hooks，这节我们就用 ahooks 的 `useControllableValue` 吧，先安装：

```sh
npm install --save ahooks
```

然后我们回到组件，把`useState`改造为`useControllableValue`：

![image-20240809212825241](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809212825241.png)

这里的 `defaultValue` 是当 `props.value` 和 `props.defaultValue` 都没传入时的默认值。

`clickHanlder` 这里就只需要调用 `setDate` 不用调用 `onChange` 了：

![image-20240809212929895](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809212929895.png)

当然 props 的类型也要加上 value：

![image-20240809213056515](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809213056515.png)

我们尝试一下受控模式：

```tsx
function Test() {
	const [date, setDate] = useState(new Date());

	return (
		<Calendar
			value={date}
			onChange={(newDate) => {
				setDate(newDate);
				alert(newDate.toLocaleDateString());
			}}
		></Calendar>
	);
}
```

结果如下，没有问题：

![image-20240809213139121](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809213139121.png)

再试一下非受控模式：

```tsx
function Test() {
	return (
		<Calendar
			defaultValue={new Date()}
			onChange={(newDate) => {
				alert(newDate.toLocaleDateString());
			}}
		></Calendar>
	);
}
```

结果如下，也没有问题

![image-20240809213256288](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240809213256288.png)

## 总结

日历组件的原理非常的简单，本节只是实现了一个非常简单的迷你 Calendar，但主要功能都实现，也包括了使用 ahooks 的 `useControllableValue` 来兼容两个模式，当然这类的日历一般会基于 dayjs 实现传入日期的兼容，这部分我们下一节再说。

全部代码如下：

```tsx
import React, { useImperativeHandle } from "react";
import "./index.css";
import { useControllableValue } from "ahooks";

interface CalendarProps {
	value?: Date;
	defaultValue?: Date;
	onChange?: (date: Date) => void;
}
interface CalendarRef {
	getDate: () => Date;
	setDate: (date: Date) => void;
}
const SuCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (
	props,
	ref
) => {
	const [date, setDate] = useControllableValue(props, {
		defaultValue: new Date()
	});

	useImperativeHandle(ref, () => {
		return {
			getDate() {
				return date;
			},
			setDate(date: Date) {
				setDate(date);
			}
		};
	});

	const handlePrevMonth = () => {
		setDate(new Date(date.getFullYear(), date.getMonth() - 1));
	};

	const handleNextMonth = () => {
		setDate(new Date(date.getFullYear(), date.getMonth() + 1));
	};
	const monthNames = [
		"一月",
		"二月",
		"三月",
		"四月",
		"五月",
		"六月",
		"七月",
		"八月",
		"九月",
		"十月",
		"十一月",
		"十二月"
	];

	const daysOfMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	};
	const firstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay();
	};
	const renderDates = () => {
		const days = [];

		const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
		const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

		for (let i = 0; i < firstDay; i++) {
			days.push(<div key={`empty-${i}`} className="empty"></div>);
		}

		for (let i = 1; i <= daysCount; i++) {
			const clickHandler = () => {
				const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
				setDate(currentDate);
			};
			if (i === date.getDate()) {
				days.push(
					<div key={i} className="day selected" onClick={() => clickHandler()}>
						{i}
					</div>
				);
			} else {
				days.push(
					<div key={i} className="day" onClick={() => clickHandler()}>
						{i}
					</div>
				);
			}
		}
		return days;
	};
	return (
		<div className="calendar">
			<div className="header">
				<button onClick={handlePrevMonth}>&lt;</button>
				<div>
					{date.getFullYear()}年{monthNames[date.getMonth()]}
				</div>
				<button onClick={handleNextMonth}>&gt;</button>
			</div>
			<div className="days">
				<div className="day">日</div>
				<div className="day">一</div>
				<div className="day">二</div>
				<div className="day">三</div>
				<div className="day">四</div>
				<div className="day">五</div>
				<div className="day">六</div>
				{renderDates()}
			</div>
		</div>
	);
};
const Calendar = React.forwardRef(SuCalendar);
// function Test() {
// 	// 受控
// 	const [date, setDate] = useState(new Date());

// 	return (
// 		<Calendar
// 			value={date}
// 			onChange={(newDate) => {
// 				setDate(newDate);
// 				alert(newDate.toLocaleDateString());
// 			}}
// 		></Calendar>
// 	);
// }
function Test() {
	// 非受控
	return (
		<Calendar
			defaultValue={new Date()}
			onChange={(newDate) => {
				alert(newDate.toLocaleDateString());
			}}
		></Calendar>
	);
}

export default Test;
```
