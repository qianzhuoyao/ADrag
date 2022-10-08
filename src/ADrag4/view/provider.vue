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
          :isActive="!!k.cf&&k.f"
          :parentH="parentHSelf"
          :parentW="parentWSelf"
          :parentLimitation="true"
          :isResizable="!!k.cf"
          @dragging="(params) => dragging(k, params)"
          @dragstop="(params) => dragStop(k, params)"
          @resizing="(params) => resizing(k, params)"
          @resizestop="(params) => resizeStop(k, params)"
          @clicked="(params) => click(k, params)"
      >
        <template>
          <div @mousedown="closeRestrict" :style="{background:k.nodeBackgroundColor}">
            <component
                :is="k.c"
                :thisData="k"
                :updateData="updateData"
                :change="updateComponent"
                :connect="(e) => onConnect(k.id, e)"
                :closeConnect="(e) => openCloseConnect(k.id, e)"
                :closeOver="(e) => overCloseConnect(k.id, e)"
                :clearConnect="() => clearBindConnect(k.id)"
                :style="{ filter: `${k.shadow}` }"
            ></component>
          </div>
        </template>
      </VueDragResize>
      <div
          :id="`menu${k.id}`"
          style="
          visibility: hidden;
          z-index: 99999999;
          position: absolute;
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
            :menuItemClick="menuItemClick"
        ></component>
      </div>
    </div>
    <div id="aiderLinesContainer" class="svgC">
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
import {Controller} from "@/ADrag4/controller/controller";
import {Render} from "@/ADrag4/render/render";
import VueDragResize from "vue-drag-resize";

