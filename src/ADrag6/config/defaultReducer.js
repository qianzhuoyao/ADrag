import {ORDER} from "@/ADrag6/config/orders";
import {CURRENT} from "@/ADrag6/config/exchange";

/**
 * 默认reducer
 * @param instance
 * @param service
 * @param order
 * @param payload
 */
export const defaultReducer = (instance, service, order, payload) => {

    const {from: customOperationCurrent, to: customOperationTarget} = instance
    const {to: defaultOperationTarget, body} = payload

    if (order === ORDER.HISTORY_COMMAND) {

        return service.backUpCommand()

    } else if (order === ORDER.GET_HISTORY_COMMAND) {

        return service.getCommandHistory()

    } else if (order === ORDER.CREATE) {

        return service.create(customOperationCurrent, defaultOperationTarget, body)

    } else if (order === ORDER.UPDATE) {
        //操作项限制
        if (service.roleCheck(customOperationCurrent) || customOperationCurrent === CURRENT.CONTAINER) {
            return service.edit(customOperationTarget, {
                body,
                from: customOperationCurrent,
                to: customOperationTarget
            })
        }

    } else if (order === ORDER.GET) {

        return service.getAll()

    } else if (order === ORDER.FIND) {

        const {findKey} = body.value
        return service.find(findKey)

    } else if (order === ORDER.REMOVE) {

        const {removeKey} = body.value
        return service.remove(removeKey)

    } else if (order === ORDER.CLEAR) {

        return service.clear()

    }else if(order === ORDER.BACK_TO_HISTORY_COMMAND){

        return service.backToPre()

    }
}
