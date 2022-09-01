<template>
  <div>
    <fragment
        tag="1"
        display="123"
        hide="456"
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
    <fragment tag="1" display="1123" hide="1456" :put-component="components[1]">
      <template #display>
        <div>1123</div>
      </template>
      <template #hide>
        <div>1345</div>
      </template>
    </fragment>
    <provider ref="provider" :tags="['1']" pid="pid" style="background: antiquewhite">
    </provider>
  </div>
</template>

<script>
import fragment from "@/ADrag4/view/fragment";
import provider from "@/ADrag4/view/provider";
import drag from '@/component/d'
import o from '@/component/o'
import f from '@/component/p'

export default {
  name: "App",
  components: {fragment, provider},
  data: () => {
    return {
      components: [drag, o, f],
      list: [],
      view: [],
      dragOnHandle: true,
      render: {},
      templates: [],
      node: {},
    };
  },
  mounted() {
    this.$refs.provider.on('click', (o) => {
      console.log(o, 'click')
    })
  },
  methods: {
  },

};
</script>

<style>
</style>
