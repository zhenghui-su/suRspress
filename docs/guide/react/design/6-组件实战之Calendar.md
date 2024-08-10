# 组件实战之 Calendar

上节我们实现了一个 mini 版本的 Calendar 日历组件，为什么是迷你，因为跟现在真实用的 Calendar 相比，还是比较简单的，比如 antd 的 Calendar 组件，如下：

![image-20240810205225841](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810205225841.png)

这节我们就实现这个东西，先 cra 创建一下项目：

```sh
npx create-react-app --template typescript calendar-component
```

## 实现思路

我们先理清楚一下这个东西的思路，日历组件的核心是拿到每月的天数和每月的第一天是星期几。

那我们如何知道呢？我们上节使用了 Date 自带的 api，这节我们通过 dayjs 这个库，它对此进行了封装：

```sh
npm install --save dayjs
```

我们先尝试用一下，创建一个`test.js`文件：

```js
const dayjs = require("dayjs");

console.log(dayjs("2024-8-1").daysInMonth());

console.log(dayjs("2024-8-1").startOf("month").format("YYYY-MM-DD"));

console.log(dayjs("2024-8-1").endOf("month").format("YYYY-MM-DD"));
```

然后用 node 运行一下，结果如下：

![image-20240810210002206](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810210002206.png)

这次我们就用 dayjs 来做，它封装的比较方便，antd 中也使用了它的 api

## 实现静态组件

下面来正式书写 Calendar 组件，在`src`下创建`Calendar`目录，新建`index.tsx`：

```tsx
import "./index.scss";

function Calendar() {
	return <div className="calendar"></div>;
}

export default Calendar;
```

然后新建样式`index.scss`：

```scss
.calendar {
	width: 100%;
	height: 200px;
	background: blue;
}
```

由于我们需要使用 scss，需要安装一下：

```sh
npm install --save sass
```

然后在 App 中引入一下：

```tsx
import Calendar from "./Calendar";

function App() {
	return (
		<div className="App">
			<Calendar></Calendar>
		</div>
	);
}

export default App;
```

然后`npm run start`跑一下，看一下样式有没有生效，生效就代表 scss 可以引入

![image-20240810210556358](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810210556358.png)

然后我们拆分一下，分成上面的 Header 和下面的 MonthCalendar 两个组件：

![image-20240810210737238](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810210737238.png)

### MonthCalendar

我们先做下面的 MonthCalendar 组件

#### 星期部分

首先是首日到周六的部分，在`Calendar`目录新建`MonthCalendar.tsx`

```tsx
function MonthCalendar() {
	const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

	return (
		<div className="calendar-month">
			<div className="calendar-month-week-list">
				{weekList.map((week) => (
					<div className="calendar-month-week-list-item">{week}</div>
				))}
			</div>
		</div>
	);
}

export default MonthCalendar;
```

然后在`index.scss`里面写一下样式：

```scss
.calendar {
	width: 100%;
}

.calendar-month {
	&-week-list {
		display: flex;
		padding: 0;
		width: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid #ccc;
		&-item {
			padding: 20px 16px;
			text-align: left;
			flex: 1;
			color: #7d7d7f;
		}
	}
}
```

这里的一栏用 flex 布局，每个列表元素项通过`flex: 1`平分剩余空间

然后在主文件`index.tsx`引入一下：

```tsx
import "./index.scss";
import MonthCalendar from "./MonthCalendar";

function Calendar() {
	return (
		<div className="calendar">
			<MonthCalendar />
		</div>
	);
}

export default Calendar;
```

查看一下效果，没问题了：

![image-20240810211528434](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810211528434.png)

#### 天数部分

然后我们写下面的部分，思路前面也说过了，就是当前月份天数和第一天是星期几，前后用上个月和下个月的日期填充。

我们给 Calendar 组件加一个 value 的传入 props，用来传入当前日期：

