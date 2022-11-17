import {Service} from "../service/service";
import {make} from './make'

export class Controller {
    constructor() {
        this.singleton();
    }

    singleton() {
        if (!Controller.instance) {
            this.service = new Service();
            Controller.instance = this;
        }
        return Controller.instance;
    }

    accept(order, payload) {
        return make(Controller.instance, this.service, order, payload);
    }

    assigned(from, to) {
        Controller.instance.from = from;
        Controller.instance.to = to;
        return Controller.instance;
    }


}
