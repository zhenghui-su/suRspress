## 48-Redis(  ioredis )

ioredis 是一个强大且流行的 Node.js 库，用于与 Redis 进行交互。Redis 是一个开源的内存数据结构存储系统。ioredis 提供了一个简单高效的 API，供 Node.js 应用程序与 Redis 服务器进行通信。

以下是 ioredis 的一些主要特点：

1. 高性能：ioredis 设计为快速高效。它支持管道操作，可以在一次往返中发送多个 Redis 命令，从而减少网络延迟。它还支持连接池，并且可以在连接丢失时自动重新连接到 Redis 服务器。
2. Promises 和 async/await 支持：ioredis 使用 promises，并支持 async/await 语法，使得编写异步代码和处理 Redis 命令更加可读。
3. 集群和 sentinel 支持：ioredis 内置支持 Redis 集群和 Redis Sentinel，这是 Redis 的高级功能，用于分布式设置和高可用性。它提供了直观的 API，用于处理 Redis 集群和故障转移场景。
4. Lua 脚本：ioredis 允许你使用 `eval` 和 `evalsha` 命令在 Redis 服务器上执行 Lua 脚本。这个功能使得你可以在服务器端执行复杂操作，减少客户端与服务器之间的往返次数。
5. 发布/订阅和阻塞命令：ioredis 支持 Redis 的发布/订阅机制，允许你创建实时消息系统和事件驱动架构。它还提供了对 `BRPOP` 和 `BLPOP` 等阻塞命令的支持，允许你等待项目被推送到列表中并原子地弹出它们。
6. 流和管道：ioredis 支持 Redis 的流数据类型，允许你消费和生成数据流。它还提供了一种方便的方式将多个命令进行管道化，减少与服务器之间的往返次数。

### 使用方法

安装

```bash
npm i ioredis
```

连接redis

```js
import Ioredis from 'ioredis'

const ioredis = new Ioredis({
    host: '127.0.0.1', //ip
    port: 6379, //端口
})
```

1. 字符串

```js
//存储字符串并且设置过期时间
ioredis.setex('key', 10, 'value') 
//普通存储
ioredis.set('key', 'value')
//读取
ioredis.get('key')
```

2. 集合

```js
// 添加元素到集合
redis.sadd('myset', 'element1', 'element2', 'element3');

// 从集合中移除元素
redis.srem('myset', 'element2');

// 检查元素是否存在于集合中
redis.sismember('myset', 'element1').then((result) => {
  console.log('Is member:', result); // true
});

// 获取集合中的所有元素
redis.smembers('myset').then((members) => {
  console.log('Members:', members);
});
```

3. 哈希

```js
// 设置哈希字段的值
redis.hset('myhash', 'field1', 'value1');
redis.hset('myhash', 'field2', 'value2');

// 获取哈希字段的值
redis.hget('myhash', 'field1').then((value) => {
  console.log('Value:', value); // "value1"
});

// 删除哈希字段
redis.hdel('myhash', 'field2');

// 获取整个哈希对象
redis.hgetall('myhash').then((hash) => {
  console.log('Hash:', hash); // { field1: 'value1' }
});
```

4. 队列

```js
// 在队列的头部添加元素
redis.lpush('myqueue', 'element1');
redis.lpush('myqueue', 'element2');

// 获取队列中所有元素
redis.lrange('myqueue', 0, -1).then((elements) => {
  console.log('Queue elements:', elements);
});
//获取长度
redis.llen('myqueue').then((length) => {
  console.log('Queue length:', length);
});
```

### 发布订阅

```js
// 引入 ioredis 库
import Ioredis from 'ioredis';

// 创建与 Redis 服务器的连接
const ioredis = new Ioredis({
  host: '127.0.0.1',
  port: 6379,
});

// 创建另一个 Redis 连接实例
const redis2 = new Ioredis();

// 订阅频道 'channel'
ioredis.subscribe('channel');

// 监听消息事件
ioredis.on('message', (channel, message) => {
  console.log(`Received a message from channel ${channel}: ${message}`);
});

// 发布消息到频道 'channel'
redis2.publish('channel', 'hello world');
```