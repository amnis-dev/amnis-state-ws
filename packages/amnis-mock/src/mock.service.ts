import { schemaAuth, schemaEntity, schemaState } from '@amnis/core';
import { validateSetup } from '@amnis/process';
import { contextSetup } from '@amnis/state';
import { setupWorker, SetupWorkerApi } from 'msw';
import type { SetupServerApi } from 'msw/node';
import { authSetupHandlers } from './mock.auth.js';
import { crudSetupHandlers } from './mock.crud.js';
import type { MockService } from './mock.types.js';

let service: SetupServerApi | SetupWorkerApi | undefined;

export const mockService: MockService = {
  setup: async (options) => {
    if (service) {
      console.warn('MSW Service has already been setup.');
      return;
    }

    const opt = { ...options };

    const {
      baseUrl = '',
      context = await contextSetup({
        validators: validateSetup([schemaAuth, schemaState, schemaEntity]),
      }),
    } = opt;

    const handlerOptions = { baseUrl, context };

    const authHandlers = await authSetupHandlers(handlerOptions);
    const crudHandlers = await crudSetupHandlers(handlerOptions);
    const handlers = [...authHandlers, ...crudHandlers];

    // On NodeJS
    if (typeof window === 'undefined') {
      const msw = await import('msw/node');
      service = msw.setupServer(...handlers);
    // On Browser
    } else {
      service = setupWorker(...handlers);
    }
  },
  start: (options) => {
    if (!service) {
      console.error('Must call mockService.setup() before starting!');
      return;
    }
    // NodeJS uses listen();
    if ('listen' in service) {
      service.listen();
    }
    // Browser uses start();
    if ('start' in service) {
      service.start(options);
    }
  },
  stop() {
    if (!service) {
      console.error('Must call mockService.setup() before stopping!');
      return;
    }
    // NodeJS uses close.
    if ('close' in service) {
      service.close();
    }
    // Browser uses stop().
    if ('stop' in service) {
      service.stop();
    }
  },
};

export default mockService;
