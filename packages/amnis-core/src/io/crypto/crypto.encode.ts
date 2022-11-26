/**
 * Converts a Uint8Array Buffer to a Base64 String.
 */
export const base64Encode = (u8: Uint8Array, unpad = false): string => {
  if (typeof window === 'undefined') {
    const value = Buffer.from(u8).toString('base64');
    const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
    if (unpad) {
      return replaced.replaceAll('=', '');
    }
    return replaced;
  }

  const value = window.btoa(String.fromCharCode(...u8));
  const replaced = value.replaceAll('+', '-').replaceAll('/', '_');
  if (unpad) {
    return replaced.replaceAll('=', '');
  }
  return replaced;
};

/**
 * Converts a Base64 String to a Uint8Array buffer.
 */
export const base64Decode = (str: string): Uint8Array => {
  if (typeof window === 'undefined') {
    const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
    const value = Buffer.from(replaced, 'base64');
    return new Uint8Array(value);
  }

  const replaced = str.replaceAll('-', '+').replaceAll('_', '/');
  const value = window.atob(replaced).split('').map((c) => c.charCodeAt(0));
  return new Uint8Array(value);
};

/**
 * Encodes a base 16 hash value
 */
export const hashEncode = (data: Uint8Array) => {
  const hashArray = Array.from(data);
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
