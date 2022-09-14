<template>
  <div :id="pid" class="provider-class" :style="{width:parentW+'px',height:parentH+'px'}"
       @click.stop.prevent="areaClick">
    <div v-for="(k,i) in renderData"
         :key="i"
         @contextmenu.prevent="(e)=>contextmenu(k,e)"
         @mouseover.prevent="(e)=>hover(k,e)"
         @mouseleave.prevent="e=>leave(k,e)"
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
          :parentH="parentH"
          :parentW="parentW"
          :parentLimitation="true"
          @dragging="(params)=>dragging(k,params)"
          @dragstop="(params)=>dragStop(k,params)"
          @resizing="(params)=>resizing(k,params)"
          @resizestop="(params)=>resizeStop(k,params)"
          @clicked="(params)=>click(k,params)"
      >
        <component
            :is="k.c"
            :thisData="k"
            :updateData="updateData"
            :change="updateComponent"
            :connect="(e)=>onConnect(k.id,e)"
            :closeConnect="(e)=>closeConnect(k.id,e)"
            :clearConnect="()=>clearBindConnect(k.id)"
            :style="{filter:`${k.shadow}`}"
        ></component>
      </VueDragResize>
      <div :id="`menu${k.id}`"
           style="visibility: hidden;z-index: 99999999;position: absolute;min-width: 100px;min-height: 100px"
           @mouseup="closeMenu"
      >
        <component
            :is="k.m"
            :thisData="k"
            :updateData="updateData"
            :change="updateComponent"
            :clearConnect="()=>clearBindConnect(k.id)"
            :connect="(e)=>onConnect(k.id,e)"
            :closeConnect="(e)=>closeConnect(k.id,e)"
        ></component>
      </div>
    </div>
    <div id="aiderLinesContainer" class="svgC">
      <svg width="100%" height="100%">
        <line
            v-for="(i,k) in aiderLines"
            :key="k"
            :x1="i.x1"
            :y1="i.y1"
            :x2="i.x2"
            :y2="i.y2"
            :style="{stroke:i.lineColor ,strokeWidth: '1px',strokeDasharray:'5,5'}"
        ></line>
      </svg>
    </div>
    <div id="renderLine" class="svgC">
      <svg width="100%" height="100%">
        <a v-for="(i,k) in renderLines"
           :key="k"
           :id="i.id"
           @click.stop="(e)=>lineClick(i,e)">
          <path
              :d="`M${i.x1||0} ${i.y1||0} Q ${i.x2||0} ${i.y2||0} ${i.x3||0} ${i.y3||0}`"
              :style="{stroke:i.lineColor ,strokeWidth: i.width+'px',strokeDasharray:i.isDashed?'5,5':''}"
              stroke="black" fill="transparent"/>
        </a>
      </svg>
    </div>
  </div>
</template>

<script>
import {Controller} from "../controller/controller";
import {Render} from "../render/render";
import VueDragResize from "vue-drag-resize";
import {Aider} from "../aider/aider";
import {Lines} from "../lines/lines";

