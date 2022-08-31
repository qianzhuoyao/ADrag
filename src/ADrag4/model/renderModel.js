export class RenderModel {
    constructor() {
        this.getInstance()
    }

    getInstance() {
        if (!RenderModel.instance) {
            this.items = []
            RenderModel.instance = this;
        }
        return RenderModel.instance;
    }

    getItems() {
        return RenderModel.instance.items
    }


    iterateChange(fn) {
        if (typeof fn === "function") {
            const list = this.getItems()
            RenderModel.instance.items = list.map((i, k) => fn.call(this, i, k))
        }
    }


    create(args) {
        /*
         * x x,
         * y y,
         * w 宽,
         * h 高,
         * f 聚焦,
         * z 层级,
         * c 组件,
         * v 显示,
         * id 标识
         *
         */
        const {x, y, w, h, f, z, c, tag} = args
        const v = true
        const id = this.getItems().length
        RenderModel.instance.items.push({
            x, y, w, h, f, z, c, v, id, tag
        })
    }
}
