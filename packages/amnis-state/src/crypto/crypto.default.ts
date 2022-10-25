import { cryptoCreate } from '@amnis/core';

export const cryptoDefault = cryptoCreate({
  name: 'Unknown Crypto Key',
  tag: 'unknown',
  pair: 'public',
  value: '',
});

export default cryptoDefault;
