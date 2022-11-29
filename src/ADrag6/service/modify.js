import {concatAll, fromEvent, takeUntil, withLatestFrom} from "rxjs";
import {map} from "rxjs/operators";

const HIDDEN = 'none'
const DISPLAY = 'block'
const ABSOLUTE = "absolute"
const zIndex = "99999"
const defineMover = () => {
    return fromEvent(document, "mousemove")
}
const defineUpper = () => {
    return fromEvent(document, "mouseup")
}
export const buildEvent = ({
                               downCallback,
                               moveCallback,
                               overCallback,
                               offsetXOfMoving,
                               offsetYOfMoving
                           }) => {
    clogDefaultDrag()
    return (DOM, pretenderDOM) =>
        modify(
            DOM,
            pretenderDOM,
            offsetXOfMoving,
            offsetYOfMoving,
            downCallback,
            moveCallback,
            overCallback)
}

/**
 *
 * @param DOM
 * @param pretenderDOM
 * @param offsetXOfMoving
 * @param offsetYOfMoving
 * @param downCallback
 * @param moveCallback
 * @param overCallback
 */
const modify = (
    DOM,
    pretenderDOM,
    offsetXOfMoving,
    offsetYOfMoving,
    downCallback,
    moveCallback,
    overCallback) => {
    if (DOM instanceof HTMLElement && pretenderDOM instanceof HTMLElement) {
        //默认隐藏pretenderDOM'
        pretenderDOM.style.position = ABSOLUTE
        pretenderDOM.style.display = HIDDEN
        pretenderDOM.style.zIndex = zIndex
        additionDragEvent(DOM, {
            down: (downEventParam) => {
                typeof downCallback === 'function' && downCallback(downEventParam)
                pretenderDOM.style.display = HIDDEN
            },
            move: (moveEventParam) => {
                typeof moveCallback === 'function' && moveCallback(moveEventParam)
                pretenderDOM.style.display = DISPLAY
                pretenderDOM.style.top = moveEventParam.y - offsetYOfMoving + 'px'
                pretenderDOM.style.left = moveEventParam.x - offsetXOfMoving + 'px'
            },
            over: (upEventParam) => {
                typeof overCallback === 'function' && overCallback(upEventParam)
                pretenderDOM.style.display = HIDDEN
            }
        })
    } else {
        throw new Error('类型不正确,无法找到元素')
    }
}

export const additionDragEvent = (DOM, {down, move, over}) => {
    if (DOM instanceof HTMLElement) {
        const origin = fromEvent(DOM, "mousedown")
        origin.pipe(
            map((downEventParam) => {
                typeof down === 'function' && down(downEventParam)
                return defineMover().pipe(
                    takeUntil(
                        defineUpper().pipe(
                            map(upEventParam => {
                                typeof over === 'function' && over(upEventParam)
                            })
                        )
                    )
                )
            }),
            concatAll(),
            withLatestFrom(origin, (move) => {
                const {pageX: mx, pageY: my} = move;
                return {
                    x: mx,
                    y: my,
                };
            })
        )
            .subscribe(moveEventParam => {
                typeof move === 'function' && move(moveEventParam)
            })
    }
}

const clogDefaultDrag = () => {
    document.onselectstart = (ev) => ev.preventDefault();
    document.ondragstart = () => false;
}
