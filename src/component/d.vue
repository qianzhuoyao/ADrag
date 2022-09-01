<template>
  <div>{{ thisData.renderData.text || 'drag' }}</div>
</template>

<script>
export default {
  name: "view-c",
  props: {
    updateData: {
      type: Function,
      default: new Function('')
    },
    thisData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    console.log(this.node, "view");
  },
};
</script>

<style scoped>
</style>
