/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Entity, EntityExtension, EntityExtensionCreate } from '../entity';
import type { Reference } from '../types';

/**
 * A data structure for audit information.
 */
export interface Audit extends Entity {
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
  $subject?: Reference;

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
 * Audit properties excluding the extended entity properties.
 */
export type AuditBase = EntityExtension<Audit>;

/**
 * Base properties in order to create a log.
 */
export type AuditBaseCreate = EntityExtensionCreate<Audit, 'action' | 'completed'>;
