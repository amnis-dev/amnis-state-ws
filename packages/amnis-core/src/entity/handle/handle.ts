import { uid } from '../../uid.js';
import type { Handle, HandleBase, HandleCreator } from './handle.types.js';

export const handleKey = 'handle';

export const handleBase = (): HandleBase => ({
  name: '',
  $subject: uid('entity'),
});

export function handleCreator(
  handle: HandleCreator,
): Handle {
  return {
    ...handleBase,
    ...handle,
    $id: uid(handleKey),
  };
}
