---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { Meta, <%= Name % } from '@amnis/core';

/**
 * <%= Name % collection meta data.
 */
export type <%= Name %Meta = Meta<<%= Name %>;
