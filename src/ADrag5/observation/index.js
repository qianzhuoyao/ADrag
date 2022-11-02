export default class Observation {
  constructor() {
    this.singleton();
  }
  singleton() {
    if (!Observation.instance) {
      this.callback = undefined;
      Observation.instance = this;
    }
    return Observation.instance;
  }

  /**
   * 订阅
   * @param callback
   */
  subscription(callback) {
    if (typeof callback === "function") {
      Observation.instance.callback = callback;
    }
  }

  /**
   * 消费订阅函数
   */
  use() {
    if (Observation.instance.callback) {
      Observation.instance.callback();
    }
  }
}
