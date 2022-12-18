import type { EntityAdapter, EntityState } from '@reduxjs/toolkit';
import { base64JsonDecode, base64JsonEncode } from './base64.js';

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

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  global.localStorage = new LocalStorageMemory();
}

export const { localStorage } = global;

export const localstorageSetup = <T>(
  key: string,
  state: EntityState<T>,
  adapter: EntityAdapter<T>,
) => ({
  /**
   * Load data from local storage
   */
  load() {
    const keyData = localStorage.getItem(`root-${key}`);

    if (!keyData) {
      return;
    }

    try {
      const data = base64JsonDecode<T[]>(keyData);
      if (data) {
        adapter.upsertMany(state, data);
      }
    } catch (e) {
      console.log(`Error loading ${key} data from LocalStorage.`);
    }
  },
  /**
   * Save data to local storage.
   */
  save: async (data: T[]) => {
    try {
      const encoded = base64JsonEncode(data);
      /**
       * Encode the saved data.
       */

      localStorage.setItem(`root-${key}`, encoded);
    } catch (e) {
      console.log(`Error saving ${key} data to LocalStorage.`);
    }
  },
});

export default localstorageSetup;
