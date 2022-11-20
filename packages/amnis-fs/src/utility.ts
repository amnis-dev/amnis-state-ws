/* eslint-disable no-bitwise */
import { IImage, ISize } from './utility.types.js';

const magicWebp = [87, 69, 66, 80];

/**
 * Returns true if a buffer is webp data.
 */
export function isWebp(buffer: Uint8Array) {
  if (!buffer || buffer.length < 12) {
    return false;
  }

  return buffer.slice(8, 12).every((byte, i) => byte === magicWebp[i]);
}

function calculateExtended(buffer: Buffer): ISize {
  return {
    height: 1 + buffer.readUIntLE(7, 3),
    width: 1 + buffer.readUIntLE(4, 3),
  };
}

function calculateLossless(buffer: Buffer): ISize {
  return {
    height: 1 + (((buffer[4] & 0xF) << 10) | (buffer[3] << 2) | ((buffer[2] & 0xC0) >> 6)),
    width: 1 + (((buffer[2] & 0x3F) << 8) | buffer[1]),
  };
}

function calculateLossy(buffer: Buffer): ISize {
  // `& 0x3fff` returns the last 14 bits
  // TO-DO: include webp scaling in the calculations
  return {
    height: buffer.readInt16LE(8) & 0x3fff,
    width: buffer.readInt16LE(6) & 0x3fff,
  };
}

export const WEBP: IImage = {
  validate(buffer) {
    const riffHeader = buffer.toString('ascii', 0, 4) === 'RIFF';
    const webpHeader = buffer.toString('ascii', 8, 12) === 'WEBP';
    const vp8Header = buffer.toString('ascii', 12, 15) === 'VP8';
    return (riffHeader && webpHeader && vp8Header);
  },

  calculate(buffer) {
    const chunkHeader = buffer.toString('ascii', 12, 16);
    const bufferSliced = buffer.slice(20, 30);

    // Extended webp stream signature
    if (chunkHeader === 'VP8X') {
      const extendedHeader = bufferSliced[0];
      const validStart = (extendedHeader & 0xc0) === 0;
      const validEnd = (extendedHeader & 0x01) === 0;
      if (validStart && validEnd) {
        return calculateExtended(bufferSliced);
      }
      // TODO: breaking change
      throw new TypeError('Invalid WebP');
    }

    // Lossless webp stream signature
    if (chunkHeader === 'VP8 ' && bufferSliced[0] !== 0x2f) {
      return calculateLossy(bufferSliced);
    }

    // Lossy webp stream signature
    const signature = bufferSliced.toString('hex', 3, 6);
    if (chunkHeader === 'VP8L' && signature !== '9d012a') {
      return calculateLossless(bufferSliced);
    }

    throw new TypeError('Invalid WebP');
  },
};
