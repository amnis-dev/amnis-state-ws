/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateCreate, StateQuery } from './state.types.js';

function stateQueryReferenceMutate(
  stateQuery: StateQuery,
  reference: string | string[],
) {
  let sliceKey = '';
  const ids = new Set();

  if (typeof reference === 'string') {
    const [key] = reference.split(':');
    sliceKey = key;
    ids.add(reference);
  } else if (reference.length > 0) {
    const [key] = reference[0].split(':');
    sliceKey = key;
    reference.forEach((ref) => ids.add(ref));
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
export function stateReferenceQuery(stateCreate: StateCreate): StateQuery {
  const stateQuery: StateQuery = {};

  const entityRefs: string[] = [];
  const references: string[] = [];

  /**
   * Loop through each of the slice keys.
   */
  Object.values(stateCreate).forEach((slice) => {
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

export default { stateReferenceQuery };
