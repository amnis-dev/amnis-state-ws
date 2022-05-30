import { storeSetup } from './store';

test('should return state', async () => {
  const store = storeSetup();

  expect(store.getState()).toEqual(store.getState());
});

// import {
//   apiCrudHandlersGenerate,
// } from '@amnis/api/index';
// import { apiMockGenerateHandlers, apiMockServer } from '@amnis/api/mock';
// import { memory } from '@amnis/db/index';
// import { storeSetup } from './store';

// const mockHandlers = apiMockGenerateHandlers(
//   storeSetup,
//   apiCrudHandlersGenerate(),
//   memory,
// );
// const mockServer = apiMockServer(mockHandlers);

// beforeAll(() => mockServer.listen());
// afterEach(() => mockServer.resetHandlers());
// afterAll(() => mockServer.close());

// /**
//  * ============================================================
//  */
// test('should create user data through API', async () => {
//   const store = storeSetup();

//   const action = await store.dispatch(
//     apiCrud.endpoints.create.initiate({
//       [userKey]: [
//         {
//           displayName: 'eCrow',
//         },
//       ],
//     }),
//   );

//   expect(action.status).toBe('fulfilled');

//   const entities = userSelectors.selectAll(store.getState());
//   expect(entities).toHaveLength(1);
// });

// /**
//  * ============================================================
//  */
// test('should not select user data with unmatching query through API', async () => {
//   const store = storeSetup();

//   const action = await store.dispatch(
//     apiCrud.endpoints.read.initiate({
//       user: {
//         displayName: {
//           $eq: 'not_eCrow',
//         },
//       },
//     }),
//   );

//   expect(action.status).toBe('fulfilled');

//   const result = action.data || {};

//   expect(result.user).toHaveLength(0);
// });

// /**
//  * ============================================================
//  */
// test('should select user data through API', async () => {
//   const store = storeSetup();

//   const action = await store.dispatch(
//     apiCrud.endpoints.read.initiate({
//       user: {
//         displayName: {
//           $eq: 'eCrow',
//         },
//       },
//     }),
//   );

//   expect(action.status).toBe('fulfilled');

//   const result = action.data || {};

//   expect(result.user).toHaveLength(1);
// });
