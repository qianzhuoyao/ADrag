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

    runInstructions(connectName, from, to, msg) {
        new MsgService().sendMsg(connectName, from, to, msg)
    }


    defineInstructions(initiator, connect, msg, fn) {
        new MsgService(Controller.instance.service).acceptMsg(initiator, connect, msg, fn)
    }

    updateMsgPackPackage(to, Package) {
        Controller.instance.service.updatePackPackage(to, Package)
    }

    updateMsgFragmentPackage(to, Package) {
        Controller.instance.service.updateFragmentPackage(to, Package)
    }

    updateMsgFragmentBlock(to, Package) {
        Controller.instance.service.updateFragmentBlock(to, Package)
    }

    updateMsgPackBlock(to, Block) {
        Controller.instance.service.updatePackBlock(to, Block)
    }

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

    getBox() {
        return Controller.instance.service.getBox()
    }
}
