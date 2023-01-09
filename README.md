# localstorage-slim

### 本项目 Fork [niketpathak/localstorage-slim](https://github.com/digitalfortress-tech/localstorage-slim), 添加支持小程序

---

一个超轻量级的库, 只有 3 KB 的本地存储工具，可选支持**ttl**和**加密**，支持**小程序**和**web**

- 📦 纯 JS（Typescript）, **0 依赖**项的 localStorage 工具
- ⏰ 支持 **TTL**
- 🧬 支持 **encryption/decryption**

---

### 安装

```shell script
# Npm
$ npm install --save @banu/localstorage-slim

# Yarn
$ yarn add @banu/localstorage-slim

# pnpm
$ pnpm add @banu/localstorage-slim
```

> 引入

```javascript
// using ES6 modules
import ls from '@banu/localstorage-slim';

// using CommonJS modules
const ls = require('@banu/localstorage-slim');
```

### 使用

#### Javascript

```javascript
/* 存储在本地存储 */
const value = {
  a: new Date(),
  b: null,
  c: false,
  d: 'superman',
  e: 1234,
};

ls.set('key1', value); // 值可以是任何东西（对象、数组、字符串、数字……）
ls.get('key1'); // { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }

/* 以秒为单位的可选 ttl */
ls.set('key2', value, { ttl: 5 });
ls.get('key2'); // within 5 secs => { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }
ls.get('key2'); // after 5 secs => null

/* 可选加密 */
ls.set('key3', value, { encrypt: true });
ls.get('key3', { decrypt: true }); // { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }
```

---

### 配置

`LocalStorage-slim` 为您提供了一个配置对象 (**`ls.config`**)，可以对其进行修改以满足您的需要。可用的配置参数如下，所有这些都是完全**可选的**

