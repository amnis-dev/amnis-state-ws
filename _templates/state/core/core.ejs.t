---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import {
  EntityExtension,
  EntityExtensionCreate,
  entityCreate,
} from '../entity';
import type { Log } from '../log';
import type { <%= Name %> } from './<%= name %>.types';

export const <%= name %>Key = '<%= name %>';

export const <%= name %>Base: EntityExtension<<%= Name %>> = {
  prop: null,
};

/**
 * <%= Name %> check method.
 */
export function <%= name %>Check(<%= name %>: <%= Name %>): Log[] {
  const logs: Log[] = [];

  return logs;
}

export function <%= name %>Create(
  <%= name %>: EntityExtensionCreate<<%= Name %>, 'nameDisplay' | '$user'>,
  checkSkip = false,
): [<%= Name %>, Log[]] {
  const <%= name %>Entity = entityCreate<<%= Name %>>(<%= name %>Key, {
    ...<%= name %>Base,
    ...<%= name %>,
  });

  const logs: Log[] = [];
  if (!checkSkip) {
    logs.push(...<%= name %>Check(<%= name %>Entity));
  }

  return [<%= name %>Entity, logs];
}
