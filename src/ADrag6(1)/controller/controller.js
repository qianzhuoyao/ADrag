import { Service } from "../service/service";
import { ORDER } from "../config/orders";
export class Controller {
  constructor() {
    this.singleton();
  }
  discontinued() {
    this.service.stop();
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
  accept(order, payload) {
    Controller.instance.service.currentMsgKek(payload.body.msgKey);
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

  assigned(from, to) {
    Controller.instance.from = from;
    Controller.instance.to = to;
    return Controller.instance;
  }
}
