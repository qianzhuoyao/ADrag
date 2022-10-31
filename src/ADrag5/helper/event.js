import {concatAll, fromEvent, takeUntil, withLatestFrom} from "rxjs";
import {map} from "rxjs/operators";

const dragIndex = "99999";
const _STYLE = {
    _DISPLAY: {
        _BLOCK: "block",
        _NONE: "none",
    },
    _POSITION: {
        _ABSOLUTE: "absolute",
        _UNSET: "unset",
    },
};

const setAbsolute = (dom) => {
    if (dom) {
        dom.style.position = _STYLE._POSITION._ABSOLUTE;
    }
};

const isShow = (dom) => {
    return dom.style.display === _STYLE._DISPLAY._BLOCK;
};

const domShow = (dom) => {
    if (dom) {
        dom.style.display = _STYLE._DISPLAY._BLOCK;
    }
};

const domHide = (dom) => {
    if (dom) {
        dom.style.display = _STYLE._DISPLAY._NONE;
    }
};

const domPosition = ({dom, x, y}) => {
    if (dom) {
        dom.style.left = typeof x === "number" ? x + "px" : x;
        dom.style.top = typeof y === "number" ? y + "px" : y;
    }
};

export default class PipeEvent {
    constructor() {
        this.init();
        this.registryEvent();
        this.obstructDefaultEvent();
    }

    obstructDefaultEvent() {
        document.onselectstart = (i) => i.preventDefault();
        document.ondragstart = () => false;
    }

    init() {
        this.copyElement = undefined;
        this.dragElement = undefined;
        this.mouseUpObservable = null;
        this.mouseMoveObservable = null;
        this.mouseDownObservable = null;
    }

    getDom(id) {
        return document.getElementById(id);
    }

    setCopyElement(id) {
        this.copyElement = this.getDom(id);
        return this;
    }

    setDragElement(id) {
        this.dragElement = this.getDom(id);
        if (this.dragElement) {
            this.dragElement.style.zIndex = dragIndex;
        }
        return this;
    }

    dragElementPosition({x, y}) {
        domPosition({
            dom: this.dragElement,
            x,
            y,
        });
    }

    setOffsetDrag({x, y}) {
        this.offset = {
            x,
            y,
        };
        return this;
    }

    dragElementAbsolute() {
        setAbsolute(this.dragElement);
        return this;
    }

    copyElementHide() {
        domHide(this.copyElement);
        return this;
    }

    copyElementShow() {
        isShow(this.copyElement) || domShow(this.copyElement);
        return this;
    }

    dragElementHide() {
        domHide(this.dragElement);
        return this;
    }

    dragElementShow() {
        isShow(this.dragElement) || domShow(this.dragElement);
        return this;
    }

    registryEvent() {
        this.mouseUpObservable = fromEvent(document, "mouseup");
        this.mouseMoveObservable = fromEvent(document, "mousemove");
    }

    pipeEventStart({downCallback, moveCallback, overCallback}) {
        if (this.copyElement) {
            this.mouseDownObservable = fromEvent(this.copyElement, "mousedown");
            this.mouseDownObservable
                .pipe(
                    map((e) => {
                        if (typeof downCallback === "function") {
                            downCallback.call(this, this,e);
                        }
                        return this.mouseMoveObservable.pipe(
                            takeUntil(
                                this.mouseUpObservable.pipe(
                                    map((e) => {
                                        if (typeof overCallback === "function") {
                                            overCallback.call(this, this, e);
                                        }
                                    })
                                )
                            )
                        );
                    }),
                    concatAll(),
                    withLatestFrom(this.mouseDownObservable, (move) => {
                        const {pageX: mx, pageY: my} = move;
                        //const {pageX:dx, pageX:dy} = down
                        return {
                            //偏移量TODO
                            x: mx,
                            y: my,
                            move,
                        };
                    })
                )
                .subscribe((result) => {
                    this.dragElementAbsolute();
                    if (this.dragElement) {
                        this.dragElementPosition({
                            x: !this.offset ? result.x : result.x + (this.offset.x || 0),
                            y: !this.offset ? result.y : result.y + (this.offset.y || 0),
                        });
                        if (typeof moveCallback === "function") {
                            moveCallback.call(this, this, result);
                        }
                    } else {
                        throw new Error("dragElement 不存在");
                    }
                });
        } else {
            throw new Error("copyElement 不存在");
        }
    }
}
