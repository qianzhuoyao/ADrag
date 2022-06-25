import { complier } from "../load/compiler";
import lodash from "lodash";
const MAPKEYS = ["x", "y", "ZIndex", "width", "height", "visible"];
export default class Render {
  constructor() {
    this.wait = false;
    this.records = [];
    this.nodes = [];
  }
  getIndexOfNodes(index) {
    return lodash.cloneDeep(this.nodes[index]);
  }
  start() {
    return complier();
  }
  shot(s) {
    this.records.push(s);
  }
  //分水岭的作用，前后create的节点渲染机制不一样，之前的为wait模式，之后的将不再顾及是否finished，直接渲染
  syncRender() {
    this.wait = true;
    this.nodes.map((i, k) => {
      //当前节点打上同步标签，表明其会被额外当成一个任务被同步的执行
      i.instance.tagWaitRener();
      if (k) {
        i.instance.hide();
      } else {
        i.instance.display();
      }
    });
  }
  nextRender(currentTag) {
    let stop = false;
    for (let i = 0, length = this.nodes.length; i < length; i++) {
      if (
        this.nodes[i].instance.tag !== currentTag &&
        !this.nodes[i].instance.visible
      ) {
        this.nodes[i].instance.display();
        stop = true;
        break;
      }
    }
    return stop;
  }
  finished(current) {
    if (current && this.wait && current.isTagWaitRender()) {
      this.wait = this.nextRender(current.tag);
    }
  }
  /**
   * 1：创建节点，你不可以直接更改view来更改视图，而是需要更改template转化的节点实例来
   * 2：依靠tag来区分节点，无tag会导致意料外问题
   * @param {*} template 模板
   * @param {*} tag 节点标识
   * @returns
   */
  create(template, tag) {
    if (!tag) {
      throw new Error("tag is required for new nodes");
    }
    const that = this;
    const cloneOfTemplate = lodash.cloneDeep(template);
    cloneOfTemplate.setTag(tag);
    let view = this.map(cloneOfTemplate);
    const instance = new Proxy(cloneOfTemplate, {
      set: function (obj, prop, value) {
        if (MAPKEYS.includes(prop)) {
          that.nodes = that.nodes.map((i) => {
            return {
              instance: i.instance,
              view:
                i.instance.tag === obj.tag
                  ? Object.freeze({ ...i.view, [prop]: value })
                  : Object.freeze(i.view),
            };
          });
        }
        obj[prop] = value;
        return true;
      },
    });
    this.nodes.push({
      instance,
      view: Object.freeze(view),
    });
    return this;
  }
  getNodes() {
    return this.nodes;
  }
  map(i) {
    return {
      x: i.x,
      y: i.y,
      visible: i.visible,
      width: i.width,
      height: i.height,
      ZIndex: i.ZIndex,
      tag: i.tag,
    };
  }
}
