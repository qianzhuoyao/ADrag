import Node from "@/draw/node";

/**
 * 模板
 */
export default class Template {
    constructor(tag) {
        this.tag = tag
        this.renderPoint = NaN
        this.nodes = []
        this.renderNodesQueue = []
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
        this.renderNodesQueue.push({
            promise: this.wrapNodes(node)
        })
    }

//队列渲染完毕回调
    queueRenderOver(callback) {
        typeof callback === "function" && (this.renderOverCallback = callback)
    }

//执行队列(promise)0->1->2
    runQueue() {
        if (this.renderNodesQueue && this.renderNodesQueue.length) {
            this.renderNodesQueue.shift()
            const first = this.renderNodesQueue[0]
            console.log(first, this.renderNodesQueue)
            first ? first.promise() : (this.renderOverCallback && this.renderOverCallback.call(this, this))
        }
    }


//从模板复制出节点，生成节点的方式，是异步的
    copy(wait = true) {
        const nodesLength = this.nodes.length + 1
        const tag = nodesLength
        const node = new Node(tag, this)
        wait && this.pushQueue(node)
        return new Promise(resolve => {
            this.nodes.push(node)
            for (let i = 0; i < nodesLength; i++) {
                if (this.nodes[i].id === tag) {
                    resolve(this.nodes[i])
                    break
                }
            }
        })
    }
}