```tsx
import "./index.scss";
import MonthCalendar from "./MonthCalendar";
import type { Dayjs } from "dayjs";

export interface CalendarProps {
	value: Dayjs;
}

function Calendar(props: CalendarProps) {
	return (
		<div className="calendar">
			<MonthCalendar {...props} />
		</div>
	);
}

export default Calendar;
```

当然`MonthCalendar`也需要 props，这里用继承就好：

![image-20240810211846323](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810211846323.png)

然后我们在 App 里面传入一下当前日期：

```tsx
import dayjs from "dayjs";
import Calendar from "./Calendar";

function App() {
	return (
		<div className="App">
			<Calendar value={dayjs("2024-8-10")}></Calendar>
		</div>
	);
}

export default App;
```

这样`MonthCalendar`就可以根据传入的 value 拿到对应月份信息

##### 日历数据方法

我们可以加一个`getAllDays`方法，打个断点：

```tsx
function getAllDays(date: Dayjs) {
	const daysInMonth = date.daysInMonth();
	const startDate = date.startOf("month");
	const day = startDate.day();
}
```

![image-20240810212157257](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810212157257.png)

根据我之前的新建一个调试配置：

![image-20240810212241011](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810212241011.png)

然后我们查看一下当前月份天数，没问题，2024 年 8 月是 31 天

![image-20240810212354100](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810212354100.png)

接下来就可以实现了，需要记住不管有几天，我们日历永久都 6 \* 7 个日期：

![image-20240810212443269](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810212443269.png)

先创建一个 6 \* 7 的数组，其中这个月第一天之前的用第一天的日期 -1、-2、-3 这样计算出来：

```tsx
function getAllDays(date: Dayjs) {
	const daysInMonth = date.daysInMonth();
	const startDate = date.startOf("month");
	const day = startDate.day();

	const daysInfo = new Array(6 * 7);

	for (let i = 0; i < day; i++) {
		daysInfo[i] = {
			date: startDate.subtract(day - i, "day").format("YYYY-MM-DD")
		};
	}

	debugger;
}
```

比如 2024 年 8 月 1 日是星期四：

![image-20240810213004956](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810213004956.png)

那我们就需要在这之前填充星期日、星期一、星期二、星期三，这 4 天的日期：

![image-20240810213052718](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810213052718.png)

这里是通过 dayjs 的 `subtract`方法计算当前日期 -1、-2、-3 ...的日期。

我们填充了之前的，然后填充剩下的日期，从 startDate 开始 +1、+2、+3 ...计算日期

```tsx
function getAllDays(date: Dayjs) {
	const daysInMonth = date.daysInMonth();
	const startDate = date.startOf("month");
	const day = startDate.day();

	const daysInfo = new Array(6 * 7);

	for (let i = 0; i < day; i++) {
		daysInfo[i] = {
			date: startDate.subtract(day - i, "day").format("YYYY-MM-DD")
		};
	}

	for (let i = day; i < daysInfo.length; i++) {
		daysInfo[i] = {
			date: startDate.add(i - day, "day").format("YYYY-MM-DD")
		};
	}
	debugger;
}
```

这里使用`add`方法来做，然后我们查看一下`daysinfo`，结果正确：

![image-20240810213437530](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810213437530.png)

然后我们把`format`删除，存储的时候不需要格式化，前面格式化是方便我们调试查看。

然后我们存的时候还需要一个属性标识是否是当前月份的：

```tsx
function getAllDays(date: Dayjs) {
	const startDate = date.startOf("month");
	const day = startDate.day();

	const daysInfo = new Array(6 * 7);

	for (let i = 0; i < day; i++) {
		daysInfo[i] = {
			date: startDate.subtract(day - i, "day"),
			currentMonth: false
		};
	}

	for (let i = day; i < daysInfo.length; i++) {
		const calcDate = startDate.add(i - day, "day");

		daysInfo[i] = {
			date: calcDate,
			currentMonth: calcDate.month() === date.month()
		};
	}
	return daysInfo;
}
```

我们查看一下，在返回值地方打个断点，可以看到已经是否是本月的正确区分了：

