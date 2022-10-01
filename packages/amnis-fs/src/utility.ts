const magicWebp = [87, 69, 66, 80];

/**
 * Returns true if a buffer is webp data.
 */
export function isWebp(buffer: Buffer) {
  if (!buffer || buffer.length < 12) {
    return false;
  }

  return buffer.slice(8, 12).every((byte, i) => byte === magicWebp[i]);
}

export default { isWebp };