const _CONSTVARS = {
  _Y: 'y',
  _X: 'x',
  _TS: 'topSide',
  _LS: 'leftSide',
  _RS: 'rightSide',
  _BS: 'bottomSide'
}
const _EVENTS = {
  _CS: 'connectStart',
  _CI: 'connectIng',
  _CE: 'connectEnd',
  _CC: 'closeAllConnect',
  //鼠标放起
  _MU: 'mouseUp',
  //连线点击
  _LC: 'lineClick',
  //组件点击
  _CL: 'componentClick',
  //组件拖动中
  _DI: 'dragging',
  //组件拖动结束
  _DS: 'dragStop',
  //组件缩放中
  _RI: 'resizing',
  //面板点击
  _AC: 'areaClick',
  //组件缩放结束
  _RS: 'resizeStop',
  //组件鼠标悬浮
  _HO: 'hover',
  //鼠标离开组件上
  _LE: 'leave'
}
export default {
  name: "a-provider",
  props: {
    pid: {
      type: String,
      default: 'providerId'
    },
    tags: {
      type: Array,
      default: () => ['a_default_fragment']
    },
    parentH: {
      type: Number,
      default: 2000
    },
    parentW: {
      type: Number,
      default: 2000
    }
  },
  components: {VueDragResize},
  data: () => {
    return {
      viewStatus: {
        aider: false,
        connectId: undefined,
        inNode: false,
        restrict: {
          restrictDragStop: false,
          restrictResizeStop: false,
        },
      },
      renderData: [],
      aiderLines: [],
      renderLines: [],
      eventStopList: [],
      render: null,
      eventMap: {},
      controller: null,
      menu: null,
      aider: null,
      lines: null
    }
  },
  mounted() {
    //注册控制器
    this.controller = new Controller()
    this.render = new Render()
    this.aider = new Aider()
    this.lines = new Lines()
    this.render.watch(this.update)
    this.controller.setTags(this.tags)
    //pid禁止更改
    if (!this.pid) {
      throw new Error('PID 必须为truth类型的数据存在')
    }
    this.controller.bindId(this.pid)

  },
  methods: {
    clearInstance() {
      this.controller.clearInstance()
      this.render.clearInstance()
      this.aider.clearInstance()
      this.lines.clearInstance()
      this.aider = null
      this.render = null
      this.lines = null
      this.controller = null
    },
    sharkHiddenNodes() {
      return this.renderData.filter(i => i.v)
    },
    compare(data) {
      console.log(data, this.renderData, 'd')
      if (Array.isArray(data)) {
        const iLength = data.length
        const jLength = this.renderData.length
        if (iLength > jLength) {
          const jIds = this.renderData.map(i => i.id)
          this.renderData = data.map(i => {
            return {...i, firstMounted: !jIds.includes(i.id)}
          })
        } else if (iLength === jLength) {
          for (let i = 0; i < iLength; i++) {
            const {id: iId} = data[i]
            for (let j = 0; j < jLength; j++) {
              const {id: jId} = this.renderData[j]
              if (iId === jId) {
                console.log(data[i], iId, 'datai')
                this.renderData[j].x = data[i].x
                this.renderData[j].y = data[i].y
                this.renderData[j].w = data[i].w
                this.renderData[j].h = data[i].h
                this.renderData[j].f = data[i].f
                this.renderData[j].v = data[i].v
                this.renderData[j].z = data[i].z
                this.renderData[j].shadow = data[i].shadow
              }
            }
          }
        } else {
          this.renderData = data
        }
      }
      console.log(this.renderData, 'rf')
    },
    lineClick(item, event) {
      if (item.willDelete) {
        this.lines.deleteById(item.id)
        this.updateLine()
      }
      this.targetFocus({id: NaN, tag: this.tags[0]})
      this.eventRun(_EVENTS._LC, {item, event})
    },
    updateLine() {
      this.calibration()
      this.renderLines = this.lines.getLines()
    },
    createLine(aid, zid, params) {
      this.lines.createLine(aid, zid, params)
      this.updateLine()
      console.log(this.renderData, this.renderLines, 'this.renderLines')
    },
    update(items) {
      console.log('render')
      this.compare(items)
    },
    calibration() {
      this.renderData.map(i => this.updateLinesForNode(i))
    },
    drawEach(item) {
      const {c, m, tag, x, y, w, h, z, f = false} = item
      this.controller.updateForDraw({
        c,
        m,
        tag,
        x,
        y,
        w,
        h,
        z,
        f
      })
    },
    //绘制
    draw(data) {
      console.log(data, 'data')
      this.controller.onceDraw({data})
      this.controller.syncOperation()
    },
    closeMenu() {
      if (this.menu) {
        this.menu.style.visibility = 'hidden'
      }
    },
    onConnect(id, e) {
      if (e) {
        e.stopPropagation()
        this.controller.onConnect(id)
        this.viewStatus.connectId = id
        this.eventRun(_EVENTS._CS, {id, e})
      } else {
        throw new Error('你需要在connect函数内传入事件参数')
      }
    },
    clearBindConnect(id) {
      this.lines.deleteByNodeId(id)
      this.updateLine()
    },
    closeConnect(id, e) {
      if (e) {
        e.stopPropagation()
        this.controller.closeConnect(id)
        const lines = this.lines.findLineByNodeId(id)
        console.log(lines, 'line')
        lines.map(i => {
          this.lines.buildLineParamsById(i.id, {
            lineColor: 'red',
            willDelete: true,
          })
        })
        this.updateLine()
      } else {
        throw new Error('你需要在closeConnect函数内传入事件参数')
      }
    },
    hasConnect() {
      return this.controller.hasConnect()
    },
    clearConnect() {
      this.controller.clearConnect()
      this.eventRun(_EVENTS._CC)
    },
    // 向外暴露的更新方法，fn返回新的非数据即可  更新视图
    updateComponent(key, fn, tag) {
      if (typeof fn === 'function') {
        this.controller.updateForChange((i) => {
          if (!!key && key in i && key !== 'renderData') {
            return {...i, [key]: fn(i) || {}}
          }
        }, {tag})
      }
    },
    // 向外暴露的更新方法，fn返回新数据即可  更新数据
    updateData(fn, tag) {
      this.controller.updateForChange((i) => {
        return {...i, renderData: fn(i) || {}}
      }, {tag})
    },
    //向外公布on方法与回调  操作
    on(event, callback) {
      const EVENTS = Object.values(_EVENTS)
      if (EVENTS.includes(event)) {
        if (typeof callback === 'function') {
          //覆盖事件
          this.eventMap[event] = callback
        }
      }
    },
    areaClick(event) {
      if (!this.viewStatus.inNode) {
        console.log('area cvlick')
        this.clearConnect()
        this.targetFocus({id: NaN, tag: this.tags[0]})
        this.eventRun(_EVENTS._AC, {event})
      }
    },
    syncLinePosition(fn, params, item) {
      if (typeof fn === 'function') {
        const {left: x, top: y, height: h, width: w} = params
        this.updateLinesForNode({
          x,
          w,
          y,
          h,
          id: item.id
        })
        fn()
      }
    },
    resizing(item, params) {
      if (!this.viewStatus.restrict.restrictResizeStop) {
        const {left: x, top: y, height: h, width: w} = params
        this.syncLinePosition(() => {
          this.updateItemForStaticData({w, h, f: true}, item, false)
          this.aiderComputed(item)
          this.recommendAider({x, y, w, h})
          this.eventRun(_EVENTS._RI, {item})
        }, params, item)
      }
    },
    dragging(item, params) {
      if (!this.viewStatus.restrict.restrictDragStop) {
        const {left: x, top: y, height: h, width: w} = params
        this.syncLinePosition(() => {
          this.updateItemForStaticData({x, y, f: true}, item, false)
          this.aiderComputed(item)
          this.recommendAider({x, y, w, h})
          this.eventStop([_EVENTS._HO, _EVENTS._LE])
          this.eventRun(_EVENTS._DI, {item})
        }, params, item)
      }
      console.log('di')
    },
    precision(item, params) {
      return Math.abs(item.x - params.left) < 5 && Math.abs(item.y - params.top) < 5
    },
    changeRestrictDragStop(state) {
      this.viewStatus.restrict.restrictDragStop = !!state
    },
    changeRestrictResizeStop(state) {
      this.viewStatus.restrict.restrictResizeStop = !!state
    },
    dragStop(item, params) {
      if (!this.viewStatus.restrict.restrictDragStop) {
        this.updateItemForStaticData({x: params.left, y: params.top, f: true}, item, true)
        this.adsorption({id: item.id, x: params.left, y: params.top, w: params.width, h: params.height})
        this.clearAider()
        this.eventRun(_EVENTS._DS, {item})
        this.reStartEvent([_EVENTS._HO, _EVENTS._LE])
      }
      this.changeRestrictDragStop(false)
      console.log('ds')
    },
    closeRestrict() {
      console.log('click')
      this.changeRestrictDragStop(false)
      this.changeRestrictResizeStop(false)
    },
    leave(item, event) {
      this.viewStatus.inNode = false
      this.eventRun(_EVENTS._LE, {item, event})
    },
    hover(item, event) {
      this.viewStatus.inNode = true
      this.eventRun(_EVENTS._HO, {item, event})
    },
    resizeStop(item, params) {
      if (!this.viewStatus.restrict.restrictResizeStop) {
        this.updateItemForStaticData({w: params.width, h: params.height, f: true}, item, true)
        this.clearAider()
        this.eventRun(_EVENTS._RS, {item})
      }
      this.changeRestrictResizeStop(false)
    },
    updateItemForStaticData(newItem, item, sync) {
      console.log(newItem, item, 'ni')
      this.controller.updateForChange((i) => {
        console.log({...i, ...newItem}, '{...i, ...newItem}')
        return i.id === item.id ? {...i, ...newItem} : i
      }, {tag: item.tag}, !!sync)
    },
    contextmenu(item, e) {
      this.closeMenu()
      const {left, top} = window.getComputedStyle(document.getElementById(this.pid), null)
      this.menu = document.getElementById(`menu${item.id}`)
      this.menu.style.left = e.pageX - parseFloat(left || '0px') + 'px'
      this.menu.style.top = e.pageY - parseFloat(top || '0px') + 'px'
      this.menu.style.visibility = 'visible'
    },
    eventRun(event, params) {
      if (typeof this.eventMap[event] === 'function' && !this.isEventStop(event)) {
        this.eventMap[event](params)
      }
    },
    isEventStop(event) {
      return this.eventStopList.includes(event)
    },
    eventStop(events) {
      this.eventStopList = this.eventStopList.concat(events)
    },
    reStartEvent(events) {
      if (Array.isArray(events) && events.length) {
        this.eventStopList = this.eventStopList.filter(i => !events.includes(i))
      } else {
        this.eventStopList = []
      }
    },
    click(item) {
      console.log(item, 'selfclick')
      if (this.viewStatus.connectId) {
        this.createLine(this.viewStatus.connectId, item.id, {width: 4, isDashed: true})
        this.viewStatus.connectId = undefined
        this.clearConnect()
        console.log(this.renderLines, 'rs')
      }
      this.targetFocus(item)
      this.eventRun(_EVENTS._CL, {item})
    },
    targetFocus(item) {
      this.controller.updateForChange((i) => {
        return {...i, f: i.id === item.id}
      }, {tag: item.tag})
      this.closeMenu()
    },
    undo() {
      //undo期间不可以使用aider辅助线，因为会导致死循环！
      //限制视图同步数据导致异常备份
      this.changeRestrictResizeStop(true)
      this.changeRestrictDragStop(true)
      if (!this.viewStatus.aider) {
        this.controller.undo().then(() => {
          this.syncPosition()
          console.log(this.renderData, 'this.renderData')
        })
      }
      return !this.viewStatus.aider
    },
    syncPosition() {
      this.renderData.map(i => {
        console.log(i, 'i')
        const right = this.parentW - i.x - i.w
        const bottom = this.parentH - i.y - i.h
        this.$refs[`VDR${i.id}`][0].left = i.x
        this.$refs[`VDR${i.id}`][0].top = i.y
        this.$refs[`VDR${i.id}`][0].right = right
        this.$refs[`VDR${i.id}`][0].bottom = bottom
        this.updateLinesForNode(i)
      })
      // this.closeRestrict()
    },
    updateLinesForNode(args) {
      const {x, w, y, h, id} = args
      const moveCenterX = x + w / 2
      const moveCenterY = y + h / 2
      const role = this.lines.checkRole(id)
      const newCoordinate = role === 'A' ? {x1: moveCenterX, y1: moveCenterY} : {x3: moveCenterX, y3: moveCenterY}
      this.lines.syncMove(id, newCoordinate)
    },
    clearAider() {
      this.aiderLines = []
    },
    openAider() {
      this.viewStatus.aider = true
    },
    closeAider() {
      this.viewStatus.aider = false
      this.clearAider()
    },

    //推荐辅助线
    recommendAider(item, spaceNumber = 5, tipColor = 'red') {
      const {x, y, h, w} = item
      const basePosition = [
        {value: x, label: _CONSTVARS._LS},
        {value: x + w, label: _CONSTVARS._RS},
        {value: y, label: _CONSTVARS._TS},
        {value: y + h, label: _CONSTVARS._BS},
      ]
      if (this.viewStatus.aider) {
        this.aiderLines = this.aiderLines.map(i => {
          const cur = JSON.parse(JSON.stringify(i))
          basePosition.map((k, kIndex) => {
            if (kIndex < 2) {
              //base X
              if (i.baseArrow === _CONSTVARS._X && Math.floor(Math.abs(k.value - i.base)) <= spaceNumber) {
                cur.lineColor = tipColor
                cur.response = true
                cur.space = Math.floor(k.value - i.base)
                cur.inRange = k.value - i.base <= 0
                cur.position = k.label
              }
            } else {
              //base Y
              if (i.baseArrow === _CONSTVARS._Y && Math.floor(Math.abs(k.value - i.base)) <= spaceNumber) {
                cur.lineColor = tipColor
                cur.response = true
                cur.space = Math.floor(k.value - i.base)
                cur.inRange = k.value - i.base <= 0
                cur.position = k.label
              }
            }
          })
          return cur
        })
      }
    },
    //自动吸附
    adsorption(params) {
      const rec = this.aiderLines.filter(i => i.response)
      const newBaseXRec = []
      const newBaseYRec = []
      rec.map(i => {
        if (i.baseArrow === _CONSTVARS._X) {
          newBaseXRec.push(i)
        } else if (i.baseArrow === _CONSTVARS._Y) {
          newBaseYRec.push(i)
        }
      })
      const XYRecs = [{label: _CONSTVARS._X, value: newBaseXRec}, {label: _CONSTVARS._Y, value: newBaseYRec}]
      XYRecs.map((i) => {
        const {value, label} = i
        const length = value.length
        if (length) {
          let currentMin = value[0].space
          let position = value[0]
          for (let j = 0; j < length; j++) {
            if (Math.abs(value[j].space) < Math.abs(currentMin)) {
              currentMin = value[j].space
              position = value[j]
            }
          }
          const {inRange, space} = position
          if (label === _CONSTVARS._X) {
            this.adsorptionX({id: params.id, inRange, space, x: params.x})
          } else if (label === _CONSTVARS._Y) {
            this.adsorptionY({id: params.id, inRange, space, y: params.y})
          }
        }
      })
    },
    adsorptionBaseComputed(inRange, space, position) {
      return !inRange ? position - Math.abs(space) : position + Math.abs(space)
    },
    adsorptionChange(args, position) {
      if ([_CONSTVARS._Y, _CONSTVARS._X].includes(position)) {
        const {id, inRange, space} = args
        const adsorption = this.adsorptionBaseComputed(inRange, space, args[position])
        this.controller.updateForChange((i) => {
          if (id === i.id) {
            return {...i, [position]: adsorption}
          } else {
            return i
          }
        }, {tag: this.tags[0]})
      }
    },
    adsorptionX(args) {
      this.adsorptionChange(args, _CONSTVARS._X)
    },
    adsorptionY(args) {
      this.adsorptionChange(args, _CONSTVARS._Y)
    },
    //计算辅助线
    aiderComputed(item) {
      const {id} = item
      if (this.viewStatus.aider) {
        this.clearAider()
        this.aider.computeAiderLines()
        const lines = this.aider.getAiderLines()
        const container = document.getElementById(this.pid)
        const {height, width} = window.getComputedStyle(container, null)
        this.renderData.map(i => {
          if (id !== i.id) {
            const {xR, xL, yT, yB} = lines[String(i.id)]
            const position = [xR, xL, yT, yB]
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
                  lineColor: '',
                  response: false,
                  space: undefined,
                  //inRange标识操作项的接触边是否在推荐线内，即 接触边的x小于推荐边
                  inRange: undefined,
                  position: undefined,
                })
              } else {
                this.aiderLines.push({
                  base: k,
                  baseArrow: _CONSTVARS._Y,
                  id: i.id,
                  x1: 0,
                  y1: k,
                  x2: parseFloat(width),
                  y2: k,
                  lineColor: '',
                  response: false,
                  space: undefined,
                  direction: undefined,
                  //inRange标识操作项的接触边是否在推荐线内，即 接触边的y小于推荐边
                  inRange: undefined,
                  position: undefined,
                })
              }
            })
          }
        })
      }
    },
    del() {
      this.controller.getRenderData().map(i => {
        this.controller.updateForDelete({id: i.id, tag: i.tag})
      })
    },
    remove() {
      this.controller.remove()
      this.clearInstance()
    }
  }
}
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
