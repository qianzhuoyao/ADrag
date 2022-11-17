import {ORDER} from "@/ADrag6/config/orders";
import {CURRENT, TARGET} from "@/ADrag6/config/exchange";

const removeRule = (from, to, payload) => {
    return payload
}
const updateRule = (from, to, payload) => {
    if (from.indexOf('0') > -1 && to.indexOf('1') > -1) {
        return payload.body.payload
    }
}
const createRule = (from, to, payload) => {
    if (from === CURRENT.CONTAINER && to === TARGET.CONTAINER) {
        return payload
    }
}
export const make = (instance, service, order, payload) => {
    if (instance.from && instance.to) {
        if (order === ORDER.CREATE) {
            const checkedRuleParams = createRule(instance.from, instance.to, payload)
            checkedRuleParams && service.create(checkedRuleParams);
        }
        if (order === ORDER.UPDATE) {
            service.edit(instance.to, {
                body: updateRule(instance.from, instance.to, payload),
                key: payload.key
            });
        }
        if (order === ORDER.REMOVE) {
            service.remove(removeRule(instance.from, instance.to, payload));
        }
        if (order === ORDER.GET) {
            return service.getAll()
        }
    }
}
