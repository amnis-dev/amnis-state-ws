import {
  auditCreator, auditKey, entityCreate, IoContext, IoInput, IoOutput, JWTAccess,
} from '@amnis/core';
import { httpAuthorizationParse } from '@amnis/process';
import type { DefaultBodyType, PathParams, RestRequest } from 'msw';

export type Request = RestRequest<DefaultBodyType, PathParams<string>>;

/**
 * Sets up the input object for processors.
 */
export const setupInput = async (req: Request): Promise<IoInput> => {
  /**
   * Mock a local ip.
   */
  const ip = '127.0.0.1';

  /**
   * Extract body and authSession data from the request.
   */
  const body = await req.json();
  const { authSession } = req.cookies;

  /**
   * Build the input object.
   */
  const input: IoInput = {
    body: body ?? {},
    sessionEncrypted: authSession,
    ip,
  };

  /**
   * Extract authorization header.
   */
  const authorization = req.headers.get('Authorization');
  input.accessEncoded = httpAuthorizationParse(authorization);

  /**
   * Extract signature header.
   */
  input.signatureEncoded = req.headers.get('Signature') || undefined;

  /**
   * Extract challenge header.
   */
  input.challengeEncoded = req.headers.get('Challenge') || undefined;

  return input;
};

/**
 * Generates audits from api access.
 */
export const setupAudit = async (
  req: Request,
  context: IoContext,
  input: IoInput,
  output: IoOutput,
): Promise<void> => {
  /**
   * Mock a local ip.
   */
  const ip = '127.0.0.1';

  const body = { ...input.body };

  /**
   * Hide passwords.
   */
  if (body.password) {
    body.password = '****';
  }

  /**
   * Create the audit.
   */
  const audit = auditCreator({
    action: `${req.method}:${req.url}`,
    completed: output.status === 200,
    inputBody: body,
    ip,
  });

  /**
   * Get the subject if there is one.
   */
  if (input.accessEncoded) {
    const [access] = await context.crypto.tokenDecode<JWTAccess>(input.accessEncoded);
    if (access) {
      audit.$subject = access.sub;
    }
  }

  /**
   * Create the record in the database.
   */
  context.database.create({
    [auditKey]: [entityCreate(audit)],
  });
};
