# nest cli 常用命令

我们可以通过`nest --help`来查看 nest 所有的命令

它的命令和 angular 很相似

![image-20240518183309762](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518183309762.png)

## 生成 controller.ts

我们可以通过`nest g co user`来生成一段 controller 代码

![image-20240518183542656](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518183542656.png)

## 生成 module.ts

我们可以通过`nest g mo user`来生成一段 module 代码

![image-20240518183656973](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518183656973.png)

## 生成 service.ts

我们可以通过`nest g s user`来生成一段 service 代码

![image-20240518183822292](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518183822292.png)

## 生成 CRUD

上面生成都有点太慢了，能不能一次性生成一个 crud 的代码呢？

我们通过`nest g resource chen`来生成和 chen 相关的 crud 代码，我们选择 REST 的 API

![image-20240518184029260](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518184029260.png)

然后我们选择生成 CRUD 即可

![image-20240518184106615](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518184106615.png)

第一次使用这个命令的时候，除了生成文件之外还会自动使用包管理器帮我们更新资源，安装一些额外的插件，后续再次使用就不会更新了。

![image-20240518184155316](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518184155316.png)

我们打开`chen.controller.ts`看看，会发现生成了一个 CRUD 的模板

![image-20240518184300402](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240518184300402.png)
