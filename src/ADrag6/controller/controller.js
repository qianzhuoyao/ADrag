import {Service} from "../service/service";
import {ORDER} from "../config/orders";
import {defaultReducer} from "@/ADrag6/config/defaultReducer";

export class Controller {
    constructor() {
        this.singleton();
    }

    discontinued() {
        this.service.stop();
    }

    backUpCommander(from, to, patchOrder, payload) {
        this.service.backUpCommand(from, to, patchOrder, payload)
    }

    singleton() {
        if (!Controller.instance) {
            this.orderObject = ORDER;
            this.ruleGenerator = undefined;
            this.service = new Service();
            Controller.instance = this;
        }
        return Controller.instance;
    }

    getOrder() {
        return Controller.instance.orderObject;
    }

    order(order) {
        Controller.instance.orderObject = Object.assign(
            order,
            Controller.instance.orderObject
        );
    }

    make(build) {
        Controller.instance.ruleGenerator = build;
    }

    /**
     * 自带的命令执行器
     * @param order
     * @param payload
     * @returns {*}
     */
    originAccept(order, payload) {
        return defaultReducer(
            Controller.instance,
            Controller.instance.service,
            order,
            payload,
        );
    }

    /**
     * 自定义执行命令
     * @param order
     * @param payload
     * @returns {*}
     * ruleGenerator 参数 (控制器 服务实例 命令 携带内容 命令集)
     */
    accept(order, payload) {
        // Controller.instance.service.currentMsgKey(payload.body.msgKey);
        if (Controller.instance.ruleGenerator) {
            return Controller.instance.ruleGenerator(
                Controller.instance,
                Controller.instance.service,
                order,
                payload,
                Controller.instance.orderObject
            );
        }
    }

    /**
     * 指向
     * @param from
     * @param to
     * @returns {Controller}
     */
    assigned(from, to) {
        Controller.instance.from = from;
        Controller.instance.to = to;
        return Controller.instance;
    }
}
