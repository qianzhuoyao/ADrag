import { isFunc } from "@/ADrag8/Tools/typeCheck";

export default class EventCallback {
  constructor() {
    this.$Event = {
      RESIZING: [],
      RESIZE_START: [],
      CLICK: [],
      DRAGGING: [],
      DRAG_START: [],
      DRAG_FINISH: [],
    };
  }

  nodeResize(fn) {
    if (isFunc(fn)) {
      this.$Event.RESIZE_START.push(fn);
    }
  }

  nodeClick(fn) {
    if (isFunc(fn)) {
      this.$Event.CLICK.push(fn);
    }
  }

  nodeResizeStart(fn) {
    if (isFunc(fn)) {
      this.$Event.RESIZING.push(fn);
    }
  }

  nodeDragging(fn) {
    if (isFunc(fn)) {
      this.$Event.DRAGGING.push(fn);
    }
  }

  nodeDragStart(fn) {
    if (isFunc(fn)) {
      this.$Event.DRAG_START.push(fn);
    }
  }

  nodeDragFinish(fn) {
    if (isFunc(fn)) {
      this.$Event.DRAG_FINISH.push(fn);
    }
  }
}
