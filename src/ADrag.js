import {
    fromEvent
} from "rxjs";
import {
    map,
    concatAll,
    takeUntil,
    withLatestFrom
} from "rxjs/operators";

/**
 * TODO:
 * 1:放大缩小（视窗，元素v）
 * 2:拖拽的图片 v
 * 3:删除图片 v
 * 4:编辑属性 v
 * 5:选中位置 
 */


/**
 *
 * @type {{_ASheet: {_container: symbol, $blockingMove: symbol, $itemBindEvent: symbol, $downStart: symbol, _bodyUp: symbol, $assemble: symbol, _bodyMove: symbol, _currentItem: symbol, $callback: symbol, $updateTarget: symbol, $bodyBindEvent: symbol, $blocking: symbol, _close: symbol, _targets: symbol, $optionStream: symbol}, _AScene: {}}}
 * @private
 */
const _private = {
    _ASheet: {
        _targets: Symbol("targets"),
        _close: Symbol("close"),
        _bodyUp: Symbol("bodyUp"),
        _container: Symbol('container'),
        _bodyMove: Symbol("bodyMove"),
        _currentItem: Symbol("_currentItem"),
        $assemble: Symbol("assemble"),
        $bodyBindEvent: Symbol("bodyBindEvent"),
        $itemBindEvent: Symbol("itemBindEvent"),
        $optionStream: Symbol("optionStream"),
        $blocking: Symbol("blocking"),
        $copy: Symbol("copy"),
        $downStart: Symbol("downStart"),
        $blockingMove: Symbol("blockingMove"),
        $callback: Symbol("callback"),
        $updateTarget: Symbol("updateTarget"),
        $checkTarget: Symbol('checkTarget')
    },
    _AScene: {},
};
const isArray = (a) => Array.isArray(a);
const isString = (a) => typeof a === "string";
const isFunction = (a) => typeof a === "function";
//const isObject = (a) => Object.prototype.toString.call(a) === "[Object Object]";
const checkTruth = (a) => ![0, "", undefined, null, NaN].some((i) => i === a);
const getNumberFromString = a => Number(String(a).replace(/[^0-9]/ig, ""));

class AScene {
    constructor() {}

    paint() {}
}

const {
    _ASheet
} = _private;
const {
    _targets,
    _container,
    _bodyUp,
    _close,
    _bodyMove,
    _currentItem,
    $blockingMove,
    $assemble,
    $bodyBindEvent,
    $updateTarget,
    $copy,
    $itemBindEvent,
    $optionStream,
    $checkTarget,
    $callback,
    $blocking,
    $downStart,
} = _ASheet;

class ASheet {
    /**
     * @param prev 阻塞默认事件,仅仅作用在namespace下
     * @param nameSpace 命名空间
     * @returns {ASheet}
     */
    constructor(prev = true, nameSpace = 'app') {
        this[_targets] = [];
        this[_container] = undefined;
        this[_bodyUp] = undefined;
        this[_close] = false;
        this.nameSpace = checkTruth(nameSpace) ? nameSpace : 'app'
        this[_bodyMove] = undefined;
        this[_currentItem] = undefined;
        if (prev) {
            const nameSpace = document.getElementById(this.nameSpace)
            if (nameSpace) {
                document.onselectstart = (e) => {
                    e.preventDefault()
                }
                nameSpace.oncontextmenu = (e) => {
                    e.preventDefault()
                }
            }
        }
        return this;
    }