![image-20240810213826425](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810213826425.png)

这样日历部分的数据我们已经准备好了，上一节其实我们已经实现了，不过这节用了 dayjs 更方便快捷一点

然后我们声明一下返回的`daysInfo`这个数组的类型，方便我们后续的代码提示：

```ts
const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
	6 * 7
);
```

##### 日历天数部分渲染

数据已经有了，接下来渲染就好，弄一个方法循环一下数据渲染 div：

```tsx
function renderDays(days: Array<{ date: Dayjs; currentMonth: boolean }>) {
	const rows = [];
	for (let i = 0; i < 6; i++) {
		const row = [];
		for (let j = 0; j < 7; j++) {
			const item = days[i * 7 + j];
			row[j] = (
				<div className="calendar-month-body-cell">{item.date.date()}</div>
			);
		}
		rows.push(row);
	}
	return rows.map((row) => (
		<div className="calendar-month-body-row">{row}</div>
	));
}
```

这里就是把 6 \* 7 个日期，按照 6 行，每行 7 个来组织成 jsx。然后加入`MonthCalendar`：

```tsx
<div className="calendar-month-body">{renderDays(allDays)}</div>
```

![image-20240810214708230](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810214708230.png)

然后写一下样式，这块每行的每个单元格用 `flex:1` 来分配空间，然后设置个 `padding`：

```scss
&-body {
	&-row {
		height: 100px;
		display: flex;
	}
	&-cell {
		flex: 1;
		border: 1px solid #eee;
		padding: 10px;
	}
}
```

注意这里在`.calendar-month`的嵌套里：

![image-20240810214942448](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810214942448.png)

查看一下渲染效果，调试可以暂时关闭了：

![image-20240810215014283](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810215014283.png)

然后为了区分本月和其他月份，我们添加的时候就通过数据里面的`currenMonth`来弄不同类名：

```tsx
function renderDays(days: Array<{ date: Dayjs; currentMonth: boolean }>) {
	const rows = [];
	for (let i = 0; i < 6; i++) {
		const row = [];
		for (let j = 0; j < 7; j++) {
			const item = days[i * 7 + j];
			row[j] = (
				<div
					className={
						"calendar-month-body-cell " +
						(item.currentMonth ? "calendar-month-body-cell-current" : "")
					}
				>
					{item.date.date()}
				</div>
			);
		}
		rows.push(row);
	}
	return rows.map((row) => (
		<div className="calendar-month-body-row">{row}</div>
	));
}
```

然后样式改一下，其他月份字体就灰色，当前月份就正常：

![image-20240810215326832](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810215326832.png)

再次查看，没问题了，已经实现区分了：

![image-20240810215643203](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810215643203.png)

### Header

接下来我们实现顶部 Header 切换日期部分，先写个静态的，新建`Header.tsx`：

```tsx
function Header() {
	return (
		<div className="calendar-header">
			<div className="calendar-header-left">
				<div className="calendar-header-icon">&lt;</div>
				<div className="calendar-header-value">2024 年 8 月</div>
				<div className="calendar-header-icon">&gt;</div>
				<button className="calendar-header-btn">今天</button>
			</div>
		</div>
	);
}

export default Header;
```

然后写一下样式，这块就不具体讲了，很简单：

```scss
.calendar-header {
	&-left {
		display: flex;
		align-items: center;
		height: 28px;
		line-height: 28px;
	}
	&-value {
		font-size: 20px;
	}
	&-btn {
		background: #eee;
		cursor: pointer;
		border: 0;
		padding: 0 15px;
		line-height: 28px;
		&:hover {
			background: #ccc;
		}
	}
	&-icon {
		width: 28px;
		height: 28px;
		line-height: 28px;
		border-radius: 50%;
		text-align: center;
		font-size: 12px;
		user-select: none;
		cursor: pointer;
		margin-right: 12px;
		&:not(:first-child) {
			margin: 0 12px;
		}
		&:hover {
			background: #ccc;
		}
	}
}
```

