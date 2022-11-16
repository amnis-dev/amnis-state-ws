import { contactKey, contactCreator } from './contact.js';

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
  const contact = contactCreator({
    name: 'Amnis Contact',
  });

  expect(contact).toEqual(
    expect.objectContaining({
      name: 'Amnis Contact',
      socials: expect.any(Array),
    }),
  );
});
