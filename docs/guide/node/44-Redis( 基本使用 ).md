## 44-Redis( 基本使用 )

上一章配置完环境变量后在cmd输入`redis-cli`即可运行下面命令，可以通过工具查看是否运行成功操作

### 字符串的操作

```sql
SET key value [NX|XX] [EX seconds] [PX milliseconds] [GET]
```

+ `key`：要设置的键名。

+ `value`：要设置的值。

+ `NX`：可选参数，表示只在键不存在时才设置值。

+ `XX`：可选参数，表示只在键已经存在时才设置值。

+ `EX seconds`：可选参数，将键的过期时间设置为指定的秒数。

+ `PX milliseconds`：可选参数，将键的过期时间设置为指定的毫秒数。

+ `GET`：可选参数，返回键的旧值。

1. 设置键名为 "name" 的值为 "chenchen"：

```sql
SET name "chenchen"
```

2. 设置键名为 "counter" 的值为 10，并设置过期时间为 60 秒：

```sql
SET counter 10 EX 60
```

3. 只在键名为 "status" 不存在时，设置其值为 "active"：

```sql
SET status "active" NX
```

4. 只在键名为 "score" 已经存在时，将其值增加 5：

```sql
SET score 5 XX
```

5. 设置键名为 "message" 的值为 "Hello"，并返回旧的值：

```sql
SET message "Hello" GET
```

6. 删除键名为 "name" 的键：

```sql
DEL name
```

7. 批量删除多个键名：

```sql
DEL key1 key2 key3
```

8. 删除不存在的键名，不会报错，返回删除的键数量为 0：

```sql
DEL non_existing_key
```

### 集合的操作

集合（Set）是一种无序且不重复的数据结构，用于存储一组独立的元素。集合中的元素之间没有明确的顺序关系，每个元素在集合中只能出现一次。

1. 添加成员到集合：

   ```bash
   SADD fruits "apple"
   SADD fruits "banana"
   SADD fruits "orange"
   ```

2. 获取集合中的所有成员：

   ```bash
   SMEMBERS fruits
   ```

   输出结果：

   ```bash
   1) "apple"
   2) "banana"
   3) "orange"
   ```

3. 检查成员是否存在于集合中：

   ```bash
   SISMEMBER fruits "apple"
   ```

   输出结果：

   ```bash
   (integer) 1
   ```

4. 从集合中移除成员：

   ```bash
   SREM fruits "banana"
   ```

   输出结果：

   ```bash
   (integer) 1
   ```

5. 获取集合中的成员数量：

   ```bash
   SCARD fruits
   ```

   输出结果：

   ```bash
   (integer) 2
   ```

6. 获取随机成员：

   ```bash
   SRANDMEMBER fruits
   ```

   输出结果：

   ```bash
   "apple"
   ```

7. 求多个集合的并集：

   ```bash
   SUNION fruits vegetables
   ```

   输出结果：

   ```bash
   1) "apple"
   2) "orange"
   3) "tomato"
   4) "carrot"
   ```

8. 求多个集合的交集：

   ```bash
   SINTER fruits vegetables
   ```

   输出结果：

   ```bash
   "apple"
   ```

9. 求多个集合的差集：

   ```bash
   SDIFF fruits vegetables
   ```

   输出结果：

   ```bash
   "orange"
   ```

### 哈希表操作

哈希表（Hash）是一种数据结构，也称为字典、关联数组或映射，用于存储键值对集合。在哈希表中，键和值都是存储的数据项，并通过哈希函数将键映射到特定的存储位置，从而实现快速的数据访问和查找。

1. 设置哈希表中的字段值：

   ```bash
   HSET obj name "John"
   HSET obj age 25
   HSET obj email "john@example.com"
   ```

2. 获取哈希表中的字段值：

   ```bash
   HGET obj name
   ```

   输出结果：

   ```bash
   "John"
   ```

3. 一次设置多个字段的值：

   ```bash
   HMSET obj name "John" age 25 email "john@example.com"
   ```

4. 获取多个字段的值：

   ```sql
   HMGET obj name age email
   ```

   输出结果：

   ```bash
   1) "John"
   2) "25"
   3) "john@example.com"
   ```

5. 获取哈希表中所有字段和值：

   ```sql
   HGETALL obj
   ```

   输出结果：

   ```bash
   1) "name"
   2) "John"
   3) "age"
   4) "25"
   5) "email"
   6) "john@example.com"
   ```

6. 删除哈希表中的字段：

   ```sql
   HDEL obj age email
   ```

   输出结果：

   ```bash
   (integer) 2
   ```

7. 检查哈希表中是否存在指定字段：

   ```sql
   HEXISTS obj name
   ```

   输出结果：

   ```bash
   (integer) 1
   ```

8. 获取哈希表中所有的字段：

   ```sql
   HKEYS obj
   ```

   输出结果：

   ```bash
   1) "name"
   ```

9. 获取哈希表中所有的值：

   ```sql
   HVALS obj
   ```

   输出结果：

   ```bash
   1) "John"
   ```

10. 获取哈希表中字段的数量：

    ```sql
    HLEN obj
    ```

    输出结果：

    ```bash
    (integer) 1
    ```

### 列表的操作

列表（List）是一种有序、可变且可重复的数据结构。在许多编程语言和数据存储系统中，列表是一种常见的数据结构类型，用于存储一组元素

1. 添加元素：

```sql
RPUSH key element1 element2 element3  // 将元素从右侧插入列表
LPUSH key element1 element2 element3  // 将元素从左侧插入列表
```

> - `LPUSH key element1 element2 ...`：将一个或多个元素从列表的左侧插入，即将元素依次插入列表的`头部`。如果列表不存在，则在执行操作前会自动创建一个新的列表。
> - `RPUSH key element1 element2 ...`：将一个或多个元素从列表的右侧插入，即将元素依次插入列表的`尾部`。如果列表不存在，则在执行操作前会自动创建一个新的列表。

1. 获取元素：

```sql
LINDEX key index  // 获取列表中指定索引位置的元素
LRANGE key start stop  // 获取列表中指定范围内的元素
```

1. 修改元素：

```sql
LSET key index newValue  // 修改列表中指定索引位置的元素的值
```

1. 删除元素：

```sql
LPOP key  // 从列表的左侧移除并返回第一个元素
RPOP key  // 从列表的右侧移除并返回最后一个元素
LREM key count value  // 从列表中删除指定数量的指定值元素
```

1. 获取列表长度：

```sql
LLEN key  // 获取列表的长度
```