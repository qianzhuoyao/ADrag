const DEFAULT_HEIGHT = 0;
const DEFAULT_WIDTH = 0;
const DEFAULT_X = 0;
const DEFAULT_Y = 0;
import {commanderReceiver} from "../command/commander";
import {ORDER} from "../config/orders";
import {CURRENT, TARGET} from "../config/exchange";
import {buildEvent} from "@/ADrag6/service/modify";


/**
 * 容器
 * id = provider DOMid
 */
export class Container {
    constructor(id) {
        this.container = {};
        this.components = {};
        //初始化容器DOM
        this.initDom(id);
    }

    /**
     * 创建节点
     * @param nodePayload
     * @returns {*}
     */
    createNode(nodePayload) {
        const {x, y, w, h} = nodePayload;
        //校验位置
        this.findParamsOfContainer()
        const {heightOfContainer, widthOfContainer, xOfContainer, yOfContainer} = this.container
        if ([x, y, w, h].some(i => i !== undefined)) {
            //是否在容器内的有效节点判断
            if (x >= xOfContainer && y >= yOfContainer && (x + w) <= (xOfContainer + widthOfContainer) && (y + h) <= (yOfContainer + heightOfContainer)) {
                const usefulLoad = {...nodePayload, x: x - xOfContainer, y: y - yOfContainer}
                return this.callCommander(
                    CURRENT.CONTAINER,
                    TARGET.CONTAINER,
                    ORDER.CREATE,
                    usefulLoad
                );
            }
        }
    }

    /**
     * 初始定义components 无法重新定义
     * @param mapList
     */
    templateMap(mapList) {
        if (!Object.keys(this.components).length) {
            this.components = mapList
        }
    }

    /**
     * 返回组件
     */
    capture(name) {
        return this.components[name]
    }

    /**
     * 动态的对应到一个组件
     */
    caught(name, component) {
        this.components[name] = component
    }

    /**
     * 获取偏移量
     */
    getOffset() {
        return {
            left: Math.floor(this.container.xOfContainer),
            top: Math.floor(this.container.yOfContainer)
        }
    }

    /**
     * 装饰事件
     */
    decorate({downCallback, moveCallback, overCallback}) {
        this.findParamsOfContainer()
        return buildEvent({
            downCallback,
            moveCallback,
            overCallback,
            offsetXOfMoving: Math.floor(this.container.xOfContainer),
            offsetYOfMoving: Math.floor(this.container.yOfContainer)
        })
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
     * 获取备份
     */
    getCommandHistory() {
        return this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.GET_HISTORY_COMMAND, {})
    }

    /**
     * 返回上一步的节点集合
     */
    backToPreviousStep() {
        return this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.BACK_TO_HISTORY_COMMAND, {})
    }

    /**
     * 备份
     */
    backUp() {
        return this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.HISTORY_COMMAND, {})
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
    updateNode(to = TARGET.CONTAINER, payload, from = CURRENT.CONTAINER) {
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
        this.container.containerDom.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false
        })
        //初始化长宽
        this.container.heightOfContainer = DEFAULT_HEIGHT;
        this.container.widthOfContainer = DEFAULT_WIDTH;
    }

    /**
     * 有效值取定
     * @param anything
     * @param dom
     * @param key
     * @param _default
     * @returns {number|undefined}
     */
    retrieveTheCorrectDomValue(anything, dom, key, _default = undefined) {
        if (dom instanceof HTMLElement)
            return parseFloat(String(anything) || window.getComputedStyle(dom, null)[key] || _default) || _default
    }

    //获取一些必要的属性
    findParamsOfContainer() {
        if (this.container.containerDom instanceof HTMLElement) {

            //获取可用的长宽
            this.container.heightOfContainer = this.retrieveTheCorrectDomValue(
                this.container.containerDom.style.height,
                this.container.containerDom,
                "height",
                DEFAULT_HEIGHT)
            this.container.widthOfContainer = this.retrieveTheCorrectDomValue(
                this.container.containerDom.style.width,
                this.container.containerDom,
                "width",
                DEFAULT_WIDTH)

            //获取可用的坐标
            this.container.xOfContainer = this.retrieveTheCorrectDomValue(
                this.container.containerDom.style.left,
                this.container.containerDom,
                "left",
                DEFAULT_X)
            this.container.yOfContainer = this.retrieveTheCorrectDomValue(
                this.container.containerDom.style.top,
                this.container.containerDom,
                "top",
                DEFAULT_Y)
        }
    }
}
