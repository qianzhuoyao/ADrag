import {RenderModel} from "../model/renderModel";
import {Render} from "../render/render";
import {Lines} from "../lines/lines";

export class Controller {
    constructor() {
        this.getInstance()
    }

    narrow(px) {
        Controller.instance.editor(i => {
            return {
                ...i,
                w: i.w - px,
                h: i.h - px
            }
        })
        this.updateView()
    }

    amplification(px) {
        Controller.instance.editor(i => {
            return {
                ...i,
                w: i.w + px,
                h: i.h + px
            }
        })
        this.updateView()
    }

    remove() {
        Controller.instance.renderModel.clear()
        Controller.instance.renderModel.clearShots()
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

    onceDraw(args) {
        const {data} = args
        if (Array.isArray(data)) {
            data.map(i => {
                if (this.checkMoveTargetInside(i)) {
                    this.create(i)
                }
            })
            this.updateView()
        }
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
        console.log('ed')
        if (typeof fn === "function") {
            const {tag} = args
            this.updateViewAfterChange(() => {
                console.log(4)
                this.editor(fn)
            }, tag)
            !!sync && this.syncOperation()
        }
    }

    editor(fn) {
        if (typeof fn === 'function') {
            Controller.instance.renderModel.iterateChange((i, k) => {
                console.log(fn, 'fn')
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
        console.log(this.tagsCheck(tag), 5)
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
        this.syncOperation()
    }

    onConnect(id) {
        Controller.instance.renderModel.openShadow(id)
        this.updateView()
    }

    hasConnect() {
        return Controller.instance.renderModel.hasConnect()
    }

    closeConnect(id) {
        Controller.instance.renderModel.closeShadow(id)
        this.updateView()
    }

    clearConnect() {
        Controller.instance.renderModel.closeAllShadow()
        this.updateView()
    }

    syncOperation() {
        Controller.instance.renderModel.backUp()
        Controller.instance.shots = Controller.instance.renderModel.getBackUpHistory()
        Controller.instance.operationPoint = Controller.instance.shots.length - 1
        console.log(Controller.instance.shots, Controller.instance.operationPoint, '备份')
    }

    getHistory() {
        return Controller.instance.shots
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
        return new Promise((resolve) => {
            Controller.instance.operationPoint = Controller.instance.operationPoint > 0 ? Controller.instance.operationPoint - 1 : 0
            resolve(Controller.instance.shots[Controller.instance.operationPoint])
            const linesBackUp = new Lines().getBackUp()
            new Lines().setLines(linesBackUp[Controller.instance.operationPoint])
            this.evaluation(Controller.instance.shots[Controller.instance.operationPoint])
            this.updateView()
            console.log(Controller.instance.shots[Controller.instance.operationPoint], Controller.instance.shots, Controller.instance.operationPoint, 'Controller.instance.operationPoint ')
        })
    }

    evaluation(data) {
        Controller.instance.renderModel.setResult(data)
    }

    redo() {
    }

    clearInstance() {
        Controller.instance.renderModel.clearInstance()
        Controller.instance = null
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
