<template>
  <ul>
    <li @click="log1">
      <a>Option 1</a>
    </li>
    <li>
      <a>Option 2</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "view-c",
  props: {
    updateView: {
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
  data: () => {
    return {
      ns: {},
    };
  },
  watch: {
    thisData: {
      handler(n) {
        console.log(n, 'nnn')
      }, deep: true,
      immediate: true
    }
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
  },
  methods: {
    log1() {
      console.log(this.updateView,'updateView')
      this.updateView(()=>{
        console.log('123')
      },this.thisData.tag)
      console.log(1)
    }
  }
};
</script>

<style scoped>
</style>
