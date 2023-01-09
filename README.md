# localstorage-slim

### 本项目 Fork [niketpathak/localstorage-slim](https://github.com/digitalfortress-tech/localstorage-slim), 添加支持小程序

---

一个超轻量级的库, 只有 3 KB 的本地存储工具，可选支持**ttl**和**加密**，支持**小程序**和**web**

- 📦 纯 JS（Typescript）, **0 依赖**项的 localStorage 工具
- ⏰ 支持 **TTL**
- 🧬 支持 **encryption/decryption**

---

## ➕ Install

```shell script
# Npm
$ npm install --save @banu/localstorage-slim

# Yarn
$ yarn add @banu/localstorage-slim

# pnpm
$ pnpm add @banu/localstorage-slim
```

引入

```javascript
// using ES6 modules
import ls from '@banu/localstorage-slim';

// using CommonJS modules
const ls = require('@banu/localstorage-slim');
```

## 🌱 Usage

#### Javascript

```javascript
/*** Store in localstorage ***/
const value = {
  a: new Date(),
  b: null,
  c: false,
  d: 'superman',
  e: 1234,
};

ls.set('key1', value); // value can be anything (object, array, string, number, ...)
ls.get('key1'); // { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }

/* with optional ttl in seconds */
ls.set('key2', value, { ttl: 5 });
ls.get('key2'); // within 5 secs => { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }
ls.get('key2'); // after 5 secs => null

/* with optional encryption */
ls.set('key3', value, { encrypt: true }); // "mÆk¬k§m®À½½°¹¿¯..."
ls.get('key3', { decrypt: true }); // { a: "currentdate", b: "null", c: false, d: 'superman', e: 1234 }
```

---

## <a id="config">🔧 配置</a>

`LocalStorage-slim` provides you a config object (**`ls.config`**) which can be modified to suit your needs. The available config parameters are as follows and all of them are completely **OPTIONAL**

