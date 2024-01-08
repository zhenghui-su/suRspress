## 17-util

util 是 Node.js 内部提供的很多实用或工具类型的 API，用来方便我们快速开发，下面介绍一些常用的 API

### util.promisify

Node.js 大部分的 API 都是遵循回调函数的模式去编写的

参考上面的第 14 章子进程其中的`exec`，如下，查看 node 版本

```js
import { exec } from 'node:child_process';
exec('node -v', (err, stdout) => {
  if (err) {
    return err;
  }
  console.log(stdout);
});
```

这就是常规的写法

我们使用`util.promisify`，可以将回调函数改为 Promise 风格，Promisfiy 接收`original`(一个函数体)，如下

```js
import { exec } from 'node:child_process';
import util from 'node:util';

const execPromise = util.promisify(exec);
// 如果返回多个参数 res 是一个对象，如果返回一个参数就直接返回
execPromise('node -v')
  .then((res) => {
    console.log('res--', res);
  })
  .catch((err) => {
    console.log('err--', err);
  });
```

#### promisify 如何实现

- 第一步：promisify 是返回一个新的函数，因此如下

```js
const promiseify = () => {
  return () => {};
};
```

- 第二步：promiseify 接收一个函数，并且需要在返回的函数中接收真正的参数，然后返回一个 Promise，如下

```js
const promiseify = (original) => {
  return (...args) => {
    return new Promise((resolve, reject) => {});
  };
};
```

- 调用真正的函数，将参数透传给`original`，如果失败就 reject，成功就返回 resolve，有多个的话返回一个对象

```js
const promiseify = (original) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      original(...args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (values && values.length > 1) {
          let obj = {};
          console.log(values);
          for (let key in values) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
    });
  };
};
```

这样我们可以**大致**实现该工具

注意：该实现是拿不到 values 的 key 的，因为 Node.js 内部没有开放`kCustomPromisifyArgsSymbol`这个 Symbol 给我们

因此输出的结果是`{ '0': 'v18.16.0\n', '1': '' }`

而正常的结果应该是`{ stdout: 'v18.16.0\n', stderr: '' }`

### util.callbackify

这个和上面的 API 正好相反，是将 Promise 类型的 API 变为回调函数

如下使用

```js
import util from 'node:util';

const fn = (type) => {
  if (type == 1) {
    return Promise.resolve('test');
  }
  return Promise.reject('error');
};

const callback = util.callbackify(fn);

callback(1222, (err, val) => {
  console.log(err, val);
});
```

#### 剖析 callbackify

如下，考虑到多个参数情况，回调函数肯定是在最后一个，通过 pop 方法将其取出

```js
const callbackify = (fn) => {
  return (...args) => {
    let callback = args.pop();
    fn(...args)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err);
      });
  };
};
```

### util.format

函数如下

```js
util.format(format, [args]);
```

其中第一个 format 参数，语法和 C 语言基本一致，如下

- `%s`:(`String`)将用于转换除 `BigInt`、`Object` 和 `-0` 之外的所有值

> `BigInt` 值将用 `n` 表示，没有用户定义的 `toString` 函数的对象使用具有选项 `{ depth: 0, colors: false, compact: 3 }` 的 `util.inspect()` 进行检查。

- `%d`:(`Numer`)将用于转换除 `BigInt` 和 `Symbol` 之外的所有值
- `%i`:(`parseInt(value, 10)`)用于除 `BigInt` 和 `Symbol` 之外的所有值
- `%f`:(`parseFloat(value)`)用于除 `Symbol` 之外的所有值
- `%j`:(`JSON`) 如果参数包含循环引用，则替换为字符串 `'[Circular]'`

- `%o`:(`Object`)具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于具有选项 `{ showHidden: true, showProxy: true }` 的 `util.inspect()`。 这将显示完整的对象，包括不可枚举的属性和代理

- `%O`: (`Object`). 具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于没有选项的 `util.inspect()`。 这将显示完整的对象，但不包括不可枚举的属性和代理

- `%c`: (`CSS`). 此说明符被忽略，将跳过任何传入的 CSS

- `%%`: 单个百分号 (`'%'`)。 这不消费参数

下面是例子，格式化一个字符串

```js
import util from 'node:util';
const result = util.format('%s------%s %s/%s', 'su', 'zhenghui', 'hui', 'chen');
console.log(result);
```

结果如下：

![image-20231124150745619](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231124150745619.png)

如果不传入格式化的参数，就会按照空格分开

```js
import util from 'node:util';
const result = util.format(1, 2, 3);
console.log(result);
```

结果如下：

![image-20231124150858831](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231124150858831.png)
