import { dateJSON } from '../../core.js';
import { logCreator } from '../../entity/index.js';
import { rtk } from '../../rtk.js';
import { DateJSON } from '../../types.js';
import type { Send, SendEmailProps } from './send.types.js';

export interface SendInboxItem extends SendEmailProps {
  /**
   * Date-time received.
   */
  received: DateJSON;
}

export type SendInbox = Record<string, SendInboxItem[]>;

export type SendCallback = (inbox: SendInbox) => void;

export type SendUnsubscribe = () => void;

const sendInbox: SendInbox = {};

const sendSubcribers: { [key: string]: SendCallback } = {};

export const sendSubscribe = (callback: SendCallback): SendUnsubscribe => {
  const uid = rtk.nanoid();
  sendSubcribers[uid] = callback;
  return () => {
    delete sendSubcribers[uid];
  };
};

export const sendMemory: Send = {
  email: (email) => {
    const inboxKey = email.to;
    if (!sendInbox[inboxKey]) {
      sendInbox[inboxKey] = [];
    }
    sendInbox[inboxKey].push({
      ...email,
      received: dateJSON(),
    });

    Object.values(sendSubcribers).forEach((listener) => listener(sendInbox));

    return logCreator({
      title: 'Email Sent',
      description: `An email has been successfully sent to ${email.to}.`,
      level: 'success',
    });
  },
};

export default sendMemory;
