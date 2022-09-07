<template>
  <div>
    <div @click="aiderComputed">aider开启</div>
    <div @click="aiderClear">aider关闭</div>
    <div @click="undo">undo</div>
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
    <provider ref="provider" :tags="['1']" style="background: antiquewhite;top:100px">
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
    // this.beforeStart()
    this.$refs.provider.on('componentClick', (o) => {
      console.log(o, 'componentClick')
    })
  },
  methods: {
    undo() {
      this.$refs.provider.undo()
      if (this.aider) {
        this.$refs.provider.openAider()
        this.$refs.provider.aiderComputed()
      } else {
        this.$refs.provider.closeAider()
        this.$refs.provider.clearAider()
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
    beforeStart() {
      const {nameMap} = config
      const draw = data.map(i => {
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
    }
  },

};
</script>

<style>
</style>
