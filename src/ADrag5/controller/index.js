import {BoxService, MsgService} from '../service'

export default class Controller {
    constructor() {
        this.singleton();
    }

    singleton() {
        if (!Controller.instance) {
            this.service = null;
            this.init();
            Controller.instance = this;
        }
        return Controller.instance;
    }

    /**
     * 响应指令
     * @param connectName
     * @param from
     * @param to
     * @param msg
     */
    runInstructions(connectName, from, to, msg) {
        new MsgService().sendMsg(connectName, from, to, msg)
    }

    /**
     * 定义消息指令
     * @param initiator
     * @param connect
     * @param msg
     * @param fn
     */
    defineInstructions(initiator, connect, msg, fn) {
        /**
         * 将box的数据嵌入消息体内 new MsgService(Controller.instance.service)
         */
        new MsgService(Controller.instance.service).acceptMsg(initiator, connect, msg, fn)
    }

    /**
     * 更新pack 的 package
     * 与updateMsgFragmentPackage 区别在于id
     * @param to
     * @param Package
     */
    updateMsgPackPackage(to, Package) {
        Controller.instance.service.updatePackPackage(to, Package)
    }

    /**
     * 更新Fragment的package
     * 与updateMsgPackPackage 区别在于id
     * @param to
     * @param Package
     */
    updateMsgFragmentPackage(to, Package) {
        Controller.instance.service.updateFragmentPackage(to, Package)
    }

    /**
     * 更新Fragment的block
     * 与updateMsgPackBlock 区别在于id
     * @param to
     * @param Package
     */
    updateMsgFragmentBlock(to, Package) {
        Controller.instance.service.updateFragmentBlock(to, Package)
    }

    /**
     * 更新pack的block
     * 与updateMsgFragmentBlock 区别在于id
     * @param to
     * @param Block
     */
    updateMsgPackBlock(to, Block) {
        Controller.instance.service.updatePackBlock(to, Block)
    }

    /**
     * 初始化
     * @param id
     */
    init(id) {
        this.service = new BoxService()
        this.service.createProvider(id)
    }

    /**
     * 创建普通块
     * @param id
     * @param down fn
     * @param move fn
     * @param up fn
     */
    createPack({id, down, move, up}) {
        Controller.instance.service.createPack({id, down, move, up})
        Controller.instance.service.paint()
    }

    /**
     * 新建box
     * @param _package
     * @param key
     */
    createBox({_package, key}) {
        Controller.instance.service.createBox({
            _package, key
        })
    }

    /**
     * 创建复制块
     * @param id
     * @param down fn
     * @param move fn
     * @param up fn
     */
    createFragment({id, down, move, up}) {
        Controller.instance.service.createFragment({id, down, move, up})
        Controller.instance.service.paint()
    }

    /**
     * 获取所有boxs
     * @returns {*}
     */
    getBox() {
        return Controller.instance.service.getBox()
    }
}
