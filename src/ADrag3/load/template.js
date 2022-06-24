export default class Template {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.ZIndex = 0;
    this.visible = true;
    this.receiver = undefined;
    this.templateState = null;
  }

  setShareData(s) {
    this.templateState = Object.freeze(s);
  }
  matchReceiver(launcher) {
    this.receiver = launcher;
  }
  setV(v) {
    this.visible = v;
  }
  setX(x) {
    this.x = x;
  }
  setY(y) {
    this.y = y;
  }
  setH(h) {
    this.height = h;
  }
  setW(w) {
    this.width = w;
  }
  setZ(z) {
    this.ZIndex = z;
  }
}
