import {RenderModel} from "../model/renderModel";
import {Render} from "../render/render";
import {Lines} from "../lines/lines";

export class Controller {
    constructor() {
        this.getInstance();
    }

    narrow(px) {
        Controller.instance.editor((i) => {
            return {
                ...i,
                w: i.w - px,
                h: i.h - px,
            };
        });
        this.updateView();
    }

    amplification(px) {
        Controller.instance.editor((i) => {
            return {
                ...i,
                w: i.w + px,
                h: i.h + px,
            };
        });
        this.updateView();
    }

    remove() {
        Controller.instance.renderModel.clear();
        Controller.instance.renderModel.clearShots();
    }

    updateForCreate(args) {
        this.afterCreateSuccess(() => {
            this.editor((i, k) => {
                return k === this.getRenderData().length - 1
                    ? {...i, f: true}
                    : {...i, f: false};
            });
        }, args);
        this.syncOperation();
    }

    updateForDraw(args) {
        this.afterCreateSuccess(() => {
        }, args);
    }

    onceDraw(args) {
        const {data} = args;
        if (Array.isArray(data)) {
            data.map((i) => {
                if (this.checkMoveTargetInside(i)) {
                    this.create(i);
                }
            });
            this.updateView();
        }
    }

    afterCreateSuccess(fn, args) {
        const {tag} = args;
        if (typeof fn === "function") {
            if (this.checkMoveTargetInside(args)) {
                this.updateViewAfterChange(() => {
                    this.create(args);
                    fn();
                }, tag);
            }
        }
    }

    updateForChange(fn, args, sync) {
        if (typeof fn === "function") {
            const {tag} = args;
            this.updateViewAfterChange(() => {
                this.editor(fn);
            }, tag);
            !!sync && this.syncOperation();
        }
    }

    editor(fn) {
        if (typeof fn === "function") {
            Controller.instance.renderModel.iterateChange((i, k) => {
                const res = fn(i, k);
                //注意res 类型
                return {...i, ...res};
            });
        }
    }

    editorAll(args) {
        Controller.instance.renderModel.iterateChange((i) => {
            return {...i, ...args};
        });
    }

    tagsCheck(tag) {
        return Controller.instance.tags.includes(tag);
    }

    updateViewAfterChange(fn, tag) {
        if (typeof fn === "function") {
            if (this.tagsCheck(tag)) {
                fn();
                this.updateView();
            }
        }
    }

    updateForDelete(args) {
        const {tag, id} = args;
        this.updateViewAfterChange(() => {
            this.delete(id);
        }, tag);
        this.syncOperation();
    }

    onConnect(id) {
        Controller.instance.renderModel.openShadow(id);
        this.updateView();
    }

    hasConnect() {
        return Controller.instance.renderModel.hasConnect();
    }

    closeConnect(id) {
        Controller.instance.renderModel.closeShadow(id);
        this.updateView();
    }

    clearConnect() {
        Controller.instance.renderModel.closeAllShadow();
        this.updateView();
    }

    syncOperation() {
        Controller.instance.renderModel.backUp();
        Controller.instance.shots =
            Controller.instance.renderModel.getBackUpHistory();
        Controller.instance.operationPoint = Controller.instance.shots.length - 1;
    }

    getHistory() {
        return Controller.instance.shots;
    }

    bindVueInstance(VUE) {
        Controller.instance.vueInstace = VUE
    }

