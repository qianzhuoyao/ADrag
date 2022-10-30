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
  subscription(callback) {
    if (typeof callback === "function") {
      Observation.instance.callback = callback;
    }
  }
  use() {
    if (Observation.instance.callback) {
      Observation.instance.callback();
    }
  }
}
