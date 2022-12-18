import { base64JsonDecode, base64JsonEncode } from '../../base64.js';
import { dateNumeric } from '../../core.js';
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
  const encoded = base64JsonEncode(entityStrip(challenge as Entity<Challenge>));
  return encoded;
};

export const challengeDecode = (encoded: string) => {
  const decoded = base64JsonDecode<Challenge>(encoded);
  return decoded;
};
