import { randomBytes } from 'crypto';

export const authTokenSecret: string = process.env.AMNIS_AUTH_TOKEN_SECRET || randomBytes(64).toString('hex');

export default { authTokenSecret };
