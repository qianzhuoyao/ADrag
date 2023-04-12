import BaseParam from "@/ADrag8/BaseParam";

export default class Fragment {
    constructor() {
        this.$Id = undefined
        this.$Pack = null
        this.$BaseObserver = new BaseParam()
        this.$BaseObserver.updatePosition({x: 0, y: 0})
        this.$BaseObserver.updateSize({width: 0, height: 0})
    }

    insertCustomPack(pack) {
        this.$Pack = pack
    }

    getDom() {
        return this.$BaseObserver.$DOM
    }

    insertDom(DOM) {
        this.$BaseObserver.insertDom(DOM)
    }

    setId(id) {
        this.$Id = id
    }

    startDraggingSubscription(callback) {
        if (typeof callback === "function") {
            callback()
        }
    }

    resizing(callback) {
        if (typeof callback === "function") {
            callback()
        }
    }

    dragMoving(callback) {
        if (typeof callback === "function") {
            callback()
        }
    }

    dragFinished(callback) {
        if (typeof callback === "function") {
            callback()
        }
    }
}
