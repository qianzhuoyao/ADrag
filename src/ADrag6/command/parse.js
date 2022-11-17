import {messageHead, messagesBody} from "../traits/traits";
import {ORDER} from "../config/orders";
import {carrier} from "./carrier";
import {CURRENT, TARGET} from "../config/exchange";

export const parseTrait = (order, payload) => {
    let msgKey = undefined;
    let toCall = new Function("");

    if (
        order === ORDER.CREATE ||
        order === ORDER.REMOVE ||
        order === ORDER.CLEAR ||
        order === ORDER.GET
    ) {
        msgKey = messageHead(CURRENT.CONTAINER, TARGET.CONTAINER).msgKey;
        toCall = (args) => carrier(CURRENT.CONTAINER, TARGET.CONTAINER, {
            from: CURRENT.CONTAINER,
            to: TARGET.CONTAINER,
            operation: order,
            ...args,
        });
    } else if (order === ORDER.UPDATE) {
        const {from, to} = payload;
        msgKey = messageHead(from, to).msgKey;
        toCall = (args) => carrier(from, to, {from, to, operation: order, ...args});
    }

    return {
        key: msgKey,
        operation: order,
        body: messagesBody(payload, msgKey).value,
        toCall,
    };
};
