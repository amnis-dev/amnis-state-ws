import {
  EntityState,
  SliceCaseReducers,
  CreateSliceOptions,
  ValidateSliceCaseReducers,
  createEntityAdapter,
  createSlice,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';
import { Entity, EntityMeta } from './entity.types';

export type EntitySliceCreateOptions<
  State,
  ReducerState,
  Name extends string = string
> = {
  reducers?: ValidateSliceCaseReducers<ReducerState, SliceCaseReducers<ReducerState>>;
  extraReducers?: ((builder: ActionReducerMapBuilder<NoInfer<ReducerState>>) => void)
} & Omit<CreateSliceOptions<State, SliceCaseReducers<State>, Name>, 'reducers' | 'extraReducers'>

export function entitySliceCreate<
  State extends Entity,
  Name extends string = string
>(
  options: EntitySliceCreateOptions<State, (EntityState<State> & EntityMeta<State>), Name>,
) {
  /**
   * RTK user adapter.
   */
  const adapter = createEntityAdapter<State>({
    selectId: (entity) => entity.id,
  });

  const initialState = adapter.getInitialState({
    active: null,
    focused: null,
    selection: [],
  } as EntityMeta<State>);

  /**
   * Initial user map state.
   */
  return createSlice({
    ...options,
    name: `@amnis/entity:${options.name}`,
    initialState,
    reducers: {
      ...options.reducers,
    },
    extraReducers: (builder) => {
      if (options.extraReducers) {
        options.extraReducers(builder);
      }
    },
  });
}

// const test = entitySliceCreate({
//   name: 'user',
//   initialState: entityCreate({}),
//   reducers: {},
// });

export default entitySliceCreate;
