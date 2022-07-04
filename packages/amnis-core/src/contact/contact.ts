import { entityCreate } from '../entity';
import type { LogBaseCreate } from '../log';
import { regexWebUrl } from '../regex';
import type { Contact, ContactBase, ContactBaseCreate } from './contact.types';

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
  checkSkip = false,
): [Contact, LogBaseCreate[]] {
  const contactEntity = entityCreate<Contact>(contactKey, {
    ...contactBase,
    ...contact,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...contactCheck(contactEntity));
  }

  return [contactEntity, logs];
}
