---
to: "<%= path ? `${path}/${name}/${name}.types.ts` : null %>"
---
import type { Meta } from '@amnis/core/entity';
import type { <%= Name %> } from '@amnis/core/<%= name %>';

/**
 * <%= Name %> collection meta data.
 */
export type <%= Name %>Meta = Meta<<%= Name %>>;