引入 App 一下：

```tsx
import Header from "./Header";
import "./index.scss";
import MonthCalendar from "./MonthCalendar";
import type { Dayjs } from "dayjs";

export interface CalendarProps {
	value: Dayjs;
}

function Calendar(props: CalendarProps) {
	return (
		<div className="calendar">
			<Header />
			<MonthCalendar {...props} />
		</div>
	);
}

export default Calendar;
```

查看一下渲染效果，看一下如何：

![image-20240810220111197](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810220111197.png)

ok 了，没有问题，至此我们静态的部分就完成了

## 实现组件逻辑

我们先给 Calendar 的 props 加几个参数：

```tsx
export interface CalendarProps {
	value: Dayjs;
	style?: CSSProperties;
	className?: string | string[];
	// 定制日期显示，会完全覆盖日期单元格
	dateRender?: (currentDate: Dayjs) => ReactNode;
	// 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
	dateInnerContent?: (currentDate: Dayjs) => ReactNode;
	// 国际化相关
	locale?: string;
	onChange?: (date: Dayjs) => void;
}
```

`style` 和 `className` 用于修改 Calendar 组件外层容器的样式。内部的布局我们都是用的 flex，所以只要外层容器的样式变了，内部的布局会自动适应。

`dateRender` 是用来定制日期单元格显示的内容的，比如加一些日程安排，加一些农历或者节日信息：

![image-20240810220641233](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810220641233.png)

`dateRender` 是整个覆盖，连带日期的数字一起，而 `dateInnerContent` 只会在日期的数字下添加一些内容，这两个 props 是不一样的。

`locale` 是用于国际化的，比如切换到中文显示或者是英文显示。

`onChange` 是当选择了日期之后会触发的回调。

然后我们实现下这些参数对应的逻辑。

### className 和 style

首先是 `className` 和 `style`，类名这块我们需要通过`classnames`这个库来做合并：

```sh
npm i classnames
```

它可以传入对象或者数组，会自动合并，返回最终的 className：

```tsx
function Calendar(props: CalendarProps) {
	const { value, style, className } = props;

	const classNames = cs("calendar", className);

	return (
		<div className={classNames} style={style}>
			<Header />
			<MonthCalendar {...props} />
		</div>
	);
}
```

然后我们在 App 传入测试一下：

![image-20240810221310614](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810221310614.png)

没有问题，全变绿了：

![image-20240810221604382](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810221604382.png)

在查看一下类名，也合并了：

![image-20240810221636999](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810221636999.png)

### dateRender 和 dateInnerContent

下面解决 `dateRender` 和 `dateInnerContent`，在`MonthCalendar`取出，传给`renderDays`：

![image-20240810222011391](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222011391.png)

然后在`renderDays`里面也很容易，将日历数据逻辑改一下就好：

![image-20240810222050976](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222050976.png)

然后我们在 App 里面传入`dateRender`测试一下：

![image-20240810222237429](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222237429.png)

```tsx
function App() {
	return (
		<div className="App">
			<Calendar
				value={dayjs("2024-8-1")}
				dateRender={(value) => {
					return (
						<div>
							<p style={{ background: "red", height: "50px" }}>
								{value.format("YYYY/MM/DD")}
							</p>
						</div>
					);
				}}
			></Calendar>
		</div>
	);
}
```

渲染结果如下，每个列表项就都替换成自定义的了

![image-20240810222309401](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222309401.png)

不过这有个小问题，比如返回的`height`高度为 `500px`，会内容溢出：

![image-20240810222415194](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222415194.png)

我们加个 `overflow: hidden` 就好了：

![image-20240810222445033](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222445033.png)

还有之前的 `padding`位置也不是很对，覆盖整个单元格应该不用加 `padding`

改一下渲染日期的逻辑，如果传了 `dateRender` 那就整个覆盖日期单元格，否则就是只在下面渲染 `dateInnerContent` 的内容：

![image-20240810222723310](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222723310.png)

改一下对应类名样式，把 padding 位置改为内部

