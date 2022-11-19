const DEFAULT_HEIGHT = 0;
const DEFAULT_WIDTH = 0;
import { commanderReceiver } from "../command/commander";
import { ORDER } from "../config/orders";
import { CURRENT, TARGET } from "../config/exchange";

export class Container {
  constructor(id) {
    this.container = {};
    //初始化容器DOM
    this.initDom(id);
  }

  createNode(nodePayload) {
    this.callCommander(
      CURRENT.CONTAINER,
      TARGET.CONTAINER,
      ORDER.CREATE,
      nodePayload
    );
  }
  order(payload) {
    this.callCommander(
      CURRENT.CONTAINER,
      TARGET.CONTAINER,
      ORDER.INITORDER,
      payload
    );
  }
  removeNode(key) {
    this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.REMOVE, key);
  }

  clearNode() {
    this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.CLEAR);
  }

  getAll() {
    return this.callCommander(CURRENT.CONTAINER, TARGET.CONTAINER, ORDER.GET);
  }

  updateNode(from = CURRENT.CONTAINER, to = TARGET.CONTAINER, payload) {
    this.callCommander(from, to, ORDER.UPDATE, payload);
  }
  customOrder(from = CURRENT.CONTAINER, to = TARGET.CONTAINER, order, payload) {
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