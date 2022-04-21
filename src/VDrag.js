import { cloneDeep } from "lodash";
import { fromEvent } from "rxjs";
import { map, concatAll, takeUntil, withLatestFrom } from "rxjs/operators";
const isFunction = (a) => typeof a === "function";

export class VDrag {
  constructor(key, fromId, draggingId) {
    this.__template = null;
    this.__draggingId = draggingId;
    this.__key = NaN;
    this.key = key;
    this.__upObserver = null;
    this.__moveObserver = null;
    this.__downObserverOfFrom = null;
    this.__downObserverOfCopy = null;
    this.copys = [];
    this.events = {
      downWithFrom: undefined,
      downWithCopy: undefined,
      up: undefined,
      move: undefined,
    };
    this.fromDOM = document.getElementById(fromId);
    this.draggingDOM = document.getElementById(draggingId);
    this.load();
    this.registryObservableOperationWithMove();
    this.registryObservableOperationWithUp();
    this.registryObservableOperationWithDown();
    this.subscribeOfFromDown();
    this.subscribeOfUp();
    this.subscribeOfMove();
  }
  load() {
    this.draggingDOM.style.display = "none";
    this.draggingDOM.style.position = "absolute";
    document.onselectstart = (e) => {
      e.preventDefault();
    };
    document.oncontextmenu = (e) => {
     e.preventDefault();
   };
  }
  mouseDownWithFrom(fn) {
    if (isFunction(fn)) {
      this.events.downWithFrom = fn;
    }
  }
  mouseDownWithCopy(fn) {
    if (isFunction(fn)) {
      this.events.downWithCopy = fn;
    }
  }
  mouseMove(fn) {
    if (isFunction(fn)) {
      this.events.move = fn;
    }
  }
  mouseUp(fn) {
    if (isFunction(fn)) {
      this.events.up = fn;
    }
  }
  subscribeOfFromDown() {
    this.subscribeOfDown(
      this.__downObserverOfFrom,
      this.draggingDOM,
      this.events.downWithFrom
    );
  }
  subscribeOfCopyDown(ObserverOfCopy, copyDOM) {
    this.subscribeOfDown(ObserverOfCopy, copyDOM, this.events.downWithCopy);
  }
  subscribeOfDown(Observer, operationDom, downFn, subscribeFn) {
    Observer.pipe(
      map((event) => {
        if (isFunction(downFn) && this.__key === this.key) {
          downFn.call(this, event, operationDom);
        }
        this.__key = this.key;
        this.draggingDOM = this.inCopys(operationDom.id)
          ? operationDom
          : document.getElementById(this.__draggingId);
        event.preventDefault();
        return this.__moveObserver.pipe(takeUntil(this.__upObserver));
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
      if (isFunction(subscribeFn) && this.__key === this.key) {
        subscribeFn.call(this, res, operationDom);
      }
      operationDom.style.display = "block";
      operationDom.style.zIndex = 999;
      operationDom.style.left = res.x + "px";
      operationDom.style.top = res.y + "px";
    });
  }
  removeCopy(id) {
    this.copys = this.copys.filter((i) => i.id !== id);
  }
  inCopys(id) {
    return this.copys.map((i) => i.id).includes(id);
  }
  subscribeOfUp() {
    this.__upObserver.subscribe((event) => {
      console.log(this.__key, this.key, this.events);
      this.__key === this.key &&
        this.events.up &&
        this.events.up.call(this, event, this.draggingDOM, this.copys);
      this.draggingDOM.style.display = this.inCopys(this.draggingDOM.id)
        ? "block"
        : "none";
      this.__key = NaN;
    });
  }
  subscribeOfMove() {
    this.__moveObserver.subscribe((event) => {
      this.__key === this.key &&
        this.events.move &&
        this.events.move.call(this, event);
    });
  }
  registryObservableOperationWithMove() {
    this.__moveObserver = fromEvent(document, "mousemove");
  }
  registryObservableOperationWithUp() {
    this.__upObserver = fromEvent(document, "mouseup");
  }
  registryObservableOperationWithDown() {
    this.__downObserverOfFrom = fromEvent(this.fromDOM, "mousedown");
  }
  //   registryObservableOperationWithCopyDown(copyDOM) {
  //     return fromEvent(copyDOM, "mousedown");
  //   }

  /**
   * 注册VUE 组件实例
   */
  registryTemplateByVue(instanceOfVue) {
    this.__template = cloneDeep(instanceOfVue);
  }
  syncCopys(components) {
    this.copys = components;
    setTimeout(() => {
      this.copys.map((i) => {
        i.copyDOM = document.getElementById(i.id);
        if (i.copyDOM) {
          i.observerCopy = fromEvent(i.copyDOM, "mousedown");
          this.subscribeOfCopyDown(i.observerCopy, i.copyDOM);
        }
      });
    }, 0);
  }
}
