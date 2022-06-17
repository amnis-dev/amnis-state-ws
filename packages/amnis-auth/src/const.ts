import { randomBytes } from 'crypto';

export const AUTH_TOKEN_SECRET: string = process.env.AMNIS_AUTH_TOKEN_SECRET || randomBytes(64).toString('hex');
export const AUTH_TOKEN_LIFE = process.env.AMNIS_AUTH_TOKEN_LIFE || '30m'; // Access token life.
export const AUTH_SESSION_LIFE = process.env.AMNIS_AUTH_SESSION_LIFE || '1h'; // CoreSession life.

export default { AUTH_TOKEN_SECRET, AUTH_TOKEN_LIFE, AUTH_SESSION_LIFE };
