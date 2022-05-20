import type { EntityState as RTKEntityState } from '@reduxjs/toolkit';
import type { Entity, EntityMeta, EntityReference } from '@amnis/core/entity';

export type EntityState<E extends Entity, M extends EntityMeta<E>> = RTKEntityState<E> & M;

export type EntityStatePayloadActiveSet<E extends Entity> = EntityReference<E>;

export type EntityStatePayloadFocusSet<E extends Entity> = EntityReference<E>;

export type EntityStatePayloadSelectionSet<E extends Entity> = EntityReference<E>[];
