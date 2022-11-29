import {parseTrait} from "./parse";
import {ORDER} from "@/ADrag6/config/orders";

const defaultOrderKey = Object.keys(ORDER)
/**
 * 发送通知
 * @param traitCommand
 * @returns {*}
 */
export const commanderSend = (traitCommand) => {
    const {body, toCall, operation} = traitCommand;
    return toCall({operation, body});
};

/**
 * 接收通知
 * @param from
 * @param to
 * @param patchOrder
 * @param payload
 * @returns {*}
 */
export const commanderReceiver = (from, to, patchOrder, payload) => {
    //解析消息
    if (patchOrder) {
        const command = parseTrait(from, to, patchOrder, payload, defaultOrderKey.includes(patchOrder));
        const result = commanderSend(command)
        //记录消息
        if ([ORDER.CREATE, ORDER.REMOVE, ORDER.UPDATE, ORDER.CLEAR].includes(patchOrder)) {
            const historyAddCommand = parseTrait(from, to, ORDER.HISTORY_COMMAND, payload, true);
            commanderSend(historyAddCommand)
        }

        return result;
    }
};
