import {createDom, syncVertexPosition, vertex} from "@/ADrag8/View";
import {additionDragEvent, clogDefaultDrag, createMouseClick, createMouseDown} from "@/ADrag8/Event/operation";
import {computeOffset} from "@/ADrag8/Tools/compute";
import {DRAG_STATE, POSITION_MAP, RESIZE_STATE} from "@/ADrag8/Config/CONSTANT";
import {Fragment} from "@/ADrag8";
import {UpdateQueue} from "@/ADrag8/Emitter/updateQueue";

/**
 * 渲染block
 * 并在其中混入事件
 */
export default class Render extends UpdateQueue {
    constructor() {
        super()
        this._createdDom = []
        this._block = null
        this.renderedIds = []
    }


    /**
     * 限制范围
     * @param event 鼠标
     * @param base Fragment
     * @param position 位置
     * @param tip 按下时的位置记录
     * todo:边界检测不存在时的操作
     * */
    restrictedRange(event, base, position, tip) {
        if (base instanceof Fragment) {
            //限制操作在container内生效
            const {
                outBoundBottom,
                outBoundTop,
                outBoundRight,
                outBoundLeft,
                left, top, right, bottom
            } = base.$Container.calculateDynamicBound({
                x: event.pageX,
                y: event.pageY,
                width: 0,
                height: 0,
                base
            })
            const initTipX = tip.$X + tip.$Width
            const initTipY = tip.$Y + tip.$Height
            const rightX = base.$Size.$Width + base.$Position.$X
            const bottomY = base.$Size.$Height + base.$Position.$Y
            if (position === POSITION_MAP.e) {

                base.updateSize({
                    width: outBoundLeft ? (rightX - left) : (tip.$X + tip.$Width - event.pageX),
                    alone: true
                })
                base.updatePosition({
                    x: (outBoundLeft || event.pageX >= rightX) ? (outBoundLeft ? left : (event.pageX >= rightX ? initTipX : event.pageX)) : event.pageX,
                    alone: true
                })
            } else if (position === POSITION_MAP.f) {
                base.updateSize({
                    width: outBoundRight ? (right - base.$Position.$X) : (event.pageX - tip.$X),
                    alone: true
                })
            } else if (position === POSITION_MAP.b) {
                base.updateSize({
                    height: outBoundTop ? (bottomY - top) : (tip.$Y + tip.$Height - event.pageY),
                    alone: true
                })
                base.updatePosition({
                    y: (outBoundTop || event.pageY >= initTipY) ? (outBoundTop ? top : (event.pageY >= initTipY ? initTipY : event.pageY)) : event.pageY,
                    alone: true
                })
            } else if (position === POSITION_MAP.h) {
                base.updateSize({
                    height: outBoundBottom ? (bottom - base.$Position.$Y) : (event.pageY - tip.$Y),
                    alone: true
                })
            } else if (position === POSITION_MAP.a) {
                base.updateSize({
                    width: outBoundLeft ? (rightX - left) : (tip.$X + tip.$Width - event.pageX),
                    height: outBoundTop ? (bottomY - top) : (tip.$Y + tip.$Height - event.pageY),
                })
                base.updatePosition({
                    x: (outBoundLeft || event.pageX >= rightX) ? (outBoundLeft ? left : (event.pageX >= rightX ? initTipX : event.pageX)) : event.pageX,
                    y: (outBoundTop || event.pageY >= initTipY) ? (outBoundTop ? top : (event.pageY >= initTipY ? initTipY : event.pageY)) : event.pageY,
                })
            } else if (position === POSITION_MAP.c) {
                base.updateSize({
                    width: outBoundRight ? (right - base.$Position.$X) : (event.pageX - tip.$X),
                    height: outBoundTop ? (bottomY - top) : (tip.$Y + tip.$Height - event.pageY),
                })
                base.updatePosition({
                    y: (outBoundTop || event.pageY >= initTipY) ? (outBoundTop ? top : (event.pageY >= initTipY ? initTipY : event.pageY)) : event.pageY,
                    alone: true
                })
            } else if (position === POSITION_MAP.i) {
                base.updateSize({
                    width: outBoundRight ? (right - base.$Position.$X) : (event.pageX - tip.$X),
                    height: outBoundBottom ? (bottom - base.$Position.$Y) : (event.pageY - tip.$Y),
                })
            } else if (position === POSITION_MAP.g) {
                base.updateSize({
                    width: outBoundLeft ? (rightX - left) : (tip.$X + tip.$Width - event.pageX),
                    height: outBoundBottom ? (bottom - base.$Position.$Y) : (event.pageY - tip.$Y),
                })
                base.updatePosition({
                    x: (outBoundLeft || event.pageX >= rightX) ? (outBoundLeft ? left : (event.pageX >= rightX ? initTipX : event.pageX)) : event.pageX,
                    alone: true
                })
            }

        }
    }


    checkBound(block) {
        if (block instanceof Fragment) {
            if (block.$Container.blockInContainer(block)._in) {
                block.display()
            } else {
                block.hidden()
            }
        }
    }

