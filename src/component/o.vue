<template>
  <div style="background: aquamarine;height: 100%;">{{thisData.id}}+{{s}}</div>
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
  data:()=>{
    return{
      s:'success'
    }
  },
  mounted() {
    this.s = this.thisData.id
    //this.thisData.firstMounted && console.log(this.thisData, "updatae");
  },
};
</script>

<style scoped>
</style>
