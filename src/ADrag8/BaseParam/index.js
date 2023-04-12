/**
 * 基础属性
 * 在其内部所有属性更改时触发回调subscription
 *
 * const BP = new BaseParam()
 * //订阅
 * BP.subscription(item=>{
 *     console.log(item)
 * })
 * //触发
 * BP.updatePosition(XX)
 * BP.updateSize(XX)
 * BP.updateFocus()
 *
 */
import Tools from '../Tools'
import {DEFAULT_DEEP, DRAG_STATE, MAX_DEEP, RESIZE_STATE} from "@/ADrag8/Config/CONSTANT";
import EventCallback from "@/ADrag8/Event/eventCallback";
import {createDom} from "@/ADrag8/View";

export default class BaseParam {
    constructor() {
        this._callback = null
        this.$Position = {
            $X: 0,
            $Y: 0
        }
        this.$Size = {
            $Width: 0,
            $Height: 0
        }
        this.$DOM = null
        this.$Vertex = null
        this.$Deep = DEFAULT_DEEP
        this.$Focus = false
        this.$Draggable = true
        this.$CurrentOperationState = DRAG_STATE   //当前块的操作状态   有移动 drag 与 缩放 resize
        this.$Event = new EventCallback()
    }

    deepAddition() {
        if (this.$Deep >= MAX_DEEP) {
            this.$Deep = MAX_DEEP
        } else {
            this.$Deep++
        }
    }

    setDOM(DOM) {
        this.$DOM = DOM
    }

    insertDom(DOM) {
        if (DOM instanceof HTMLElement) {
            const container = createDom('container', this.$DOM)
            container.style.width = '100%'
            container.style.height = '100%'
            container.style.overflow = 'hidden'
            this.$DOM.append(container)
            container.append(DOM)
        }
    }

    setVertex(vertexDom) {
        this.$Vertex = vertexDom
    }

    deepLower() {
        this.$Deep--
    }

    updateCOS(state) {
        if ([DRAG_STATE, RESIZE_STATE].includes(state)) {
            this.$CurrentOperationState = state
        }
    }

    updateSize({width, height, alone = false}) {
        try {
            //console.log(width, height, 'updateSize')
            if (Tools.listEachTruthIncludesZero([width, height]) || alone) {
                this.$Size = {
                    $Width: width || this.$Size.$Width,
                    $Height: height || this.$Size.$Height
                }
            }
        } catch (e) {
            console.log(e, 'resizing ERROR')
        }
    }

    updateDraggable(status) {
        this.$Draggable = !!status
    }

    updateFocus(newStatus) {
        this.$Focus = !!newStatus
        if (this.$Vertex) {
            this.$Vertex.map(i => {
                i.style.display = this.$Focus ? 'block' : 'none'
            })
        }
    }

    updatePosition({x, y, alone = false}) {
        try {
            if (Tools.listEachTruthIncludesZero([x, y]) || alone) {
                // console.log(x, y, 'updatePosition')
                this.$Position = {
                    $X: x || this.$Position.$X,
                    $Y: y || this.$Position.$Y
                }
            }
        } catch (e) {
            console.log(e, 'updatePosition ERROR')
        }
    }

    subscription(callback) {
        if (typeof callback === 'function') {
            this._callback = callback
        }
    }

    /**
     * 回调
     * @param type 回调事件名称
     */
    trigger(type) {
        if (typeof this._callback === 'function') {
            const params = {
                size: this.$Size,
                position: this.$Position,
                focus: this.$Focus,
                _type: type
            }
            this._callback(params)
        }
    }
}
