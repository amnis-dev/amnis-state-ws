import { Entity, entityCreate } from '../entity/index.js';
import type { Audit, AuditBase, AuditBaseCreate } from './audit.types.js';

export const auditKey = 'audit';

export const auditBase: AuditBase = {
  action: 'Unspecified',
  completed: false,
};

export function auditCreate(
  audit: AuditBaseCreate,
  entity: Partial<Entity> = {},
): Audit {
  const auditEntity = entityCreate<Audit>(auditKey, {
    ...auditBase,
    ...audit,
  }, entity);

  return auditEntity;
}
