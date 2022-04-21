import { fromEvent } from "rxjs";
import { map, concatAll, takeUntil, withLatestFrom } from "rxjs/operators";
//const isArray = (a) => Array.isArray(a);
//const isString = (a) => typeof a === "string";
const isFunction = (a) => typeof a === "function";
//const isObject = (a) => Object.prototype.toString.call(a) === "[Object Object]";
//const checkTruth = (a) => ![0, "", undefined, null, NaN].some((i) => i === a);
//const getNumberFromString = (a) => Number(String(a).replace(/[^0-9]/gi, ""));
export class BDrag {
  constructor({
    draggingDomId,
    templateDomId,
    templateVUE,
    fromDomId,
    containerId,
    key,
  }) {
    this.draggingDomId = draggingDomId;
    this.__ObserverOfDownForFrom = null;
    this.__ObserverOfMove = null;
    this.__ObserverOfUp = null;
    this.__ObserverOfDownForCopys = 0;
    this.currentKey = NaN;
    this.currentDOM = null;
    this.templateDomId = templateDomId;
    this.fromDomId = fromDomId;
    this.data = {};
    this.event = {};
    this.update = false;
    this.key = key;
    this.editorStatus = false;
    this.operateIsCopy = false;
    this.selected = false;
    this.style = {};
    this.containerDomId = containerId;
    this.templateBackUpDOM = document.getElementById(this.templateDomId);
    this.templateDOM = document.getElementById(this.templateDomId);
    this.fromDOM = document.getElementById(this.fromDomId);
    this.draggingDOM = document.getElementById(this.draggingDomId);
    this.containerDOM = document.getElementById(this.containerDomId);
    this.templateDOM && (this.templateDOM.style.display = "none");
    this.templateVUE = templateVUE;
    this.templateDOM && (this.templateDOM.style.position = "absolute");
    this.templateDOM && (this.templateDOM.style.cursor = "pointer");
    this.draggingDOM.style.display = "none";
    this.draggingDOM.style.position = "absolute";
    this.draggingDOM.style.cursor = "pointer";
    this.registryObservable();
    document.onselectstart = (e) => {
      e.preventDefault();
    };
  }

  sync() {}

  cloneComponent(component) {
    this.templateVUE = component;
  }
  mouseDown(fn, forceUpdate = false) {
    if (isFunction(fn)) {
      this.event.down = fn;
      this.update = forceUpdate;
    }
  }
  mouseMove(fn) {
    if (isFunction(fn)) {
      this.event.move = fn;
    }
  }
  mouseUp(fn) {
    if (isFunction(fn)) {
      this.event.up = fn;
    }
  }
  registryObservable() {
    this.fromDOMObservable();
    this.moveObservable();
    this.upObservable();
  }

  upObservable() {
    this.__ObserverOfUp = fromEvent(document, "mouseup");
    this.__ObserverOfUp.subscribe(() => {
      console.log("sdsup");
      if (this.currentKey === this.key) {
        console.log(
          this.currentDOM,
          this.operateIsCopy,
          "this.operateIsCopythis.currentDOM"
        );
        if (!this.operateIsCopy) {
          this.draggingDOM.style.display = "none";
          this.__ObserverOfDownForCopys++;
          // const newDOM = this.copy(this.templateDOM)
          // console.log(newDOM, 'newDOM')
          // newDOM.style.display = 'block'
          // newDOM.style.left = this.draggingDOM.style.left
          // newDOM.style.zIndex = 998
          // newDOM.style.top = this.draggingDOM.style.top
          // console.log(this.fromDomId, res, 'up')
        } else {
          //触发选中
          console.log(this.currentDOM, "this.currentDOM");
          this.currentDOM.style.resize = "both";
          this.currentDOM.style.overflow = "auto";
          this.currentDOM.style.border = "2px solid";
          this.editorStatus = true;
        }
        const { up } = this.event;
        up &&
          up.call(this, {
            component: this.templateVUE,
            x: this.draggingDOM.style.left,
            y: this.draggingDOM.style.top,
            id:
              this.templateDomId +
              this.key +
              "copyBy" +
              this.__ObserverOfDownForCopys,
          });
      } else {
        this.editorStatus = false;
      }
      this.currentKey = NaN;
    });
  }

  moveObservable() {
    this.__ObserverOfMove = fromEvent(document, "mousemove");
    this.__ObserverOfMove.subscribe(() => {
      if (this.currentKey === this.key) {
        //move
        const { move } = this.event;
        move && move.call(this, this.currentDOM);
      }
    });
  }
  fromDOMObservable() {
    this.__ObserverOfDownForFrom = fromEvent(this.fromDOM, "mousedown");
    this.dragObservable(this.__ObserverOfDownForFrom, this.draggingDOM);
  }
  dragObservable(Observer, DOM) {
    Observer.pipe(
      map((res) => {
        !this.editorStatus && res.preventDefault();
        console.log(res, "down");
        this.currentKey = this.key;
        this.currentDOM = DOM;
        this.operateIsCopy = this.__ObserverOfDownForCopys
          .map((i) => i.id)
          .includes(DOM.id);
        const { down } = this.event;
        down && down.call(this, DOM);
        return this.__ObserverOfMove.pipe(takeUntil(this.__ObserverOfUp));
      }),
      concatAll(),
      withLatestFrom(Observer, (move, down) => {
        const { pageX, pageY } = move;
        const { offsetX, offsetY } = down;
        return {
          button: down.button,
          x: pageX - offsetX,
          y: pageY - offsetY,
        };
      })
    ).subscribe((res) => {
      if (!this.editorStatus) {
        console.log(res, "end");
        DOM.style.display = "block";
        DOM.style.zIndex = 999;
        DOM.style.left = res.x + "px";
        DOM.style.top = res.y + "px";
      }
    });
  }
  assign() {}
  // downOnElement(fn) {

  // }

  // moveOnElement(fn) {

  // }

  // upOnElement(fn) {

  // }

  updateView() {}

  updateData() {}
}
