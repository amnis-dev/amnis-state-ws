/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import {
  agentSign, base64JsonEncode, Challenge, IoOutput, Otp, otpKey, selectBearer, State, UID,
} from '@amnis/core';
import type { EntityState } from '@reduxjs/toolkit';
import { apiSelectors } from '../api/index.js';

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
  const bodyEncoded = typeof body === 'string' ? body : JSON.stringify(body);
  const signature = await agentSign(bodyEncoded);
  headers.set('Signature', signature);
};

/**
 * Adds a challenge header if the challenge reference matches the reference.
 */
export const headersChallenge = async (
  headers: Headers,
  state: State,
) => {
  const apiAuthMeta = apiSelectors.selectById(state as any, 'apiAuth');
  if (!apiAuthMeta) {
    console.error('Auth API must be defined to generate challenge object.');
    return;
  }

  const result = await fetch(`${apiAuthMeta.baseUrl}/challenge`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (result?.status !== 200) {
    console.error('Failed to generate a challenge object.');
    return;
  }

  const json = await result.json() as IoOutput<Challenge>['json'];
  const challenge = json.result;

  if (!challenge) {
    console.error('Failed to receive challenge object.');
    return;
  }

  const challengeEncoded = base64JsonEncode(challenge);
  headers.set('Challenge', challengeEncoded);
};

/**
 * Adds the latest otp as a header if one exists.
 */
export const headersOtp = (
  headers: Headers,
  state: State,
) => {
  const slice = state[otpKey] as EntityState<Otp> & { latest: UID | null };
  if (!slice) {
    console.error('OTP reducer must be defined to attach OTP objects on requests.');
    return;
  }

  if (!slice.latest) {
    return;
  }

  const otp = slice.entities[slice.latest];

  if (!otp) {
    return;
  }

  const otpEncoded = base64JsonEncode(otp);
  headers.set('Otp', otpEncoded);
};
