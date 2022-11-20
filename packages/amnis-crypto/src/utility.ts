export const stringEncoder = (value: string, unpad = false): string => {
  if (typeof window === 'undefined') {
    const buffer = Buffer.from(value).toString('base64');
    const newBuffer = buffer.replaceAll('+', '-').replaceAll('/', '_');
    if (unpad) {
      return newBuffer.replaceAll('=', '');
    }
    return newBuffer;
  }

  const buffer = window.btoa(value);
  const newBuffer = buffer.replaceAll('+', '-').replaceAll('/', '_');
  if (unpad) {
    return newBuffer.replaceAll('=', '');
  }
  return newBuffer;
};

export const stringDecoder = (value: string): string => {
  if (typeof window === 'undefined') {
    const buffer = Buffer.from(
      value.replaceAll('-', '+').replaceAll('_', '/'),
      'base64',
    ).toString();
    return buffer;
  }

  const buffer = window.atob(
    value.replaceAll('-', '+').replaceAll('_', '/'),
  );
  return buffer;
};

export const base64Encode = (data: Uint8Array, unpad = false): string => {
  const dataString = String.fromCharCode(...data);
  return stringEncoder(dataString, unpad);
};

export const base64Decode = (data: string): Uint8Array => {
  const decoded = stringDecoder(data);
  return new Uint8Array(decoded.split('').map((c) => c.charCodeAt(0)));
};
