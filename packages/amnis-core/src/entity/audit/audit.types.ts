/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityCreator, EntityCreatorBase, EntityCreatorParams } from '../entity.types.js';
import type { UID } from '../../types.js';

/**
 * A data structure for audit information.
 */
export interface Audit extends EntityCreator {
  /**
   * Action attempted
   */
  action: string;

  /**
   * If the action was completed.
   */
  completed: boolean;

  /**
   * Input body data.
   */
  inputBody?: any;

  /**
   * Subject id of the audit.
   */
  $subject?: UID;

  /**
   * IP address of the subject.
   */
  ip?: string;

  /**
   * Location of the subject.
   */
  location?: string;
}

/**
 * Contact properties excluding the extended entity properties.
 */
export type AuditBase = EntityCreatorBase<Audit>;

/**
 * Base properties in order to create a log.
 */
export type AuditCreator = EntityCreatorParams<Audit, 'action' | 'completed'>;
