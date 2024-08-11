# 快速掌握 Storybook

我们已经写了一个基础组件了，以后作为组件库的公共组件，但这个需要提供文档别人才知道如何使用。

这时候我们可以用 Storybook，它是非常流行的构建组件文档的工具，现有 80k 的 star 了

## 创建

我们新建一个项目：

```sh
npx create-react-app --template typescript sb-test
```

然后进入项目终端，执行 storybook 的初始化：

```sh
npx storybook@latest init
```

在高版本下，会自动下载依赖相关，然后启动浏览器：

![image-20240811162715255](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811162715255.png)

打开`package.json`，会发现自动添加了一个命令，我们也可以手动运行`npm run storybook`来启动

![image-20240811162822200](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811162822200.png)

## 功能

我们再次查看，会发现这三个组件不是我们做的

![image-20240811162955609](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811162955609.png)

storybook 初始化的时候自带了三个 demo 组件，我们利用它们来了解一下相关功能

![image-20240811163049010](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163049010.png)

`.storybook` 下的是配置文件， `src/stories` 下的是展示文档用的组件。

### 通过 Button 来了解

我们先来看`Button.tsx`，其实就是传入几个参数，渲染出一个 button：

![image-20240811163257003](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163257003.png)

然后再看`Button.stories.ts`，它导出了几种 Button 的 props：

![image-20240811163401700](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163401700.png)

导出的这几个 Story 类型的对象是啥呢？是用来渲染不同 story 的，比如 Primary

![image-20240811163429971](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163429971.png)

再比如 Large：

![image-20240811163503830](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163503830.png)

也就是说 Button 组件传入不同参数的时候渲染的结果，我们可以自己加一个 Story 试一下：

![image-20240811163616624](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163616624.png)

再次查看页面，就会发现多了一个：

![image-20240811163650767](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163650767.png)

也就是说吗，Storybook 把同一个组件传入不同 props 的情况，叫做一个 Story，一个组件包含多个 Story，一个文档里又包含多个组件，和一本书的目录差不多，所以这个工具叫做 Storybook。

### 组件文档

除了这个不同的 story，最上面还有一个生成的组件文档即 Docs：

![image-20240811163854865](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811163854865.png)

它列出了每一个 props 的描述，它是从注释中拿到的，比如我们改一下：

![image-20240811164003750](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164003750.png)

然后查看页面的 Description，变化了：

![image-20240811164033200](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164033200.png)

我们可以再改一个，改组件整体的描述：

![image-20240811164136222](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164136222.png)

查看页面，刷新一下，变化了：

![image-20240811164158945](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164158945.png)

而且下面的参数都是可以调试然后实时查看组件的渲染结果，让它非常的方便：

![image-20240811164331938](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164331938.png)

我们也可以选择完毕后，直接复制它的 jsx 代码：

![image-20240811164435768](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164435768.png)

### 自定义渲染

之前我们通过 args 传入参数来渲染，我们还可以选择 render 函数自定义渲染：

![image-20240811164717519](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164717519.png)

当然需要注意，使用这个方法，需要把后缀改为`tsx`类型，因为有 jsx 相关类型，不能用 ts 后缀。

render 函数的参数就是上面的 args，然后我们查看页面，内容就是我们自定义的了：

![image-20240811164842055](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811164842055.png)

### 自定义执行事件

有些组件不只是传入 props，还需要一些输入事件，点击事件，strorybook 也支持自定义这些：

![image-20240811165216933](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811165216933.png)

比如这里它会找到内容为 SuSu 的 button 按钮，然后点击，随后将文字改为 chen

组件在渲染完毕后就会自动执行 play 函数相关：

![image-20240811165325743](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811165325743.png)

当然这里只是举例，一般点击我们用于测试表单相关

### 请求数据

我们还可以在渲染组件之前请求数据，然后把数据传入 render 函数再渲染：

![image-20240811165636032](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811165636032.png)

通过 loaders 来请求数据，然后通过 render 的第二个参数 meta 就可以取出数据了

渲染的结果如下，没有问题：

![image-20240811165722607](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811165722607.png)

### 测试脚本

上面的 play 函数看起来很像测试脚本，其实它确实可以当做测试脚本使用

我们使用 expect 来断言，比如这里断言文字和颜色是否正确：

![image-20240811170032114](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811170032114.png)

然后我们打开页面，可以查看 Interactions 选项，自动执行了断言：

![image-20240811170138162](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811170138162.png)

我们故意改错一下，expect 失败就是下面的，也列出了预期和实际的值

![image-20240811170212819](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811170212819.png)

这样组件有没有通过测试用例，打开就可以查看了。

### test-cli

组件如果一多，各个测试总不能一个个点开看吧，这时候就可以用 cli 跑了，安装一下库：

```sh
npm install @storybook/test-runner --save-dev
```

新建脚本`"test-storybook": "test-storybook"`，然后运行，结果如下：

