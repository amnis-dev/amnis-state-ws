import {
  createHash, randomBytes,
} from 'node:crypto';

const PROCESS_SESSION_SECRET = process.env.AMNIS_PROCESS_SESSION_SECRET || createHash('sha256').update(randomBytes(256)).digest('base64').slice(0, 256);

const PROCESS_TOKEN_LIFE = process.env.AMNIS_PROCESS_TOKEN_LIFE || '30m';
const PROCESS_SESSION_LIFE = process.env.AMNIS_PROCESS_SESSION_LIFE || '1h';

const PROCESS_RSA_MODULUS_LENGTH = process.env.AMNIS_PROCESS_RSA_MODULUS_LENGTH || 4096;
const PROCESS_RSA_PUBLIC_KEY_TYPE = process.env.AMNIS_PROCESS_RSA_PUBLIC_KEY_TYPE || 'spki';
const PROCESS_RSA_PRIVATE_KEY_TYPE = process.env.AMNIS_PROCESS_RSA_PRIVATE_KEY_TYPE || 'pkcs8';

const PROCESS_CRYPTO_TAG = process.env.AMNIS_PROCESS_CRYPTO_TAG || 'process-crypto';

const PROCESS_TWITTER_OAUTH2_URL = process.env.AMNIS_PROCESS_TWITTER_OAUTH2_URL || 'https://api.twitter.com/2/';
const PROCESS_MICROSOFT_OAUTH2_URL = process.env.AMNIS_PROCESS_MICROSOFT_OAUTH2_URL || 'https://login.microsoftonline.com/consumers/oauth2/v2.0/';

export const processConfig = {
  PROCESS_SESSION_SECRET,
  PROCESS_TOKEN_LIFE,
  PROCESS_SESSION_LIFE,
  PROCESS_RSA_MODULUS_LENGTH,
  PROCESS_RSA_PUBLIC_KEY_TYPE,
  PROCESS_RSA_PRIVATE_KEY_TYPE,
  PROCESS_CRYPTO_TAG,
  PROCESS_TWITTER_OAUTH2_URL,
  PROCESS_MICROSOFT_OAUTH2_URL,
};

export default processConfig;
