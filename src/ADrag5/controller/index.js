import Render from "../render";

export default class Controller {
    constructor() {
        this.singleton();
    }

    singleton() {
        if (!Controller.instance) {
            this.render = null;
            this.init();
            Controller.instance = this;
        }
        return Controller.instance;
    }

    init() {
        this.render = new Render()
    }

    create(value) {
        this.render.create(value)
    }
}
