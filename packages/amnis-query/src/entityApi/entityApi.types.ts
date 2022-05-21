import type { ApiRequest, ApiResponse } from '@amnis/core/api';
import type { Entity, EntityReference } from '@amnis/core/entity';

type QueryNestInclude<E extends Entity> = {
  [Key in keyof E]?:
  E[Key] extends EntityReference<infer R> ? QueryNestInclude<R> : undefined
};

export type QueryNest<E extends Entity> = Pick<
QueryNestInclude<E>,
{
  [K in keyof QueryNestInclude<E>]:
  QueryNestInclude<E>[K] extends undefined ? never : K}[keyof QueryNestInclude<E>
]
>;

export type QueryFilter<E extends Entity> = {
  [Key in keyof E]?: {
    defined?: boolean;
    lessThan?: number;
    greaterThan?: number;
    equals?: string | number | boolean | null;
    includes?: string | number;
  }
};

/**
 * ================================================================================
 * Requests/Responses
 * ------------------------------------------------------------
 */

/**
 * Create Response
 * Server -> Client
 */
export interface EntityApiCreateResponse extends ApiResponse {
  entity?: Record<string, Entity[]>;
}

/**
 * Create Request
 * Client -> Server
 */
export interface EntityApiCreateRequest extends ApiRequest {
  nest?: QueryNest<Entity>;
  filter?: QueryFilter<Entity>;
  start?: number;
  limit?: number;
}

/**
 * READ Response
 * Server -> Client
 */
export interface EntityApiReadResponse extends ApiResponse {
  entityMap?: Record<string, Entity[]>;
}

/**
 * READ Request
 * Client -> Server
 */
export interface EntityApiReadRequest extends ApiRequest {
  nest?: QueryNest<Entity>;
  filter?: QueryFilter<Entity>;
  start?: number;
  limit?: number;
}

/**
 * ================================================================================
 * Redux Payloads
 * ------------------------------------------------------------
 */

// export interface EntityApiReadPayload {

// }

/**
 * ================================================================================
 * Queries/Handlers
 * ------------------------------------------------------------
 */

/**
 * Entity API Queries
 */
export interface EntityApiQueries {
  create: (body: EntityApiCreateRequest) => EntityApiCreateResponse;
  read: (body: EntityApiReadRequest) => EntityApiReadResponse;
}

/**
 * Entity API Handlers
 */
export interface EntityApiHandlers {
  create: (body: EntityApiCreateRequest) => EntityApiCreateResponse;
  read: (body: EntityApiReadRequest) => EntityApiCreateResponse;
}
