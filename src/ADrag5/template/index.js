import {PipeEvent} from "../helper/index";

export default class Template {
    constructor({_key, _originId, _moverId, _providerId}) {
        //mixture
        this._key = _key
        this._originId = _originId
        this._moverId = _moverId
        this._providerId = _providerId
        this.globalEvent = {}
    }

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

    makeProvider(arg) {
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
