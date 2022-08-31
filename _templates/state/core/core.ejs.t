---
to: "<%= path ? `${path}/${name}/${name}.ts` : null %>"
---
import { Entity, entityCreate } from '../entity';
import type { <%= Name %>, <%= Name %>Base, <%= Name %>BaseCreate } from './<%= name %>.types';

export const <%= name %>Key = '<%= name %>';

export const <%= name %>Base: <%= Name %>Base = {
  prop: null,
};

export function <%= name %>Create(
  <%= name %>: <%= Name %>BaseCreate,
  entity: Partial<Entity> = {},
): <%= Name %> {
  const <%= name %>Entity = entityCreate<<%= Name %>>(<%= name %>Key, {
    ...<%= name %>Base,
    ...<%= name %>,
  }, entity);

  return <%= name %>Entity;
}
