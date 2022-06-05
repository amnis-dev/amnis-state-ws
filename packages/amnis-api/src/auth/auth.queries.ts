import type {
  ApiAuthQueries,
} from './auth.types';

export function apiQueries(): ApiAuthQueries {
  return {
    authorize: (payload: unknown) => ({
      url: 'authorize',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiQueries;
