import { dateNumeric } from '../../core.js';
import { base64Decode, base64Encode } from '../../io/crypto/index.js';
import { rtk } from '../../rtk.js';
import { uid } from '../../uid.js';
import { entityStrip } from '../entity.js';
import { Entity } from '../entity.types.js';
import type { Challenge, ChallengeBase, ChallengeCreator } from './challenge.types.js';

export const challengeKey = 'challenge';

export const challengeBase = (): ChallengeBase => ({
  value: rtk.nanoid(8),
  expires: dateNumeric('5m'),
});

export const challengeCreator = (
  challenge: ChallengeCreator,
): Challenge => ({
  ...challengeBase(),
  ...challenge,
  $id: uid(challengeKey),
});

export const challengeEncode = (challenge: Challenge) => {
  const enc = new TextEncoder();
  return base64Encode(
    enc.encode(
      JSON.stringify(entityStrip(challenge as Entity<Challenge>)),
    ),
  );
};

export const challengeDecode = (encoded: string) => {
  const dec = new TextDecoder();
  return JSON.parse(
    dec.decode(
      base64Decode(encoded),
    ),
  ) as Challenge;
};
