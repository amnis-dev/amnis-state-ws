import { uid, uidTree } from '../../uid.js';
import type { Website, WebsiteBase, WebsiteCreator } from './website.types.js';

export const websiteKey = 'website';

export const websiteBase = (): WebsiteBase => ({
  name: 'Unnamed Website',
  url: 'http://localhost',
  $navigation: uidTree(),
  $contacts: [],
  socials: [],
});

export function websiteCreator(
  website: WebsiteCreator,
): Website {
  return {
    ...websiteBase(),
    ...website,
    $id: uid(websiteKey),
  };
}
