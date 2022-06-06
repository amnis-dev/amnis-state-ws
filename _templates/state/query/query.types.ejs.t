---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import { Result } from '@amnis/core/types';
import type {
  ApiProcess,
  ApiProcesses,
  ApiQuery,
} from '../types';
import { Api<%= Name %>MyEndpoint } from './<%= name %>.endpoint.types';

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