![image-20240810222831022](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810222831022.png)

然后测试一下：

```tsx
function App() {
	return (
		<div className="App">
			<Calendar
				value={dayjs("2024-8-1")}
				dateInnerContent={(value) => {
					return (
						<div>
							<p style={{ background: "red", height: "30px" }}>
								{value.format("YYYY/MM/DD")}
							</p>
						</div>
					);
				}}
			></Calendar>
		</div>
	);
}
```

注意改成`dateInnerContent`了，然后查看效果：

![image-20240810223044379](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810223044379.png)

### locale

接下来做国际化参数 locale 处理，国际化就是可以让日历支持中文、英文、日文等，其实也很简单，就是把写死的文案换成按照 key 从配置中取的文案就行了。

我们先定义一下类型，在`Calendar/locale/interface.ts`下：

```ts
export interface CalendarType {
	formatYear: string;
	formatMonth: string;
	today: string;
	month: {
		January: string;
		February: string;
		March: string;
		April: string;
		May: string;
		June: string;
		July: string;
		August: string;
		September: string;
		October: string;
		November: string;
		December: string;
	} & Record<string, any>;
	week: {
		monday: string;
		tuesday: string;
		wednesday: string;
		thursday: string;
		friday: string;
		saturday: string;
		sunday: string;
	} & Record<string, any>;
}
```

然后分别定义中文和英文的配置，在`src/Calendar/locale/zh-CN.ts`：

```ts
import { CalendarType } from "./interface";

const CalendarLocale: CalendarType = {
	formatYear: "YYYY 年",
	formatMonth: "YYYY 年 MM 月",
	today: "今天",
	month: {
		January: "一月",
		February: "二月",
		March: "三月",
		April: "四月",
		May: "五月",
		June: "六月",
		July: "七月",
		August: "八月",
		September: "九月",
		October: "十月",
		November: "十一月",
		December: "十二月"
	},
	week: {
		monday: "周一",
		tuesday: "周二",
		wednesday: "周三",
		thursday: "周四",
		friday: "周五",
		saturday: "周六",
		sunday: "周日"
	}
};

export default CalendarLocale;
```

就是把要用到文字列出来，很简单，然后写一个英文的，在`src/Calendar/locale/en-US.ts`下：

```ts
import { CalendarType } from "./interface";

const CalendarLocale: CalendarType = {
	formatYear: "YYYY",
	formatMonth: "MMM YYYY",
	today: "Today",
	month: {
		January: "January",
		February: "February",
		March: "March",
		April: "April",
		May: "May",
		June: "June",
		July: "July",
		August: "August",
		September: "September",
		October: "October",
		November: "November",
		December: "December"
	},
	week: {
		monday: "Monday",
		tuesday: "Tuesday",
		wednesday: "Wednesday",
		thursday: "Thursday",
		friday: "Friday",
		saturday: "Saturday",
		sunday: "Sunday"
	}
};

export default CalendarLocale;
```

更多的可以自己增加配置，然后我们替换一下文案，先替换星期数，在 MonthCalendar 引入中文的资源包：

```tsx
import CalendarLocale from "./locale/zh-CN";
```

然后把之前写死的文案，改成按照 key 从资源包中取值的方式：

![image-20240810223809320](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810223809320.png)

现在渲染是中文，我们改一下资源包：

```tsx
import CalendarLocale from "./locale/en-US";
```

顶部文案也就跟着改变了

![image-20240810223909678](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810223909678.png)

当然，现在我们是手动切换的资源包，其实应该是全局统一配置的。

我们通过 Context 来做一下，新建 `src/Calendar/LocaleContext.tsx`

```tsx
import { createContext } from "react";

export interface LocaleContextType {
	locale: string;
}

const LocaleContext = createContext<LocaleContextType>({
	locale: "zh-CN"
});

export default LocaleContext;
```

然后在 `Calendar` 组件里用 `Provider` 修改 context 的值：

![image-20240810224219771](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224219771.png)

