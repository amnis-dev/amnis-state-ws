import { ApiQueries } from '@amnis/core/api';

export function stateApiQueriesGenerate(): ApiQueries {
  return {
    dispatch: (payload) => ({
      url: 'dispatch',
      method: 'post',
      body: payload.body,
    }),
  };
}

export default stateApiQueriesGenerate;
