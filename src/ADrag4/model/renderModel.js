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

    create(args) {
        const {x, y, w, h, f, z, c} = args
        RenderModel.instance.items.push({
            x, y, w, h, f, z, c
        })
    }
}
