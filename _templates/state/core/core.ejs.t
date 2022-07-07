---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import { entityCreate } from '../entity';
import type { LogBaseCreate } from '../log';
import type { <%= Name %>, <%= Name %>Base, <%= Name %>BaseCreate } from './<%= name %>.types';

export const <%= name %>Key = '<%= name %>';

export const <%= name %>Base: <%= Name %>Base = {
  prop: null,
};

/**
 * <%= Name %> check method.
 */
export function <%= name %>Check(<%= name %>: <%= Name %>): LogBaseCreate[] {
  const logs: LogBaseCreate[] = [];

  return logs;
}

export function <%= name %>Create(
  <%= name %>: <%= Name %>BaseCreate,
): <%= Name %> {
  const <%= name %>Entity = entityCreate<<%= Name %>>(<%= name %>Key, {
    ...<%= name %>Base,
    ...<%= name %>,
  });

  return <%= name %>Entity;
}
