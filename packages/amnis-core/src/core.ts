/* eslint-disable no-bitwise */
/* eslint-disable no-unused-expressions */
import { nanoid } from '@reduxjs/toolkit';
import type {
  DateJSON,
  DateNumeric,
  SURL,
  Identifier,
  IdentifierTree,
  IdentifierList,
} from './types';

/**
 * Function for no operation.
 */
export const noop = () => { /** No operation. */ };

/**
 * Create a identifier to another type.
 */
export const uid = <T>(key: string, id = nanoid()) => `${key}:${id}` as Identifier<T>;

/**
 * Create a new identifier list.
 */
export const uidList = <T>(
  list: Identifier<T>[] = [],
) => list as IdentifierList<T>;

/**
 * Create a new identifier tree.
 */
export const uidTree = <T>(
  tree: [Identifier<T>, Identifier<T> | null][] = [],
) => tree as IdentifierTree<T>;

/**
 * Creates a string URL (aka SURL).
 */
export const surl = (path: string) => (path as SURL);

/**
 * Creates a Date JSON string type.
 */
export const dateJSON = (date?: Date) => (
  (date?.toJSON() ?? new Date().toJSON()) as DateJSON
);

/**
 * Create a numeric date value. Needed typically for tokens.
 */
export const dateNumeric = (date?: Date | string): DateNumeric => {
  if (typeof date === 'string') {
    const unit = date.slice(-1);
    const value = parseInt(date, 10);
    if (Number.isNaN(value)) {
      return new Date().getTime() as DateNumeric;
    }
    switch (unit) {
      case 's':
        return new Date(Date.now() + value * 1000).getTime() as DateNumeric;
      case 'm':
        return new Date(Date.now() + value * 60000).getTime() as DateNumeric;
      case 'h':
        return new Date(Date.now() + value * 3600000).getTime() as DateNumeric;
      case 'd':
        return new Date(Date.now() + value * 86400000).getTime() as DateNumeric;
      default:
        return new Date().getTime() as DateNumeric;
    }
  }
  return (date?.getTime() ?? new Date().getTime()) as DateNumeric;
};

/**
 * Returns a duration in mulliseconds.
 */
export function durationCalc(duration: string): number {
  const unit = duration.slice(-1);
  const value = parseInt(duration, 10);
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse a numeric value from the time ${duration} provided.`);
  }
  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60000;
    case 'h':
      return value * 3600000;
    case 'd':
      return value * 86400000;
    default:
      throw new Error('Please use one of the units: ms, s, m, h, or d');
  }
}

/**
 * Validates a identifier type.
 */
export const identifierValidate = (ref: string): boolean => {
  const [key, id] = ref.split(':');

  if (!key || typeof key !== 'string') {
    return false;
  }

  if (!id || typeof id !== 'string' || id.length < 1) {
    return false;
  }

  return true;
};
