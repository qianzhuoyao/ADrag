import {RenderModel} from "@/ADrag4/model/renderModel";
import {Render} from "@/ADrag4/render/render";


export class Controller {
    constructor() {
        this.getInstance()
    }

    updateForCreate(args) {
        const {tag} = args
        console.log(Controller.instance)
        if (this.checkMoveTargetInside(args)) {
            this.updateViewAfterChange(() => {
                this.create(args)
                this.editor((i, k) => {
                    return k === this.getRenderData().length - 1 ? {...i, f: true} : {...i, f: false}
                })
            }, tag)
        }
    }

    updateForChange(fn, args) {
        console.log(fn, args, 'change')
        if (typeof fn === "function") {
            const {tag} = args
            this.updateViewAfterChange(() => {
                this.editor(fn)
            }, tag)
        }
    }

    editor(fn) {
        if (typeof fn === 'function') {
            Controller.instance.renderModel.iterateChange((i, k) => {
                const res = fn(i, k)
                console.log(res, 'res')
                //注意res 类型
                return {...i, ...res}
            })
        }
    }

    editorAll(args) {
        Controller.instance.renderModel.iterateChange((i) => {
            return {...i, ...args}
        })
    }

    tagsCheck(tag) {
        return Controller.instance.tags.includes(tag)
    }

    updateViewAfterChange(fn, tag) {
        if (typeof fn === 'function') {
            if (this.tagsCheck(tag)) {
                fn()
                this.updateView()
            }
        }
    }

    updateForDelete(args) {
        const {tag, id} = args
        this.updateViewAfterChange(() => {
            this.delete(id)
        }, tag)
    }

    updateView() {
        new Render().updateProvider(this.getRenderData())
    }

    setTags(tags) {
        Controller.instance.tags = tags
    }

    bindId(id) {
        Controller.instance.id = id
    }

    undo() {
    }

    redo() {
    }

    getInstance() {
        if (!Controller.instance) {
            this.renderModel = new RenderModel()
            this.tags = []
            this.id = undefined
            Controller.instance = this;
        }
        return Controller.instance;
    }

    getRenderData() {
        return Controller.instance.renderModel.getItems()
    }

    delete(id) {
        Controller.instance.renderModel.iterateChange((i) => {
            if (i.id === id) {
                i.v = false
            }
            return i
        })
    }

    create({x, y, w, h, f, z, c, tag,m}) {
        Controller.instance.renderModel.create({x, y, m,w, h, f, z, c, tag})
    }

    checkMoveTargetInside(itemParams) {
        return Controller.instance.renderModel.hasItemInsideProvider(itemParams, Controller.instance.id)
    }

    remove() {
        Controller.instance = undefined
    }
}
