/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseTransformer, rest } from 'msw';
import { crudProcess } from '@amnis/process';
import { contextSetup } from '@amnis/state';
import { serverContextOptions } from './common/server.context.js';
import { setupInput } from './setup.js';
import { MockHandlers, MockOptions } from './mock.types.js';

const defaultMockOptions: MockOptions = {
  baseUrl: '',
  context: serverContextOptions,
};

export const crudHandlers: MockHandlers = (options) => {
  const opt: MockOptions = { ...defaultMockOptions, ...options };

  return [
    rest.post(`${opt.baseUrl}/api/crud/:processer`, async (req, res, ctx) => {
      const { processer } = req.params;
      const processKey = processer as keyof typeof crudProcess;

      if (!crudProcess[processKey]) {
        return res(
          ctx.status(400, `CRUD Process '${processer}' does not exist.`),
        );
      }

      const context = await contextSetup(opt.context);
      const input = await setupInput(req);

      const output = await crudProcess[processKey](context)(input);

      const ctxCookies: ResponseTransformer<any, any>[] = [];
      Object.keys(output.cookies).forEach((cookieName) => {
        const cookieValue = output.cookies[cookieName];
        const cookieOptions: { expires?: Date } = {};
        if (cookieValue === undefined) {
          cookieOptions.expires = new Date();
          ctxCookies.push(ctx.cookie(cookieName, '', { expires: new Date() }));
        } else {
          ctxCookies.push(ctx.cookie(cookieName, cookieValue, {
            path: '/',
            sameSite: 'lax',
            httpOnly: true,
            /**
             * Secure is false since this is a mock service.
             */
            secure: false,
          }));
        }
      });

      return res(
        ctx.status(200),
        ctx.json(output.json),
        ...ctxCookies,
      );
    }),
  ];
};

export default crudHandlers;
