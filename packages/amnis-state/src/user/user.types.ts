import type {
  User as CoreUser,
  Meta,
} from '@amnis/core/index';

export type User = CoreUser;

/**
 * User collection meta data.
 */
export type UserMeta = Meta<User>;
