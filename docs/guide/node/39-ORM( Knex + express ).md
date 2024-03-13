## 39-ORM( Knex + express )

### Knex

[Knex](https://knexjs.org/guide/query-builder.html#withrecursive)是一个基于JavaScript的`查询生成器`，它允许你使用JavaScript代码来生成和执行SQL查询语句。它提供了一种简单和直观的方式来与关系型数据库进行交互，而无需直接编写SQL语句。你可以使用Knex定义表结构、执行查询、插入、更新和删除数据等操作。

#### Knex的安装和设置

> Knex支持多种数据库 如pg、sqlite3、mysql2、oracledb、tedious

```sh
# 安装knex
npm install knex --save

# 安装你用的数据库
npm install pg
npm install pg-native
npm install sqlite3
npm install better-sqlite3
npm install mysql
npm install mysql2
npm install oracledb
npm install tedious
```

连接数据库

```javascript
import fs from 'node:fs';
import jsyaml from 'js-yaml';
import knex from 'knex';

// 读取yaml为字符串
const yaml = fs.readFileSync('./db.config.yaml', 'utf8');
// 将其解析成对象
const config = jsyaml.load(yaml);

const db = knex({
  client: 'mysql2',
  connection: config.db
})
```

### 定义表结构

```javascript
// knex所有代码直接编写是没有效果的,必须then后才会有效果
db.schema.createTableIfNotExists('list', table => {
  table.increments('id') // id 主键 自增
  table.integer('age') // age 整数
  table.string('name') // name 字符串
  table.string('hobby') // hobby 字符串
  table.timestamps(true, true) // 创建时间 更新时间
}).then(() => {
  console.log('创建成功')
})
```

### 实现增删改差

新增接口

```javascript
//新增接口
app.post('/create', async (req, res) => {
    const { name, age, hobby } = req.body
    const detail = await db('list').insert({ name, age, hobby })
    res.send({
        code: 200,
        data: detail
    })
})
```

删除接口

```javascript
//编辑接口
app.post('/update', async (req, res) => {
    const { name, age, hobby, id } = req.body
    const info = await db('list').update({ name, age, hobby }).where({ id })
    res.json({
        code: 200,
        data: info
    })
})
```

删除接口

```javascript
//删除接口
app.post('/delete', async (req, res) => {
  const info = await db('list').delete().where({ id: req.body.id })
  res.json({
      code: 200,
      data: info
  })
})
```

查询接口

```javascript
//查询接口 全部
app.get('/', async (req, res) => {
  const data = await db('list').select().orderBy('id', 'desc')
  const total = await db('list').count('* as total') // 重命名一下
  // 上面的数据格式如 [{ total: 1 }]
  res.json({
      code: 200,
      data,
      total: total[0].total,
  })
})
//单个查询 params
app.get('/user/:id', async (req, res) => {
  const row = await db('list').select().where({ id: req.params.id })
  res.json({
      code: 200,
      data: row
  })
})
```

### 高级玩法

反编译为SQL语句，用SQL语句调用

```javascript
// 编译出SQL语句用来调试
db('list').select().toSQL().sql
// 用SQL语句调用
db.raw("select * from user").then((data) => {
    console.log(data)
})
```

连表

```javascript
const table = await db('user').select().leftJoin('table', 'user.id', 'table.user_id')
```

排序

```javascript
// 倒序排序查询
const data = await db('user').select().orderBy('id', 'desc')
```

### 事务

你可以使用事务来确保一组数据库操作的原子性，即要么全部成功提交，要么全部回滚

例如A给B转钱，需要两条语句，如果A语句成功了，B语句因为一些场景失败了，那这钱就丢了，所以事务就是为了解决这个问题，要么都成功，要么都回滚，保证金钱不会丢失。

```javascript
//伪代码
db.transaction(async (trx) => {
    try {
        // A 减100块
        await trx('list').update({money: -100}).where({ id: 1 })
        // B 加100块
        await trx('list').update({money: +100}).where({ id: 2 })
        await trx.commit() //提交事务
    }
    catch (err) {
        await trx.rollback() //回滚事务
    }
}).then(() => {
    console.log('成功')
}).catch(() => {
    console.log('失败')
})
```