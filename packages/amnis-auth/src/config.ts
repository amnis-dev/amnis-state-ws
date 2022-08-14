import { createHash, randomBytes } from 'crypto';
import { cryptoRandomString } from './crypto';

const AUTH_TOKEN_SECRET = process.env.AMNIS_AUTH_TOKEN_SECRET || cryptoRandomString();
const AUTH_SESSION_SECRET = process.env.AMNIS_AUTH_SESSION_SECRET || createHash('sha256').update(randomBytes(32)).digest('base64').slice(0, 32);

const AUTH_TOKEN_LIFE = process.env.AMNIS_AUTH_TOKEN_LIFE || '30m';
const AUTH_SESSION_LIFE = process.env.AMNIS_AUTH_SESSION_LIFE || '1h';

export const cryptConfig = {
  AUTH_TOKEN_SECRET,
  AUTH_SESSION_SECRET,
  AUTH_TOKEN_LIFE,
  AUTH_SESSION_LIFE,
};

export type CryptConfig = typeof cryptConfig;
