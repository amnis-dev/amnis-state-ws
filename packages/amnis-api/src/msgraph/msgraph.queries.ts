import type {
  PayloadEntityCreate,
} from '@amnis/core/actions';
import type {
  ApiMSGraphQueries,
} from './msgraph.types';

export function apiMSGraphQueriesSetup(): ApiMSGraphQueries {
  return {
    myendpoint: (payload: PayloadEntityCreate) => ({
      url: 'myendpoint',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiMSGraphQueriesSetup;
