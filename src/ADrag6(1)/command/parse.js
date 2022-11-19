import { messageHead, messagesBody } from "../traits/traits";
import { carrier } from "./carrier";

export const parseTrait = (sender, accepter, order, payload) => {
  const msgKey = messageHead(sender, accepter).msgKey;
  const toCall = (args) =>
    carrier(sender, accepter, {
      from: sender,
      to: accepter,
      operation: order,
      ...args,
    });

  return {
    key: msgKey,
    operation: order,
    body: messagesBody(payload, msgKey),
    toCall,
  };
};