| Parameter                                                        | Description                                                                                                                                                                                                                 | Default       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `ttl?: number\|null`                                             | Allows you to set a global TTL(time to live) **in seconds** which will be used for every item stored in the localStorage. **Global `ttl`** can be overriden with the `ls.set()/ls.get()` API.                               | null          |
| `encrypt?: boolean`                                              | Allows you to setup global encryption of the data stored in localStorage [Details](#encryption). It can be overriden with the `ls.set()/ls.get()` API                                                                       | false         |
| `decrypt?: boolean`                                              | Allows you to decrypt encrypted data stored in localStorage. Used **only** by the [`ls.get()`](#lsget) API                                                                                                                  | undefined     |
| `encrypter?: (data: unknown, secret: string): string`            | An encryption function whose signature can be seen on the left. A default implementation only obfuscates the value. This function can be overriden with the `ls.set()/ls.get()` API.                                        | Obfuscation   |
| `decrypter?: (encryptedString: string, secret: string): unknown` | A decryption function whose signature can be seen on the left. A default implementation only performs deobfuscation. This function can be overriden with the `ls.set()/ls.get()` API.                                       | deobfuscation |
| `secret?: unknown`                                               | Allows you to set a secret key that will be passed to the encrypter/decrypter functions as a parameter. The default implementation accepts a number. **Global `secret`** can be overriden with the `ls.set()/ls.get()` API. |               |

---

### <a id="encryption">🧬 Encryption/Decryption</a>

LocalStorage-slim allows you to encrypt the data that will be stored in your localStorage.

```javascript
// enable encryption globally
ls.config.encrypt = true;

// optionally use a different secret key
ls.config.secret = 89;
```

Enabling encryption ensures that the data stored in your localStorage will be unreadable by majority of the users. **Be aware** of the fact that default implementation is not a true encryption but a mere obfuscation to keep the library light in weight. You can customize the `encrypter`/`decrypter` functions to write your own algorithm or to use a secure encryption algorithm like **AES**, **TDES**, **RC4** or **rabbit** via **[CryptoJS](https://www.npmjs.com/package/crypto-js)** to suit your needs.

To use a library like CryptoJS, update the following config options -

```javascript
// enable encryption
ls.config.encrypt = true;
// set a global secret
ls.config.secret = 'secret-password';

// override encrypter function
ls.config.encrypter = (data: unknown, secret: string): string => 'encrypted string';
// override decrypter function
ls.config.decrypter = (encryptedString: string, secret: string): unknown => 'original data';
```

As seen, you can easily override the `encrypter` and `decrypter` functions with your own implementation of encryption/decryption logic to secure your data. Some examples can be found [here](https://digitalfortress.tech/js/encrypt-localstorage-data/).

```javascript
// After updating the config, use ls as you normally would
ls.set(...); // internally calls ls.config.encrypter(...);
ls.get(...); // internally calls ls.config.decrypter(...);

// you can encrypt a particular LS item by providing a different secret as well.
ls.set("key", "value", { secret: 'xyz'});
ls.get("key", { secret: 'xyz'});

```

**⚠️ Note**: It is recommended that you **do not** save user passwords or credit card details in LocalStorage (whether they be encrypted or not).

---

## ✨ API

The Api is very similar to that of the native `LocalStorage API`.

- [`ls.set()`](#lsset)
- [`ls.get()`](#lsget)
- [`ls.flush()`](#lsflush)
- [`ls.remove()`](#lsremove)
- [`ls.clear()`](#lsclear)

---

#### 🔸 1. <a id="lsset">`ls.set(key, value, config = {})`</a>

Sets an item in the LocalStorage. It can accept 3 arguments

1. `key: string` **[Required]** - The key with which the value should be associated
2. `value: string|Date|Number|Object|Boolean|Null` **[Required]** - The value to be stored
3. `config: Config` **[Optional]** - This argument accepts the same properties as the [global config](#config) object. Defaults to an empty object

Returns `false` if there was an error, else returns `undefined`.

```javascript
const res = ls.set('key', 'value');
console.log('Value =>', res); // returns undefined if successful or false if there was a problem

// with ttl
ls.config.ttl = 3; // global ttl set to 3 seconds
ls.set('key', 'value'); // value expires after 3s
ls.set('key', 'value', { ttl: 5 }); // value expires after 5s (overrides global ttl)

// with encryption (to encrypt particular fields)
ls.set('key', 'value', { encrypt: true });
```

#### 🔸 2. <a id="lsget">`ls.get(key, config = {})`</a>

Retrieves the Data associated with the key stored in the LocalStorage. It accepts 2 arguments -

1. `key: string` **[Required]** - The key with which the value is associated
2. `config: Config` **[Optional]** - This argument accepts the same properties as the [global config](#config) object. Defaults to an empty object

If the passed key does not exist, it returns `null`.

```javascript
const value = ls.get('key');
console.log('Value =>', value); // value retrieved from LS

// if ttl was set
ls.get('key'); // returns the value if ttl has not expired, else returns null

// when a particular field is encrypted, and it needs decryption
ls.get('key', { decrypt: true });

// get decrypted value when global encryption is enabled
ls.config.encrypt = true;
ls.get('key'); // returns decrypted value
```

#### 🔸 3. <a id="lsflush">`ls.flush(force = false)`</a>

Flushes expired items in the localStorage. This function is called once automatically on initialization. It can accept an **optional** argument `force: boolean` that defaults to `false`. If set to `true`, it force-flushes all items including the ones that haven't expired yet. Note that doing `flush(true)` only affects items that were due to expire sometime in future (i.e. they had a TTL set on them). To remove data, whether or not it has a TTL, use `remove()` or `clear()`.

```javascript
// removes all expired data (i.e. ttl has expired)
ls.flush();
// removes all data that has a ttl (i.e. even if the ttl has not expired yet)
ls.flush(true);
```

#### 🔸 4. <a id="lsremove">`ls.remove(key)`</a>

Accepts the `key: string` as an argument to remove the data associated with it.

```javascript
// delete data from the LS
ls.remove('key'); // returns undefined if successful, false otherwise
```

#### 🔸 5.<a id="lsclear">`ls.clear()`</a>

Clears the entire localstorage linked to the current domain.

```javascript
// removes all data from the LS
ls.clear(); // returns undefined if successful, false otherwise
```