    /**
     * @param identifiers string|string[] 可拖拽的绑定id
     */
    trigger(identifiers) {
        this[$assemble](identifiers);
        this[$bodyBindEvent]();
        this[$itemBindEvent]();
        this[$optionStream]();
        return this;
    }
    /**
     * @param identifier string 待编辑的html的id，
     */
    zIndexChange(identifier, zIndex) {
        const willEdit = document.getElementById(identifier)
        if (willEdit.getAttribute('copyBy')) {
            willEdit.style.zIndex = zIndex || willEdit.style.zIndex
        }
        return this;
    }
    /**
     * @param identifier string 待删除的html的id，
     */
    delete(identifier) {
        const willRemove = document.getElementById(identifier)
        if (willRemove.getAttribute('copyBy')) {
            willRemove.remove()
        }
        return this;
    }
    /**
     * 容器
     * @param identifier 容器id
     */
    container(identifier) {
        const DOM = document.getElementById(identifier);
        if (DOM) {
            const {
                offsetLeft,
                offsetTop
            } = DOM
            const {
                width,
                height
            } = DOM.getBoundingClientRect()
            this[_container] = {
                x: offsetLeft,
                y: offsetTop,
                width,
                height,
            }
        }
        return this
    }

    /**
     *
     * @returns 获取所有片(最新的)
     */
    getTargets() {
        this[$updateTarget]()
        return this[_targets];
    }

    /**
     *
     * @param {*} fn  筛选条件
     * @returns 返回筛选值
     */
    filterTargets(fn) {
        if (isFunction(fn)) {
            return this[_targets].filter((i) => fn.call(this, i));
        }
    }

    /**
     * @param {*} filterFn 片筛选，函数 ，参数为片集合迭代项目，即再所有片集合中筛选指定的满足条件的片.默认拖拽中且是容器内
     * @param {} upFn 鼠标抬起回调 参数为event当前触发事件对象, current: 当前操作片
     * @returns 当前实例
     */
    mouseUp(upFn, filterFn = () => this.startByDraging()) {
        this[$blocking](filterFn, upFn);
        return this
    }
    click(event) {
        const id = event.target.id
        this[_targets].map(i => {
            i.childs && i.childs.map(j => {
                if (j.id === id) {
                    if (j.DOM.getAttribute('resizing') === 'true') {
                        j.DOM.setAttribute('resizing', false)
                        j.DOM.style.resize = 'none'
                        j.DOM.style.overflow = 'unset'
                    } else {
                        j.DOM.setAttribute('resizing', true)
                        j.DOM.style.resize = 'both'
                        j.DOM.style.overflow = 'auto'
                    }
                } else {
                    j.DOM.setAttribute('resizing', false)
                    j.DOM.style.resize = 'none'
                    j.DOM.style.overflow = 'unset'
                }
            })
        })
        return this
    }
    /**
     * @param {*} filterFn 片筛选，函数 ，参数为片集合迭代项目，即再所有片集合中筛选指定的满足条件的片
     * @param {*} downFn 鼠标按下回调 参数为event当前触发事件对象, current: 当前操作片
     * @returns 当前实例
     */
    mouseDown(filterFn, downFn) {
        this[$downStart](filterFn, downFn);
        return this;
    }

    /**
     * @param {*} triggerFn 触发条件,默认为只会在drag期间触发
     * @param {*} moveFn 鼠标移动回调 参数为event当前触发事件对象, current: 当前操作片
     * @returns 当前实例
     */
    mouseMove(moveFn, triggerFn = () => this.startByDraging() && !this[_close]) {
        this[$blockingMove](triggerFn, moveFn);
        return this;
    }

    /**
     * 推拽状态
     * @returns {boolean}
     */
    startByDraging() {
        return !!this[_currentItem];
    }

    /**
     * 目标位置检测
     */
    [$checkTarget]() {
        let result = false
        console.log(this[_container] && this[_currentItem], 'this[_container] && this[_currentItem]')
        if (this[_container] && this[_currentItem]) {
            const {
                x,
                y,
                width,
                height
            } = this[_currentItem]
            const txmin = x
            const txmax = x + width
            const tymax = y + height
            const tymin = y
            const cxmin = this[_container].x
            const cxmax = this[_container].x + this[_container].width
            const cymax = this[_container].y + this[_container].height
            const cymin = this[_container].y
            result = txmin > cxmin && txmax < cxmax && tymin > cymin && tymax < cymax
        }
        return result
    }

