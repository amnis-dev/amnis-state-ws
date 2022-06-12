import { EntityState } from '@reduxjs/toolkit';
import { tokenParse } from './core';
import {
  State, Session, Token, TokenApi, TokenType, Meta, Entity,
} from './types';

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
  if (!state?.session) {
    return undefined;
  }

  const sessionSlice = state.session as Meta<Session> & EntityState<Session>;

  const session = sessionSlice.entities[sessionSlice.active || ''];

  if (!session) {
    return undefined;
  }

  const tokenStrings = session.tokens;

  const tokenString = tokenStrings.find((current) => current.startsWith(`${api}:${type}`));

  if (!tokenString) {
    return undefined;
  }

  const token = tokenParse(tokenString);

  return token;
}

export const selectors = { selectActive, selectToken };

export default selectors;
