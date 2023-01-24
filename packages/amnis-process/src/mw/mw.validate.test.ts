import {
  contactCreator,
  IoContext,
  IoInput,
  ioOutput,
  ioOutputErrored,
  IoProcess,
  schemaEntity,
} from '@amnis/core';
import { contextSetup } from '@amnis/state';
import { validateSetup } from '../validate.js';
import { mwValidate } from './mw.validate.js';

let context: IoContext;

/**
 * Create an empty process for the middleware.
 */
const noprocess: IoProcess = () => async (i, o) => o;

beforeAll(async () => {
  context = await contextSetup({
    validators: validateSetup([schemaEntity]),
  });
});

test('should validate a valid contact object', async () => {
  const process = mwValidate('Contact')(noprocess);

  const input: IoInput = {
    body: contactCreator({
      name: 'Name',
    }),
  };
  const output = await process(context)(input, ioOutput());

  expect(output.status).toBe(200);
  expect(output.json.logs).toHaveLength(0);
});

test('should NOT validate an ivalid contact object', async () => {
  const process = mwValidate('Contact')(noprocess);

  const input: IoInput = {
    body: {
      name: 0,
      prop: false,
    },
  };
  const output = await process(context)(input, ioOutput());

  expect(output.status).toBe(400);
  expect(output.json.logs).toHaveLength(1);
  expect(ioOutputErrored(output)).toBe(true);
});
