import { apiMSGraphHandlersSetup } from './msgraph.handlers';

const handlers = apiMSGraphHandlersSetup();

/**
 * ============================================================
 */
test('Handler should work.', () => {
  const response = handlers.myendpoint({ body: { data: null } });

  expect(response).toEqual({
    errors: [],
    result: {},
  });
});
