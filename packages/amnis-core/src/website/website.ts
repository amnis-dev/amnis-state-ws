import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { LogBaseCreate } from '../log';
import type { Website } from './website.types';

export const websiteKey = 'website';

export const websiteBase: EntityExtension<Website> = {
  name: 'Unnamed Website',
  domain: 'http://localhost:3000',
  contacts: [],
  socials: [],
};

/**
 * Website check method.
 */
export function websiteCheck(website: Website): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function websiteCreate(
  website: EntityExtensionCreate<Website, 'name' | 'domain'>,
  checkSkip = false,
): [Website, LogBaseCreate[]] {
  const websiteEntity = entityCreate<Website>(websiteKey, {
    ...websiteBase,
    ...website,
  });

  const logs: LogBaseCreate[] = [];
  if (!checkSkip) {
    logs.push(...websiteCheck(websiteEntity));
  }

  return [websiteEntity, logs];
}
