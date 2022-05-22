// import type { EnhancedStore } from '@reduxjs/toolkit';
import { ApiHandlers } from '@amnis/core/api';
import type {
  EntityApiResponseBodyCreate,
  EntityApiResponseBodyRead,
} from './entityApi.types';

export function entityApiHandlersGenerate(/** store: EnhancedStore */): ApiHandlers {
  return {
    create: (): EntityApiResponseBodyCreate => {
      const response = {};
      return response;
    },
    read: (): EntityApiResponseBodyRead => {
      const response = {};
      return response;
    },
  };
}

export default entityApiHandlersGenerate;
