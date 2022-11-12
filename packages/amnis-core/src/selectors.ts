/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { EntityState } from '@reduxjs/toolkit';
import { rtk } from './rtk.js';
import {
  Token, TokenApi, tokenKey, TokenType,
} from './token/index.js';
import type {
  Entity, EntityExtension, EntityUpdate, Meta,
} from './entity/index.js';
import type { State } from './state/index.js';
import type { UID } from './types.js';
import type { Role } from './role/index.js';
import { Crypto, cryptoKey } from './crypto/index.js';
import { grantParse, Grant } from './grant/index.js';

/**
 * Creates a slice selector.
 */
const createSelectSlice = <E extends Entity>(
  sliceKey: string,
) => (state: State) => {
  const slice = state[sliceKey] as Meta<E> & EntityState<E>;

  if (!slice?.entities) {
    return undefined;
  }

  return slice;
};

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
export function selectActive<E extends Entity = Entity>(
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
export function selectFocused<E extends Entity = Entity>(
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
export function selectSelection<E extends Entity = Entity>(
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
 * Selects an object to differentiate local updates.
 */
export function selectDifference<E extends Entity>(
  state: State,
  sliceKey: string,
  id: UID<E>,
): {
    original: E | undefined,
    current: E | undefined,
    changes: EntityExtension<E>,
    update: EntityUpdate<E>,
    keys: (keyof E)[]
  } {
  const slice = getSlice(state, sliceKey);

  if (!slice) {
    return {
      original: undefined,
      current: undefined,
      changes: {} as EntityExtension<E>,
      update: { $id: id } as EntityUpdate<E>,
      keys: [],
    };
  }

  const current = { ...slice.entities[id] } as E;

  if (!current) {
    return {
      original: undefined,
      current: undefined,
      changes: {} as EntityExtension<E>,
      update: { $id: id } as EntityUpdate<E>,
      keys: [],
    };
  }

  if (!slice.original[id]) {
    return {
      original: current,
      current,
      changes: {} as EntityExtension<E>,
      update: { $id: id } as EntityUpdate<E>,
      keys: [],
    };
  }

  if (!slice.differences[id]) {
    return {
      original: undefined,
      current: undefined,
      changes: {} as EntityExtension<E>,
      update: { $id: id } as EntityUpdate<E>,
      keys: [],
    };
  }

  const original = { ...slice.original[id] } as E;
  const keys = [...slice.differences[id] as (keyof E)[]];
  const changes = keys.reduce<EntityExtension<E>>((acc, k) => {
    /** @ts-ignore */
    acc[k] = current[k];
    return acc;
  }, {} as EntityExtension<E>);
  const update = { $id: id, ...changes };

  return {
    original,
    current,
    changes,
    update,
    keys,
  };
}

/**
 * Selects a type of token of a session.
 */
export function selectToken(state: State, api: TokenApi, type: TokenType): Token | undefined {
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
export function selectPublicKey(state: State, tag: string): string | undefined {
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
export function selectRoleGrants(state: State, roleRefs: UID<Role>[]): Grant[] {
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
export function coreSelectors<E extends Entity>(sliceKey: string) {
  return {
    selectActive: (state: State) => selectActive<E>(state, sliceKey),
    selectFocused: (state: State) => selectFocused<E>(state, sliceKey),
    selectSelection: (state: State) => selectSelection<E>(state, sliceKey),
    selectDifference: (state: State, id: UID<E>) => selectDifference<E>(state, sliceKey, id),
  };
}