    /**
     * 加载
     * @param blocks
     * @param _render 渲染器 ，因为渲染器种类不唯一
     */
    load({blocks}, _render) {
        console.log(blocks, _render, 'blocks')
        if (blocks) {
            Object.values(blocks).map(i => {
                this.runCycleMounted(i.block)
                i.block.rendered(_render)
                let offsetX = 0, offsetY = 0, VertexDOMs = [], targetVertex = null;
                const DOM = this.paint(i.block)
                //同步到Fragment.$BaseObserver的$DOM
                i.block.setDOM(DOM)
                VertexDOMs = vertex(DOM, i.block.$Id)//计算顶点
                //同步到Fragment.$BaseObserver的顶点
                i.block.setVertex(VertexDOMs)
                //判断元素是否在容器内再决定其是否可以渲染
                this.checkBound(i.block)
                //开启事件订阅
                additionDragEvent(DOM, {
                    //按下事件订阅回调
                    down: params => {
                        if (params.button === 0) {
                            i.block.updateFocus(true)
                            i.block.$DOM.style.cursor = "grab"
                        }
                        //避免重读渲染block
                        if (!this.renderedIds.includes(i.block.$Id)) {
                            //顶点操作，用来区分拖拽与尺寸更改
                            VertexDOMs.map(item => {
                                //展示顶点
                                //区分事件拖拽与缩放
                                createMouseDown(item, () => {
                                    i.block.updateCOS(RESIZE_STATE)
                                    targetVertex = item
                                    i.block.$Event.RESIZE_START.map(eventItem => {
                                        eventItem()
                                    })
                                })
                                createMouseDown(DOM, () => {
                                    i.block.updateCOS(DRAG_STATE)
                                    this._block = {
                                        ...i.block.$Position,
                                        ...i.block.$Size
                                    }
                                    i.block.$Event.DRAG_START.map(eventItem => {
                                        eventItem()
                                    })
                                }, true)

                            })
                            createMouseClick(DOM, () => {
                                i.block.updateFocus(true)
                                i.block.$Event.CLICK.map(eventItem => {
                                    eventItem()
                                })
                            })
                            this.renderedIds.push(i.block.$Id)
                        }
                        //组织默认select事件
                        clogDefaultDrag()
                        //i.block.startDraggingSubscription(params)
                        const offset = computeOffset(DOM, params)
                        if (offset) {
                            offsetX = offset.offsetX
                            offsetY = offset.offsetY
                        }
                    },
                    //移动事件订阅回调
                    move: params => {
                        console.log(params, 'moveparams')
                        //按键判断
                        if (params.event.buttons !== 1) {
                            return
                        }
                        /**
                         * 边界判断 bound check
                         */
                        const {outBoundLeft, outBoundRight, outBoundBottom, outBoundTop, left, top, right, bottom,} =
                            i.block.$Container.calculateDynamicBound({
                                x: params.x - offsetX,
                                y: params.y - offsetY,
                                width: i.block.$Size.$Width,
                                height: i.block.$Size.$Height,
                                base: i.block,
                            })
                        if (i.block.$CurrentOperationState === DRAG_STATE) {
                            if (i.block.$Container.bound()) {
                                i.block.updatePosition({
                                    x: (outBoundLeft || outBoundRight) ? (outBoundLeft ? left : (outBoundRight ? (right - i.block.$Size.$Width) : i.block.$Position.$X)) : (params.x - offsetX),
                                    y: (outBoundBottom || outBoundTop) ? (outBoundTop ? top : (outBoundBottom ? (bottom - i.block.$Size.$Height) : i.block.$Position.$Y)) : (params.y - offsetY)
                                })
                            } else {
                                i.block.updatePosition({
                                    x: (params.x - offsetX),
                                    y: (params.y - offsetY)
                                })
                            }
                            //拖拽事件回调执行
                            i.block.$Event.DRAGGING.map(eventItem => {
                                eventItem()
                            })
                            // i.block.dragMoving(params)
                        } else if (i.block.$CurrentOperationState === RESIZE_STATE) {
                            const targetPosition = targetVertex.dataset.position
                            //此时同步尺寸与数据
                            this.restrictedRange(params.event, i.block, targetPosition, this._block)

                            //同步顶点的位置
                            VertexDOMs.map((item, key) => {
                                syncVertexPosition(DOM, item, key)
                            })
                            //尺寸更改事件回调执行
                            i.block.$Event.RESIZING.map(eventItem => {
                                eventItem()
                            })
                            // i.block.resizing(params)
                        }
                        this.paint(i.block)
                    },
                    //此时禁止按下事件
                    moveSuspend: () => i.block.$Draggable,
                    //鼠标抬起订阅回调
                    over: () => {
                        //鼠标放起，流程结束,触发结束事件
                        i.block.$DOM.style.cursor = ""
                        i.block.$Event.DRAG_FINISH.map(eventItem => {
                            eventItem()
                        })
                    }
                })
            })
        }
    }

    runCycleUpdated(block) {
        console.log(block, 'd')
        block.$Cycle.UPDATED.map(eventItem => {
            eventItem()
        })
    }

    runCycleMounted(block) {
        block.$Cycle.MOUNTED.map(eventItem => {
            eventItem()
        })
    }

    //状态更改得重新paint,不然可能draggable不生效 绘制
    paint(block) {
        //若block已经被渲染，怎不在创建，在原先dom上操作
        let DOM
        if (!this._createdDom.includes(block.$Id)) {
            DOM = createDom(block.$Id)
            this._createdDom.push(block.$Id)
        } else {
            DOM = document.getElementById(block.$Id)
        }
        DOM.style.position = 'absolute'
        DOM.style.left = block.$Position.$X + 'px'
        DOM.style.top = block.$Position.$Y + 'px'
        DOM.style.width = block.$Size.$Width + 'px'
        DOM.style.height = block.$Size.$Height + 'px'
        DOM.style.zIndex = `${block.$Deep}`
        this.runCycleUpdated(block)
        return DOM
    }
}
