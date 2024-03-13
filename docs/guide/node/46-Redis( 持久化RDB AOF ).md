## 46-Redis( 持久化RDB AOF )

### redis持久化

Redis提供两种持久化方式：

1. RDB（Redis Database）持久化：RDB是一种快照的形式，它会将内存中的数据定期保存到磁盘上。可以通过配置Redis服务器，设置自动触发RDB快照的条件，比如在指定的时间间隔内，或者在指定的写操作次数达到一定阈值时进行快照保存。RDB持久化生成的快照文件是一个二进制文件，包含了Redis数据的完整状态。在恢复数据时，可以通过加载快照文件将数据重新加载到内存中。
2. AOF（Append-Only File）持久化：AOF持久化记录了Redis服务器执行的所有写操作命令，在文件中以追加的方式保存。当Redis需要重启时，可以重新执行AOF文件中保存的命令，以重新构建数据集。相比于RDB持久化，AOF持久化提供了更好的数据恢复保证，因为它记录了每个写操作，而不是快照的形式。然而，AOF文件相对于RDB文件更大，恢复数据的速度可能会比较慢。

### RDB使用

打开redis配置文件

![image-20240307191041743](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307191041743.png)

找到save

![image-20240307191118723](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307191118723.png)

他提供了三个案例

1. 3600秒内也就是一小时进行一次改动就会触发快照
2. 300秒内也就是5分钟，进行100次修改就会进行快照
3. 60秒内一万次修改就会进行快照

具体场景需要根据你的用户量，以及负载情况自己定义.

![image-20240307191134609](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307191134609.png)

其次就是可以通过命令行手动触发快照

![image-20240307191217801](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307191217801.png)

### AOF使用

将 `appendonly` 配置项的值设置为 `yes`：默认情况下，该配置项的值为 `no`，表示未启用AOF持久化。将其值修改为 `yes`，以启用AOF持久化。

![image-20240307191244697](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240307191244697.png)