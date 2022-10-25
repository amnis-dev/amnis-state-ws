import { selectors, State } from '@amnis/core';
import type { ApiPrepareHeaders } from '../types.js';

export const headersAuthorizationToken: ApiPrepareHeaders = (headers, { getState, endpoint }) => {
  const token = selectors.selectToken(getState() as State, 'core', 'access');

  if (token && endpoint !== 'refresh') {
    headers.set('Authorization', `Bearer ${token.jwt}`);
  }
  return headers;
};

export default { headersAuthorizationToken };
