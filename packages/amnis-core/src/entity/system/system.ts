import { uid } from '../../uid.js';
import type { LogCreator } from '../log/index.js';
import { roleKey } from '../role/index.js';
import type { System, SystemBase, SystemCreator } from './system.types.js';

export const systemKey = 'system';

export const systemBase = (): SystemBase => ({
  name: '',
  handle: 'core',
  sessionKey: 'coreSession',
  sessionExpires: 60,
  bearerExpires: 30,
  registrationOpen: true,
  challengeExpiration: 5,
  otpExpiration: 5,
  otpLength: 12,
  emailNews: 'news@system.test',
  emailNotify: 'notify@system.test',
  emailAuth: 'auth@system.test',
  fileSizeMax: 4096,
  $adminRole: uid(roleKey),
  $execRole: uid(roleKey),
  $anonymousRole: uid(roleKey),
  $initialRoles: [],
});

/**
 * System check method.
 */
export function systemCheck(system: System): LogCreator[] {
  const logs: LogCreator[] = [];

  if (system.name.length < 1) {
    logs.push({
      title: 'System Name Required',
      description: 'The system must have a name.',
      level: 'error',
    });
  }

  return logs;
}

export function systemCreator(
  system: SystemCreator,
): System {
  const base = systemBase();
  const handle = system.handle ?? base.handle;
  const sessionKey = system.sessionKey ?? `${handle}Session`;

  return {
    ...base,
    ...system,
    $id: uid(systemKey),
    handle,
    sessionKey,
  };
}
