const DEFAULT_HEIGHT = 0;
const DEFAULT_WIDTH = 0;
import {commanderReceiver} from "../command/commander";
import {ORDER} from "../config/orders";
import {CURRENT, TARGET} from "../config/exchange";

export class Container {
    constructor(id) {
        this.container = {};
        //初始化容器DOM
        this.initDom(id);
    }

    createNode(nodePayload) {

        this.callCommander(ORDER.CREATE, nodePayload);
    }

    removeNode(key) {
        this.callCommander(ORDER.REMOVE, key);
    }

    clearNode() {
        this.callCommander(ORDER.CLEAR);
    }

    getAll() {
        return this.callCommander(ORDER.GET);
    }

    updateNode(from = CURRENT.CONTAINER, to = TARGET.CONTAINER, payload) {
        this.callCommander(ORDER.UPDATE, {
            from,
            to,
            payload,
        });
    }

    //发送通知到COMMANDER
    //ORDER
    callCommander(patchOrder, payload) {
        return commanderReceiver(patchOrder, payload);
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
