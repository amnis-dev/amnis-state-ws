import { EntityState } from '@reduxjs/toolkit';
import {
  Token, TokenApi, tokenKey, TokenType,
} from './token';
import type { Entity, Meta } from './entity';
import type { State } from './state';
import type { UID } from './types';
import type { Role } from './role';
import { Crypto, cryptoKey } from './crypto';
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
 * Selects the focused entity on a slice (if one is active).
 */
function selectActive<E extends Entity = Entity>(
  state: State,
  sliceKey: string,
): E | undefined {
  const slice = getSlice(state, sliceKey);

  if (!slice) {
    return undefined;
  }

  if (!slice.active) {
    return undefined;
  }

  if (!slice.entities) {
    return undefined;
  }

  const entity = slice.entities[slice.active] as E;

  if (!entity) {
    return undefined;
  }

  return entity;
}

/**
 * Selects the focused entity on a slice (if one is focused).
 */
function selectFocused<E extends Entity = Entity>(
  state: State,
  sliceKey: string,
): E | undefined {
  const slice = getSlice(state, sliceKey);

  if (!slice) {
    return undefined;
  }

  if (!slice.focused) {
    return undefined;
  }

  if (!slice.entities) {
    return undefined;
  }

  const entity = slice.entities[slice.focused] as E;

  if (!entity) {
    return undefined;
  }

  return entity;
}

/**
 * Selects the selected entity on a slice.
 */
function selectSelection<E extends Entity = Entity>(
  state: State,
  sliceKey: string,
): E[] {
  const slice = getSlice(state, sliceKey);

  if (!slice) {
    return [];
  }

  if (!slice.selection) {
    return [];
  }

  if (!slice.entities) {
    return [];
  }

  const entities = slice.selection.map((selected) => slice.entities[selected]) as E[];

  return entities;
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
 * Selects a public key from the crypto slice.
 */
function selectPublicKey(state: State, tag: string): string | undefined {
  const slice = getSlice<Crypto>(state, cryptoKey);

  if (!slice) {
    return undefined;
  }

  const cryptoPub = Object.values(slice.entities).find(
    (entity) => (entity?.tag === tag && entity.pair === 'public'),
  );

  return cryptoPub?.value;
}

/**
 * Selects a list of Grants based on an array of role references.
 */
function selectRoleGrants(state: State, roleRefs: UID<Role>[]): Grant[] {
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
  selectFocused,
  selectSelection,
  selectToken,
  selectPublicKey,
  selectRoleGrants,
};

export default { selectors };
