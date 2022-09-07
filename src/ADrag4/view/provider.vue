<template>
  <div :id="pid" class="provider-class" :style="{width:parentW+'px',height:parentH+'px'}" @click="areaClick">
    <div v-for="(k,i) in renderData"
         :key="i"
         @click.stop="()=>click(k)"
         @contextmenu.prevent="(e)=>contextmenu(k,e)"
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
          @mouseover="(e)=>hover(k,e)"
      >
        <component
            :is="k.c"
            :thisData="k"
            :updateData="updateData"
        ></component>
      </VueDragResize>
      <menuContext :ref="`ref${k.id}`" style="z-index: 99999999;position: absolute">
        <component
            :is="k.m"
            :thisData="k"
            :updateData="updateData"
        ></component>
      </menuContext>
    </div>
    <div id="aiderLinesContainer" class="linesAider">
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
  </div>
</template>

<script>
import {Controller} from "@/ADrag4/controller/controller";
import {Render} from "@/ADrag4/render/render";
import VueDragResize from "vue-drag-resize";
import menuContext from 'vue-context'
import {Aider} from "@/ADrag4/aider/aider";

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
  components: {VueDragResize, menuContext},
  data: () => {
    return {
      viewStatus: {
        aider: false,
      },
      renderData: [],
      aiderLines: [],
      render: null,
      eventMap: {},
      controller: null,
      aider: null,
    }
  },
  mounted() {
    //注册控制器
    this.controller = new Controller()
    this.render = new Render()
    this.aider = new Aider()
    this.render.watch(this.update)
    this.controller.setTags(this.tags)
    //pid禁止更改
    if (!this.pid) {
      throw new Error('PID 必须为truth类型的数据存在')
    }
    this.controller.bindId(this.pid)
  },
  methods: {
    update(items) {
      //console.log(items, 'ffffrender')
      this.renderData = items
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
      data.map(i => {
        this.drawEach(i)
      })
      this.controller.syncOperation()
    },
    // 向外暴露的更新方法，fn返回新数据即可  更新数据
    updateData(fn, tag) {
      this.controller.updateForChange((i) => {
        return {...i, renderData: fn(i) || {}}
      }, {tag})
    },
    //向外公布on方法与回调  操作
    on(event, callback) {
      const EVENTS = ['dragging', 'dragStop', 'resizing', 'areaClick', 'resizeStop', 'componentClick', 'hover']
      if (EVENTS.includes(event)) {
        if (typeof callback === 'function') {
          //覆盖事件
          this.eventMap[event] = callback
        }
      }
    },
    areaClick(e) {
      this.click({id: NaN, tag: this.tags[0]})
      this.eventRun('areaClick', e)
    },
    resizing(item, params) {
      const {left: x, top: y, height: h, width: w} = params
      this.updateItemForStaticData({w, h}, item, false)
      this.aiderComputed(item)
      this.recommendAider({x, y, w, h})
      this.eventRun('resizing', item)
    },
    dragging(item, params) {
      const {left: x, top: y, height: h, width: w} = params
      this.updateItemForStaticData({x, y}, item, false)
      this.aiderComputed(item)
      this.recommendAider({x, y, w, h})
      this.adsorption(item)
      this.eventRun('dragging', item)
    },
    precision(item, params) {
      return Math.abs(item.x - params.left) < 5 && Math.abs(item.y - params.top) < 5
    },
    dragStop(item, params) {
      this.updateItemForStaticData({x: params.left, y: params.top}, item, true)
      this.clearAider()
      this.eventRun('dragStop', item)
    },
    hover(item, event) {
      this.eventRun('hover', item, event)
    },
    resizeStop(item, params) {
      this.updateItemForStaticData({w: params.width, h: params.height}, item, true)
      this.clearAider()
      this.eventRun('resizeStop', item)
    },
    updateItemForStaticData(newItem, item, sync) {
      this.controller.updateForChange((i) => {
        return i.id === item.id ? {...i, ...newItem} : i
      }, {tag: item.tag}, !!sync)
    },
    contextmenu(item, e) {
      this.$refs[`ref${item.id}`][0].open(e)
    },
    eventRun(event, params) {
      if (typeof this.eventMap[event] === 'function') {
        this.eventMap[event](params)
      }
    },
    click(item) {
      this.controller.updateForChange((i) => {
        return {...i, f: i.id === item.id}
      }, {tag: item.tag})
      this.eventRun('componentClick', item)
    },
    undo() {
      this.controller.undo()
      //由于vuedragresize组件存在的异常同步位置问题，需要再次手动同步位置
      this.syncPosition()
    },
    syncPosition() {
      this.renderData.map(i => {
        const right = this.parentW - i.x - i.w
        const bottom = this.parentH - i.y - i.h
        this.$refs[`VDR${i.id}`][0].left = i.x
        this.$refs[`VDR${i.id}`][0].top = i.y
        this.$refs[`VDR${i.id}`][0].right = right
        this.$refs[`VDR${i.id}`][0].bottom = bottom
      })
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
    recommendAider(item, spaceNumber = 0, tipColor = 'red') {
      const {x, y, h, w} = item
      const baseItem = [x, x + w, y, y + h]
      if (this.viewStatus.aider) {
        this.aiderLines = this.aiderLines.map(i => {
          const cur = JSON.parse(JSON.stringify(i))
          console.log(baseItem, 'baseItem')
          baseItem.map((k, kIndex) => {
            if (kIndex < 2) {
              //base X
              if (i.baseArrow === 'x' && Math.floor(Math.abs(k - i.base)) <= spaceNumber) {
                cur.lineColor = tipColor
              }
            } else {
              //base Y
              if (i.baseArrow === 'y' && Math.floor(Math.abs(k - i.base)) <= spaceNumber) {
                cur.lineColor = tipColor
              }
            }
          })
          return cur
        })
      }
    },
    //自动吸附
    adsorption() {

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
                  baseArrow: 'x',
                  id: i.id,
                  x1: k,
                  y1: 0,
                  x2: k,
                  y2: parseFloat(height),
                  lineColor: ''
                })
              } else {
                this.aiderLines.push({
                  base: k,
                  baseArrow: 'y',
                  id: i.id,
                  x1: 0,
                  y1: k,
                  x2: parseFloat(width),
                  y2: k,
                  lineColor: ''
                })
              }
            })
          }
        })
      }
      console.log(this.aiderLines, 'aiderLines')
    },
    del() {
      this.controller.getRenderData().map(i => {
        this.controller.updateForDelete({id: i.id, tag: i.tag})
      })
    }
  }
}
</script>

<style scoped>
.provider-class {
  position: absolute;
}

.linesAider {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
