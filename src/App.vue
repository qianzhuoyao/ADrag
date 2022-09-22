<template>
  <div>
    <div @click="aiderComputed">aider开启</div>
    <div @click="aiderClear">aider关闭</div>
    <div @click="undo">undo</div>
    <div @click="zoomOut">放大</div>
    <div @click="zoomIn">缩小</div>
    <div @click="opA">开启线动画（建议关闭动画期间拖拽，否则会有点卡顿）</div>
    <div @click="clA">关闭线动画</div>
    <fragment
        tag="1"
        render-key="123"
        :put-component="components[0]"
        :modal-component="components[2]"
        :default-component-height="100"
        :default-component-width="100"
        :put-offset-x="10"
        :put-offset-y="20"
        :move-offset-y="0"
        :move-offset-x="0"
        :default-component-z-index="999"
        @fragmentDown="fragmentDown"
        @fragmentMove="fragmentMove"
        @fragmentOver="fragmentOver"
    >
      <template #display>
        <div>拖拽我</div>
      </template>
      <template #hide>
        <div>我在被拖拽</div>
      </template>
    </fragment>
    <provider ref="provider"
              :tags="['1']"
              :modal-offset-x="0"
              :modal-offset-y="0"
              style="background: antiquewhite;top:300px;overflow: hidden">
    </provider>
  </div>
</template>

<script>
import fragment from "@/ADrag4/view/fragment";
import provider from "@/ADrag4/view/provider";
import drag from '@/component/d'
import o from '@/component/o'
import f from '@/component/p'
import {data} from "@/ADrag4/model/requestModel";
import {config} from "@/ADrag4/config/config";

export default {
  name: "App",
  components: {fragment, provider},
  data: () => {
    return {
      aider: false,
      components: [drag, o, f],
    };
  },
  mounted() {
    this.beforeStart()
    this.$refs.provider.on('componentClick', (o) => {
      console.log(o, 'componentClick')
    })
    this.$refs.provider.on('dragging', (o) => {
      console.log(o, 'dragging')
    })
    this.$refs.provider.on('dragStop', (o) => {
      console.log(o, 'dragStop')
    })
    this.$refs.provider.on('resizing', (o) => {
      console.log(o, 'resizing')
    })
    this.$refs.provider.on('areaClick', (o) => {
      console.log(o, 'areaClick')
    })
    this.$refs.provider.on('resizeStop', (o) => {
      console.log(o, 'resizeStop')
    })
    this.$refs.provider.on('hover', (o) => {
      console.log(o, 'hover')
    })
    this.$refs.provider.on('leave', (o) => {
      console.log(o, 'leave')
    })
    this.$refs.provider.on('lineClick', (o) => {
      console.log(o, 'lineClick')
    })
    this.$refs.provider.on('menuItemClick', (o) => {
      console.log(o, 'menuItemClick')
    })
  },
  methods: {
    clA() {
      this.$refs.provider.closeAnimation()
    },
    opA() {
      this.$refs.provider.openAnimation()
    },
    zoomOut() {
      this.$refs.provider.amplification(10)
    },
    zoomIn() {
      this.$refs.provider.narrow(10)
    },
    toConnect() {
    },
    undo() {
      this.$refs.provider.undo()
      if (this.aider) {
        this.$refs.provider.openAider()
      } else {
        this.$refs.provider.closeAider()
      }
    },
    aiderClear() {
      this.aider = false
      this.$refs.provider.closeAider()
    },
    aiderComputed() {
      this.aider = true
      this.$refs.provider.openAider()
    },
    fragmentMove(p) {
      console.log(p, 'fragmentMove')
    },
    fragmentDown(p) {
      console.log(p, 'fragmentDown')
    },
    fragmentOver(p) {
      console.log(p, 'fragmentOver')
    },
    beforeStart() {
      const {nameMap} = config
      const draw = data.map((i) => {
        return {
          c: nameMap[i.cMap],
          m: nameMap[i.mMap],
          tag: i.tag,
          x: i.x,
          y: i.y,
          w: i.w,
          h: i.h,
          z: i.z,
        }
      })
      this.$refs.provider.draw(draw)
      const nodes = this.$refs.provider.renderData
      this.$refs.provider.createLine(nodes[0].id, nodes[1].id, {width: 4, isDashed: true})
    }
  },

};
</script>

<style>
</style>
