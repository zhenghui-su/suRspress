# tsconfig.json 配置

`tsconfig.json`是 TS 相关的配置文件，可以通过`tsc --init`快速生成

## 配置详情

如下，都给出了注释：

```json
{
	"compilerOptions": {
		"incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
		"tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
		"diagnostics": true, // 打印诊断信息
		"target": "ES5", // 目标语言的版本
		"module": "CommonJS", // 生成代码的模板标准
		"outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
		"lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
		"allowJS": true, // 允许编译器编译JS，JSX文件
		"checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
		"outDir": "./dist", // 指定输出目录
		"rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
		"declaration": true, // 生成声明文件，开启后会自动生成声明文件
		"declarationDir": "./file", // 指定生成声明文件存放目录
		"emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
		"sourceMap": true, // 生成目标文件的sourceMap文件
		"inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
		"declarationMap": true, // 为声明文件生成sourceMap
		"typeRoots": [], // 声明文件目录，默认时node_modules/@types
		"types": [], // 加载的声明文件包
		"removeComments": true, // 删除注释
		"noEmit": true, // 不输出文件,即编译后不会生成任何js文件
		"noEmitOnError": true, // 发送错误时不输出任何文件
		"noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
		"importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
		"downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
		"strict": true, // 开启所有严格的类型检查
		"alwaysStrict": true, // 在代码中注入'use strict'
		"noImplicitAny": true, // 不允许隐式的any类型
		"strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
		"strictFunctionTypes": true, // 不允许函数参数双向协变
		"strictPropertyInitialization": true, // 类的实例属性必须初始化
		"strictBindCallApply": true, // 严格的bind/call/apply检查
		"noImplicitThis": true, // 不允许this有隐式的any类型
		"noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
		"noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
		"noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
		"noImplicitReturns": true, //每个分支都会有返回值
		"esModuleInterop": true, // 允许export=导出，由import from 导入
		"allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
		"moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
		"baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
		"paths": {
			// 路径映射，相对于baseUrl
			// 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
			"jquery": ["node_modules/jquery/dist/jquery.min.js"]
		},
		"rootDirs": ["src", "out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
		"listEmittedFiles": true, // 打印输出文件
		"listFiles": true // 打印编译的文件(包括引用的声明文件)
	},
	// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
	"include": ["src/**/*"],
	// 指定一个排除列表（include的反向操作）
	"exclude": ["demo.ts"],
	// 指定哪些文件使用该配置（属于手动一个个指定文件）
	"files": ["demo.ts"]
}
```

我们介绍几个常用的：

## include

指定编译文件路径，默认是编译当前目录下所有的 ts 文件

```ts
"include": ["src/**/*", "index.ts"]
```

这个就代表编译`src`目录下的所有 ts 相关文件，还有编译`index.ts`文件

## exclude

指定一个排除列表，和上面的`include`相反

## target

指定编译到目标 JS 的版本，比如 ES5

```ts
let a: number = 1;
```

这个通过`tsc`编译后就会变成`var a = 1`，因为 `let` 语法在 ES5 版本没有

## allowJS

是否允许编译器编译 JS，JSX 文件，就是 JS，JSX 文件也允许被编译

## removeComments

是否允许在编译过程中删除文件注释，这个就是用来减小体积的

## rootDir

要编译文件的根目录，字面意思

## outDir

编译结果产物的输出目录，字面意思

## sourceMap

是否生成目标文件的`sourceMap`文件，这个一般是开启，`sourceMap`文件一般用于打包后运行打包产物，如果有报错，我们可以通过`sourceMap`文件定位到我们开发时报错的地方是哪一个文件，`sourceMap`即代码源文件

## strict

是否开启严格模式，这个之前也使用过

## path

这个是路径映射，相对于 baseUrl，可以理解为别名配置：

```json
"paths": {
    "@/*": [
        "./src/*"
    ]
}
```

这样我们在导入`src`目录下文件就可以这样导入，比如：

```ts
import a from "@/a";
```

## module

模块标准，默认为 CommonJS 规范，可以选 ESModule、AMD、UMD 等规范
