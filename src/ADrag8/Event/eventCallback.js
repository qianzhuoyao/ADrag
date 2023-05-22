import {isFunc} from "@/ADrag8/Tools/typeCheck";


export default class EventCallback {
    constructor() {
        this.$Event = {
            //尺寸变更
            RESIZING: [],
            MOUSE_DOWN: [],
            MOUSE_UP: [],
            RESIZE_START: [],
            CLICK: [],
            DRAGGING: [],
            DRAG_START: [],
            DRAG_FINISH: [],
        };
        this.$Cycle = {
            //挂载
            MOUNTED: [],
            //销毁
            DESTROYED: [],
            //更新
            UPDATED: []
        }
    }

    updated(fn) {
        if (isFunc(fn)) {
            this.$Cycle.UPDATED.push(fn);
        }
    }

    mounted(fn) {
        if (isFunc(fn)) {
            this.$Cycle.RESIZING.push(fn);
        }
    }

    destroyed(fn) {
        if (isFunc(fn)) {
            this.$Cycle.RESIZING.push(fn);
        }
    }

    nodeResize(fn) {
        if (isFunc(fn)) {
            this.$Event.RESIZING.push(fn);
        }
    }

    nodeMouseDown(fn) {
        if (isFunc(fn)) {
            this.$Event.MOUSE_DOWN.push(fn);
        }
    }

    nodeMouseUp(fn) {
        if (isFunc(fn)) {
            this.$Event.MOUSE_UP.push(fn);
        }
    }

    nodeClick(fn) {
        if (isFunc(fn)) {
            this.$Event.CLICK.push(fn);
        }
    }

    nodeResizeStart(fn) {
        if (isFunc(fn)) {
            this.$Event.RESIZE_START.push(fn);
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
