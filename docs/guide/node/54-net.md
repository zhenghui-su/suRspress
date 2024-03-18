## 54-net

`net`模块是Node.js的核心模块之一，它提供了用于创建基于网络的应用程序的API。`net`模块主要用于创建TCP服务器和`TCP`客户端，以及处理网络通信。

![image-20240318192138907](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240318192138907.png)

TCP（Transmission Control Protocol）是一种面向连接的、可靠的传输协议，用于在计算机网络上进行数据传输。它是互联网协议套件（TCP/IP）的一部分，是应用层和网络层之间的传输层协议。

TCP的主要特点包括：

1. 可靠性：TCP通过使用确认机制、序列号和重传策略来确保数据的可靠传输。它可以检测并纠正数据丢失、重复、损坏或失序的问题。
2. 面向连接：在进行数据传输之前，TCP需要在发送方和接收方之间建立一个连接。连接的建立是通过三次握手来完成的，确保双方都准备好进行通信。
3. 全双工通信：TCP支持双方同时进行双向通信，即发送方和接收方可以在同一时间发送和接收数据。
4. 流式传输：TCP将数据视为连续的字节流进行传输，而不是离散的数据包。发送方将数据划分为较小的数据块，但TCP在传输过程中将其作为连续的字节流处理。
5. 拥塞控制：TCP具备拥塞控制机制，用于避免网络拥塞和数据丢失。它通过动态调整发送速率、使用拥塞窗口和慢启动算法等方式来控制数据的发送速度。

### 场景

#### 服务端之间的通讯

服务端之间的通讯可以直接使用TCP通讯，而不需要上升到http层

server.js

创建一个TCP服务，并且发送套接字，监听端口号3000

```javascript
import net from 'net'

const server = net.createServer((socket) => {
   setInterval(()=>{
       socket.write('chenchen')
   },1000)
})
server.listen(3000,()=>{
    console.log('listening on 3000')
})
```

client.js

连接server端，并且监听返回的数据

```javascript
import net from 'net'

const client = net.createConnection({
    host: '127.0.0.1',
    port: 3000,
})

client.on('data', (data) => {
    console.log(data.toString())
})
```

#### 传输层实现http协议

创建一个TCP服务

```javascript
import net from 'net'

const http = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString())
    })
})
http.listen(3000,()=>{
     console.log('listening on 3000')
})
```

`net.createServer`创建 `Unix` 域套接字并且返回一个server对象接受一个回调函数

`socket`可以监听很多事件

1. `close` 一旦套接字完全关闭就触发
2. `connect` 当成功建立套接字连接时触发
3. `data` 接收到数据时触发
4. `end` 当套接字的另一端表示传输结束时触发，从而结束套接字的可读端

通过node http.js 启动之后我们使用浏览器访问一下，打不开，但控制台输出了如下

![image-20240318193127976](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240318193127976.png)

可以看到浏览器发送了一个http get 请求 我们可以通过关键字get 返回相关的内容例如`html`

```javascript
import net from 'net'

const html = `<h1>TCP Server</h1>`

const reposneHeader = [
    'HTTP/1.1 200 OK',
    'Content-Type: text/html',
    'Content-Length: ' + html.length,
    'Server: Nodejs',
    '\r\n',
    html
]

const http = net.createServer((socket) => {
    socket.on('data', (data) => {
        if(/GET/.test(data.toString())) {
            socket.write(reposneHeader.join('\r\n'))
            socket.end()
        }
    })
})
http.listen(3000, () => {
    console.log('listening on 3000')
})
```

这时我们再访问localhost:3000就会有信息了

![image-20240318193416306](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240318193416306.png)