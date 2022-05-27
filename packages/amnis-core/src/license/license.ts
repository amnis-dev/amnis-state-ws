import { LicenseGrant, LicenseGrantString } from './license.types';

/**
 * Converts a license grant to string format.
 */
export function licenseGrantToString(grant: LicenseGrant): LicenseGrantString {
  if (grant.type === '@action') {
    return `@action:${grant.path}:${grant.scope}:${grant.task}`;
  }
  return `@select:${grant.path}:${grant.scope}:${grant.task}`;
}

export default { licenseGrantToString };
