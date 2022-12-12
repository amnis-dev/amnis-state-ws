import type { EntityAdapter, EntityState } from '@reduxjs/toolkit';
import { base64Decode, base64Encode } from './index.js';

/**
 * Mocked memeory version of LocalStorage in case a form doesn't exist.
 */
class LocalStorageMemory {
  store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: keyof typeof this.store) {
    return this.store[key] || null;
  }

  setItem(key: keyof typeof this.store, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: keyof typeof this.store) {
    delete this.store[key];
  }
}

if (typeof localStorage === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  global.localStorage = new LocalStorageMemory();
}

export const localstorageSetup = <T>(
  key: string,
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
) => ({
  /**
   * Load data from local storage
   */
  load() {
    const keyData = localStorage.getItem(`state-${key}`);

    if (!keyData) {
      return;
    }

    try {
      const dec = new TextDecoder();
      const data = JSON.parse(dec.decode(base64Decode(keyData))) as T[];
      adapter.upsertMany(state, data);
    } catch (e) {
      console.log(`Error loading ${key} data from LocalStorage.`);
    }
  },
  /**
   * Save data to local storage.
   */
  save: async (data: T[]) => {
    try {
      const enc = new TextEncoder();
      const encoded = base64Encode(enc.encode(JSON.stringify(data)));
      /**
     * Encode the saved data.
     */

      localStorage.setItem(`state-${key}`, encoded);
    } catch (e) {
      console.log(`Error saving ${key} data to LocalStorage.`);
    }
  },
});

export default localstorageSetup;
