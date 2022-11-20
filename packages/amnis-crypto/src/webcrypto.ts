import type { webcrypto as wc } from 'node:crypto';

let webcryptoInstance: wc.Crypto | undefined;

export const webcrypto = async (): Promise<wc.Crypto> => {
  if (!webcryptoInstance) {
    if (typeof window === 'undefined') {
      const c = await import('node:crypto');
      webcryptoInstance = c.webcrypto;
    } else {
      webcryptoInstance = window.crypto as wc.Crypto;
    }
  }

  return webcryptoInstance;
};

export default webcrypto;
