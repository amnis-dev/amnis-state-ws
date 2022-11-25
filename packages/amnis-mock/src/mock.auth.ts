/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseTransformer, rest } from 'msw';
import { authProcess } from '@amnis/process';
import { contextSetup } from '@amnis/state';
import { setupAudit, setupInput } from './setup.js';
import { MockHandlers } from './mock.types.js';

const defaultMockOptions = {
  baseUrl: '',
};

export const authSetupHandlers: MockHandlers = async (options) => {
  const {
    baseUrl,
    context = await contextSetup(),
  } = { ...defaultMockOptions, ...options };

  return [
    rest.post(`${baseUrl}/api/auth/:processer`, async (req, res, ctx) => {
      const { processer } = req.params;
      const processKey = processer as keyof typeof authProcess;

      if (!authProcess[processKey]) {
        return res(
          ctx.status(400, `Auth Process '${processer}' does not exist.`),
        );
      }

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

      setupAudit(req, context, input, output);

      return res(
        ctx.status(200),
        ctx.json(output.json),
        ...ctxCookies,
      );
    }),
  ];
};

export default authSetupHandlers;
