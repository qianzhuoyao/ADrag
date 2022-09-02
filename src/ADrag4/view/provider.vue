<template>
  <div :id="pid" class="provider-class" :style="{width:parentW+'px',height:parentH+'px'}" @click="areaClick">
    <!--    <div @click="del">删除</div>-->
    <div v-for="(k,i) in renderData"
         :key="i"
         @click.stop="()=>click(k)"
         @contextmenu.prevent="(e)=>contextmenu(k,e)"
    >
      <VueDragResize
          v-if="k.v"
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
          @dragstop="()=>dragStop(k)"
          @resizing="()=>resizing(k)"
          @resizestop="()=>resizeStop(k)"
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
      default: ''
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
      this.renderData = items
    },
    drawEach(item) {
      console.log(item, 'i')
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
      console.log(
          'area'
      )
      this.click({id: NaN, tag: this.tags[0]})
      this.eventRun('areaClick', e)
    },
    resizing(item) {
      this.eventRun('resizing', item)
    },
    dragging(item) {
      this.eventRun('dragging', item)
    },
    dragStop(item) {
      this.eventRun('dragStop', item)
    },
    resizeStop(item) {
      this.eventRun('resizeStop', item)
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