| Parameter                                                        | Description                                                                                                                                    | Default       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `ttl?: number\|null`                                             | 允许您设置全局 TTL（生存时间）**以秒为单位**，这将用于存储在 localStorage 中的每个项目。 **全局 `ttl`**可以使用 `ls.set()/ls.get()` API 覆盖。 | null          |
| `encrypt?: boolean`                                              | 允许您设置存储在 localStorage [详细信息](#encryption) 中的数据的全局加密。它可以用 `ls.set()/ls.get()` API 覆盖。                              | false         |
| `decrypt?: boolean`                                              | 允许您解密存储在 localStorage 中的加密数据。 **仅**由 [`ls.get()`](#lsget) API 使用。                                                          | undefined     |
| `encrypter?: (data: unknown, secret: string): string`            | 一个加密函数，其签名可以在左边看到。默认实现只会混淆值。可以使用 `ls.set()/ls.get()` API 覆盖此函数。                                          | Obfuscation   |
| `decrypter?: (encryptedString: string, secret: string): unknown` | 一个解密函数，其签名可以在左边看到。默认实现仅执行反混淆。可以使用 `ls.set()/ls.get()` API 覆盖此函数。                                        | deobfuscation |
| `secret?: unknown`                                               | 允许您设置将作为参数传递给加密器/解密器函数的密钥。默认实现接受一个数字。 **全局 `secret`**可以使用 `ls.set()/ls.get()` API 覆盖。             |               |

---

### Encryption/Decryption

LocalStorage-slim 允许您加密将存储在 localStorage 中的数据。

```javascript
// 全局启用加密
ls.config.encrypt = true;

// 可选择使用不同的密钥
ls.config.secret = 89;
```

启用加密可确保大多数用户无法读取存储在 localStorage 中的数据。 **注意**默认实现不是真正的加密，而只是为了保持库的轻量化而进行的混淆。您可以自定义 `encrypter`/`decrypter` 函数以编写您自己的算法或使用安全加密算法，如 **AES**、**TDES**、**RC4**或 **rabbit**通过 **[CryptoJS](https://www.npmjs.com/package/crypto-js)**以满足您的需求。

要使用像 CryptoJS 这样的库，请更新以下配置选项：

```javascript
// 启用加密
ls.config.encrypt = true;
// 设置一个全局 secret
ls.config.secret = 'secret-password';

// 覆盖加密函数
ls.config.encrypter = (data: unknown, secret: string): string => 'encrypted string';
// 覆盖解密函数
ls.config.decrypter = (encryptedString: string, secret: string): unknown => 'original data';
```

如上所示，您可以使用自己的加密/解密逻辑实现轻松覆盖“encrypter”和“decrypter”函数以保护数据。可以在[此处](https://digitalfortress.tech/js/encrypt-localstorage-data/) 找到一些示例。

```javascript
// 更新配置后，像往常一样使用 ls
ls.set(...); // 内部调用 ls.config.encrypter(...);
ls.get(...); // 内部调用 ls.config.decrypter(...);

// 您也可以通过提供不同的秘密来加密特定的 LS 项目。
ls.set("key", "value", { secret: 'xyz'});
ls.get("key", { secret: 'xyz'});

```

**注意**：建议您**不要**在 LocalStorage 中保存用户密码或信用卡详细信息（无论是否加密）。

---

### API

该 API 与原生的“LocalStorage API”非常相似。

- [`ls.set()`](#lsset)
- [`ls.get()`](#lsget)
- [`ls.flush()`](#lsflush)
- [`ls.remove()`](#lsremove)
- [`ls.clear()`](#lsclear)

---

#### 1.`ls.set(key, value, config = {})`

在 LocalStorage 中设置一个项目。它可以接受 3 个参数

1. `key: string` **[Required]**-值应该关联的键
2. `value: string|Date|Number|Object|Boolean|Null` **[必需]**-要存储的值
3. `config: Config` **[可选]**-此参数接受与 [global config](#config) 对象相同的属性。默认为空对象

如果出现错误，则返回“false”，否则返回“undefined”。

```javascript
const res = ls.set('key', 'value');
console.log('Value =>', res); // 如果成功则返回 undefined，如果有问题则返回 false

// with ttl
ls.config.ttl = 3; // 全局 ttl 设置为 3 秒
ls.set('key', 'value'); // 值在 3 秒后过期
ls.set('key', 'value', { ttl: 5 }); // 值在 5 秒后过期（覆盖全局 ttl）

// 加密（加密特定字段）
ls.set('key', 'value', { encrypt: true });
```

#### 2.`ls.get(key, config = {})`

检索与存储在 LocalStorage 中的密钥关联的数据。它接受 2 个参数

1. `key: string` **[Required]**-值关联的键
2. `config: Config` **[可选]**-此参数接受与 [global config](#config) 对象相同的属性。默认为空对象

如果传递的密钥不存在，则返回“null”。

```javascript
const value = ls.get('key');
console.log('Value =>', value); // 从 LS 检索的值

// 如果设置了 ttl
ls.get('key'); // 如果 ttl 未过期则返回值，否则返回 null

// 当特定字段被加密并且需要解密时
ls.get('key', { decrypt: true });

// 启用全局加密时获取解密值
ls.config.encrypt = true;
ls.get('key'); // 返回解密值
```

#### 3.`ls.flush(force = false)`

刷新 localStorage 中的过期项目。此函数在初始化时自动调用一次。它可以接受一个 **可选**参数 `force: boolean`，默认为 `false`。如果设置为“true”，它会强制刷新所有项目，包括尚未过期的项目。请注意，执行 `flush(true)` 只会影响将在未来某个时间到期的项目（即它们设置了 TTL）。要删除数据，无论它是否具有 TTL，请使用 `remove()` 或 `clear()`。

```javascript
// 删除所有过期数据（即 ttl 已过期）
ls.flush();
// 删除所有具有 ttl 的数据（即即使 ttl 尚未过期）
ls.flush(true);
```

#### 4.`ls.remove(key)`

接受 `key: string` 作为参数以删除与其关联的数据。

```javascript
// 从 LS 中删除数据
ls.remove('key'); // 如果成功则返回 undefined，否则返回 false
```

#### 🔸 5.<a id="lsclear">`ls.clear()`</a>

Clears the entire localstorage linked to the current domain.

```javascript
// 从 LS 中删除所有数据
ls.clear(); // 如果成功则返回 undefined，否则返回 false
```
