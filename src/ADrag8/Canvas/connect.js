import {computeDomPositionAndSize, createDom} from "@/ADrag8/View";
import {clogDefaultDrag, createMouseDown, createMouseMove, createMouseUp} from "@/ADrag8/Event/operation";

export default class Connect {
    constructor() {
        this.edit = false
        this.canvas = null
        this.ctx = null
    }

    //构建canvas面板
    buildCanvas({width = 100, height = 100}) {
        this.canvas = createDom('bg-canvas', document.body, 'canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext("2d")
    }

    startAnimation() {
        window.requestAnimationFrame(this.animation);
    }

    animation() {
        this.ctx.restore()
        window.requestAnimationFrame(this.animation);
    }

    setAbsolute({top = 0, left = 0}) {
        this.canvas.style.position = "absolute"
        this.canvas.style.top = top + 'px'
        this.canvas.style.left = left + 'px'
    }

    boundCheck(DOM) {
        if (DOM instanceof HTMLElement) {
            const {left, top, right, bottom} = computeDomPositionAndSize(
                DOM
            );
            const {left: cLeft, top: cTop, right: cRight, bottom: cBottom} = computeDomPositionAndSize(
                this.canvas
            );
            return left >= cLeft && right <= cRight && top >= cTop && bottom <= cBottom
        } else {
            throw new Error('DOM 类型溢出')
        }
    }

    nodeCreate({x, y, w, h}) {
        this.ctx.strokeRect(x, y, w, h)
        this.ctx.fillStyle = "green";
    }

    nodeAStart(nodeA) {
        if (this.boundCheck(nodeA)) {
            let startX, startY;
            clogDefaultDrag()
            createMouseDown(nodeA, (evt) => {
                console.log('1')
                startX = evt.pageX - parseFloat(this.canvas.style.left)
                startY = evt.pageY - parseFloat(this.canvas.style.top)
                this.ctx.beginPath()
                // this.nodeCreate({
                //     x: evt.pageX - parseFloat(this.canvas.style.left),
                //     y: evt.pageY - parseFloat(this.canvas.style.top),
                //     w: 2,
                //     h: 2
                // })

                this.edit = true
                console.log(evt, 'evt')
            })
            createMouseMove(this.canvas, (evt) => {
                if (this.edit) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.ctx.moveTo(startX, startY)
                    this.ctx.lineTo(evt.pageX - parseFloat(this.canvas.style.left), evt.pageY - parseFloat(this.canvas.style.top))
                    this.ctx.lineWidth = 5;//设置线条宽度
                    this.ctx.strokeStyle = "red";//设置线条颜色
                    this.ctx.stroke();//用于绘制线条
                    // this.nodeCreate({
                    //     x: evt.pageX - parseFloat(this.canvas.style.left),
                    //     y: evt.pageY - parseFloat(this.canvas.style.top),
                    //     w: 2,
                    //     h: 2
                    // })
                }
            })
            createMouseUp(this.canvas, () => {
                this.ctx.closePath()
                this.ctx.save()
                this.edit = false
            })
        }
    }

}
