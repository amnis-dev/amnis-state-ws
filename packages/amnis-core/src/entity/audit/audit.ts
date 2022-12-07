import { uid } from '../../uid.js';
import type { Audit, AuditBase, AuditCreator } from './audit.types.js';

export const auditKey = 'audit';

export const auditBase = (): AuditBase => ({
  action: 'Unspecified',
  completed: false,
});

export function auditCreator(
  audit: AuditCreator,
): Audit {
  return {
    ...auditBase(),
    ...audit,
    $id: uid(auditKey),
  };
}
