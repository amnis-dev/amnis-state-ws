import type { Api } from './api.types.js';

export const apiKey = 'api';

export const apiBase: Api = {
  id: 'api',
  baseUrl: '',
};

export function apiCreator(
  api: Api,
): Api {
  return {
    ...api,
  };
}
