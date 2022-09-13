import { Entity, entityCreate } from '../entity';
import type { Audit, AuditBase, AuditBaseCreate } from './audit.types';

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

  /**
   * Rare exception to modify a read-only property.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-ignore */
  auditEntity.partition = auditEntity.created;

  return auditEntity;
}
