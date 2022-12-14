/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseTransformer, rest } from 'msw';
import { processCrud } from '@amnis/process';
import { contextSetup } from '@amnis/state';
import { ioOutput } from '@amnis/core';
import { setupInput } from './setup.js';
import { MockHandlers, MockOptions } from './mock.types.js';

const defaultMockOptions: MockOptions = {
  baseUrl: '',
};

export const crudSetupHandlers: MockHandlers = async (options) => {
  const {
    baseUrl,
    context = await contextSetup(),
  } = { ...defaultMockOptions, ...options };

  return [
    rest.post(`${baseUrl}/api/crud/:processer`, async (req, res, ctx) => {
      const { processer } = req.params;
      const processKey = processer as keyof typeof processCrud;

      if (!processCrud[processKey]) {
        return res(
          ctx.status(400, `CRUD Process '${processer}' does not exist.`),
        );
      }

      const input = await setupInput(req);

      const output = await processCrud[processKey](context)(input, ioOutput());

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

export default crudSetupHandlers;
