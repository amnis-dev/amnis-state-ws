import type {
  ApiCrudProcesses,
} from './crud.types.js';
import { crudProcessCreate } from './crud.process.create.js';
import { crudProcessRead } from './crud.process.read.js';
import { crudProcessUpdate } from './crud.process.update.js';
import { crudProcessDelete } from './crud.process.delete.js';

export const apiCrudProcess: ApiCrudProcesses = {
  create: crudProcessCreate,
  read: crudProcessRead,
  update: crudProcessUpdate,
  delete: crudProcessDelete,
};

export default { apiCrudProcess };
