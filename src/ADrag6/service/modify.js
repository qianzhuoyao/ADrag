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
                               overCallback
                           }) => {
    clogDefaultDrag()
    return (DOM, pretenderDOM) =>
        modify(
            DOM,
            pretenderDOM,
            downCallback,
            moveCallback,
            overCallback)
}
/**
 *
 * @param DOM
 * @param pretenderDOM
 * @param downCallback
 * @param moveCallback
 * @param overCallback
 */
const modify = (
    DOM,
    pretenderDOM,
    downCallback,
    moveCallback,
    overCallback) => {
    if (DOM instanceof HTMLElement && pretenderDOM instanceof HTMLElement) {
        //默认隐藏pretenderDOM'
        pretenderDOM.style.position = ABSOLUTE
        pretenderDOM.style.display = HIDDEN
        pretenderDOM.style.zIndex = zIndex
        const origin = fromEvent(DOM, "mousedown")
        origin.pipe(
            map((downEventParam) => {
                typeof downCallback === 'function' && downCallback(downEventParam)
                return defineMover().pipe(
                    takeUntil(
                        defineUpper().pipe(
                            map(upEventParam => {
                                typeof overCallback === 'function' && overCallback(upEventParam)
                                pretenderDOM.style.display = HIDDEN
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
                typeof moveCallback === 'function' && moveCallback(moveEventParam)
                console.log(moveEventParam, ',m')
                pretenderDOM.style.display = DISPLAY
                pretenderDOM.style.top = moveEventParam.y + 'px'
                pretenderDOM.style.left = moveEventParam.x + 'px'
            })
    } else {
        throw new Error('类型不正确,无法找到元素')
    }
}

const clogDefaultDrag = () => {
    document.onselectstart = (ev) => ev.preventDefault();
    document.ondragstart = () => false;
}
