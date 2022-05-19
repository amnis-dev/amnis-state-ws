import type { Entity, EntityReference } from '@amnis/core/entity.types';

export type QueryNestInclude<E extends Entity> = {
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
 * READ Response
 * Server -> Client
 */
export interface ApiCreateResponse<E extends Entity> {
  entities?: E[];
}

/**
 * READ Request
 * Client -> Server
 */
export interface ApiCreateRequest<E extends Entity> {
  nest?: QueryNest<E>;
  filter?: QueryFilter<E>;
  start?: number;
  limit?: number;
}

/**
 * READ Response
 * Server -> Client
 */
export interface ApiReadResponse<E extends Entity> {
  entities?: E[];
}

/**
 * READ Request
 * Client -> Server
 */
export interface ApiReadRequest<E extends Entity> {
  nest?: QueryNest<E>;
  filter?: QueryFilter<E>;
  start?: number;
  limit?: number;
}
