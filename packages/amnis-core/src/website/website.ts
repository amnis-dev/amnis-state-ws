import { uidTree } from '../uid.js';
import { entityCreate } from '../entity/index.js';
import type { Website, WebsiteBase, WebsiteBaseCreate } from './website.types.js';

export const websiteKey = 'website';

export const websiteBase: WebsiteBase = {
  name: 'Unnamed Website',
  url: 'http://localhost',
  $navigation: uidTree(),
  $contacts: [],
  socials: [],
};

export function websiteCreate(
  website: WebsiteBaseCreate,
): Website {
  const websiteEntity = entityCreate<Website>(websiteKey, {
    ...websiteBase,
    ...website,
  });

  return websiteEntity;
}
