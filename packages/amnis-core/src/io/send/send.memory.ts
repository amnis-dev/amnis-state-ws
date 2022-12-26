import { dateJSON } from '../../core.js';
import { rtk } from '../../rtk.js';
import { DateJSON } from '../../types.js';
import type { Send, SendEmailProps } from './send.types.js';

export interface SendInboxItem extends SendEmailProps {
  /**
   * Date-time received.
   */
  received: DateJSON;
}

export type SendMailbox = Record<string, SendInboxItem[]>;

export type SendCallback = (inbox: SendMailbox) => void;

export type SendUnsubscribe = () => void;

let sendMailboxes: SendMailbox = {};

const sendSubcribers: { [key: string]: SendCallback } = {};

export const sendMailboxStorage = () => sendMailboxes;

export const sendMailboxClear = () => { sendMailboxes = {}; };

export const sendSubscribe = (callback: SendCallback): SendUnsubscribe => {
  const uid = rtk.nanoid();
  sendSubcribers[uid] = callback;
  return () => {
    delete sendSubcribers[uid];
  };
};

export const sendMemory: Send = {
  /**
   * Sends an email.
   */
  email: async (email) => {
    const mailboxKey = email.to;
    if (!sendMailboxes[mailboxKey]) {
      sendMailboxes[mailboxKey] = [];
    }
    sendMailboxes[mailboxKey].push({
      ...email,
      received: dateJSON(),
    });

    Object.values(sendSubcribers).forEach((listener) => listener(sendMailboxes));

    return true;
  },
};

export default sendMemory;
