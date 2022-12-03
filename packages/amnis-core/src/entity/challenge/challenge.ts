import { dateNumeric } from '../../core.js';
import { rtk } from '../../rtk.js';
import { uid } from '../../uid.js';
import type { Challenge, ChallengeBase, ChallengeCreator } from './challenge.types.js';

export const challengeKey = 'challenge';

export const challengeBase: ChallengeBase = {
  value: rtk.nanoid(8),
  expires: dateNumeric(),
};

export const challengeCreator = (
  challenge: ChallengeCreator,
): Challenge => ({
  ...challengeBase,
  expires: dateNumeric('5m'),
  ...challenge,
  $id: uid(challengeKey),
});
