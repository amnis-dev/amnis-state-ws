import { selectToken, State } from '@amnis/core';
import type { ApiPrepareHeaders } from '../types.js';

export const headersAuthorizationToken: ApiPrepareHeaders = (headers, { getState, endpoint }) => {
  const token = selectToken(getState() as State, 'core', 'access');

  if (token && endpoint !== 'refresh') {
    headers.set('Authorization', `Bearer ${token.jwt}`);
  }
  return headers;
};

export default { headersAuthorizationToken };
