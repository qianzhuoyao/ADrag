import BaseParam from "@/ADrag8/BaseParam";

export default class Fragment {
  constructor() {
    this.$Id = undefined;
    this.$Pack = null;
    this.$BaseObserver = new BaseParam();
    this.$BaseObserver.updatePosition({ x: 0, y: 0 });
    this.$BaseObserver.updateSize({ width: 0, height: 0 });
  }

  toJSON() {
    return {
      id: this.$Id,
      pack: this.$Pack,
      base: this.$BaseObserver.toJSON(),
    };
  }

  insertCustomPack(pack) {
    this.$Pack = pack;
  }

  removeContainer() {
    this.$BaseObserver.removeContainer();
  }

  setContainer(container) {
    this.$BaseObserver.setContainer(container);
  }

  getDom() {
    return this.$BaseObserver.$DOM;
  }

  /**
   * 事件回调
   * @param eventName
   * @param fn
   * eventName includes =
   * nodeClick
   * nodeResize
   * nodeResizeStart
   * nodeDragging
   * nodeDragStart
   * nodeDragFinish
   */
  getCallback(eventName, fn) {
    if (typeof this.$BaseObserver.$Event[eventName] === "function") {
      this.$BaseObserver.$Event[eventName](fn);
    }
  }

  updateSize({ width, height, alone }) {
    this.$BaseObserver.updateSize({ width, height, alone });
  }

  updatePosition({ x, y, alone }) {
    this.$BaseObserver.updatePosition({ x, y, alone });
  }

  updateFocus(focus) {
    this.$BaseObserver.updateFocus(focus);
  }

  insertDom(DOM) {
    this.$BaseObserver.insertDom(DOM);
  }

  setId(id) {
    this.$Id = id;
  }

  getId() {
    return this.$Id;
  }
}
