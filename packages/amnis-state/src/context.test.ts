import { contextSetup } from './context.js';
import { roleSelectors } from './role/index.js';
import { systemSelectors } from './system/index.js';

test('should create initial node context', async () => {
  const context = await contextSetup({ initialize: true });

  const systems = systemSelectors.selectAll(context.store.getState());
  const roles = roleSelectors.selectAll(context.store.getState());

  expect(systems).toHaveLength(1);
  expect(roles).toHaveLength(4);

  const [system] = systems;

  expect(system).toEqual(expect.objectContaining({
    name: 'Main System',
  }));
  expect(true).toBe(true);
});
