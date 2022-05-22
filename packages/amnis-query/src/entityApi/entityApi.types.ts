import type { ApiPayload, ApiRequestBody, ApiResponseBody } from '@amnis/core/api';
import type { Entity, EntityFilter } from '@amnis/core/entity';

/**
 * Create Request
 * Client -> Server
 */
export interface EntityApiRequestBodyCreate extends ApiRequestBody {
  depth?: number;
  filter?: EntityFilter<Entity>;
  start?: number;
  limit?: number;
}

/**
 * Create Response
 * Server -> Client
 */
export interface EntityApiResponseBodyCreate extends ApiResponseBody {
  entity?: Record<string, Entity[]>;
}

/**
 * READ Request
 * Client -> Server
 */
export interface EntityApiRequestBodyRead extends ApiRequestBody {
  depth?: number;
  filter?: EntityFilter;
  start?: number;
  limit?: number;
}

/**
 * READ Response
 * Server -> Client
 */
export interface EntityApiResponseBodyRead extends ApiResponseBody {
  entityMap?: Record<string, Entity[]>;
}

/**
 * ================================================================================
 * Redux Payloads
 * ------------------------------------------------------------
 */

/**
 * Redux Payload for a create request.
 */
export type EntityApiPayloadCreate = ApiPayload<EntityApiRequestBodyCreate>;

/**
 * Redux Payload for a read request.
 */
export type EntityApiPayloadRead = ApiPayload<EntityApiRequestBodyRead>;
