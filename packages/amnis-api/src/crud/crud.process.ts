import type {
  ApiCrudIOes,
} from './crud.types';
import { crudProcessCreate } from './crud.process.create';
import { crudProcessRead } from './crud.process.read';
import { crudProcessUpdate } from './crud.process.update';
import { crudProcessDelete } from './crud.process.delete';

export const apiCrudProcesses: ApiCrudIOes = {
  create: crudProcessCreate,
  read: crudProcessRead,
  update: crudProcessUpdate,
  delete: crudProcessDelete,
};

export default { apiCrudProcesses };
