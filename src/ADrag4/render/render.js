export class Render {
  constructor() {
    this.getInstance();
  }

  clearInstance() {
    Render.instance = null;
  }

  getInstance() {
    if (!Render.instance) {
      this.updateCallback = undefined;
      this.renderData = {};
      Render.instance = this;
    }
    return Render.instance;
  }

  updateProvider(data) {
    Render.instance.renderData.data = data;
    if (typeof Render.instance.updateCallback === "function") {
      Render.instance.updateCallback(data);
    }
  }

  watch(callback) {
    if (typeof callback === "function") {
      this.updateCallback = callback;
    }
  }
}
