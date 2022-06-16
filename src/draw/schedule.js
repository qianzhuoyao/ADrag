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

    //节点添加点击事件
    addClick(callback) {
        this.clickCallback = typeof callback === 'function' ? callback : () => {
            new Error('addClick 参数异常')
        }
    }

    //渲染完毕继续渲染
    waitOver() {
        console.log('waitOver')
        typeof this.talk === 'function' && this.talk()
    }

    //节点添加鼠标按下事件
    addMouseDown(callback) {
        this.mouseDownCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseDown 参数异常')
        }
    }

    //节点添加resizeing事件
    addResizing(callback) {
        this.resizingCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseUp 参数异常')
        }
    }

    //节点添加鼠标放起事件
    addMouseUp(callback) {
        this.mouseUpCallback = typeof callback === 'function' ? callback : () => {
            new Error('addMouseUp 参数异常')
        }
    }

    //鼠标添加聚焦事件
    addFocus(callback) {
        this.focusCallback = typeof callback === 'function' ? callback : () => {
            new Error('addFocus 参数异常')
        }
    }

    //鼠标添加失焦事件
    addBlur(callback) {
        this.blurCallback = typeof callback === 'function' ? callback : () => {
            new Error('addBlur 参数异常')
        }
    }

    //节点添加拖拽事件
    addDragging(callback) {
        this.draggingCallback = typeof callback === 'function' ? callback : () => {
            new Error('addBlur 参数异常')
        }
    }

//节点添加更改大小结束事件
    addResizeStop(callback) {
        this.resizeStopCallback = typeof callback === 'function' ? callback : () => {
            new Error('addResizeStop 参数异常')
        }
    }

//节点添加拖拽结束事件
    addDragStop(callback) {
        this.dragStopCallback = typeof callback === 'function' ? callback : () => {
            new Error('addDragStop 参数异常')
        }
    }

//深拷贝
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

//初始加载来自模板的信息与获取通知继续信号
    load(template) {
        this.attribute = this.deepCopy(template)
        this.talk = template.talk()
    }

//更改节点大小
    resize({
               width,
               height
           }) {
        this.attribute.size.width = width
        this.attribute.size.height = height
    }

//设置节点被聚焦
    toFocus() {
        this.focus = true
    }

//设置节点被失焦
    blur() {
        this.focus = false
    }

//设置优先级
    setZIndex(z) {
        this.attribute.zIndex = z
    }

//设置节点坐标
    drag({
             x,
             y
         }) {
        this.attribute.position.x = x
        this.attribute.position.y = y
    }

//节点隐藏
    hide() {
        this.visisble = false
    }

//节点显示
    show() {
        this.visisble = true
    }
}

/**
 * 模板
 */
class Template {
    constructor(tag) {
        this.tag = tag
        this.renderPoint = NaN
        this.nodes = []
        this.promiseNodes = []
        this.renderOverCallback = undefined
    }

//模板位置
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

//模板大小
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

//模板优先级
    priority(zIndex) {
        this.zIndex = zIndex
        return this
    }

//模板最小尺寸
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

//模板弹窗
    popup(menu) {
        this.popup = menu
        return this
    }

//模板渲染组件
    renderBy(instance) {
        this.renderInstanceBy = instance
        return this
    }

//模板源头组件
    copyBy(instance) {
        this.copyInstanceBy = instance
        return this
    }

//模板拖拽组件
    dragBy(instance) {
        this.dragInstanceBy = instance
        return this
    }

//获取模板生产的节点
    getNodes() {
        return this.nodes
    }

//包装节点生产promise
    wrapNodes(node) {
        return function () {
            return new Promise(resolve => {
                node.show()
                resolve(node)
            })
        }
    }

//通知队列渲染
    talk() {
        const that = this
        return function () {
            that.runQueue()
        }
    }

//压入渲染队列
    pushQueue(node) {
        console.log(node)
        this.promiseNodes.push({
            promise: this.wrapNodes(node)
        })
    }

//队列渲染完毕回调
    queueRenderOver(callback) {
        typeof callback === "function" && (this.renderOverCallback = callback)
    }

//执行队列(promise)0->1->2
    runQueue() {
        if (this.promiseNodes && this.promiseNodes.length) {
            this.promiseNodes.shift()
            const first = this.promiseNodes[0]
            console.log(first,this.promiseNodes)
            first ? first.promise() : (this.renderOverCallback && this.renderOverCallback.call(this, this))
        }
    }

//获取队列
    getQueue() {
        return this.promiseNodes
    }

//从模板复制出节点，生成节点的方式，是异步的
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

/**
 * 解析
 */
export class Compiler {
    constructor(config) {
        this.templates = []
        this.compiler(config)
    }

    getTemplates() {
        return this.templates
    }

//解析config文件为模板列表
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