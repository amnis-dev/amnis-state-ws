import { contextCreate } from './context';
import { systemSelectors } from '../system/index';
import { roleSelectors } from '../role/index';

test('should create initial node context', async () => {
  const context = await contextCreate();

  const systems = systemSelectors.selectAll(context.store.getState());
  const roles = roleSelectors.selectAll(context.store.getState());

  expect(systems).toHaveLength(1);
  expect(roles).toHaveLength(2);

  const [system] = systems;

  expect(system).toEqual(expect.objectContaining({
    name: 'Default System',
  }));
});
