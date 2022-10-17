import type {
  ApiAuthQueries,
} from './auth.types.js';

export function apiQueries(): ApiAuthQueries {
  return {
    login: (payload) => ({
      url: 'login',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
    logout: (payload) => ({
      url: 'logout',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
    pkce: (payload) => ({
      url: 'pkce',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
    renew: (payload) => ({
      url: 'renew',
      method: 'post',
      credentials: 'include',
      body: payload,
    }),
    verify: (payload) => ({
      url: 'verify',
      method: 'post',
      body: payload,
    }),
  };
}

export default apiQueries;
