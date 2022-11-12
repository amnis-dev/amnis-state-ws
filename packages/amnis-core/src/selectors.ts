/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Dictionary, EntityState } from '@reduxjs/toolkit';
import { rtk } from './rtk.js';
import {
  Token, TokenApi, tokenKey, TokenType,
} from './token/index.js';
import type {
  Entity, EntityExtension, EntityUpdate, Meta,
} from './entity/index.js';
import type { State } from './state/index.js';
import type { UID } from './types.js';
import { Role, roleKey } from './role/index.js';
import { Crypto, cryptoKey } from './crypto/index.js';
import { grantParse, Grant } from './grant/index.js';

/**
 * Creates a slice selector.
 */
const genSelectSlice = <E extends Entity>(sliceKey: string) => (state: State) => {
  const slice = state[sliceKey] as Meta<E> & EntityState<E>;

  if (!slice?.entities) {
    return undefined;
  }

  return slice;
};

/**
 * Creates an entity dictionary selector.
 */
const genSelectEntities = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.entities ?? ({} as Dictionary<E>)
);

/**
 * Creates an original entity dictionary selector.
 */
const genSelectOriginals = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.original ?? ({} as Record<UID<E>, E>)
);

/**
 * Creates an original entity dictionary selector.
 */
const genSelectDifferences = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.differences ?? ({} as Record<UID<E>, (keyof E)[]>)
);

/**
 * Creates an active id selector.
 */
const genSelectActiveId = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.active ?? null
);

/**
 * Creates a focused id selector.
 */
const genSelectFocusedId = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.focused ?? null
);

/**
 * Creates a selected ids selector.
 */
const genSelectSelectionIds = <E extends Entity>(sliceKey: string) => (state: State) => (
  genSelectSlice<E>(sliceKey)(state)?.selection ?? []
);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectActive = <E extends Entity = Entity>(sliceKey: string) => rtk.createSelector(
  genSelectActiveId<E>(sliceKey),
  genSelectEntities<E>(sliceKey),
  (activeId, entities): E | undefined => {
    if (!activeId) {
      return undefined;
    }

    const entity = entities?.[activeId] as E;

    if (!entity) {
      return undefined;
    }

    return entity;
  },
);

export const selectActive = <E extends Entity>(
  state: State, sliceKey: string,
) => genSelectActive<E>(sliceKey)(state);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectFocused = <E extends Entity = Entity>(sliceKey: string) => rtk.createSelector(
  genSelectFocusedId<E>(sliceKey),
  genSelectEntities<E>(sliceKey),
  (focusedId, entities): E | undefined => {
    if (!focusedId) {
      return undefined;
    }

    const entity = entities?.[focusedId] as E;

    if (!entity) {
      return undefined;
    }

    return entity;
  },
);

export const selectFocused = <E extends Entity>(
  state: State, sliceKey: string,
) => genSelectFocused<E>(sliceKey)(state);

/**
 * Selects the focused entity on a slice (if one is active).
 */
const genSelectSelection = <E extends Entity = Entity>(
  sliceKey: string,
) => rtk.createSelector(
  genSelectSelectionIds<E>(sliceKey),
  genSelectEntities<E>(sliceKey),
  (selectionIds, entities) => {
    const selections = selectionIds.map((selected) => entities[selected]) as E[];

    return selections;
  },
);

export const selectSelection = <E extends Entity>(
  state: State, sliceKey: string,
) => genSelectSelection<E>(sliceKey)(state);

/**
 * Selects an object to differentiate local updates.
 */
const genSelectDifference = <E extends Entity = Entity>(
  sliceKey: string,
) => rtk.createSelector(
  [
    (state, id: UID<E>) => id,
    genSelectDifferences<E>(sliceKey),
    genSelectOriginals<E>(sliceKey),
    genSelectEntities<E>(sliceKey),
  ],
  (id, diffRecords, originalRecords, entities) => {
    const current = { ...entities[id] } as E;
    const original = { ...originalRecords[id] } as E;
    const keys = diffRecords[id] ? [...diffRecords[id] as (keyof E)[]] : [] as (keyof E)[];

    if (!current) {
      return {
        original: undefined,
        current: undefined,
        changes: {} as EntityExtension<E>,
        update: { $id: id } as EntityUpdate<E>,
        keys: [],
      };
    }

    if (!original) {
      return {
        original: current,
        current,
        changes: {} as EntityExtension<E>,
        update: { $id: id } as EntityUpdate<E>,
        keys: [],
      };
    }

    if (!keys) {
      return {
        original: undefined,
        current: undefined,
        changes: {} as EntityExtension<E>,
        update: { $id: id } as EntityUpdate<E>,
        keys: [],
      };
    }

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
  },
);

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
  const slice = genSelectSlice<Crypto>(cryptoKey)(state);

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

  const roleSlice = genSelectSlice<Role>(roleKey)(state);

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
    selectActive: genSelectActive<E>(sliceKey),
    selectFocused: genSelectFocused<E>(sliceKey),
    selectSelection: genSelectSelection<E>(sliceKey),
    selectDifference: genSelectDifference<E>(sliceKey),
  };
}
