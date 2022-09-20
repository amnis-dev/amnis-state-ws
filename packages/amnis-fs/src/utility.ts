/**
 * Returns true if a buffer is webp data.
 */
export function isWebp(buffer: Buffer) {
  if (!buffer || buffer.length < 12) {
    return false;
  }

  return (buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80);
}

export default { isWebp };
