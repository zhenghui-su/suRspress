## 40-ORM( Prisma + express )

### 什么是 prisma?

Prisma 是一个现代化的数据库工具套件，用于简化和改进应用程序与数据库之间的交互。它提供了一个类型安全的查询构建器和一个强大的 ORM（对象关系映射）层，使开发人员能够以声明性的方式操作数据库。

Prisma 支持多种主流数据库，包括 PostgreSQL、MySQL 和 SQLite，它通过生成标准的数据库模型来与这些数据库进行交互。使用 Prisma，开发人员可以定义数据库模型并生成类型安全的查询构建器，这些构建器提供了一套直观的方法来创建、更新、删除和查询数据库中的数据。

Prisma 的主要特点包括：

1. 类型安全的查询构建器：Prisma 使用强类型语言（如 TypeScript）生成查询构建器，从而提供了在编译时捕获错误和类型检查的能力。这有助于减少错误，并提供更好的开发人员体验。
2. 强大的 ORM 层：Prisma 提供了一个功能强大的 ORM 层，使开发人员能够以面向对象的方式操作数据库。它自动生成了数据库模型的 CRUD（创建、读取、更新、删除）方法，简化了与数据库的交互。
3. 数据库迁移：Prisma 提供了数据库迁移工具，可帮助开发人员管理数据库模式的变更。它可以自动创建和应用迁移脚本，使数据库的演进过程更加简单和可控。
4. 性能优化：Prisma 使用先进的查询引擎和数据加载技术，以提高数据库访问的性能。它支持高级查询功能，如关联查询和聚合查询，并自动优化查询以提供最佳的性能

### 安装使用

1. 安装 Prisma CLI：
   - 使用 npm 安装：运行 `npm install -g prisma`。
   - 使用 yarn 安装：运行 `yarn global add prisma`。
2. 初始化项目
   - 使用`prisma init --datasource-provider mysql`

此时就会创建生成基本目录

![image-20240229211014781](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240229211014781.png)

3. 连接mysql

- 修改.env文件 `[DATABASE_URL="mysql://账号:密码@主机:端口/库名"]`
- 例子 `DATABASE_URL="mysql://root:123456@localhost:3306/su"`

### 创建表

prisma/schema.prisma

> 没有高亮可以去扩展搜索prisma下载，在右下角语言关联prisma即可

```javascript
// 文章表
model Post {
  id       Int     @id @default(autoincrement()) //id 整数 自增
  title    String  //title字符串类型
  publish  Boolean @default(false) //发布 布尔值默认false
  author   User   @relation(fields: [authorId], references: [id]) //作者 关联用户表 关联关系 authorId 关联user表的id
  authorId Int
}
// 用户表 一个用户可以发多个文章 一对多的关系
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique //唯一
  posts Post[] // 一对多的关系
}
```

执行命令 创建表

```sh
prisma migrate dev
```

![image-20240229212256739](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240229212256739.png)

### 实现增删改查

```typescript
import express from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const app = express()
const port: number = 3000

app.use(express.json())

//关联查找
app.get('/', async (req, res) => {
    const data = await prisma.user.findMany({
        include: {
            posts: true
        }
    })
    res.send(data)
})
//单个查找
app.get('/user/:id', async (req, res) => {
   const row =  await prisma.user.findMany({
        where: {
            id: Number(req.params.id)
        }
    })
    res.send(row)
})
//新增
app.post('/create', async (req, res) => {
    const { name, email } = req.body
    const data = await prisma.user.create({
        data: {
            name,
            email,
            posts: {
                create: {
                    title: '标题',
                    publish: true
                },
            }
        }
    })
    res.send(data)
})

//更新
app.post('/update', async (req, res) => {
    const { id, name, email } = req.body
    const data = await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            email
        }
    })
    res.send(data)
})

//删除
app.post('/delete', async (req, res) => {
    const { id } = req.body
    await prisma.post.deleteMany({
        where: {
            authorId: Number(id)
        }
    })
    const data = await prisma.user.delete({
        where: {
            id: Number(id),
        },
    })
    res.send(data)
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
```

测试http，仅参考

```http
# 新增
POST http://localhost:3000/create HTTP/1.1
Content-type: application/json

{
    "name": "susu",
    "email": "12345679@qq.com"
}
```

```http
# 查询全部
GET http://localhost:3000/ HTTP/1.1
```

```http
# 单个查询
GET http://localhost:3000/user/1 HTTP/1.1
```

```http
# 更新
POST http://localhost:3000/update HTTP/1.1
Content-type: application/json

{
    "id": 1,
    "name": "susu1",
    "email": "12345679s@qq.com"
}
```

```http
# 删除
POST http://localhost:3000/delete HTTP/1.1
Content-type: application/json

{
    "id": 1
}
```

> 注意删除这里：因为post表中有关联我们的user表数据即post表有外键在user表，如果只是用delete方法或者在数据库中删除都会发现不成功，所以我们需要级联删除，和它相关的都删除了才能删除它本身