    /**
     *
     * @param {*} instanceFilterFn 被绑定的元素筛选方法，此方法不会覆盖,如果要重新赋值请使用instanceRebindData
     * @param {
     *     offsetX:number 鼠标偏移x
     *     offsetY:number 鼠标偏移y
     *     resize:boolean dom可移动
     *     forceSlot:boolean 强制绑定slot ，默认true
     *     slot:HTMLid move模替换插槽 会替换掉trigger的html:::
     * 注1：slot会装饰到拖拽事件上,而事件仅仅会注册上slot节点的终节点,例如你在img标签外包裹了div并打了slot的id，此时这个节点将被认为为未注册的字节点是img而不是被打上solt的div，此时他将不在继续被提供单独拖拽的能力
     * 这么做是为了后续可能用到的线性关联可在子节点复制操作用到的。注意下.如果非要打，请将forceSlot属性打开（虽然他默认打卡）
     *    templateId:HTMLid up模替换插槽 会替换掉trigger的html、
     * 注2：透明度什么的,请在slot里写好
     * } show 被绑定的数据,它会被展示出来
     * @param {*} data 被绑定的数据,会被绑在data键上
     */
    instanceBindData(instanceFilterFn, show = {}, data = {}) {
        if (isFunction(instanceFilterFn) && checkTruth(data)) {
            this[_targets]
                .filter((i) => instanceFilterFn.call(this, i))
                .map((k) => {
                    k.show = show
                    if (show.slot) {
                        k.slotDOM = document.getElementById(show.slot)
                        k.tempateDOM = document.getElementById(show.templateId)
                        if (k.tempateDOM) {
                            k.tempateDOM.style.display = 'none'
                            k.tempateDOM.style.position = 'absolute'
                            k.tempateDOM.style.cursor = 'pointer'
                        }
                        k.slotDOM.style.display = 'none'
                        k.childs = k.childs || []
                        k.forceSlot = !!show.forceSlot
                        k.slotDOM.style.position = 'absolute'
                        k.slotDOM.style.zIndex = 999
                        k.slotDOM.style.cursor = 'pointer'
                        k.__slotDownObservable = fromEvent(k.slotDOM, 'mousedown')
                    }
                    k.data = k.data || data;
                });
            this[$optionStream]()
        }
        return this;
    }

