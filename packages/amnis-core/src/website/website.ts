import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity/index.js';
import type { LogBaseCreate } from '../log/index.js';
import { regexWebUrl } from '../regex.js';
import type { Website } from './website.types.js';

export const websiteKey = 'website';

export const websiteBase: EntityExtension<Website> = {
  name: 'Unnamed Website',
  url: 'http://localhost:3000',
  $contacts: [],
  socials: [],
};

/**
 * Website check method.
 */
export function websiteCheck(website: Website): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  if (website.name.length < 1) {
    logs.push({
      title: 'Website Name Required',
      description: 'The website needs to have a name.',
      level: 'error',
    });
  }

  if (!regexWebUrl.test(website.url)) {
    logs.push({
      title: 'Website URL Invalid',
      description: 'The website must have a valid URL.',
      level: 'error',
    });
  }

  const invalidSocials = website.socials.filter((social) => !regexWebUrl.test(social));

  invalidSocials.forEach((social) => {
    logs.push({
      title: 'Invalid Social URL',
      description: `The social url ${social} is not a valid url.`,
      level: 'error',
    });
  });

  return logs;
}

export function websiteCreate(
  website: EntityExtensionCreate<Website, 'name' | 'url'>,
): Website {
  const websiteEntity = entityCreate<Website>(websiteKey, {
    ...websiteBase,
    ...website,
  });

  return websiteEntity;
}
