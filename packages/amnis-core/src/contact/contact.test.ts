import { contactKey, contactCreate } from './contact';

/**
 * ============================================================
 */
test('contact key should be is properly set', () => {
  expect(contactKey).toEqual('contact');
});

/**
 * ============================================================
 */
test('should create a contact', () => {
  const [contact, logs] = contactCreate({
    name: 'Amnis Contact',
  });

  expect(contact).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      socials: expect.any(Array),
    }),
  );

  expect(logs).toHaveLength(0);
});
