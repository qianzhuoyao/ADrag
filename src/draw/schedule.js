import {
    _config
} from "@/draw/config";
//配置文件编译成模板
//模板可以复制出节点
//基于模板复制出的节点会被压入nodes里，并进行操作

class Node {
    constructor(id, template) {
        this.id = id
        this.focus = false
        this.visisble = true
        this.attribute = {}
        this.load(template)
    }

    addClick(callback) {
        this.clickCallback = typeof callback === 'function' ? callback : () => {
            new Error('addClick 参数异常')
        }
    }

    waitOver() {
        console.log('waitOver')
        typeof this.talk === 'function' && this.talk()
    }

    addMouseDown(callback) {
        this.mouseDownCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseDown 参数异常')
        }
    }

    addResizing(callback) {
        this.resizingCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseUp 参数异常')
        }
    }

    addMouseUp(callback) {
        this.mouseUpCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseUp 参数异常')
        }
    }

    addFocus(callback) {
        this.focusCallback = typeof callback === 'function' ? callback : () => {
            new Error('addFocus 参数异常')
        }
    }

    addBlur(callback) {
        this.blurCallback = typeof callback === 'function' ? callback : () => {
            new Error('addBlur 参数异常')
        }
    }

    addDragging(callback) {
        this.draggingCallback = typeof callback === 'function' ? callback : () => {
            new Error('addBlur 参数异常')
        }
    }

    addResizeStop(callback) {
        this.resizeStopCallback = typeof callback === 'function' ? callback : () => {
            new Error('addResizeStop 参数异常')
        }
    }

    addDragStop(callback) {
        this.dragStopCallback = typeof callback === 'function' ? callback : () => {
            new Error('addDragStop 参数异常')
        }
    }

    deepCopy(data, hash = new WeakMap()) {
        if (typeof data !== 'object' || data === null) {
            throw new TypeError('传入参数不是对象')
        }
        if (hash.has(data)) {
            return hash.get(data)
        }
        let newData = {};
        const dataKeys = Object.keys(data);
        dataKeys.forEach(value => {
            const currentDataValue = data[value];
            if (typeof currentDataValue !== "object" || currentDataValue === null) {
                newData[value] = currentDataValue;
            } else if (Array.isArray(currentDataValue)) {
                newData[value] = [...currentDataValue];
            } else if (currentDataValue instanceof Set) {
                newData[value] = new Set([...currentDataValue]);
            } else if (currentDataValue instanceof Map) {
                newData[value] = new Map([...currentDataValue]);
            } else {
                hash.set(data, data)
                newData[value] = this.deepCopy(currentDataValue, hash);
            }
        });
        return newData;
    }

    load(template) {
        this.attribute = this.deepCopy(template)
        this.talk = template.talk()
    }

    resize({
               width,
               height
           }) {
        this.attribute.size.width = width
        this.attribute.size.height = height
    }

    toFocus() {
        this.focus = true
    }

    getRenderComponent() {
        return this.attribute.renderInstanceBy
    }

    blur() {
        this.focus = false
    }

    setZIndex(z) {
        this.attribute.zIndex = z
    }

    drag({
             x,
             y
         }) {
        this.attribute.position.x = x
        this.attribute.position.y = y
    }

    hide() {
        this.visisble = false
    }

    show() {
        this.visisble = true
    }
}

class Template {
    constructor(tag) {
        this.tag = tag
        this.renderPoint = NaN
        this.nodes = []
        this.promiseNodes = []
        this.renderOverCallback = undefined
    }


    frameOfReference({
                         x,
                         y
                     }) {
        this.position = {
            x,
            y
        }
        return this
    }

    size({
             height,
             width
         }) {
        this.size = {
            height,
            width
        }
        return this
    }

    priority(zIndex) {
        this.zIndex = zIndex
        return this
    }

    minSize({
                minHeight,
                minWidth
            }) {
        this.minSize = {
            minHeight,
            minWidth
        }
        return this
    }

    popup(menu) {
        this.popup = menu
        return this
    }

    renderBy(instance) {
        this.renderInstanceBy = instance
        return this
    }

    copyBy(instance) {
        this.copyInstanceBy = instance
        return this
    }

    dragBy(instance) {
        this.dragInstanceBy = instance
        return this
    }

    getNodes() {
        return this.nodes
    }

    wrapNodes(node) {
        return function () {
            return new Promise(resolve => {
                console.log('po,')
                node.show()
                resolve(node)
            })
        }
    }

    talk() {
        const that = this
        return function () {
            that.runQueue()
        }
    }

    pushQueue(node) {
        console.log(node)
        this.promiseNodes.push({
            promise: this.wrapNodes(node)
        })
    }

    queueRenderOver(callback) {
        typeof callback === "function" && (this.renderOverCallback = callback)
    }

    runQueue() {
        if (this.promiseNodes && this.promiseNodes.length) {
            console.log(this.promiseNodes, 'ps')
            const first = this.promiseNodes.splice(1, this.promiseNodes.length)[0]
            this.promiseNodes.unshift()
            console.log(first, 'dd')
            first ? first.promise() : (this.renderOverCallback && this.renderOverCallback.call(this, this))
        }
    }

    getQueue() {
        return this.promiseNodes
    }

    copy() {
        const nodesLength = this.nodes.length + 1
        const tag = nodesLength
        const node = new Node(tag, this)
        this.nodes.push(node)
        this.pushQueue(node)
        return new Promise(resolve => {
            for (let i = 0; i < nodesLength; i++) {
                if (this.nodes[i].id === tag) {
                    resolve(this.nodes[i])
                    break
                }
            }
        })
    }
}

export class Compiler {
    constructor(config) {
        this.templates = []
        this.compiler(config)
    }

    getTemplates() {
        return this.templates
    }

    compiler(config) {
        const {
            scene
        } = config
        this.templates = scene.map((i, k) => {
            return new Template(k)
                .frameOfReference({
                    x: 0,
                    y: 0
                })
                .size({
                    height: 0,
                    width: 0
                })
                .priority(0)
                .minSize({
                    minHeight: 0,
                    minWidth: 0
                })
                .popup(i.menu)
                .renderBy(i.renderInstance)
                .dragBy(i.dragInstance)
                .copyBy(i.copyInstance)
        })
    }
}

export const templates = new Compiler(_config).getTemplates()