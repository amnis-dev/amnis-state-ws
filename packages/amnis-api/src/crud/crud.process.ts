import type {
  ApiCrudProcesses,
} from './crud.types';
import { crudProcessCreate } from './crud.process.create';
import { crudProcessRead } from './crud.process.read';
import { crudProcessUpdate } from './crud.process.update';
import { crudProcessDelete } from './crud.process.delete';

export const apiCrudProcess: ApiCrudProcesses = {
  create: crudProcessCreate,
  read: crudProcessRead,
  update: crudProcessUpdate,
  delete: crudProcessDelete,
};

export default { apiCrudProcess };
