## 51-lua + Redis( 限流阀 )

### 限流功能

目前我们学习了`redis`,`lua`,`nodejs`，于是可以结合起来做一个限流功能，好比一个抽奖功能，你点击次数过多，就会提示请稍后重试，进行限制，我们来实现一下该功能。

### 安装依赖

```sh
npm i ioredis express
```

### 代码编写

index.js

- express 帮我们提供接口
- ioredis可以运行lua脚本，并且连接redis服务
- 我们做了三个常量 第一个TIME 就是说控制一个时间例如30秒之内的操作，第二个CHANGE，就是控制次数，比如操作了五次。第三个就是key，就是往redis存储的值，定义了限流阀三个常量
- redis.eval 第一个参数就是lua的代码我们用fs读取了它，第二个参数是key的数量我们有1个，第三个参数就是key，第四个是arguments，第五个也是arguments，第六个是个回调成功的失败，成功会接受返回值

```js
import express from 'express'
import Redis from 'ioredis'
import fs from 'node:fs'
const lua = fs.readFileSync('./index.lua', 'utf8')
const redis = new Redis()
const app = express()
//限流阀

const TIME = 30
const CHANGE = 5
const KEY = 'lottery'

app.use('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next()
})

app.get('/lottery', (req, res) => {
    //lua 就是lua的脚本
    //1 代表有一个key
    //key就是接受的key
    //TIME 是 第一个参数
    //CHANGE 是 第二个参数
    redis.eval(lua, 1, KEY, CHANGE, TIME, (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result === 1) {
            res.send('抽奖成功')
        } else {
            res.send('请稍后重试！')
        }
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})
```

index.lua

- `KEYS | ARGV 全局变量注意只能用在redis里面`
- tonumber就是将字符串转换为数字类型
- redis.call 就是调用redis的命令
- incr 就是递增值
- expire 就是存储过期时间
- 大致思路就是先读取值如果值存在并且超过限流阀则返回0表示操作频繁，否则点击一次累加一次

```lua
local key = KEYS[1] --接受key值
local limit = tonumber(ARGV[1]) 
local interval = tonumber(ARGV[2])
local count = tonumber(redis.call("get", key) or "0")

if count  > limit then
    return 0
else
    redis.call("incr", key) -- lottery: 0++ 1 2 3 4 5
    redis.call("expire", key, interval) -- lottery: 0 1 2 3 4 5
    return 1
end
```

index.html 代码测试

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn">抽奖</button>
    <script>
       const btn = document.getElementById('btn');
       btn.onclick = function(){
           fetch('http://localhost:3000/lottery').then(res=>{
               return res.text()
           }).then(data=>{
               console.log(data)
               alert(data)
           })
       }
    </script>
</body>
</html>
```

正常点击

![image-20240310212258408](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240310212258408.png)

超过五次

![image-20240310212332626](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240310212332626.png)

我们通过可视化工具可以查看到Redis中数值已经超过5了，所以限制了

![image-20240310212423397](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240310212423397.png)