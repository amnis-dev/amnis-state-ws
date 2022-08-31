let API_AUTH_URL = 'http://localhost:4000/';
let API_CRUD_URL = 'http://localhost:4001/';

let API_AUTH_CRYPTO_TAG = '@amnis/auth';

let API_TWITTER_OAUTH2_URL = 'https://api.twitter.com/2/';
let API_MICROSOFT_OAUTH2_URL = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/';

try {
  if (process?.env) {
    API_AUTH_URL = process.env.AMNIS_API_AUTH_URL || API_AUTH_URL;
    API_CRUD_URL = process.env.AMNIS_API_CRUD_URL || API_CRUD_URL;
    API_AUTH_CRYPTO_TAG = process.env.AMNIS_API_AUTH_CRYPTO_TAG || API_AUTH_CRYPTO_TAG;
    API_TWITTER_OAUTH2_URL = process.env.AMNIS_API_TWITTER_OAUTH2_URL || API_TWITTER_OAUTH2_URL;
    API_MICROSOFT_OAUTH2_URL = (
      process.env.AMNIS_API_MICROSOFT_OAUTH2_URL || API_MICROSOFT_OAUTH2_URL
    );
  }
} catch (error) {
  /**
   * A catch means we're running in an environment other than node.
   */
}

export const apiConfig = {
  API_AUTH_URL,
  API_CRUD_URL,
  API_AUTH_CRYPTO_TAG,
  API_TWITTER_OAUTH2_URL,
  API_MICROSOFT_OAUTH2_URL,
};

export type ApiConfig = typeof apiConfig;

export function apiConfigure(config: Partial<ApiConfig>) {
  Object.keys(config).forEach((key) => {
    const confKey = key as keyof ApiConfig;
    if (apiConfig[confKey] !== undefined) {
      apiConfig[confKey] = config[confKey] as string;
    }
  });
}
