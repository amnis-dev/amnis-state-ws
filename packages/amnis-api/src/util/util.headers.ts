import { selectBearer, State } from '@amnis/core';
import type { ApiPrepareHeaders } from '../types.js';

type headersAuthorizationToken = (bearerId: string) => ApiPrepareHeaders;

export const headersAuthorizationToken: headersAuthorizationToken = (
  bearerId,
) => (headers, { getState }) => {
  const bearer = selectBearer(getState() as State, bearerId);

  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer.access}`);
  }
  return headers;
};

export default { headersAuthorizationToken };
