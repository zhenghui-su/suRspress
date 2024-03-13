## 45-Redis( 发布订阅 + 事务 )

### 发布订阅

发布-订阅是一种消息传递模式，其中消息发布者（发布者）将消息发送到频道（channel），而订阅者（订阅者）可以订阅一个或多个频道以接收消息。这种模式允许消息的解耦，发布者和订阅者之间可以独立操作，不需要直接交互。

在Redis中，发布-订阅模式通过以下命令进行操作：

1. **PUBLISH**命令：用于将消息发布到指定的频道。语法为：`PUBLISH channel message`。例如，PUBLISH news "Hello, world!" 将消息"Hello, world!"发布到名为"news"的频道。
2. **SUBSCRIBE**命令：用于订阅一个或多个频道。语法为：`SUBSCRIBE channel [channel ...]`。例如，SUBSCRIBE news sports 订阅了名为"news"和"sports"的频道。
3. **UNSUBSCRIBE**命令：用于取消订阅一个或多个频道。语法为：`UNSUBSCRIBE [channel [channel ...]]`。例如，UNSUBSCRIBE news 取消订阅名为"news"的频道。
4. **PSUBSCRIBE**命令：用于模式订阅一个或多个匹配的频道。语法为：`PSUBSCRIBE pattern [pattern ...]`。其中，pattern可以包含通配符。例如，`PSUBSCRIBE news.` 订阅了以"news."开头的所有频道。
5. **PUNSUBSCRIBE命令**：用于取消模式订阅一个或多个匹配的频道。语法为：`PUNSUBSCRIBE [pattern [pattern ...]]`。例如，`PUNSUBSCRIBE news.` 取消订阅以"news."开头的所有频道。

> 可以开两个cmd，一个做发布一个做订阅

![image-20240307161554462](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307161554462.png)

### 事务

Redis支持事务（Transaction），它允许用户将多个命令打包在一起作为一个单元进行执行。事务提供了一种原子性操作的机制，要么所有的命令都执行成功，要么所有的命令都不执行。

Redis的事务使用MULTI、EXEC、WATCH和DISCARD等命令来管理。

1. MULTI命令：用于开启一个事务。在执行MULTI命令后，Redis会将接下来的命令都添加到事务队列中，而不是立即执行。
2. EXEC命令：用于执行事务中的所有命令。当执行EXEC命令时，Redis会按照事务队列中的顺序执行所有的命令。执行结果以数组的形式返回给客户端。
3. WATCH命令：用于对一个或多个键进行监视。如果在事务执行之前，被监视的键被修改了，事务将被中断，不会执行。
4. DISCARD命令：用于取消事务。当执行DISCARD命令时，所有在事务队列中的命令都会被清空，事务被取消。

使用事务的基本流程如下：

1. 使用MULTI命令开启一个事务。
2. 将需要执行的命令添加到事务队列中。
3. 如果需要，使用WATCH命令监视键。
4. 执行EXEC命令执行事务。Redis会按照队列中的顺序执行命令，并返回执行结果。
5. 根据返回结果判断事务执行是否成功。

事务中的命令在执行之前不会立即执行，而是在执行EXEC命令时才会被执行。这意味着事务期间的命令并不会阻塞其他客户端的操作，也不会中断其他客户端对键的读写操作。

需要注意的是，`Redis的事务不支持回滚操作`。如果在事务执行期间发生错误，事务会继续执行，而不会回滚已执行的命令。因此，在使用Redis事务时，需要保证事务中的命令是幂等的，即多次执行命令的结果和一次执行的结果相同

```sh
# 连接Redis
redis-cli

# 开启事务
MULTI

# 添加命令到事务队列
SET key1 chenchen
GET key2

# 执行事务
EXEC
```

![image-20240307184808560](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307184808560.png)