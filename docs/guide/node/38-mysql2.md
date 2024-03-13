## 38-mysql2

在之前的篇章中，已经学习完成`mysql`的基本知识，那么现在开始，我们需要把`mysql`和`express`,`nodejs`连接起来。

### 安装依赖

在终端输入如下代码，安装依赖

```bash
npm install mysql2 express js-yaml
```

1. mysql2 用来连接mysql和编写sq语句
2. express 用来提供接口 增删改差
3. js-yaml 用来编写配置文件

### 编写代码

db.config.yaml

```yaml
db:
   host: localhost #主机
   port: 3306 #端口
   user: root #账号
   password: '123456' #密码 一定要字符串
   database: xiaoman # 库
```

index.js

```javascript
import mysql2 from 'mysql2/promise';
import fs from 'node:fs';
import jsyaml from 'js-yaml';
import express from 'express';

// 读取yaml为字符串
const yaml = fs.readFileSync('./db.config.yaml', 'utf8');
// 将其解析成对象
const config = jsyaml.load(yaml);

const sql = await mysql2.createConnection({
  ...config.db
})

const app = express();
app.use(express.json());
// 查询接口 全部数据
app.get('/', async (req, res) => {
  const [data] = await sql.query('SELECT * FROM user');
  res.send(data)
})
// 单个查询
app.get('/user/:id', async (req, res) => {
  const [row] = await sql.query('SELECT * FROM user WHERE id = ?', [req.params.id])
  res.send(row)
})
// 新增接口
app.post('/create', async (req, res) => {
  const { name, age, address, hobby } = req.body;
  await sql.query('INSERT INTO user (name, age, address, hobby) VALUES (?, ?, ?, ?)', [name, age, address, hobby])
  res.send({ ok: 1 })
})
// 编辑接口
app.post('/update', async (req, res) => {
  const { name, age, address, hobby, id } = req.body
  await sql.query(`update user set name = ?,age = ?,address= ?,hobby = ? where id = ?`, [name, age, address, hobby, id])
  res.send({ ok: 1 })
})
//删除
app.post('/delete', async (req, res) => {
  await sql.query(`delete from user where id = ?`, [req.body.id])
  res.send({ ok: 1 })
})
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

index.http，方便测试接口

```http
# 查询全部
GET http://localhost:3000/ HTTP/1.1
```

```http
# 单个查询
GET http://localhost:3000/user/2 HTTP/1.1
```

```http
# 添加数据
POST http://localhost:3000/create HTTP/1.1
Content-Type: application/json

{
    "name":"张三",
    "age":18,
    "address":"北京市",
    "hobby": "篮球"
}
```

```http
# 更新数据
POST http://localhost:3000/update HTTP/1.1
Content-Type: application/json

{
    "name":"法外狂徒",
    "age":20,
    "address":"上海市",
    "hobby": "rap",
    "id":11
}
```

```http
# 删除
POST http://localhost:3000/delete HTTP/1.1
Content-Type: application/json

{
    "id":11
}
```