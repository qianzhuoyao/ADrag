<template>
  <div
      id="scene-container"
      :style="{width:containerWidth+'px',height:containerHeight+'px'}"
      @contextmenu="sceneContextmenuClick"
  >
    <div v-for="(k,key) in Object.values(nodes)" :key="key">
      <VueDragResize
          :id="`VDR${k.key}`"
          :ref="`VDR${k.key}`"
          :z="k.body.value.z"
          :parentH="containerHeight"
          :parentW="containerWidth"
          :parentLimitation="true"
      >
        <component
            :is="scene.capture(k.body.value.type)"
            :keys="k.key"
        ></component>
      </VueDragResize>
    </div>
  </div>
</template>

<script>
import {Container} from "@/ADrag6/publicProvider/container";
import {additionDragEvent} from "@/ADrag6/service/modify";
import VueDragResize from "vue-drag-resize";


export default {
  name: "a-scene",
  components: {VueDragResize},
  props: {
    //映射表
    componentsMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    containerHeight: {
      type: Number,
      default: () => 0,
    },
    containerWidth: {
      type: Number,
      default: () => 0,
    }
  },
  data: () => {
    return {
      nodes: [],
      sceneId: "scene-container",
      sceneDOM: null,
      scene: null
    }
  },
  mounted() {
    this.scene = new Container(this.sceneId);
    this.sceneDOM = document.getElementById(this.sceneId)
    this.scene.templateMap(this.componentsMap);
  },
  methods: {
    sceneContextmenuClick(contextmenuEvent) {
      console.log(contextmenuEvent, 'contextmenuEvent')
    },
    init() {
      this.scene.decorate({
        downCallback: () => {
          console.log('down')
        },
        moveCallback: () => {
          console.log('move')
        },
        overCallback: (e) => {
          console.log(e, 'over')
          const name = this.a.createNode(
              {
                type: 'normalComponent',
                x: e.pageX,
                y: e.pageY,
                a: 1,
                w: 100,
                h: 100,
                z: 100
              }
          )
          setTimeout(() => {
            //容器-坐标-偏移量-组件长宽
            const right = 400 - e.pageX + this.scene.getOffset().left - 100;
            const bottom = 400 - e.pageY + this.scene.getOffset().top - 100;
            if (this.$refs[`VDR${name}`][0]) {
              this.$refs[`VDR${name}`][0].left = e.pageX - this.scene.getOffset().left;
              this.$refs[`VDR${name}`][0].top = e.pageY - this.scene.getOffset().top;
              this.$refs[`VDR${name}`][0].right = right;
              this.$refs[`VDR${name}`][0].bottom = bottom;
            }
            let downX = undefined
            let downY = undefined
            console.log(document.getElementById(`VDR${name}`), 'name')
            additionDragEvent(document.getElementById(`VDR${name}`), {
              down: (e) => {
                downX = e.pageX
                downY = e.pageY
              },
              move: () => {
              },
              over: (e) => {
                //误差触发
                console.log('downX', e, downX)
                if (Math.abs(downX - e.pageX) > 10 || Math.abs(downY - e.pageY) > 10) {
                  console.log('dragover', this.a.getOffset(), e)
                  this.a.updateNode(name,
                      {
                        x: e.pageX - this.a.getOffset().left < 0 ? 0 : e.pageX - this.scene.getOffset().left,
                        y: e.pageY - this.a.getOffset().top < 0 ? 0 : e.pageY - this.scene.getOffset().top,
                        a: 2,
                        w: 100,
                        h: 100,
                        z: 100
                      })
                }
              }
            })
          }, 0)
          //3:绘制视图
          this.nodes = this.scene.getAll()
          console.log(this.scene.getAll(), 'new Container().getAll()start')
        }
      })
      // event(document.getElementById('A'), document.getElementById('B'))
    }
  }
}
</script>

<style scoped>

</style>
