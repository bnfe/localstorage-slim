import { getEnv } from '../env';
export type MyStorage = {
  getItem: (key: string) => unknown;
  setItem: (key: string, value: unknown) => void | boolean;
  removeItem: (key: string) => void;
  clear: () => void;
  keys: () => string[];
  length: number;
};

const env = getEnv();
let localStorage!: MyStorage;

if (env === 'WEB') {
  localStorage = {
    getItem: (key: string): string | null => {
      const str = window.localStorage.getItem(key);
      try {
        return JSON.parse(str || '');
      } catch (e) {
        return str;
      }
    },
    setItem: (key, value) => {
      // typeof value === 'string' ? value : JSON.stringify(value)
      return window.localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (k) => window.localStorage.removeItem(k),
    clear: () => window.localStorage.clear(),
    keys: (): string[] => Object.keys(window.localStorage) || [],
    length: Object.keys(window.localStorage).length,
  };
}

if (env === 'WEAPP') {
  // storage 应只用来进行数据的持久化存储，不应用于运行时的数据传递或全局状态管理。
  // 启动过程中过多的 同步读写存储，会显著影响启动耗时。

  // TODO 支持异步
  localStorage = {
    getItem: wx.getStorageSync,
    setItem: wx.setStorageSync,
    removeItem: wx.removeStorageSync,
    clear: wx.clearStorageSync,
    keys: (): string[] => wx.getStorageInfoSync().keys,
    length: wx.getStorageInfoSync().keys.length,
  };
}

export default localStorage;
