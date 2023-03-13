import {Controller} from "./controller";

/**
 * 处理命令集
 * @param makeFn
 * makeFn params=>
 *  instance,实例
 *  service,服务
 *  order,来源命令
 *  payload,来源参数
 *  orderMap,命令合集
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
