---
to: "<%= path ? `${path}/${name}/${name}.endpoint.types.ts` : null %>"
---
/**
 * My Endpoint requestType
 */
export interface Api<%= Name %>MyEndpoint {
  data: unknown;
}
