import Service from "../service";


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

    init(id) {
        this.service = new Service()
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
        this.service.createPack({id, down, move, up})
        this.service.paint()
    }

    /**
     * 创建复制块
     * @param id
     * @param down fn
     * @param move fn
     * @param up fn
     */
    createFragment({id, down, move, up}) {
        this.service.createFragment({id, down, move, up})
        this.service.paint()
    }
}
