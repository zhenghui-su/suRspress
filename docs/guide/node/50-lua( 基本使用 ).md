## 50-lua( lua的基本使用 )

### lua基本使用

全局变量局部变量

- 全局变量是在全局作用域中定义的变量，可以在脚本的任何地方访问。
- 全局变量在定义时不需要使用关键字，直接赋值即可。

```lua
chen = 'chenchen'

print(chen)
```

- 局部变量是在特定作用域内定义的变量，只能在其所属的作用域内部访问。
- 局部变量的作用域通常是函数体内部，也可以在代码块（使用 `do...end`）中创建局部变量。
- 在局部作用域中，可以通过简单的赋值语句定义局部变量。

```lua
--local 定义局部变量
local chen = 'susu'

print(chen)
```

条件语句

在Lua中，条件判断语句可以使用 `if`、`elseif` 和 `else` 关键字来实现

```lua
local su = 'chenchen'

if su == "chenchen" then
    print("chenchen")
elseif su == "chenchen1" then
    print("chenchen1")
else
    print("not su")
end
```

函数

在Lua中，函数是一种可重复使用的代码块，用于执行特定的任务或操作

```lua
local su = 'chenchen'

function func(name)
    if name == "chenchen" then
        print("chenchen")
        return 1
    elseif name == "chenchen1" then
        print("chenchen1")
        return 2
    else
        print("not su")
        return 3
    end
end

local result = func(su)
print(result)
```

### 数据类型

1. `nil`：**表示无效值或缺失值**。
2. `boolean`：**表示布尔值，可以是 `true` 或 `false`**。
3. `number`：**表示数字，包括整数和浮点数**。
4. `string`：**表示字符串，由字符序列组成**。
5. `table`：**表示表，一种关联数组，用于存储和组织数据**。
6. `function`：**表示函数，用于封装可执行的代码块**。
7. `userdata`：表示用户自定义数据类型，通常与C语言库交互使用。
8. `thread`：表示协程，用于实现多线程编程。
9. `metatable`：表示元表，用于定义表的行为。

常用数据类型用法

```lua
type = false --布尔值
type = nil --就是null
type = 1 --整数
type = 1.1 --浮点型
type = 'susu' --字符串
print(type)
```

字符串拼接 `..`

```lua
local s = 'ch'
local u = 'en'
print(s .. u)
```

table 可以描述 对象和数组

> lua索引从1开始

```lua
--对象
table = {
    name = "chenchen",
    age = 18
}
print(table.name)
print(table.age)
--数组
arr = {1,2,3,4,6}
print(arr[1])
```

循环

```lua
for i = 1, 10, 3 do --开始 结束 步长  步长就是递增数量
    print(i)
end
```

循环table

```lua
arr = {name = "hello", age = 18, sex = "male"}
for k, v in pairs(arr) do
    print(k, v)  --key 和 value 也就是 name 和 hello ...
end
```

循环数组

```lua
local arr = {10,20,30}

for i, v in ipairs(arr) do
    print(i,v)
end
```

### 模块化

test.lua 暴露一个方法add

```lua
local M = {}

function M.add(a, b)
    return a + b
end

return M
```

index.lua 引入该文件调用add方法

```lua
local math = require('test')

local r = math.add(1, 2)

print(r)
```
