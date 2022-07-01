<template>
  <!--    <svg height="210" width="500">-->
  <!--      <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2"/>-->
  <!--    </svg>-->
  <div>
    <div @click="unDo">
      unDo
    </div>
    <div style="position: absolute;width: 1000px;height: 1000px;background: #42b983">
      <div v-for="i in templates" :key="`origin${i.tag}`" :id="`origin${i.tag}`">
        <component :is="i.originComponent"></component>
      </div>
      <div v-for="i in templates" :key="`drag${i.tag}`" :id="`drag${i.tag}`">
        <component :is="i.dragComponent"></component>
      </div>
      <VueDragResize
          :ref="`${k.view.tag}ref`"
          v-for="(k) in view"
          :key="k.view.tag"
          :x="k.view.x"
          :y="k.view.y"
          :w="k.view.width"
          :h="k.view.height"
          :z="k.view.ZIndex"
          :isActive="k.view.focus"
          :parentH="2000"
          :parentW="2000"
          :parentLimitation="true"
          @dragging="(p)=>dragging(p,k.view.tag)"
          @dragstop="()=>dragstop()"
          @resizing="(p)=>resizing(p,k.view.tag)"
          @resizestop="()=>resizestop()"
      >
        {{ k.view.x }}
        {{ k.view.y }}
        {{ k.view.width }}
        {{ k.view.height }}
        <component
            v-if="k.view.visible"
            :is="k.instance.renderComponent"
            :node="k"
        >
        </component>
      </VueDragResize>
    </div>
  </div>
</template>

<script>
import Render from "./ADrag3/render/render";
import VueDragResize from "vue-drag-resize";

import {PipeEvent} from "@/ADrag3/hook/event";

export default {
  name: "App",
  data: () => {
    return {
      list: [],
      view: [],
      dragOnHandle: true,
      render: {},
      templates: [],
      node: {},
    };
  },
  components: {VueDragResize},
  methods: {
    // findInstanceByViewTag(viewTag){
    //   return this.view
    // },
    unDo() {
      this.dragOnHandle = false
      this.render.unDo().then((preStep) => {
        console.log(preStep, 'preStep')
        if (preStep) {
          this.render.updateElement(preStep.instance.tag, (instance) => {
            console.log(preStep.view, 'willrender')
            instance.setPosition({
              x: preStep.view.x,
              y: preStep.view.y
            })
            instance.setSize({
              w: preStep.view.width,
              h: preStep.view.height
            })
          }).then(() => {
            this.view = this.render.getNodes()
            //vueDragResize更新异常,遍历更新节点
            this.view.forEach(i => {
              console.log(this.$refs[`${i.view.tag}ref`][0], this.view, 'render')
              this.$refs[`${i.view.tag}ref`][0].left = i.view.x
              this.$refs[`${i.view.tag}ref`][0].top = i.view.y
            })
          })
        } else {
          this.view = []
        }
      })
    },
    dragstop() {
      this.render.shot();
      this.dragOnHandle = true;
    },
    resizestop() {
      this.render.shot();
      this.dragOnHandle = true;
    },
    resizing(position, tag) {
      if (this.dragOnHandle) {
        const {width: w, height: h} = position
        this.render.updateElement(tag, (instance) => {
          instance.setSize({
            w,
            h
          })
        }).then(() => {
          this.view = this.render.getNodes()
        })
      }
    },
    dragging(position, tag) {
      if (this.dragOnHandle) {
        const {left: x, top: y} = position
        console.log(this.view, tag, position, 'drag')
        this.render.updateElement(tag, (instance) => {
          instance.setPosition({
            x,
            y
          })
        }).then(() => {
          this.view = this.render.getNodes()
        })
      }
    },
    finished(tag) {
      console.log(tag, "finished");
      this.tems.finished(tag);
    },
  },
  mounted() {
    this.render = new Render();
    this.templates = this.render.start();
    console.log(this.templates, " this.templates ");
    setTimeout(() => {
      this.templates.forEach((i) => {
        console.log(i, "iii");
        new PipeEvent()
            .setDragElement(`drag${i.tag}`)
            .setCopyElement(`origin${i.tag}`)
            .dragElementHide()
            .pipeEventStart({
              downCallback: () => {
              },
              moveCallback: (pipe) => {
                pipe.dragElementShow();
              },
              overCallback: (pipeOver, e) => {
                pipeOver.dragElementHide();
                this.render.create(i, this.view.length + 1).then(tem => {
                  console.log(tem, 'tem')
                  tem.setPosition({
                    x: e.x,
                    y: e.y
                  })
                  tem.setSize({
                    w: 100,
                    h: 100
                  })
                  tem.setZIndex(999)
                }).then(() => {
                  //打个快照
                  this.render.shot()
                  this.view = this.render.getNodes()
                  console.log(this.view, "viwew");
                })
              },
            });
      });
    }, 0);
  },
};
</script>

<style>
</style>
