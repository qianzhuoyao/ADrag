<template>
  <div>
    <VueDragResize
        v-for="(k,i) in renderData"
        :key="i"
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
      console.log('item', items)
      this.renderData = items
    },
  }
}
</script>

<style scoped>

</style>
