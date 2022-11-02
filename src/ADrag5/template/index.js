import {PipeEvent} from "../helper/index";

/**
 * pack mixture 与 fragment mixture 区别：
 * pack mixture 必须依附于 provider ，它直接可以移动
 * fragment mixture 会存在两层元素（origin，mover），origin表示静止组件，所有的移动都是在使用mover
 * 也只有mover可以作用在容器上。mover必须依附于provider，而origin则不需要
 * 相比较而言，如果你是操作面板编辑多于创建则pack mixture更合适
 * 反之 fragment mixture 更好用
 */
export default class Template {
    constructor({_key, _originId, _moverId, _providerId}) {
        //mixture
        this._key = _key
        this._originId = _originId
        this._moverId = _moverId
        this._providerId = _providerId
        this.globalEvent = {}
    }

    /**
     * 创建pack mixture
     * @param downCallback
     * @param moveCallback
     * @param overCallback
     */
    makePack({downCallback, moveCallback, overCallback}) {
        this._key && new PipeEvent()
            .setCopyElement(this._key)
            .setDragElement(this._key)
            .copyElementHide()
            .pipeEventStart({
                downCallback: (pipe, event) => {
                    typeof downCallback === 'function' && downCallback(pipe, event)
                },
                moveCallback: (pipe, event) => {
                    typeof moveCallback === 'function' && moveCallback(pipe, event)
                    typeof this.globalEvent.mixtureDrag === 'function' && this.globalEvent.mixtureDrag(event)
                },
                overCallback: (pipe, event) => {
                    typeof overCallback === 'function' && overCallback(pipe, event)
                }
            })
    }

    /**
     * 创建fragment mixture
     * @param downCallback
     * @param moveCallback
     * @param overCallback
     */
    makeFragment({downCallback, moveCallback, overCallback}) {
        this._originId && this._moverId && new PipeEvent()
            .setCopyElement(this._originId)
            .setDragElement(this._moverId)
            .dragElementHide()
            .pipeEventStart({
                downCallback: (pipe, event) => {
                    typeof downCallback === 'function' && downCallback(pipe, event)
                },
                moveCallback: (pipe, event) => {
                    pipe.dragElementShow();
                    typeof moveCallback === 'function' && moveCallback(pipe, event)
                    typeof this.globalEvent.mixtureDrag === 'function' && this.globalEvent.mixtureDrag(event)
                },
                overCallback: (pipe, event) => {
                    pipe.dragElementHide();
                    typeof overCallback === 'function' && overCallback(pipe, event)
                }
            })
    }

    /**
     * 创建 容器
     * @param arg
     * @returns {HTMLElement}
     */
    makeProvider(arg) {
        if (arg) {
            const {click, mousemove, mouseover, mouseleave, mousedown, mouseup, mixtureDrag} = arg
            this.globalEvent.mixtureDrag = mixtureDrag
            const container = document.getElementById(this._providerId)
            if (container) {
                container.style.position = 'absolute'
                container.addEventListener('click', (event) => {
                    typeof click === 'function' && click(event)
                })
                container.addEventListener('mousedown', (event) => {
                    typeof mousedown === 'function' && mousedown(event)
                })
                container.addEventListener('mouseup', (event) => {
                    typeof mouseup === 'function' && mouseup(event)
                })
                container.addEventListener('mouseover', (event) => {
                    typeof mouseover === 'function' && mouseover(event)
                })
                container.addEventListener('mousemove', (event) => {
                    typeof mousemove === 'function' && mousemove(event)
                })
                container.addEventListener('mouseleave', (event) => {
                    typeof mouseleave === 'function' && mouseleave(event)
                })
            }
            return container
        }
    }
}
