## MVVM 模型

> M : 模型（Model）：对应 data 中的数据
>
> V：视图（View）：模板
>
> VM：视图模型（ViewModel）：Vue 实例对象

Vue 的设计借鉴了 MVVM 模型

![image-20231102232241049](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231102232241049.png)

> 1. data 中所有的属性，最后都出现在了 vm 身上
> 2. vm 身上所有的属性及 Vue 原型上的所有属性，在 Vue 模板中都可以直接使用
