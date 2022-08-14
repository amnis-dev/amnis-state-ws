import { createHash, randomBytes } from 'crypto';
import { cryptoRandomString } from './crypto';

let AUTH_TOKEN_SECRET = cryptoRandomString();
let AUTH_SESSION_SECRET = createHash('sha256').update(randomBytes(32)).digest('base64').slice(0, 32);

let AUTH_TOKEN_LIFE = '30m';
let AUTH_SESSION_LIFE = '1h';

try {
  if (process?.env) {
    AUTH_TOKEN_SECRET = process.env.AMNIS_AUTH_TOKEN_SECRET || AUTH_TOKEN_SECRET;
    AUTH_SESSION_SECRET = process.env.AMNIS_AUTH_SESSION_SECRET || AUTH_SESSION_SECRET;
    AUTH_TOKEN_LIFE = process.env.AMNIS_AUTH_TOKEN_LIFE || AUTH_TOKEN_LIFE;
    AUTH_SESSION_LIFE = (
      process.env.AMNIS_AUTH_SESSION_LIFE || AUTH_SESSION_LIFE
    );
  }
} catch (error) {
  /**
   * A catch means we're running in an environment other than node.
   */
}

export const cryptConfig = {
  AUTH_TOKEN_SECRET,
  AUTH_SESSION_SECRET,
  AUTH_TOKEN_LIFE,
  AUTH_SESSION_LIFE,
};

export type CryptConfig = typeof cryptConfig;

export function cryptConfigure(config: Partial<CryptConfig>) {
  Object.keys(config).forEach((key) => {
    const confKey = key as keyof CryptConfig;
    if (cryptConfig[confKey] !== undefined) {
      cryptConfig[confKey] = config[confKey] as string;
    }
  });
}
