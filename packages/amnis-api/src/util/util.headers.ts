import fetch from 'cross-fetch';

import {
  agentSign, base64JsonEncode, Challenge, selectBearer, State,
} from '@amnis/core';

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

export const headersSignature = async (
  headers: Headers,
  body: Record<string, unknown> | string,
) => {
  const bodyEncoded = typeof body === 'string' ? body : base64JsonEncode(body);
  const signature = await agentSign(bodyEncoded);
  headers.set('Signature', signature);
};

export const headersChallenge = async (
  headers: Headers,
  challengeUrl: string,
) => {
  const result = await fetch(challengeUrl, { method: 'POST', body: JSON.stringify({}) });
  if (result.status !== 200) {
    console.error(`There was a problem fetching a challenge code from "${challengeUrl}".`);
    return;
  }

  const json = await result.json();
  const challenge = json.result as Challenge | undefined;
  if (!challenge) {
    console.error(`No challenge received from "${challengeUrl}".`);
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);
  headers.set('Challenge', challengeEncoded);
};