    compare(targetData, newData) {
        let currentData = targetData
        if (Array.isArray(newData)) {
            const iLength = newData.length;
            const jLength = currentData.length;
            if (iLength > jLength) {
                const jIds = [];
                for (let i = 0; i < jLength; i++) {
                    jIds.push(currentData[i].id);
                    currentData[i].firstMounted = false;
                    currentData[i].f = false;
                    Controller.instance.autoImport(currentData[i])
                }
                const add = newData.filter((i) => !jIds.includes(i.id));
                add.map((i) => {
                    Controller.instance.autoImport(i)
                    currentData.push({...i, firstMounted: true, f: true});
                });
            } else if (iLength === jLength) {
                for (let i = 0; i < iLength; i++) {
                    const {id: iId} = newData[i];
                    for (let j = 0; j < jLength; j++) {
                        const {id: jId} = currentData[j];
                        if (iId === jId) {
                            currentData[j].x = newData[i].x;
                            currentData[j].y = newData[i].y;
                            currentData[j].w = newData[i].w;
                            currentData[j].h = newData[i].h;
                            currentData[j].f = newData[i].f;
                            currentData[j].v = newData[i].v;
                            currentData[j].z = newData[i].z;
                            currentData[j].shadow = newData[i].shadow;
                            currentData[j].renderData = newData[i].renderData;
                        }
                        Controller.instance.autoImport(currentData[j])
                    }
                }
            } else {
                currentData = newData;
                currentData.map(i => {
                    Controller.instance.autoImport(i)
                })
            }
        }
        return currentData
    }

    //动态引入组件
    autoImport(item) {
        const {c, m, id} = item
        console.log({c, m}, '{cm}')
        if (Controller.instance.vueInstace) {
            Controller.instance.vueInstace.$options.components[`${id}c`] = c
            Controller.instance.vueInstace.$options.components[`${id}m`] = m
        }
        console.log(Controller.instance.vueInstace.$options.components, '.$options.components')
    }

    updateView() {
        new Render().updateProvider(this.getRenderData());
    }

    setTags(tags) {
        Controller.instance.tags = tags;
    }

    bindId(id) {
        Controller.instance.id = id;
    }

    undo() {
        return new Promise((resolve) => {
            Controller.instance.operationPoint =
                Controller.instance.operationPoint > 0
                    ? Controller.instance.operationPoint - 1
                    : 0;
            resolve(Controller.instance.shots[Controller.instance.operationPoint]);
            const linesBackUp = new Lines().getBackUp();
            new Lines().setLines(linesBackUp[Controller.instance.operationPoint]);
            this.evaluation(
                Controller.instance.shots[Controller.instance.operationPoint]
            );
            this.updateView();
        });
    }

    evaluation(data) {
        Controller.instance.renderModel.setResult(data);
    }

    redo() {
    }

    clear() {
        Controller.instance.renderModel.clear()
        this.updateView()
    }

    resetShots() {
        Controller.instance.renderModel.clearShots()
    }

    clearInstance() {
        Controller.instance.renderModel.clearInstance();
        Controller.instance = null;
    }

    getInstance() {
        if (!Controller.instance) {
            this.renderModel = new RenderModel();
            this.shots = [];
            this.operationPoint = -1;
            this.tags = [];
            this.id = undefined;
            this.vueInstace = null;
            Controller.instance = this;
        }
        return Controller.instance;
    }

    getRenderData() {
        return Controller.instance.renderModel.getItems();
    }

    delete(id) {
        Controller.instance.renderModel.iterateChange((i) => {
            if (i.id === id) {
                i.v = false;
            }
            return i;
        });
    }

    create({x, y, w, h, f, z, c, tag, m, renderKey, offsetX, offsetY, renderData}) {
        const {left: providerOffsetX, top: providerOffsetY} = window.getComputedStyle(
            document.getElementById(Controller.instance.id),
            null
        );
        Controller.instance.renderModel.create({
            x: x - parseFloat(providerOffsetX),
            y: y - parseFloat(providerOffsetY),
            m,
            w,
            h,
            f,
            z,
            c,
            tag,
            renderData,
            renderKey,
            offsetX,
            offsetY,
            providerOffsetY,
            providerOffsetX
        });
    }

    checkMoveTargetInside(itemParams) {
        return Controller.instance.renderModel.hasItemInsideProvider(
            itemParams,
            Controller.instance.id
        );
    }
}
