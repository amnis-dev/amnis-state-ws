/**
 * Send template function.
 */
export type SendTemplate = (...args: string[]) => void;

/**
 * Properties of an email.
 */
export interface SendEmailProps {
  /**
   * The recipient of the email.
   */
  to: string;

  /**
   * The verified sender of this email.
   */
  from: string;

  /**
   * Name of the sender.
   */
  fromName?: string;

  /**
   * Email subject.
   */
  subject: string;

  /**
   * Text version of the email.
   */
  text: string;

  /**
   * HTML version of the email.
   */
  html?: string;
}

/**
 * Emailer method.
 */
export type SendEmail = (email: SendEmailProps) => Promise<boolean>;

/**
 * I/O interface for sending emails, texts, or other types of communication methods.
 */
export interface Send {
  email: SendEmail;
}
