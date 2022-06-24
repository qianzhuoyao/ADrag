<template>
  <div>o</div>
</template>

<script>
export default {
  name: "view-c",
  props: {
    node: {
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