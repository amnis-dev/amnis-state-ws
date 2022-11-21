import type { ContextOptions } from '@amnis/state';
import { DefaultBodyType, MockedRequest, RestHandler } from 'msw';

export interface MockOptions {
  baseUrl?: string;
  context?: ContextOptions;
}

export type MockHandlers = (options?: MockOptions) => RestHandler<MockedRequest<DefaultBodyType>>[];
