## 8-模块化(cjs、esm、源码)

Nodejs 模块化规范遵循两套：`CommonJS`规范和`ESM`规范

### CommonJS 规范

注意：需要通过`npm init -y`生成`package.json`，在该文件中添加或修改一个属性`"type":"commonjs"`，如下图

![image-20231027143926376](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20231027143926376.png)

引入模块（require）支持五种格式

- 支持引入自己编写的模块 ./ ../ 等

- 支持引入第三方模块`express` `md5` `koa` 等

- 支持引入内置模块例如 `http` `os` `fs` `child_process` 等`nodejs`内置模块

  > 高版本 nodejs 引入需要这样写`node:模块名`，低版本直接写模块名即可

- 支持引入`addon.node` 等 C++扩展模块 `.node`文件

- 支持引入`json`文件

```js
const myModule = require('./myModule.js'); // 导入自己编写的模块
const fs = require('node:fs'); // 导入内置模块
const express = require('express'); // 导入node_modules目录的第三方模块
const nodeModule = require('./myModule.node'); // 导入C++扩展模块
const data = require('./data.json'); // 导入json文件
```

导出模块`exports` 和 `module.exports`

```js
module.exports = {
  hello: function () {
    console.log('Hello, world!');
  },
};
```

如果不想导出对象，可以直接导出值

```js
module.exports = 123;
```

### ESM 模块规范

引入模块 `import` 必须写在头部

> 注意使用 ESM 模块的时候需要打开 package.json 设置`"type":"module"`

```js
import fs from 'node:fs';
```

> 如果要引入 json 文件需要特殊处理 需要增加断言并且指定类型 json，node 低版本不支持

```js
import data from './data.json' assert { type: 'json' };
console.log(data);
```

可以加载模块的不同导出

```js
export default {
  test: 'test',
};
export const name = 'xm';
```

加载，并可以起别名

```js
import obj, { name as xm } from './test.js';
let name = '123';
console.log(obj, xm, name);
```

加载模块的整体对象

```js
import * as all from 'xxx.js';
```

动态导入模块

import 静态加载不支持掺杂在逻辑中，如果想动态加载请使用 import 函数模式

```js
if (true) {
  import('./test.js').then();
}
```

模块导出

- 导出一个默认对象`export default`，default 只能有一个不可重复

```js
export default {
  name: 'test',
};
```

- 导出变量

```js
export const a = 1;
```

### Cjs 和 ESM 的区别

1. `Cjs`是基于运行时的同步加载，`ESM`是基于编译时的异步加载

2. `Cjs`是可以修改值的，`ESM`值并且不可修改（可读的）

3. `Cjs`不可以 Tree shaking，`ESM`支持 Tree shaking

   > Tree shaking 是一个用于在打包过程中去除未使用代码（dead code）的技术，它可以有效地减小最终生成的 JavaScript 文件的大小。

4. `Cjs`中顶层的`this`指向这个模块本身，而 ES6 中顶层`this`指向`undefined`

### nodejs 部分源码解析

可以去官网下载源代码

##### .json 文件如何处理

> 文件在`modules`目录下的`cjs`下的`loader.js`

使用**fs**读取 json 文件读取完成之后是个字符串，然后**JSON.parse**变成对象返回

```js
Module._extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');

  if (policy?.manifest) {
    const moduleURL = pathToFileURL(filename);
    policy.manifest.assertIntegrity(moduleURL, content);
  }

  try {
    setOwnProperty(module, 'exports', JSONParse(stripBOM(content)));
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};
```

##### .node 文件如何处理

发现是通过 process.dlopen 方法处理.node 文件

```js
Module._extensions['.node'] = function (module, filename) {
  if (policy?.manifest) {
    const content = fs.readFileSync(filename);
    const moduleURL = pathToFileURL(filename);
    policy.manifest.assertIntegrity(moduleURL, content);
  }
  // Be aware this doesn't use `content`
  return process.dlopen(module, path.toNamespacedPath(filename));
};
```

##### .js 文件如何处理

```js
Module._extensions['.js'] = function (module, filename) {
  // If already analyzed the source, then it will be cached.
  //首先尝试从cjsParseCache中获取已经解析过的模块源代码，如果已经缓存，则直接使用缓存中的源代码
  const cached = cjsParseCache.get(module);
  let content;
  if (cached?.source) {
    content = cached.source; //有缓存就直接用
    cached.source = undefined;
  } else {
    content = fs.readFileSync(filename, 'utf8'); //否则从文件系统读取源代码
  }
  //是不是.js结尾的文件
  if (StringPrototypeEndsWith(filename, '.js')) {
    //读取package.json文件
    const pkg = readPackageScope(filename);
    // Function require shouldn't be used in ES modules.
    //如果package.json文件中有type字段，并且type字段的值为module，并且你使用了require
    //则抛出一个错误，提示不能在ES模块中使用require函数
    if (pkg?.data?.type === 'module') {
      const parent = moduleParentCache.get(module);
      const parentPath = parent?.filename;
      const packageJsonPath = path.resolve(pkg.path, 'package.json');
      const usesEsm = hasEsmSyntax(content);
      const err = new ERR_REQUIRE_ESM(
        filename,
        usesEsm,
        parentPath,
        packageJsonPath
      );
      // Attempt to reconstruct the parent require frame.
      //如果抛出了错误，它还会尝试重构父模块的 require 调用堆栈
      //，以提供更详细的错误信息。它会读取父模块的源代码，并根据错误的行号和列号，
      //在源代码中找到相应位置的代码行，并将其作为错误信息的一部分展示出来。
      if (Module._cache[parentPath]) {
        let parentSource;
        try {
          parentSource = fs.readFileSync(parentPath, 'utf8');
        } catch {
          // Continue regardless of error.
        }
        if (parentSource) {
          const errLine = StringPrototypeSplit(
            StringPrototypeSlice(
              err.stack,
              StringPrototypeIndexOf(err.stack, '    at ')
            ),
            '\n',
            1
          )[0];
          const { 1: line, 2: col } =
            RegExpPrototypeExec(/(\d+):(\d+)\)/, errLine) || [];
          if (line && col) {
            const srcLine = StringPrototypeSplit(parentSource, '\n')[line - 1];
            const frame = `${parentPath}:${line}\n${srcLine}\n${StringPrototypeRepeat(
              ' ',
              col - 1
            )}^\n`;
            setArrowMessage(err, frame);
          }
        }
      }
      throw err;
    }
  }
  module._compile(content, filename);
};
```

