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
    pkce: (payload) => ({
      url: 'pkce',
      method: 'post',
      body: payload,
    }),
    renew: (payload) => ({
      url: 'renew',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiQueries;
