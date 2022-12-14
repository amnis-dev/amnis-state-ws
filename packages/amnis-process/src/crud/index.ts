import { processCrudCreate } from './crud.create.js';
import { processCrudRead } from './crud.read.js';
import { processCrudUpdate } from './crud.update.js';
import { processCrudDelete } from './crud.delete.js';

export const processCrud = {
  create: processCrudCreate,
  read: processCrudRead,
  update: processCrudUpdate,
  delete: processCrudDelete,
};

export default processCrud;