如果传了`locale`就用，没有就通过`navigator.language`判断，这个方法可以返回字符串：

![image-20240810224313134](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224313134.png)

然后需要加一个国际化资源包的入口，在`src/Calendar/locale/index.ts`下：

```ts
import zhCN from "./zh-CN";
import enUS from "./en-US";
import { CalendarType } from "./interface";

const allLocales: Record<string, CalendarType> = {
	"zh-CN": zhCN,
	"en-US": enUS
};

export default allLocales;
```

再把 MonthCalendar 的 locale 改成从 context 获取的：

![image-20240810224648334](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224648334.png)

这样就不需要引入了，当我们不指定 locale 时候，就根据浏览器的语言来设置：

![image-20240810224743732](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224743732.png)

当我们指定 locale 时候，就会切换指定语言的资源包：

![image-20240810224853654](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224853654.png)

![image-20240810224908142](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224908142.png)

不过我们在敲的时候没有提示，改一下 locale 类型为联合类型：

![image-20240810224938494](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224938494.png)

这样我们写的时候会有对应的提示了：

![image-20240810224954007](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810224954007.png)

Header 的文字我们下面写逻辑的时候一块做

### value 和 onChange

接下来，我们实现 `value` 和 `onChange` 参数的逻辑。

在 `MonthCalendar` 里取出 `value` 参数，传入 `renderDays` 方法：

![image-20240810225549397](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810225549397.png)

然后`renderDays`里面只需要类名合并就好，如果是当前日期，就加一个 xxx-selected 的 className：

![image-20240810225639263](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810225639263.png)

```tsx
function renderDays(
	days: Array<{ date: Dayjs; currentMonth: boolean }>,
	dateRender: MonthCalendarProps["dateRender"],
	dateInnerContent: MonthCalendarProps["dateInnerContent"],
	value: Dayjs
) {
	const rows = [];
	for (let i = 0; i < 6; i++) {
		const row = [];
		for (let j = 0; j < 7; j++) {
			const item = days[i * 7 + j];
			row[j] = (
				<div
					className={
						"calendar-month-body-cell " +
						(item.currentMonth ? "calendar-month-body-cell-current" : "")
					}
				>
					{dateRender ? (
						dateRender(item.date)
					) : (
						<div className="calendar-month-body-cell-date">
							<div
								className={cs(
									"calendar-month-body-cell-date-value",
									value.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD")
										? "calendar-month-body-cell-date-selected"
										: ""
								)}
							>
								{item.date.date()}
							</div>
							<div className="calendar-month-cell-body-date-content">
								{dateInnerContent?.(item.date)}
							</div>
						</div>
					)}
				</div>
			);
		}
		rows.push(row);
	}
	return rows.map((row) => (
		<div className="calendar-month-body-row">{row}</div>
	));
}
```

然后添加上对应的样式：

![image-20240810230010696](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230010696.png)

我们查看一下传入 value 日期的渲染效果：

![image-20240810230038267](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230038267.png)

然后我们加上点击某个列表项的处理：

```tsx
interface MonthCalendarProps extends CalendarProps {
	selectHandler?: (date: Dayjs) => void;
}
```

添加一个 `selectHandler` 的参数，传给 `renderDays` 方法：

![image-20240810230228305](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230228305.png)

然后在`renderDays`里面取出，给日期添加上点击事件：

![image-20240810230333583](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230333583.png)

