//import { cloneDeep } from "lodash";
import {fromEvent} from "rxjs";
import {map, concatAll, takeUntil, withLatestFrom} from "rxjs/operators";

const isFunction = (a) => typeof a === "function";

export class VDrag {
  constructor(key, fromId, draggingId) {
    this.__template = null;
    this.__draggingId = draggingId;
    this.__key = NaN;
    this.key = key;
    this.__upObserver = null;
    this.__moveObserver = null;
    this.__bodyObserver = null;
    this.__downObserverOfFrom = null;
    this.__downObserverOfCopy = null;
    this.copys = [];
    this.events = {
      downWithFrom: undefined,
      resize: undefined,
      downWithCopy: undefined,
      downWithFromSubscribe: undefined,
      downWithCopySubscribe: undefined,
      up: undefined,
      move: undefined,
    };
    this.selectedDOM = null
    this.preventDefault = undefined
    this.fromDOM = document.getElementById(fromId);
    this.draggingDOM = document.getElementById(draggingId);
    this.load();
    this.registry();
    this.run();
  }

  registry() {
    this.registryObservableOperationWithOutClick();
    this.registryObservableOperationWithMove();
    this.registryObservableOperationWithUp();
    this.registryObservableOperationWithDown();
  }

  run() {
    this.subscribeOfFromDown();
    this.subscribeOfUp();
    this.subscribeOfMove();
    this.subscribeOfOutClick();
  }

  filterNumber(string) {
    return Number(String(string).replace(/[^0-9]/gi, ""))
  }

