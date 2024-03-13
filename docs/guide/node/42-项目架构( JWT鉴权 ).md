## 42-项目架构( JWT鉴权 )

### 什么是jwt?

JWT（JSON Web Token）是一种开放的标准（RFC 7519），用于在网络应用间传递信息的一种方式。它是一种基于JSON的安全令牌，用于在客户端和服务器之间传输信息。 [jwt.io/](https://jwt.io/)

JWT由三部分组成，它们通过点（.）进行分隔：

1. Header（头部）：包含了令牌的类型和使用的加密算法等信息。通常采用Base64编码表示。
2. Payload（负载）：包含了身份验证和授权等信息，如用户ID、角色、权限等。也可以自定义其他相关信息。同样采用Base64编码表示。
3. Signature（签名）：使用指定的密钥对头部和负载进行签名，以确保令牌的完整性和真实性。

JWT的工作流程如下：

1. 用户通过提供有效的凭证（例如用户名和密码）进行身份验证。
2. 服务器验证凭证，并生成一个JWT作为响应。JWT包含了用户的身份信息和其他必要的数据。
3. 服务器将JWT发送给客户端。
4. 客户端在后续的请求中，将JWT放入请求的头部或其他适当的位置。
5. 服务器在接收到请求时，验证JWT的签名以确保其完整性和真实性。如果验证通过，服务器使用JWT中的信息进行授权和身份验证。

### 用到的依赖

1. `passport` passport是一个流行的用于身份验证和授权的Node.js库
2. `passport-jwt` Passport-JWT是Passport库的一个插件，用于支持使用JSON Web Token (JWT) 进行身份验证和授权
3. `jsonwebtoken` 生成token的库

### 代码编写

沿用上一章的代码 在src下增加jwt目录 

src/jwt/index.ts

```typescript
import { injectable } from 'inversify'
import jsonwebtoken from 'jsonwebtoken'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
@injectable()
export class JWT {
    private secret = 'xiaoman$%^&*()asdsd'
    private jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.secret
    }
    constructor() {
        this.strategy()
    }

    /**
     * 初始化jwt
     */
    public strategy() {
        const strategy = new Strategy(this.jwtOptions, (payload, done) => {
            done(null, payload)
        })
        passport.use(strategy)
    }

    /**
     * 
     * @returns 中间件
     */
    public middleware() {
        return passport.authenticate('jwt', { session: false })
    }

    /**
     * 创建token
     * @param data Object
     */
    public createToken(data: object) {
        //有效期为7天
        return jsonwebtoken.sign(data, this.secret, { expiresIn: '7d' })
    }

    /**
     * 
     * @returns 集成到express
     */
    public init() {
        return passport.initialize()
    }
}
```

main.ts

```typescript
import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import { Container } from 'inversify'
import { User } from './src/user/controller'
import { UserService } from './src/user/services'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaDB } from './src/db'
import { JWT } from './src/jwt'
const container = new Container()
/**
 * user模块
 */
container.bind(User).to(User)
container.bind(UserService).to(UserService)
/**
 *  封装PrismaClient
 */
container.bind<PrismaClient>('PrismaClient').toFactory(() => {
    return () => {
        return new PrismaClient()
    }
})
container.bind(PrismaDB).to(PrismaDB)
/**
 * jwt模块
 */
container.bind(JWT).to(JWT) //主要代码

const server = new InversifyExpressServer(container)
server.setConfig((app) => {
    app.use(express.json())
    app.use(container.get(JWT).init()) //主要代码
})
const app = server.build()

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
```

src/user/controller.ts

```typescript
import { controller, httpGet as GetMapping, httpPost as PostMapping } from 'inversify-express-utils'
import { UserService } from './services'
import { inject } from 'inversify'
import type { Request, Response } from 'express'
import { JWT } from '../jwt'
const {middleware}  = new JWT()
@controller('/user')
export class User {
    constructor(@inject(UserService) private readonly UserService: UserService) {

    }
    @GetMapping('/index',middleware()) //使用中间件,不携带token无法调用该接口会显示401
    public async getIndex(req: Request, res: Response) {
        let result = await this.UserService.getList()
        res.send(result)
    }

    @PostMapping('/create')
    public async createUser(req: Request, res: Response) {
        let result = await this.UserService.createUser(req.body)
        res.send(result)
    }
}
```

src/user/services.ts

```typescript
import { injectable, inject } from 'inversify'
import { PrismaDB } from '../db'
import { UserDto } from './user.dto'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { JWT } from '../jwt'
@injectable()
export class UserService {
    constructor(
        @inject(PrismaDB) private readonly PrismaDB: PrismaDB,
        @inject(JWT) private readonly jwt: JWT //依赖注入
    ) {

    }
    public async getList() {
        return await this.PrismaDB.prisma.user.findMany()
    }

    public async createUser(user: UserDto) {
        let userDto = plainToClass(UserDto, user)
        const errors = await validate(userDto)
        if (errors.length) {
            return errors
        } else {
            const result = await this.PrismaDB.prisma.user.create({
                data: user
            })
            return {
                ...result,
                token: this.jwt.createToken(result) //生成token
            }
        }

    }
}
```

jwt接口验证，哪个接口需要token验证就往哪儿加就可以了，http可自行编写

![image-20240302180623320](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240302180623320.png)