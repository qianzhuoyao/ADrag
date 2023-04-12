/**
 * 多选节点，同时操作
 */

const SELECT_STATE = {
    START: 0,
    SELECTING: 1,
    FINISH: 2
}
const EVENT_STATE = {
    MOUSE_DOWN: 0,
    MOUSE_MOVE: 1,
    MOUSE_UP: 2
}
export default class Select {
    constructor() {
        this.state = SELECT_STATE.FINISH
        this.leftTopPosition = {left: 0, top: 0}
        this.E = this.createBox()
        this.providerDOM = null
        this.selection()
    }

    selection() {
        const that = this
        document.addEventListener('mousedown', (e) => this.documentMouseDown(e, that))
        document.addEventListener('mousemove', (e) => this.documentMouseMove(e, that))
        document.addEventListener('mouseup', (e) => this.documentMouseUp(e, that))
    }

    documentMouseUp(evt, that) {
        if (that.state === SELECT_STATE.SELECTING) {
            that.checkBound(evt)
            that.event = EVENT_STATE.MOUSE_UP
            that.compute({latestLeft: evt.pageX, latestTop: evt.pageY})
            that.finish()
        }
    }

    documentMouseMove(evt, that) {
        if (that.state === SELECT_STATE.SELECTING) {
            that.checkBound(evt)
            console.log(that, evt, 'documentMouseMove')
            that.event = EVENT_STATE.MOUSE_MOVE
            that.compute({latestLeft: evt.pageX, latestTop: evt.pageY})
        }
    }

    checkBound(evt) {
        let res = false
        if (this.providerDOM) {
            const rect = this.providerDOM.getBoundingRect()
            const {left, top, bottom, right} = rect
            const {clientX, clientY} = evt
            res = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom
        }
        return res
    }

    documentMouseDown(evt, that) {
        that.checkBound(evt)
        console.log(that, 'this')
        that.event = EVENT_STATE.MOUSE_DOWN
        that.start({left: evt.pageX, top: evt.pageY})
        that.compute({latestLeft: evt.pageX, latestTop: evt.pageY})

    }

    clear() {
        removeEventListener('mousedown', this.documentMouseDown)
        removeEventListener('mousemove', this.documentMouseMove)
        removeEventListener('mouseup', this.documentMouseUp)
    }

    provider(id) {
        this.providerDOM = document.getElementById(id)
    }

    createBox() {
        const E = document.createElement('div')
        E.style.display = 'none'
        E.style.position = 'absolute'
        document.body.appendChild(E)
        return E
    }

    start({left = 0, top = 0}) {
        if (this.state === SELECT_STATE.FINISH) {
            const l = Number(left) || 0
            const t = Number(top) || 0
            this.state = SELECT_STATE.START
            this.leftTopPosition = {left: l, top: t}
            this.E.style.display = 'none'
            this.E.style.width = '0px'
            this.E.style.height = '0px'
        }
    }

    compute({latestLeft = 0, latestTop = 0}) {
        this.state = SELECT_STATE.SELECTING
        const {left, top} = this.leftTopPosition
        console.log(this.leftTopPosition, latestTop, latestLeft)
        const w = (Number(latestLeft) || 0) - (Number(left) || 0)
        const h = (Number(latestTop) || 0) - (Number(top) || 0)
        this.E.id = '$$scene_group_select$$'
        this.E.style.display = 'block'
        this.E.style.border = '1px dashed #e1e1e1'
        this.E.style.opacity = '0.2'
        this.E.style.background = "#e1e1e1"
        this.E.style.left = (w >= 0 ? left : latestLeft) + 'px'
        this.E.style.top = (h >= 0 ? top : latestTop) + 'px'
        this.E.style.width = Math.abs(w) + 'px'
        this.E.style.height = Math.abs(h) + 'px'
    }

    finish() {
        this.state = SELECT_STATE.FINISH
    }
}
