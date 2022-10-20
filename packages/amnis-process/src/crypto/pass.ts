import {
  hash, compare, hashSync, compareSync,
} from 'bcrypt';

export async function passCreate(plaintext: string): Promise<string> {
  const hashtext = await hash(plaintext, 8);
  return hashtext;
}

export async function passCompare(plaintext: string, hashtext: string): Promise<boolean> {
  const same = await compare(plaintext, hashtext);
  return same;
}

export function passCreateSync(plaintext: string): string {
  return hashSync(plaintext, 8);
}

export function passCompareSync(plaintext: string, hashtext: string): boolean {
  return compareSync(plaintext, hashtext);
}
