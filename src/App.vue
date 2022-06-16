<template>
  <div style="position:absolute;">
    <div
        v-for="(i,k) in tems"
        :key="k"
    >
      <component
          :id="`copy${k}`"
          :is="i.copyInstanceBy"
      ></component>
      <component
          :id="`drag${k}`"
          :is="i.dragInstanceBy"></component>
      <div id="container" style="position: absolute;width: 1000px;height: 1000px;background: #2c3e50">
        <VueDragResize
            v-for="(k) in list"
            :key="k.id"
            :x="k.attribute.position.x-parseFloat(String(computeContainer().offsetLeft))"
            :y="k.attribute.position.y-parseFloat(String(computeContainer().offsetTop))"
            :w="k.attribute.size.width"
            :h="k.attribute.size.height"
            :z="k.attribute.zIndex"
            :isActive="k.focus"
            :parentH="parseFloat(String(computeContainer().styleOfHeight))"
            :parentW="parseFloat(String(computeContainer().styleOfWidth))"
            :parentLimitation="true"
            @clicked="acrossFunction(k.clickCallback,k)"
            @activated="acrossFunction(k.focusCallback,k)"
            @deactivated="acrossFunction(k.blurCallback,k)"
            @resizing="acrossFunction(k.resizingCallback,k)"
            @resizestop="acrossFunction(k.resizeStopCallback,k)"
            @dragging="acrossFunction(k.draggingCallback,k)"
            @dragstop="acrossFunction(k.dragStopCallback,k)"
        >
          <component
              v-if="k.visisble"
              :is="k.attribute.renderInstanceBy"
              :node="k"
          >
          </component>
        </VueDragResize>
      </div>
    </div>
  </div>
</template>

<script>
import {templates} from "@/draw/schedule";
import {PipeEvent} from "@/draw/event";
import VueDragResize from 'vue-drag-resize'

export default {
  name: 'App',
  components: {
    VueDragResize
  },
  data: () => {
    return {
      list: [],
      tems: [],
      renderObservable: {}
    }
  },
  methods: {
    acrossFunction(anything, params) {
      return typeof anything === 'function' ? anything.call(this, params) : () => {
      }
    },
    computeContainer() {
      const containerDOM = document.getElementById('container')
      const {
        width: styleOfWidth,
        height: styleOfHeight,
        left: offsetLeft,
        top: offsetTop
      } = window.getComputedStyle(containerDOM, null)
      return {styleOfWidth, styleOfHeight, offsetTop, offsetLeft}
    }
  },
  //同步写法:通过copy模板来构造节点
  //异步渲染:通过初始设置第一个可视，其他的hide(),然后通过调用node的waitOver()来通知继续渲染
  mounted() {
    this.tems = templates
    setTimeout(() => {
      this.tems.map((i, k) => {
        i.copy().then(n => {
          n.show()
          n.drag({
            x: 100,
            y: 100
          })
          n.resize({
            width: 100,
            height: 100,
          })
          n.setZIndex(999)
        })
        i.copy().then(n => {
          n.hide()
          n.drag({
            x: 200,
            y: 200
          })
          n.resize({
            width: 100,
            height: 100,
          })
          n.setZIndex(999)
        })
        i.copy().then(n => {
          n.hide()
          n.drag({
            x: 300,
            y: 300
          })
          n.resize({
            width: 100,
            height: 100,
          })
          n.setZIndex(999)
        })
         this.list = i.getNodes()
        console.log(this.list,'lisrt')
        // i.queueRenderOver((item) => {
        //   console.log(item.getNodes())
        // })
        //  i.getQueue().then(value=>{
        //    this.list = value
        //    console.log(value,'getnodessssss')
        //  })
        new PipeEvent().setCopyElement(`copy${k}`)
            .setDragElement(`drag${k}`)
            .dragElementHide()
            .pipeEventStart({
              downCallback: () => {
                console.log('down')
              },
              moveCallback: (pipeEvent) => {
                pipeEvent.dragElementShow()
              },
              overCallback: (pipeEvent, event) => {
                pipeEvent.dragElementHide()
                i.copy().then((newNode) => {
                  console.log(newNode, event.y, 'newNode')
                  newNode.drag({
                    x: event.x,
                    y: event.y
                  })
                  newNode.resize({
                    width: 100,
                    height: 100,
                  })
                  newNode.setZIndex(999)
                  return newNode
                }).then((node) => {
                  this.list.push(node)
                  //this.render()
                  console.log(node, 'nodes')
                })
                console.log(event)
              }
            })
      })
    }, 0)

  }
}
</script>

<style>
</style>
