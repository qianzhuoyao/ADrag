import { messageHead, messagesBody } from "../traits/traits";
import { carrier } from "./carrier";

export const parseTrait = (sender, accept, order, payload,origin) => {
  const msgKey = messageHead(sender, accept).msgKey;
  const toCall = (args) =>
    carrier(sender, accept, {
      from: sender,
      to: accept,
      operation: order,
      ...args,
    },origin);

  return {
    key: msgKey,
    operation: order,
    body: messagesBody(payload, msgKey),
    toCall,
  };
};
