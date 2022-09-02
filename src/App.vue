<template>
  <div>
    <fragment
        tag="1"
        render-key="123"
        :put-component="components[0]"
        :modal-component="components[2]"
        :default-component-height="100"
        :default-component-width="100"
        :default-component-z-index="999">
      <template #display>
        <div>123</div>
      </template>
      <template #hide>
        <div>345</div>
      </template>
    </fragment>
    <fragment tag="1" render-key="456" :put-component="components[1]">
      <template #display>
        <div>1123</div>
      </template>
      <template #hide>
        <div>1345</div>
      </template>
    </fragment>
    <provider ref="provider" :tags="['1']" style="background: antiquewhite">
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
      components: [drag, o, f],
    };
  },
  mounted() {
    this.beforeStart()
    this.$refs.provider.on('click', (o) => {
      console.log(o, 'click')
    })
  },
  methods: {
    beforeStart() {
      const {nameMap} = config
      data.map(i => {
        this.$refs.provider.drawEach({
          c: nameMap[i.cMap],
          m: nameMap[i.mMap],
          tag: i.tag,
          x: i.x,
          y: i.y,
          w: i.w,
          h: i.h,
          z: i.z,
        })
      })
    }
  },

};
</script>

<style>
</style>
