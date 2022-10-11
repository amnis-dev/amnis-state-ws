import { uidTree } from '../uid';
import { entityCreate } from '../entity';
import type { Website, WebsiteBase, WebsiteBaseCreate } from './website.types';

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
