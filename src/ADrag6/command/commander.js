import {parseTrait} from "./parse";

export const commanderSend = (traitCommand) => {
    const {key, body, toCall, operation} = traitCommand;
    return toCall({operation, key, body});
};
export const commanderReceiver = (patchOrder, payload) => {
    //解析消息
    if (patchOrder) {
        const command = parseTrait(patchOrder, payload);
        return commanderSend(command);
    }
};
