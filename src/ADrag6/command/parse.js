import {messageHead, messagesBody} from "../traits/traits";
import {carrier} from "./carrier";

/**
 * 命令解析
 * @param sender
 * @param accept
 * @param order
 * @param payload
 * @param origin
 * @returns {{toCall: (function(*): void|*), body: {msgKey: *, value: *}, operation, key}}
 */
export const parseTrait = (sender, accept, order, payload, origin) => {
    const msgKey = messageHead(sender, accept).msgKey;
    const toCall = (args) =>
        carrier(sender, accept, {
            from: sender,
            to: accept,
            operation: order,
            ...args,
        }, origin);

    return {
        key: msgKey,
        operation: order,
        body: messagesBody(payload, msgKey),
        toCall,
    };
};
