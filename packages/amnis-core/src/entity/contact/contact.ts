import type { LogCreator } from '../log/index.js';
import { regexWebUrl } from '../../regex.js';
import { uid } from '../../uid.js';
import type { Contact, ContactBase, ContactCreator } from './contact.types.js';

export const contactKey = 'contact';

export const contactBase = (): ContactBase => ({
  name: 'Unknown Contact',
  phones: [],
  emails: [],
  socials: [],
});

/**
 * Contact check method.
 */
export function contactCheck(contact: Contact): LogCreator[] {
  const logs: LogCreator[] = [];

  const invalidSocials = contact.socials.filter((social) => !regexWebUrl.test(social));

  invalidSocials.forEach((social) => {
    logs.push({
      title: 'Invalid Social URL',
      description: `The social url ${social} is not a valid url.`,
      level: 'error',
    });
  });

  return logs;
}

export function contactCreator(
  contact: ContactCreator,
): Contact {
  return {
    ...contactBase(),
    ...contact,
    $id: uid(contactKey),
  };
}
