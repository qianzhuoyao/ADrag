<template>
  <div>
    <fragment tag="1" display="123" hide="456" :put-component="components[0]">
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
    <provider :tags="['1']">
    </provider>
  </div>
</template>

<script>
import fragment from "@/ADrag4/view/fragment";
import provider from "@/ADrag4/view/provider";
import drag from '@/component/d'
import o from '@/component/o'

export default {
  name: "App",
  components: {fragment, provider},
  data: () => {
    return {
      components: [drag, o],
      list: [],
      view: [],
      dragOnHandle: true,
      render: {},
      templates: [],
      node: {},
    };
  },
  methods: {},

};
</script>

<style>
</style>
