import {createDom, syncVertexPosition, vertex} from "@/ADrag8/View";
import {additionDragEvent, clogDefaultDrag, createMouseClick, createMouseDown} from "@/ADrag8/Event/operation";
import {takeWhile} from "rxjs";
import {computeOffset} from "@/ADrag8/Tools/compute";
import {DRAG_STATE, POSITION_MAP, RESIZE_STATE} from "@/ADrag8/Config/CONSTANT";
import {Fragment} from "@/ADrag8";

/**
 * 渲染block
 * 并在其中混入事件
 */
export default class Render {
    constructor() {
        this._createdDom = []
        this._block = null
        this.renderedIds = []
    }


    /**
     * 同步与限制操作与数据
     * @param event 鼠标
     * @param base Fragment
     * @param position 位置
     * @param tip 按下时的位置记录
     * */
    sync(event, base, position, tip) {
        if (base instanceof Fragment) {
            //限制操作在container内生效
            const {
                outBoundBottom,
                outBoundTop,
                outBoundRight,
                outBoundLeft
            } = base.$Container.calculateDynamicBound({
                x: event.pageX,
                y: event.pageY,
                width: 0,
                height: 0
            })
            if (position === POSITION_MAP.e) {
                base.updateSize({
                    width: outBoundLeft ? base.$Size.$Width : tip.$X + tip.$Width - event.pageX,
                    alone: true
                })
                base.updatePosition({
                    x: outBoundLeft ? base.$Position.$X : event.pageX,
                    alone: true
                })
            } else if (position === POSITION_MAP.f) {
                base.updateSize({
                    width: outBoundRight ? base.$Size.$Width : event.pageX - tip.$X,
                    alone: true
                })
            } else if (position === POSITION_MAP.b) {
                base.updateSize({
                    height: outBoundTop ? base.$Size.$Height : tip.$Y + tip.$Height - event.pageY,
                    alone: true
                })
                base.updatePosition({
                    y: outBoundTop ? base.$Position.$Y : event.pageY,
                    alone: true
                })
            } else if (position === POSITION_MAP.h) {
                base.updateSize({
                    height: outBoundBottom ? base.$Size.$Height : event.pageY - tip.$Y,
                    alone: true
                })
            } else if (position === POSITION_MAP.a) {
                base.updateSize({
                    width: outBoundLeft ? base.$Size.$Width : tip.$X + tip.$Width - event.pageX,
                    height: outBoundTop ? base.$Size.$Height : tip.$Y + tip.$Height - event.pageY,
                })
                base.updatePosition({
                    x: outBoundLeft ? base.$Position.$X : event.pageX,
                    y: outBoundTop ? base.$Position.$Y : event.pageY,
                })
            } else if (position === POSITION_MAP.c) {
                base.updateSize({
                    width: outBoundRight ? base.$Size.$Width : event.pageX - tip.$X,
                    height: outBoundTop ? base.$Size.$Height : tip.$Y + tip.$Height - event.pageY,
                })
                base.updatePosition({
                    y: outBoundTop ? base.$Position.$Y : event.pageY,
                    alone: true
                })
            } else if (position === POSITION_MAP.i) {
                base.updateSize({
                    width: outBoundRight ? base.$Size.$Width : event.pageX - tip.$X,
                    height: outBoundBottom ? base.$Size.$Height : event.pageY - tip.$Y,
                })
            } else if (position === POSITION_MAP.g) {
                base.updateSize({
                    width: outBoundLeft ? base.$Size.$Width : tip.$X + tip.$Width - event.pageX,
                    height: outBoundBottom ? base.$Size.$Height : event.pageY - tip.$Y,
                })
                base.updatePosition({
                    x: outBoundLeft ? base.$Position.$X : event.pageX,
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
     */
    load({blocks}) {
        console.log(blocks, 'blocks')
        if (blocks) {
            Object.values(blocks).map(i => {
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
                const observer = additionDragEvent(DOM, {
                    //按下事件订阅回调
                    down: params => {
                        //避免重读渲染block
                        if (!this.renderedIds.includes(i.block.$Id)) {
                            //顶点操作，用来区分拖拽与尺寸更改
                            VertexDOMs.map(item => {
                                //展示顶点
                                //区分事件拖拽与缩放
                                createMouseDown(item, () => {
                                    i.block.updateCOS(RESIZE_STATE)
                                    targetVertex = item
                                    i.block.$Event.$Event.RESIZE_START.map(eventItem => {
                                        eventItem()
                                    })
                                })
                                createMouseDown(DOM, () => {
                                    i.block.updateCOS(DRAG_STATE)
                                    this._block = {
                                        ...i.block.$Position,
                                        ...i.block.$Size
                                    }
                                    i.block.$Event.$Event.DRAG_START.map(eventItem => {
                                        eventItem()
                                    })
                                }, true)
                            })
                            createMouseClick(DOM, () => {
                                i.block.updateFocus(true)
                                i.block.$Event.$Event.CLICK.map(eventItem => {
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
                        /**
                         * 边界判断 bound check
                         */
                        const {
                            outBoundBottom,
                            outBoundTop,
                            outBoundRight,
                            outBoundLeft,
                        } = i.block.$Container.calculateDynamicBound({
                            x: params.x - offsetX,
                            y: params.y - offsetY,
                            width: i.block.$Size.$Width,
                            height: i.block.$Size.$Height
                        })
                        /**
                         * 限制拖动
                         */
                        if (i.block.$CurrentOperationState === DRAG_STATE) {
                            i.block.updatePosition({
                                x: (outBoundLeft || outBoundRight) ? i.block.$Position.$X : (params.x - offsetX),
                                y: (outBoundBottom || outBoundTop) ? i.block.$Position.$Y : (params.y - offsetY)
                            })
                            //拖拽事件回调执行
                            i.block.$Event.$Event.DRAGGING.map(eventItem => {
                                eventItem()
                            })
                            // i.block.dragMoving(params)
                        } else if (i.block.$CurrentOperationState === RESIZE_STATE) {
                            const targetPosition = targetVertex.dataset.position
                            //此时同步尺寸与数据
                            this.sync(params.event, i.block, targetPosition, this._block)
                            //同步顶点的位置
                            VertexDOMs.map((item, key) => {
                                syncVertexPosition(DOM, item, key)
                            })
                            //尺寸更改事件回调执行
                            i.block.$Event.$Event.RESIZING.map(eventItem => {
                                eventItem()
                            })
                            // i.block.resizing(params)
                        }
                        this.paint(i.block)
                    },
                    //鼠标抬起订阅回调
                    over: () => {
                        //鼠标放起，流程结束,触发结束事件
                        i.block.$Event.$Event.DRAG_FINISH.map(eventItem => {
                            eventItem()
                        })
                    }
                })
                if (observer) {
                    //此时禁止按下事件
                    observer.mover.pipe(
                        takeWhile(() => i.block.$Draggable)
                    )
                }
            })
        }
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
        return DOM
    }
}
