import bcrypt from 'bcrypt';

export async function passCreate(plaintext: string): Promise<string> {
  const hashtext = await bcrypt.hash(plaintext, 8);
  return hashtext;
}

export async function passCompare(plaintext: string, hashtext: string): Promise<boolean> {
  const same = await bcrypt.compare(plaintext, hashtext);
  return same;
}

export function passCreateSync(plaintext: string): string {
  return bcrypt.hashSync(plaintext, 8);
}

export function passCompareSync(plaintext: string, hashtext: string): boolean {
  return bcrypt.compareSync(plaintext, hashtext);
}
