import { uid } from '../../uid.js';
import { handleKey, handleCreator } from './handle.js';

/**
 * ============================================================
 */
test('handle key should be is properly set', () => {
  expect(handleKey).toEqual('handle');
});

/**
 * ============================================================
 */
test('should create a handle', () => {
  const handle = handleCreator({
    name: 'Newbie',
    $subject: uid('entity'),
  });

  expect(handle).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      $subject: expect.any(String),
    }),
  );
});