  load() {
    if (this.draggingDOM) {
      this.draggingDOM.style.display = "none";
      this.draggingDOM.style.position = "absolute";
      document.onselectstart = (e) => {
        e.preventDefault();
      };
      document.oncontextmenu = (e) => {
        e.preventDefault();
      };
    }
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

  offsetFn(operateDOM, x, y) {
    operateDOM.style.left = this.filterNumber(operateDOM.style.left) + x + 'px'
    operateDOM.style.top = this.filterNumber(operateDOM.style.top) + y + 'px'
  }

  offsetOfFromMove(x, y) {
    this.events.downWithFromSubscribe = (_, operateDOM) => this.offsetFn(operateDOM, x, y)
    this.run()
  }

  offsetOfCopyMove(x, y) {
    this.events.downWithCopySubscribe = (_, operateDOM) => this.offsetFn(operateDOM, x, y)
    this.run()
  }

  subscribeOfFromDown() {
    this.subscribeOfDown(
      this.__downObserverOfFrom,
      this.draggingDOM,
      this.events.downWithFrom,
      this.events.downWithFromSubscribe
    );
  }

  subscribeOfCopyDown(ObserverOfCopy, copyDOM) {
    const downFn = (event, dom) => {
      isFunction(this.events.downWithCopy) && this.events.downWithCopy(event, dom)
      this.selectedDOM = dom
    }
    const runDownWithCopySubscribe = (event, dom) => {
      isFunction(this.events.downWithCopySubscribe) && this.events.downWithCopySubscribe(event, dom)
    }
    const finalCopy = (event, dom) => {
      const {moveHeight, moveWidth, downHeight, downWidth} = event
      if (moveHeight !== downHeight || moveWidth !== downWidth) {
        this.events.resize && this.events.resize.call(this, event, dom)
      }
    }
    this.subscribeOfDown(
      ObserverOfCopy,
      copyDOM,
      downFn,
      runDownWithCopySubscribe,
      finalCopy
    );
  }

  outInstanceDown() {
    if (this.selectedDOM) {
      this.preventDefault = true
      this.selectedDOM.style.border = '2px solid'
      this.selectedDOM.style.resize = 'both'
      this.selectedDOM.style.overflow = 'auto'
    }
  }

  /**
   *
   * @param Observer  观察对象
   * @param operationDom 响应dom
   * @param downFn 按下事件
   * @param subscribeFn 移动事件
   * @param final 始终会在订阅后执行
   */
  subscribeOfDown(Observer, operationDom, downFn, subscribeFn, final) {
    Observer.pipe(
      map((event) => {
        if (isFunction(downFn) && this.__key === this.key) {
          downFn.call(this, event, operationDom);
        }
        this.__key = this.key;
        this.draggingDOM = this.inCopys(operationDom.id)
          ? operationDom
          : document.getElementById(this.__draggingId);
        !this.preventDefault && event.preventDefault();
        return this.__moveObserver.pipe(takeUntil(this.__upObserver));
      }),
      concatAll(),
      withLatestFrom(Observer, (move, down) => {
        const {pageX, pageY} = move;
        const {offsetX, offsetY} = down;
        const getComputedStyleOfMove = window.getComputedStyle(move.target, null)
        const getComputedStyleOfDown = window.getComputedStyle(down.target, null)
        return {
          button: down.button,
          x: pageX - offsetX,
          y: pageY - offsetY,
          moveHeight: getComputedStyleOfMove.height,
          moveWidth: getComputedStyleOfMove.width,
          downHeight: getComputedStyleOfDown.height,
          downWidth: getComputedStyleOfDown.width
        };
      })
    ).subscribe((res) => {
      if (!this.preventDefault) {
        operationDom.style.display = "block";
        operationDom.style.zIndex = 999;
        operationDom.style.left = res.x + "px";
        operationDom.style.top = res.y + "px";
        if (isFunction(subscribeFn) && this.__key === this.key) {
          subscribeFn.call(this, res, operationDom);
        }
      }
      isFunction(final) && this.__key === this.key && final.call(this, res, operationDom)
    });
  }

  resize(fn) {
    isFunction(fn) && (this.events.resize = fn)
  }

  /**
   * 移除copys
   * @param id
   */
  removeCopy(id) {
    this.copys = this.copys.filter((i) => i.id !== id);
  }

  /**
   * 是否存在在copys
   * @param id
   * @returns {boolean}
   */
  inCopys(id) {
    return this.copys.map((i) => i.id).includes(id);
  }

  /**
   * 订阅按起
   */
  subscribeOfUp() {
    this.__upObserver.subscribe((event) => {
      // console.log(this.__key, this.key, this.events);
      this.__key === this.key &&
      this.events.up &&
      this.events.up.call(this, event, this.draggingDOM, this.copys);
      this.draggingDOM.style.display = this.inCopys(this.draggingDOM.id)
        ? "block"
        : "none";
      this.__key = NaN;
    });
  }

  subscribeOfOutClick() {
    this.__bodyObserver.subscribe((e) => {
      this.copys.map(i => {
        if (i.copyDOM) {
          i.copyDOM.style.border = 'none'
          i.copyDOM.style.resize = 'none'
          i.copyDOM.style.overflow = 'auto'
        }
      })
      if (!this.inCopys(e.target.id)) {
        this.selectedDOM = null
        this.preventDefault = undefined
      } else {
        this.outInstanceDown()
      }
    })
  }

  /**
   * 订阅移动
   */
  subscribeOfMove() {
    this.__moveObserver.subscribe((event) => {
      this.__key === this.key &&
      this.events.move &&
      this.events.move.call(this, event);
    });
  }

  registryObservableOperationWithOutClick() {
    this.__bodyObserver = fromEvent(document.body, "click");
  }

  /**
   * 注册移动观察者
   */
  registryObservableOperationWithMove() {
    this.__moveObserver = fromEvent(document, "mousemove");
  }

  /**
   * 注册抬起观察者
   */
  registryObservableOperationWithUp() {
    this.__upObserver = fromEvent(document, "mouseup");
  }

  /**
   * 注册起始元素按下观察者
   */
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
    //this.__template = cloneDeep(instanceOfVue);
  }

  /**
   * 同步被拖出的数据
   * @param components
   */
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