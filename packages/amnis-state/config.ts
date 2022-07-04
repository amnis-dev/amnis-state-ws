import { apiConfigure, ApiConfig } from '@amnis/api/config';

export type StateConfig = ApiConfig;

export function stateConfigure(config: StateConfig) {
  apiConfigure(config);
}
