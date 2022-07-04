import { contactCreate } from '@amnis/core/contact';

export const [contactDefault] = contactCreate({
  myProperty: 'Unnamed',
});

export default contactDefault;
