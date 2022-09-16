<template>
  <div :style="{width:thisData.w+'px',height:thisData.h+'px'}" @click="cc">
    <textarea ref="areatext"
              v-model="v"
              :style="{fontSize:Math.min(thisData.w,thisData.h)*0.5+'px',width:thisData.w+'px',height:thisData.h+'px',outline:'none',border:'none',background:'antiquewhite'}"/>

  </div>
</template>

<script>
export default {
  name: "view-t",
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
      v:'多行文字'
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
