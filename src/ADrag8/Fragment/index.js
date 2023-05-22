import BaseParam from "@/ADrag8/BaseParam";
import {Render} from "@/ADrag8";

export default class Fragment extends BaseParam {
    constructor() {
        super()
        this.$Id = undefined;
        this.$Pack = null;
        this._Render = null;
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

    //移除块
    remove() {
        //更新数据
        this._Render.emitRemove(this.$Id)
    }

    rendered(render) {
        if (render instanceof Render) {
            this._Render = render
        }
    }

    /**
     * 调用render 重绘
     */
    reDraw() {
        this._Render.paint(this)
    }

    getRender() {
        return Object.freeze(this._Render)
    }

    getDom() {
        return this.$DOM;
    }


    setId(id) {
        this.$Id = id;
    }


    getId() {
        return this.$Id;
    }
}
