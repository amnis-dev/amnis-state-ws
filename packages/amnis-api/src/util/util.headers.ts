import {
  agentSign, base64JsonEncode, Challenge, challengeKey, selectBearer, State,
} from '@amnis/core';

/**
 * Adds an authroization token to the header.
 */
export const headersAuthorizationToken = (
  headers: Headers,
  state: State,
  bearerId: string,
): void => {
  const bearer = selectBearer(state, bearerId);

  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer.access}`);
  }
};

/**
 * Signs the payload of the request and adds the encoded signature value to the header.
 */
export const headersSignature = async (
  headers: Headers,
  body: Record<string, unknown> | string,
) => {
  const bodyEncoded = typeof body === 'string' ? body : base64JsonEncode(body);
  const signature = await agentSign(bodyEncoded);
  headers.set('Signature', signature);
};

/**
 * Adds a challenge header if the challenge reference matches the reference.
 */
export const headersChallenge = async (
  headers: Headers,
  state: State,
  ref: string,
) => {
  const challengeEntities = state[challengeKey]?.entities as Record<string, Challenge>;

  if (!challengeEntities) {
    return;
  }

  const challenge = Object.values(challengeEntities).find((c) => c.ref === ref);

  if (!challenge) {
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);
  headers.set('Challenge', challengeEncoded);
};
