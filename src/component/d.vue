<template>
  <div >{{ keys }}</div>
</template>

<script>


export default {
  name: "view-c",
  props:{
    keys:{
      type:String,
      default:""
    }
  },
  data: () => {
    return {
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
</style>
