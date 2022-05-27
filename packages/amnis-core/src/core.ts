import { DateJSON } from './core.types';

export const noop = () => { /** No operation. */ };

export const dateJSON = () => (new Date().toJSON() as DateJSON);

export default { noop, dateJSON };
