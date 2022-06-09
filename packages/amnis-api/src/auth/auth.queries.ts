import type {
  ApiAuthQueries,
} from './auth.types';

export function apiQueries(): ApiAuthQueries {
  return {
    login: (payload) => ({
      url: 'login',
      method: 'post',
      body: payload,
    }),
    authorize: (payload) => ({
      url: 'authorize',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiQueries;
