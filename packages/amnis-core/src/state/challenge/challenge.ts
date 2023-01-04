import { dateNumeric } from '../../core.js';
import { rtk } from '../../rtk.js';
import { uid } from '../../uid.js';
import type { Challenge } from './challenge.types.js';

export const challengeKey = 'challenge';

export const challengeBase = (): Omit<Challenge, '$id'> => ({
  val: rtk.nanoid(8),
  exp: dateNumeric('5m'),
});

export const challengeCreate = (
  challenge: Partial<Challenge>,
): Challenge => {
  const challangeNew: Challenge = {
    ...challengeBase(),
    ...challenge,
    $id: uid(challengeKey),
  };

  return challangeNew;
};
