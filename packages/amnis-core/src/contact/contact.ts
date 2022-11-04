import { Entity, entityCreate } from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import { regexWebUrl } from '../regex.js';
import type { Contact, ContactBase, ContactBaseCreate } from './contact.types.js';

export const contactKey = 'contact';

export const contactBase: ContactBase = {
  name: 'Unknown Contact',
  phones: [],
  emails: [],
  socials: [],
};

/**
 * Contact check method.
 */
export function contactCheck(contact: Contact): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

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

export function contactCreate(
  contact: ContactBaseCreate,
  entity: Partial<Entity> = {},
): Contact {
  const contactEntity = entityCreate<Contact>(contactKey, {
    ...contactBase,
    ...contact,
  }, entity);

  return contactEntity;
}