```tsx
function renderDays(
	days: Array<{ date: Dayjs; currentMonth: boolean }>,
	dateRender: MonthCalendarProps["dateRender"],
	dateInnerContent: MonthCalendarProps["dateInnerContent"],
	value: Dayjs,
	selectHandler: MonthCalendarProps["selectHandler"]
) {
	const rows = [];
	for (let i = 0; i < 6; i++) {
		const row = [];
		for (let j = 0; j < 7; j++) {
			const item = days[i * 7 + j];
			row[j] = (
				<div
					className={
						"calendar-month-body-cell " +
						(item.currentMonth ? "calendar-month-body-cell-current" : "")
					}
					onClick={() => selectHandler?.(item.date)}
				>
					{dateRender ? (
						dateRender(item.date)
					) : (
						<div className="calendar-month-body-cell-date">
							<div
								className={cs(
									"calendar-month-body-cell-date-value",
									value.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD")
										? "calendar-month-body-cell-date-selected"
										: ""
								)}
							>
								{item.date.date()}
							</div>
							<div className="calendar-month-cell-body-date-content">
								{dateInnerContent?.(item.date)}
							</div>
						</div>
					)}
				</div>
			);
		}
		rows.push(row);
	}
	return rows.map((row) => (
		<div className="calendar-month-body-row">{row}</div>
	));
}
```

这个参数是在 Calendar 组件传入的：

![image-20240810230615713](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230615713.png)

```tsx
function Calendar(props: CalendarProps) {
	const { value, style, className, locale, onChange } = props;

	const [currentValue, setCurrentValue] = useState<Dayjs>(value);

	function selectHandler(date: Dayjs) {
		setCurrentValue(date);
		onChange?.(date);
	}

	const classNames = cs("calendar", className);

	return (
		<LocaleContext.Provider
			value={{
				locale: locale || navigator.language
			}}
		>
			<div className={classNames} style={style}>
				<Header />
				<MonthCalendar
					{...props}
					value={currentValue}
					selectHandler={selectHandler}
				/>
			</div>
		</LocaleContext.Provider>
	);
}
```

然后我们尝试一下`value`和`onChange`参数：

```tsx
function App() {
	return (
		<div className="App">
			<Calendar
				value={dayjs("2024-8-10")}
				onChange={(date) => {
					alert(date.format("YYYY-MM-DD"));
				}}
			></Calendar>
		</div>
	);
}
```

效果如下，没问题：

![image-20240810230806989](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810230806989.png)

### Header 相关

接下来我们写 Header 头部相关，包括日期切换和国际化

#### 日期转换

先日期切换，类型弄一下：

```tsx
interface HeaderProps {
	currentMonth: Dayjs;
	prevMonthHandler: () => void;
	nextMonthHandler: () => void;
}
```

根据传入的 value 来展示日期，点击上下按钮的时候会调用传进来的回调函数：

![image-20240810231154196](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810231154196.png)

```tsx
import type { Dayjs } from "dayjs";

interface HeaderProps {
	currentMonth: Dayjs;
	prevMonthHandler: () => void;
	nextMonthHandler: () => void;
}

function Header(props: HeaderProps) {
	const { currentMonth, prevMonthHandler, nextMonthHandler } = props;

	return (
		<div className="calendar-header">
			<div className="calendar-header-left">
				<div className="calendar-header-icon" onClick={prevMonthHandler}>
					&lt;
				</div>
				<div className="calendar-header-value">
					{currentMonth.format("YYYY 年 MM 月")}
				</div>
				<div className="calendar-header-icon" onClick={nextMonthHandler}>
					&gt;
				</div>
				<button className="calendar-header-btn">今天</button>
			</div>
		</div>
	);
}

export default Header;
```

然后在 Calendar 里面创建 state，点击上下按钮的时候，修改月份：

![image-20240810231403409](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810231403409.png)

```tsx
function Calendar(props: CalendarProps) {
	const { value, style, className, locale, onChange } = props;

	const [currentValue, setCurrentValue] = useState<Dayjs>(value);

	const [currentMonth, setCurrentMonth] = useState<Dayjs>(value);

	function selectHandler(date: Dayjs) {
		setCurrentValue(date);
		onChange?.(date);
	}

	function prevMonthHandler() {
		setCurrentMonth(currentMonth.subtract(1, "month"));
	}
	function nextMonthHandler() {
		setCurrentMonth(currentMonth.add(1, "month"));
	}
	const classNames = cs("calendar", className);

	return (
		<LocaleContext.Provider
			value={{
				locale: locale || navigator.language
			}}
		>
			<div className={classNames} style={style}>
				<Header
					currentMonth={currentMonth}
					prevMonthHandler={prevMonthHandler}
					nextMonthHandler={nextMonthHandler}
				/>
				<MonthCalendar
					{...props}
					value={currentValue}
					selectHandler={selectHandler}
				/>
			</div>
		</LocaleContext.Provider>
	);
}
```