如果**缓存**过这个模块就直接从缓存中读取，如果没有缓存就从**fs**读取文件

判断如果是`cjs`但是`type`为`module`就报错，并且从**父模块**读取详细的**行号**进行报错，如果没问题就调用 **compile**

```js
Module.prototype._compile = function (content, filename) {
  let moduleURL;
  let redirects;
  const manifest = policy?.manifest;
  if (manifest) {
    moduleURL = pathToFileURL(filename);
    //函数将模块文件名转换为URL格式
    redirects = manifest.getDependencyMapper(moduleURL);
    //redirects是一个URL映射表，用于处理模块依赖关系
    manifest.assertIntegrity(moduleURL, content);
    //manifest则是一个安全策略对象，用于检测模块的完整性和安全性
  }
  /**
   * @filename {string}  文件名
   * @content {string}   文件内容
   */
  const compiledWrapper = wrapSafe(filename, content, this);

  let inspectorWrapper = null;
  if (getOptionValue('--inspect-brk') && process._eval == null) {
    if (!resolvedArgv) {
      // We enter the repl if we're not given a filename argument.
      if (process.argv[1]) {
        try {
          resolvedArgv = Module._resolveFilename(process.argv[1], null, false);
        } catch {
          // We only expect this codepath to be reached in the case of a
          // preloaded module (it will fail earlier with the main entry)
          assert(ArrayIsArray(getOptionValue('--require')));
        }
      } else {
        resolvedArgv = 'repl';
      }
    }

    // Set breakpoint on module start
    if (resolvedArgv && !hasPausedEntry && filename === resolvedArgv) {
      hasPausedEntry = true;
      inspectorWrapper = internalBinding('inspector').callAndPauseOnStart;
    }
  }
  const dirname = path.dirname(filename);
  const require = makeRequireFunction(this, redirects);
  let result;
  const exports = this.exports;
  const thisValue = exports;
  const module = this;
  if (requireDepth === 0) statCache = new SafeMap();
  if (inspectorWrapper) {
    result = inspectorWrapper(
      compiledWrapper,
      thisValue,
      exports,
      require,
      module,
      filename,
      dirname
    );
  } else {
    result = ReflectApply(compiledWrapper, thisValue, [
      exports,
      require,
      module,
      filename,
      dirname,
    ]);
  }
  hasLoadedAnyUserCJSModule = true;
  if (requireDepth === 0) statCache = null;
  return result;
};
```

首先，它检查是否存在安全策略对象 `policy.manifest`，如果存在，表示有安全策略限制需要处理 将函数将模块文件名转换为 URL 格式，`redirects`是一个 URL 映射表，用于处理模块依赖关系，`manifest`则是一个**安全策略对象**，用于检测模块的完整性和安全性，然后调用`wrapSafe`

```js
function wrapSafe(filename, content, cjsModuleInstance) {
  if (patched) {
    const wrapper = Module.wrap(content);
    //支持esm的模块
    //import { a } from './a.js'; 类似于eval
    //import()函数模式动态加载模块
    const script = new Script(wrapper, {
      filename,
      lineOffset: 0,
      importModuleDynamically: async (specifier, _, importAssertions) => {
        const loader = asyncESM.esmLoader;
        return loader.import(specifier, normalizeReferrerURL(filename),importAssertions);
      },
    });

    // Cache the source map for the module if present.
    if (script.sourceMapURL) {
      maybeCacheSourceMap(filename, content, this, false, undefined, script.sourceMapURL);
    }
    //返回一个可执行的全局上下文函数
    return script.runInThisContext({
      displayErrors: true,
    });
  }
```

`wrapSafe`调用了`wrap`方法

```js
let wrap = function (script) {
  return Module.wrapper[0] + script + Module.wrapper[1];
};
//(function (exports, require, module, __filename, __dirname) {
//const xm = 18
//\n});
const wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n})',
];
```

`wrap`方法，发现就是把我们的代码**包装**到一个函数里面

```js
//(function (exports, require, module, __filename, __dirname) {
//const xm = 18 我们的代码
//\n});
```

然后继续看`wrapSafe`函数，发现把返回的字符串即**包装**之后的代码放入**nodejs 虚拟机**里面`Script`，看有没有动态 import 去加载，最后返回执行后的结果

然后继续看**\_compile**，获取到`wrapSafe`返回的函数，通过`Reflect.apply`调用因为要填充五个参数`[exports, require, module, filename, dirname]`,最后返回执行完的结果
