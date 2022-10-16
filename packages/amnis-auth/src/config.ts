import {
  createHash, randomBytes,
} from 'node:crypto';

const AUTH_SESSION_SECRET = process.env.AMNIS_AUTH_SESSION_SECRET || createHash('sha256').update(randomBytes(256)).digest('base64').slice(0, 256);

const AUTH_TOKEN_LIFE = process.env.AMNIS_AUTH_TOKEN_LIFE || '30m';
const AUTH_SESSION_LIFE = process.env.AMNIS_AUTH_SESSION_LIFE || '1h';

const AUTH_RSA_MODULUS_LENGTH = process.env.AMNIS_AUTH_RSA_MODULUS_LENGTH || 4096;
const AUTH_RSA_PUBLIC_KEY_TYPE = process.env.AMNIS_AUTH_RSA_PUBLIC_KEY_TYPE || 'spki';
const AUTH_RSA_PRIVATE_KEY_TYPE = process.env.AMNIS_AUTH_RSA_PRIVATE_KEY_TYPE || 'pkcs8';

// AUTH_RSA_KEY_SECRET =

export const cryptConfig = {
  AUTH_SESSION_SECRET,
  AUTH_TOKEN_LIFE,
  AUTH_SESSION_LIFE,
  AUTH_RSA_MODULUS_LENGTH,
  AUTH_RSA_PUBLIC_KEY_TYPE,
  AUTH_RSA_PRIVATE_KEY_TYPE,
};

export type CryptConfig = typeof cryptConfig;
