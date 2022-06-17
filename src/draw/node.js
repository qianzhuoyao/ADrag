import Immutable from 'immutable'

export default class Node {
    constructor(id, template) {
        this.id = id
        this.focus = false
        this.visisble = true
        //attribute属性不可配置，只能编辑
        this.attribute = {}
        this.renderData = {}
        this.load(template)
    }

    //数据应该绑定在renderData内
    updateRenderData(data) {
        this.renderData = data
    }

    getRenderData() {
        return this.renderData
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


//初始加载来自模板的信息与获取通知继续信号
    load(template) {
        console.log(template, 're')
        this.attribute = Immutable.Map(template)
        this.talk = template.talk()
    }

//更改节点大小
    resize({
               width,
               height
           }) {
        this.attribute = this.attribute.set('size', {
            width,
            height
        })
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
        this.attribute = this.attribute.set('zIndex', z)
    }

//设置节点坐标
    drag({
             x,
             y
         }) {
        this.attribute = this.attribute.set('position', {
            x,
            y
        })
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