<template>
  <div>p</div>
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
  data: () => {
    return {
      ns: {},
    };
  },
  watch: {
    // node: {
    //   handler(n) {
    //     this.ns = n;
    //     console.log(n, "view");
    //     setTimeout(() => {
    //      this.$emit('finished',n.instance.tag)
    //     }, 2000);
    //   },
    //   immediate:true,
    //   deep:true
    // },
  },
  mounted() {
     setTimeout(() => {
         this.$emit('finished',this.node.instance.tag)
        }, 2000);
  },
};
</script>

<style scoped>
</style>