import { EntityCreator } from '../entity.types.js';
import { uid } from '../../uid.js';
import type { Audit, AuditBase, AuditBaseCreate } from './audit.types.js';

export const auditKey = 'audit';

export const auditBase: AuditBase = {
  action: 'Unspecified',
  completed: false,
};

export function auditCreator(
  audit: AuditBaseCreate,
): EntityCreator<Audit> {
  return {
    ...auditBase,
    ...audit,
    $id: uid(auditKey),
  };
}
