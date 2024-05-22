# nestjs 连接数据库 typeOrm

nestjs 是集成数据库的，由于 MySQL 是较流行的，我们用 nestjs 来连接 MySQL

## 安装 MySQL

在 Node 中已经讲过如何安装了，详细见：[安装流程](https://www.xiaosu2003.cn/guide/node/32-%E6%95%B0%E6%8D%AE%E5%BA%93.html#%E5%AE%89%E8%A3%85%E6%B5%81%E7%A8%8B)

如果还是不懂可以搜索 B 站的视频教程，大部分都很详细

## ORM 框架 (typeOrm)

如果你之前接触过，可能知道别的如 knex 或者 Prisma ，这些都是 ORM 框架

而 typeOrm 是 `TypeScript`中最成熟的对象关系映射器( `ORM` )。因为它是用`TypeScript`编写的，所以可以很好地与`Nest`框架集成

安装依赖：

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

我们还可以在 Vscode 里面安装一个叫`Database Client`的插件，可视化数据库，这个在之前 Node 也讲过了

我们新建一个库，点击+号，然后取个名字运行即可

![image-20240522222932972](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522222932972.png)

然后我们使用 typeOrm，在`app.module.ts`中注册

![image-20240522223152981](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522223152981.png)

代码如下，根据你的数据库信息改一下就好：

```typescript
TypeOrmModule.forRoot({
      type: 'mysql',//数据库类型
      username: 'root',//账号
      password: '123456',//密码
      host: 'localhost',//host
      port: 3306,//
      database: 'portal',//库名
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],//实体文件可通过下面autoLoadEntities自动加载，就不需要这个配置了
      synchronize: true,//synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500,//重试连接数据库间隔
      retryAttempts: 10,//重试连接数据库的次数
      autoLoadEntities: true,//如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),
```

然后我们可以定义实体，找到 guard 下的 entities 下的`guard.entity.ts`文件：

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guard {
	//自增列
	@PrimaryGeneratedColumn()
	id: number;
	//普通列
	@Column()
	name: string;
}
```

然后在`guard.module.ts`中关联一下实体，就是 import 引入一下

![image-20240522223515850](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522223515850.png)

```typescript
imports: [TypeOrmModule.forFeature([Guard])]; // 使用forFeature可以自动加载实体
```

然后我们保存一下，再打开数据库可视化工具，就会发现给我们自动创建这个实体表了：

![image-20240522224322344](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522224322344.png)

## 实体

什么是实体？实体是一个映射到数据库表的类。

你可以通过定义一个类来创建一个实体，并用`@Entity()`来标记：

```typescript
import { Entity、Column、PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  age: number;
}
```

### 主列

自动递增的主键，比如 id 这种，使用`@PrimaryGeneratedColumn()`装饰器

```typescript
@PrimaryGeneratedColumn()
id: number;
```

自动递增的 uuid，防止重复，在参数里加上 uuid 即可

```typescript
@PrimaryGeneratedColumn('uuid')
id: number;
```

### 列类型

我们可以在参数对象中定义这个列的类型，比如 int 等

```typescript
@Column({ type: 'varchar', length: 200 })
password: string;

@Column({ type: 'int' })
age: number;

@CreateDateColumn({ type: 'timestamp' })
create_time: Date;
```

MySQL 中类型：

- **整数类型**：int、tinyint、smallint、mediumint、bigint
- **浮点数类型**：float、double、dec、decimal、numeric

- **日期和时间类型**：date、datetime、timestamp、time、year
- **字符类型**：char、varchar、nvarchar
- **文本类型**：text、tinytext、mediumtext、longtext
- **二进制数据类型**：blob、tinyblob、mediumblob、longblob
- **其他类型**：enum、json、binary、geometry、linestring、polygon、point、multipoint、multilinestring、multipolygon、geometrycollection

### 自动生成列

我们通过`@Generated()`装饰器：

```typescript
@Generated('uuid')
uuid:string
```

这里能生成哪些也会有提示

![image-20240522225741476](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240522225741476.png)

### 枚举列

我们也是通过参数对象来做：

```typescript
@Column({
	type: 'enum',
    enum: ['1', '2', '3', '4'],
    default: '1',
})
xx: string;
```

### 列选项

如下，有注释：

```typescript
@Column({
    type:'varchar',
    name:'ipaaa', //数据库表中的列名
    nullable:true, //在数据库中使列NULL或NOT NULL。 默认情况下，列是nullable：false
    comment:'注释',
    select:true,  //定义在进行查询时是否默认隐藏此列。 设置为false时，列数据不会显示标准查询。 默认情况下，列是select：true
    default:'xxxx', //加数据库级列的DEFAULT值
    primary:false, //将列标记为主要列。 使用方式和 @PrimaryColumn 相同。
    update:true, //指示保存操作save是否更新列值。如果为false，则只能在第一次插入对象时编写该值。 默认值为true
    collation:'', //定义列排序规则。
})
ip:string
```

这里是详细选项列表：

- `type: ColumnType` - 列类型。具体说明在上面.
- `name: string` - 数据库表中的列名。默认情况下，列名称是从属性的名称生成的。 你也可以通过指定自己的名称来更改它。
- `length: number` - 列类型的长度。 例如，如果要创建 varchar（150）类型，请指定列类型和长度选项。
- `width: number` - 列类型的显示范围。 仅用于 MySQL integer types(opens new window)
- `onUpdate: string` - ON UPDATE 触发器。 仅用于 MySQL (opens new window).
- `nullable: boolean` - 在数据库中使列 NULL 或 NOT NULL。 默认情况下，列是 nullable：false。
- `update: boolean` - 指示"save"操作是否更新列值。如果为 false，则只能在第一次插入对象时编写该值。 默认值为"true"。
- `select: boolean` - 定义在进行查询时是否默认隐藏此列。 设置为 false 时，列数据不会显示标准查询。 默认情况下，列是 select：true
- `default: string` - 添加数据库级列的 DEFAULT 值。
- `primary: boolean` - 将列标记为主要列。 使用方式和@ PrimaryColumn 相同。
- `unique: boolean` - 将列标记为唯一列（创建唯一约束）。
- `comment: string` - 数据库列备注，并非所有数据库类型都支持。
- `precision: number` - 十进制（精确数字）列的精度（仅适用于十进制列），这是为值存储的最大位数。仅用于某些列类型。
- `scale: number` - 十进制（精确数字）列的比例（仅适用于十进制列），表示小数点右侧的位数，且不得大于精度。 仅用于某些列类型。
- `zerofill: boolean` - 将 ZEROFILL 属性设置为数字列。 仅在 MySQL 中使用。 如果是 true，MySQL 会自动将 UNSIGNED 属性添加到此列。
- `unsigned: boolean` - 将 UNSIGNED 属性设置为数字列。 仅在 MySQL 中使用。
- `charset: string` - 定义列字符集。 并非所有数据库类型都支持。
- `collation: string` - 定义列排序规则。
- `enum: string[]|AnyEnum` - 在 enum 列类型中使用，以指定允许的枚举值列表。 你也可以指定数组或指定枚举类。
- `asExpression: string` - 生成的列表达式。 仅在 MySQL (opens new window)中使用。
- `generatedType: "VIRTUAL"|"STORED"` - 生成的列类型。 仅在 MySQL (opens new window)中使用。
- `hstoreType: "object"|"string"` -返回 HSTORE 列类型。 以字符串或对象的形式返回值。 仅在 Postgres 中使用。
- `array: boolean` - 用于可以是数组的 postgres 列类型（例如 int []）
- `transformer: { from(value: DatabaseType): EntityType, to(value: EntityType): DatabaseType }` - 用于将任意类型 EntityType 的属性编组为数据库支持的类型 DatabaseType。

### simple-array 列类型

有一种称为`simple-array`的特殊列类型，它可以将原始数组值存储在单个字符串列中。 所有值都以逗号分隔

```typescript
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('simple-array')
	names: string[];
}
```

### simple-json 列类型

还有一个名为`simple-json`的特殊列类型，它可以存储任何可以通过 JSON.stringify 存储在数据库中的值。 当你的数据库中没有 json 类型而你又想存储和加载对象，该类型就很有用了

```typescript
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('simple-json')
	profile: { name: string; nickname: string };
}
```
