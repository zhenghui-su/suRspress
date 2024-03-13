## 41-项目架构( MVC + loC + 装饰器 )

到现在为止，我们学习了，express框架，编写接口，mysql数据库读写数据，knex,prisma ORM框架，现在是时候把这些组合到一起，并且实现一个类似于`Nestjs`或者java的`SpringBoot`的架构真正的去开发我们的nodejs项目

### MVC

MVC（Model-View-Controller）是一种常用的软件架构模式，用于设计和组织应用程序的代码。它将应用程序分为三个主要组件：模型（Model）、视图（View）和控制器（Controller），各自负责不同的职责。

1. 模型（Model）：模型表示应用程序的数据和业务逻辑。它负责处理数据的存储、检索、验证和更新等操作。模型通常包含与数据库、文件系统或外部服务进行交互的代码。
2. 视图（View）：视图负责将模型的数据以可视化的形式呈现给用户。它负责用户界面的展示，包括各种图形元素、页面布局和用户交互组件等。视图通常是根据模型的状态来动态生成和更新的。
3. 控制器（Controller）：控制器充当模型和视图之间的中间人，负责协调两者之间的交互。它接收用户输入（例如按钮点击、表单提交等），并根据输入更新模型的状态或调用相应的模型方法。控制器还可以根据模型的变化来更新视图的显示。

MVC 的主要目标是将应用程序的逻辑、数据和界面分离，以提高代码的可维护性、可扩展性和可重用性。通过将不同的职责分配给不同的组件，MVC 提供了一种清晰的结构，使开发人员能够更好地管理和修改应用程序的各个部分。

### IoC控制反转和DI依赖注入

控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。虽然它们经常一起使用，但它们是不同的概念。

1. 控制反转（IoC）是一种设计原则，它将组件的控制权从组件自身转移到外部容器。传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护。
2. 依赖注入（DI）是实现控制反转的一种具体技术。它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现。

### 安装依赖

1. `inversify` + `reflect-metadata` 实现依赖注入 [官网](https://doc.inversify.cloud/zh_cn/installation)
2. 接口编写`express` [官网](https://www.expressjs.com.cn/)
3. 连接工具 `inversify-express-utils` [文档](https://www.npmjs.com/package/inversify-express-utils)
4. orm框架 `prisma` [官网](https://www.prisma.io/)
5. dto `class-validator` + `class-transformer` [文档](https://www.npmjs.com/package/class-validator)

### 项目架构

新建一个文件夹

通过 `prisma init --datasource-provider mysql` 构建prisma项目 上一章讲过了

目录结构

- /src
  - /user
    - /controller.ts
    - /service.ts
    - /user.dto.ts
  - /post
    - /controller.ts
    - /service.ts
    - /post.dto.ts
  - /db
    - /index.ts
  - /prisma
    - /schema.prisma
- main.ts
- .env
- tsconfig.json
- package.json
- README.md

### 代码编写

main.ts

```typescript
import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import { Container } from 'inversify'
import { UserController } from './src/user/controller'
import { UserService } from './src/user/service'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaDB } from './src/db'
const container = new Container() //Ioc搞个容器
/**
 * prisma依赖注入
 */
 //注入工厂封装db
container.bind<PrismaClient>('PrismaClient').toFactory(()=>{
    return () => {
        return new PrismaClient()
    }
})
container.bind(PrismaDB).toSelf()
/**
 * user模块
 */
container.bind(UserService).to(UserService) //添加到容器
container.bind(UserController).to(UserController) //添加到容器
/**
 * post模块
 */
const server = new InversifyExpressServer(container) //返回server
//中间件编写在这儿
server.setConfig(app => {
    app.use(express.json()) //接受json
})
const app = server.build() //app就是express

app.listen(3000, () => {
    console.log('http://localhost:3000')
})
```

src/user/controller.ts

```typescript
import { controller, httpGet as GetMapping, httpPost as PostMapping } from 'inversify-express-utils'
import { inject } from 'inversify'
import { UserService } from './service'
import type { Request, Response } from 'express'
@controller('/user') //路由
export class UserController {

    constructor(
        @inject(UserService) private readonly userService: UserService, //依赖注入
    ) { }

    @GetMapping('/index') //get请求
    public async getIndex(req: Request, res: Response) {
        console.log(req?.user.id)
        const info = await this.userService.getUserInfo()
        res.send(info)
    }

    @PostMapping('/create') //post请求
    public async createUser(req: Request, res: Response) {
        const user = await this.userService.createUser(req.body)
        res.send(user)
    }
}
```

src/user/service.ts

```typescript
import { injectable, inject } from 'inversify'
import { UserDto } from './user.dto'
import { plainToClass } from 'class-transformer' //dto验证
import { validate } from 'class-validator' //dto验证
import { PrismaDB } from '../db'
@injectable()
export class UserService {

    constructor(
        @inject(PrismaDB) private readonly PrismaDB: PrismaDB //依赖注入
    ) { }

    public async getUserInfo() {
        return await this.PrismaDB.prisma.user.findMany()
    }

    public async createUser(data: UserDto) {
        const user = plainToClass(UserDto, data)
        const errors = await validate(user)
        const dto = []
        if (errors.length) {
            errors.forEach(error => {
                Object.keys(error.constraints).forEach(key => {
                    dto.push({
                        [error.property]: error.constraints[key]
                    })
                })
            })
            return dto
        } else {
            const userInfo =  await this.PrismaDB.prisma.user.create({ data: user })
            return userInfo
        }
    }
}
```

src/user/user.dto.ts

```typescript
import { IsNotEmpty, IsEmail } from 'class-validator'
import { Transform } from 'class-transformer'
export class UserDto {
    @IsNotEmpty({ message: '用户名必填' })
    @Transform(user => user.value.trim())
    name: string

    @IsNotEmpty({ message: '邮箱必填' })
    @IsEmail({},{message: '邮箱格式不正确'})
    @Transform(user => user.value.trim())
    email: string
}
```

src/db/index.ts

```typescript
import { injectable, inject } from 'inversify'
import { PrismaClient } from '@prisma/client'

@injectable()
export class PrismaDB {
    prisma: PrismaClient
    constructor(@inject('PrismaClient') PrismaClient: () => PrismaClient) {
       this.prisma = PrismaClient()
    }
}
```

tsconig.json

支持装饰器和反射 打开一下 严格模式关闭

```json
"experimentalDecorators": true,               
"emitDecoratorMetadata": true,    
"strict": false,  
```