<template>

    <div

            :id="pid"

            class="provider-class"

            :style="{ width: parentWSelf + 'px', height: parentHSelf + 'px' }"

            @click.stop.prevent="areaClick"

    >

        <div

                v-for="(k, i) in renderData"

                :key="i"

                @contextmenu.prevent="(e) => contextmenu(k, e)"

                @mouseover.prevent="(e) => hover(k, e)"

                @mouseleave.prevent="(e) => leave(k, e)"

        >

            <VueDragResize

                    v-if="k.v"

                    :ref="`VDR${k.id}`"

                    :x="k.x"

                    :y="k.y"

                    :w="k.w"

                    :h="k.h"

                    :z="k.z"

                    :isActive="k.f"

                    :isDraggable="!k.notDrag"

                    :parentH="parentHSelf"

                    :parentW="parentWSelf"

                    :minw="20"

                    :minh="20"

                    :parentLimitation="true"

                    @dragging="(params) => dragging(k, params)"

                    @dragstop="(params) => dragStop(k, params)"

                    @resizing="(params) => resizing(k, params)"

                    @resizestop="(params) => resizeStop(k, params)"

                    @clicked="(params) => click(k, params)"

            >

                <div @mousedown="closeRestrict" :style="{background:k.nodeBackgroundColor}" style="width: 100%;height: 100%">

                    <component

                            :ref="k.id+'ref'"

                            :is="k.c"

                            :thisData="k"

                            :updateData="updateData"

                            :change="updateComponent"

                            :connect="(e) => onConnect(k.id, e)"

                            :closeConnect="(e) => openCloseConnect(k.id, e)"

                            :closeOver="(e) => overCloseConnect(k.id, e)"

                            :clearConnect="() => clearBindConnect(k.id)"

                            :subscribe="(a,b)=>toSubscribe(a,b,k.id)"

                            :sender="(params,filter)=>toMsg(k,filter,params)"

                            :receiver="({origin,callback})=>getMsg(origin,k,callback)"

                            :subscribeAreaClick="(a,b)=>toSubscribe(a,b,'_areaClick')"

                            :subscribeCloseConnect="(a,b)=>toSubscribe(a,b,'_closeConnect')"

                            :style="{ filter: `${k.shadow}` }"

                    ></component>

                </div>

            </VueDragResize>

            <div

                    :id="`menu${k.id}`"

                    style="

          visibility: hidden;

          z-index: 99999999;

          position: fixed;

          min-width: 100px;

          min-height: 100px;

        "

                    @mouseup="() => closeMenu(k)"

            >

                <component

                        :is="k.m"

                        :thisData="k"

                        :updateData="updateData"

                        :change="updateComponent"

                        :clearConnect="() => clearBindConnect(k.id)"

                        :connect="(e) => onConnect(k.id, e)"

                        :closeConnect="(e) => openCloseConnect(k.id, e)"

                        :closeOver="(e) => overCloseConnect(k.id, e)"

                        :menuItemClick="(e)=>menuItemClick({id:k.id,...e})"

                        :closable="menuClosable"

                ></component>

            </div>

        </div>

        <div v-if="aiderLines.length" id="aiderLinesContainer" class="svgC">

            <svg width="100%" height="100%">

                <line

                        v-for="(i, k) in aiderLines"

                        :key="k"

                        :x1="i.x1"

                        :y1="i.y1"

                        :x2="i.x2"

                        :y2="i.y2"

                        :style="{

            stroke: i.lineColor,

            strokeWidth: '1px',

            strokeDasharray: '5,5',

          }"

                ></line>

            </svg>

        </div>

        <div id="renderLine" class="svgC">

            <svg width="100%" height="100%">

                <a

                        v-for="(i, k) in renderLines"

                        :key="k"

                        :id="i.id"

                        @click.stop="(e) => lineClick(i, e)"

                >

                    <path

                            :id="`${i.id}path`"

                            fill="transparent"

                            :d="`M${i.x1 || 0} ${i.y1 || 0} Q ${i.x2 || 0} ${i.y2 || 0} ${

              i.x3 || 0

            } ${i.y3 || 0}`"

                            :style="{ stroke: i.lineColor, strokeWidth: i.width + 'px' }"

                            stroke="black"

                    />

                    <path

                            v-if="viewStatus.animation"

                            :id="`${i.id}Line2Path`"

                            fill="transparent"

                            :style="{

              stroke: i.floatPointColor,

              strokeWidth: i.width + 'px',

            }"

                            :d="`M${i.x1 || 0} ${i.y1 || 0} Q ${i.x2 || 0} ${i.y2 || 0} ${

              i.x3 || 0

            } ${i.y3 || 0}`"

                    ></path>

                    <path

                            v-if="viewStatus.animation"

                            :id="`${i.id}Line1Path`"

                            fill="transparent"

                            :style="{

              stroke: i.lineColor,

              strokeWidth: i.width + 'px',

            }"

                            :d="`M${i.x1 || 0} ${i.y1 || 0} Q ${i.x2 || 0} ${i.y2 || 0} ${

              i.x3 || 0

            } ${i.y3 || 0}`"

                    ></path>

                </a>

            </svg>

        </div>

    </div>

</template>



<script>

import {Controller} from "@/views/visualization/ADrag4/controller/controller";

import VueDragResize from "vue-drag-resize";

import {Render} from "@/views/visualization/ADrag4/render/render";

import {Aider} from "@/views/visualization/ADrag4/aider/aider";

import {Lines} from "@/views/visualization/ADrag4/lines/lines";

import Responder from "../event/response";



const _RESPONSE_NAMESPACE = 'TASK'

const _SCENE = 'scene'

const _CONSTVARS = {

    _Y: "y",

    _X: "x",

    _TS: "topSide",

    _LS: "leftSide",

    _RS: "rightSide",

    _BS: "bottomSide",

};

const _EVENTS = {

    //更新信号回调，优化方式

    _SUB: 'subscribeMsg',

    _INIT: 'init',

    _UP_MSG_CALLBACK: 'itemUpdateMessage',

    _MIC: "menuItemClick",

    _MEU: "menuUp",

    //_MC: 'menuClick',

    _CS: "connectStart",

    _CI: "connectIng",

    _CE: "connectEnd",

    _CC: "closeAllConnect",

    //鼠标放起

    _MU: "mouseUp",

    //连线点击

    _LC: "lineClick",

    //组件点击

    _CL: "componentClick",

    //组件拖动中

    _DI: "dragging",

    //组件拖动结束

    _DS: "dragStop",

    //组件缩放中

    _RI: "resizing",

    //面板点击

    _AC: "areaClick",

    //组件缩放结束

    _RS: "resizeStop",

    //组件鼠标悬浮

    _HO: "hover",

    //鼠标离开组件上

    _LE: "leave",

};

export default {

    name: "a-provider",

    props: {

        pid: {

            type: String,

            default: "providerId",

        },

        tags: {

            type: Array,

            default: () => ["a_default_fragment"],

        },

        parentH: {

            type: Number,

            default: 2000,

        },

        parentW: {

            type: Number,

            default: 2000,

        },

    },

    components: {VueDragResize},

    data: () => {

        return {



            viewStatus: {

                closable: true,

                aider: false,

                buoyWidth: 10,

                animationSpeed: 30,

                connectId: undefined,

                inNode: false,

                animation: false,

                restrict: {

                    restrictDragStop: false,

                    restrictResizeStop: false,

                },

            },

            parentWSelf: 0,

            parentHSelf: 0,

            renderData: [],

            aiderLines: [],

            renderLines: [],

            eventStopList: [],

            modalY: 0,

            modalX: 0,

            render: null,

            renderKeyHooks: [],

            eventMap: {},

            controller: null,

            menu: null,

            aider: null,

            resp: null,

            lines: null,

        };

    },

    watch: {

        parentW: {

            handler(n) {

                this.parentWSelf = n;

            },

            immediate: true,

        },

        parentH: {

            handler(n) {

                this.parentHSelf = n;

            },

            immediate: true,

        },

    },

    mounted() {

        //注册事件

        this.resp = new Responder()

        //注册控制器

        this.controller = new Controller();

        this.render = new Render();

        this.aider = new Aider();

        this.lines = new Lines();

        this.render.watch(this.update);

        this.controller.setTags(this.tags);

        //pid禁止更改

        if (!this.pid) {

            throw new Error("PID 必须为truth类型的数据存在");

        }

        this.controller.bindId(this.pid);

    },

    methods: {

        sceneSubscribe(e, c) {

            this.toSubscribe(e, c, _SCENE)

        },

        removeAllNode() {

            this.controller.remove()

            this.controller.updateView()

        },

        outputInstance() {

            return this

        },

        changeLineColorByNodeAId(nodeId, color) {

            this.lines.changeSomeParamsByNodeAId(nodeId, 'lineColor', color || 'black')

        },

        /**

         * 依赖线查找关系

         */

        findRelationShip() {

        },

        changeFloatPointColor(color) {

            this.lines.changePointColor(color);

            this.renderLines = this.lines.getLines();

        },

        changeLineWidth(width) {

            this.lines.changeLineWidth(width);

            this.renderLines = this.lines.getLines();

        },

        changeLineColor(color) {

            this.lines.changeLineColor(color);

            this.renderLines = this.lines.getLines();

        },

        clearInstance() {

            this.controller.clearInstance();

            this.render.clearInstance();

            this.aider.clearInstance();

            this.lines.clearInstance();

            this.aider = null;

            this.render = null;

            this.lines = null;

            this.controller = null;

        },

        amplification(px) {

            if (typeof px === "number") {

                this.controller.amplification(px);

                this.syncPosition();

                this.getAllData().map(item => {

                    this.eventRun(_EVENTS._RS, {item}, item.id);

                })

            } else {

                throw new Error("放大参数需要是number");

            }

        },

        narrow(px) {

            if (typeof px === "number") {

                this.controller.narrow(px);

                this.syncPosition();

                this.getAllData().map(item => {

                    this.eventRun(_EVENTS._RS, {item}, item.id);

                })

            } else {

                throw new Error("缩小参数需要是number");

            }

        },

        sharkHiddenNodes() {

            return this.renderData.filter((i) => i.v);

        },

        getAllData() {

            return this.renderData;

        },

        getAllLines() {

            return this.renderLines;

        },

        lineClick(item, event) {

            if (item.willDelete) {

                this.lines.deleteById(item.id);

                this.updateLine();

            }

            this.targetFocus({id: NaN, tag: this.tags[0]});

            this.eventRun(_EVENTS._LC, {item, event}, item.id);

        },

        updateLine() {

            this.calibration();

            this.renderLines = this.lines.getLines();

        },

        closeAnimation() {

            this.viewStatus.animation = false;

            this.lines.deleteAnimation();

            this.renderLines = this.lines.getLines()

        },

        openAnimation(speed = 30, buoyWidth = 10) {

            this.viewStatus.animationSpeed = speed

            this.viewStatus.buoyWidth = buoyWidth

            this.viewStatus.animation = true

            if (this.viewStatus.animation) {

                this.renderLines = this.lines.computedLinePathTotal(speed, buoyWidth)

            }

        },

        createLine(aid, zid, params) {

            this.lines.createLine(aid, zid, params);

            this.updateLine();

        },

        removeHooks(fn) {

            if (typeof fn === 'function') {

                this.renderKeyHooks = this.renderKeyHooks.filter(fn)

            } else {

                this.renderKeyHooks = []

            }

        },

        firstBuildNode() {

            this.renderData.map(i => {

                const list = JSON.parse(JSON.stringify(this.renderKeyHooks))

                if (!list.includes(i.renderKey)) {

                    this.eventRun(_EVENTS._INIT, {item: i}, i.id)

                    this.resp.createNameSpace(_RESPONSE_NAMESPACE + i.id)

                    this.renderKeyHooks.push(i.renderKey)

                }

            })

        },

        //todo:应该确保每次firstBuildNode都在执行结尾

        update(items) {

            this.renderData = this.controller.compare(this.renderData, items);

            setTimeout(() => {

                this.firstBuildNode()

            }, 0)

        },

        calibration() {

            this.renderData.map((i) => this.updateLinesForNode(i));

        },

        drawEach(item) {

            const {c, m, tag, x, y, w, h, z, f = false} = item;

            this.controller.updateForDraw({

                c,

                m,

                tag,

                x,

                y,

                w,


                h,

                z,

                f,

            });

        },

        //绘制

        draw(data) {

            return new Promise((resolve) => {

                setTimeout(() => {

                    this.controller.onceDraw({data});

                    this.targetFocus({id: NaN, tag: this.tags[0]});

                    this.controller.syncOperation();

                    this.controller.updateView()

                }, 0)

                resolve()

            })

        },

        closeMenu(item) {

            if (this.menu) {

                if (this.viewStatus.closable) {

                    this.menu.style.visibility = "hidden";

                }

                this.eventRun(_EVENTS._MEU, {item}, item.id);

            }

        },

        onConnect(id, e) {

            if (e) {

                e.stopPropagation();

                this.controller.onConnect(id);

                this.viewStatus.connectId = id;

                this.eventRun(_EVENTS._CS, {id, e}, id);

            } else {

                throw new Error("你需要在connect函数内传入事件参数");

            }

        },

        clearBindConnect(id) {

            this.lines.deleteByNodeId(id);

            this.updateLine();

        },

        openCloseConnect(id, e) {

            const willSet = this.lines.getWillDeleteLineParams();

            this.closeConnectOperation(id, e, {

                ...willSet,

            });

        },

        getRef(id, fn) {

            if (id && typeof fn === 'function') {

                fn.call(this, this.$refs[id + 'ref'])

            }

            return this.$refs[id]

        },

        toCall(item) {

            this.eventRun(_EVENTS._UP_MSG_CALLBACK, {item}, item.id);

        },

        menuClosable(bool) {

            this.viewStatus.closable = !!bool

        },

        menuItemClick(item) {

            console.log(item, ' menuItemClick(item)')

            this.eventRun(_EVENTS._MIC, {item}, item.id);

            this.eventRun(_EVENTS._MIC, {item}, _SCENE);

        },

        overCloseConnect(id, e) {

            const normalParams = this.lines.getNormalLineParams();

            this.closeConnectOperation(id, e, {

                ...normalParams,

            });

        },

        closeConnectOperation(id, e, lineParams) {

            if (e) {

                e.stopPropagation();

                this.controller.closeConnect(id);

                const lines = this.lines.findLineByNodeId(id);

                lines.map((i) => {

                    this.lines.buildLineParamsById(i.id, {

                        ...lineParams,

                    });

                });

                this.updateLine();

            } else {

                throw new Error("你需要在closeConnect函数内传入事件参数");

            }

        },

        hasConnect() {

            return this.controller.hasConnect();

        },

        clearConnect() {

            this.controller.clearConnect();

            this.eventRun(_EVENTS._CC, undefined, '_closeConnect');

        },

        //与updateComponent 作用相同，免检

        updateComponentCheck(key, fn) {

            if (typeof fn === 'function') {

                this.controller.updateForChange(

                    (i) => {

                        if (!!key && key in i && key !== "renderData") {

                            const value = fn(i)

                            if (value.v === false) {

                                this.removeHooks(p => i.renderKey !== p)

                            }

                            return {

                                ...i,

                                [key]: value

                            };

                        } else {

                            return i

                        }

                    },

                    {tag: this.tags[0]}

                );

                this.syncPosition();

            }

        },

        // 向外暴露的更新方法，fn返回新的非数据即可  更新视图

        updateComponent(key, fn, tag) {

            if (typeof fn === "function") {

                this.controller.updateForChange(

                    (i) => {

                        if (!!key && key in i && key !== "renderData") {

                            const value = fn(i)

                            if (value.v === false) {

                                this.removeHooks(p => i.renderKey !== p)

                            }

                            return {

                                ...i,

                                [key]: value

                            };

                        } else {

                            return i

                        }

                    },

                    {tag}

                );

                this.syncPosition();

            }

        },

        //复制节点

        copyNode(nodeId) {

            const originNodes = this.getAllData().filter(i => i.id === nodeId)

            if (originNodes.length) {

                originNodes.map(i => {

                    this.controller.updateForCreate(i)

                })

            }

        },

        // 向外暴露的更新方法，fn返回新数据即可  更新数据

        updateData(fn, tag) {

            return new Promise((resolve) => {

                let rc = undefined

                this.controller.updateForChange(

                    (i) => {

                        if (fn(i)) {

                            rc = fn(i) || {}

                            return {...i, renderData: rc};

                        } else {

                            return i

                        }

                    },

                    {tag}

                );

                resolve(rc)

            })

        },

        //向外公布on方法与回调  操作

        on(event, callback, id) {

            const EVENTS = Object.values(_EVENTS);

            if (EVENTS.includes(event)) {

                if (typeof callback === "function") {

                    //覆盖事件

                    if (this.eventMap[event]) {

                        this.eventMap[event][id] = callback

                    } else {

                        this.eventMap[event] = {}

                        this.eventMap[event][id] = callback;

                    }

                    console.log(this.eventMap, 'this.eventMap')

                }

            }

        },

        getMsg(originFn, k, c) {

            if (typeof c === 'function' && typeof originFn === 'function') {

                const senders = this.getAllData().filter(originFn)

                senders.map(i => {

                    const a = this.resp.orientation(_RESPONSE_NAMESPACE + k.id)

                    a && a.acceptRecipient(k.id)

                        .directSender(i.id)

                        .subscribe((params) => {

                            c(params)

                        })

                    a && a.clear()

                })

            }

        },

        toMsg(item, fn, params) {

            if (typeof fn === 'function') {

                const targetIdS = this.getAllData().filter(fn)

                if (targetIdS.length) {

                    targetIdS.map(i => {

                        this.resp.orientation(_RESPONSE_NAMESPACE + i.id)

                            .createPromoter(String(item.id))

                            .createRecipient(String(i.id))

                            .message({

                                params

                            })

                            .notify()

                            .run({

                                receiver: String(i.id),

                                sender: String(item.id)

                            })

                    })

                }

            }

        },

        toSubscribe(e, c, id) {

            //console.log(e, c, id, 'toS')

            this.on(e, c, id);

        },

        areaClick(event) {

            if (!this.viewStatus.inNode) {

                this.clearConnect();

                this.targetFocus({id: NaN, tag: this.tags[0]});

                this.eventRun(_EVENTS._AC, {event}, '_areaClick');

            }

        },

        syncLinePosition(fn, params, item) {

            if (typeof fn === "function") {

                const {left: x, top: y, height: h, width: w} = params;

                this.updateLinesForNode({

                    x,

                    w,

                    y,

                    h,

                    id: item.id,

                });

                fn();

                this.renderLines = this.lines.getLines();

            }

        },

        resizing(item, params) {

            if (!this.viewStatus.restrict.restrictResizeStop) {

                const {left: x, top: y, height: h, width: w} = params;

                this.syncLinePosition(

                    () => {

                        this.updateItemForStaticData({w, h, f: true}, item, false);

                        this.aiderComputed(item);

                        this.recommendAider({x, y, w, h});

                        this.eventRun(_EVENTS._RI, {item}, item.id);

                    },

                    params,

                    item

                );

            }

        },

        dragging(item, params) {

            if (!this.viewStatus.restrict.restrictDragStop) {

                const {left: x, top: y, height: h, width: w} = params;

                this.syncLinePosition(

                    () => {

                        this.updateItemForStaticData({x, y, f: true}, item, false);

                        this.aiderComputed(item);

                        this.recommendAider({x, y, w, h});

                        this.eventStop([_EVENTS._HO, _EVENTS._LE]);

                        this.eventRun(_EVENTS._DI, {item}, item.id);

                    },

                    params,

                    item

                );

            }

        },

        precision(item, params) {

            return (

                Math.abs(item.x - params.left) < 5 && Math.abs(item.y - params.top) < 5

            );

        },

        changeRestrictDragStop(state) {

            this.viewStatus.restrict.restrictDragStop = !!state;

        },

        changeRestrictResizeStop(state) {

            this.viewStatus.restrict.restrictResizeStop = !!state;

        },

        dragStop(item, params) {

            console.log('dragStop')

            if (!this.viewStatus.restrict.restrictDragStop) {

                this.updateItemForStaticData(

                    {w: params.width, h: params.height, x: params.left, y: params.top, f: true},

                    item,

                    true

                );

                this.adsorption({

                    id: item.id,

                    x: params.left,

                    y: params.top,

                    w: params.width,

                    h: params.height,

                });

                this.clearAider();

                this.eventRun(_EVENTS._DS, {item}, item.id);

                this.reStartEvent([_EVENTS._HO, _EVENTS._LE]);

            }

            this.changeRestrictDragStop(false);

            if (this.viewStatus.animation) {

                this.closeAnimation()

                this.openAnimation(this.viewStatus.animationSpeed, this.viewStatus.buoyWidth)

            }

        },

        closeRestrict() {

            this.changeRestrictDragStop(false);

            this.changeRestrictResizeStop(false);

        },

        leave(item, event) {

            this.viewStatus.inNode = false;

            this.eventRun(_EVENTS._LE, {item, event}, item.id);

        },

        hover(item, event) {

            this.viewStatus.inNode = true;

            this.eventRun(_EVENTS._HO, {item, event}, item.id);

        },

        resizeStop(item, params) {

            if (!this.viewStatus.restrict.restrictResizeStop) {

                this.updateItemForStaticData(

                    {w: params.width, h: params.height, x: params.left, y: params.top, f: true},

                    item,

                    true

                );

                this.clearAider();

                this.eventRun(_EVENTS._RS, {item}, item.id);

            }

            this.changeRestrictResizeStop(false);

            if (this.viewStatus.animation) {

                this.closeAnimation()

                this.openAnimation(this.viewStatus.animationSpeed, this.viewStatus.buoyWidth)

            }

        },

        updateItemForStaticData(newItem, item, sync) {

            this.controller.updateForChange(

                (i) => {

                    return i.id === item.id ? {...i, ...newItem} : i;

                },

                {tag: item.tag},

                !!sync

            );

        },

        computedParentScroll(id) {

            let scrollX = document.getElementById(id).scrollLeft || 0

            let scrollY = document.getElementById(id).scrollTop || 0

            return {scrollX, scrollY}

        },



        contextmenu(item, e) {

            this.closeMenu(item);

            console.log(e, document.getElementById(item.providerContainerId || this.pid), 'e')

            this.menu = document.getElementById(`menu${item.id}`);

            const {width, height} = window.getComputedStyle(this.menu, null)



            if (e.pageX + parseFloat(width) >= window.innerWidth) {

                this.menu.style.left = window.innerWidth - parseFloat(width) + "px";

            } else {

                this.menu.style.left = e.pageX + "px";

            }

            if (e.pageY + parseFloat(height) >= window.innerHeight) {

                this.menu.style.top = window.innerHeight - parseFloat(height) + "px";

            } else {

                this.menu.style.top = e.pageY + "px";

            }

            this.menu.style.visibility = "visible";

        },

        eventRun(event, params, id) {

            if (

                this.eventMap[event] && typeof this.eventMap[event][id] === "function" &&

                !this.isEventStop(event)

            ) {

                this.eventMap[event][id](params);

            }

        },

        isEventStop(event) {

            return this.eventStopList.includes(event);

        },

        eventStop(events) {

            this.eventStopList = this.eventStopList.concat(events);

        },

        reStartEvent(events) {

            if (Array.isArray(events) && events.length) {

                this.eventStopList = this.eventStopList.filter(

                    (i) => !events.includes(i)

                );

            } else {

                this.eventStopList = [];

            }

        },

        click(item) {

            if (this.viewStatus.connectId) {

                this.createLine(this.viewStatus.connectId, item.id, {

                    width: 4,

                    isDashed: true,

                });

                this.viewStatus.connectId = undefined;

                this.clearConnect();

            }

            this.targetFocus(item);

            this.eventRun(_EVENTS._CL, {item}, item.id);

            // this.closeRestrict()

        },

        targetFocus(item) {

            console.log(item, 'itemtargetFocus')

            this.controller.updateForChange(

                (i) => {

                    return {...i, f: i.id === item.id};

                },

                {tag: item.tag}

            );

            this.closeMenu(item);

        },

        undo() {

            //undo期间不可以使用aider辅助线，因为会导致死循环！

            //限制视图同步数据导致异常备份

            this.changeRestrictResizeStop(true);

            this.changeRestrictDragStop(true);

            if (!this.viewStatus.aider) {

                this.controller.undo().then(() => {

                    this.syncPosition();

                    this.getAllData().map(item => {

                        this.eventRun(_EVENTS._RS, {item}, item.id);

                    })

                });

            }

            return !this.viewStatus.aider;

        },

        syncPosition() {

            this.renderData.map((i) => {

                const right = this.parentWSelf - i.x - i.w;

                const bottom = this.parentHSelf - i.y - i.h;

                if (this.$refs[`VDR${i.id}`][0]) {

                    this.$refs[`VDR${i.id}`][0].left = i.x;

                    this.$refs[`VDR${i.id}`][0].top = i.y;

                    this.$refs[`VDR${i.id}`][0].right = right;

                    this.$refs[`VDR${i.id}`][0].bottom = bottom;

                }

                this.updateLinesForNode(i);

            });

            this.updateLine();

            // this.closeRestrict()q

        },

        updateLinesForNode(args) {

            const {x, w, y, h, id} = args;

            const moveCenterX = x + w / 2;

            const moveCenterY = y + h / 2;

            const role = this.lines.checkRole(id);

            const newCoordinate =

                role === "A"

                    ? {x1: moveCenterX, y1: moveCenterY}

                    : {x3: moveCenterX, y3: moveCenterY};

            this.lines.syncMove(id, newCoordinate);

        },

        clearAider() {

            this.aiderLines = [];

        },

        clearRenderData() {

            this.controller.clear()

        },

        clearHistory() {

            this.controller.clearShots()

        },

        openAider() {

            this.viewStatus.aider = true;

        },

        closeAider() {

            this.viewStatus.aider = false;

            this.clearAider();

        },



        //推荐辅助线

        recommendAider(item, spaceNumber = 5, tipColor = "red") {

            const {x, y, h, w} = item;

            const basePosition = [

                {value: x, label: _CONSTVARS._LS},

                {value: x + w, label: _CONSTVARS._RS},

                {value: y, label: _CONSTVARS._TS},

                {value: y + h, label: _CONSTVARS._BS},

            ];

            if (this.viewStatus.aider) {

                this.aiderLines = this.aiderLines.map((i) => {

                    const cur = JSON.parse(JSON.stringify(i));

                    basePosition.map((k, kIndex) => {

                        if (kIndex < 2) {

                            //base X

                            if (

                                i.baseArrow === _CONSTVARS._X &&

                                Math.floor(Math.abs(k.value - i.base)) <= spaceNumber

                            ) {

                                cur.lineColor = tipColor;

                                cur.response = true;

                                cur.space = Math.floor(k.value - i.base);

                                cur.inRange = k.value - i.base <= 0;

                                cur.position = k.label;

                            }

                        } else {

                            //base Y

                            if (

                                i.baseArrow === _CONSTVARS._Y &&

                                Math.floor(Math.abs(k.value - i.base)) <= spaceNumber

                            ) {

                                cur.lineColor = tipColor;

                                cur.response = true;

                                cur.space = Math.floor(k.value - i.base);

                                cur.inRange = k.value - i.base <= 0;

                                cur.position = k.label;

                            }

                        }

                    });

                    return cur;

                });

            }

        },

        //自动吸附

        adsorption(params) {

            const rec = this.aiderLines.filter((i) => i.response);

            const newBaseXRec = [];

            const newBaseYRec = [];

            rec.map((i) => {

                if (i.baseArrow === _CONSTVARS._X) {

                    newBaseXRec.push(i);

                } else if (i.baseArrow === _CONSTVARS._Y) {

                    newBaseYRec.push(i);

                }

            });

            const XYRecs = [

                {label: _CONSTVARS._X, value: newBaseXRec},

                {label: _CONSTVARS._Y, value: newBaseYRec},

            ];

            XYRecs.map((i) => {

                const {value, label} = i;

                const length = value.length;

                if (length) {

                    let currentMin = value[0].space;

                    let position = value[0];

                    for (let j = 0; j < length; j++) {

                        if (Math.abs(value[j].space) < Math.abs(currentMin)) {

                            currentMin = value[j].space;

                            position = value[j];

                        }

                    }

                    const {inRange, space} = position;

                    if (label === _CONSTVARS._X) {

                        this.adsorptionX({id: params.id, inRange, space, x: params.x});

                    } else if (label === _CONSTVARS._Y) {

                        this.adsorptionY({id: params.id, inRange, space, y: params.y});

                    }

                }

            });

        },

        adsorptionBaseComputed(inRange, space, position) {

            return !inRange ? position - Math.abs(space) : position + Math.abs(space);

        },

        adsorptionChange(args, position) {

            if ([_CONSTVARS._Y, _CONSTVARS._X].includes(position)) {

                const {id, inRange, space} = args;

                const adsorption = this.adsorptionBaseComputed(

                    inRange,

                    space,

                    args[position]

                );

                this.controller.updateForChange(

                    (i) => {

                        if (id === i.id) {

                            return {...i, [position]: adsorption};

                        } else {

                            return i;

                        }

                    },

                    {tag: this.tags[0]}

                );

            }

        },

        adsorptionX(args) {

            this.adsorptionChange(args, _CONSTVARS._X);

        },

        adsorptionY(args) {

            this.adsorptionChange(args, _CONSTVARS._Y);

        },

        //计算辅助线

        aiderComputed(item) {

            const {id} = item;

            if (this.viewStatus.aider) {

                this.clearAider();

                this.aider.computeAiderLines();

                const lines = this.aider.getAiderLines();

                const container = document.getElementById(this.pid);

                const {height, width} = window.getComputedStyle(container, null);

                this.renderData.map((i) => {

                    if (id !== i.id) {

                        const {xR, xL, yT, yB} = lines[String(i.id)];

                        const position = [xR, xL, yT, yB];

                        position.map((k, kIndex) => {

                            if (kIndex < 2) {

                                this.aiderLines.push({

                                    base: k,

                                    baseArrow: _CONSTVARS._X,

                                    id: i.id,

                                    x1: k,

                                    y1: 0,

                                    x2: k,

                                    y2: parseFloat(height),

                                    lineColor: "",

                                    response: false,

                                    space: undefined,

                                    //inRange标识操作项的接触边是否在推荐线内，即 接触边的x小于推荐边

                                    inRange: undefined,

                                    position: undefined,

                                });

                            } else {

                                this.aiderLines.push({

                                    base: k,

                                    baseArrow: _CONSTVARS._Y,

                                    id: i.id,

                                    x1: 0,

                                    y1: k,

                                    x2: parseFloat(width),

                                    y2: k,

                                    lineColor: "",

                                    response: false,

                                    space: undefined,

                                    direction: undefined,

                                    //inRange标识操作项的接触边是否在推荐线内，即 接触边的y小于推荐边

                                    inRange: undefined,

                                    position: undefined,

                                });

                            }

                        });

                    }

                });

            }

        },

        del() {

            this.controller.getRenderData().map((i) => {

                this.controller.updateForDelete({id: i.id, tag: i.tag});

            });

        },

        remove() {

            if (this.controller) {

                this.controller.remove();

                this.clearInstance();

            }

        },

    },

};

</script>



<style scoped>

.provider-class {

    position: absolute;

}



.svgC {

    width: 100%;

    height: 100%;

    position: absolute;

}



svg {

    display: block;

    position: absolute;

}



svg .line1 {

    stroke-dasharray: 340;

    stroke-dashoffset: 40;

    animation: dash 10s linear infinite forwards;

}



svg .line2 {

    stroke-dasharray: 320;

    stroke-dashoffset: 320;

    animation: dash2 10s linear infinite forwards;

}



@keyframes dash {

    from {

        stroke-dashoffset: 360;

    }

    to {

        stroke-dashoffset: 40;

    }

}



@keyframes dash2 {

    from {

        stroke-dashoffset: 280;

    }

    to {

        stroke-dashoffset: -40;

    }

}

</style>
