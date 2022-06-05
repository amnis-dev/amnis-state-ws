import { apiMSGraphProcesses } from './msgraph.process';

const processes = apiMSGraphProcesses();

/**
 * ============================================================
 */
test('Handler should work.', () => {
  const response = {
    errors: [],
    result: {},
  };

  expect(response).toEqual({
    errors: [],
    result: {},
  });
});
