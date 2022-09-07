import {RenderModel} from "@/ADrag4/model/renderModel";
import {Render} from "@/ADrag4/render/render";

export class Controller {
    constructor() {
        this.getInstance()
    }

    updateForCreate(args) {
        this.afterCreateSuccess(() => {
            this.editor((i, k) => {
                return k === this.getRenderData().length - 1 ? {...i, f: true} : {...i, f: false}
            })
        }, args)
        this.syncOperation()
    }

    updateForDraw(args) {
        this.afterCreateSuccess(() => {
        }, args)
    }

    afterCreateSuccess(fn, args) {
        const {tag} = args
        if (typeof fn === 'function') {
            if (this.checkMoveTargetInside(args)) {
                this.updateViewAfterChange(() => {
                    this.create(args)
                    fn()
                }, tag)
            }
        }
    }

    updateForChange(fn, args, sync) {
        if (typeof fn === "function") {
            const {tag} = args
            this.updateViewAfterChange(() => {
                this.editor(fn)
            }, tag)
            !!sync && this.syncOperation()
        }
    }

    editor(fn) {
        if (typeof fn === 'function') {
            Controller.instance.renderModel.iterateChange((i, k) => {
                const res = fn(i, k)
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
                fn.call(this)
                this.updateView()
            }
        }
    }

    updateForDelete(args) {
        const {tag, id} = args
        this.updateViewAfterChange(() => {
            this.delete(id)
        }, tag)
        this.syncOperation()


    }

    syncOperation() {
        Controller.instance.renderModel.backUp()
        Controller.instance.shots = Controller.instance.renderModel.getBackUpHistory()
        Controller.instance.operationPoint++
        console.log(Controller.instance.shots,Controller.instance.operationPoint, 'deleteShot')
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
        Controller.instance.operationPoint = Controller.instance.operationPoint > 0 ? Controller.instance.operationPoint - 1 : 0
        this.evaluation(Controller.instance.shots[Controller.instance.operationPoint])
        this.updateView()
    }

    evaluation(data) {
        Controller.instance.renderModel.setResult(data)
    }

    redo() {
    }

    getInstance() {
        if (!Controller.instance) {
            this.renderModel = new RenderModel()
            this.shots = []
            this.operationPoint = -1
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

    create({x, y, w, h, f, z, c, tag, m}) {
        const {
            left: offsetX,
            top: offsetY
        } = window.getComputedStyle(document.getElementById(Controller.instance.id), null)
        console.log(offsetX,x,'cccccx')
        Controller.instance.renderModel.create({
            x: x - parseFloat(offsetX),
            y: y - parseFloat(offsetY),
            m,
            w,
            h,
            f,
            z,
            c,
            tag
        })
    }

    checkMoveTargetInside(itemParams) {
        return Controller.instance.renderModel.hasItemInsideProvider(itemParams, Controller.instance.id)
    }
}
