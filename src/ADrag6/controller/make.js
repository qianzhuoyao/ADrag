import {Controller} from "./controller";

/**
 * 处理命令集
 * @param makeFn
 * makeFn params=>
 *  instance,
 *  service,
 *  order,
 *  payload,
 *  orderMap
 */
export const reducer = (makeFn) => {
    if (typeof makeFn === "function") {
        return new Controller().make(makeFn);
    }
};
/**
 * 构造命令集单元
 * @param order
 */
export const buildCustomOrder = (order) => {
    return new Controller().order(order);
}
