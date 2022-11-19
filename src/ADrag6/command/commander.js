import {parseTrait} from "./parse";
import {ORDER} from "@/ADrag6/config/orders";


export const commanderSend = (traitCommand) => {
    const {key, body, toCall, operation} = traitCommand;
    return toCall({operation, key, body});
};
export const commanderReceiver = (from, to, patchOrder, payload) => {
    //解析消息
    if (patchOrder) {
        const command = parseTrait(from, to, patchOrder, payload);
        //记录消息
        const historyAddCommand = parseTrait(from, to, ORDER.HISTORY_COMMAND, payload);
        commanderSend(historyAddCommand)

        return commanderSend(command);
    }
};