const _CONSTVARS = {
  _Y: "y",
  _X: "x",
  _TS: "topSide",
  _LS: "leftSide",
  _RS: "rightSide",
  _BS: "bottomSide",
};
const _EVENTS = {
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
    modalOffsetY: {
      type: Number,
      default: 0,
    },
    modalOffsetX: {
      type: Number,
      default: 0,
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
      eventMap: {},
      controller: null,
      menu: null,
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
    modalOffsetX: {
      handler(n) {
        this.modalX = n;
      },
      immediate: true,
    },
    modalOffsetY: {
      handler(n) {
        this.modalY = n;
      },
      immediate: true,
    },
  },
  mounted() {
    //注册控制器
    this.controller = new Controller();
    this.render = new Render();
    this.render.watch(this.update);
    this.controller.setTags(this.tags);
    //pid禁止更改
    if (!this.pid) {
      throw new Error("PID 必须为truth类型的数据存在");
    }
    this.controller.bindId(this.pid);
  },
  methods: {
    /**
     * 更新动点颜色
     * @param color
     */
    changeFloatPointColor(color) {
      this.controller.changePointColorInLine(color)
      this.renderLines = this.controller.getLines();
    },
    /**
     * 更新线条宽度
     * @param width
     */
    changeLineWidth(width) {
      this.controller.changeLineWidth(width);
      this.renderLines = this.controller.getLines();
    },
    /**
     * 更新线条颜色
     * @param color
     */
    changeLineColor(color) {
      this.controller.changeLineColor(color);
      this.renderLines = this.controller.getLines();
    },
    /**
     * 清空控制器，此时操作逻辑将失效
     */
    clearInstance() {
      this.controller.clearInstance();
      this.render.clearInstance();
      this.render = null;
      this.controller = null;
    },
    /**
     * 放大
     * @param px
     */
    amplification(px) {
      if (typeof px === "number") {
        this.controller.amplification(px);
        this.syncPosition();
      } else {
        throw new Error("放大参数需要是number");
      }
    },
    /**
     * 缩小
     * @param px
     */
    narrow(px) {
      if (typeof px === "number") {
        this.controller.narrow(px);
        this.syncPosition();
      } else {
        throw new Error("缩小参数需要是number");
      }
    },
    /**
     * 获取有效节点
     * @returns {*[]}
     */
    sharkHiddenNodes() {
      return this.renderData.filter((i) => i.v);
    },
    /**
     * 获取所有节点
     * @returns {[]}
     */
    getAllData() {
      return this.renderData;
    },
    /**
     * 获取所有线
     * @returns {[]}
     */
    getAllLines() {
      return this.renderLines;
    },
    /**
     * 线条点击
     * @param item
     * @param event
     */
    lineClick(item, event) {
      if (item.willDelete) {
        this.controller.deleteLineById(item.id);
        this.updateLine();
      }
      this.targetFocus({id: NaN, tag: this.tags[0]});
      this.eventRun(_EVENTS._LC, {item, event});
    },
    /**
     * 更新线条并规整后绘制
     */
    updateLine() {
      this.calibration();
      this.renderLines = this.controller.getLines();
    },
    /**
     * 关闭动画
     */
    closeAnimation() {
      this.viewStatus.animation = false;
      this.controller.deleteLineFloatAnimation();
      this.renderLines = this.controller.getLines()
    },
    /**
     * 开启动画
     * @param speed
     * @param buoyWidth
     */
    openAnimation(speed = 30, buoyWidth = 10) {
      this.viewStatus.animationSpeed = speed
      this.viewStatus.buoyWidth = buoyWidth
      this.viewStatus.animation = true
      if (this.viewStatus.animation) {
        this.renderLines = this.controller.computedLinePathTotal(speed, buoyWidth)
      }
    },
    /**
     * 新建线
     * @param aid
     * @param zid
     * @param params
     */
    createLine(aid, zid, params) {
      this.controller.createLine(aid, zid, params);
      this.updateLine();
    },
    /**
     * 统一更新视图
     * @param items
     */
    update(items) {
      setTimeout(() => {
        this.renderData = this.controller.compare(this.renderData, items);
        if (this.$options.components.VueDragResize.default) {
          this.$options.components.VueDragResize = this.$options.components.VueDragResize.default
        }
      }, 0)
    },
    /**
     * 规整线条
     */
    calibration() {
      this.renderData.map((i) => this.updateLinesForNode(i));
    },
    /**
     * 同步获取数据
     * @returns {Promise<unknown>}
     */
    syncGetRenderData() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.renderData)
        }, 0)
      })
    },
    /**
     * 绘制单个节点
     * @param item
     */
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
    /**
     * 批量绘制节点
     * @param data
     */
    draw(data) {
      this.controller.onceDraw({data});
      this.targetFocus({id: NaN, tag: this.tags[0]});
      this.controller.syncOperation();
    },
    /**
     * 关闭菜单
     * @param item
     */
    closeMenu(item) {
      if (this.menu) {
        this.menu.style.visibility = "hidden";
        this.eventRun(_EVENTS._MEU, {item});
      }
    },
    /**
     * 开始连线
     * @param id
     * @param e
     */
    onConnect(id, e) {
      if (e) {
        e.stopPropagation();
        this.controller.onConnect(id);
        this.viewStatus.connectId = id;
        this.eventRun(_EVENTS._CS, {id, e});
      } else {
        throw new Error("你需要在connect函数内传入事件参数");
      }
    },
    /**
     * 清楚连线
     * @param id
     */
    clearBindConnect(id) {
      this.controller.deleteLineByNodeId(id);
      this.updateLine();
    },
    /**
     * 开启取消连线的状态，此时你可以点击单条线进行删除
     * @param id
     * @param e
     */
    openCloseConnect(id, e) {
      const willSet = this.controller.getWillDeleteLineParams();
      this.closeConnectOperation(id, e, {
        ...willSet,
      });
    },
    /**
     * 菜单点击
     * @param item
     */
    menuItemClick(item) {
      this.eventRun(_EVENTS._MIC, {item});
    },
    /**
     * 结束单条线删除状态
     * @param id
     * @param e
     */
    overCloseConnect(id, e) {
      const normalParams = this.controller.getNormalLineParams();
      this.closeConnectOperation(id, e, {
        ...normalParams,
      });
    },
    /**
     * 关闭连接动作
     * @param id
     * @param e
     * @param lineParams
     */
    closeConnectOperation(id, e, lineParams) {
      if (e) {
        e.stopPropagation();
        this.controller.closeConnect(id);
        const lines = this.controller.findLineByNodeId(id);
        lines.map((i) => {
          this.controller.buildLineParamsById(i.id, {
            ...lineParams,
          });
        });
        this.updateLine();
      } else {
        throw new Error("你需要在closeConnect函数内传入事件参数");
      }
    },
    /**
     * 视图是否具备线
     * @returns {*}
     */
    hasConnect() {
      return this.controller.hasConnect();
    },
    /**
     * 删除所有连线
     */
    clearConnect() {
      this.controller.clearConnect();
      this.eventRun(_EVENTS._CC);
    },
    //与updateComponent 作用相同，免检
    updateComponentCheck(key, fn) {
      if (typeof fn === 'function') {
        this.controller.updateForChange(
            (i) => {
              if (!!key && key in i && key !== "renderData") {
                return {
                  ...i,
                  [key]: fn(i)
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
                return fn(i);
              } else {
                return i
              }
            },
            {tag}
        );
        this.syncPosition();
      }
    },
    /**
     * 重绘视图
     */
    reRender() {
      this.controller.updateView()
    },
    // 向外暴露的更新方法，fn返回新数据即可  更新数据
    updateData(fn, tag) {
      this.controller.updateForChange(
          (i) => {
            if (fn(i)) {
              return {...i, renderData: fn(i) || {}};
            } else {
              return i
            }
          },
          {tag}
      );
    },
    //向外公布on方法与回调  操作
    on(event, callback) {
      const EVENTS = Object.values(_EVENTS);
      if (EVENTS.includes(event)) {
        if (typeof callback === "function") {
          //覆盖事件
          this.eventMap[event] = callback;
        }
      }
    },
    toSubscribe(e, c) {
      this.on(e, c);
    },
    /**
     * 空白面板点击
     * @param event
     */
    areaClick(event) {
      if (!this.viewStatus.inNode) {
        this.clearConnect();
        this.targetFocus({id: NaN, tag: this.tags[0]});
        this.eventRun(_EVENTS._AC, {event});
      }
    },
    /**
     * 同步线的初始与结束点位置
     * @param fn
     * @param params
     * @param item
     */
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
        this.renderLines = this.controller.getLines();
      }
    },
    /**
     * 节点大小操作中回调
     * @param item
     * @param params
     */
    resizing(item, params) {
      if (!this.viewStatus.restrict.restrictResizeStop) {
        const {left: x, top: y, height: h, width: w} = params;
        this.syncLinePosition(
            () => {
              this.updateItemForStaticData({w, h, f: !!item.cf}, item, false);
              this.aiderComputed(item);
              this.recommendAider({x, y, w, h});
              this.eventRun(_EVENTS._RI, {item});
            },
            params,
            item
        );
      }
    },
    /**
     * 移动中回调
     * @param item
     * @param params
     */
    dragging(item, params) {
      if (!this.viewStatus.restrict.restrictDragStop) {
        const {left: x, top: y, height: h, width: w} = params;
        this.syncLinePosition(
            () => {
              this.updateItemForStaticData({x, y, f: !!item.cf}, item, false);
              this.aiderComputed(item);
              this.recommendAider({x, y, w, h});
              this.eventStop([_EVENTS._HO, _EVENTS._LE]);
              this.eventRun(_EVENTS._DI, {item});
            },
            params,
            item
        );
      }
    },
    /**
     * 有效误差
     * @param item
     * @param params
     * @returns {boolean}
     */
    precision(item, params) {
      return (
          Math.abs(item.x - params.left) < 5 && Math.abs(item.y - params.top) < 5
      );
    },
    /**
     * 拖拽条件
     * @param state
     */
    changeRestrictDragStop(state) {
      this.viewStatus.restrict.restrictDragStop = !!state;
    },
    /**
     * 尺寸变化条件
     * @param state
     */
    changeRestrictResizeStop(state) {
      this.viewStatus.restrict.restrictResizeStop = !!state;
    },
    /**
     * 拖拽结束回调
     * @param item
     * @param params
     */
    dragStop(item, params) {
      if (!this.viewStatus.restrict.restrictDragStop) {
        this.updateItemForStaticData(
            {x: params.left, y: params.top, f: !!item.cf},
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
        this.eventRun(_EVENTS._DS, {item});
        this.reStartEvent([_EVENTS._HO, _EVENTS._LE]);
      }
      this.changeRestrictDragStop(false);
      if (this.viewStatus.animation) {
        this.closeAnimation()
        this.openAnimation(this.viewStatus.animationSpeed, this.viewStatus.buoyWidth)
      }
    },
    /**
     * 取消拖拽与尺寸变化限制
     */
    closeRestrict() {
      this.changeRestrictDragStop(false);
      this.changeRestrictResizeStop(false);
    },
    /**
     * 鼠标离开节点回调
     * @param item
     * @param event
     */
    leave(item, event) {
      this.viewStatus.inNode = false;
      this.eventRun(_EVENTS._LE, {item, event});
    },
    /**
     * 鼠标悬浮在节点状态
     * @param item
     * @param event
     */
    hover(item, event) {
      this.viewStatus.inNode = true;
      this.eventRun(_EVENTS._HO, {item, event});
    },
    /**
     * 尺寸变化结束
     * @param item
     * @param params
     */
    resizeStop(item, params) {
      if (!this.viewStatus.restrict.restrictResizeStop) {
        this.updateItemForStaticData(
            {w: params.width, h: params.height, f: !!item.cf},
            item,
            true
        );
        this.clearAider();
        this.eventRun(_EVENTS._RS, {item});
      }
      this.changeRestrictResizeStop(false);
      if (this.viewStatus.animation) {
        this.closeAnimation()
        this.openAnimation(this.viewStatus.animationSpeed, this.viewStatus.buoyWidth)
      }
    },
    /**
     * 绑定数据与节点，在节点移动时同步操作记录
     * @param newItem
     * @param item
     * @param sync
     */
    updateItemForStaticData(newItem, item, sync) {
      this.controller.updateForChange(
          (i) => {
            return i.id === item.id ? {...i, ...newItem} : i;
          },
          {tag: item.tag},
          !!sync
      );
    },
    /**
     * 菜单栏
     * @param item
     * @param e
     */
    contextmenu(item, e) {
      this.closeMenu();
      const {left, top, height: pHeight, width: pWidth} = window.getComputedStyle(
          document.getElementById(this.pid),
          null
      );
      this.menu = document.getElementById(`menu${item.id}`);
      const {width, height} = window.getComputedStyle(
          this.menu,
          null
      )
      let offsetX = e.pageX - parseFloat(left || "0px") - this.modalX
      let offsetY = e.pageY - parseFloat(top || "0px") - this.modalY
      if (offsetX + parseFloat(width) > parseFloat(pWidth)) {
        offsetX = parseFloat(pWidth) - parseFloat(width)
      }
      if (offsetY + parseFloat(height) > parseFloat(pHeight)) {
        offsetY = parseFloat(pHeight) - parseFloat(height)
      }
      this.menu.style.left =
          offsetX + "px";
      this.menu.style.top =
          offsetY + "px";
      this.menu.style.visibility = "visible";
    },
    /**
     * 事件指执行
     * @param event
     * @param params
     */
    eventRun(event, params) {
      if (
          typeof this.eventMap[event] === "function" &&
          !this.isEventStop(event)
      ) {
        this.eventMap[event](params);
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
      this.eventRun(_EVENTS._CL, {item});
      // this.closeRestrict()
      setTimeout(()=>{
        console.log( this.$refs[`VDRnode0`],'d')
      },0)
    },
    targetFocus(item) {
      this.controller.updateForChange(
          (i) => {
            return {...i, f:!!item.cf&&(i.id === item.id)};
          },
          {tag: item.tag}
      );
      this.closeMenu();
    },
    undo() {
      //undo期间不可以使用aider辅助线，因为会导致死循环！
      //限制视图同步数据导致异常备份
      this.changeRestrictResizeStop(true);
      this.changeRestrictDragStop(true);
      if (!this.viewStatus.aider) {
        this.controller.undo().then(() => {
          this.syncPosition();
        });
      }
      return !this.viewStatus.aider;
    },
    syncPosition() {
      this.renderData.map((i) => {
        const right = this.parentWSelf - i.x - i.w;
        const bottom = this.parentHSelf - i.y - i.h;
        this.$refs[`VDR${i.id}`][0].left = i.x;
        this.$refs[`VDR${i.id}`][0].top = i.y;
        this.$refs[`VDR${i.id}`][0].right = right;
        this.$refs[`VDR${i.id}`][0].bottom = bottom;
        this.updateLinesForNode(i);
      });
      this.updateLine();
      // this.closeRestrict()q
    },
    updateLinesForNode(args) {
      const {x, w, y, h, id} = args;
      const moveCenterX = x + w / 2;
      const moveCenterY = y + h / 2;
      const role = this.controller.checkLineRole(id);
      const newCoordinate =
          role === "A"
              ? {x1: moveCenterX, y1: moveCenterY}
              : {x3: moveCenterX, y3: moveCenterY};
      this.controller.syncLinesForNodeMove(id, newCoordinate);
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
        this.controller.computeAiderLines();
        const lines = this.controller.getAiderLines();
        const container = document.getElementById(this.pid);
        const {height, width} = window.getComputedStyle(container, null);
        console.log(lines, 'lines')
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
      this.controller.remove();
      this.clearInstance();
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
</style>
