import { EntityState } from '@reduxjs/toolkit';
import {
  Token, TokenApi, tokenKey, TokenType,
} from './token';
import type { Entity, Meta } from './entity';
import type { State } from './state';
import type { Reference } from './types';
import type { Role } from './role';
import { grantParse, Grant } from './grant';

/**
 * Helper function to get a slice.
 */
function getSlice<
  E extends Entity = Entity
>(
  state: State,
  key: string,
): Meta<E> & EntityState<E> | undefined {
  const slice = state[key] as Meta<E> & EntityState<E>;

  if (!slice?.entities) {
    return undefined;
  }

  return slice;
}

/**
 * Selects the active entity on a slice (of one is active).
 */
function selectActive<E extends Entity = Entity>(
  state: State,
  sliceKey: string,
): E | undefined {
  const slice = state[sliceKey];

  if (!slice.active) {
    return undefined;
  }

  if (!slice.entities) {
    return undefined;
  }

  const entity = slice.entities[slice.active];

  if (!entity) {
    return undefined;
  }

  return entity;
}

/**
 * Selects a type of token of a session.
 */
function selectToken(state: State, api: TokenApi, type: TokenType): Token | undefined {
  const tokenSlice = state[tokenKey] as EntityState<Token>;

  if (!tokenSlice) {
    return undefined;
  }

  const tokenId = `${api}:${type}`;
  const tokenEntities = tokenSlice.entities;
  const tokenEntity = tokenEntities[tokenId];

  if (!tokenEntity) {
    return undefined;
  }

  return tokenEntity;
}

/**
 * Selects a list of Grants based on an array of role references.
 */
function selectRoleGrants(state: State, roleRefs: Reference<Role>[]): Grant[] {
  const grants: Grant[] = [];

  const roleSlice = getSlice<Role>(state, 'role');

  if (!roleSlice) {
    return grants;
  }

  roleRefs.every((roleRef) => {
    const role = roleSlice.entities[roleRef];
    if (!role) {
      return true;
    }

    grants.push(...role.grants
      .map((grantString) => grantParse(grantString))
      .filter((grant) => grant !== undefined) as Grant[]);

    return true;
  });

  return grants;
}

/**
 * Create the selector utility object.
 */
export const selectors = {
  selectActive,
  selectToken,
  selectRoleGrants,
};

export default selectors;
