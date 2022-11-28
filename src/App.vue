<template>
  <!--  <div>-->
  <!--    <div @click="aiderComputed">aider开启</div>-->
  <!--    <div @click="aiderClear">aider关闭</div>-->
  <!--    <div @click="undo">undo</div>-->
  <!--    <div @click="zoomOut">放大</div>-->
  <!--    <div @click="zoomIn">缩小</div>-->
  <!--    <div @click="opA">开启线动画（建议关闭动画期间拖拽，否则会有点卡顿）</div>-->
  <!--    <div @click="clA">关闭线动画</div>-->
  <!--    <fragment-->
  <!--        tag="1"-->
  <!--        render-key="123"-->
  <!--        :put-component="components[0]"-->
  <!--        :modal-component="components[2]"-->
  <!--        :default-component-height="30"-->
  <!--        :default-component-width="30"-->
  <!--        :default-can-focus="false"-->
  <!--        :put-offset-x="10"-->
  <!--        :put-offset-y="20"-->
  <!--        :move-offset-y="0"-->
  <!--        :move-offset-x="0"-->
  <!--        :default-component-z-index="999"-->
  <!--        @fragmentDown="fragmentDown"-->
  <!--        @fragmentMove="fragmentMove"-->
  <!--        @fragmentOver="fragmentOver"-->
  <!--    >-->
  <!--      <template #display>-->
  <!--        <div>拖拽我</div>-->
  <!--      </template>-->
  <!--      <template #hide>-->
  <!--        <div>我在被拖拽</div>-->
  <!--      </template>-->
  <!--    </fragment>-->
  <!--    <provider ref="provider"-->
  <!--              :tags="['1']"-->
  <!--              :modal-offset-x="0"-->
  <!--              :modal-offset-y="0"-->
  <!--              style="background: antiquewhite;top:300px;overflow: hidden">-->
  <!--    </provider>-->
  <!--  </div>-->
  <div>
    <div @click="()=>noFeeze=!noFeeze">change</div>
    <div id='A' style="width: 10px;height: 10px;background: red"></div>
    <div id='B' style="width: 10px;height: 10px;background: greenyellow"></div>
    <div v-for="(k,key) in Object.values(nodes)" :key="key">
      <VueDragResize
          v-if="noFeeze"
          :ref="`VDR${k.id}`"
          :x="k.body.value.x"
          :y="k.body.value.y"
          :w="k.body.value.w"
          :h="k.body.value.h"
          :z="k.body.value.z"
          @dragstop="drager"
      >{{ JSON.stringify(k) }}
      </VueDragResize>
      <div
          v-else
          :style="{position:'absolute',width:k.body.value.w+'px',height:k.body.value.h+'px',left:k.body.value.x+'px',top:k.body.value.y+'px'}">
        {{ JSON.stringify(k) }}
      </div>
    </div>
  </div>
</template>

<script>
// import fragment from "@/ADrag4/view/fragment";
// import provider from "@/ADrag4/view/provider";
// import drag from '@/component/d'
// import o from '@/component/o'
// import f from '@/component/p'
import {data} from "@/ADrag4/model/requestModel";
import {config} from "@/ADrag4/config/config";
import {Container} from "@/ADrag6/publicProvider/container";
import {buildEvent} from "@/ADrag6/service/modify";
import VueDragResize from "vue-drag-resize";
// import {reducer, buildCustomOrder} from "@/ADrag6/controller/make";
/**
 * 自定义命令用法
 * buildCustomOrder({
 *   order1:'...'
 * })
 * reducer((i,s,o,p,b)=>{
 * if(o===order1){
 *   s.xxx
 * }
 *   ....
 * })
 */
export default {
  name: "App",
  components: {VueDragResize},
  data: () => {
    return {
      nodes: {},
      noFeeze: false,
      a:null,
      // aider: false,
      // components: [drag, o, f],
    };
  },
  mounted() {
    // reducer((instance, service, order, payload, orderMap)=>{
    //       if()
    // })
    this.a = new Container()
    // a.createNode({a: 1})
    // a.createNode({b: 1})
    // console.log(a.findNode('node-0'), 'find')
    // setTimeout(() => {
    //   //a.clearNode()
    //   a.updateNode('node-1', {b: 2})
    //   console.log(a.getAll(), 'new Container().getAll()end')
    // }, 2000)
    // console.log(a.getAll(), 'new Container().getAll()start')
    const event = buildEvent({
      downCallback: () => {
        console.log('down')
      },
      moveCallback: () => {
        console.log('move')
      },
      overCallback: (e) => {
        console.log(e, 'over')
        this.a.createNode(
            {
              x: e.pageX,
              y: e.pageY,
              a: 1,
              w: 100,
              h: 100,
              z: 100
            }
        )
        //a.updateNode('node-0', {b: 2})
        this.nodes = this.a.getAll()
        console.log(this.a.getAll(), 'new Container().getAll()start')
      }
    })
    event(document.getElementById('A'), document.getElementById('B'))
    // this.beforeStart()
    // this.$refs.provider.on('componentClick', (o) => {
    //   console.log(o, 'componentClick')
    // })
    // this.$refs.provider.on('dragging', (o) => {
    //   console.log(o, 'dragging')
    // })
    // this.$refs.provider.on('dragStop', (o) => {
    //   console.log(o, 'dragStop')
    // })
    // this.$refs.provider.on('resizing', (o) => {
    //   console.log(o, 'resizing')
    // })
    // this.$refs.provider.on('areaClick', (o) => {
    //   console.log(o, 'areaClick')
    // })
    // this.$refs.provider.on('resizeStop', (o) => {
    //   console.log(o, 'resizeStop')
    // })
    // this.$refs.provider.on('hover', (o) => {
    //   console.log(o, 'hover')
    // })
    // this.$refs.provider.on('leave', (o) => {
    //   console.log(o, 'leave')
    // })
    // this.$refs.provider.on('lineClick', (o) => {
    //   console.log(o, 'lineClick')
    // })
    // this.$refs.provider.on('menuItemClick', (o) => {
    //   console.log(o, 'menuItemClick')
    // })
  },
  methods: {
    drager(params){
      console.log(params,'params')
      const {left: x, top: y, height: h, width: w} = params;
      this.a.updateNode('node-0',
          {
            x,
            y,
            a: 2,
            w,
            h,
            z: 100
          })
      this.nodes = this.a.getAll()
    },
    clA() {
      this.$refs.provider.closeAnimation()
    },
    opA() {
      this.$refs.provider.openAnimation(100, 10)
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
    async beforeStart() {
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
          cf: i.cf
        }
      })
      this.$refs.provider.draw(draw)
      const nodes = await this.$refs.provider.syncGetRenderData()
      console.log(nodes, nodes[0], nodes[1], 'nodes')
      this.$refs.provider.createLine(nodes[0].id, nodes[1].id, {width: 4, isDashed: true})
      this.$refs.provider.createLine(nodes[1].id, nodes[2].id, {width: 4, isDashed: true})

    }
  },

};
</script>

<style>
</style>
