import {BoxGraph} from "../helper/index";
import Render from "../render";

export default class Controller {
    constructor() {
        this.singleton();
    }

    singleton() {
        if (!Controller.instance) {
            this.render = null;
            this.box = null;
            this.init();
            Controller.instance = this;
        }
        return Controller.instance;
    }

    init() {
        this.box = new BoxGraph();
        this.render = new Render(this.box)
    }

    create(value) {
        this.render.create(value)
    }
}
