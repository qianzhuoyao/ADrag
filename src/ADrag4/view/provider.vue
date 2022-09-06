<template>
  <div :id="pid" class="provider-class" :style="{width:parentW+'px',height:parentH+'px'}" @click="areaClick">
    <!--    <div @click="undo">undo</div>-->
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
          @dragging="()=>dragging(k)"
          @dragstop="(params)=>dragStop(k,params)"
          @resizing="()=>resizing(k)"
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
  </div>
</template>

<script>
import {Controller} from "@/ADrag4/controller/controller";
import {Render} from "@/ADrag4/render/render";
import VueDragResize from "vue-drag-resize";
import menuContext from 'vue-context'

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
      renderData: [],
      render: null,
      eventMap: {},
      controller: null
    }
  },
  mounted() {
    //注册控制器
    this.controller = new Controller()
    this.render = new Render()
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
    resizing(item) {
      this.eventRun('resizing', item)
    },
    dragging(item) {
      this.eventRun('dragging', item)
    },
    precision(item, params) {
      return Math.abs(item.x - params.left) < 5 && Math.abs(item.y - params.top) < 5
    },
    dragStop(item, params) {
      this.updateItemForStaticData({x: params.left, y: params.top}, item, !this.precision(item, params))
      this.eventRun('dragStop', item)
    },
    hover(item, event) {
      this.eventRun('hover', item, event)
    },
    resizeStop(item, params) {
      this.updateItemForStaticData({w: params.width, h: params.height}, item, !this.precision(item, params))
      this.eventRun('resizeStop', item)
    },
    updateItemForStaticData(newItem, item, sync) {
      console.log(newItem, 'ni')
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
    del() {
      console.log(' this.controller', this.controller.getRenderData())
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
</style>
