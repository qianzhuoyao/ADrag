<template>
  <div @click="cc">
    <input ref="areatext"
           v-model="v"
           :style="{fontSize:Math.min(thisData.w,thisData.h)*0.5+'px',width:thisData.w+'px',height:thisData.h+'px',outline:'none',border:'none',background:'antiquewhite'}"/>
  </div>
</template>

<script>
export default {
  name: "view-i",
  props: {
    thisData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data: () => {
    return {
      s: 'success',
      v:'A节点'
    }
  },
  mounted() {
    this.s = this.thisData.id
    //this.thisData.firstMounted && console.log(this.thisData, "updatae");
  },
  methods: {
    cc() {
      console.log('cc')
      this.$refs.areatext.focus()
    }
  }
};
</script>

<style scoped>
</style>
