## 33-SQL语句

SQL（Structured Query Language）是一种用于管理关系型数据库系统的语言。它是一种标准化语言，用于执行各种数据库操作，包括数据查询、插入、更新和删除等。

### 数据库的操作

+ 创建数据库

```sql
create database 库名
```

如果进行重复的创建就会失败，不允许重复创建

![image-20240217160544866](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217160544866.png)

为了避免这个问题 可以添加`if not exists`

```sql
create database if not exists `susu`
```

![image-20240217160713437](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217160713437.png)

如果数据库不存在就创建，存在就什么都不做，我宁愿不做，也不愿犯错。

添加字符集`utf-8`，这样后面数据库中可以添加中文数据

```sql
create database `susu`
    default character set = 'utf8mb4';
```

### 数据表

+ 创建表

```sql
CREATE TABLE `user` (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(100) COMMENT '名字',
   age int COMMENT '年龄',
   address varchar(255) COMMENT '地址',
   create_time timestamp DEFAULT CURRENT_TIMESTAMP  COMMENT '创建时间'
) COMMENT '用户表'
```

解析如下

create table 表名字 (

1. `id`字段名称   `int`数据类型代表数字类型   `NOT NULL`(不能为空)  `AUTO_INCREMENT`(id自增) `PRIMARY KEY`(id为主键)
2. `name`(字段名称) `varchar(100)`字符串类型100字符 `COMMENT`(注释)
3. `age`(字段名称) `int`数据类型代表数字类型  `COMMENT`(注释)
4. `create_time`(字段名称) `timestamp`(时间戳) `DEFAULT CURRENT_TIMESTAMP`(自动填充创建时间)

)

![image-20240217160945097](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217160945097.png)

+ 修改表名

```sql
ALTER TABLE `user` RENAME `user2`;
```

![image-20240217161111594](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217161111594.png)

+ 增加列

```sql
ALTER TABLE `user` Add COLUMN `hobby` VARCHAR(200) ;
```

![image-20240217161202667](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217161202667.png)

+ 删除列

```sql
ALTER TABLE `user` DROP COLUMN `hobby`;
```

![image-20240217161234880](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217161234880.png)

+ 编辑列

```sql
ALTER TABLE `user` MODIFY COLUMN `age` VARCHAR(255) NULL COMMENT '年龄2';
```

![image-20240217161329503](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240217161329503.png)