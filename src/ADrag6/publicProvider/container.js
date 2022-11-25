const DEFAULT_HEIGHT = 0;
const DEFAULT_WIDTH = 0;
import {commanderReceiver} from "../command/commander";
import {ORDER} from "../config/orders";
import {CURRENT, TARGET} from "../config/exchange";

/**
 * 容器
 * id = provider DOMid
 */
export class Container {
    constructor(id) {
        this.container = {};
        //初始化容器DOM
        this.initDom(id);
    }

    createNode(nodePayload) {
        return this.callCommander(
            CURRENT.CONTAINER,
            TARGET.CONTAINER,
            ORDER.CREATE,
            nodePayload
        );
    }

    /**
     * 删除某节点
     * @param key
     * @param from 必须是存在的节点或者容器CONTAINER
     * @param to
     * @returns {*}
     */
    removeNode(key, to = TARGET.CONTAINER, from = CURRENT.CONTAINER) {
        return this.callCommander(from, to, ORDER.REMOVE, {removeKey: key});
    }

    /**
     * 清空全部
     * @param from 必须是存在的节点或者容器CONTAINER
     * @returns {*}
     */
    clearNode(from = CURRENT.CONTAINER) {
        return this.callCommander(from, TARGET.CONTAINER, ORDER.CLEAR, {});
    }

    /**
     * 获取全部
     * @returns {*}
     */
    getAll() {
        return this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.GET, {});
    }

    /**
     * 编辑
     * @param to
     * @param payload
     * @param from 必须是存在的节点或者容器CONTAINER
     */
    updateNode(to = TARGET.CONTAINER, payload, from = CURRENT.CONTAINER,) {
        this.callCommander(from, to, ORDER.UPDATE, payload);
    }

    /**
     * 查找某节点
     * @param key
     * @param from 必须是存在的节点或者容器CONTAINER
     * @returns {*}
     */
    findNode(key, from = CURRENT.CONTAINER,) {
        return this.callCommander(from, TARGET.CONTAINER, ORDER.FIND, {findKey: key});
    }

    /**
     * 执行自定义命令
     * @param from
     * @param to
     * @param order
     * @param payload
     */
    runCustomOrder(from = CURRENT.CONTAINER, to = TARGET.CONTAINER, order, payload) {
        this.callCommander(from, to, order, payload);
    }

    //发送通知到COMMANDER
    //ORDER
    /**
     * 通知操作
     * @param {} sender  发起者key
     * @param {*} accepter  接收者key
     * @param {*} patchOrder  命令
     * @param {*} payload 携带的参数
     * @returns
     */
    callCommander(sender, accepter, patchOrder, payload) {
        return commanderReceiver(sender, accepter, patchOrder, payload);
    }

    //初始化容器DOM
    initDom(id) {
        this.container.containerDom = document.getElementById(id);

        //初始化长宽
        this.container.heightOfContainer = DEFAULT_HEIGHT;
        this.container.widthOfContainer = DEFAULT_WIDTH;
    }

    //获取一些必要的属性
    findParamsOfContainer() {
        if (this.container.containerDom instanceof HTMLElement) {

            //获取可用的长宽
            this.container.heightOfContainer =
                parseFloat(this.container.containerDom.style.height) || DEFAULT_HEIGHT;

            this.container.widthOfContainer =
                parseFloat(this.container.containerDom.style.width) || DEFAULT_WIDTH;
        }
    }
}
