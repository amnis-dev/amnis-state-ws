import { StateCreate } from '@amnis/core/state';
import type {
  ApiMSGraphQueries,
} from './msgraph.types';

export function apiMSGraphQueries(): ApiMSGraphQueries {
  return {
    myendpoint: (payload: StateCreate) => ({
      url: 'myendpoint',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiMSGraphQueries;
