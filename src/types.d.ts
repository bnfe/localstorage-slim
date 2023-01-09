export type Encrypter = (...args: unknown[]) => string;
export type Decrypter = (...args: unknown[]) => string;

export interface LocalStorageConfig {
  ttl?: number | null;
  encrypt?: boolean;
  decrypt?: boolean;
  encrypter?: Encrypter;
  decrypter?: Decrypter;
  secret?: unknown;
}

declare global {
  const wx: any;
  const tt: any;
  const qq: any;
  const jd: any;
  const swan: any;
  const my: any;
}
