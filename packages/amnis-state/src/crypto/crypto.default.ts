import { cryptoCreate } from '@amnis/core/crypto';

export const cryptoDefault = cryptoCreate({
  name: 'Unknown Crypto Key',
  tag: 'unknown',
  pair: 'public',
  value: '',
});

export default cryptoDefault;
