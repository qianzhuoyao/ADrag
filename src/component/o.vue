<template>
  <div style="background: aquamarine;height: 100%;">{{thisData.id}}+0</div>
</template>

<script>
export default {
  name: "view-c",
  props: {
    thisData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.thisData.firstMounted && console.log(this.thisData, "updatae");
  },
};
</script>

<style scoped>
</style>
