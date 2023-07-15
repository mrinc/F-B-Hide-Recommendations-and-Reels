import type { Browser } from "webextension-polyfill";
declare let chrome: Browser;
declare let browser: Browser;

export class Storage {
  private knownInstance: 0 | 1 | 2 = 0;
  private defaults: SmartStorageTypeDefaults = new SmartStorageTypeDefaults();
  async setup(): Promise<Storage> {
    if (this.knownInstance !== 0) return this;

    if (chrome === undefined) {
      this.knownInstance = 2;
      return this;
    }
    if (typeof chrome.storage !== "object") {
      this.knownInstance = 2;
      return this;
    }
    if (typeof chrome.storage.sync !== "object") {
      this.knownInstance = 2;
      return this;
    }
    if (typeof chrome.storage.sync.get !== "function") {
      this.knownInstance = 2;
      return this;
    }
    if (typeof chrome.storage.sync.set !== "function") {
      this.knownInstance = 2;
      return this;
    }
    await chrome.storage.sync.set({ _tdata: "ok" });
    if (chrome.storage.sync.get("_tdata") === undefined) {
      this.knownInstance = 2;
      return this;
    }
    if ((await chrome.storage.sync.get("_tdata")) === undefined) {
      this.knownInstance = 2;
      return this;
    }
    if ((await chrome.storage.sync.get("_tdata"))._tdata === undefined) {
      this.knownInstance = 2;
      return this;
    }
    this.knownInstance = 1;

    return this;
  }
  get version(): string {
    return this.getRawInstance().runtime.getManifest().version;
  }
  getRawInstance(): Browser {
    if (this.knownInstance === 0)
      throw "unknown storage instance: run setup first";
    if (this.knownInstance === 1) return chrome;
    return browser;
  }
  async get<T extends string>(
    key: T
  ): Promise<DynamicallyReferencedItem<SmartStorageType, T>> {
    return await this.getRaw(key, (this.defaults as any)[key]());
  }
  async getRaw(key: string, def: any): Promise<any> {
    if (this.knownInstance === 0)
      throw "unknown storage instance: run setup first";
    let returnData: any = null;
    if (this.knownInstance === 1) {
      returnData =
        ((await chrome.storage.sync.get(key))[key] as any) ?? def ?? null;
    } else {
      returnData =
        ((await browser.storage.sync.get(key))[key] as any) ?? def ?? null;
    }
    if (returnData === null) {
      returnData = def;
    }
    if (typeof def === "object") {
      for (const key in Object.keys(def)) {
        if (returnData[key] === undefined) {
          returnData[key] = (def as any)[key];
        }
      }
    }

    return returnData;
  }
  async set<T extends string>(
    key: T,
    value: DynamicallyReferencedItem<SmartStorageType, T>
  ): Promise<void> {
    await this.setRaw(key, value);
  }
  async setRaw<T = any>(key: string, data: T): Promise<void> {
    if (this.knownInstance === 0)
      throw "unknown storage instance: run setup first";
    if (this.knownInstance === 1) {
      await chrome.storage.sync.set({ [key]: data });
      return;
    }
    await browser.storage.sync.set({ [key]: data });
  }
  async delete<T extends string>(key: T): Promise<void> {
    if (this.knownInstance === 0)
      throw "unknown storage instance: run setup first";
    if (this.knownInstance === 1) {
      await chrome.storage.sync.remove(key);
      return;
    }
    await browser.storage.sync.remove(key);
  }
  async clear(): Promise<void> {
    if (this.knownInstance === 0)
      throw "unknown storage instance: run setup first";
    if (this.knownInstance === 1) {
      await chrome.storage.sync.clear();
      return;
    }
    await browser.storage.sync.clear();
  }
}

export interface ConfigBase {}
export interface ConfigDefition extends ConfigBase {
  version: string;
  needsDelay: boolean;
  friendRequests: boolean;
  reels: boolean;
  containsReels: boolean;
  suggestions: boolean;
  tagged: boolean;
  commentedOn: boolean;
  commentedOnFriend: boolean;
  answeredQuestion: boolean;
  peopleMayKnow: boolean;
  stories: boolean;
  clickToShow: boolean;
  createPost: boolean;
  hideBlocks: boolean;
  games: boolean;
}
export interface SmartStorageType {
  data(): ConfigDefition;
  diagVersion(): string;
}
export class SmartStorageTypeDefaults {
  diagVersion(): string {
    return "0.0.0";
  }
  data(): ConfigDefition {
    return {
      version: "0.0.0",
      needsDelay: true,
      friendRequests: true,
      reels: true,
      containsReels: true,
      suggestions: true,
      tagged: true,
      commentedOn: true,
      commentedOnFriend: true,
      answeredQuestion: true,
      peopleMayKnow: true,
      stories: true,
      clickToShow: true,
      createPost: true,
      hideBlocks: false,
      games: true,
    };
  }
}

export type DynamicallyReferencedItem<
  Interface extends Record<string, any>,
  Key extends string
> = Interface[Key] extends () => infer Return ? Return : never;
