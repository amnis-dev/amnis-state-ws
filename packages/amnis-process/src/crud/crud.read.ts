/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GrantTask,
  Io,
  IoInput,
  IoOutput,
  IoProcess,
  StateEntities,
  stateEntitiesMerge,
  StateQuery,
  stateReferenceQuery,
} from '@amnis/core';
import { mwAccess, mwValidate, mwState } from '../mw/index.js';

export const process: IoProcess<
Io<StateQuery, StateEntities>
> = (context) => (
  async (input, output) => {
    const { database } = context;
    const { body: stateQuery, scope, access } = input;

    if (!access) {
      output.status = 401; // Unauthorized
      output.json.logs.push({
        level: 'error',
        title: 'Unauthorized',
        description: 'No access has not been provided.',
      });
      return output;
    }

    if (!scope) {
      output.status = 500; // Internal Server Error
      output.json.logs.push({
        level: 'error',
        title: 'Missing Scope',
        description: 'Cannot complete the process without a data scope.',
      });
      return output;
    }

    /**
     * Loop through each query slice.
     * Each slice has it's own depth, so recursively search when necessary.
     */
    const results = await Promise.all<StateEntities>(Object.keys(stateQuery).map(async (key) => {
      const depth = stateQuery[key].$depth ?? 0;

      /**
       * Query the single slice.
       */
      const stateQuerySingle = {
        [key]: stateQuery[key],
      };
      const result = await database.read(stateQuerySingle, { subject: access.sub, scope });

      /**
       * Return without recurrsion if we've reached the bottom.
       */
      if (depth < 1) {
        return result;
      }

      /**
       * Create a new query based on the references in the results.
       */
      const stateQueryNext = stateReferenceQuery(result);
      Object.values(stateQueryNext).forEach((query) => { query.$depth = depth - 1; });
      const inputNext: IoInput<StateQuery> = {
        ...input,
        body: stateQueryNext,
      };

      /**
       * Call this process again with the state middleware.
       */
      const outputNext = await mwState(GrantTask.Read)(
        process,
      )(context)(inputNext, output) as IoOutput<StateEntities>;

      const resultsMerged = stateEntitiesMerge(result, outputNext.json.result ?? {});

      return resultsMerged;
    }));

    /**
     * Merge all the results.
     */
    output.json.result = results.reduce<StateEntities>(
      (acc, cur) => stateEntitiesMerge(acc, cur),
      {},
    );

    return output;
  }
);

export const processCrudRead = mwAccess()(
  mwValidate('StateQuery')(
    mwState(GrantTask.Read)(
      process,
    ),
  ),
) as IoProcess<
Io<StateQuery, StateEntities>
>;

export default { processCrudRead };