> 如果报错，可能是无头浏览器的问题，npx playwright install 下载完即可，下载慢请耐心等待

![image-20240811175144329](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175144329.png)

这样就自动运行脚本测试了

### meta 信息

上面的文件除了 Story 之外，还会导出 meta 信息：

![image-20240811171449521](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811171449521.png)

这些非常简单，我们快速过一下

#### title

title 就是标题，我们改一下就知道了：

![image-20240811171539651](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811171539651.png)

结果在这里：

![image-20240811171627383](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811171627383.png)

#### component

这个不必多说，就是你的组件是哪个

#### paremeters

##### layout

里面自带了一个 layout，就是位置的意思，我们注释一下，就发现位置从中间变到左上角了：

![image-20240811171816747](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811171816747.png)

##### background

这里还可以配置背景色：

![image-20240811172054838](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172054838.png)

然后可以在这里点击切换，最上面是清除背景颜色：

![image-20240811172137621](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172137621.png)

#### argTypes

这个就是用来控制这里的：

![image-20240811172326410](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172326410.png)

我们改一下：

![image-20240811172345793](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172345793.png)

然后再查看，就发现变成输入框了：

![image-20240811172406117](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172406117.png)

具体什么类型的参数用什么控件，可以用到的时候查一下，文档地址：[Annotation](https://storybook.js.org/docs/essentials/controls#annotation)

![image-20240811172526470](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172526470.png)

### MDX 文档

Storybook 也支持写 MDX 文档，MDX 是 markdown 和 jsx 的混合，你可以在 markdown 里面用组件

比如初始化的时候也生成了`Configure.mdx`文件：

![image-20240811172722366](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172722366.png)

它就是启动后的这里：

![image-20240811172811868](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811172811868.png)

我们可以自己添加一个：

![image-20240811173300405](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811173300405.png)

然后查看页面：

![image-20240811173322740](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811173322740.png)

这样，当你想在组件文档里加一些别的说明文档，就可以这样加。

### 组件文档格式

组件文档的格式也是可以自定义的，可以在 `.storybook` 下的 `preview.tsx` 里配置这个：

![image-20240811174715509](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811174715509.png)

![image-20240811174627388](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811174627388.png)

## Calendar 组件文档

我们已经大概过了一遍功能，然后我们把上一节的 Calendar 配置一下，复制 Calendar 目录

![image-20240811174907941](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811174907941.png)

然后在 stories 目录下添加一个 `Calendar.stories.tsx`

> 这里我加上了受控和非受控，如果你没有加过，就删除了 DefaultValue 即可

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import Calendar from "../Calendar/index";
import dayjs from "dayjs";

const meta = {
	title: "日历组件",
	component: Calendar,
	parameters: {
		layout: "centered"
	},
	tags: ["autodocs"]
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultValue: Story = {
	args: {
		defaultValue: dayjs("2024-8-11")
	}
};

export const Value: Story = {
	args: {
		value: dayjs("2024-8-11")
	}
};
export const DateRender: Story = {
	args: {
		value: dayjs("2024-8-11"),
		dateRender(currentDate) {
			return <div>日期{currentDate.date()}</div>;
		}
	}
};

export const DateInnerContent: Story = {
	args: {
		value: dayjs("2024-8-11"),
		dateInnerContent(currentDate) {
			return <div>日期{currentDate.date()}</div>;
		}
	}
};

export const Locale: Story = {
	args: {
		value: dayjs("2024-8-11"),
		locale: "en-US"
	}
};
```

我们添加了这几个 Story，然后安装一下组件用到的库：

```sh
npm install --save classnames

npm install --save dayjs

npm install --save-dev sass
# 如果没有做受控非受控就不用下 ahooks
npm install --save ahooks
```

再次启动运行`npm run storybook`，然后查看，没问题了

![image-20240811175731622](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175731622.png)

我们试一下几个 Story，例如 DateRender 和 DateInnerContent

![image-20240811175806808](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175806808.png)

![image-20240811175848199](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175848199.png)

再看一下国际化：

![image-20240811175912101](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175912101.png)

### 问题解决

有个小问题，value 的显示不是很对：

![image-20240811175959658](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811175959658.png)

现在我们要传入的是 dayjs 对象，就算是用了 date 的控件也不行，修改日期点击刷新后，会报错：

![image-20240811180158367](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811180158367.png)

因为控件传入的是一个 date 的毫秒值，那怎么办呢？这时候就要把 story 改成 render 的方式了：

![image-20240811180311859](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811180311859.png)

然后我们修改 value，就不会报错了。

![image-20240811182510757](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240811182510757.png)

不过需要注意，默认值 defaultValue 改了之后是不会生效的，这里之所以也加上自定义 render 是为了防止修改后也传入毫秒导致报错。

至此我们就快速掌握了 Storybook，在构建组件文档库的时候确实是非常方便的。
