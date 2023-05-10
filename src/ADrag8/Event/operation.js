import { concatAll, fromEvent, takeUntil, withLatestFrom } from "rxjs";
import { map } from "rxjs/operators";

const HIDDEN = "none";
const DISPLAY = "block";
const ABSOLUTE = "absolute";
const zIndex = "99999";
const defineMover = () => {
  return fromEvent(document, "mousemove");
};
const defineUpper = () => {
  return fromEvent(document, "mouseup");
};

export const buildEvent = ({
  downCallback,
  moveCallback,
  overCallback,
  offsetXOfMoving,
  offsetYOfMoving,
}) => {
  clogDefaultDrag();
  return (DOM, pretenderDOM) =>
    modify(
      DOM,
      pretenderDOM,
      offsetXOfMoving,
      offsetYOfMoving,
      downCallback,
      moveCallback,
      overCallback
    );
};

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
  overCallback
) => {
  if (DOM instanceof HTMLElement && pretenderDOM instanceof HTMLElement) {
    //默认隐藏pretenderDOM'
    pretenderDOM.style.position = ABSOLUTE;
    pretenderDOM.style.display = HIDDEN;
    pretenderDOM.style.zIndex = zIndex;
    additionDragEvent(DOM, {
      down: (downEventParam) => {
        typeof downCallback === "function" && downCallback(downEventParam);
        pretenderDOM.style.display = HIDDEN;
      },
      move: (moveEventParam) => {
        typeof moveCallback === "function" && moveCallback(moveEventParam);
        pretenderDOM.style.display = DISPLAY;
        pretenderDOM.style.top = moveEventParam.y - offsetYOfMoving + "px";
        pretenderDOM.style.left = moveEventParam.x - offsetXOfMoving + "px";
      },
      over: (upEventParam) => {
        typeof overCallback === "function" && overCallback(upEventParam);
        pretenderDOM.style.display = HIDDEN;
      },
    });
  } else {
    throw new Error("类型不正确,无法找到元素");
  }
};

export const additionDragEvent = (DOM, { down, move, over }) => {
  if (DOM instanceof HTMLElement) {
    const origin = fromEvent(DOM, "mousedown");
    const mover = defineMover();
    const upper = defineUpper();
    origin
      .pipe(
        map((downEventParam) => {
          typeof down === "function" && down(downEventParam);
          return mover.pipe(
            takeUntil(
              upper.pipe(
                map((upEventParam) => {
                  typeof over === "function" && over(upEventParam);
                })
              )
            )
          );
        }),
        concatAll(),
        withLatestFrom(origin, (move) => {
          const { pageX: mx, pageY: my } = move;
          return {
            x: mx,
            y: my,
            event: move,
          };
        })
      )
      .subscribe((moveEventParam) => {
        typeof move === "function" && move(moveEventParam);
      });
    return {
      origin,
      mover,
      upper,
    };
  }
};

export const clogDefaultDrag = () => {
  document.onselectstart = (ev) => ev.preventDefault();
  document.ondragstart = () => false;
};
export const reSetDefaultDrag = () => {
  document.ondragstart = () => true;
};
export const createMouseOver = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("mouseover", fn, options);
  }
};

export const createMouseLeave = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("mouseleave", fn, options);
  }
};

export const createMouseDown = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("mousedown", fn, options);
  }
};
export const createMouseMove = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("mousemove", fn, options);
  }
};
export const createMouseClick = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("click", fn, options);
  }
};
export const createMouseUp = (DOM, fn, options = false) => {
  if (DOM instanceof HTMLElement && typeof fn === "function") {
    DOM.addEventListener("mouseup", fn, options);
  }
};
