import { EntityState } from '@reduxjs/toolkit';
import {
  State, Token, TokenIssuer, TokenType,
} from './types';

/**
 * Selects a type of token.
 */
export function selectToken(state: State, issuer: TokenIssuer, type: TokenType): Token | undefined {
  if (!state?.token) {
    return undefined;
  }

  const tokenSlice = state.token as EntityState<Token>;

  const tokenId = tokenSlice.ids.find((id) => {
    const entity = tokenSlice.entities[id];
    if (entity?.issuer === issuer && entity?.type === type) {
      return true;
    }
    return false;
  });

  if (!tokenId) {
    return undefined;
  }

  return tokenSlice.entities[tokenId];
}

export default { selectToken };