    /**
     *
     * @param {*} instanceFilterFn
     * @param {*} data 被绑定的数据,会被绑在data键上
     */
    instanceRebindData(instanceFilterFn, data = {}) {
        if (isFunction(instanceFilterFn) && checkTruth(data)) {
            this[_targets]
                .filter((i) => instanceFilterFn.call(this, i))
                .map((k) => {
                    k.data = data;
                });
        }
        return this;
    }
    /**
     * private
     * 更新target位置坐标
     */
    [$updateTarget]() {
        this[_targets] = this[_targets].map(i => {
            const {
                offsetLeft,
                offsetTop
            } = i.DOM
            const {
                width,
                height
            } = i.DOM.style
            return {
                ...i,
                x: offsetLeft,
                y: offsetTop,
                width: getNumberFromString(width),
                height: getNumberFromString(height),
            }
        })
    }
    /**
     * private
     * 事件回调操作返回参数
     */
    [$callback](fn, other) {
        if (isFunction(fn)) {
            fn.call(this, {
                event: other,
                current: this[_currentItem]
            });
        }
    }
    /**
     * private
     * 复制节点
     */
    [$copy](node, key) {
        const dup = node.cloneNode(true)
        dup.id = `${node.id}${key}`
        dup.style.display = 'block'
        dup.style.zIndex = 10
        // dup.style.resize = 'both'
        // dup.style.overflow = 'auto'
        dup.setAttribute('copyBy', node.id)
        dup.setAttribute('resizeBy', true)
        document.getElementById(this.nameSpace).append(dup)
        const stream = fromEvent(dup, 'mousedown')
        this[_currentItem].childs.push({
            DOM: dup,
            stream,
            copyBy: node.id,
            id: dup.id,
            isChildren: true
        })
    }
    /**
     * private
     * 事件流按下
     */
    [$downStart](filterFn, fn) {
        if (isFunction(filterFn)) {
            this[_targets]
                .filter((i) => filterFn.call(this, i))
                .map((f) => {
                    f.__itemDownObservable.subscribe((res) => {
                        this[$callback](fn, res);
                    });
                });
        }
    }
    /**
     * private
     * 事件流结束
     */
    [$blocking](triggerFn, fn) {
        this[_bodyUp].subscribe((res) => {
            console.log(this[_currentItem], 'up_currentItem')
            if (this[$checkTarget]()) {
                if (isFunction(triggerFn) && triggerFn.call(this, this[_currentItem])) {
                    const isChildren = this[_currentItem].childs && this[_currentItem].childs.map(i => i.id).includes(this[_currentItem].targetId)
                    if (this[_currentItem].slotDOM) {
                        if (!isChildren) {
                            if (this[_currentItem].tempateDOM) {
                                this[_currentItem].tempateDOM.style.display = 'none'
                                this[_currentItem].tempateDOM.style.left = this[_currentItem].slotDOM.style.left
                                this[_currentItem].tempateDOM.style.top = this[_currentItem].slotDOM.style.top
                                this[$copy](this[_currentItem].tempateDOM, this[_currentItem].childs.length)
                            } else {
                                this[$copy](this[_currentItem].slotDOM, this[_currentItem].childs.length)
                            }
                            this[$optionStream]()
                        }
                    }
                    this[$callback](fn, res);
                }
            } else {
                if (isFunction(triggerFn) && triggerFn.call(this, this[_currentItem])) {
                    this[$callback](fn, res);
                }
                if (this[_currentItem] && this[_currentItem].isChildren) {
                    this[_close] = true
                    const {
                        initX,
                        initY,
                        current
                    } = this[_currentItem]
                    current.style.left = initX + "px";
                    current.style.top = initY + "px";
                }
            }
            this[_currentItem] && this[_currentItem].slotDOM && (this[_currentItem].slotDOM.style.display = 'none')
            this[_currentItem] = undefined;
            this.click(res)
        });
    }
    /**
     * private
     * 事件流操作中
     */
    [$blockingMove](triggerFn, fn) {
        this[_bodyMove].subscribe((res) => {
            isFunction(triggerFn) &&
                triggerFn.call(this, res) &&
                this[$callback](fn, res);
        });
    }
    /**
     * private
     * 注册POOL备选池
     */
    [$assemble](identifiers) {
        let c = undefined;
        if (isArray(identifiers) && identifiers.every((i) => isString(i))) {
            identifiers.map((i) => {
                c = document.getElementById(i);
                c.style.cursor = 'pointer'
                this[_targets].push({
                    id: i,
                    DOM: c
                });
            });
        } else if (isString(identifiers)) {
            c = document.getElementById(identifiers);
            c.style.cursor = 'pointer'
            this[_targets].push({
                id: identifiers,
                DOM: c
            });
        } else {
            throw Error(`参数异常${JSON.stringify(identifiers)}`);
        }
    }
    /**
     * private
     * 全局事件move与up绑定流
     */
    [$bodyBindEvent]() {
        this[_bodyUp] = fromEvent(document, "mouseup");
        this[_bodyMove] = fromEvent(document, "mousemove");
    }
    /**
     * private
     * 全局事件down绑定流
     */
    [$itemBindEvent]() {
        this[_targets] = this[_targets].map((i) => {
            return i ? {
                ...i,
                __itemDOM: i,
                __itemDownObservable: fromEvent(i.DOM, "mousedown"),
            } : {};
        });
    }
    /**
     * 边界
     */
    getValue(value, max, min) {
        return Math.min(Math.max(value, min), max);
    }
    getRootParentIsChildren(dom) {
        let root = dom;
        console.log(root, 'root')
        if (root.parentNode && isFunction(root.getAttribute) && !root.getAttribute('copyBy')) {
            root = this.getRootParentIsChildren(root.parentNode);
        }
        return root.getAttribute('copyBy');
    }
    /**
     * private
     * 操作流
     */
    [$optionStream]() {
        this[_targets].map((i) => {
            let initX, initY, targetId, current, isChildren, isTemplate, isSlot, width, childrenNode, height;
            const childsStream = i.childs ? i.childs.map(h => h.stream) : []
            console.log(i, 'iut')
            const {
                __slotDownObservable,
                __itemDownObservable
            } = i
            const observable = [__slotDownObservable, __itemDownObservable, ...childsStream]
            observable.map((p, index) => {
                if (p) {
                    p.pipe(
                            map((res) => {
                                initX = res.target.offsetLeft;
                                initY = res.target.offsetTop;
                                targetId = res.target.id;
                                width = getNumberFromString(res.target.style.width);
                                height = getNumberFromString(res.target.style.height);
                                current = res.target;
                                console.log(i, index - 2, 'ct')
                                isChildren = index >= 2 ? i.childs && i.childs[index - 2].isChildren : false
                                childrenNode = isChildren ? i.childs[index - 2] : {}
                                isSlot = i.show && i.show.slot && !isChildren
                                isTemplate = i.id === targetId
                                this[_currentItem] = {
                                    ...i,
                                    targetId,
                                    isChildren,
                                    current,
                                    childrenNode,
                                    button: res.button,
                                    width,
                                    height,
                                    initX,
                                    initY,
                                    x: initX,
                                    y: initX,
                                };
                                !res.target.getAttribute('resizing') && res.preventDefault()
                                return this[_bodyMove].pipe(takeUntil(this[_bodyUp]));
                            }),
                            concatAll(),
                            withLatestFrom(p, (move, down) => {
                                const {
                                    pageX,
                                    pageY
                                } = move;
                                const {
                                    offsetX,
                                    offsetY
                                } = down;
                                console.log(down, 'down')
                                return {
                                    button: down.button,
                                    x: pageX - offsetX,
                                    y: pageY - offsetY,
                                };
                            })
                        )
                        .subscribe((res) => {
                            if (res.button === 0) {
                                console.log({
                                    isChildren,
                                    isSlot,
                                    isTemplate
                                }, 'isChildrenisSlot')
                                if (isChildren) {
                                    if (childrenNode.DOM.getAttribute('resizing') === 'false') {
                                        childrenNode.DOM.style.position = "absolute";
                                        childrenNode.DOM.style.left = res.x + "px";
                                        childrenNode.DOM.style.top = res.y + "px";
                                    }
                                } else if (isSlot) {
                                    i.slotDOM.style.display = 'block'
                                    const {
                                        offsetX,
                                        offsetY
                                    } = i.show
                                    console.log({
                                        offsetX,
                                        offsetY
                                    }, 'offsetX,offsetY')
                                    if (offsetX || offsetY) {
                                        i.slotDOM.style.left = res.x + offsetX || 0 + "px";
                                        i.slotDOM.style.top = res.y + offsetY || 0 + "px";
                                    } else {
                                        i.slotDOM.style.left = res.x + "px";
                                        i.slotDOM.style.top = res.y + "px";
                                    }

                                } else if (isTemplate) {
                                    i.DOM.style.position = "absolute";
                                    i.DOM.style.left = res.x + "px";
                                    i.DOM.style.top = res.y + "px";
                                }
                            } else if (res.button === 2) {
                                console.log(2)
                            }
                            this[_currentItem] = {
                                ...i,
                                targetId,
                                current,
                                initX,
                                childrenNode,
                                isChildren,
                                initY,
                                button: res.button,
                                x: res.x,
                                y: res.y,
                                width,
                                height
                            };
                        });
                }
            })
        });
    }
}

export {
    AScene,
    ASheet
};