测试一下会发现月份变了，当下面的日历没变，因为之前我们用的是传入的 value 计算日历，现在要换成`currrentMonth`来了，上面的 props 类型记得加一下

![image-20240810231706160](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810231706160.png)

然后再次测试，日历转换没问题了，点击也没问题

![image-20240810231744935](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810231744935.png)

然后我们加上今天按钮的处理：

![image-20240810231918048](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810231918048.png)

在 `Calendar` 里传入 `todayHandler`，同时修改日期和当前月份，并且还要调用 onChange 回调。

```tsx
function todayHandler() {
	const date = dayjs(Date.now());

	setCurrentValue(date);
	setCurrentMonth(date);
	onChange?.(date);
}
```

测试一下，原本 10 月 7 日，跳转到今天的 8 月 10 日：

![image-20240810232118934](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232118934.png)

![image-20240810232137678](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232137678.png)

此外，我们希望点击上下月份的日期的时候，能够跳转到那个月的日历，比如点击这个：

![image-20240810232220038](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232220038.png)

我希望点击这个 29 日的时候跳转到 7 月份，切换日期的时候顺便修改下 `currentMonth` 就好了：

![image-20240810232310260](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232310260.png)

测试一下，自动就跳转过来了：

![image-20240810232351970](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232351970.png)

#### 国际化

最后把 Header 的国际化搞一下，把写死的文案，改成从资源包取值的方式就好了

![image-20240810232546291](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232546291.png)

```tsx
function Header(props: HeaderProps) {
	const { currentMonth, prevMonthHandler, nextMonthHandler, todayHandler } =
		props;

	const localeContext = useContext(LocaleContext);
	const CalendarContext = allLocales[localeContext.locale];

	return (
		<div className="calendar-header">
			<div className="calendar-header-left">
				<div className="calendar-header-icon" onClick={prevMonthHandler}>
					&lt;
				</div>
				<div className="calendar-header-value">
					{currentMonth.format(CalendarContext.formatMonth)}
				</div>
				<div className="calendar-header-icon" onClick={nextMonthHandler}>
					&gt;
				</div>
				<button className="calendar-header-btn" onClick={todayHandler}>
					{CalendarContext.today}
				</button>
			</div>
		</div>
	);
}
```

测试一下，手动指定为 `en-US`：

```tsx
function App() {
	return (
		<div className="App">
			<Calendar value={dayjs("2024-8-10")} locale="en-US"></Calendar>
		</div>
	);
}
```

效果如下，毫无问题：

![image-20240810232653638](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232653638.png)

## 优化代码

我们功能就完全实现了，不过我们可以优化一下代码

### 抽离方法

这两个代码一样，可以抽离：

![image-20240810232759737](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232759737.png)

抽离一个方法：

```tsx
function changeDate(date: Dayjs) {
	setCurrentValue(date);
	setCurrentMonth(date);
	onChange?.(date);
}
```

![image-20240810232854659](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810232854659.png)

### 参数多余解决

`renderDays`函数，放在组件外需要传很多参数，而这个函数只有这里用，可以移到组件内：

![image-20240810233123314](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810233123314.png)

这样我们就不需要传入这些参数了，因为是内部的：

![image-20240810233227418](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240810233227418.png)

## 总结

我们实现了一个 Calendar 日历组件，但这里没有区分 value 和 defaultValue，也没有支持两种，待后续完善补充，我们还可以实现一个`fullscreen`用于是否全屏显示，不是全屏就用我们上一节做的那种，更多的可以自己增加完善。

代码仓库地址 Github：[calendar-component](https://github.com/zhenghui-su/calendar-component)
