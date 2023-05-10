import BaseParam from "@/ADrag8/BaseParam";

export default class Fragment extends BaseParam {
    constructor() {
        super()
        this.$Id = undefined;
        this.$Pack = null;
        // this.$BaseObserver = new BaseParam();
        this.updatePosition({x: 0, y: 0});
        this.updateSize({width: 0, height: 0});
    }

    fragmentToJSON() {
        return {
            id: this.$Id,
            pack: this.$Pack,
            base: this.toJSON()
        };
    }

    insertCustomPack(pack) {
        this.$Pack = pack;
    }


    getDom() {
        return this.$DOM;
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
        if (typeof this.$Event[eventName] === "function") {
            this.$Event[eventName](fn);
        }
    }

    setId(id) {
        this.$Id = id;
    }

    getId() {
        return this.$Id;
    }
}
