/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseTransformer, rest } from 'msw';
import { authProcess } from '@amnis/process';
import { contextSetup } from '@amnis/state';
import { serverContextOptions } from './common/server.context.js';
import { setupInput } from './setup.js';
import { MockHandlers, MockOptions } from './mock.types.js';

const defaultMockOptions: MockOptions = {
  baseUrl: '',
  context: serverContextOptions,
};

export const authHandlers: MockHandlers = (options) => {
  const opt: MockOptions = { ...options, ...defaultMockOptions };

  return [
    rest.post(`${opt.baseUrl}/api/auth/:processer`, async (req, res, ctx) => {
      const { processer } = req.params;
      const processKey = processer as keyof typeof authProcess;

      if (!authProcess[processKey]) {
        return res(
          ctx.status(400, `Auth Process '${processer}' does not exist.`),
        );
      }

      const context = await contextSetup(opt.context);
      const input = await setupInput(req);

      const output = await authProcess[processKey](context)(input);

      const ctxCookies: ResponseTransformer<any, any>[] = [];
      Object.keys(output.cookies).forEach((cookieName) => {
        const cookieValue = output.cookies[cookieName];
        const cookieOptions: { expires?: Date } = {};
        if (cookieValue === undefined) {
          cookieOptions.expires = new Date();
        }
        ctxCookies.push(ctx.cookie(cookieName, cookieValue || '', cookieOptions));
      });
      return res(
        ctx.status(200),
        ctx.json(output.json),
        ...ctxCookies,
      );
    }),
  ];
};

export default authHandlers;
