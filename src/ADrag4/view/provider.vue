<template>
  <div>
    <div @click="del">删除</div>
    <div v-for="(k,i) in renderData" :key="i" @click="()=>click(k)">
      <VueDragResize
          v-if="k.v"
          :x="k.x"
          :y="k.y"
          :w="k.w"
          :h="k.h"
          :z="k.z"
          :isActive="k.f"
          :parentH="2000"
          :parentW="2000"
          :parentLimitation="true"
      >
        <component
            :is="k.c"
        ></component>
      </VueDragResize>
    </div>

  </div>
</template>

<script>
import {Controller} from "@/ADrag4/controller/controller";
import {Render} from "@/ADrag4/render/render";
import VueDragResize from "vue-drag-resize";

export default {
  name: "a-provider",
  props: {
    tags: Array,
    default: () => ['a_default_fragment']
  },
  components: {VueDragResize},
  data: () => {
    return {
      renderData: [],
      render: null,
      controller: null
    }
  },
  mounted() {
    //注册控制器
    this.controller = new Controller()
    this.render = new Render()
    this.render.watch(this.update)
    this.controller.setTags(this.tags)
  },
  methods: {
    update(items) {
      this.renderData = items
    },
    click(item) {
      console.log(item, 'cick')
      this.controller.updateForChange((i) => {
        return {...i, f: i.id === item.id}
      }, {tag: item.tag})
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

</style>
