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

    hasItemInsideProvider(item, DOMid) {
        const provider = document.getElementById(DOMid)
        const computedContainer = window.getComputedStyle(provider, null)
        const {height, width, left, top} = computedContainer
        const area = this.computeArea({
            height: parseFloat(height),
            width: parseFloat(width),
            left: parseFloat(left),
            top: parseFloat(top)
        })
        return this.inside(area, item)
    }

    inside(area, item) {
        const {leftTop: [leftNum, topNum], rightBottom: [rightNum, bottomNum]} = area
        const {w, h, x, y} = item
        const l = x
        const r = x + w
        const t = y
        const b = y + h
        return (l > leftNum && r < rightNum) && (t > topNum && b < bottomNum)
    }

    computeArea(args) {
        const {height, width, left, top} = args
        if ([height, width, left, top].some(i => typeof i !== 'number')) {
            throw new Error('容器判断异常，参数类型错误')
        }
        return {
            leftTop: [left, top],
            leftBottom: [left, top + height],
            rightTop: [left + width, top],
            rightBottom: [left + width, top + height]
        }
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
         * m 弹窗组件
         * v 显示,
         * id 标识
         *
         */
        const {x, y, w, h, f, z, c, tag, m} = args
        const v = true
        const id = this.getItems().length
        RenderModel.instance.items.push({
            x, y, w, h, f, z, c, v, m, id, tag
        })
    }
}
