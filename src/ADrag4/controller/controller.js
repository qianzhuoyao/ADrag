import {RenderModel} from "@/ADrag4/model/renderModel";
import {Render} from "@/ADrag4/render/render";


export class Controller {
    constructor() {
        this.getInstance()
    }

    update(args) {
        const {tag} = args
        if (Controller.instance.tags.includes(tag)) {
            this.create(args)
            this.updateView()
        }
    }

    updateView() {
        new Render().updateProvider(this.getRenderData())
    }

    setTags(tags) {
        Controller.instance.tags = tags
    }

    undo() {
    }

    redo() {
    }

    getInstance() {
        if (!Controller.instance) {
            this.renderModel = new RenderModel()
            this.tags = []
            Controller.instance = this;
        }
        return Controller.instance;
    }

    getRenderData() {
        return Controller.instance.renderModel.getItems()
    }

    create({x, y, w, h, f, z,c}) {
        Controller.instance.renderModel.create({x, y, w, h, f, z,c})
    }

    remove() {
        Controller.instance = undefined
    }
}
