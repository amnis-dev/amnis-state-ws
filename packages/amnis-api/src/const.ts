export const API_AUTH_URL: string = process.env.AMNIS_API_AUTH_URL || 'http://localhost:4000/api/';
export const API_CRUD_URL: string = process.env.AMNIS_API_CRUD_URL || 'http://localhost:4001/api/';

export const API_TWITTER_OAUTH2_URL: string = process.env.API_TWITTER_OAUTH2_URL || 'https://api.twitter.com/2/';
export const API_MICROSOFT_OAUTH2_URL: string = process.env.API_MICROSOFT_OAUTH2_URL || 'https://login.microsoftonline.com/consumers/oauth2/v2.0/';

export default {
  API_AUTH_URL,
  API_CRUD_URL,
  API_TWITTER_OAUTH2_URL,
  API_MICROSOFT_OAUTH2_URL,
};
