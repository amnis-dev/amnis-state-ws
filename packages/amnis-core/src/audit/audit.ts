import { dateJSON } from '../core';
import { Entity, entityCreate } from '../entity';
import type { Audit, AuditBase, AuditBaseCreate } from './audit.types';

export const auditKey = 'audit';

export const auditBase: AuditBase = {
  action: 'Unspecified',
  dateInvoked: dateJSON(),
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
