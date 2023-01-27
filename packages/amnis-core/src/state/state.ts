/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from '@reduxjs/toolkit';
import { Entity, entityCreate, EntityCreator } from '../entity/index.js';
import type { Grant, GrantTask } from './grant/index.js';
import type {
  State, StateCreator, StateEntities, StateQuery, StateScope,
} from './state.types.js';

function stateQueryReferenceMutate(
  stateQuery: StateQuery,
  identifier: string | string[],
) {
  let sliceKey = '';
  const ids = new Set();

  if (typeof identifier === 'string') {
    const [key] = identifier.split(':');
    sliceKey = key;
    ids.add(identifier);
  } else if (identifier.length > 0) {
    const [key] = identifier[0].split(':');
    sliceKey = key;
    identifier.forEach((ref) => ids.add(ref));
  } else {
    return;
  }

  if (!stateQuery[sliceKey]) {
    stateQuery[sliceKey] = {
      $query: {
        $id: {
          $in: [...ids],
        },
      },
    };
  } else {
    stateQuery[sliceKey]?.$query?.$id?.$in?.forEach((ref) => ids.add(ref));
    stateQuery[sliceKey] = {
      $query: {
        $id: {
          $in: [...ids],
        },
      },
    };
  }
}

/**
 * Creates a new state query based on the references in a state.
 * The new query will NOT include any references that already exist.
 */
export function stateReferenceQuery(stateCreator: StateCreator): StateQuery {
  const stateQuery: StateQuery = {};

  const entityRefs: string[] = [];
  const references: string[] = [];

  /**
   * Loop through each of the slice keys.
   */
  Object.values(stateCreator).forEach((slice) => {
    /**
     * Check each entity on the slices.
     */
    slice.forEach((entity) => {
      /**
       * Finally, check each property on the entity that is a references.
       * Remember, only references have the '$' prefix.
       */
      Object.keys(entity).forEach((propKey) => {
        // Add to the list of entity ids on this state array.
        // We don't need to query them again.
        entityRefs.push(entity.$id);
        if (propKey.charAt(0) !== '$') {
          return;
        }

        const ref = (entity as any)[propKey] as string;
        if (ref !== entity.$id) {
          references.push(ref);
        }
      });
    });
  });

  const referencesFinal = references.filter((ref) => !entityRefs.includes(ref));

  referencesFinal.forEach((ref) => {
    stateQueryReferenceMutate(stateQuery, ref);
  });

  return stateQuery;
}

/**
 * Converts a redux state tree to a state create object type.
 */
export function stateToCreate(state: State): StateCreator {
  const stateCreator: StateCreator = {};

  Object.keys(state).every((sliceKey) => {
    const slice = state[sliceKey] as EntityState<EntityCreator>;

    if (!slice.entities) {
      return true;
    }

    stateCreator[sliceKey] = Object.values(slice.entities) as EntityCreator[];

    return true;
  });

  return stateCreator;
}

/**
 * Creates a auth scope object from an array of grants.
 *
 * @deprecated
 */
export function stateScopeCreate(grants: Grant[], attempt: GrantTask): StateScope {
  const authScope: StateScope = {};
  grants.forEach(([key, scope, task]) => {
    // eslint-disable-next-line no-bitwise
    if ((task & attempt) === attempt) {
      authScope[key] = scope;
    }
  });
  return authScope;
}

/**
 * Creates a state of new complete entities from a creator state.
 */
export function stateEntitiesCreate(
  stateCreator: StateCreator,
  entityProps: Partial<Entity<EntityCreator>> = {},
): StateEntities {
  return Object.keys(stateCreator).reduce<StateEntities>((acc, sliceKey) => {
    acc[sliceKey] = stateCreator[sliceKey].map(
      (entityCreator) => entityCreate(entityCreator, entityProps),
    );
    return acc;
  }, {});
}

/**
 * Merges two state entities.
 */
export function stateEntitiesMerge(state1: StateEntities, state2: StateEntities): StateEntities {
  const result = { ...state1 };
  Object.keys(state2).forEach((sliceKey) => {
    if (Array.isArray(result[sliceKey])) {
      result[sliceKey].push(...state2[sliceKey]);
    } else {
      result[sliceKey] = [...state2[sliceKey]];
    }
  });
  return result;
}
