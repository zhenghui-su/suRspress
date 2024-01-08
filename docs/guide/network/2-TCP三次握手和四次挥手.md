## TCP三次握手

先认识名词

+ seq（sequence number）序列号随机生成的
+ ack（acknowledgement number）确认号ack= seq+ 1
+ ACK（acknowledgement）确定序列号有效
+ SYN（synchronous）发起新连接
+ FIN（FINSH）完成

一张流程图解决

![image-20231006005938847](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231006005938847.png)

我们可以通过Wireshark工具来查看，免费开源

在我们发送http请求之前，有三个TCP连接即三次握手

+ 第一步客户端生成Seq为0发送
+ 第二步服务端让Seq+1验证，验证通过，打上ACK=1
+ 第三步客户端让Seq = 客户端Seq + 1

![image-20231006010148875](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231006010148875.png)

## TCP四次挥手

**超时等待状态（TIME_WAIT）**：如果最后一个过程ACK标记在某个情况下丢失，但那这样服务端就永远不会断开了，就不稳定了，所以为了弥补缺失，执行了超时等待状态，如果丢失，服务器会重新发送断开连接的请求，ACK会重新发送，保证TCP链接可靠

![image-20231006011324944](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231006011324944.png)

我们依旧可以通过工具来查看四次挥手

+ 第一步客户端生成Seq=673
+ 第二步服务端让Seq+1验证，通过，打上标记ACk=674

> 此时进入WAIT_2阶段，如果还有别的任务会在这个阶段进行处理，完成后才进行第三次挥手

+ 第三步服务端发送FIN请求，验证ACK是否正确（通过客户端Seq+1），服务端还会生成一个它对应的Seq
+ 第四步客户端有一个ACK标记，通过服务端的Seq+1验证，它自身的Seq通过客户端自身Seq+1实现，最后CLOSE结束

![image-20231006012149955](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231006012149955.png)