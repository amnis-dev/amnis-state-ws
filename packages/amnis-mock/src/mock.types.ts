import type { IoContext } from '@amnis/core';
import type {
  DefaultBodyType,
  MockedRequest,
  RestHandler,
  StartOptions,
} from 'msw';

export interface MockOptions {
  baseUrl?: string;
  context?: IoContext;
}

export type MockHandlers = (
  options?: MockOptions
) => Promise<RestHandler<MockedRequest<DefaultBodyType>>[]>

export interface MockServiceOptions {
  baseUrl?: string;
  context?: IoContext;
}

export type MockService = {
  setup: (options?: MockOptions) => Promise<void>;
  start: (options?: StartOptions) => void;
  stop: () => void;
}
