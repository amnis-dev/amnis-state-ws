import { asymGenerate, asymEncrypt, asymDecrypt } from './asym.js';

const data = 'This is a secret';

test('should generate a key pair', async () => {
  const keyPair = await asymGenerate();
  expect(typeof keyPair.privateKey === 'string').toBe(true);
  expect(typeof keyPair.publicKey === 'string').toBe(true);
});

test('should generate a key pair, encrypt data, and decrypt data', async () => {
  const keyPair = await asymGenerate();

  const encryption = await asymEncrypt(data, keyPair.publicKey);
  expect(encryption).toBeDefined();

  const decryption = await asymDecrypt(encryption, keyPair.privateKey);
  expect(decryption).toBe(data);
});

test('should generate a key pair, encrypt data, and fail decryption with invalid key', async () => {
  const keyPair = await asymGenerate();

  const encryption = await asymEncrypt(data);
  expect(encryption).toBeDefined();

  const decryption = await asymDecrypt(encryption, keyPair.privateKey);
  expect(decryption).toBeUndefined();
});
