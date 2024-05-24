# nestjs session 案例

## 引言

session 是服务器为每个用户的浏览器创建的一个会话对象 这个 session 会记录到浏览器的 cookie 用来区分用户

我们使用的是 nestjs 默认框架 express 他也支持 express 的插件，所以我们就可以安装 express 的 session

```bash
npm i express-session --save
```

需要智能提示可以装一个声明依赖

```bash
npm i @types/express-session -D
```

然后在 main.ts 引入 通过 app.use 注册 session

```typescript
import * as session from "express-session";

app.use(session());
```

## 配置

它的参数配置详情如下：

| 参数    | 详情                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------- |
| secrel  | 生成服务端 session 签名 可以理解为加盐                                                          |
| name    | 生成客户端 cookie 的名字 默认 connect.sid                                                       |
| cookie  | 设置返回到前端 key 的属性，默认值为`{ path: ‘/’, httpOnly: true, secure: false, maxAge: null }` |
| rolling | 在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)                               |

nestjs 配置

```typescript
import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as session from "express-session";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    session({
      secret: "ChenChen",
      name: "su.session",
      rolling: true,
      cookie: { maxAge: null },
    })
  );
  await app.listen(3000);
}
bootstrap();
```

## 案例

前端 Vite React Ts Antd fetch

```bash
npm i antd @ant-design/icons -S
```

然后简单的绘制页面

```tsx
import { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./App.css"; // Import CSS for centering styles

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [codeUrl, setCodeUrl] = useState<string>("/api/user/code");

  const resetCode = (): void => setCodeUrl(`${codeUrl}?${Math.random()}`);

  const handleSubmit = async (values: any): Promise<void> => {
      await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(res => res.json())
      // Handle response data as needed
  };

  return (
    <div className="center">
      <div className="wraps">
        <Form
          form={form}
          name="login-form"
          onFinish={handleSubmit}
          style={{ maxWidth: "460px" }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item
          name="code"
          rules={[{ required: true, message: "请输入验证码" }]}
          >
          <div
            style={{ display: "flex", alignItems: "center" }} // Align items in the same line
          >
            <Input
              placeholder="验证码"
              style={{ marginRight: "8px" }}
            />
            <img src={codeUrl} alt="验证码" onClick={resetCode} />
          </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
// App.css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.wraps {
  width: 100%;
  max-width: 460px;
}
```

运行，执行如下：

![image-20240519002708262](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519002708262.png)

我们可以看到 session 已经存到了浏览器

![image-20240519002407373](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519002407373.png)

跨域使用 Vite 配置本地 dev 解决的

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    //用来配置跨域
    proxy: {
      "/api": {
        target: "http://localhost:3000", //目标服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
});
```

后端 nestjs，我们下载一个验证码插件 svgCaptcha

```bash
npm install svg-captcha -S
```

```typescript
import { Controller, Get, Post, Body, Res, Req, Session } from "@nestjs/common";
import { UserService } from "./user.service";
import * as svgCaptcha from "svg-captcha";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("code")
  createCode(@Req() req, @Res() res, @Session() session) {
    const Captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: "#cc9966", //背景颜色
    });
    session.code = Captcha.text; //存储验证码记录到session
    res.type("image/svg+xml");
    res.send(Captcha.data);
  }

  @Post("create")
  createUser(@Req() req, @Body() body) {
    console.log(req.session.code, body);
    if (
      req.session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()
    ) {
      return {
        message: "验证码正确",
      };
    } else {
      return {
        message: "验证码错误",
      };
    }
  }
}
```

点击登录，结果正确

![image-20240519002332520](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240519002332520.png)
