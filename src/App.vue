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
  <div id="c" style="width: 1000px;background: #5d6d5d;height: 1000px;position: absolute;left: 200px">
    <div @click="()=>noFeeze=!noFeeze">change</div>
    <div @click="undosA">undosA</div>
    <div id='A' style="width: 10px;height: 10px;background: red"></div>
    <div id='B' style="width: 10px;height: 10px;background: greenyellow"></div>
    <div v-for="(k,key) in Object.values(nodes)" :key="key">
      <VueDragResize
          :id="`VDR${k.key}`"
          v-if="noFeeze"
          :ref="`VDR${k.key}`"
          :z="k.body.value.z"
          :parentH="1000"
          :parentW="1000"
          :parentLimitation="true"
      >
        <component
            :is="a.capture(k.body.value.type)"
            :keys="k.key"
        ></component>
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

/**
 * undo [x]
 * drag [x]
 * componentMap [x]
 */
// import fragment from "@/ADrag4/view/fragment";
// import provider from "@/ADrag4/view/provider";
import drag from '@/component/d'
// import o from '@/component/o'
// import f from '@/component/p'
import {data} from "@/ADrag4/model/requestModel";
import {config} from "@/ADrag4/config/config";
import {Container} from "@/ADrag6/publicProvider/container";
// import {buildEvent} from "@/ADrag6/service/modify";
import VueDragResize from "vue-drag-resize";
import {additionDragEvent} from "@/ADrag6/service/modify";

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
      noFeeze: true,
      a: null,
      // aider: false,
      // components: [drag, o, f],
    };
  },
  mounted() {
    //0:定义容器
    this.a = new Container("c")
    //1:定义组件与名称映射
    this.a.templateMap({
      'normalComponent': drag
    })
    //2:拖拽事件
    const event = this.a.decorate({
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
          const right = 1000 - e.pageX + this.a.getOffset().left - 100;
          const bottom = 1000 - e.pageY + this.a.getOffset().top - 100;
          if (this.$refs[`VDR${name}`][0]) {
            this.$refs[`VDR${name}`][0].left = e.pageX - this.a.getOffset().left;
            this.$refs[`VDR${name}`][0].top = e.pageY - this.a.getOffset().top;
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
                      x: e.pageX - this.a.getOffset().left,
                      y: e.pageY - this.a.getOffset().top,
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
        this.nodes = this.a.getAll()
        console.log(this.a.getAll(), 'new Container().getAll()start')
      }
    })
    console.log(event, 'eee')
    //4:确认起源与拖拽元素
    event(document.getElementById('A'), document.getElementById('B'))
  },
  methods: {
    undosA() {
      console.log(this.a.getCommandHistory(), 'this.a.getCommandHistory()')
      //console.log(this.a.backToPreviousStep(),'this.a.backToPreviousStep()')
      this.nodes = this.a.backToPreviousStep()
      //返回上一步
      Object.values(this.nodes).map(i => {
        const right = 1000 - i.body.value.x - i.body.value.w;
        const bottom = 1000 - i.body.value.y - i.body.value.h;
        if (this.$refs[`VDR${i.key}`][0]) {
          this.$refs[`VDR${i.key}`][0].left = i.body.value.x;
          this.$refs[`VDR${i.key}`][0].top = i.body.value.y
          this.$refs[`VDR${i.key}`][0].right = right;
          this.$refs[`VDR${i.key}`][0].bottom = bottom;
        }
      })
      console.log(this.nodes, 'nodes')
    },
    drager(nodeName, params) {
      console.log(params, nodeName, 'params')
      const {left: x, top: y, height: h, width: w} = params;
      this.a.updateNode(nodeName,
          {
            x,
            y,
            a: 2,
            w,
            h,
            z: 100
          })
      // //不要立即同步，只有保存的时候同步
      // //！！！！！ this.nodes = this.a.getAll()
      // console.log(this.a.getAll(), 'new Container().getAll()endd')

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
