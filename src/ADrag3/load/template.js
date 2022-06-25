export default class Template {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.ZIndex = 0;
    //节点显示
    this.visible = true;
    //匹配config luncher
    this.receiver = undefined;
    //config内components共享数据池
    this.templateState = null;
    //执行区分,当其为true时，他不会等待其他节点渲染完毕再渲染
    this.waitRender = false;
  }
  tagWaitRener() {
    this.waitRender = true;
  }
  isTagWaitRender() {
    return this.waitRender;
  }
  unTagWaitRender() {
    this.waitRender = false;
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
