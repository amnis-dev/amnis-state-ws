---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { <%= Name %>, Meta } from '@amnis/core/types';

/**
 * <%= Name %> collection meta data.
 */
export type <%= Name %>Meta = Meta<<%= Name %>>;
