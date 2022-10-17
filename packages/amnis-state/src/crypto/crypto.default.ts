import { cryptoCreate } from '@amnis/core/crypto/index.js';

export const cryptoDefault = cryptoCreate({
  name: 'Unknown Crypto Key',
  tag: 'unknown',
  pair: 'public',
  value: '',
});

export default cryptoDefault;
