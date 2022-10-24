---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import { Result } from '@amnis/core/index.js';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types.js';

/**
 * My Endpoint requestType
 */
export interface Api<%= Name %>MyEndpoint {
  data: unknown;
}

/**
 * API object containing request queries.
 */
export interface Api<%= Name %>Queries {
  myendpoint: ApiQuery;
}

/**
 * API object containing response handlers.
 */
export interface Api<%= Name %>Processes extends ApiProcesses {
  myendpoint: ApiProcess<Api<%= Name %>MyEndpoint, Result>;
}
